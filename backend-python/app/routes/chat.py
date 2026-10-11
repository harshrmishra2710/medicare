
"""
MindCare AI — Chat Route (POST /api/chat)
Direct port of backend/routes/chat.js
Gemini multi-model fallback → OpenAI fallback → local smart response engine.
"""

from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional, List
import httpx

from ..config import settings
from ..services.crisis_detector import check_crisis
from ..services.smart_response_engine import generate_smart_response

router = APIRouter(prefix="/api/chat", tags=["Chat"])

# ── System Prompt ────────────────────────────────────────────────
SYSTEM_PROMPT = """You are MindCare AI, a compassionate, evidence-informed mental health companion for students and young adults.

## Your Core Personality
- Warm, empathetic, and non-judgmental. Always validate feelings before offering advice.
- Speak like a caring counselor friend — clear, gentle, and encouraging.
- Never minimize what the user is feeling. Never rush them.

## Response Format Rules (ALWAYS follow these)
1. **Start with empathy**: Acknowledge and validate the user's feeling in 1-2 sentences before anything else.
2. **Use numbered lists for steps/tips**: When giving advice, ALWAYS format it as a numbered list (1. 2. 3.) with at most 3 items.
3. **Bold key words**: Use **bold** for technique names, action items, and important reminders.
4. **Keep it concise**: Maximum 3 short paragraphs total. Each numbered list item must be ONE sentence only — no multi-sentence explanations per item. Never write walls of text.
5. **End with a question or gentle encouragement**: Close every response with either a warm check-in question or an encouraging sentence.
6. **Always finish your response completely** — never leave a sentence, list item, or thought incomplete.

## Rules You Must Never Break
- NEVER diagnose any medical or psychiatric condition.
- NEVER prescribe or recommend medication.
- NEVER invent or fabricate crisis helpline numbers. If the user needs a crisis resource, tell them to visit the Helplines & Resources page.
- NEVER claim to be a human or a licensed therapist.
- ALWAYS remind the user you are an AI support tool if they appear to be in serious distress.
- If the user greets you or asks who you are, introduce yourself warmly and ask how they are feeling today.

## Coping Techniques You Know Well
- **Box Breathing**: Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4. Repeat 4 times.
- **5-4-3-2-1 Grounding**: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.
- **Progressive Muscle Relaxation (PMR)**: Tense a muscle group for 5 seconds, then fully release.
- **Pomodoro for Stress**: 25 min focused work + 5 min real break, repeat.
- **Thought Challenging**: "Is this thought a fact or a fear? What would I say to a friend who thought this?"

## What You Can Refer Users To
- The **Mood Tracker** (in the app) to log feelings
- The **Personal Coping Toolkit** (in the app) for guided exercises
- The **Helplines & Resources page** (in the app) for professional support numbers — ONLY refer to this, never invent numbers yourself"""

# ── Verified Gemini model candidates (dynamically prioritized) ─────
def get_gemini_candidates() -> list:
    configured = settings.gemini_model
    candidates = [{"version": "v1beta", "model": configured}]
    fallbacks = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
    for m in fallbacks:
        if m != configured:
            candidates.append({"version": "v1beta", "model": m})
    return candidates


# ── Request schema ────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


# ── Build Gemini contents array from conversation history ─────────
def build_contents(history: list, new_user_message: str) -> list:
    contents = []
    # Include up to last 20 messages for context
    recent = (history or [])[-20:]
    for msg in recent:
        if not msg or not msg.text or not msg.text.strip():
            continue
        role = "user" if msg.role == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg.text.strip()}]})
    contents.append({"role": "user", "parts": [{"text": new_user_message}]})
    return contents


# ── Call Google Gemini via REST (no SDK) ─────────────────────────
async def call_gemini(api_key: str, history: list, user_message: str) -> str:
    contents = build_contents(history, user_message)

    body = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {
            "temperature": 0.75,
            "maxOutputTokens": 1024,
            "topP": 0.95,
        },
    }

    candidates = get_gemini_candidates()
    async with httpx.AsyncClient(timeout=30.0) as client:
        for candidate in candidates:
            version = candidate["version"]
            model = candidate["model"]
            url = f"https://generativelanguage.googleapis.com/{version}/models/{model}:generateContent?key={api_key}"
            print(f"🤖 [Gemini] Trying {version}/{model}...")

            try:
                response = await client.post(url, json=body)
                data = response.json()

                if response.status_code != 200:
                    msg = data.get("error", {}).get("message", "Unknown error")
                    print(f"⚠️  [Gemini] {version}/{model} → HTTP {response.status_code}: {msg}")
                    continue

                text = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )
                if text and text.strip():
                    print(f"✅ [Gemini] Success with {version}/{model}")
                    return text.strip()
                print(f"⚠️  [Gemini] {version}/{model} returned empty text.")
            except Exception as e:
                print(f"⚠️  [Gemini] {version}/{model} fetch error: {e}")

    raise Exception("All Gemini model variants failed. Check API key permissions.")


# ── Main AI dispatcher ───────────────────────────────────────────
async def get_ai_reply(trimmed_msg: str, history: list) -> dict:
    gemini_key = settings.gemini_key
    print(f"🔑 [Chat] GEMINI_API_KEY present: {'YES (length ' + str(len(gemini_key)) + ')' if gemini_key else 'NO'}")

    # 1. Try Google Gemini
    if gemini_key and gemini_key != "your_google_api_key_here":
        try:
            reply = await call_gemini(gemini_key, history, trimmed_msg)
            return {"reply": reply, "source": "gemini"}
        except Exception as err:
            print(f"❌ [Gemini] Failed: {err}")
    else:
        print("⚠️  [Gemini] No valid GEMINI_API_KEY found in .env — skipping Gemini.")

    # 2. Try OpenAI (only if it has a real sk-... key)
    openai_key = (settings.OPENAI_API_KEY or "").strip()
    if openai_key.startswith("sk-"):
        try:
            # Build OpenAI messages
            oai_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            recent = (history or [])[-20:]
            for msg in recent:
                if not msg or not msg.text:
                    continue
                oai_messages.append({
                    "role": "user" if msg.role == "user" else "assistant",
                    "content": msg.text.strip(),
                })
            oai_messages.append({"role": "user", "content": trimmed_msg})

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {openai_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": oai_messages,
                        "temperature": 0.75,
                        "max_tokens": 500,
                    },
                )
                data = response.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if text and text.strip():
                    print("✅ [OpenAI] Got reply successfully.")
                    return {"reply": text.strip(), "source": "openai"}
        except Exception as err:
            print(f"❌ [OpenAI] Failed: {err}")

    # 3. Smart local fallback
    print("⚠️  [Chat] Falling back to local smart response engine.")
    return {"reply": generate_smart_response(trimmed_msg), "source": "local"}


# ── POST /api/chat ────────────────────────────────────────────────
@router.post("/")
async def chat_endpoint(req: ChatRequest):
    try:
        if not req.message or not req.message.strip():
            return {"success": False, "error": "Please provide a valid message."}

        trimmed_msg = req.message.strip()
        print(f'\n💬 [Chat] Received message: "{trimmed_msg[:60]}..."')
        print(f"📜 [Chat] History messages provided: {len(req.history) if req.history else 0}")

        # 1. Crisis check first
        crisis_result = check_crisis(trimmed_msg)
        if crisis_result["isCrisis"]:
            print("🚨 [Chat] Crisis keyword detected — returning emergency response.")
            return {"success": True, "isCrisis": True, "reply": crisis_result["message"]}

        # 2. Get AI reply (with conversation history)
        result = await get_ai_reply(trimmed_msg, req.history or [])
        print(f"📤 [Chat] Responding with source: {result['source']}\n")

        return {
            "success": True,
            "isCrisis": False,
            "isFallback": result["source"] == "local",
            "source": result["source"],
            "reply": result["reply"],
        }

    except Exception as error:
        print(f"💥 [Chat] Unhandled error: {error}")
        fallback_reply = generate_smart_response(req.message or "")
        return {
            "success": True,
            "isCrisis": False,
            "isFallback": True,
            "source": "local",
            "reply": fallback_reply,
        }

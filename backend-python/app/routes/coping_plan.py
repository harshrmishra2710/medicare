"""
MindCare AI — Coping Plan Route (POST /api/coping-plan)
Direct port of backend/routes/copingPlan.js
Gemini AI generator with intelligent local coping plan fallback.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import httpx

from ..config import settings
from ..services.crisis_detector import check_crisis

router = APIRouter(prefix="/api/coping-plan", tags=["Coping Plan"])


def get_gemini_candidates() -> list:
    configured = settings.gemini_model
    candidates = [{"version": "v1beta", "model": configured}]
    fallbacks = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
    for m in fallbacks:
        if m != configured:
            candidates.append({"version": "v1beta", "model": m})
    return candidates


class CopingPlanRequest(BaseModel):
    situation: str
    timeMinutes: int
    mood: Optional[str] = "Not specified"


def build_coping_prompt(situation: str, time_minutes: int, mood: str) -> str:
    mood_line = f"\nCurrent mood: {mood}" if mood and mood != "Not specified" else ""

    return f"""You are MindCare AI, a compassionate, evidence-informed mental health companion.

A user has shared their current situation and needs a personalized coping plan.

User's situation: "{situation}"
Available time: {time_minutes} minutes{mood_line}

Please provide a personalized coping plan with exactly 2–3 practical activities. Format your response as follows:

---
## 🌿 Your Personalized Coping Plan

For each activity, use this exact structure:

### Activity [Number]: [Activity Name]
**⏱️ Duration:** [X minutes]
**Why this helps:** [1–2 sentences explaining the psychological benefit for their specific situation]
**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
[add more steps if needed]

---

Important guidelines:
- Tailor each activity specifically to what the user described — do not give generic advice
- Keep total combined duration within the user's available {time_minutes} minutes
- Be warm, non-judgmental, and encouraging
- Do NOT diagnose any condition or recommend medication
- Do NOT invent or fabricate any helpline numbers
- Do NOT claim to replace professional mental health support
- If the situation sounds serious, gently remind them that professional support is always available via the Helplines & Resources page in the app
- End with a brief, warm closing sentence (1 line)"""


def generate_fallback_coping_plan(situation: str, time_minutes: int, mood: str) -> str:
    """Intelligent offline fallback coping plan matching the exact structure."""
    snippet = situation[:45] + ("..." if len(situation) > 45 else "")
    if time_minutes == 2:
        return f"""## 🌿 Your Quick Reset Coping Plan

### Activity 1: Box Breathing Reset
**⏱️ Duration:** 1 minute
**Why this helps:** Slow, rhythmic breathing calms your sympathetic nervous system and rapidly lowers physical tension.
**Steps:**
1. Inhale slowly through your nose for a count of 4.
2. Hold your breath gently for a count of 4.
3. Exhale smoothly through your mouth for a count of 4.
4. Pause for a count of 4 before repeating 3 times.

### Activity 2: 5-Sense Grounding Pulse
**⏱️ Duration:** 1 minute
**Why this helps:** Anchors your active thoughts into your physical environment and interrupts racing thoughts regarding "{snippet}".
**Steps:**
1. Spot 3 distinct colors in your immediate surroundings.
2. Touch 2 different textures (your clothes, desk, or a phone case).
3. Take one full, conscious breath and relax your shoulders.

Remember, you are safe in this moment and you can handle this one breath at a time. 💙"""
    elif time_minutes == 5:
        return f"""## 🌿 Your 5-Minute Relief Coping Plan

### Activity 1: Physiological Sigh & Progressive Release
**⏱️ Duration:** 2 minutes
**Why this helps:** A double-inhale followed by an extended sigh rapidly normalizes heart rate and disperses acute tension.
**Steps:**
1. Take two quick inhales through your nose: one deep breath, then a sharp top-off inhale.
2. Release with a long, slow sigh through your mouth.
3. Gently drop your shoulders down and unclench your jaw.
4. Repeat 4 to 5 times at your own natural pace.

### Activity 2: Micro-Journaling Clarity
**⏱️ Duration:** 3 minutes
**Why this helps:** Externalizes cognitive load regarding "{snippet}" into actionable clarity.
**Steps:**
1. Write down the single most urgent thought currently occupying your mind.
2. Ask yourself: "Can I take one small 2-minute action on this today, or does it need to rest until tomorrow?"
3. Write down one comforting truth: "I am doing the best I can right now."

Take things one gentle step at a time. You've got this! 🌟"""
    else:  # 10 minutes
        return f"""## 🌿 Your 10-Minute Mindful Reset Plan

### Activity 1: Guided Grounding & Body Scan
**⏱️ Duration:** 4 minutes
**Why this helps:** Releases somatic tension stored across muscle groups due to stressful situations like what you shared.
**Steps:**
1. Sit comfortably with your feet flat on the floor and close your eyes or soften your gaze.
2. Scan your body starting from your forehead, releasing tension in your eyes, jaw, and neck.
3. Notice your chest rising and falling with natural, unhurried breaths.
4. Let your hands rest loosely on your lap and feel the stability beneath you.

### Activity 2: Thought Reframing Exercise
**⏱️ Duration:** 4 minutes
**Why this helps:** Challenges catastrophic or anxious thoughts regarding "{snippet}" by identifying realistic facts.
**Steps:**
1. State the worry clearly: what is your mind telling you might happen?
2. Ask: "Is this an absolute fact right now, or an emotional fear?"
3. Write down what you would tell a dear friend facing this exact same situation.

### Activity 3: Gentle Intention Setting
**⏱️ Duration:** 2 minutes
**Why this helps:** Restores psychological agency and provides a calm focal point for the rest of your day.
**Steps:**
1. Choose one calming word for the next hour (e.g., "Patience", "Calm", "Focus").
2. Drink a glass of water mindfully before continuing your tasks.

You are showing wonderful self-care by taking this time for yourself. 🌿"""


async def call_gemini_for_plan(api_key: str, prompt: str) -> str:
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 1500,
            "topP": 0.95,
        },
    }

    candidates = get_gemini_candidates()
    async with httpx.AsyncClient(timeout=30.0) as client:
        for candidate in candidates:
            version = candidate["version"]
            model = candidate["model"]
            url = f"https://generativelanguage.googleapis.com/{version}/models/{model}:generateContent?key={api_key}"
            print(f"🤖 [CopingPlan] Trying {version}/{model}...")

            try:
                response = await client.post(url, json=body)
                data = response.json()

                if response.status_code != 200:
                    msg = data.get("error", {}).get("message", "Unknown error")
                    print(f"⚠️  [CopingPlan] {version}/{model} → HTTP {response.status_code}: {msg}")
                    continue

                text = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )
                if text and text.strip():
                    print(f"✅ [CopingPlan] Success with {version}/{model}")
                    return text.strip()
                print(f"⚠️  [CopingPlan] {version}/{model} returned empty text.")
            except Exception as e:
                print(f"⚠️  [CopingPlan] {version}/{model} fetch error: {e}")

    raise Exception("All Gemini model variants failed. Check API key permissions.")


@router.post("/")
async def generate_coping_plan(req: CopingPlanRequest):
    try:
        # Input Validation
        if not req.situation or len(req.situation.strip()) < 10:
            return {
                "success": False,
                "error": "Please describe your situation in at least 10 characters so we can personalize your plan.",
            }

        valid_times = [2, 5, 10]
        if req.timeMinutes not in valid_times:
            return {
                "success": False,
                "error": "Please select a valid time option: 2, 5, or 10 minutes.",
            }

        trimmed_situation = req.situation.strip()
        sanitized_mood = req.mood.strip() if req.mood and isinstance(req.mood, str) else "Not specified"

        print(f"\n🧘 [CopingPlan] Received request — time: {req.timeMinutes} min, mood: {sanitized_mood}")
        print(f'📝 [CopingPlan] Situation: "{trimmed_situation[:80]}..."')

        # Crisis Check
        crisis_result = check_crisis(trimmed_situation)
        if crisis_result["isCrisis"]:
            print("🚨 [CopingPlan] Crisis keyword detected — returning emergency response.")
            return {"success": True, "isCrisis": True, "plan": crisis_result["message"]}

        # Load API Key
        gemini_key = settings.gemini_key
        plan = None
        source = "gemini"

        if gemini_key and gemini_key != "your_google_api_key_here":
            try:
                prompt = build_coping_prompt(trimmed_situation, req.timeMinutes, sanitized_mood)
                plan = await call_gemini_for_plan(gemini_key, prompt)
                print(f"📤 [CopingPlan] Plan generated via Gemini ({len(plan)} chars)\n")
            except Exception as gemini_err:
                print(f"⚠️  [CopingPlan] Gemini generation failed: {gemini_err}. Using smart fallback.")
                plan = generate_fallback_coping_plan(trimmed_situation, req.timeMinutes, sanitized_mood)
                source = "local"
        else:
            print("⚠️  [CopingPlan] No valid GEMINI_API_KEY found — using fallback.")
            plan = generate_fallback_coping_plan(trimmed_situation, req.timeMinutes, sanitized_mood)
            source = "local"

        return {
            "success": True,
            "isCrisis": False,
            "plan": plan,
            "source": source,
            "meta": {
                "timeMinutes": req.timeMinutes,
                "mood": sanitized_mood,
            },
        }

    except Exception as error:
        print(f"💥 [CopingPlan] Unhandled error: {error}")
        fallback_plan = generate_fallback_coping_plan(req.situation or "", req.timeMinutes or 5, req.mood or "Not specified")
        return {
            "success": True,
            "isCrisis": False,
            "plan": fallback_plan,
            "source": "local",
            "meta": {
                "timeMinutes": req.timeMinutes or 5,
                "mood": req.mood or "Not specified",
            },
        }

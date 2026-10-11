"""
MindCare AI — Backend Unit & Integration Tests
Validates logic, models, seed data, routes, and FastAPI configuration.
"""

import sys
from pathlib import Path

# Add backend-python to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

passed_tests = 0
failed_tests = 0


def test(name, condition, details=""):
    global passed_tests, failed_tests
    if condition:
        print(f"  ✅ PASS: {name}")
        passed_tests += 1
    else:
        print(f"  ❌ FAIL: {name} - {details}")
        failed_tests += 1


def run_all_tests():
    print("\n" + "=" * 60)
    print("🧪 MindCare AI Backend Test Suite")
    print("=" * 60)

    # ── Test 1: Crisis Detector ───────────────────────────────────────
    print("\n[1] Testing Crisis Detector...")
    from app.services.crisis_detector import check_crisis

    c1 = check_crisis("I want to commit suicide")
    test("Crisis detected: suicide", c1["isCrisis"] is True and "988" in c1["message"])

    c2 = check_crisis("I feel like killing myself tonight")
    test("Crisis detected: kill myself", c2["isCrisis"] is True)

    c3 = check_crisis("I want to self harm and cut myself")
    test("Crisis detected: self harm / cut", c3["isCrisis"] is True)

    c4 = check_crisis("I want to end my life")
    test("Crisis detected: end my life", c4["isCrisis"] is True)

    c5 = check_crisis("I'm feeling a bit tired after studying")
    test("Non-crisis passed cleanly", c5["isCrisis"] is False)

    c6 = check_crisis("")
    test("Empty string handled safely", c6["isCrisis"] is False)

    # ── Test 2: Smart Response Engine ─────────────────────────────────
    print("\n[2] Testing Local Smart Response Engine...")
    from app.services.smart_response_engine import generate_smart_response

    r1 = generate_smart_response("Hello, who are you?")
    test("Greeting response generated", len(r1) > 20 and "MindCare" in r1)

    r2 = generate_smart_response("I have so much exam stress and anxiety")
    test("Stress response generated", len(r2) > 20)

    r3 = generate_smart_response("I cannot sleep at night, insomnia is bad")
    test("Sleep response generated", len(r3) > 20)

    r4 = generate_smart_response("Give me breathing exercises for panic")
    test("Breathing exercise response generated", len(r4) > 20)

    r5 = generate_smart_response("Where can I find helplines and phone numbers?")
    test("Helpline referral generated", len(r5) > 20)

    r6 = generate_smart_response("Some random arbitrary input here")
    test("Default fallback response generated", len(r6) > 20)

    # ── Test 3: Seed Data ─────────────────────────────────────────────
    print("\n[3] Testing Seed Datasets...")
    from app.data.seed_activities import activities_data
    from app.data.seed_resources import resources_data

    test("Activities seed count >= 9", len(activities_data) >= 9, f"Got {len(activities_data)}")
    test("Resources seed count >= 8", len(resources_data) >= 8, f"Got {len(resources_data)}")

    # Check structure of first activity
    a1 = activities_data[0]
    test("Activity has title, duration, category, steps",
         "title" in a1 and "durationMinutes" in a1 and "category" in a1 and "steps" in a1 and len(a1["steps"]) > 0)

    # Check structure of first resource
    res1 = resources_data[0]
    test("Resource has title, category, contact, region",
         "title" in res1 and "category" in res1 and "contact" in res1 and "region" in res1)

    # ── Test 4: Models & Schemas ──────────────────────────────────────
    print("\n[4] Testing Pydantic Schemas...")
    from app.models.mood import MoodCreate
    from app.routes.chat import ChatRequest, ChatMessage
    from app.routes.coping_plan import CopingPlanRequest

    mc = MoodCreate(mood="Calm", note="Feeling relaxed")
    test("MoodCreate valid", mc.mood == "Calm" and mc.note == "Feeling relaxed")

    chat_req = ChatRequest(
        message="Hello",
        history=[ChatMessage(role="user", text="Hi"), ChatMessage(role="bot", text="Hello!")]
    )
    test("ChatRequest valid with history", len(chat_req.history) == 2 and chat_req.message == "Hello")

    coping_req = CopingPlanRequest(situation="Feeling exam stress", timeMinutes=5, mood="Stressed")
    test("CopingPlanRequest valid", coping_req.timeMinutes == 5 and coping_req.mood == "Stressed")

    # ── Test 5: Configuration & Security ──────────────────────────────
    print("\n[5] Testing Configuration & Origins...")
    from app.config import settings
    test("mongodb_uri property exists and returns string", isinstance(settings.mongodb_uri, str) and len(settings.mongodb_uri) > 0)
    test("gemini_model configured", bool(settings.gemini_model))
    test("allowed_origins contains local dev ports", "http://localhost:3000" in settings.allowed_origins and "http://localhost:5173" in settings.allowed_origins)

    from app.routes.coping_plan import generate_fallback_coping_plan
    plan_fb = generate_fallback_coping_plan("Exam anxiety", 5, "Anxious")
    test("Fallback coping plan generated with correct structure", "Activity" in plan_fb and "Duration" in plan_fb and "Steps" in plan_fb)

    # ── Test 6: FastAPI App & Routes ──────────────────────────────────
    print("\n[6] Testing FastAPI App Route Registration...")
    from app.main import app

    routes = list(app.openapi().get("paths", {}).keys())
    expected_paths = [
        "/",
        "/health",
        "/api/health",
        "/api/list-models",
        "/api/chat/",
        "/api/moods/",
        "/api/resources/",
        "/api/activities/",
        "/api/coping-plan/",
    ]

    for path in expected_paths:
        test(f"Route registered: {path}", path in routes, f"Not found in {routes}")

    # ── Final Summary ─────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print(f"🏁 Test Results: {passed_tests} PASSED, {failed_tests} FAILED")
    print("=" * 60 + "\n")

    return failed_tests == 0


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)

"""
MindCare AI — Rule-based Crisis Keyword Detector
Direct port of backend/utils/crisisDetector.js
"""

CRISIS_KEYWORDS = [
    "suicide", "suicidal", "kill myself", "killing myself", "end my life", "want to die",
    "die", "self harm", "self-harm", "cut myself", "no reason to live",
    "can't go on", "cant go on", "end it all", "hurt myself", "take my life",
]

CRISIS_MESSAGE = (
    "⚠️ **Emergency Support & Crisis Guidance**\n\n"
    "If you are experiencing severe distress or thinking about ending your life, "
    "please know that **you are not alone** and support is available right now. \n\n"
    "MindCare AI is an automated emotional support tool and "
    "**cannot replace professional crisis intervention**. "
    "Please reach out immediately to trained professionals who care and want to help:\n\n"
    "🇮🇳 **India Emergency Helplines:**\n"
    "- **Tele-MANAS (Govt of India):** 14416 or 1800-891-4416 (24/7 Toll-Free)\n"
    "- **KIRAN Mental Health Helpline:** 1800-599-0019 (24/7 Toll-Free)\n"
    "- **Vandrevala Foundation:** +91 9999 666 555 (24/7 Support)\n"
    "- **AASRA Helpline:** +91 98204 66726 (24/7)\n\n"
    "🌐 **International Helplines:**\n"
    "- **US / Canada:** Call or Text **988** (Suicide & Crisis Lifeline)\n"
    "- **UK:** Call **111** (NHS Mental Health) or **116 123** (Samaritans)\n"
    "- **International Emergency Services:** Please call your local emergency number "
    "(112 / 911 / 100) or visit the nearest hospital emergency room.\n\n"
    "Please reach out to a trusted loved one, doctor, or contact one of these "
    "verified numbers immediately."
)


def check_crisis(user_message: str) -> dict:
    """
    Check if a user message contains crisis keywords.
    Returns { "isCrisis": True/False, "message": str (if crisis) }
    """
    if not user_message or not isinstance(user_message, str):
        return {"isCrisis": False}

    normalized = user_message.lower()
    found = any(keyword in normalized for keyword in CRISIS_KEYWORDS)

    if found:
        return {"isCrisis": True, "message": CRISIS_MESSAGE}

    return {"isCrisis": False}

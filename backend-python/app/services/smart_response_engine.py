"""
MindCare AI — Smart Local Emotional Response Engine
Direct port of backend/utils/smartResponseEngine.js
Provides varied, empathetic, contextual responses as a reliable offline fallback.
"""

import random


def _pick(arr: list) -> str:
    """Pick a random item from a list."""
    return random.choice(arr)


def _matches(text: str, keywords: list) -> bool:
    """Check if any keyword is found in text."""
    return any(kw in text for kw in keywords)


def generate_smart_response(message: str) -> str:
    """
    Generate a contextual, empathetic local fallback response
    based on keyword matching against the user message.
    """
    if not message or not isinstance(message, str):
        return "I'm here to listen and support you. How are you feeling today? 💙"

    text = message.lower()

    # 1. Greetings
    if _matches(text, ["hello", "hi ", "hey", "good morning", "good evening", "who are you", "what are you"]):
        return _pick([
            "Hello there! 👋 I'm **MindCare AI**, your compassionate emotional support companion.\n\nI'm here to listen, help you navigate stress, guide you through calming exercises, and remind you that you're never alone. How are you feeling today?",
            "Hey! 💙 So glad you reached out. I'm **MindCare AI** — think of me as a safe, non-judgmental space to share what's on your mind.\n\nWhat would you like to talk about today?",
        ])

    # 2. Gratitude
    if _matches(text, ["thank", "thanks", "helpful", "appreciate"]):
        return _pick([
            "You're so welcome! 😊 That's exactly what I'm here for. Please feel free to come back anytime you need support.\n\nTake care of yourself today — you deserve it! 💙",
            "It's my pleasure to be here for you! 🌿 Remember, checking in with your feelings is a sign of real strength.\n\nAnytime you need to talk, I'm right here.",
        ])

    # 3. Exam / Academic Stress
    if _matches(text, ["exam", "test", "study", "marks", "college", "grade", "assignment", "project", "result", "fail", "failed", "viva", "class", "lecture", "deadline", "submission"]):
        return _pick([
            "I completely understand how overwhelming academic pressure can feel — you're not alone in this! 📚💙\n\nHere are 3 quick tips to help you right now:\n1. **Chunk it:** Focus on just ONE topic for 25 minutes, then take a real 5-minute break.\n2. **Breathe:** Shoulders tense? Roll them back, take a 4-second inhale, hold 2 seconds, exhale for 6.\n3. **Be kind to yourself:** A grade measures your recall on one day — not your intelligence or worth.\n\nYou've prepared more than you think. One step at a time. 🌟",
            "Exam stress is real and it's valid — your brain is working hard! 💪\n\nTry this right now: close your eyes, take 3 slow deep breaths, and remind yourself of **one thing you already know well** about your subject. Your brain stores more than your anxiety lets you believe.\n\nAlso try our **Personal Coping Toolkit** for a quick 2-minute reset before you get back to studying!",
            "Feeling the pressure before a deadline is something almost every student experiences. It doesn't mean you're failing — it means you care. 💙\n\nA gentle study strategy: write down the 3 most important things you need to cover today. Just 3. Everything else is a bonus. Your future self will thank you for starting small rather than freezing up.\n\nYou've got this! 🎯",
        ])

    # 4. Anxiety & Panic
    if _matches(text, ["anxious", "anxiety", "panic", "nervous", "scared", "overwhelmed", "worried", "worry", "fear", "afraid", "dread", "uneasy", "restless"]):
        return _pick([
            "I hear you — anxiety can feel really overwhelming. But right now, in this moment, you **are** safe. 🌿\n\nLet's try the **5-4-3-2-1 grounding technique** together:\n- 👀 Name **5 things** you can see around you\n- 🖐️ Touch **4 different textures** nearby\n- 👂 Listen for **3 distinct sounds**\n- 👃 Notice **2 scents**\n- 💨 Take **1 slow, deep breath**\n\nThis brings your brain out of \"panic mode\" and back to the present. You've got this. 💙",
            "Anxiety is your body's alarm system — it's trying to protect you, even when there's no real danger. That's exhausting. 😔\n\nHere's something that helps many people: breathe in for **4 counts**, hold for **4**, out for **4** — repeat 4 times. This is called **box breathing** and it physically calms your nervous system.\n\nYou're safe right now. One breath at a time. 🌸",
            "Feeling overwhelmed is tough, and I want you to know it's completely okay to feel this way sometimes. 💙\n\nTry placing one hand on your chest and one on your belly. Breathe slowly so your belly (not chest) rises. This deep breathing signals to your brain that you're safe.\n\nIf the feeling continues or gets very intense, please don't hesitate to reach out to a counselor — our **Helplines & Resources** page has verified support numbers.",
        ])

    # 5. Sleep & Fatigue
    if _matches(text, ["sleep", "tired", "insomnia", "exhausted", "rest", "cant sleep", "cannot sleep", "sleepy", "fatigue", "drained", "no energy"]):
        return _pick([
            "Sleep struggles are so frustrating — your body wants rest but your mind won't quiet down. 🌙\n\nTry this tonight:\n1. **Phone down** 30 minutes before bed — even just face-down helps.\n2. **Thought dump:** scribble any worries on paper before sleep. It tells your brain \"these are stored, you can let go.\"\n3. **4-6 breathing:** 4 counts in, 6 counts out — repeat until you drift.\n\nGive your mind permission to rest. Tomorrow is a fresh page. 😴",
            "Feeling drained when you know you need to study or work is one of the hardest feelings. 💙\n\nEven a **10-minute power nap** with eyes closed (alarm set so you don't oversleep) can restore enough alertness to continue. If that's not possible, splashing cold water on your face and doing 10 jumping jacks genuinely boosts energy for a short burst.\n\nYour body is doing its best — be patient with it.",
        ])

    # 6. Sadness & Loneliness
    if _matches(text, ["sad", "lonely", "alone", "cry", "crying", "depressed", "depression", "hurt", "hopeless", "worthless", "empty", "unhappy", "miss", "heartbroken", "broken"]):
        return _pick([
            "I'm really sorry you're feeling this way right now. Please know — your feelings are completely valid, and it takes real courage to acknowledge them. 💙\n\nBe very gentle with yourself today:\n- Make yourself a warm drink 🍵\n- Step outside for even 2 minutes of fresh air\n- You don't have to fix how you feel right now — just survive this hour\n\nYou are not alone. And if these feelings feel too heavy, our **Helplines page** has compassionate people who are ready to listen.",
            "Sadness can feel like a heavy blanket that won't lift — and that's okay to sit with for a moment. You don't have to rush past it. 💙\n\nSometimes the most caring thing you can do is give yourself permission to feel sad, without judging yourself for it.\n\nWhen you're ready, try our **Mood Tracker** to log this moment — sometimes putting words to feelings is the first small step toward feeling lighter.",
            "Loneliness is one of the hardest feelings to carry. Even in a room full of people, you can feel completely alone — and that's real and valid. 💙\n\nOne gentle step: reach out to one person today — a text, a voice note, even a meme. Connection doesn't need big conversations.\n\nI'm here with you right now. You matter more than you know. 🌸",
        ])

    # 7. Anger & Frustration
    if _matches(text, ["angry", "anger", "furious", "frustrated", "frustration", "annoyed", "irritated", "mad", "rage", "upset"]):
        return _pick([
            "Anger is a completely valid emotion — it's often a signal that something important to you isn't being respected. 💙\n\nBefore acting on it, try this: **slow exhale for 8 counts**. Anger spikes your adrenaline; a long exhale is like pressing the pause button on your nervous system.\n\nOnce you feel a little calmer, you'll be better placed to decide what to do next. What's going on?",
            "Feeling frustrated is exhausting — especially when things are outside your control. 😤\n\nTry the **STOP technique:**\n- **S**top what you're doing for 60 seconds\n- **T**ake a deep breath\n- **O**bserve what you're feeling without judgment\n- **P**roceed with more intention\n\nYou don't have to react right away. Give yourself the space to cool down first.",
        ])

    # 8. Stress (general)
    if _matches(text, ["stress", "stressed", "pressure", "burnout", "burnt out", "too much", "cant cope", "cannot cope", "overwhelm"]):
        return _pick([
            "Stress is your mind's way of saying \"this matters to me\" — but too much of it without relief is harmful. Let's bring it down a notch. 💙\n\nRight now, try: **Progressive Muscle Relaxation** — tense your hands into fists for 5 seconds, then release completely. Notice the wave of relief. Repeat with your shoulders, jaw, and feet.\n\nYour body holds stress — releasing it physically helps your mind follow. You're doing okay. 🌿",
            "When everything feels like too much at once, the best strategy is to **zoom in, not out**. 📌\n\nAsk yourself: \"What is the ONE smallest thing I can do in the next 10 minutes?\" Not tomorrow, not the big picture — just the next 10 minutes.\n\nSmall actions build momentum. You don't need to fix it all right now.",
            "Burnout is real, and it's not a sign of weakness — it's a sign that you've been strong for too long without enough rest. 💙\n\nToday, can you give yourself permission to rest for 20 minutes without guilt? Not \"productively rest\" — just rest. Your brain actually does its best problem-solving when you stop forcing it.\n\nCheck out our **Personal Coping Toolkit** for guided relaxation exercises!",
        ])

    # 9. Relationship / Family / Friend issues
    if _matches(text, ["friend", "family", "relationship", "breakup", "boyfriend", "girlfriend", "parent", "fight", "argument", "conflict", "betrayed", "trust", "love", "rejection"]):
        return _pick([
            "Relationship pain — whether with friends, family, or partners — cuts really deep. I'm genuinely sorry you're going through this. 💙\n\nIt helps to remember: you can only control your own actions and responses, not other people's. What would feel like the most caring, honest response from you right now?\n\nWhatever is happening, your feelings about it are completely valid.",
            "Conflicts with people we care about are some of the hardest emotional experiences. 💔\n\nGive yourself some space from the situation if you can — even a 20-minute walk can bring unexpected clarity. You don't have to solve it all right now.\n\nWhen you're ready, try journaling what you'd ideally want to say — it helps you process before you communicate.",
        ])

    # 10. Motivation & Productivity
    if _matches(text, ["motivat", "procrastinat", "lazy", "focus", "concentrate", "distract", "productive", "cant start", "cannot start", "stuck", "not doing anything"]):
        return _pick([
            "Lack of motivation isn't laziness — it's usually a sign your brain is depleted or overwhelmed. That's a biological reality, not a character flaw. 💙\n\nTry the **2-minute rule**: commit to just 2 minutes on the task. Often, starting is the hardest part and you'll keep going once you begin.\n\nAlso — have you had water, food, and movement today? Those three things dramatically affect focus.",
            "Feeling stuck is frustrating. Sometimes our brains need a **pattern interrupt** to get moving. 🧠\n\nTry: change your physical location (move to a different chair or room), put on instrumental music, and set a visible 15-minute timer. Tell yourself you'll just \"explore\" the task without pressure to finish.\n\nMomentum builds from motion, not from motivation.",
        ])

    # 11. Self-worth / Confidence
    if _matches(text, ["confidence", "self esteem", "worthless", "not good enough", "failure", "loser", "hate myself", "useless", "stupid", "dumb", "cant do anything"]):
        return _pick([
            "I want you to hear this clearly: **you are not a failure.** Struggling is part of every meaningful journey — it doesn't define your worth. 💙\n\nOur brains tend to amplify negative thoughts and minimize our wins. Can you name just ONE thing you did okay today? Even getting out of bed counts.\n\nYou matter — to more people than you currently realize. Please know that.",
            "Be very careful with the words you use toward yourself. You would never call a friend \"worthless\" for struggling — extend that same compassion inward. 🌸\n\n**Cognitive reframe:** Instead of \"I'm a failure,\" try \"I'm finding this hard right now.\" Both can feel true, but one leaves room for growth.\n\nYou have survived 100% of your hard days so far. That's real strength. 💙",
        ])

    # 12. Help / Support seeking
    if _matches(text, ["help", "support", "advice", "what should i do", "i don't know", "confused", "lost", "guidance"]):
        return _pick([
            "Reaching out for support is genuinely one of the bravest things you can do. I'm here. 💙\n\nCan you tell me a little more about what's going on? The more you share (whatever feels comfortable), the better I can support you.\n\nAlso, our **Helplines & Resources** page has verified professionals if you need more structured support.",
            "You've already taken a great step by seeking help. That matters. 🌿\n\nI'd love to understand more about what you're dealing with. What's weighing on you most right now? You don't have to have it all figured out — just share what comes to mind.",
        ])

    # 13. Physical health connected emotions
    if _matches(text, ["headache", "sick", "pain", "breathe", "breathing", "heart racing", "chest", "nausea", "dizzy"]):
        return (
            "I'm sorry you're feeling physical discomfort — our bodies and emotions are deeply connected. 💙\n\n"
            "If you're experiencing **chest pain, difficulty breathing, or dizziness** that feels urgent, "
            "please seek medical help immediately or call emergency services.\n\n"
            "For stress-related physical symptoms, try slow **diaphragmatic breathing**: "
            "breathe into your belly, not your chest, for 5 cycles. "
            "This can significantly reduce stress hormones in minutes.\n\n"
            "Your wellbeing matters — please take care of your body too. 🌿"
        )

    # 14. Positive / Doing well
    if _matches(text, ["happy", "good", "great", "excited", "awesome", "fine", "better", "doing well", "feeling okay", "okay"]):
        return _pick([
            "That's wonderful to hear! 🌟 Even small moments of feeling good are worth celebrating.\n\nIs there anything specific that's going well, or something on your mind you'd like to explore? I'm here whether you're thriving or struggling. 💙",
            "So glad you're feeling good! ✨ Hold onto that feeling — and if you ever want to build habits to maintain your wellbeing, check out our **Coping Toolkit** for simple daily exercises that help keep good mental health consistent.",
        ])

    # 15. Default warm response
    return _pick([
        "Thank you for sharing that with me — it takes real courage to put feelings into words. 💙\n\nI'm here to listen without judgment. Can you tell me a bit more about what's on your mind? The more you share, the better I can support you.\n\nAnd remember, you can also explore our **Mood Tracker** or **Coping Toolkit** for some guided support anytime.",
        "I hear you. Whatever you're going through, you don't have to face it alone. 🌿\n\nTake a slow breath in... and let it out gently. Right now, in this moment, you are okay.\n\nWould you like to share more about what's on your mind? I'm listening — no rush, no judgment.",
        "You reached out, and that matters more than you know. 💙\n\nLet's take this one moment at a time. What's the main thing weighing on you today? Even if it's hard to put into words, try your best — I'm here with you.",
    ])

/**
 * MindCare AI - Predefined Rule-Based Coping Toolkit Dataset (Frontend Fallback)
 * Activities grouped by Mood, Duration (2, 5, 10 minutes), and Category.
 */

const activitiesData = [
  // 2 MINUTE ACTIVITIES
  {
    title: "4-7-8 Deep Breathing Reset",
    moods: ["Stressed", "Anxious", "Sad", "Okay"],
    durationMinutes: 2,
    category: "breathing",
    description: "A fast nervous system calm technique to lower heart rate and reduce panic.",
    steps: [
      "Inhale quietly through your nose for 4 seconds.",
      "Hold your breath gently for 7 seconds.",
      "Exhale slowly and completely through your mouth with a soft whoosh for 8 seconds.",
      "Repeat for 4 complete breath cycles."
    ]
  },
  {
    title: "5-4-3-2-1 Sensory Grounding",
    moods: ["Anxious", "Stressed", "Sad"],
    durationMinutes: 2,
    category: "grounding",
    description: "Anchor your mind to the present moment using your physical senses.",
    steps: [
      "Look around and name 5 things you can SEE.",
      "Touch 4 different textures near you.",
      "Listen closely and identify 3 distinct SOUNDS.",
      "Identify 2 SMELLS in your immediate environment.",
      "Notice 1 TASTE in your mouth or take a slow sip of water."
    ]
  },
  {
    title: "Quick Emotion Release Journaling",
    moods: ["Stressed", "Sad", "Anxious", "Okay"],
    durationMinutes: 2,
    category: "journaling",
    description: "Brain-dump your current thoughts onto paper without editing.",
    steps: [
      "Grab a pen or open a notes app.",
      "Write: 'Right now, I am feeling... because...'",
      "Stream of consciousness: write continuously for 90 seconds without worrying about grammar.",
      "Finish with one positive self-affirmation: 'I am safe and taking things step by step.'"
    ]
  },
  {
    title: "Shoulder & Neck Tension Release",
    moods: ["Stressed", "Anxious", "Okay", "Happy", "Calm"],
    durationMinutes: 2,
    category: "relaxation",
    description: "Release physical tightness stored in your shoulders and cervical spine.",
    steps: [
      "Inhale and lift your shoulders up toward your ears as tightly as comfortable.",
      "Hold for 5 seconds.",
      "Exhale fully with a sigh and drop your shoulders down completely.",
      "Gently roll your neck clockwise 3 times, then counter-clockwise 3 times."
    ]
  },

  // 5 MINUTE ACTIVITIES
  {
    title: "Box Breathing for Focus & Calm",
    moods: ["Stressed", "Anxious", "Calm", "Okay"],
    durationMinutes: 5,
    category: "breathing",
    description: "Navy SEAL tactical breathing exercise for acute stress and mental clarity.",
    steps: [
      "Inhale slowly for 4 seconds.",
      "Hold your lungs full for 4 seconds.",
      "Exhale smoothly over 4 seconds.",
      "Hold your lungs empty for 4 seconds.",
      "Continue this box cycle rhythmically for 5 minutes."
    ]
  },
  {
    title: "Physical Object Focus Grounding",
    moods: ["Anxious", "Sad", "Stressed"],
    durationMinutes: 5,
    category: "grounding",
    description: "Redirect anxious mental loops by deeply exploring a tangible object.",
    steps: [
      "Pick up a small physical object near you (a pen, coin, crystal, or mug).",
      "Notice its weight, texture, temperature, and fine color details.",
      "Trace its edges slowly with your fingertips.",
      "If your mind wanders to worries, gently return focus to the tactile details of the object."
    ]
  },
  {
    title: "Gratitude & Stress Unloading",
    moods: ["Sad", "Okay", "Stressed", "Happy", "Calm"],
    durationMinutes: 5,
    category: "journaling",
    description: "Shift neural focus from worry to positive anchor points.",
    steps: [
      "List 3 things that felt heavy today.",
      "Beside each, write one thing you learned or one small silver lining.",
      "Write 3 things you are genuinely grateful for right now (even simple things like warm tea or comfortable shoes).",
      "Take a deep breath and close your note."
    ]
  },
  {
    title: "Progressive Muscle Relaxation (Upper Body)",
    moods: ["Stressed", "Anxious", "Sad"],
    durationMinutes: 5,
    category: "relaxation",
    description: "Systematically tense and release muscles to trigger deep somatic relaxation.",
    steps: [
      "Clench your fists tightly for 7 seconds, then let go completely for 10 seconds.",
      "Flex your forearms and biceps tightly for 7 seconds, then release.",
      "Tense your facial muscles (scrunch eyes and jaw) for 7 seconds, then let melt.",
      "Rest quietly for 2 minutes noticing the sensation of relaxation."
    ]
  },

  // 10 MINUTE ACTIVITIES
  {
    title: "Mindful Diaphragmatic Breathing",
    moods: ["Stressed", "Anxious", "Sad", "Calm", "Happy"],
    durationMinutes: 10,
    category: "breathing",
    description: "Deep belly breathing meditation to activate parasympathetic nervous system response.",
    steps: [
      "Lie down or sit comfortably with your spine erect.",
      "Place one hand on your chest and one hand on your lower belly.",
      "Inhale deeply through your nose, expanding your belly so the lower hand rises while chest stays still.",
      "Exhale slowly through pursed lips.",
      "Maintain deep rhythmic belly breathing while observing the gentle rise and fall."
    ]
  },
  {
    title: "Full Body Mindful Scan Grounding",
    moods: ["Anxious", "Stressed", "Sad", "Calm"],
    durationMinutes: 10,
    category: "grounding",
    description: "Comprehensive body awareness meditation to disengage from racing thoughts.",
    steps: [
      "Close your eyes and take 3 deep breaths.",
      "Direct attention down to your feet and toes. Notice warmth, tingling, or contact with the floor.",
      "Slowly scan upward through your calves, knees, thighs, hips, abdomen, chest, back, hands, arms, shoulders, neck, and scalp.",
      "Wherever you detect tension, imagine breathing calm air directly into that region and exhaling the tightness away."
    ]
  },
  {
    title: "Reflective Self-Compassion Journaling",
    moods: ["Sad", "Stressed", "Anxious", "Okay"],
    durationMinutes: 10,
    category: "journaling",
    description: "Write a supportive letter to yourself as if speaking to a beloved friend.",
    steps: [
      "Imagine a dear friend is experiencing your exact situation and feelings.",
      "Write down the gentle, encouraging advice and comfort you would offer them.",
      "Now read the letter back to yourself, acknowledging that you deserve the exact same kindness.",
      "Note down 2 small actionable self-care steps you can take today."
    ]
  },
  {
    title: "Deep Somatic Relaxation & Visualization",
    moods: ["Stressed", "Anxious", "Sad", "Calm", "Happy"],
    durationMinutes: 10,
    category: "relaxation",
    description: "Guided mental imagery combined with breathing to quiet mind and body.",
    steps: [
      "Close your eyes and picture a serene, safe place (a quiet forest, beach, or mountain lake).",
      "Imagine the ambient sound of gentle water waves or soft breeze through trees.",
      "Feel gentle sunshine warming your shoulders and face.",
      "Stay in this mental sanctuary for 10 minutes, breathing slowly and peacefully."
    ]
  }
];

export default activitiesData;

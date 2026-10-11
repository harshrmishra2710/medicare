/**
 * MindCare AI - Rule-Based Personal Coping Toolkit Engine
 * 
 * VIVA EXPLANATION:
 * This function uses deterministic conditional filtering (Array.filter) 
 * based on 3 user-selected criteria: mood, durationMinutes, and category.
 * It DOES NOT use Machine Learning. It matches exact or partial rules 
 * from a predefined JavaScript array of curated activities.
 */

export function filterCopingActivity(activities, selectedMood, durationMinutes, category) {
  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return null;
  }

  const durationNum = Number(durationMinutes);

  // Filter Step 1: Match duration and category
  let matches = activities.filter(activity => {
    const matchesDuration = activity.durationMinutes === durationNum;
    const matchesCategory = category === 'all' || activity.category === category;
    const matchesMood = !selectedMood || activity.moods.includes(selectedMood);

    return matchesDuration && matchesCategory && matchesMood;
  });

  // Filter Step 2: Fallback if exact 3-way match is empty (relax mood constraint)
  if (matches.length === 0) {
    matches = activities.filter(activity => {
      const matchesDuration = activity.durationMinutes === durationNum;
      const matchesCategory = category === 'all' || activity.category === category;
      return matchesDuration && matchesCategory;
    });
  }

  // Filter Step 3: Ultimate Fallback (relax category constraint to guarantee an exercise)
  if (matches.length === 0) {
    matches = activities.filter(activity => activity.durationMinutes === durationNum);
  }

  // Return top matched exercise (or first match)
  return matches.length > 0 ? matches[0] : activities[0];
}

/**
 * Ustaad.ai Streak & Activity Logic
 * Handles localStorage persistence for student study streaks.
 */

const STORAGE_KEY = 'ustaad_activity';

export interface ActivityMap {
  [date: string]: boolean;
}

/**
 * Marks today as an active day.
 * Triggered whenever a student sends a message or completes a quiz.
 */
export function recordActivity() {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toISOString().split('T')[0];
  const history = getActivityMap();
  
  if (!history[today]) {
    history[today] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

/**
 * Returns the full history of active days.
 */
export function getActivityMap(): ActivityMap {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Failed to load activity map:', e);
    return {};
  }
}

/**
 * Calculates the current consecutive daily streak.
 */
export function getStreak(): number {
  const history = getActivityMap();
  const today = new Date();
  let streak = 0;
  
  // Check backwards from today
  const checkDate = new Date(today);
  
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (history[dateStr]) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If we miss today, check if yesterday was active (grace period)
      if (streak === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yesterdayStr = checkDate.toISOString().split('T')[0];
        if (history[yesterdayStr]) {
          // Streak is still alive from yesterday
          checkDate.setDate(checkDate.getDate() - 0); // Continue check
          continue; 
        }
      }
      break;
    }
  }
  
  return streak;
}

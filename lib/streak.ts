/**
 * Ustaad.ai Streak & Activity Logic
 * Handles localStorage persistence for student study streaks.
 */

const STORAGE_KEY = 'ustaad_activity';

export interface ActivityMap {
  [date: string]: boolean;
}

function toKey(d: Date): string {
  return d.toISOString().split('T')[0];
}

/**
 * Marks today as an active day.
 * Triggered whenever a student sends a message or completes a quiz.
 */
export function recordActivity() {
  if (typeof window === 'undefined') return;

  const today = toKey(new Date());
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
 *
 * Rules:
 * - If today is active, streak = today + every consecutive previous day.
 * - If today is NOT active but yesterday IS, streak still counts from yesterday
 *   (one-day grace period — the user has the rest of today to log activity).
 * - Otherwise streak = 0.
 */
export function getStreak(): number {
  const history = getActivityMap();
  const today = new Date();
  const todayKey = toKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toKey(yesterday);

  // Pick the anchor: today if active, else yesterday (grace), else no streak.
  let anchor: Date;
  if (history[todayKey]) {
    anchor = today;
  } else if (history[yesterdayKey]) {
    anchor = yesterday;
  } else {
    return 0;
  }

  // Walk backwards from anchor, counting consecutive active days.
  let streak = 0;
  const cursor = new Date(anchor);
  while (history[toKey(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

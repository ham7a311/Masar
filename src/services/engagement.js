import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const ENGAGEMENT_KEY = (uid) => `masar-engagement-${uid}`;

const DEFAULT_ENGAGEMENT = {
  activityDates: [],
  longestStreak: 0,
  lastActiveTopicId: null,
  unlockedAchievements: [],
  celebratedStreakMilestones: [],
  dismissedSemesterKeys: [],
};

function learningRef(uid) {
  return doc(db, "users", uid, "learning", "progress");
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function computeStreakFromDates(activityDates) {
  if (!activityDates?.length) return { current: 0, longest: 0 };

  const unique = [...new Set(activityDates)].sort();
  let longest = 1;
  let run = 1;

  for (let i = 1; i < unique.length; i++) {
    const prev = parseDateKey(unique[i - 1]);
    const curr = parseDateKey(unique[i]);
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  const today = todayKey();
  const yesterday = parseDateKey(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const dateSet = new Set(unique);
  let current = 0;

  if (dateSet.has(today)) {
    current = 1;
    let cursor = yesterdayKey;
    while (dateSet.has(cursor)) {
      current += 1;
      const d = parseDateKey(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    }
  } else if (dateSet.has(yesterdayKey)) {
    current = 1;
    let cursor = yesterdayKey;
    const d = parseDateKey(cursor);
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().slice(0, 10);
    while (dateSet.has(cursor)) {
      current += 1;
      const dd = parseDateKey(cursor);
      dd.setDate(dd.getDate() - 1);
      cursor = dd.toISOString().slice(0, 10);
    }
  }

  return { current, longest: Math.max(longest, current) };
}

export function loadEngagementLocal(uid) {
  try {
    const raw = localStorage.getItem(ENGAGEMENT_KEY(uid));
    return raw ? { ...DEFAULT_ENGAGEMENT, ...JSON.parse(raw) } : { ...DEFAULT_ENGAGEMENT };
  } catch {
    return { ...DEFAULT_ENGAGEMENT };
  }
}

export function saveEngagementLocal(uid, data) {
  localStorage.setItem(ENGAGEMENT_KEY(uid), JSON.stringify(data));
}

export async function loadEngagement(uid) {
  const local = loadEngagementLocal(uid);
  try {
    const snap = await getDoc(learningRef(uid));
    if (snap.exists() && snap.data().engagement) {
      return { ...DEFAULT_ENGAGEMENT, ...local, ...snap.data().engagement };
    }
  } catch {
    /* local fallback */
  }
  return local;
}

export async function saveEngagement(uid, engagement) {
  saveEngagementLocal(uid, engagement);
  try {
    await setDoc(
      learningRef(uid),
      { engagement, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch {
    /* offline */
  }
}

export function recordEngagementActivity(engagement, { topicId } = {}) {
  const today = todayKey();
  const dates = engagement.activityDates.includes(today)
    ? engagement.activityDates
    : [...engagement.activityDates, today];

  const { current, longest } = computeStreakFromDates(dates);

  return {
    ...engagement,
    activityDates: dates,
    longestStreak: Math.max(engagement.longestStreak || 0, longest),
    currentStreak: current,
    lastActiveTopicId: topicId || engagement.lastActiveTopicId,
  };
}

export const STREAK_MILESTONES = [7, 14, 30, 100];

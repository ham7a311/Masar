import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { migrateMasteryMap } from "../utils/mastery";

const MASTERY_KEY = (uid) => `masar-topic-mastery-${uid}`;

function userLearningRef(uid) {
  return doc(db, "users", uid, "learning", "progress");
}

export function loadMasteryLocal(uid) {
  try {
    const raw =
      localStorage.getItem(MASTERY_KEY(uid)) ||
      localStorage.getItem(`masar-topic-status-${uid}`);
    if (!raw) return {};
    return migrateMasteryMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveMasteryLocal(uid, masteryMap) {
  localStorage.setItem(MASTERY_KEY(uid), JSON.stringify(masteryMap));
}

export async function loadTopicLearning(uid) {
  const localMastery = loadMasteryLocal(uid);
  let remoteMastery = {};
  let topicNotes = {};

  try {
    const snap = await getDoc(userLearningRef(uid));
    if (snap.exists()) {
      const data = snap.data();
      remoteMastery = migrateMasteryMap(data.topicMastery || {});
      topicNotes = data.topicNotes || {};
    }
  } catch {
    // Use local only if Firestore unavailable
  }

  const topicMastery = { ...localMastery, ...remoteMastery };

  return { topicMastery, topicNotes };
}

export async function saveTopicMastery(uid, topicMastery) {
  saveMasteryLocal(uid, topicMastery);
  try {
    await setDoc(
      userLearningRef(uid),
      { topicMastery, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch {
    // Local persistence still works offline
  }
}

export async function saveTopicNotes(uid, topicId, notes) {
  const ref = userLearningRef(uid);
  try {
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data().topicNotes || {} : {};
    await setDoc(
      ref,
      {
        topicNotes: { ...existing, [topicId]: notes },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // silent fail; user can retry on next edit
  }
}

export function normalizeNotesForTopic(notes) {
  if (!Array.isArray(notes)) return [];
  return notes
    .filter((n) => n && typeof n.text === "string" && n.text.trim())
    .map((n) => ({
      id: n.id || crypto.randomUUID(),
      text: n.text.trim(),
      updatedAt: n.updatedAt || Date.now(),
    }));
}

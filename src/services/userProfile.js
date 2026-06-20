import {
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  getPostAuthPath,
  hasRequiredProfileFields,
  isOnboardingComplete,
} from "../utils/profileFormat";

const COLLECTION = "users";

export { getPostAuthPath, isOnboardingComplete };

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, COLLECTION, uid));
  if (!snap.exists()) return null;
  return snap.data();
}

/** Read from server (bypasses cache) — use after writes before navigation. */
export async function getUserProfileFromServer(uid) {
  try {
    const snap = await getDocFromServer(doc(db, COLLECTION, uid));
    if (!snap.exists()) return null;
    return snap.data();
  } catch {
    return getUserProfile(uid);
  }
}

/**
 * After completeOnboarding, wait until Firestore reflects a complete profile.
 * Avoids dashboard ↔ onboarding redirect loops from stale cache reads.
 */
export async function waitForOnboardingProfile(uid, maxAttempts = 10) {
  const ref = doc(db, COLLECTION, uid);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let data = null;

    try {
      const snap = await getDocFromServer(ref);
      if (snap.exists()) data = snap.data();
    } catch {
      const snap = await getDoc(ref);
      if (snap.exists()) data = snap.data();
    }

    if (data && isOnboardingComplete(data)) return data;

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150 + attempt * 100));
    }
  }

  return getUserProfile(uid);
}

export async function saveUserProfile(uid, data) {
  const ref = doc(db, COLLECTION, uid);
  const existing = await getDoc(ref);

  await setDoc(
    ref,
    {
      uid,
      ...data,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
}

export async function completeOnboarding(uid, data) {
  const payload = {
    uid,
    ...data,
    onBoardingComplete: true,
    onboardingComplete: true,
    onBoardingStep: "complete",
    updatedAt: serverTimestamp(),
  };

  if (!hasRequiredProfileFields(payload)) {
    throw new Error("Incomplete onboarding profile");
  }

  await setDoc(doc(db, COLLECTION, uid), payload, { merge: true });
  return waitForOnboardingProfile(uid);
}

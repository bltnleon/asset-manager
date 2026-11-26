import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { MAX_ADMINS, MAX_VIEWERS } from "./auth";

const countsRef = doc(db, "meta", "userCounts");

function getLimits(role) {
  return role === "admin"
    ? { field: "admins", max: MAX_ADMINS }
    : { field: "viewers", max: MAX_VIEWERS };
}

export async function createUserProfile({ uid, name, email, role }) {
  const userRef = doc(db, "users", uid);
  const { field, max } = getLimits(role);

  await runTransaction(db, async (transaction) => {
    const countsSnap = await transaction.get(countsRef);
    const current = countsSnap.exists() ? countsSnap.data()[field] || 0 : 0;

    if (current >= max) {
      throw new Error("LIMIT_REACHED");
    }

    transaction.set(countsRef, { [field]: current + 1 }, { merge: true });
    transaction.set(userRef, {
      name,
      email,
      role,
      phone: "",
      jobTitle: "",
      createdAt: serverTimestamp(),
    });
  });
}

export async function deleteUserProfile(target) {
  const userRef = doc(db, "users", target.id);
  const { field } = getLimits(target.role);

  await runTransaction(db, async (transaction) => {
    const countsSnap = await transaction.get(countsRef);
    const current = countsSnap.exists() ? countsSnap.data()[field] || 0 : 0;

    transaction.delete(userRef);
    transaction.set(
      countsRef,
      { [field]: Math.max(0, current - 1) },
      { merge: true },
    );
  });
}

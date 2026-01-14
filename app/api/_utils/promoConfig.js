import { doc, getDoc } from "firebase/firestore";
import { getPublicFirestore } from "./firestorePublic";

export async function getPromoConfigPublic() {
  try {
    const db = getPublicFirestore();
    const snap = await getDoc(doc(db, "Config", "subscriptionPromo"));
    if (!snap.exists()) {
      return { discountPercent: 0, lifetimePromoEnabled: false };
    }
    const data = snap.data() || {};
    const discountPercent = Number.isFinite(Number(data.discountPercent))
      ? Number(data.discountPercent)
      : 0;
    const lifetimePromoEnabled = !!data.lifetimePromoEnabled;
    return { discountPercent, lifetimePromoEnabled };
  } catch {
    return { discountPercent: 0, lifetimePromoEnabled: false };
  }
}



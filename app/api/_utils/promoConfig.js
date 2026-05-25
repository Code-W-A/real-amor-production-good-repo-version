import { doc, getDoc } from "firebase/firestore";
import { getPublicFirestore } from "./firestorePublic";
import {
  getDefaultPerPlanDiscountPercent,
  normalizePerPlanDiscountPercent,
} from "./manualPayments";

export async function getPromoConfigPublic() {
  try {
    const db = getPublicFirestore();
    const snap = await getDoc(doc(db, "Config", "subscriptionPromo"));
    if (!snap.exists()) {
      return {
        discountPercent: 0,
        lifetimePromoEnabled: false,
        perPlanDiscountPercent: getDefaultPerPlanDiscountPercent(),
      };
    }
    const data = snap.data() || {};
    const discountPercent = Number.isFinite(Number(data.discountPercent))
      ? Number(data.discountPercent)
      : 0;
    const lifetimePromoEnabled = !!data.lifetimePromoEnabled;
    const perPlanDiscountPercent = normalizePerPlanDiscountPercent(
      data?.perPlanDiscountPercent
    );
    return { discountPercent, lifetimePromoEnabled, perPlanDiscountPercent };
  } catch {
    return {
      discountPercent: 0,
      lifetimePromoEnabled: false,
      perPlanDiscountPercent: getDefaultPerPlanDiscountPercent(),
    };
  }
}


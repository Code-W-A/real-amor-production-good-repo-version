import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { authentication } from "../firebase";

export const handleSignOut = (route) => {
  signOut(authentication)
    .then(() => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("realamour_unread_chat_toast_shown");
        } catch {
          /* ignore */
        }
      }
      route.push("/signin");
    })
    .catch((error) => {
      console.log("Error at signout...", error);
      // An error happened.
    });
};

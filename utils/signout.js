import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { authentication } from "../firebase";

export const handleSignOut = (route) => {
  signOut(authentication)
    .then(() => {
      // Sign-out successful.
      route.push("/signin");
    })
    .catch((error) => {
      console.log("Error at signout...", error);
      // An error happened.
    });
};

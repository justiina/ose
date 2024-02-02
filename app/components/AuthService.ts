import {
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export const AuthService = {
  login: async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      .then(
        (userCredential) => {
          if (userCredential.user) {
            console.log("login ok!");
            console.log(userCredential.user.uid);
            const user: FirebaseUser | null | false = userCredential.user;
            return { user };
          }
          return null;
        }
      );
    } catch (e: any) {
      return { error: e.message };
    }
  },

  logout: async () => {
    signOut(auth)
      .then(() => {
        console.log("logout ok");
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

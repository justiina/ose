import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase-config";

interface FormDataType {
  email: string;
  password: string;
}

export const AuthService = {
  login: async (formData: FormDataType) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      ).then((userCredential) => {
        if (userCredential.user) {
          console.log("login ok!");
          console.log(userCredential.user.uid);
          return { user: userCredential };
        }
        return null;
      });
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

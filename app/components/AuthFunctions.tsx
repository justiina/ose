import { useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebaseConfig";

export async function login(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        if (userCredential.user) {
          console.log("login ok!");
          console.log(userCredential.user);
          return userCredential.user;
        }
        return null;
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function logout() {
  firebaseSignOut(auth)
    .then(() => {
      console.log("logout ok");
    })
    .catch((error) => {
      console.log(error);
    });
}

export function checkUser() {
  const [user, setUser] = useState<FirebaseUser | null | false>(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  return user;
}

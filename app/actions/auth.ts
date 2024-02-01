"use server";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase-config";
import { createContext, useState } from "react";

interface FormDataType {
  email: string;
  password: string;
}

export async function login(formData: FormDataType) {
  try {
    await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    ).then((userCredential) => {
      if (userCredential.user) {
        console.log("login ok!");
        console.log(userCredential.user.uid);
        return userCredential.user;
      }
      return null;
    });
  } catch (error) {
    console.log(error);
    /*
    if (error) {
      switch (error.code) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }*/
    throw error;
  }
}

export async function logout() {
  signOut(auth).then(() => {
    console.log("logout ok")
  }).catch((error) => {
    console.log(error)
  });
}

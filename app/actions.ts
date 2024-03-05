"use server";

import { sessionOptions, SessionData, defaultSession } from "@/app/lib";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { auth } from "@/app/firebase/firebaseConfig";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
};
export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();
  const formEmail = formData.get("email") as string;
  const formPassword = formData.get("password") as string;
  let redirectPath: string | null = null;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formEmail,
      formPassword
    );
    if (userCredential.user) {
      session.userId = userCredential.user.uid;
      session.isLoggedIn = true;
      session.save();
      redirectPath = "/main";
    }
    return userCredential.user;
  } catch (error: any) {
    return { error: "Väärä sähköposti tai salasana! Yritä uudestaan." };
  } finally {
    if (redirectPath) {
      revalidatePath(redirectPath);
      redirect(redirectPath);
    }
  }
};

export const logout = async () => {
  const session = await getSession();
  signOut(auth);
  session.destroy();
  redirect("/");
};

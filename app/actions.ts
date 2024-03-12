"use server";

import { sessionOptions, SessionData, defaultSession } from "@/app/lib";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { auth } from "@/app/firebase/firebaseConfig";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/firebaseConfig";
import toast from "react-hot-toast";

// USER FUNCTIONS

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
    return { error: "Väärä sähköposti tai salasana!\nYritä uudestaan." };
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

// USER INFO IN FIRESTORE
export const getUserInfo = async () => {
  const session = await getSession();
  const uid = session.userId;
  if (uid !== undefined) {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        revalidatePath("/userinfo");
        return userData;
      } else {
        return null;
      }
    } catch (error: any) {
      return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
    }
  } else {
    return null;
  }
};

export const updateUserInfo = async (
  prevState: { error: undefined | string; message: undefined | string },
  formData: FormData
) => {
  const session = await getSession();
  const uid = session.userId;
  const formFirstName = formData.get("firstName") as string;
  const formLastName = formData.get("lastName") as string;
  const formEmail = formData.get("email") as string;
  const formPhoneNumber = formData.get("phoneNumber") as string;
  const formShowName = formData.get("showName") as boolean | null;
  const formShowEmail = formData.get("showEmail") as string | null;
  const formShowPhoneNumber = formData.get("showPhoneNumber") as string | null;

  if (uid !== undefined) {
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        phoneNumber: formPhoneNumber,
        showName: formShowName,
        showEmail: formShowEmail,
        showPhoneNumber: formShowPhoneNumber,
      });
      return { message: "Tietojen päivitys onnistui!" };
    } catch (error: any) {
      console.log(error);
      return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
    }
  }
};

// EVENT FUNCTIONS

export const saveEvent = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<boolean | any> => {
  try {
    await addDoc(collection(db, collectionName), data);
    return true;
  } catch (error) {
    console.log("Something went wrong: ", error);
    return error;
  }
};

export const getEvents = async (
  collectionName: string
): Promise<DocumentData | null> => {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy("time"),
      orderBy("type")
    );
    const querySnapshot = await getDocs(q);
    const eventData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data() as DocumentData);
    });
    return eventData;
  } catch (error) {
    console.error("Error getting document:", error);
    toast.error(
      "Tapahtumien lataus ei onnistunut! Yritä myöhemmin uudestaan.",
      { id: "download" }
    );
    return null;
  }
};

export const getEventsByDate = async (
  collectionName: string,
  date: string
): Promise<DocumentData | null> => {
  try {
    const q = query(
      collection(db, collectionName),
      where("date", "==", date),
      orderBy("time"),
      orderBy("type")
    );
    const querySnapshot = await getDocs(q);
    const eventData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data() as DocumentData);
    });
    return eventData;
  } catch (error) {
    console.error("Error getting document:", error);
    toast.error(
      "Tapahtumien lataus ei onnistunut! Yritä myöhemmin uudestaan.",
      { id: "download" }
    );
    return null;
  }
};

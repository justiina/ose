"use server";
import { sessionOptions, SessionData, defaultSession } from "@/app/lib";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { auth } from "@/app/firebaseConfig";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addDoc,
  deleteDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

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
    return { error: "Jotain meni vikaan!\nYritä uudestaan." };
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

export const updateUserInfo = async <T extends DocumentData>(
  data: T
): Promise<boolean | any> => {
  const session = await getSession();
  const uid = session.userId;

  if (uid !== undefined) {
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, data);
      return true;
    } catch (error: any) {
      console.log(error);
      return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
    }
  } else return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
};

export const getUserName = async (uid: string | null) => {
  try {
    if (uid === null || uid === undefined) {
      return "";
    } else {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userName = docSnap.data().firstName;
        return userName;
      }
    }
  } catch (error: any) {
    console.log(error);
  }
};

// EVENT FUNCTIONS

export const saveEvent = async <T extends DocumentData>(
  data: T
): Promise<boolean | any> => {
  try {
    await addDoc(collection(db, "events"), data);
    return true;
  } catch (error: any) {
    return {
      error: "Tapahtuman tallennus epäonnistui!\nYritä myöhemmin uudestaan.",
    };
  }
};

export const getEvents = async () => {
  try {
    const q = query(collection(db, "events"), orderBy("time"), orderBy("type"));
    const querySnapshot = await getDocs(q);
    const eventData: DocumentData[] | { error: string } = [];
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data() as DocumentData);
    });
    return eventData;
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const getEventsByDate = async (
  date: string
): Promise<DocumentData | null> => {
  try {
    const q = query(
      collection(db, "events"),
      where("date", "==", date),
      orderBy("time"),
      orderBy("type")
    );
    const querySnapshot = await getDocs(q);
    const eventData: (DocumentData & { id: string })[] = [];
    querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
      eventData.push({ id: doc.id, ...doc.data() });
    });
    return eventData;
  } catch (error: any) {
    return {
      error: "Tapahtuman tallennus epäonnistui!\nYritä myöhemmin uudestaan.",
    };
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean | any> => {
  try {
    const docRef = doc(db, "events", eventId);
    await deleteDoc(docRef);
    return true;
  } catch (error: any) {
    return {
      error: "Jotain meni vikaan!\nYritä uudestaan.",
    };
  }
};

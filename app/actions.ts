"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { EventType, EventsByDateType, AddEventType } from "./components/Types";
/*
import { sessionOptions, SessionData, defaultSession } from "@/app/lib";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { auth } from "@/app/firebaseConfig";

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
*/

// USER FUNCTIONS
export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return { error: "Jotain meni vikaan!\nYritä uudestaan." };
  }

  revalidatePath("/main");
  redirect("/main");
};

export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (!error) {
    redirect("/");
  }
};

/*
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
*/

// EVENT FUNCTIONS

export const getEvents = async () => {
  const supabase = createClient();
  try {
    const { data: eventData } = await supabase.from("events").select("*");
    if (eventData) {
      return eventData;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const getEventsByDate = async (
  date: string
): Promise<EventsByDateType> => {
  const supabase = createClient();
  try {
    const { data: eventData, error } = await supabase
      .from("events")
      .select("*")
      .eq("date", date)
      .order("time", { ascending: true })
      .order("type", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    if (eventData) {
      return { eventData, error: null };
    }
    return { eventData: null, error: null };
  } catch (error: any) {
    return {
      eventData: null,
      error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
    };
  }
};

export const saveEvent = async (data: AddEventType): Promise<boolean | any> => {
  // Remove properties with empty strings or zero values
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== "" && value !== 0)
  );

  const supabase = createClient();
  try {
    const { error } = await supabase.from("events").insert(cleanData);
    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    } else {
      return true;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean | any> => {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) {
      console.log(error.message);
      throw new Error(error.message);
    } else {
      return true;
    }
  } catch (error) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

/*

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
*/

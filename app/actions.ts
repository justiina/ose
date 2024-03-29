"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  UserType,
  EventType,
  EventsByDateType,
  AddEventType,
  GetUserType,
} from "./components/Types";
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

// USER INFO FROM SUPABASE
export const getUserInfo = async (): Promise<GetUserType> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user !== undefined) {
    const uid = user?.id;
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select()
        .eq("id", uid);
      if (error) {
        throw new Error(error.message);
      }
      if (userData && userData.length > 0) {
        const userObject = userData[0];
        const mappedUserData: UserType = {
          id: userObject.id,
          created: userObject.created,
          firstName: userObject.firstName,
          lastName: userObject.lastName,
          email: userObject.email,
          phoneNumber: userObject.phoneNumber,
          group: userObject.group,
          role: userObject.role,
          showName: userObject.showName || false, // default to false if not provided
          showEmail: userObject.showEmail || false, // default to false if not provided
          showPhoneNumber: userObject.showPhoneNumber || false, // default to false if not provided
        };
        return { userData: mappedUserData, error: null };
      } else {
        return { userData: null, error: null };
      }
    } catch (error: any) {
      return {
        userData: null,
        error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
      };
    }
  } else {
    return { userData: null, error: "User not found" };
  }
};

export const updateUserInfo = async (
  data: Partial<UserType>
): Promise<boolean | string> => {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user !== undefined) {
      const uid = user?.id;
      const { data: userData, error } = await supabase
        .from("users")
        .update(data)
        .eq("id", uid)
        .select();
      if (error) {
        console.log(error);
        return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
      }
      if (userData) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
  }
  // Return a default value if none of the conditions are met
  return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
};

/*

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

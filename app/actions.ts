"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  UserType,
  EventsByDateType,
  AddEventType,
  EditEventType,
  GetUserType,
  EventType,
  InvitedUserType,
  GetInvitedUserType,
  CalloutTrainingType,
  AddToInvitedUsersType,
} from "./components/Types";

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

export const signup = async (
  email: string,
  password: string,
  isAdmin?: boolean
): Promise<{ error?: string }> => {
  const supabase = createClient();
  const data = {
    email,
    password,
  };
  console.log(data);
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    if (error.message === "User already registered") {
      return {
        error:
          "Annettu sähköposti on jo rekisteröity\nPaina Unohtuiko salasana? -linkkiä nollataksesi salasanan.",
      };
    }
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  } else {
    // Remove invitation from invitedUsers table
    const { error } = await supabase
      .from("invitedUsers")
      .delete()
      .eq("email", email);
    if (error) {
      return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
    }
    // update userRoles table
    if (isAdmin) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user !== undefined) {
        const uid = user?.id;
        const { error } = await supabase
          .from("adminUsers")
          .insert([{ user_id: uid, email }]);
        if (error) {
          return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
        }
      }
    }
    return {};
  }
};

export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  console.log("reset salasana");
  const supabase = createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword` }
  );
  if (error) {
    return { error: "Jotain meni vikaan!\nYritä uudestaan." };
  }
  revalidatePath("/");
  redirect("/");
};

// USER ADMIN
export const addToInvitedUsers = async (
  data: AddToInvitedUsersType
): Promise<boolean | any> => {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("invitedUsers").insert(data);
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

export const getInvitedUsers = async () => {
  const supabase = createClient();
  try {
    const { data: userData } = await supabase.from("invitedUsers").select("*");
    if (userData) {
      return userData;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const getInvitedUserByToken = async (
  token: string
): Promise<GetInvitedUserType> => {
  const supabase = createClient();
  try {
    const { data: userData, error } = await supabase
      .from("invitedUsers")
      .select()
      .eq("token", token);
    if (error) {
      console.log(error);
      return {
        userData: null,
        error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
      };
    }
    if (userData && userData.length > 0) {
      const userObject = userData[0];
      const mappedUserData: InvitedUserType = {
        created_at: userObject.created_at,
        token: userObject.token,
        email: userObject.email,
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        isAdmin: userObject.isAdmin,
      };
      return { userData: mappedUserData, error: null };
    } else {
      return {
        userData: null,
        error: "Käyttäjätietoja ei löytynyt.\nOle yhteydessä sihteeriin.",
      };
    }
  } catch (error: any) {
    return {
      userData: null,
      error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
    };
  }
};

export const isAdmin = async (): Promise<boolean> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user !== undefined) {
    const uid = user?.id;
    try {
      const { data: userData, error } = await supabase
        .from("adminUsers")
        .select()
        .eq("user_id", uid);
      if (error) {
        throw new Error(error.message);
      }
      if (userData && userData.length > 0) {
        return true;
      } else if (userData.length == 0) {
        return false;
      } else {
        return false;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
  return false;
};

/*
export const getAllUsers = async (): Promise<UserAuthType> => {
  const supabase = createClient();
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();
};
*/

// USER INFO FROM SUPABASE DATABASE
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
  // Return notification if none of the conditions are met
  return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
};

export const getFirstName = async (uid: string | null): Promise<string> => {
  const supabase = createClient();
  try {
    if (uid === null || uid === undefined) {
      return "";
    } else {
      const { data: userData } = await supabase
        .from("users")
        .select("firstName")
        .eq("id", uid)
        .single();
      const firstName = userData?.firstName;
      if (firstName) {
        return firstName;
      } else {
        return "";
      }
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    return "";
  }
};

export const getAllUsersWithConsent = async () => {
  const supabase = createClient();
  try {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("showName", true)
      .order("lastName", { ascending: true });
    if (userData) {
      return userData;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

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

export const getEventById = async (id: string): Promise<EditEventType> => {
  const supabase = createClient();
  try {
    const { data: eventData, error } = await supabase
      .from("events")
      .select()
      .eq("id", id)
      .single();
    if (error) {
      console.log(error);
      return {
        eventData: null,
        error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
      };
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

export const getGroupEvents = async () => {
  const supabase = createClient();
  try {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .in("type", ["MaA", "MaB", "TiA", "TiB", "Raahe"])
      .order("date", { ascending: false });
    if (eventData) {
      return eventData;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
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

export const updateEvent = async (
  updatedData: Partial<EventType>
): Promise<boolean | string> => {
  const supabase = createClient();
  try {
    const id = updatedData.id;
    if (id) {
      const { data, error } = await supabase
        .from("events")
        .update(updatedData)
        .eq("id", id);
      if (error) {
        console.log(error);
        return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
      }
      if (data) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
  }
  // Return notification if none of the conditions are met
  return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
};

// CALLOUT GROUP FUNCTIONS

export const getCalloutTrainings = async () => {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("calloutTrainings")
      .select("*")
      .order("date", { ascending: true });
    if (data) {
      return data;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const saveCalloutTraining = async (
  data: CalloutTrainingType
): Promise<boolean | any> => {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("calloutTrainings").insert(data);
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

"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
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
  ResetPasswordType,
  GetResetPasswordType,
} from "./components/Types";

// USER FUNCTIONS
export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = await createClient();
    const data = { email, password };

    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      console.error("Supabase Login Error:", error.message); // Log for debugging
      return { success: false, error: "Jotain meni vikaan!\nYritä uudestaan." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected Error:", err); // Log unexpected errors
    return {
      success: false,
      error: "Unexpected error occurred. Please try again.",
    };
  }
};

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  isAdmin?: boolean
): Promise<{ error?: string }> => {
  const supabase = await createClient();
  const data = {
    email,
    password,
  };
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
    // update users and adminUsers tables
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user !== undefined) {
      const uid = user?.id;
      const { error } = await supabase
        .from("users")
        .insert([{ id: uid, email, firstName, lastName }]);
      if (error) {
        return {
          error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
        };
      }
      if (isAdmin) {
        const { error } = await supabase
          .from("adminUsers")
          .insert([{ user_id: uid, email }]);
        if (error) {
          return {
            error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
          };
        }
      }
    }
    return {};
  }
};

export const logout = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (
  uid: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Delete user from authentication
    const { data, error: authError } = await supabase.auth.admin.deleteUser(
      uid
    );

    if (authError) {
      console.error(
        "Delete user error:",
        authError.message,
        "Code:",
        authError.code
      );

      return { success: false, error: "Jotain meni vikaan!\nYritä uudestaan." };
    }

    // Delete user info from the users table
    const { error: tableError } = await supabase
      .from("users")
      .delete()
      .eq("id", uid);
    if (tableError) {
      return {
        success: false,
        error: "Jotain meni vikaan (users table)!\nYritä uudestaan.",
      };
    }

    return { success: true };
  
  } catch (err) {
    return {
      success: false,
      error: "Unexpected error occurred. Please try again.",
    };
  }
};

// Update user role in the metadata
export const updateUserRole = async (
  uid: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = await createClient();

    // Update user metadata
    const { error } = await supabase.auth.admin.updateUserById(uid, {
      user_metadata: { role: "service_role" },
    });

    if (error) {
      console.error("Error updating user role:", error.message);
      return {
        success: false,
        error: "Failed to update user role. Please try again.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

/*
export const resetPassword = async (email: string) => {
  const supabase = createClient();
  try {
    const { data: resetData, error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword`,
      });
  } catch (error) {}
};

export const confirmPasswordReset = async (
  password: string
): Promise<boolean | any> => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
    } else {
      return true;
    }
  } catch (error) {}
};
*/
/*
export const resetPassword = async (
  uid: string,
  password: string
): Promise<boolean | any> => {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.admin.updateUserById(uid, {password});
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
*/

export const addToPasswordResets = async (data: {
  token: string;
  email: string;
}): Promise<boolean | any> => {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("passwordResets").insert([data]);
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

export const getResetPasswordInfo = async (
  token: string
): Promise<GetResetPasswordType> => {
  const supabase = await createClient();
  try {
    const { data: userData, error } = await supabase
      .from("passwordResets")
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
      const mappedUserData: ResetPasswordType = {
        created_at: userObject.created_at,
        token: userObject.token,
        email: userObject.email,
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

export const getUidByEmail = async (email: string): Promise<string | any> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);
    if (error) {
      return {
        error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
      };
    }
    if (data && data.length > 0) {
      const uid = data[0].id;
      return { uid };
    }
  } catch (error) {
    return {
      error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
    };
  }
};

/*
export const getResetPasswordInfo = async (
  token: string
): Promise<GetResetPasswordType> => {
  const supabase = await createClient();
  try {
    const { data: userData, error } = await supabase
      .from("passwordResets")
      .select()
      .eq("token", token);
    if (error) {
      console.log(error);
      return {
        userData: null,
        error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
      };
    }
    const {data: userId, error } = await supabase.
    if (userData && userData.length > 0) {
      const userObject = userData[0];
      const mappedUserData: ResetPasswordType = {
        created_at: userObject.created_at,
        token: userObject.token,
        email: userObject.email,
      };
      return { userData: mappedUserData, error: null };
    } else {
      return {
        userData: null,
        error: "Käyttäjätietoja ei löytynyt.\nYritä nollata salasana uudelleen",
      };
    }
  } catch (error: any) {
    return {
      userData: null,
      error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan.",
    };
  }
};
*/
/*
export const resetPassword = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  console.log("reset salasana");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword` }
  );
  if (error) {
    return { error: "Jotain meni vikaan!\nYritä uudestaan." };
  }
  revalidatePath("/");
  redirect("/");
};*/

// USER ADMIN
export const addToInvitedUsers = async (
  data: AddToInvitedUsersType
): Promise<boolean | any> => {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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

export const getUserIdByEmail = async () => {
  const supabase = await createClient();
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();
  console.log(users);
  console.log(error);
  if (users !== undefined && users.length > 0) {
    //console.log(users)
  }
};

// USER INFO FROM SUPABASE DATABASE
export const getUserInfo = async (): Promise<GetUserType> => {
  const supabase = await createClient();
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

export const getUserById = async (uid: string): Promise<GetUserType> => {
  const supabase = await createClient();
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
};

export const updateUserInfo = async (
  data: Partial<UserType>
): Promise<boolean | string> => {
  const supabase = await createClient();
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
  const supabase = await createClient();
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

export const getAllUsers = async () => {
  const supabase = await createClient();
  try {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .order("lastName", { ascending: true });
    if (userData) {
      return userData;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const getAllUsersWithConsent = async () => {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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

  const supabase = await createClient();
  try {
    const { error } = await supabase.from("events").insert(cleanData);
    if (error) {
      throw new Error(error.message);
    } else {
      return true;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean | any> => {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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

export const getCalloutParticipationTableUrl = async (): Promise<
  string | any
> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("calloutParticipationUrl")
      .select("url")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (error) {
      throw new Error("Jotain meni vikaan! Yritä myöhemmin uudestaan.");
    }
    return data?.url || "";
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const updateCalloutParticipationTableUrl = async (
  url: string
): Promise<boolean | any> => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("calloutParticipationUrl")
      .insert({ url })
      .select();
    if (error) {
      throw new Error("Jotain meni vikaan! Yritä myöhemmin uudestaan.");
    } else {
      return true;
    }
  } catch (error: any) {
    return { error: "Jotain meni vikaan!\nYritä myöhemmin uudestaan." };
  }
};

export const deleteCalloutTraining = async (
  trainingId: string
): Promise<boolean | any> => {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("calloutTrainings")
      .delete()
      .eq("id", trainingId);
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

export const updateCalloutTraining = async (
  data: Partial<CalloutTrainingType>
): Promise<boolean | string> => {
  const supabase = await createClient();
  try {
    const { data: trainingData, error } = await supabase
      .from("calloutTrainings")
      .update(data)
      .eq("id", data.id)
      .select();
    if (error) {
      console.log("Supabase error:", error);
      return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
    }
    if (trainingData && trainingData.length > 0) {
      return true;
    } else {
      return "Päivitys epäonnistui!\nTarkista, että tiedot ovat oikein.";
    }
  } catch (error) {
    console.error("Error updating callout training:", error);
    return "Jotain meni vikaan!\nYritä myöhemmin uudestaan.";
  }
};

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/actions";
import CalloutTrainingsForm from "./CalloutTrainingsForm";

const CalloutTrainings = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }

  const admin = await isAdmin()

  return <CalloutTrainingsForm admin={admin}/>;
};

export default CalloutTrainings;

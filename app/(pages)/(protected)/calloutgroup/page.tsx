import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import CalloutGroupForm from "./CalloutGroupForm";
import { isAdmin } from "@/app/actions";

const CalloutGroup = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  const admin = await isAdmin()

  return <CalloutGroupForm admin={admin}/>;
};

export default CalloutGroup;

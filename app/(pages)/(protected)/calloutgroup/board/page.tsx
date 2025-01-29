import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/actions";
import CalloutBoardForm from "./CalloutBoardForm";

const CalloutBoard = async () => {
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

  return <CalloutBoardForm admin={admin}/>;
};

export default CalloutBoard;

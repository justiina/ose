import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AnnualMeetingsForm from "./AnnualMeetingsForm";

const AnnualMeetings = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }

  return (
      <div>
        <AnnualMeetingsForm isAdmin={false} />
      </div>
  );
};

export default AnnualMeetings;

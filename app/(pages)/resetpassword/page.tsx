import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const ResetPassword = async () => {
    // Check that the user is signed in, redirect to login page if not
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return redirect("/");
    }
  return <div>ResetPassword</div>;
};

export default ResetPassword;
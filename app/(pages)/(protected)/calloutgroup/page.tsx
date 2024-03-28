import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const CallOutGroup = async () => {
  // Check that the user is signed-in
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return <div>CallOutGroup</div>;
};

export default CallOutGroup;

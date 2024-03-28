import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const Instructions = async () => {
  // Check that the user is signed-in
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return <div>Instructions</div>;
};

export default Instructions;

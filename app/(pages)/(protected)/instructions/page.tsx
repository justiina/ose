import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UnderConstruction from "@/app/components/UnderConstruction";

const Instructions = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  return <div><UnderConstruction /></div>;
};

export default Instructions;

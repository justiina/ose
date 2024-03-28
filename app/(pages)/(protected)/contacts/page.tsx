import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const Contacts = async () => {
  // Check that the user is signed-in
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return <div>Contacts</div>;
};

export default Contacts;

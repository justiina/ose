import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const EditEvent = async () => {
  // Check that the user is signed-in
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return <div>EditEvent</div>;
};

export default EditEvent;

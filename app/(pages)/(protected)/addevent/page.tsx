import AddEventForm from "./AddEventForm";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const AddEvent = async () => {
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
      <AddEventForm currentUser={user.id} />
    </div>
  );
};

export default AddEvent;

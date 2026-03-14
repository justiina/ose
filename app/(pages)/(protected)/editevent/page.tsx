import EditEventForm from "./EditEventForm";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/actions";

const EditEvent = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }
  // Allow also admin users to edit or delete events
  const admin = await isAdmin();

  return (
    <div>
      <EditEventForm currentUser={user.id} isAdmin={admin} />
    </div>
  );
};

export default EditEvent;

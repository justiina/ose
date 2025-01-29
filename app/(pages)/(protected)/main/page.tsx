import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EventCalendar from "./EventCalendar";

const Main = async () => {
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
    <div className="container mx-auto p-8">
      <EventCalendar currentUser={user.id} />
    </div>
  );
};

export default Main;

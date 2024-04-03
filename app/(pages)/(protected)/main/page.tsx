import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EventCalendar from "./EventCalendar";

const Main = async () => {
  // Check that the user is signed-in
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-8">
      <EventCalendar currentUser={data.user.id} />
    </div>
  );
};

export default Main;

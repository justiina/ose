import EventCalendar from "./EventCalendar";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";

const Main = async () => {
  // check that the user is logged in
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-8">
      <EventCalendar />
    </div>
  );
};

export default Main;

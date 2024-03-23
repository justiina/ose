import { getSession } from "@/app/actions";
import AddEventForm from "./AddEventForm";
import { redirect } from "next/navigation";

const AddEvent = async () => {
  // check that the user is logged in
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }

  let uid = session?.userId;
  if (uid === undefined) {
    uid = "undefined";
  }

  return (
    <div>
      <AddEventForm currentUser={uid} />
    </div>
  );
};

export default AddEvent;

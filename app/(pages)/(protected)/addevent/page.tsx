import { getSession } from "@/app/actions";
import AddEventForm from "@/app/(pages)/(protected)/addevent/AddEventForm";
import { redirect } from "next/navigation";

const AddEvent = async () => {
  // check that the user is logged in
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }

  return (
    <div>
      <AddEventForm />
    </div>
  );
};

export default AddEvent;

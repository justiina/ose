import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";

const Contacts = async () => {
  // check that the user is logged in
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }

  return <div>Contacts</div>;
};

export default Contacts;

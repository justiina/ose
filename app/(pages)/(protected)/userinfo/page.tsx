import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import UserForm from "./UserForm";

const UserInfo = async () => {
  // check that the user is logged in
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }

  return (
    <div>
      <UserForm />
    </div>
  );
};

export default UserInfo;

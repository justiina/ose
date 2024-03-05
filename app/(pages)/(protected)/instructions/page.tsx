import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";

const Instructions = async () => {
  // check that the user is logged in
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }

  return <div>Instructions</div>;
};

export default Instructions;

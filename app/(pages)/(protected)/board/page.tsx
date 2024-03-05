import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";

const Board = async () => {
  // check that the user is logged in
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }
  
  return <div>Board</div>;
};

export default Board;

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditUsers from "./EditUsers";
import { isAdmin } from "@/app/actions";

const UserAdmin = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  // Allow only admin users to get to this route
  const admin = await isAdmin();
  if (!admin) {
    return redirect("/main");
  }

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-8">Käyttäjähallinta</h1>
      <EditUsers />
    </div>
  );
};

export default UserAdmin;

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/actions";
import { AddUserForm } from "./AddUserForm";

const UserAdmin = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
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
      <AddUserForm />
    </div>
  );
};

export default UserAdmin;

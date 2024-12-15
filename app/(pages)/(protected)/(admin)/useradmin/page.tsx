import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditUsers from "./EditUsers";
import { isAdmin } from "@/app/actions";
import { FilledLink } from "@/app/components/Buttons";
import { RiUserAddLine, RiUserForbidLine } from "react-icons/ri";

const UserAdmin = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }

  // Allow only admin users to get to this route
  const admin = await isAdmin();
  if (!admin) {
    return redirect("/main");
  }

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Käyttäjähallinta</h1>
      <div className="grid justify-start mt-4 gap-2">
        {/*---Add new user---*/}
        <FilledLink
          title="Lisää käyttäjä"
          color="blue"
          href="/useradmin/adduser"
          icon={<RiUserAddLine className="text-xl" />}
        />

        {/*---Delete user---*/}
        <FilledLink
          title="Poista käyttäjä"
          color="blue"
          href="/useradmin/deleteuser"
          icon={<RiUserForbidLine className="text-xl" />}
        />
      </div>
    </div>
  );
};

export default UserAdmin;

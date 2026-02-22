import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/actions";
import { FilledLink } from "@/app/components/Buttons";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";

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
    //<div className="container mx-auto p-8 lg:p-16">
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/*--- PAGE TITLE ---*/}
      <header>
        <h1>Ylläpito</h1>
        <p className="mt-1">Käyttäjien ja treeniryhmien hallintasivut.</p>
      </header>

      {/*--- USER MANAGEMENT ---*/}
      <section className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="flex items-center gap-2 mb-4"><FaUserCircle className="text-xl"/> Käyttäjähallinta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/*---Add new user---*/}
          <FilledLink
            title="Lisää käyttäjä"
            color="blue"
            href="/useradmin/adduser"
            icon={<FaPlus className="text-xl" />}
          />

          {/*---See and edit users---*/}
          <FilledLink
            title="Muokkaa käyttäjiä"
            color="blue"
            href="/useradmin/edituser"
            icon={<MdOutlineEdit className="text-xl" />}
          />
        </div>
      </section>

      {/*--- USER MANAGEMENT ---*/}
      <section className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="flex items-center gap-2 mb-4"><FaDog className="text-xl"/>Ryhmien hallinta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/*---Add new user---*/}
          <FilledLink
            title="Lisää ryhmä"
            color="blue"
            href="/useradmin/addgroup"
            icon={<FaPlus className="text-xl" />}
          />

          {/*---See and edit users---*/}
          <FilledLink
            title="Muokkaa ryhmiä"
            color="blue"
            href="/useradmin/editgroup"
            icon={<MdOutlineEdit className="text-xl" />}
          />
        </div>
      </section>
    </div>
  );
};

export default UserAdmin;

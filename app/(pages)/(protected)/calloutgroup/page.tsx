import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/app/actions";
import Link from "next/link";
import { FilledLink } from "@/app/components/Buttons";
import { FaNoteSticky, FaShieldDog } from "react-icons/fa6";
import { RiThumbUpFill } from "react-icons/ri";

const CalloutGroup = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Hälytysryhmä</h1>
      <p className="mb-4">
        Alta löydät hälytysryhmän kokouspöytäkirjat, hälytreenien ajankohdat ja
        järjestäjät sekä linkin, johon voit merkitä hälytyksiin osallistumisesi.
      </p>
      <div className="grid justify-start mt-4 gap-2">
        <FilledLink
          title="Hälytysryhmän kokouspöytäkirjat"
          color="orange"
          href="/calloutgroup/board"
          icon={<FaNoteSticky className="text-2xl" />}
        />
        <FilledLink
          title="Hälytreenit"
          color="orange"
          href="/calloutgroup/trainings"
          icon={<FaShieldDog className="text-2xl" />}
        />
        <FilledLink
          title="Hälytyksiin osallistuminen"
          color="orange"
          href="/calloutgroup/participation"
          icon={<RiThumbUpFill className="text-2xl" />}
        />
      </div>
    </div>
  );
};

export default CalloutGroup;

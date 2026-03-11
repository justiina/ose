import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getUserById } from "@/app/actions";
import { FilledLink } from "@/app/components/Buttons";
import { FaNoteSticky, FaShieldDog } from "react-icons/fa6";
import { RiThumbUpFill } from "react-icons/ri";
import CalloutErrorToast from "./participation/CalloutErrorToast";

const CalloutGroup = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <CalloutErrorToast />
      <h1 className="mb-4">Hälytysryhmä</h1>
      <p className="mb-4">
        Alta löydät hälytreenien ajankohdat ja järjestäjät. Hälytysryhmän
        jäsenet pääsevät katsomaan myös hälytysryhmän kokouspöytäkirjoja sekä
        merkitsemään hälytyksiin osallistumisensa.
      </p>
      <div className="grid justify-start mt-4 gap-2">
        <FilledLink
          title="Hälytreenit"
          color="orange"
          href="/calloutgroup/trainings"
          icon={<FaShieldDog className="text-2xl" />}
        />
        <h2>Hälytysryhmäläisille</h2>
        <FilledLink
          title="Hälytysryhmän kokouspöytäkirjat"
          color="orange"
          href="/calloutgroup/board"
          icon={<FaNoteSticky className="text-2xl" />}
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

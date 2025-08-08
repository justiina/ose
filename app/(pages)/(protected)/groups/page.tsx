import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { FilledLink } from "@/app/components/Buttons";
import { FaDog } from "react-icons/fa";

const Groups = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Viikkotreenit ryhmittäin</h1>
      <div className="grid justify-start mt-4 gap-2">
        <FilledLink
          title="Taso 1"
          color="blue"
          href="/groups/group1"
          icon={<FaDog className="text-2xl" />}
        />
        <FilledLink
          title="Taso 2"
          color="blue"
          href="/groups/group2"
          icon={<FaDog className="text-2xl" />}
        />
        <FilledLink
          title="Taso 3"
          color="blue"
          href="/groups/group3"
          icon={<FaDog className="text-2xl" />}
        />
        <FilledLink
          title="Raahe"
          color="blue"
          href="/groups/raahe"
          icon={<FaDog className="text-2xl" />}
        />
      </div>
    </div>
  );
};

export default Groups;

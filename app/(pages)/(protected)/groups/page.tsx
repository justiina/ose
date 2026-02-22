import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { FilledLink } from "@/app/components/Buttons";
import { FaDog } from "react-icons/fa";
import { Key } from "react";

const Groups = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  // Fetch group by slug
  const { data: groups, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("active", true)
    .order("id", { ascending: true });

  if (groupError || !groups) notFound();

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Viikkotreenit ryhmittäin</h1>
      <div className="grid justify-start mt-4 gap-2">
        {groups.map(
          (group: { slug: string; name: string; active: boolean }) => (
            <FilledLink
              key={group.slug}
              title={group.name}
              color="blue"
              href={`/groups/${group.slug}`}
              icon={<FaDog className="text-2xl" />}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default Groups;

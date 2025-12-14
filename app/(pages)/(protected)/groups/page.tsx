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

  type GroupType = {
    slug: string;
    title: string;
  };
  // List the groups
  const groups: GroupType[] = [
    { slug: "group1", title: "Taso 1" },
    { slug: "group2", title: "Taso 2" },
    { slug: "group3", title: "Taso 3" },
    { slug: "raahe", title: "Raahe" },
  ];

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Viikkotreenit ryhmittäin</h1>
      <div className="grid justify-start mt-4 gap-2">
        {groups.map((group) => (
          <FilledLink
            key={group.slug}
            title={group.title}
            color="blue"
            href={`/groups/${group.slug}`}
            icon={<FaDog className="text-2xl" />}
          />
        ))}
      </div>
    </div>
  );
};

export default Groups;

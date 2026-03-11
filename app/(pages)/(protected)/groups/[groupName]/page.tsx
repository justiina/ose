import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EventCard from "../EventCard";
import { EventType } from "@/app/components/Types";
import { getFirstName, getGroupEvents } from "@/app/actions";
import { showDateAndTime } from "@/app/components/Functions";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FilledRoundLink } from "@/app/components/Buttons";
import toast from "react-hot-toast";

const GroupPage = async ({
  params,
}: {
  params: Promise<{ groupName: string }>;
}) => {
  const groupName = (await params).groupName;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Fetch group by slug
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("slug", groupName)
    .single();

  if (groupError || !group) notFound();

  // Fetch members by group
  const { data: members, error: memberError } = await supabase
    .from("users")
    .select("*")
    .eq("group", group.name);

  if (memberError) notFound();

  const sortedMembers = [...(members ?? [])].sort((a, b) => {
    const aIsInstructor = a.role?.includes("Kouluttaja");
    const bIsInstructor = b.role?.includes("Kouluttaja");

    // Instructors first
    if (aIsInstructor && !bIsInstructor) return -1;
    if (!aIsInstructor && bIsInstructor) return 1;

    // Then rest in alphabetical order by lastName
    return a.lastName.localeCompare(b.lastName);
  });

  let events: EventType[] = [];

  const allEvents = await getGroupEvents();
  if (allEvents !== undefined) {
    if ("error" in allEvents) {
      toast.error(allEvents.error, { id: "fetchError" });
    } else {
      events = await Promise.all(
        allEvents.map(async (event: EventType) => {
          const firstName = await getFirstName(event.createdBy);
          return {
            id: event.id,
            created: showDateAndTime(event.created) || null,
            createdBy: event.createdBy,
            createdByName: firstName,
            title: event.title,
            type: event.type,
            date: event.date,
            time: event.time,
            place: event.place,
            placeLink: event.placeLink,
            details: event.details,
            individuals: event.individuals,
            duration: event.duration,
          };
        }),
      );
    }
  }

  return (
    <div className="container mx-auto p-8 lg:p-16 flex flex-col gap-4">
      <FilledRoundLink
        title="Takaisin"
        color="grey"
        href="/groups"
        icon={<RiArrowGoBackLine className="text-2xl" />}
      />
      <h1>{group.name}</h1>
      <h2>Ryhmän jäsenet</h2>
      <ul className="list-disc ml-6">
        {sortedMembers.map((member) => {
          const roleLabels: string[] = [];

          if (member.role?.includes("Kouluttaja")) {
            roleLabels.push("kouluttaja");
          }

          if (member.role?.includes("Treeniryhmän yhteyshenkilö")) {
            roleLabels.push("yhteyshenkilö");
          }

          return (
            <li key={member.id}>
              {member.firstName} {member.lastName}
              {roleLabels.length > 0 && ` (${roleLabels.join(", ")})`}
            </li>
          );
        })}
      </ul>
      <EventCard
        events={events}
        heading={"Viikkotreenit"}
        group={group.name}
        currentUser={user.id}
      />
    </div>
  );
};

export default GroupPage;

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
        })
      );
    }
  }

  return (
    <div className="container mx-auto p-8 lg:p-16 flex flex-col gap-8">
      <FilledRoundLink
        title="Takaisin"
        color="grey"
        href="/groups"
        icon={<RiArrowGoBackLine className="text-2xl" />}
      />

      <EventCard
        events={events}
        heading={`${group.name} viikkotreenit`}
        group={group.name}
        currentUser={user.id}
      />
    </div>
  );
};

export default GroupPage;

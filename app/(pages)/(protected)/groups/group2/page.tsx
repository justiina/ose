import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EventCard from "../EventCard";
import { EventType } from "@/app/components/Types";
import { getFirstName, getGroupEvents } from "@/app/actions";
import toast from "react-hot-toast";
import { showDateAndTime } from "@/app/components/Functions";
import { FilledRoundLink } from "@/app/components/Buttons";
import { RiArrowGoBackLine } from "react-icons/ri";

const Group2 = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

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
        heading="Taso 2 viikkotreenit"
        group="Taso 2"
        currentUser={user.id}
      />
    </div>
  );
};

export default Group2;

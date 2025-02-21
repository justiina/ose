import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EventCard from "./EventCard";
import { EventType } from "@/app/components/Types";
import { getFirstName, getGroupEvents } from "@/app/actions";
import toast from "react-hot-toast";
import { showDateAndTime } from "@/app/components/Functions";
import LoadingIndicator from "@/app/components/LoadingIndicator";

const Groups = async () => {
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
      console.log(events);
    }
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto p-8 lg:p-16">
        <h1 className="mb-4">Viikkotreenit ryhmittäin</h1>
        <p className="mb-4">Ei saatavilla olevia tapahtumia.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Viikkotreenit ryhmittäin</h1>
      <p className="mb-4">
        Klikkaa ryhmän nimen kohdalta avataksesi ryhmäkohtaiset treenit.
      </p>
      <EventCard
        events={events}
        heading="Taso 1"
        group="Taso 1"
        currentUser={user.id}
      />
      <EventCard
        events={events}
        heading="Taso 2"
        group="Taso 2"
        currentUser={user.id}
      />
      <EventCard
        events={events}
        heading="Taso 3"
        group="Taso 3"
        currentUser={user.id}
      />
      <EventCard
        events={events}
        heading="Raahe"
        group="Raahe"
        currentUser={user.id}
      />
    </div>
  );
};

export default Groups;

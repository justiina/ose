"use client";

import { getFirstName, getGroupEvents } from "@/app/actions";
import { EventType } from "@/app/components/Types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { showDateAndTime } from "@/app/components/Functions";
import EventCard from "./EventCard";

const EventsByTypeForm = ({
  currentUser,
}: {
  currentUser: string | undefined;
}) => {
  const [events, setEvents] = useState<EventType[]>([]);

  // Fetch the events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await getGroupEvents();
        if (events !== undefined) {
          if ("error" in events) {
            toast.error(events.error, { id: "fetchError" });
          } else {
            const eventsWithCreatorNames = await Promise.all(
              events.map(async (event: EventType) => {
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
            setEvents(eventsWithCreatorNames);
          }
        }
      } catch (error: any) {
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "fetchError2",
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-16">
      <h1 className="mb-4">Viikkotreenit ryhmittäin</h1>
      <EventCard events={events} heading="Maanantai A" group="MaA" currentUser={currentUser}/>
      <EventCard events={events} heading="Maanantai B" group="MaB" currentUser={currentUser}/>
      <EventCard events={events} heading="Tiistai A" group="TiA" currentUser={currentUser}/>
      <EventCard events={events} heading="Tiistai B" group="TiB" currentUser={currentUser}/>
      <EventCard events={events} heading="Raahe" group="Raahe" currentUser={currentUser}/>
    </div>
  );
};

export default EventsByTypeForm;

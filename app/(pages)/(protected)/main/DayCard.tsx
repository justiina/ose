"use client";
import { useEffect, useState } from "react";
import { getEventsByDate } from "@/app/firebase/firestoreFunctions";
import { MdAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

type Props = {
  date: string | null;
};

type EventType = {
  title: string | null;
  type: string | null;
  date: string | null;
  time: string | null;
  place: string | null;
  details: string | null;
};

const DayCard = ({ date }: Props) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the events data
  useEffect(() => {
    if (date !== null) {
      const [day, month, year] = date.split(".");
      const eventDate: string = `${year}-${month}-${day}`;
      const fetchData = async () => {
        const eventData = await getEventsByDate("events", eventDate);
        setEvents(
          eventData?.map((event: EventType) => ({
            title: event.title,
            date: event.date,
            time: event.time,
            type: event.type,
            place: event.place,
            details: event.details,
          }))
        );
      };
      fetchData();
    }
    setLoading(false);
  }, [date, events]);

  // Define mapping between event titles and background colors
  const eventColorMap: { [key: string]: string } = {
    MaA: "bg-blue",
    MaB: "bg-blue",
    TiA: "bg-blue",
    TiB: "bg-blue",
    Avoin: "bg-green",
    Laji: "bg-purple",
    Häly: "bg-orange",
    Muu: "bg-yellow",
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : events != undefined ? (
        events.length > 0 ? (
          <>
            {events.map((event, index) => (
              <div key={index}>
                <div className="flex justify-between border-y-2 border-greylight py-2">
                  <div className="flex items-center justify-start ml-2 gap-1">
                    <MdAccessTime className="text-xl" />
                    <p>{event.time}</p>
                  </div>
                  {event.place && (
                    <div className="flex items-center justify-start ml-2 gap-1">
                      <IoLocationOutline className="text-xl" />
                      <p>{event.place}</p>
                    </div>
                  )}

                  <p
                    className={`${
                      eventColorMap[event.type || ""] || "bg-grey"
                    } text-white cursor-pointer flex items-center justify-center text-sm rounded-full px-4 py-0.5 mr-6`}
                  >
                    {event.type}
                  </p>
                </div>
                <div className="mx-6 my-4">
                  <h2>{event.title}</h2>
                  <p className="my-1">{event.details}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>Ei tapahtumia</p>
        )
      ) : (
        <p>Ei tapahtumia</p>
      )}
    </div>
  );
};

export default DayCard;

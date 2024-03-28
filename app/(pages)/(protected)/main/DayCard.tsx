"use client";
import { useEffect, useState } from "react";
import { getEventsByDate, deleteEvent } from "@/app/actions";
//import { getEventsByDate, getUserName, deleteEvent } from "@/app/actions";
import { showDateAndTime } from "@/app/components/Functions";
import { EventType } from "@/app/components/Types";
import { MdAccessTime, MdOutlineEdit } from "react-icons/md";
import { IoLocationOutline, IoTrash } from "react-icons/io5";
import { EventColorAndIconMap } from "./EventColorAndIconMap";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import Link from "next/link";

type PropsType = {
  date: string | null;
  uid: string | undefined;
};

const DayCard = ({ date, uid }: PropsType) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch the events data
  useEffect(() => {
    if (date !== null) {
      const [day, month, year] = date.split(".");
      const eventDate: string = `${year}-${month}-${day}`;
      const fetchData = async () => {
        const { eventData, error } = await getEventsByDate(eventDate);
        if (eventData) {
          setEvents(
            eventData.map((event: EventType) => ({
              id: event.id,
              created: showDateAndTime(event.created) || null,
              createdBy: event.createdBy,
              //createdByName: getUserName(event.createdBy),
              createdByName: event.createdBy,
              title: event.title,
              type: event.type,
              date: event.date,
              time: event.time,
              place: event.place,
              placeLink: event.placeLink,
              details: event.details,
              individuals: event.individuals,
              duration: event.duration,
            }))
          );
        }
      };
      fetchData();
    }
    setLoading(false);
  }, [date, events]);

  const handleDelete = (eventId: string | null) => {
    if (eventId !== null) {
      setShowConfirmation(true);
      setDeleteId(eventId);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const deleteOk = await deleteEvent(deleteId);
      if (deleteOk) {
        setShowConfirmation(false);
      } else {
        toast.error(deleteOk, { id: "saveError" });
        return;
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setDeleteId(null);
  };

  const handleEdit = (eventId: string | null) => {
    if (eventId !== null) {
      redirect(`/editevent?${eventId}`);
    }
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
                      EventColorAndIconMap[event.type || ""].color || "bg-grey"
                    } text-white cursor-pointer flex items-center justify-center text-sm rounded-full px-4 py-0.5 mr-6`}
                  >
                    {event.type}
                  </p>
                </div>
                <div className="mx-6 my-4">
                  <div className="flex justify-between">
                    <h2>{event.title}</h2>
                    <div className="flex gap-2">
                      <IoTrash
                        onClick={() => handleDelete(event.id)}
                        className="cursor-pointer hover:text-orange text-grey text-2xl"
                      />
                      <Link
                        href={`http://localhost:3000/editevent?${event.id}`}
                        className="cursor-pointer hover:text-blue text-grey text-2xl"
                      >
                        <MdOutlineEdit />
                      </Link>
                    </div>
                  </div>
                  <p className="my-1">{event.details}</p>
                </div>

                {showConfirmation && (
                  <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                      <h2 className="text-xl mb-4">
                        Haluatko varmasti poistaa tapahtuman?
                      </h2>
                      <div className="flex justify-end">
                        <button
                          onClick={cancelDelete}
                          className="mr-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          Peruuta
                        </button>
                        <button
                          onClick={confirmDelete}
                          className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orangehover"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end mx-6 my-4 gap-1 text-greylight">
                  <p>Lisätty: {event.createdByName}</p>
                  <p>{event.created}</p>
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

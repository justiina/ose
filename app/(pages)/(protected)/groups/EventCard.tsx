import { deleteEvent } from "@/app/actions";
import { EventType } from "@/app/components/Types";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { GrGroup } from "react-icons/gr";
import { IoLocationOutline, IoTrash } from "react-icons/io5";
import { MdAccessTime, MdOutlineEdit, MdTimelapse } from "react-icons/md";
import { TbMap } from "react-icons/tb";

type PropsType = {
  events: EventType[];
  heading: string;
  group: string;
  currentUser: string | undefined;
};

const EventCard = ({ events, heading, group, currentUser }: PropsType) => {
  const [showData, setShowData] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        toast.error(deleteOk, { id: "delError" });
        return;
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setDeleteId(null);
  };

  return (
    <div>
      <h2
        onClick={() => {
          setShowData(!showData);
        }}
        className="text-blue ml-8 mb-4 cursor-pointer hover:text-orange active:text-orange"
      >
        {heading}
      </h2>
      {events.map((event, index) => {
        if (showData && event.type === group) {
          const [year, month, day] = event.date?.split("-");
          const date = `${day}.${month}.${year}`;
          return (
            <div
              className="lg:w-3/4 ml-8 mb-4 pb-1 bg-white rounded-xl"
              key={index}
            >
              <div className="flex justify-between bg-orange py-2 px-4 rounded-t-xl">
                <div className="flex items-center justify-start ml-2 gap-1 text-white">
                  <MdAccessTime className="text-xl" />
                  <h2 className="text-white">
                    {date} klo {event.time}
                  </h2>
                </div>
                {event.place && (
                  <div className="flex items-center justify-start ml-2 gap-1 text-white">
                    <IoLocationOutline className="text-xl" />
                    <h2 className="text-white">{event.place}</h2>
                  </div>
                )}
              </div>
              <div className="mx-6 my-4">
                <div className="flex justify-between">
                  <h2>{event.title}</h2>

                  {/*--- Show delete and edit buttons only if currentUser has created it --- */}
                  {currentUser === event.createdBy && (
                    <div className="flex gap-2">
                      <IoTrash
                        onClick={() => handleDelete(event.id)}
                        className="cursor-pointer hover:text-orange text-grey text-2xl"
                      />
                      <Link
                        href={`http://localhost:3000/editevent?event=${event.id}`}
                        className="cursor-pointer hover:text-blue text-grey text-2xl"
                      >
                        <MdOutlineEdit />
                      </Link>
                    </div>
                  )}
                </div>

                <p className="my-4 pb-4">{event.details}</p>

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

                <div className="flex justify-between">
                  {event.placeLink ? (
                    <p className="flex gap-2">
                      <TbMap className="text-2xl" />
                      <Link href={event.placeLink}>Karttalinkki</Link>
                    </p>
                  ) : (
                    <p className="flex gap-2 text-greylight">
                      <TbMap className="text-2xl" />
                      <p>-</p>
                    </p>
                  )}

                  <p className="flex gap-2 text-greylight">
                    <GrGroup className="text-2xl" />
                    {event.individuals ? <p>{event.individuals}</p> : <p>-</p>}
                  </p>

                  <p className="flex gap-2 text text-greylight">
                    <MdTimelapse className="text-2xl" />
                    {event.duration ? <p>{event.duration}</p> : <p>-</p>}
                  </p>
                </div>

                <div className="flex justify-end mt-4 gap-1 text-greylight">
                  {event.createdByName ? (
                    <>
                      <p>Lisännyt: {event.createdByName}</p>
                      <p>{event.created}</p>
                    </>
                  ) : (
                    <>
                      <p>Lisätty: {event.created}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default EventCard;

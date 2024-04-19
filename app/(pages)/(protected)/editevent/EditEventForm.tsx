"use client";

import { getEventById, updateEvent } from "@/app/actions";
import Dropdown from "@/app/components/Dropdown";
import { selectEventType } from "@/app/components/Functions";
import { eventTypeOptions } from "@/app/components/StyleMappingAndOptions";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { EventType, EditEventTypeForm } from "@/app/components/Types";
import { useSearchParams } from "next/navigation";
import useAutoSizeTextArea from "@/app/customHooks/useAutoSizeTextArea";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const EditEventForm = ({ currentUser }: { currentUser: string }) => {
  const searchParams = useSearchParams()!;
  const eventParams: string | null = searchParams.get("event");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EditEventTypeForm | null>(null);
  const [defaultTime, setDefaultTime] = useState<string | null>(null);

  // Initialise router
  const router = useRouter();

  // Set up the auto height of textarea used in details section
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea("details", textAreaRef.current, event?.details ?? "");

  // Fetch the events data
  useEffect(() => {
    if (eventParams !== null) {
      const fetchData = async () => {
        const { eventData, error } = await getEventById(eventParams);
        if (eventData) {
          setEvent(eventData);
          setDefaultTime(eventData?.date + "T" + eventData?.time);

          // Allow only user who created the event to edit it
          if (currentUser !== eventData?.createdBy) {
            toast.error("Vain tapahtuman luoja voi muokata sitä.", {
              id: "uidError",
            });
            router.push("/main");
          }
        }
        if (error) {
          toast.error(error, { id: "fetchError" });
        }
      };
      fetchData();
    }
    setIsLoading(false);
  }, []);

  // Add input value to event
  const handleInputChange =
    (fieldName: keyof EventType) =>
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      if (fieldName === "date") {
        const [day, time] = e.target.value.split("T");
        setEvent({ ...event!, date: day, time: time });
      } else {
        setEvent({ ...event!, [fieldName]: e.target.value });
      }
    };

  // Edit event type
  const selectType = (selectedOption: string) => {
    const selected = selectEventType(selectedOption);
    setEvent({ ...event!, type: selected });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Save form data to Firebase
  const saveAndRedirect = async () => {
    if (!event?.title || !event.date || !event.type) {
      toast.error("Täytä ainakin pakolliset kentät!");
      return;
    } else {
      const updateOk = await updateEvent(event);
      if (updateOk) {
        router.push("/main");
        toast.success("Tapahtuman päivitys onnistui!");
      } else if (typeof updateOk === "string") {
        toast.error(updateOk, { id: "saveError" });
        return;
      }
    }
  };

  // Cancel add event and go back to main page
  const clearAndRedirect = () => {
    setEvent(null);
    router.push("/main");
  };

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Tapahtuman muokkaus</h1>
      <p className="mb-4">Täytä ainakin tähdellä merkityt kohdat.</p>
      <div>
        {/*---Title---*/}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Tapahtuman nimi</label>
            <p className="text-orange">*</p>
          </div>
          <input
            id="title"
            className="border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="text"
            name="title"
            placeholder="Esim. Hakutreeni tai Viikkotreeni"
            value={event?.title ?? ""}
            onChange={handleInputChange("title")}
          />
        </div>

        {/*---Date---*/}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Aika</label>
            <p className="text-orange">*</p>
          </div>
          <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
            <input
              id="datetimeInput"
              aria-label="Date and time"
              type="datetime-local"
              defaultValue={defaultTime || ""}
              onChange={handleInputChange("date")}
            />
          </div>
        </div>

        {/*---Type---*/}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Tapahtuman tyyppi</label>
            <p className="text-orange">*</p>
          </div>
          <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
            <Dropdown
              options={eventTypeOptions}
              onSelect={selectType}
              value={event?.type || ""}
            />
          </div>
        </div>

        {/*---Location---*/}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Paikan nimi</label>
          </div>
          <input
            id="place"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="text"
            name="place"
            value={event?.place ?? ""}
            placeholder="Paikan nimi"
            onChange={handleInputChange("place")}
          />
        </div>

        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Paikan karttalinkki</label>
          </div>
          <input
            id="placeLink"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="text"
            name="placeLink"
            value={event?.placeLink ?? ""}
            placeholder="Karttalinkki"
            onChange={handleInputChange("placeLink")}
          />
        </div>

        {/*---Details---*/}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Kuvaus</label>
          </div>
          <textarea
            ref={textAreaRef}
            id="details"
            className="col-span-6 overflow-hidden border min-h-12 border-grey bg-white rounded-lg py-1 px-4 mb-2"
            name="details"
            value={event?.details ?? ""}
            placeholder="Lyhyt kuvaus suunnitellusta tapahtumasta"
            onChange={handleInputChange("details")}
          />
        </div>

        <h2 className="my-4">Voidaan täyttää tapahtuman jälkeen</h2>

        {/*---Number of participants---*/}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Osallistujien lukumäärä</label>
          </div>
          <input
            id="individuals"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="number"
            name="individuals"
            placeholder="Lukumäärä"
            value={event?.individuals ?? ""}
            onChange={handleInputChange("individuals")}
          />
        </div>

        {/*---Duration---*/}
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">
              Tapahtuman kesto (tuntia ja minuuttia)
            </label>
          </div>
          <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
            <input
              id="duration"
              aria-label="Duration"
              type="time"
              defaultValue={event?.duration || ""}
              onChange={handleInputChange("duration")}
            />
          </div>
        </div>

        {/*---Save or cancel---*/}
        <div className="flex lg:w-2/3 justify-end mt-4">
          <button
            onClick={clearAndRedirect}
            className="mr-2 px-4 py-2 text-white bg-grey rounded-lg hover:bg-greyhover"
          >
            Peruuta
          </button>
          <button
            onClick={saveAndRedirect}
            className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orangehover"
          >
            Tallenna
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventForm;

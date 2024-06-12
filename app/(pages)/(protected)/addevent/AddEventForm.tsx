"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import { AddEventType } from "@/app/components/Types";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import useAutoSizeTextArea from "@/app/customHooks/useAutoSizeTextArea";
import { saveEvent } from "@/app/actions";
import Dropdown from "@/app/components/Dropdown";
import { eventTypeOptions } from "@/app/components/StyleMappingAndOptions";
import { selectEventType, showDate } from "@/app/components/Functions";

type PropsType = {
  currentUser: string;
  date?: string | null;
};

const AddEventForm = ({ currentUser, date }: PropsType) => {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const searchParams = useSearchParams()!;
  const dateParams: string | null = searchParams.get("date");
  const [formData, setFormData] = useState({
    created: timestamp.toString(),
    createdBy: currentUser,
    title: "",
    date: dateParams || showDate(currentDate),
    time: "18:00",
    type: "",
    place: "",
    placeLink: "",
    details: "",
    individuals: 0,
    duration: "",
  });

  // Set up the auto height of textarea used in details section
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea("details", textAreaRef.current, formData.details);

  // Initialise router
  const router = useRouter();

  // Add input value to formData
  const handleInputChange =
    (fieldName: keyof AddEventType) =>
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      if (fieldName === "date") {
        const [day, time] = e.target.value.split("T");
        setFormData({ ...formData, date: day, time: time });
      } else {
        setFormData({ ...formData, [fieldName]: e.target.value });
      }
    };

  // Add event type to formData
  const selectType = (selectedOption: string) => {
    const selected = selectEventType(selectedOption);
    setFormData({ ...formData, type: selected });
  };

  // Save form data to Supabase
  const saveAndRedirect = async () => {
    if (!formData.title || !formData.date || !formData.type) {
      toast.error("Täytä ainakin pakolliset kentät!");
      return;
    } else {
      const saveOk = await saveEvent(formData);
      if (saveOk) {
        router.push("/main");
        toast.success("Tapahtuman tallentaminen onnistui!");
      } else {
        toast.error(saveOk, { id: "saveError" });
        return;
      }
    }
  };

  // Cancel add event and go back to main page
  const clearAndRedirect = () => {
    const currentDate = new Date();
    setFormData({
      created: "",
      createdBy: "",
      title: "",
      date: "",
      time: "",
      type: "",
      place: "",
      placeLink: "",
      details: "",
      individuals: 0,
      duration: "",
    });
    router.push("/main");
  };

  return (
    <div className="container mx-auto p-8 lg:p-16">
      <h1 className="mb-4">Lisää tapahtuma</h1>
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
            onChange={handleInputChange("title")}
            required
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
              defaultValue={`${formData.date}T${formData.time}` || ""}
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
            <Dropdown options={eventTypeOptions} onSelect={selectType} />
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

export default AddEventForm;

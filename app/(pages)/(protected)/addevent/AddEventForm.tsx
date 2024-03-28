"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import { AddEventType } from "@/app/components/Types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAutoSizeTextArea from "@/app/customHooks/useAutoSizeTextArea";
import { saveEvent } from "@/app/actions";
import Dropdown from "@/app/components/Dropdown";

const AddEventForm = ({ currentUser }: { currentUser: string }) => {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const [formData, setFormData] = useState({
    created: timestamp.toString(),
    createdBy: currentUser,
    title: "",
    date: "",
    time: "",
    type: "",
    place: "",
    placeLink: "",
    details: "",
    individuals: 0,
    duration: 0,
  });

  // Set up the auto height of textarea used in details section
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea("details", textAreaRef.current, formData.details);

  // Initialise router
  const router = useRouter();

  // List event types for dropdown list
  const eventTypeOptions = [
    "MaA-treeni",
    "MaB-treeni",
    "TiA-treeni",
    "TiB-treeni",
    "Kokeet",
    "Virta",
    "Hälytreeni",
    "Lajitreeni",
    "Avoin treeni",
    "Muu",
  ];

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
    let selected: string = "";
    switch (selectedOption) {
      case "MaA-treeni":
        selected = "MaA";
        break;
      case "MaB-treeni":
        selected = "MaB";
        break;
      case "TiA-treeni":
        selected = "TiA";
        break;
      case "TiB-treeni":
        selected = "TiB";
        break;
      case "Kokeet":
        selected = "Koe";
        break;
      case "Virta":
        selected = "Virta";
        break;
      case "Hälytreeni":
        selected = "Häly";
        break;
      case "Lajitreeni":
        selected = "Laji";
        break;
      case "Avoin treeni":
        selected = "Avoin";
        break;
      default:
        selected = "Muu";
        break;
    }
    setFormData({ ...formData, type: selected });
  };

  // Save form data to Firebase
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
    const timestamp = currentDate.getTime();
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
      duration: 0,
    });
    router.push("/main");
  };

  return (
    <div className="container mx-auto p-16">
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
            id="name"
            className="border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="text"
            name="name"
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
            id="name"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="text"
            name="name"
            placeholder="Paikan nimi"
            onChange={handleInputChange("place")}
            required
          />
        </div>

        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Paikan karttalinkki</label>
          </div>
          <input
            id="name"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="text"
            name="name"
            placeholder="Karttalinkki"
            onChange={handleInputChange("placeLink")}
            required
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
            required
          />
        </div>

        <h2 className="my-4">Täytetään tapahtuman jälkeen</h2>
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
            required
          />
        </div>
        <div className="flex flex-col lg:w-2/3">
          <div className="flex gap-1">
            <label className="font-bold">Tapahtuman kesto</label>
          </div>
          <input
            id="duration"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="number"
            name="duration"
            placeholder="Kesto desimaalilukuna"
            onChange={handleInputChange("duration")}
            required
          />
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

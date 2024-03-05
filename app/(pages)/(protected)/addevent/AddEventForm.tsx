"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAutoSizeTextArea from "@/app/customHooks/useAutoSizeTextArea";
import { saveEvent } from "@/app/firebase/firestoreFunctions";
import { serverTimestamp } from "firebase/firestore";
import Dropdown from "@/app/components/Dropdown";

interface FormDataType {
  title: string;
  date: string;
  time: string;
  type: string;
  place: string;
  placeLink: string;
  details: string;
}

const AddEventForm = () => {
  const [formData, setFormData] = useState({
    created: serverTimestamp(),
    title: "",
    date: "",
    time: "",
    type: "",
    place: "",
    placeLink: "",
    details: "",
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
    "Hälytreeni",
    "Lajitreeni",
    "Avoin treeni",
    "Muu",
  ];

  // Add input value to formData
  const handleInputChange =
    (fieldName: keyof FormDataType) =>
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      if(fieldName==="date") {
        const [day, time] = e.target.value.split("T")
        setFormData({...formData, date: day, time: time})

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
      toast.error("Täytä pakolliset kentät!");
      return;
    } else {
      const saveOk = await saveEvent("events", formData);
      if (saveOk) {
        router.push("/main");
        toast.success("Tapahtuman tallentaminen onnistui!");
      } else {
        toast.error("Jotain meni vikaan, yritä myöhemmin uudestaan.");
        console.log("Something went wrong: ", saveOk);
      }
    }
  };

  // Cancel add event and go back to main page
  const clearAndRedirect = () => {
    setFormData({
      created: serverTimestamp(),
      title: "",
      date: "",
      time: "",
      type: "",
      place: "",
      placeLink: "",
      details: "",
    });
    router.push("/main");
  };

  return (
    <div className="container mx-auto p-16">
      <h1 className="mb-4">Lisää tapahtuma</h1>
      <p className="mb-4">Täytä ainakin tähdellä merkityt kohdat.</p>
      <div>
        {/*---Title---*/}
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-2 flex gap-1">
            <label className="font-bold">Tapahtuman nimi</label>
            <p className="text-orange">*</p>
          </div>
          <input
            id="name"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2"
            type="text"
            name="name"
            placeholder="Esim. Hakutreeni tai Viikkotreeni"
            onChange={handleInputChange("title")}
            required
          />
        </div>

        {/*---Date---*/}
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-2 flex gap-1">
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
        <div className="lg:grid lg:grid-cols-12">
          <div className="md:col-span-2 flex gap-1">
            <label className="font-bold">Tapahtuman tyyppi</label>
            <p className="text-orange">*</p>
          </div>

          <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
            <Dropdown options={eventTypeOptions} onSelect={selectType} />
          </div>
        </div>

        {/*---Place---*/}
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-2 flex gap-1">
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

        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-2 flex gap-1">
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
        <div className="lg:grid lg:grid-cols-12">
          <div className="md:col-span-2 flex gap-1">
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

        {/*---Save or cancel---*/}
        <div className="lg:grid lg:grid-cols-12 mt-8">
          <div className="md:col-span-8 flex gap-1 justify-end">
            <button
              onClick={clearAndRedirect}
              className=" hover:bg-blue bg-grey text-white cursor-pointer px-5 py-2 rounded-full text-sm"
            >
              Peruuta
            </button>
            <button
              onClick={saveAndRedirect}
              className="bg-orange hover:bg-blue active:bg-grey text-white cursor-pointer px-5 py-2 rounded-full text-sm"
            >
              Tallenna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventForm;

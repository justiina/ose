"use client";
import React, { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import useAutoSizeTextArea from "@/app/customHooks/useAutoSizeTextArea";
import { saveEvent } from "@/app/firebase/firestoreFunctions";
import { serverTimestamp } from "firebase/firestore";
import Dropdown from "@/app/components/Dropdown";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    created: serverTimestamp(),
    title: "",
    details: "",
    type: "",
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutoSizeTextArea("details", textAreaRef.current, formData.details);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error("Kirjaudu sisään / Please sign in");
      redirect("/");
    },
  });
  if (status === "loading") {
    return <LoadingIndicator />;
  }

  const typeOptions = [
    "MaA-treeni",
    "MaB-treeni",
    "TiA-treeni",
    "TiB-treeni",
    "Häytreeni",
    "Lajitreeni",
    "Avoin treeni",
    "Muu",
  ];

  const selectType = (selectedOption: string) => {
    setFormData({ ...formData, type: selectedOption });
  };

  const saveAndRedirect = async () => {
    if (!formData.title || !formData.details || !formData.type) {
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

  const clearAndRedirect = () => {
    setFormData({
      created: serverTimestamp(),
      title: "",
      details: "",
      type: "",
    });
    router.push("/main");
  };

  return (
    <div className="container mx-auto p-16">
      <h1 className="mb-4">Lisää tapahtuma</h1>
      <p className="mb-4">Täytä ainakin tähdellä merkityt kohdat.</p>
      <div>
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-2 flex gap-1">
            <label className="font-bold">Tapahtuman nimi</label>
            <p className="text-orange">*</p>
          </div>
          <input
            id="name"
            className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 text-sm mb-2"
            type="text"
            name="name"
            placeholder="Esim. hakutreeni"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="lg:grid lg:grid-cols-12">
          <div className="md:col-span-2 flex gap-1">
            <label className="font-bold">Kuvaus</label>
            <p className="text-orange">*</p>
          </div>
          <textarea
            ref={textAreaRef}
            id="details"
            className="col-span-6 overflow-hidden border min-h-12 border-grey bg-white rounded-lg py-1 px-4 text-sm mb-2"
            name="details"
            placeholder="Lyhyt kuvaus suunnitellusta tapahtumasta"
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            required
          />
        </div>

        <div className="lg:grid lg:grid-cols-12">
          <div className="md:col-span-2 flex gap-1">
            <label className="font-bold">Tapahtuman tyyppi</label>
            <p className="text-orange">*</p>
          </div>

          <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 text-sm mb-2">
            <Dropdown options={typeOptions} onSelect={selectType} />
          </div>
        </div>

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

export default AddEvent;
AddEvent.requireAuth = true;

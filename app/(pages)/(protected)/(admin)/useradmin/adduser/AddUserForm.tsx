"use client";
import FilledButton from "@/app/components/Buttons";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { addToInvitedUsers } from "@/app/actions";
import { useRouter } from "next/navigation";

export const AddUserForm = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [selectedRadio, setSelectedRadio] = useState<string>("notAdmin");
  const token = crypto.randomUUID();
  const router = useRouter()

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    switch (value) {
      case "admin":
        setIsAdmin(true);
        break;
      case "notAdmin":
        setIsAdmin(false);
        break;
    }
  };

  const sendInvitation = async () => {
    if (!email || !firstName || !lastName) {
      toast.error("Täytä kaikki kentät!");
      return;
    } else {
      await fetch("../api/send", {
        method: "POST",
        body: JSON.stringify({ token, email, firstName, lastName }),
      }).then(() => {
        saveAsInvited();
      });
    }
  };

  const saveAsInvited = async () => {
    if (!email || !firstName || !lastName) {
      toast.error("Täytä kaikki kentät!");
      return;
    } else {
      const saveOk = await addToInvitedUsers({
        token,
        email,
        firstName,
        lastName,
        isAdmin,
      });
      if (saveOk) {
        toast.success("Sähköposti lähetetty uudelle käyttäjälle!");
        return router.push("/useradmin")
      } else {
        toast.error(saveOk, { id: "saveError" });
        return;
      }
    }
  };
  // Cancel add add user and go back to main page
  const cancel = () => {
    // Initiate the states
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setIsAdmin(false);
    setSelectedRadio("notAdmin");

    // Redirect to previous page
    router.push("/useradmin");
  };

  return (
    <div>
      <h1 className="mb-2 text-blue">Uuden käyttäjän lisäys</h1>
      <div className="my-4 bg-white rounded-lg p-4 border border-grey lg:w-2/3">
        <p className="mb-4">
          Täytä alla olevat tiedot, niin rekisteröitymisohjeet lähetetään
          annettuun sähköpostiosoitteeseen.
        </p>
        <div className="flex flex-col gap-2">
          {/*---First name---*/}
          <div className="flex gap-1">
            <label className="font-bold">Etunimi</label>
            <p className="text-orange">*</p>
          </div>
          <input
            id="firstName"
            className="border border-grey rounded-lg py-1 px-4 text-sm"
            type="text"
            name="firstName"
            placeholder="Etunimi"
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          {/*---Last name---*/}
          <div className="flex gap-1">
            <label className="font-bold">Sukunimi</label>
            <p className="text-orange">*</p>
          </div>
          <input
            id="lastName"
            className="border border-grey rounded-lg py-1 px-4 text-sm"
            type="text"
            name="lastName"
            placeholder="Sukunimi"
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <div className="flex gap-1">
            <label className="font-bold">Sähköpostiosoite</label>
            <p className="text-orange">*</p>
          </div>
          <input
            id="email"
            className="border border-grey rounded-lg py-1 px-4 text-sm"
            type="email"
            name="email"
            placeholder="Sähköposti"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/*---User role---*/}
          <div className="flex gap-1">
            <label className="font-bold">Annetaanko admin-oikeudet?</label>
            <p className="text-orange">*</p>
          </div>
          <p>HUOM! Älä anna admin-oikeuksia perusjäsenille.</p>
          <div className="flex gap-4">
            <label className=" flex gap-1">
              <input
                type="radio"
                id="admin"
                value="admin"
                checked={selectedRadio === "admin"}
                onChange={() => handleRadioChange("admin")}
              />
              Kyllä
            </label>
            <label className=" flex gap-1">
              <input
                type="radio"
                name="notAdmin"
                value="notAdmin"
                checked={selectedRadio === "notAdmin"}
                onChange={() => handleRadioChange("notAdmin")}
              />
              Ei
            </label>
          </div>
        </div>

        {/*---Save or cancel---*/}
        <div className="flex justify-end lg:w-2/3 mt-4 gap-2">
          <FilledButton onClick={cancel} title="Peruuta" color="grey" />
          <FilledButton
            onClick={sendInvitation}
            title="Lähetä"
            color="orange"
          />
        </div>
      </div>
    </div>
  );
};

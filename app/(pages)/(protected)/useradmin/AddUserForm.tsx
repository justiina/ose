"use client";
import { createNewUser } from "@/app/actions";
import FilledButton from "@/app/components/Buttons";
import React, { useState } from "react";
import toast from "react-hot-toast";

type AddUserProps = {
  cancel: (event: React.MouseEvent<HTMLButtonElement>) => void;
  send: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const AddUserForm: React.FC<AddUserProps> = ({ cancel }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [selectedRadio, setSelectedRadio] = useState<string>("");

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

  const sendInvitation = () => {
    console.log(isAdmin);
  };

  /*
  const sendInvitation = async () => {
    if (!email || !firstName || !lastName) {
      toast.error("Täytä kaikki kentät!");
      return;
    } else {
      const saveOk = await createNewUser(email, firstName, lastName, isAdmin);
      
      if (saveOk) {
        toast.success("Sähköposti lähetetty uudelle käyttäjälle!");
      } else {
        toast.error(saveOk, { id: "sendError" });
        return;
      }
        
    }

    createNewUser(email, firstName, lastName);
  };
  */
  return (
    <div>
      <div className="my-4 bg-white rounded-lg p-4 border border-grey">
        <h2 className="mb-2 text-blue">Uuden käyttäjän lisäys</h2>
        <p className="mb-4">
          Täytä alla olevat tiedot, niin rekisteröitymisohjeet lähetetään
          annettuun sähköpostiosoitteeseen.
        </p>
        <div className="flex flex-col gap-2 lg:w-2/3">
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
            required
          />

          <div className="flex gap-1">
            <label className="font-bold">Sähköposti</label>
            <p className="text-orange">*</p>
          </div>
          <input
            id="email"
            className="border border-grey rounded-lg py-1 px-4 text-sm"
            type="email"
            name="email"
            placeholder="Sähköposti"
            required
          />
          {/*---User role---*/}
          <div className="flex gap-1">
            <label className="font-bold">Annetaanko admin-oikeudet?</label>
            <p className="text-orange">*</p>
          </div>
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

"use client";
import { getUserInfo, updateUserInfo } from "@/app/actions";
import { UserType } from "@/app/components/Types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserInfoField from "@/app/components/UserInfoField";
import { showDateAndTime } from "@/app/components/Functions";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Dropdown, { MultiDropdown } from "@/app/components/Dropdown";
import {
  groupOptions,
  roleOptions,
} from "@/app/components/StyleMappingAndOptions";
import FilledButton, { ToggleSwitch } from "@/app/components/Buttons";

type EditType = {
  editEmail: boolean;
  editPhoneNumber: boolean;
  editGroup: boolean;
  editRole: boolean;
  editShowName: boolean;
  editShowEmail: boolean;
  editShowPhoneNumber: boolean;
};

const UserForm = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [updatedUser, setUpdatedUser] =
    useState<Partial<UserType | null>>(null);
  const [edit, setEdit] = useState<EditType>({
    editEmail: false,
    editPhoneNumber: false,
    editGroup: false,
    editRole: false,
    editShowName: false,
    editShowEmail: false,
    editShowPhoneNumber: false,
  });

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [selectedRadio, setSelectedRadio] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDogOwner, setShowDogOwner] = useState<boolean>(true);
  const searchParams = useSearchParams()!;
  const userId: string | null = searchParams.get("user");
  const router = useRouter();

  // Fetch the user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        if (userData.error) {
          toast.error(userData.error, { id: "fetchError" });
        } else {
          setUser(userData.userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Function to toggle edit mode for a field and set isEdited to true
  const handleEditToggle = (field: keyof EditType) => {
    setEdit((prevEdit) => ({
      ...prevEdit,
      [field]: !prevEdit[field],
    }));
    setIsEdited(true); // Set isEdited to true when any field is edited
    setSelectedRadio(""); // Clear the radio toggle for next radio selection
  };

  const handleCancelEdit = (field: keyof EditType) => {
    setEdit((prevEdit) => ({
      ...prevEdit,
      [field]: !prevEdit[field],
    }));
    setUpdatedUser(user);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...(prevUser as UserType),
      [name]: value,
    }));
    setIsEdited(true); // Set isEdited to true when a field is edited
  };

  const handleEdit = (field: keyof UserType, edit: keyof EditType) => {
    if (
      updatedUser &&
      updatedUser[field] !== undefined &&
      updatedUser[field] !== null
    ) {
      setUser((prevUser) => {
        if (!prevUser) return updatedUser as UserType; // Handle case where prevUser is null
        return {
          ...prevUser,
          [field]: updatedUser[field] !== undefined ? updatedUser[field] : null, // Ensure undefined is replaced with null
        };
      });
      setEdit((prevEdit) => ({
        ...prevEdit,
        [edit]: !prevEdit[edit],
      }));
    }
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    switch (value) {
      case "showName":
        setUpdatedUser((prevUser) => ({
          ...(prevUser as UserType),
          showName: true,
        }));
        break;
      case "dontShowName":
        // if user doesn't want to show name, no need to show other
        // info in the contacts either
        setUpdatedUser((prevUser) => ({
          ...(prevUser as UserType),
          showName: false,
          showEmail: false,
          showPhoneNumber: false,
        }));
        break;
      case "showEmail":
      case "dontShowEmail":
        setUpdatedUser((prevUser) => ({
          ...(prevUser as UserType),
          showEmail: value === "showEmail",
        }));
        break;
      case "showPhoneNumber":
      case "dontShowPhoneNumber":
        setUpdatedUser((prevUser) => ({
          ...(prevUser as UserType),
          showPhoneNumber: value === "showPhoneNumber",
        }));
        break;
    }
  };

  const closeModal = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("user");
    url.searchParams.delete("showDialog");
    window.history.replaceState({}, "", url.toString());
    window.location.reload();
  };

  const handleSave = async () => {
    if (!user) return;
    // Validation: name must be visible if other info visible
    if ((user.showEmail || user.showPhoneNumber) && !user.showName) {
      const confirm = window.confirm(
        "Jos näytät sähköpostin tai puhelinnumeron, myös nimesi tulee näkyä yhteystiedoissa. Haluatko sallia nimen näyttämisen?",
      );

      if (confirm) {
        user.showName = true;
      } else {
        return;
      }
    }
    if (user !== null) {
      const updateOk = await updateUserInfo(user);
      if (updateOk === true) {
        toast.success("Tietojen päivittäminen onnistui!");
        setUser(null);
        window.location.reload();
      }
      if (typeof updateOk === "string") {
        toast.error(updateOk, { id: "updateError" });
      }
    }
  };

  const handleDropdownSelect = (selected: string | string[]) => {
    if (typeof selected === "string") {
      setUpdatedUser((prevUser) => ({
        ...(prevUser as UserType),
        group: selected,
      }));
    } else if (Array.isArray(selected)) {
      setUpdatedUser((prevUser) => ({
        ...(prevUser as UserType),
        role: selected,
      }));
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container max-w-screen-md p-8 lg:p-16">
      <h1 className="mb-4">Omat tiedot</h1>
      <div>
        <p className="mb-4">
          Viikkoryhmäsi sekä roolisi OSEssa näkyvät yhteystiedoissa
          automaattisesti, jos annat luvan näyttää nimesi siellä. Ole yhteydessä
          sihteeriin, jos haluat muokata nimeäsi.
        </p>
      </div>
      <div className="mb-12">
        <button
          onClick={() => setShowDogOwner((prev) => !prev)}
          className="text-orange text-xl font-semibold flex items-center gap-2"
        >
          Koiranohjaaja
          <span className="text-sm">{showDogOwner ? "▲" : "▼"}</span>
        </button>
        {showDogOwner && (
          <div className="flex-col px-4 divide-y divide-greylight items-end justify-between">
            {/*--- Name (not possible to change) ---*/}
            <UserInfoField
              title="Nimi (ei voi muokata)"
              content={`${user?.firstName} ${user?.lastName}` || "-"}
            />
            {/*--- Email ---*/}
            {!edit.editEmail ? (
              <UserInfoField
                title="Sähköpostiosoite"
                content={`${user?.email}` || "-"}
                onEdit={() => handleEditToggle("editEmail")}
              />
            ) : (
              <div>
                {/*--- Edit email ---*/}
                <div>
                  <UserInfoField
                    title="Sähköpostiosoite HUOM! Uuden sähköpostin vaihtaminen ao. kentässä vaihtaa vain yhteystiedot-välilehdelle tulevan sähköpostin. Sisäänkirjautumisessa ja OSEn viestinnässä olevan sähköpostisi voit vaihtaa ottamalla yhteyttä sihteeriin."
                    content=""
                  />
                  <div className="py-2 flex justify-between items-center">
                    <input
                      id="email"
                      className="border border-grey rounded-full mb-4 py-1 px-4 text-sm"
                      type="email"
                      name="email"
                      value={updatedUser?.email || ""}
                      onChange={handleInputChange}
                    />
                    <div>
                      <button
                        className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleCancelEdit("editEmail")}
                      >
                        Peru
                      </button>
                      <button
                        className="bg-blue text-white px-4 py-2 rounded-lg"
                        onClick={() => handleEdit("email", "editEmail")}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*--- Phone number ---*/}
            {!edit.editPhoneNumber ? (
              <UserInfoField
                title="Puhelinnumero"
                content={user?.phoneNumber ? user.phoneNumber : "-"}
                onEdit={() => handleEditToggle("editPhoneNumber")}
              />
            ) : (
              <div>
                {/*--- Edit phone number ---*/}
                <div>
                  <UserInfoField title="Puhelinnumero" content="" />
                  <div className="py-2 flex justify-between items-center">
                    <input
                      id="phoneNumber"
                      className="border border-grey rounded-full mb-4 py-1 px-4 text-sm"
                      type="text"
                      name="phoneNumber"
                      value={updatedUser?.phoneNumber || ""}
                      onChange={handleInputChange}
                    />
                    <div>
                      <button
                        className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleCancelEdit("editPhoneNumber")}
                      >
                        Peru
                      </button>
                      <button
                        className="bg-blue text-white px-4 py-2 rounded-lg"
                        onClick={() =>
                          handleEdit("phoneNumber", "editPhoneNumber")
                        }
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*--- Training group ---*/}
            {!edit.editGroup ? (
              <UserInfoField
                title="Viikkoryhmä"
                content={user?.group || "-"}
                onEdit={() => handleEditToggle("editGroup")}
              />
            ) : (
              <div>
                {/*--- Edit training group ---*/}
                <div>
                  <UserInfoField title="Viikkoryhmä" content="" />
                  <div className="py-2 flex justify-between items-center">
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <Dropdown
                        options={groupOptions}
                        onSelect={handleDropdownSelect}
                      />
                    </div>
                    <div>
                      <button
                        className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleCancelEdit("editGroup")}
                      >
                        Peru
                      </button>
                      <button
                        className="bg-blue text-white px-4 py-2 rounded-lg"
                        onClick={() => handleEdit("group", "editGroup")}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*--- Roles in OSE ---*/}
            {!edit.editRole ? (
              <UserInfoField
                title="Roolit OSEssa"
                content={user?.role || "-"}
                onEdit={() => handleEditToggle("editRole")}
              />
            ) : (
              <div>
                {/*--- Edit roles ---*/}
                <div>
                  <UserInfoField title="Roolit OSEssa" content="" />
                  <div className="py-2 flex justify-between items-center">
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <MultiDropdown
                        options={roleOptions}
                        onSelect={handleDropdownSelect}
                      />
                    </div>
                    <div>
                      <button
                        className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleCancelEdit("editRole")}
                      >
                        Peru
                      </button>
                      <button
                        className="bg-blue text-white px-4 py-2 rounded-lg"
                        onClick={() => handleEdit("role", "editRole")}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*--- Callout group membership (not possible to change) ---*/}
            <UserInfoField
              title="Hälyryhmän jäsen? (ei voi muokata)"
              content={user?.isCalloutMember ? "Kyllä" : "Ei"}
            />

            {/*--- Permission to show name in the contacts ---*/}
            {!edit.editShowName ? (
              <UserInfoField
                title="Saako nimen näyttää yhteystiedoissa?"
                content={(user?.showName && "Kyllä") || "Ei"}
                onEdit={() => handleEditToggle("editShowName")}
              />
            ) : (
              <div>
                {/*--- Edit permission to show name ---*/}
                <div>
                  <UserInfoField
                    title="Saako nimen näyttää yhteystiedoissa?"
                    content=""
                  />
                  <div className="py-2 flex justify-between items-center">
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <div className="flex gap-4">
                        <label className=" flex gap-1">
                          <input
                            type="radio"
                            id="showName"
                            value="showName"
                            checked={selectedRadio === "showName"}
                            onChange={() => handleRadioChange("showName")}
                          />
                          Kyllä
                        </label>
                        <label className=" flex gap-1">
                          <input
                            type="radio"
                            name="dontShowName"
                            value="dontShowName"
                            checked={selectedRadio === "dontShowName"}
                            onChange={() => handleRadioChange("dontShowName")}
                          />
                          Ei
                        </label>
                      </div>
                    </div>
                    <div>
                      <button
                        className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleCancelEdit("editShowName")}
                      >
                        Peru
                      </button>
                      <button
                        className="bg-blue text-white px-4 py-2 rounded-lg"
                        onClick={() => handleEdit("showName", "editShowName")}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*--- Permission to show email in the contacts ---*/}
            {!edit.editShowEmail ? (
              <UserInfoField
                title="Saako sähköpostin näyttää yhteystiedoissa?"
                content={(user?.showEmail && "Kyllä") || "Ei"}
                onEdit={() => handleEditToggle("editShowEmail")}
              />
            ) : (
              <div>
                {/*--- Edit permission to show email ---*/}
                <div>
                  <UserInfoField
                    title="Saako sähköpostin näyttää yhteystiedoissa?"
                    content=""
                  />
                  <div className="py-2 flex justify-between items-center">
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <div className="flex gap-4">
                        <label className=" flex gap-1">
                          <input
                            type="radio"
                            id="showEmail"
                            value="showEmail"
                            checked={selectedRadio === "showEmail"}
                            onChange={() => handleRadioChange("showEmail")}
                          />
                          Kyllä
                        </label>
                        <label className=" flex gap-1">
                          <input
                            type="radio"
                            name="dontShowEmail"
                            value="dontShowEmail"
                            checked={selectedRadio === "dontShowEmail"}
                            onChange={() => handleRadioChange("dontShowEmail")}
                          />
                          Ei
                        </label>
                      </div>
                    </div>
                    <div>
                      <button
                        className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleCancelEdit("editShowEmail")}
                      >
                        Peru
                      </button>
                      <button
                        className="bg-blue text-white px-4 py-2 rounded-lg"
                        onClick={() => handleEdit("showEmail", "editShowEmail")}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*--- Permission to show phone number in the contacts ---*/}
            {!edit.editShowPhoneNumber ? (
              <UserInfoField
                title="Saako puhelinnumeron näyttää yhteystiedoissa?"
                content={(user?.showPhoneNumber && "Kyllä") || "Ei"}
                onEdit={() => handleEditToggle("editShowPhoneNumber")}
              />
            ) : (
              <div>
                {/*--- Edit permission to show phone number ---*/}
                <div>
                  <UserInfoField
                    title="Saako puhelinnumeron näyttää yhteystiedoissa?"
                    content=""
                  />
                  <div className="py-2 flex justify-between items-center">
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <div className="flex gap-4">
                        <label className=" flex gap-1">
                          <input
                            type="radio"
                            id="showPhoneNumber"
                            value="showPhoneNumber"
                            checked={selectedRadio === "showPhoneNumber"}
                            onChange={() =>
                              handleRadioChange("showPhoneNumber")
                            }
                          />
                          Kyllä
                        </label>
                        <label className=" flex gap-1">
                          <input
                            type="radio"
                            name="dontShowPhoneNumber"
                            value="dontShowPhoneNumber"
                            checked={selectedRadio === "dontShowPhoneNumber"}
                            onChange={() =>
                              handleRadioChange("dontShowPhoneNumber")
                            }
                          />
                          Ei
                        </label>
                      </div>
                    </div>
                    <div>
                      <button
                        className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                        onClick={() => handleCancelEdit("editShowPhoneNumber")}
                      >
                        Peru
                      </button>
                      <button
                        className="bg-blue text-white px-4 py-2 rounded-lg"
                        onClick={() =>
                          handleEdit("showPhoneNumber", "editShowPhoneNumber")
                        }
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {isEdited && (
          <div className="flex justify-center mt-8 gap-2 ">
            <FilledButton onClick={closeModal} title="Peruuta" color="grey" />
            <FilledButton
              onClick={handleSave}
              title="Tallenna"
              color="orange"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;

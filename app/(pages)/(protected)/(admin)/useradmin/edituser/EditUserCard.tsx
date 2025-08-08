"use client";
import {
  getUserById,
  getAdminById,
  updateUserById,
  addToAdmins,
  removeFromAdmins,
} from "@/app/actions";
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
  editName: boolean;
  editEmail: boolean;
  editPhoneNumber: boolean;
  editAdmin: boolean;
  editGroup: boolean;
  editRole: boolean;
  editShowName: boolean;
  editShowEmail: boolean;
  editShowPhoneNumber: boolean;
};

const EditUserCard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [updatedUser, setUpdatedUser] =
    useState<Partial<UserType | null>>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [updatedIsAdmin, setUpdatedIsAdmin] = useState<boolean>(false);
  const [edit, setEdit] = useState<EditType>({
    editName: false,
    editEmail: false,
    editPhoneNumber: false,
    editAdmin: false,
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
  const searchParams = useSearchParams()!;
  const userId: string | null = searchParams.get("user");
  const router = useRouter();

  // Fetch the user data
  useEffect(() => {
    if (userId !== null) {
      const fetchData = async () => {
        try {
          const userData = await getUserById(userId);
          if (userData.error) {
            toast.error(userData.error, { id: "fetchError" });
          } else {
            setUser(userData.userData);
            setUpdatedUser(userData.userData);
          }
          const adminInfo = await getAdminById(userId);
          setIsAdmin(adminInfo);
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [userId]);

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

  const handleAdminEdit = () => {
    setIsAdmin(updatedIsAdmin);
    setEdit((prevEdit) => ({
      ...prevEdit,
      editAdmin: false,
    }));
    setIsEdited(true);
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    switch (value) {
      case "isAdmin":
        setUpdatedIsAdmin(true);
        break;
      case "isNotAdmin":
        setUpdatedIsAdmin(false);
        break;
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
    // Save user and admin info
    if (user !== null && userId !== null) {
      const updateOk = await updateUserById(user);
      let adminUpdateOk: boolean | null = null;
      console.log("Admin-oikeudet:", isAdmin);

      if (isAdmin) {
        adminUpdateOk = await addToAdmins(userId, user?.email);
      } else {
        adminUpdateOk = await removeFromAdmins(userId);
      }

      if (updateOk && adminUpdateOk) {
        toast.success("Tietojen päivittäminen onnistui!");
        closeModal();
      }
      if (typeof updateOk === "string") {
        toast.error(updateOk, { id: "updateError" });
      }
      if (!adminUpdateOk) {
        toast.error(
          "Käyttäjäoikeuksien päivittäminen epäonnistui!\nYritä myöhemmin uudelleen.",
          { id: "adminUpdateError" }
        );
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
    <div className="mb-12">
      {isEdited && (
        <div className="flex justify-center mt-8 gap-2 ">
          <FilledButton onClick={closeModal} title="Peruuta" color="grey" />
          <FilledButton onClick={handleSave} title="Tallenna" color="orange" />
        </div>
      )}
      <div className="flex-col px-4 divide-y divide-greylight items-end justify-between">
        {/*--- Name ---*/}
        {!edit.editName ? (
          <UserInfoField
            title="Nimi"
            content={`${user?.firstName} ${user?.lastName}` || "-"}
            onEdit={() => handleEditToggle("editName")}
          />
        ) : (
          <div>
            {/*--- Edit first name ---*/}
            <div>
              <UserInfoField title="Etunimi" content="" />
              <div className="py-2 flex justify-between items-center">
                <input
                  id="firstName"
                  className="border border-grey rounded-full mb-4 py-1 px-4 text-sm"
                  type="firstName"
                  name="firstName"
                  value={updatedUser?.firstName || ""}
                  onChange={handleInputChange}
                />
                <div>
                  <button
                    className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                    onClick={() => handleCancelEdit("editName")}
                  >
                    Peru
                  </button>
                  <button
                    className="bg-blue text-white px-4 py-2 rounded-lg mr-1"
                    onClick={() => handleEdit("firstName", "editName")}
                  >
                    OK
                  </button>
                </div>
              </div>
              {/*--- Edit last name ---*/}
              <UserInfoField title="Sukunimi" content="" />
              <div className="py-2 flex justify-between items-center">
                <input
                  id="lastName"
                  className="border border-grey rounded-full mb-4 py-1 px-4 text-sm"
                  type="lastName"
                  name="lastName"
                  value={updatedUser?.lastName || ""}
                  onChange={handleInputChange}
                />
                <div>
                  <button
                    className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                    onClick={() => handleCancelEdit("editName")}
                  >
                    Peru
                  </button>
                  <button
                    className="bg-blue text-white px-4 py-2 rounded-lg"
                    onClick={() => handleEdit("lastName", "editName")}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
              <UserInfoField title="Sähköpostiosoite" content="" />
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

        {/*--- User rights ---*/}
        {!edit.editAdmin ? (
          <UserInfoField
            title="Käyttäjän oikeudet"
            content={isAdmin ? "Admin-käyttäjä" : "Peruskäyttäjä"}
            onEdit={() => handleEditToggle("editAdmin")}
          />
        ) : (
          <div>
            {/*--- Edit user rights ---*/}
            <div>
              <UserInfoField
                title="Annetaanko käyttäjälle admin-oikeudet?"
                content=""
              />
              <div className="py-2 flex justify-between items-center">
                <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                  <div className="flex gap-4">
                    <label className=" flex gap-1">
                      <input
                        type="radio"
                        id="isAdmin"
                        value="isAdmin"
                        checked={selectedRadio === "isAdmin"}
                        onChange={() => handleRadioChange("isAdmin")}
                      />
                      Kyllä
                    </label>
                    <label className=" flex gap-1">
                      <input
                        type="radio"
                        name="isNotAdmin"
                        value="isNotAdmin"
                        checked={selectedRadio === "isNotAdmin"}
                        onChange={() => handleRadioChange("isNotAdmin")}
                      />
                      Ei
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    className="bg-grey text-white px-4 py-2 rounded-lg mr-1"
                    onClick={() => handleCancelEdit("editAdmin")}
                  >
                    Peru
                  </button>
                  <button
                    className="bg-blue text-white px-4 py-2 rounded-lg"
                    onClick={() => handleAdminEdit()}
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
                    onClick={() => handleEdit("phoneNumber", "editPhoneNumber")}
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

        <UserInfoField
          title="Tunnus (ei voi muokata)"
          content={user?.id || "-"}
        />

        <UserInfoField
          title="Tunnuksen luontipäivä (ei voi muokata)"
          content={user?.created ? showDateAndTime(user.created) : "-"}
        />

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
                        onChange={() => handleRadioChange("showPhoneNumber")}
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
    </div>
  );
};

export default EditUserCard;

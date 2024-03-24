"use client";
import { getUserInfo, updateUserInfo } from "@/app/actions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import UserInfoField from "@/app/(pages)/(protected)/userinfo/UserInfoField";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { TbEye } from "react-icons/tb";
import { TbEyeClosed } from "react-icons/tb";
import Dropdown, { MultiDropdown } from "@/app/components/Dropdown";

interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  group: string;
  role: string[];
  showName: boolean | undefined;
  showEmail: boolean;
  showPhoneNumber: boolean;
}

interface EditType {
  editName: boolean;
  editEmail: boolean;
  editPhoneNumber: boolean;
  editGroup: boolean;
  editRole: boolean;
}

const UserForm = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<EditType>({
    editName: false,
    editEmail: false,
    editPhoneNumber: false,
    editGroup: false,
    editRole: false,
  });
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [selectedRadio, setSelectedRadio] = useState<string>("");

  // List of training groups for dropdown list
  const groupOptions = ["MaA", "MaB", "TiA", "TiB", "Raahe", "Ei ryhmää"];

  // List of member roles in OSE for dropdown list
  const roleOptions = [
    "Hallituksen jäsen",
    "Hallituksen puheenjohtaja",
    "Hallituksen varapuheenjohtaja",
    "Sihteeri",
    "Rahastonhoitaja",
    "Koesihteeri",
    "Koulutusvastaava",
    "Talkoopistevastaava",
    "Kouluttaja",
    "Hälytoimikunnan puheenjohtaja",
    "Hälytoimikunnan jäsen",
    "Varustevastaava",
    "Kartta- ja viestisovellusyhteyshenkilö",
    "Varainhankintatoimikunnan jäsen",
    "Web-master",
    "Koulutustoimikunnan jäsen",
    "Vapepa-yhteyshenkilö",
    "Vapepan edustaja",
    "SPeKL:n edustaja",
  ];

  // Fetch the user data
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserInfo();
      if (userData !== null) {
        setUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          group: userData.group || "",
          role: userData.role || [],
          showName: userData.showName || false,
          showEmail: userData.showEmail || false,
          showPhoneNumber: userData.showPhoneNumber || false,
        });
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
    setIsEdited(true); // Set isEdited to true when a field is edited
    setSelectedRadio(""); // Clear the radio toggle for next radio selection
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    switch (value) {
      case "showName":
        setUser((prevUser) => ({
          ...(prevUser as UserType),
          showName: true,
        }));
        break;
      case "dontShowName":
        // if user doesn't want to show name, no need to show other
        // info in the contacts either
        setUser((prevUser) => ({
          ...(prevUser as UserType),
          showName: false,
          showEmail: false,
          showPhoneNumber: false,
        }));
        break;
      case "showEmail":
      case "dontShowEmail":
        setUser((prevUser) => ({
          ...(prevUser as UserType),
          showEmail: value === "showEmail",
        }));
        break;
      case "showPhoneNumber":
      case "dontShowPhoneNumber":
        setUser((prevUser) => ({
          ...(prevUser as UserType),
          showPhoneNumber: value === "showPhoneNumber",
        }));
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...(prevUser as UserType),
      [name]: value,
    }));
    setIsEdited(true); // Set isEdited to true when a field is edited
  };
  const handleDropdownSelect = (selected: string | string[]) => {
    if (typeof selected === "string") {
      setUser((prevUser) => ({
        ...(prevUser as UserType),
        group: selected,
      }));
    } else if (Array.isArray(selected)) {
      setUser((prevUser) => ({
        ...(prevUser as UserType),
        role: selected,
      }));
    }
  };

  const handleCancel = () => {
    setUser(null);
    window.location.reload();
  };

  const handleSave = async () => {
    if (user !== null) {
      const updateOk = await updateUserInfo(user);
      if (updateOk) {
        toast.success("Tietojen päivittäminen onnistui!");
        setUser(null);
        window.location.reload();
      } else {
        toast.error(updateOk, { id: "updateError" });
      }
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container max-w-screen-md p-8 md:p-16">
      <h1 className="mb-4">Omat tiedot</h1>
      <div>
        <p className="mb-4">
          Avonainen silmän kuva tietokentän vieressä tarkoittaa, että tiedon saa
          näyttää Yhteystiedot-sivulla muille OSElaisille. Voit muokata tätä ja
          itse tietokenttää kynäikonin kautta.
        </p>
        <p className="mb-4">
          Viikkoryhmäsi sekä roolisi OSEssa näkyvät yhteystiedoissa
          automaattisesti, jos annat luvan näyttää nimesi siellä. Ole yhteydessä
          sihteeriin, jos haluat muokata nimeäsi.
        </p>
      </div>

      {/*--- Dog owner ---*/}
      <div>
        <h2 className="text-orange">Koiranohjaaja</h2>
        <div className="px-4 divide-y divide-greylight">
          {/*--- Name ---*/}
          <div>
            {!edit.editName ? (
              <>
                <div className="flex items-end justify-between">
                  <UserInfoField
                    title="Nimi"
                    content={`${user?.firstName} ${user?.lastName}`}
                  />
                  <div className="flex gap-2 py-2">
                    {user?.showName ? (
                      <TbEye className="text-2xl text-grey" />
                    ) : (
                      <TbEyeClosed className="text-2xl text-grey" />
                    )}
                    <MdOutlineEdit
                      onClick={() => handleEditToggle("editName")}
                      className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/*--- Edit name ---*/}
                <div className="flex items-end justify-between">
                  <UserInfoField
                    title="Nimi"
                    content={`${user?.firstName} ${user?.lastName}`}
                  />
                  <div className="flex gap-2 py-2">
                    <IoIosCheckmarkCircle
                      onClick={() => handleEditToggle("editName")}
                      className="text-3xl cursor-pointer text-blue hover:text-green"
                    />
                  </div>
                </div>
                <div className="flex gap-6 pb-4">
                  <p>Näytetäänkö yhteystiedoissa?</p>
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
              </>
            )}
          </div>

          {/*--- Email ---*/}
          <div>
            {!edit.editEmail ? (
              <>
                <div className="flex items-end justify-between">
                  <UserInfoField title="Sähköposti" content={user?.email} />
                  <div className="flex gap-2 py-2">
                    {user?.showEmail ? (
                      <TbEye className="text-2xl text-grey" />
                    ) : (
                      <TbEyeClosed className="text-2xl text-grey" />
                    )}
                    <MdOutlineEdit
                      onClick={() => handleEditToggle("editEmail")}
                      className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/*--- Edit email ---*/}
                <div className="flex items-end justify-between">
                  <div>
                    <UserInfoField title="Sähköposti" content="" />
                    <input
                      id="email"
                      className="border border-grey rounded-full mb-4 py-1 px-4 text-sm"
                      type="email"
                      name="email"
                      value={user?.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex gap-2 py-2">
                    <IoIosCheckmarkCircle
                      onClick={() => handleEditToggle("editEmail")}
                      className="text-3xl cursor-pointer text-blue hover:text-green"
                    />
                  </div>
                </div>
                <div className="flex gap-6 pb-4">
                  <p>Näytetäänkö yhteystiedoissa?</p>
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
              </>
            )}
          </div>

          {/*--- Phone number ---*/}
          <div>
            {!edit.editPhoneNumber ? (
              <>
                <div className="flex items-end justify-between">
                  <UserInfoField
                    title="Puhelinnumero"
                    content={user?.phoneNumber}
                  />
                  <div className="flex gap-2 py-2">
                    {user?.showPhoneNumber ? (
                      <TbEye className="text-2xl text-grey" />
                    ) : (
                      <TbEyeClosed className="text-2xl text-grey" />
                    )}
                    <MdOutlineEdit
                      onClick={() => handleEditToggle("editPhoneNumber")}
                      className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/*--- Edit phone number ---*/}
                <div className="flex items-end justify-between">
                  <div>
                    <UserInfoField title="Puhelinnumero" content="" />
                    <input
                      id="phoneNumber"
                      className="border border-grey rounded-full mb-4 py-1 px-4 text-sm"
                      type="text"
                      name="phoneNumber"
                      value={user?.phoneNumber || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex gap-2 py-2">
                    <IoIosCheckmarkCircle
                      onClick={() => handleEditToggle("editPhoneNumber")}
                      className="text-3xl cursor-pointer text-blue hover:text-green"
                    />
                  </div>
                </div>
                <div className="flex gap-6 pb-4">
                  <p>Näytetäänkö yhteystiedoissa?</p>
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
              </>
            )}
          </div>

          {/*--- Training group ---*/}
          <div>
            {!edit.editGroup ? (
              <>
                <div className="flex items-end justify-between">
                  <UserInfoField
                    title="Viikkoryhmä"
                    content={
                      user?.group.length === 0 ? "Valitse ryhmä" : user?.group
                    }
                  />
                  <div className="flex gap-2 py-2">
                    {user?.showName ? (
                      <TbEye className="text-2xl text-grey" />
                    ) : (
                      <TbEyeClosed className="text-2xl text-grey" />
                    )}
                    <MdOutlineEdit
                      onClick={() => handleEditToggle("editGroup")}
                      className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/*--- Edit training group ---*/}
                <div className="flex items-end justify-between">
                  <div>
                    <UserInfoField title="Viikkoryhmä" content="" />
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <Dropdown
                        options={groupOptions}
                        onSelect={handleDropdownSelect}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 py-2">
                    <IoIosCheckmarkCircle
                      onClick={() => handleEditToggle("editGroup")}
                      className="text-3xl cursor-pointer text-blue hover:text-green"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/*--- Roles in OSE ---*/}
          <div>
            {!edit.editRole ? (
              <>
                <div className="flex items-end justify-between">
                  <UserInfoField title="Roolit OSEssa" content={user?.role} />
                  <div className="flex gap-2 py-2">
                    {user?.showName ? (
                      <TbEye className="text-2xl text-grey" />
                    ) : (
                      <TbEyeClosed className="text-2xl text-grey" />
                    )}
                    <MdOutlineEdit
                      onClick={() => handleEditToggle("editRole")}
                      className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/*--- Edit roles ---*/}
                <div className="flex items-end justify-between">
                  <div>
                    <UserInfoField title="Roolit OSEssa" content="" />
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <MultiDropdown
                        options={roleOptions}
                        onSelect={handleDropdownSelect}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 py-2">
                    <IoIosCheckmarkCircle
                      onClick={() => handleEditToggle("editRole")}
                      className="text-3xl cursor-pointer text-blue hover:text-green"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {isEdited && (
          <div className="flex justify-end mt-8">
            <button
              onClick={handleCancel}
              className="mr-2 px-4 py-2 text-white bg-grey rounded-lg hover:bg-greyhover"
            >
              Peruuta
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orangehover"
            >
              Tallenna
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;

"use client";
import { useFormState } from "react-dom";
import { getUserInfo, updateUserInfo } from "@/app/actions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import UserInfoField from "@/app/(pages)/(protected)/userinfo/UserInfoField";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { TbEye } from "react-icons/tb";
import { TbEyeClosed } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { setuid } from "process";

interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  group: string;
  role: {};
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

  const [state, formAction] = useFormState<any, FormData>(
    updateUserInfo,
    undefined
  );
  const [selectedRadio, setSelectedRadio] = useState<string>("");

  if (state?.error) {
    toast.error(state.error, { id: "updateError" });
  }

  if (state?.message) {
    toast.success(state.message, { id: "updateSuccess" });
    setUser(null);
    window.location.reload();
  }

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
          role: userData.role || {},
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

  const handleCancel = () => {
    setUser(null);
    window.location.reload();
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
                      onClick={() =>
                        setEdit((edit) => ({
                          ...edit,
                          editName: true,
                          editEmail: false,
                          editPhoneNumber: false,
                          editGroup: false,
                          editRole: false,
                        }))
                      }
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
                      onClick={() =>
                        setEdit((edit) => ({
                          ...edit,
                          editName: false,
                          editEmail: true,
                          editPhoneNumber: false,
                          editGroup: false,
                          editRole: false,
                        }))
                      }
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
                    onClick={() =>
                      setEdit((edit) => ({
                        ...edit,
                        editPhoneNumber: !edit.editPhoneNumber,
                      }))
                    }
                    className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                  />
                </div>
              </div>
            </>
          ) : (
            <>{/*--- Editing section here ---*/}</>
          )}

          {/*--- Group ---*/}
          {!edit.editGroup ? (
            <>
              <div className="flex items-end justify-between">
                <UserInfoField title="Treeniryhmä" content="MaA" />
                <div className="flex gap-2 py-2">
                  {/*--- If ok to show name, it is also ok to show the group ---*/}
                  {user?.showName ? (
                    <TbEye className="text-2xl text-grey" />
                  ) : (
                    <TbEyeClosed className="text-2xl text-grey" />
                  )}
                  <MdOutlineEdit
                    onClick={() =>
                      setEdit((edit) => ({
                        ...edit,
                        editGroup: !edit.editGroup,
                      }))
                    }
                    className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                  />
                </div>
              </div>
            </>
          ) : (
            <>{/*--- Editing section here ---*/}</>
          )}

          {/*--- Roles in OSE ---*/}
          {!edit.editRole ? (
            <>
              <div className="flex items-end justify-between">
                <UserInfoField
                  title="Rooli OSEssa"
                  content="Rahastonhoitaja, webmaster"
                />
                <div className="flex gap-2 py-2">
                  {/*--- If ok to show name, it is also ok to show the roles ---*/}
                  {user?.showName ? (
                    <TbEye className="text-2xl text-grey" />
                  ) : (
                    <TbEyeClosed className="text-2xl text-grey" />
                  )}
                  <MdOutlineEdit
                    onClick={() =>
                      setEdit((edit) => ({
                        ...edit,
                        editRole: !edit.editRole,
                      }))
                    }
                    className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                  />
                </div>
              </div>
            </>
          ) : (
            <>{/*--- Editing section here ---*/}</>
          )}
        </div>
        {isEdited && (
          <div className="flex gap-2 justify-center mt-4">
            <button className="bg-grey hover:bg-blue active:bg-blue text-white px-5 py-2 rounded-full text-sm mt-4">
              Peruuta
            </button>
            <button className="bg-orange hover:bg-blue active:bg-blue text-white px-5 py-2 rounded-full text-sm mt-4">
              Tallenna
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;

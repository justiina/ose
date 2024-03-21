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
  const [change, setChange] = useState<boolean>(false);
  const [state, formAction] = useFormState<any, FormData>(
    updateUserInfo,
    undefined
  );

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
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          group: userData.group,
          role: userData.role,
          showName: userData.showName,
          showEmail: userData.showEmail,
          showPhoneNumber: userData.showPhoneNumber,
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

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

      <>
        <div>
          <p className="mb-4">
            Avonainen silmän kuva tietokentän vieressä tarkoittaa, että tiedon
            saa näyttää Yhteystiedot-sivulla muille OSElaisille. Voit muokata
            tätä ja itse tietokenttää kynäikonin kautta.
          </p>
          <p className="mb-4">
            Viikkoryhmäsi sekä roolisi OSEssa näkyvät yhteystiedoissa
            automaattisesti, jos annat luvan näyttää nimesi siellä. Ole
            yhteydessä sihteeriin, jos haluat muokata nimeäsi.
          </p>
        </div>

        {/*--- Dog owner ---*/}
        <h2 className="text-orange">Koiranohjaaja</h2>
        <div className="divide-y divide-greylight">
          {/*--- Name ---*/}
          {!edit.editName ? (
            <>
              <div className="flex items-end justify-between">
                <UserInfoField
                  title="Nimi"
                  content={`${user?.firstName} ${user?.lastName}`}
                />
                <div className="flex gap-2 py-2">
                  {user?.showName ? (
                    <TbEye className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
                  ) : (
                    <TbEyeClosed className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
                  )}
                  <MdOutlineEdit
                    onClick={() =>
                      setEdit((edit) => ({
                        ...edit,
                        editName: !edit.editName,
                      }))
                    }
                    className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                  />
                </div>
              </div>
            </>
          ) : (
            <>{/*--- Editin section here ---*/}</>
          )}

          {/*--- Email ---*/}
          {!edit.editEmail ? (
            <>
              <div className="flex items-end justify-between">
                <UserInfoField title="Sähköposti" content={user?.email} />
                <div className="flex gap-2 py-2">
                  {user?.showEmail ? (
                    <TbEye className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
                  ) : (
                    <TbEyeClosed className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
                  )}
                  <MdOutlineEdit
                    onClick={() =>
                      setEdit((edit) => ({
                        ...edit,
                        editEmail: !edit.editEmail,
                      }))
                    }
                    className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
                  />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

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
                    <TbEye className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
                  ) : (
                    <TbEyeClosed className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
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
            <>{/*--- Editin section here ---*/}</>
          )}

          {/*--- Group ---*/}
          {!edit.editGroup ? (
            <>
              <div className="flex items-end justify-between">
                <UserInfoField title="Treeniryhmä" content="MaA" />
                <div className="flex gap-2 py-2">
                  {/*--- If ok to show name, it is also ok to show the group ---*/}
                  {user?.firstName ? (
                    <TbEye className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
                  ) : (
                    <TbEyeClosed className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
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
            <>{/*--- Editin section here ---*/}</>
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
                  {user?.firstName ? (
                    <TbEye className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
                  ) : (
                    <TbEyeClosed className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue" />
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
            <>{/*--- Editin section here ---*/}</>
          )}
        </div>
      </>
    </div>
  );
};

export default UserForm;

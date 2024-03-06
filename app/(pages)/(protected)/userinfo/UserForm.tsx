"use client";
import { useFormState } from "react-dom";
import { getUserInfo, updateUserInfo } from "@/app/actions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";

interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  showFirstName: string | null;
  showLastName: string | null;
  showEmail: string | null;
  showPhoneNumber: string | null;
}

const UserForm = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [state, formAction] = useFormState<any, FormData>(
    updateUserInfo,
    undefined
  );

  if (state?.error) {
    toast.error(state.error, { id: "updateError" });
  }

  if (state?.message) {
    toast.success(state.message, { id: "updateSuccess" });
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
          showFirstName: userData.showFirstName,
          showLastName: userData.showLastName,
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
    <div className="container mx-auto p-8 md:p-16">
      <h1 className="mb-4">Päivitä omat tietosi</h1>
      <p className="mb-4 md:w-2/3">
        Merkitse ruksi kentän vieressä olevaan laatikkoon, mikäli tiedon saa
        näyttää Yhteystiedot-sivulla muille OSElaisille. Täytä ainakin tähdellä
        merkityt kohdat.
      </p>

      <form action={formAction}>
        {/*--- First name ---*/}
        <label className="flex gap-1 font-bold mt-4">
          <p>Etunimi</p>
          <p className="text-orange">*</p>
        </label>
        <div className="flex gap-2">
          <input
            id="firstName"
            className="border md:w-1/3 border-grey rounded-full py-1 px-4 text-sm"
            type="text"
            name="firstName"
            placeholder={user?.firstName || "Etunimi"}
            required
          />
          <div className="flex items-center gap-1">
            <input type="checkbox" name="showFirstName" id="showFirstName" />
            <label className="text-xs">Saa näyttää</label>
          </div>
        </div>

        {/*--- Last name ---*/}
        <label className="flex gap-1 font-bold mt-4">
          <p>Sukunimi</p>
          <p className="text-orange">*</p>
        </label>
        <div className="flex gap-2">
          <input
            id="lastName"
            className="border md:w-1/3 border-grey rounded-full py-1 px-4 text-sm"
            type="text"
            name="lastName"
            placeholder={user?.lastName || "Sukunimi"}
            required
          />
          <div className="flex items-center gap-1">
            <input type="checkbox" name="showLastName" id="showLastName" />
            <label className="text-xs">Saa näyttää</label>
          </div>
        </div>

        {/*--- Sähköposti ---*/}
        <label className="flex gap-1 font-bold mt-4">
          <p>Sähköposti</p>
        </label>
        <div className="flex gap-2">
          <input
            id="email"
            className="border md:w-1/3 border-grey rounded-full py-1 px-4 text-sm"
            type="email"
            name="email"
            placeholder={user?.email || "Sähköposti"}
          />
          <div className="flex items-center gap-1">
            <input type="checkbox" name="showEmail" id="showEmail" />
            <label className="text-xs">Saa näyttää</label>
          </div>
        </div>

        {/*--- Phone number ---*/}
        <label className="flex gap-1 font-bold mt-4">
          <p>Puhelinnumero</p>
        </label>
        <div className="flex gap-2">
          <input
            id="phoneNumber"
            className="border md:w-1/3 border-grey rounded-full py-1 px-4 text-sm"
            type="text"
            name="phoneNumber"
            placeholder={user?.phoneNumber || "Puhelinnumero"}
          />
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              name="showPhoneNumber"
              id="showPhoneNumber"
            />
            <label className="text-xs">Saa näyttää</label>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="button"
            value="Peruuta"
            onClick={handleCancel}
            className="bg-grey hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm mt-8"
          />
          <input
            type="submit"
            value="Tallenna"
            className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm mt-8"
          />
        </div>
      </form>
    </div>
  );
};

export default UserForm;

"use client";
import { getUserById } from "@/app/actions";
import { UserType } from "@/app/components/Types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserInfoField from "@/app/components/UserInfoField";

const DeleteUserCard = () => {
  const [user, setUser] = useState<UserType | null>(null);
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
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [userId]);

  return (
    <div className="mb-12">
      <div className="flex-col px-4 divide-y divide-greylight items-end justify-between">
        <UserInfoField
          title="Nimi"
          content={`${user?.firstName} ${user?.lastName}` || "-"}
        />
        <UserInfoField
          title="Sähköpostiosoite"
          content={`${user?.email}` || "-"}
        />
        <UserInfoField
          title="Puhelinnumero"
          content={`${user?.phoneNumber}` || "-"}
        />
        <UserInfoField title="Viikkoryhmä" content={user?.group || "-"} />
        <UserInfoField title="Tunnus" content={user?.id || "-"} />
        <UserInfoField title="Luontipäivä" content={user?.created || "-"} />
        <UserInfoField title="Roolit OSEssa" content={user?.role || "-"} />
        <UserInfoField
          title="Saako nimen näyttää yhteystiedoissa?"
          content={(user?.showName && "Kyllä") || "Ei"}
        />
        <UserInfoField
          title="Saako sähköpostin näyttää yhteystiedoissa?"
          content={(user?.showEmail && "Kyllä") || "Ei"}
        />
        <UserInfoField
          title="Saako puhelinnumeron näyttää yhteystiedoissa?"
          content={(user?.showPhoneNumber && "Kyllä") || "Ei"}
        />
      </div>
    </div>
  );
};

export default DeleteUserCard;

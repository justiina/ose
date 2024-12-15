"use client";
import { getAllUsers } from "@/app/actions";
import Dialog from "@/app/components/Dialog";
import DeleteUserCard from "./DeleteUserCard";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { UserType } from "@/app/components/Types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DeleteUserFrom = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getAllUsers();
        if (userData !== undefined) {
          if ("error" in userData) {
            toast.error(userData.error, { id: "fetchError" });
          } else {
            const userArray: UserType[] = userData.map(
              (doc) => doc as UserType
            );
            setUsers(userArray);
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "fetchError",
        });
      }
    };
    fetchData();
  }, []);

  const closeModal = async () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("user");
    window.history.replaceState({}, "", url.toString());
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <div className="container max-w-screen-md">
        <div className="mb-8">
          <h1 className="mb-4">Kaikki rekisteröityneet käyttäjät</h1>
          <div>
            <div className="grid space-y-4 p-4">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/useradmin/deleteuser?showDialog=y&user=${user.id}`}
                  className="bg-white shadow rounded-lg p-4 hover:bg-orange transition duration-300"
                >
                  {user.lastName} {user.firstName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog title="Käyttäjän tiedot" onClose={closeModal}>
        <DeleteUserCard />
      </Dialog>
    </>
  );
};

export default DeleteUserFrom;

"use client";
import { deleteUser, getAllUsers, updateUserRole } from "@/app/actions";
import Dialog from "@/app/components/Dialog";
import EditUserCard from "./EditUserCard";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { UserType } from "@/app/components/Types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FilledButton, { ToggleSwitch } from "@/app/components/Buttons";
import { IoTrash } from "react-icons/io5";

const EditUserForm = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteUid, setDeleteUid] = useState<string | null>(null);

  // Fetch the users data
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

  const handleToggle = (newState: boolean) => {
    setShowDelete(newState);
  };

  const handleDelete = (uid: string | null) => {
    if (uid === null) {
      toast.error(
        "Käyttäjätunnusta ei löytynyt!\nYritä myöhemmin uudestaan ja ota yhteys sivuston ylläpitäjään, jos ongelma toistuu."
      );
    }
    setShowConfirmation(true);
    setDeleteUid(uid);
  };

  const cancel = () => {
    setShowConfirmation(false);
    setDeleteUid(null);
  };

  const confirmDelete = async () => {
    if (deleteUid) {
      const deleteOk = await deleteUser(deleteUid);
      if (!deleteOk) {
        toast.error(deleteOk, { id: "deleteError" });
        return;
      }
      toast.success("Käyttäjän poistaminen onnistui!", { id: "deleteOk" });
      setShowConfirmation(false);
      setDeleteUid(null);
      window.location.reload();
    } else toast.error("Jotain meni vikaan\nTarkista käyttäjätiedot.");
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <div className="container max-w-screen-md">
        <div className="mb-8">
          <h1 className="mb-4">Kaikki rekisteröityneet käyttäjät</h1>
          <div className="flex justify-end">
            <ToggleSwitch
              title="Käyttäjän poistaminen"
              isOn={showDelete}
              onToggle={handleToggle}
            />
          </div>
          <div>
            <div className="grid space-y-4 p-4">
              {users.map((user) => (
                <Link
                  className="flex justify-between bg-white shadow rounded-lg p-4 hover:bg-orange transition duration-300"
                  key={user.id}
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/useradmin/edituser?showDialog=y&user=${user.id}`}
                >
                  {user.lastName} {user.firstName}
                  {showDelete && (
                    <IoTrash
                      className="text-orange hover:text-background text-2xl cursor-pointer"
                      onClick={() => handleDelete(user.id)}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog title="Käyttäjän tiedot" onClose={closeModal}>
        <EditUserCard />
      </Dialog>
      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl">Haluatko varmasti poistaa käyttäjän?</h2>
            <h2 className="text-xl mb-4 text-red-700">
              HUOM! Tätä toimintoa ei voi peruuttaa!!
            </h2>
            <div className="flex justify-end gap-2">
              <FilledButton onClick={cancel} title="Peruuta" color="grey" />
              <FilledButton onClick={confirmDelete} title="OK" color="orange" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUserForm;

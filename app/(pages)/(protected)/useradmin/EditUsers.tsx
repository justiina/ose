"use client";
import FilledButton from "@/app/components/Buttons";
import { useState } from "react";
import { RiUserAddLine } from "react-icons/ri";
import { AddUserForm } from "./AddUserForm";

const EditUsers = () => {
  const [showAddUser, setShowAddUser] = useState<boolean>(false);

  return (
    <div className="mx-4">
      {/*---Add new user---*/}
      {showAddUser ? (
        <AddUserForm
          cancel={() => setShowAddUser(!showAddUser)}
          send={() => setShowAddUser(!showAddUser)}
        />
      ) : (
        <FilledButton
          onClick={() => setShowAddUser(!showAddUser)}
          title="Lisää käyttäjä"
          color="blue"
          icon={<RiUserAddLine className="text-xl" />}
        />
      )}
    </div>
  );
};

export default EditUsers;

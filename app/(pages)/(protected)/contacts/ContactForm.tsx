"use client"; // This file is purely client-side
import { useEffect, useState } from "react";
import { getAllUsersWithConsent } from "@/app/actions";
import toast from "react-hot-toast";
import { UserType } from "@/app/components/Types";

const ContactForm = () => {
  const [contacts, setContacts] = useState<UserType[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<UserType[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Fetch users on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const allUsers = await getAllUsersWithConsent();
        if (!allUsers || "error" in allUsers) {
          toast.error(allUsers?.error || "Failed to fetch users", {
            id: "fetchError",
          });
          return;
        }

        const userList = allUsers.map((doc: UserType) => doc as UserType);
        setContacts(userList);
        setFilteredContacts(userList);
      } catch (err) {
        toast.error("Error fetching contacts", { id: "fetchError" });
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts whenever selectedRole changes
  useEffect(() => {
    if (selectedRole === "all") {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter((user) => user.role?.includes(selectedRole))
      );
    }
  }, [selectedRole, contacts]);

  const allRoles = Array.from(
    new Set(contacts.flatMap((user) => user.role || []))
  );

  return (
    <div>
      {/* Filter dropdown */}
      <div className="mb-4">
        <label htmlFor="roleFilter" className="mr-2 font-medium">
          Suodata roolin mukaan:
        </label>
        <select
          id="roleFilter"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">Kaikki</option>
          {allRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Contact table */}
      <table className="mb-8 w-full border-collapse border">
        <thead>
          <tr>
            <th className="bg-blue p-2 border">Nimi</th>
            <th className="bg-blue p-2 border">Treeniryhmä</th>
            <th className="bg-blue p-2 border">Sähköposti</th>
            <th className="bg-blue p-2 border">Puhelinnumero</th>
            <th className="bg-blue p-2 border">Rooli(t) OSEssa</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">
                {user.lastName} {user.firstName}
              </td>
              <td className="border p-2">{user.group || "-"}</td>
              <td className="border p-2">{user.showEmail ? user.email : "-"}</td>
              <td className="border p-2">
                {user.showPhoneNumber ? user.phoneNumber : "-"}
              </td>
              <td className="border p-2">
                {user.role?.map((role, index) => (
                  <p key={index}>{role}</p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactForm;
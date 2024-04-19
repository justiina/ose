import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getAllUsersWithConsent } from "@/app/actions";
import toast from "react-hot-toast";
import { UserType } from "@/app/components/Types";

const Contacts = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/");
  }

  let contacts: UserType[] = [];

  const allUsers = await getAllUsersWithConsent();
  if (allUsers !== undefined) {
    if ("error" in allUsers) {
      toast.error(allUsers.error, { id: "fetchError" });
    } else {
      contacts = allUsers.map((doc) => doc as UserType);
    }
  }

  return (
    <div className="container max-w-screen p-8 lg:p-16">
      <div className="mb-8">
        <h1 className="mb-4">Yhteystiedot</h1>

        <table className="mb-8">
          <tr>
            <th className="bg-blue" scope="col">
              Nimi
            </th>
            <th className="bg-blue" scope="col">
              Treeniryhmä
            </th>
            <th className="bg-blue" scope="col">
              Sähköposti
            </th>
            <th className="bg-blue" scope="col">
              Puhelinnumero
            </th>
            <th className="bg-blue" scope="col">
              Rooli(t) OSEssa
            </th>
          </tr>
          {contacts.map((user) => (
            <tr key={user.id}>
              <td>
                {user.lastName} {user.firstName}
              </td>
              <td>{user.group ? user.group : "-"}</td>
              <td>{user.showEmail ? user.email : "-"}</td>
              <td>{user.showPhoneNumber ? user.phoneNumber : "-"}</td>
              <td>
                {user.role?.map((role, index) => (
                  <p key={index}>{role}</p>
                ))}
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Contacts;

import { FilledLink } from "@/app/components/Buttons";
import { RiUserAddLine, RiUserForbidLine } from "react-icons/ri";

const EditUsers = () => {
  return (
    <div className="mx-4">
      {/*---Add new user---*/}
      <FilledLink
        title="Lisää käyttäjä"
        color="blue"
        href="/useradmin/adduser"
        icon={<RiUserAddLine className="text-xl" />}
      />

      {/*---Delete user---*/}
      <FilledLink
        title="Poista käyttäjä"
        color="blue"
        href="/useradmin/adduser"
        icon={<RiUserForbidLine className="text-xl" />}
      />
    </div>
  );
};

export default EditUsers;

import { logout } from "@/app/actions";
import { MdLogout } from "react-icons/md";

type LogoutType = {
  showText: boolean;
  addClassName: string;
};

const LogoutForm = ({ showText, addClassName }: LogoutType) => {
  if (showText) {
    return (
      <form action={logout}>
        <button className={addClassName}>
          <MdLogout className="text-2xl" />
          Kirjaudu ulos
        </button>
      </form>
    );
  } else {
    return (
      <form action={logout}>
        <button className={addClassName}>
          <MdLogout className="text-2xl" />
        </button>
      </form>
    );
  }
};

export default LogoutForm;

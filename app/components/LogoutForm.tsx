import { logout } from "@/app/actions";
import { MdLogout } from "react-icons/md";

const LogoutForm = ({ showText }: { showText: boolean }) => {
  if (showText) {
    return (
      <form action={logout}>
        <button className="flex gap-4 items-center cursor-pointer rounded-full pl-4 pr-6 py-2 hover:bg-orange hover:text-background">
          <MdLogout className="text-2xl" />
          Kirjaudu ulos
        </button>
      </form>
    );
  } else {
    return (
      <form action={logout}>
        <button className="items-center cursor-pointer rounded-full px-2 py-2 hover:bg-orange hover:text-background">
          <MdLogout className="text-2xl" />
        </button>
      </form>
    );
  }
};

export default LogoutForm;

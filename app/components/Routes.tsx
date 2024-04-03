import { FaRegCalendarAlt } from "react-icons/fa";
import { FaDog } from "react-icons/fa6";
import { TbFiles } from "react-icons/tb";
import { FaSuitcase } from "react-icons/fa";
import { GoBellFill } from "react-icons/go";
import { FaBookOpen } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

interface RoutesType {
  icon: React.ReactNode | null;
  title: string;
  route: string;
  showOnNavBar: boolean;
  showOnSmallScreen: boolean;
  withNavBar: boolean
}

export const AllRoutes: RoutesType[] = [
  {
    icon: null,
    title: "Login",
    route: "/login",
    showOnNavBar: false,
    showOnSmallScreen: false,
    withNavBar: false,
  },
  {
    icon: null,
    title: "Unohtunut salasana",
    route: "/forgotpassword",
    showOnNavBar: false,
    showOnSmallScreen: true,
    withNavBar: false,
  },
  {
    icon: <FaRegCalendarAlt className="text-2xl" />,
    title: "Kalenteri",
    route: "/main",
    showOnNavBar: true,
    showOnSmallScreen: true,
    withNavBar: true,
  },
  {
    icon: <FaDog className="text-2xl" />,
    title: "Treeniryhmät",
    route: "/groups",
    showOnNavBar: true,
    showOnSmallScreen: false,
    withNavBar: true,
  },
  {
    icon: <TbFiles className="text-2xl" />,
    title: "Ohjeet ja tiedostot",
    route: "/instructions",
    showOnNavBar: true,
    showOnSmallScreen: true,
    withNavBar: true,
  },
  {
    icon: <FaSuitcase className="text-2xl" />,
    title: "Hallitus",
    route: "/board",
    showOnNavBar: true,
    showOnSmallScreen: false,
    withNavBar: true,
  },
  {
    icon: <GoBellFill className="text-2xl" />,
    title: "Hälytysryhmä",
    route: "/calloutgroup",
    showOnNavBar: true,
    showOnSmallScreen: true,
    withNavBar: true,
  },
  {
    icon: <FaBookOpen className="text-2xl" />,
    title: "Yhteystiedot",
    route: "/contacts",
    showOnNavBar: true,
    showOnSmallScreen: false,
    withNavBar: true,
  },
  {
    icon: <FaUserCircle className="text-2xl" />,
    title: "Omat tiedot",
    route: "/userinfo",
    showOnNavBar: true,
    showOnSmallScreen: false,
    withNavBar: true,
  },
  {
    icon: null,
    title: "Lisää tapahtuma",
    route: "/addevent",
    showOnNavBar: false,
    showOnSmallScreen: false,
    withNavBar: true,
  },
  {
    icon: null,
    title: "Muokkaa tapahtumaa",
    route: "/editevent",
    showOnNavBar: false,
    showOnSmallScreen: false,
    withNavBar: true,
  },
];

import { MdOutlineToday } from "react-icons/md";
import { FaDog, FaFlagCheckered } from "react-icons/fa";
import { TfiHandOpen } from "react-icons/tfi";
import { FaShieldDog } from "react-icons/fa6";
import { PiMedalBold } from "react-icons/pi";
import { GoBellFill } from "react-icons/go";

// Define mapping between event titles and background color and icon
export const EventColorAndIconMap: {
  [key: string]: { color: string; icon: JSX.Element };
} = {
  MaA: { color: "bg-blue", icon: <FaDog className="text-2xl" /> },
  MaB: { color: "bg-blue", icon: <FaDog className="text-2xl" /> },
  TiA: { color: "bg-blue", icon: <FaDog className="text-2xl" /> },
  TiB: { color: "bg-blue", icon: <FaDog className="text-2xl" /> },
  Raahe: { color: "bg-blue", icon: <FaDog className="text-2xl" /> },
  Koe: { color: "bg-purple", icon: <PiMedalBold className="text-2xl" /> },
  Virta: {
    color: "bg-purple",
    icon: <FaFlagCheckered className="text-2xl" />,
  },
  Avoin: { color: "bg-green", icon: <TfiHandOpen className="text-2xl" /> },
  Laji: { color: "bg-purple", icon: <FaShieldDog className="text-2xl" /> },
  Häly: { color: "bg-orange", icon: <GoBellFill className="text-2xl" /> },
  Muu: {
    color: "bg-yellow",
    icon: <MdOutlineToday className="text-2xl" />,
  },
};

// List groups
export const groupOptions = ["MaA", "MaB", "TiA", "TiB", "Raahe", "Ei ryhmää"];

// List event types for dropdown list in AddEvent and EditEvent
export const eventTypeOptions = [
  "MaA-treeni",
  "MaB-treeni",
  "TiA-treeni",
  "TiB-treeni",
  "Raahen treeni",
  "Kokeet",
  "Virta",
  "Hälytreeni",
  "Lajitreeni",
  "Avoin treeni",
  "Muu",
];

// List member roles in OSE for dropdown list
export const roleOptions = [
  "Hallituksen jäsen",
  "Hallituksen puheenjohtaja",
  "Hallituksen varapuheenjohtaja",
  "Hälytoimikunnan jäsen",
  "Hälytoimikunnan puheenjohtaja",
  "Kartta- ja viestisovellusyhteyshenkilö",
  "Koesihteeri",
  "Kouluttaja",
  "Koulutustoimikunnan jäsen",
  "Koulutusvastaava",
  "Rahastonhoitaja",
  "Sihteeri",
  "SPeKL:n edustaja",
  "Talkoopistevastaava",
  "Treeniryhmän yhteyshenkilö",
  "Vapepan edustaja",
  "Vapepa-yhteyshenkilö",
  "Varainhankintatoimikunnan jäsen",
  "Varustevastaava",
  "Web-master",
];

"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";

import FilledButton, { FilledLink } from "@/app/components/Buttons";
import { GoBellFill } from "react-icons/go";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import { getCalloutParticipationTableUrl } from "@/app/actions";
import toast from "react-hot-toast";

type PropsType = {
  admin: boolean;
};

const CalloutParticipationForm: React.FC<PropsType> = ({ admin }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableUrl, setTableUrl] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = await getCalloutParticipationTableUrl();
        setTableUrl(url);
      } catch (error: any) {
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "fetchError",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClick = () => {};

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container p-8 lg:p-16">
      {/*---Participation to Callout Duties---*/}
      <div>
        <h1 className="mb-4">Hälytyksiin osallistuminen</h1>
        <p className="mb-4">
          Merkitse hälytyksiin osallistumisesi alla olevan linkin kautta.
        </p>
        <div className="flex mb-8">
          <FilledLink
            title="Hälytykset"
            color="orange"
            href={tableUrl}
            icon={<GoBellFill className="text-xl" />}
          />
        </div>
        {admin && (
          <div>
            <h2 className="mb-4">Muokkaa linkin osoitetta</h2>
            <p className="mb-4">Nykyinen taulukko on osoitteessa {tableUrl}</p>
            <input
              className="border border-grey rounded-lg py-1 px-4 text-sm mb-2"
              type="text"
              name="newurl"
              placeholder="Uusi osoite"
            />
            <FilledButton
              title="Vaihda osoite"
              color="blue"
              onClick={handleClick}
              icon={<LiaExchangeAltSolid className="text-xl" />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalloutParticipationForm;

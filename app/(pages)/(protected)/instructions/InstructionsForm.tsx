"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { createClient } from "@/utils/supabase/client";
import { FileObject } from "@supabase/storage-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const InstructionsForm: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(false);

  const goToFileUrl = async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 7); // url expires in 7 days
    if (error) {
      toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
        id: "urlError",
      });
    }
    if (data) {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container max-w-screen-md p-8 lg:p-16">
      <h1 className="mb-4">Ohjeet ja tiedostot</h1>
      <div>
        <p className="mb-4 text-base">
          Alla olevien linkkien kautta pääset tarkastelemaan OSEn käsikirjaa ja
          muita hyödyllisiä tiedostoja.
        </p>
        <p className="mb-4"></p>
      </div>
      <div>
        <h2 className="text-blue mb-2">Yleiset ohjeet</h2>
        <section className="grid gap-2 ml-4 mb-4">
          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() => goToFileUrl("ohjeet", "osen_kasikirja.pdf")}
          >
            OSEn käsikirja
          </button>

          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() => goToFileUrl("ohjeet", "osen_saannot.pdf")}
          >
            OSEn säännöt
          </button>
          <Link
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            href="/instructions/annualmeetings"
          >
            Vuosikokouspöytäkirjat
          </Link>
        </section>
      </div>

      <div>
        <h2 className="text-blue mb-2">Hälytreenit</h2>
        <section className="grid gap-2 ml-4 mb-4">
          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() => goToFileUrl("ohjeet", "halytreenin_kutsu.docx")}
          >
            Hälytreenin kutsupohja
          </button>

          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() =>
              goToFileUrl("ohjeet", "halytreenin_raporttipohja.docx")
            }
          >
            Hälytreeniraportti
          </button>

          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() =>
              goToFileUrl("ohjeet", "suunnistusnayttoraportti.docx")
            }
          >
            Suunnistusnäyttöraportti
          </button>
        </section>
      </div>

      <div>
        <h2 className="text-blue mb-2">Harjoitusvirta</h2>
        <section className="grid gap-2 ml-4 mb-4">
          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() => goToFileUrl("ohjeet", "harkkavirta_arviointi.pdf")}
          >
            Harjoitusvirran arviointilomake
          </button>

          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() =>
              goToFileUrl("ohjeet", "harkkavirta_etsinnan_dokumentointi.pdf")
            }
          >
            Etsinnän dokumentointi
          </button>
        </section>
      </div>
    </div>
  );
};

export default InstructionsForm;

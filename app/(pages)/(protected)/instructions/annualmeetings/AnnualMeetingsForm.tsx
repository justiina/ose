"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { createClient } from "@/utils/supabase/client";
import { FileObject } from "@supabase/storage-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { FilledRoundLink } from "@/app/components/Buttons";
import { RiArrowGoBackLine } from "react-icons/ri";

const AnnualMeetingsForm: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
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
      <FilledRoundLink
        title="Takaisin"
        color="grey"
        href="/instructions"
        icon={<RiArrowGoBackLine className="text-2xl" />}
      />
      <h2 className="text-blue mt-4 mb-2">Vuosikokouspöytäkirjat</h2>
      <div>
        <section className="grid gap-2 ml-4 mb-4">
          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() =>
              goToFileUrl("hallitus/vuosikokoukset", "vuosikokous_2025.pdf")
            }
          >
            Vuosikokous 2025
          </button>

          <button
            className="text-left bg-white hover:bg-greylight p-2 rounded-lg"
            onClick={() =>
              goToFileUrl("hallitus/vuosikokoukset", "vuosikokous_2026.pdf")
            }
          >
            Vuosikokous 2026
          </button>
        </section>
      </div>
    </div>
  );
};

export default AnnualMeetingsForm;

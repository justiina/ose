"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CalloutErrorToast() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.get("error") === "callout") {
      toast.error("Vain hälyryhmän jäsenet pääsevät tälle alueelle!", {
        id: "calloutMemberRestriction",
      });
      router.replace("/calloutgroup");
    }
  }, [params, router]);

  return null;
}

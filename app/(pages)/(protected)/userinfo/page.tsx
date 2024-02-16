"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";

const UserInfo = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error("Kirjaudu sisään / Please sign in");
      redirect("/");
    },
  });
  if (status === "loading") {
    return <LoadingIndicator />;
  }

  return <div>UserInfo</div>;
};

export default UserInfo;

UserInfo.requireAuth = true;

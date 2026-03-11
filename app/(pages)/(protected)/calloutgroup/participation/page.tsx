import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getUserById, isAdmin } from "@/app/actions";
import CalloutParticipationForm from "./CalloutParticipationForm";

const CalloutParticipation = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }

  const admin = await isAdmin();

  // Get user info
  const { userData } = await getUserById(user.id);

  // Check callout group membership
  if (!userData?.isCalloutMember) {
    redirect("/calloutgroup?error=callout");
  }

  return <CalloutParticipationForm admin={admin} />;
};

export default CalloutParticipation;

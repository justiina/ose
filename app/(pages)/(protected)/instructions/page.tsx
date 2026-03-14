import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UnderConstruction from "@/app/components/UnderConstruction";
import { FaBook, FaPlus, FaUserCircle } from "react-icons/fa";
import { FilledLink } from "@/app/components/Buttons";
import { MdOutlineEdit } from "react-icons/md";
import { TbFiles } from "react-icons/tb";
import InstructionsForm from "./InstructionsForm";

const Instructions = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }

  return (
      <div>
        <InstructionsForm isAdmin={false} />
      </div>
  );
};

export default Instructions;

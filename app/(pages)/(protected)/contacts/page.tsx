import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ContactForm from "./ContactForm";

export default async function ContactsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (error || !user) {
    return redirect("/");
  }

  return (
    <div className="container max-w-screen p-8 lg:p-16">
      <h1 className="mb-8 text-2xl font-bold">Yhteystiedot</h1>
      <ContactForm />
    </div>
  );
}
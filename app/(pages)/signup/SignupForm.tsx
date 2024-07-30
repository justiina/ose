"use client";
import { useFormState } from "react-dom";
import { signup } from "@/app/actions";
import toast from "react-hot-toast";
import FilledButton from "@/app/components/Buttons";
import { useSearchParams } from "next/navigation";

const SignupForm = () => {
  const [state, formAction] = useFormState<any, FormData>(signup, undefined);
  const searchParams = useSearchParams()!;
  const email: string | null = searchParams.get("email");

  if (state?.error) {
    toast.error(state.error, { id: "login" });
  }

  return (
    <>
      <form action={formAction} className="grid gap-1 mr-8 md:w-4/5">
        <input
          id="email"
          //className="border border-grey rounded-lg py-1 px-4 text-sm"
          type="email"
          name="email"
          placeholder="Sähköposti"
          value={email || "ei mailia"}
          required
        />
        <input
          id="password"
          className="border border-grey rounded-lg mb-4 py-1 px-4 text-sm"
          type="password"
          name="password"
          placeholder="Salasana"
          required
        />

        <FilledButton title="Rekisteröidy" color="orange" />
      </form>
    </>
  );
};

export default SignupForm;

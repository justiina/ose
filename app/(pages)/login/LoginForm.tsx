"use client";
import { useFormState } from "react-dom";
import { login } from "@/app/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FilledButton from "@/app/components/Buttons";
import Link from "next/link";
import { HOST } from "@/app/components/HostInfo";
import Dialog from "@/app/components/Dialog";
import ForgotPasswordForm from "./ForgotPasswordForm";

const LoginForm = () => {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);
  const router = useRouter();

  if (state?.error) {
    toast.error(state.error, { id: "login" });
  }

  const closeModal = async () => {
    const url = new URL(window.location.href);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <>
      <form action={formAction} className="grid gap-1 mr-8 md:w-4/5">
        <input
          id="email"
          className="border border-grey rounded-lg py-1 px-4 text-sm"
          type="email"
          name="email"
          placeholder="Sähköposti"
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

        <FilledButton title="Kirjaudu sisään" color="orange" />
      </form>
      <Link
        href={`${HOST}/login?showDialog=y`}
        className="grid md:w-4/5 mt-2 justify-center text-grey hover:text-orange text-sm"
      >
        Unohtuiko salasana?
      </Link>
      {/*---Show forgot password dialog when clicked---*/}
      <Dialog title={"Salasanan nollaus"} onClose={closeModal}>
        <ForgotPasswordForm />
      </Dialog>
    </>
  );
};

export default LoginForm;

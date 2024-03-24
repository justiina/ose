"use client";
import { useFormState } from "react-dom";
import { login } from "@/app/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);
  const router = useRouter();

  if (state?.error) {
    toast.error(state.error, { id: "login" });
  }

  return (
    <>
      <form action={formAction} className="grid gap-1 mr-8 md:w-4/5">
        <input
          id="email"
          className="border border-grey rounded-full py-1 px-4 text-sm"
          type="email"
          name="email"
          placeholder="Sähköposti"
          required
        />
        <input
          id="password"
          className="border border-grey rounded-full py-1 px-4 text-sm"
          type="password"
          name="password"
          placeholder="Salasana"
          required
        />

        <button className="px-4 py-2 mt-4 bg-orange text-white rounded-lg hover:bg-orangehover active:bg-grey">
          Kirjaudu sisään
        </button>
      </form>
      <button
        onClick={() => router.push("/forgotpassword")}
        className="grid md:w-4/5 mt-2 text-grey hover:text-orange text-sm"
      >
        Unohtuiko salasana?
      </button>
    </>
  );
};

export default LoginForm;

"use client";
import { useFormState } from "react-dom";
import { login } from "../../actions";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);
  const router = useRouter();

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
        {state?.error && (
          <p className="grid justify-center text-blue text-sm font-bold">
            {state.error}
          </p>
        )}
        <button className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm mt-4">
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

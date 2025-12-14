"use client";
import { useState, useEffect } from "react";
import { login } from "@/app/actions";
import toast from "react-hot-toast";
import FilledButton from "@/app/components/Buttons";
import Link from "next/link";
import Dialog from "@/app/components/Dialog";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginResultType } from "@/app/components/Types";

const LoginForm = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const showDialog = searchParams?.get("showDialog");
    if (showDialog === "y") {
      setDialogOpen(true);
    }
  }, [searchParams]);

  const closeModal = () => {
    setDialogOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("showDialog");
    window.history.replaceState({}, "", url.toString());
  };

  // Map errors to UI messages
  type LoginFailureType = Extract<LoginResultType, { success: false }>;
  const ERROR_MESSAGES: Record<LoginFailureType["reason"], string> = {
    INVALID_CREDENTIALS: "Väärä sähköposti tai salasana",
    NETWORK: "Verkkovirhe, yritä uudelleen",
    UNKNOWN: "Jotain meni vikaan",
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Syötä sähköposti ja salasana");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.push("/main");
    } else {
      toast.error(ERROR_MESSAGES[result.reason], { id: "loginError" });
      return;
    }
  };

  return (
    <div>
      <div className="grid gap-1 mr-8 md:w-4/5">
        <input
          id="email"
          className="border border-grey rounded-lg py-1 px-4 text-sm"
          type="email"
          name="email"
          placeholder="Sähköposti"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="password"
          className="border border-grey rounded-lg mb-4 py-1 px-4 text-sm"
          type="password"
          name="password"
          placeholder="Salasana"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FilledButton
          title="Kirjaudu sisään"
          color="orange"
          onClick={handleLogin}
        />
      </div>
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/login?showDialog=y`}
        className="grid md:w-4/5 mt-2 justify-center text-grey hover:text-orange text-sm"
      >
        Unohtuiko salasana?
      </Link>
      {/*---Show forgot password dialog when clicked---*/}
      {dialogOpen && (
        <Dialog title={"Salasanan nollaus"} onClose={closeModal}>
          <ForgotPasswordForm />
        </Dialog>
      )}
    </div>
  );
};

export default LoginForm;

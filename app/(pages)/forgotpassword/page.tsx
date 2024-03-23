"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const resetEmail = () => {
    sendPasswordResetEmail(auth, email);
    router.push("/");
  };

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row justify-center items-center">
      <div className="p-4 w-96">
        <h1 className="mb-2">Uusi salasana</h1>
        <p className="mb-4">
          Kirjoita alle rekisteröity sähköpostiosoitteesi, niin lähetämme ohjeet
          salasanan uusimiseen sinne.
        </p>
        <div className="grid gap-1">
          <input
            id="email"
            className="border border-grey rounded-full py-1 px-4 text-sm mb-4"
            type="email"
            name="email"
            placeholder="Sähköposti"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="justify-items-center">
            <button
              onClick={() => goBack()}
              className="bg-grey hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm mr-2"
            >
              Peruuta
            </button>
            <button
              type="submit"
              disabled={!email}
              onClick={() => resetEmail()}
              className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm"
            >
              Uusi salasana
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

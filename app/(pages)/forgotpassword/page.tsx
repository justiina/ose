"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { redirect } from "next/navigation";
import { auth } from "@/app/firebase/firebaseConfig";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const resetEmail = () => {
    sendPasswordResetEmail(auth, email);
    redirect("/");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row justify-center items-center">
      <div className="p-4 w-96">
        <h1 className="mb-2">Uusi salasana</h1>
        <p className="mb-4">
          Kirjoita alle rekisteröity sähköpostiosoitteesi, niin lähetämme ohjeet
          salasanan uusimiseen sinne.
        </p>
        <form className="grid gap-1" onSubmit={() => resetEmail()}>
          <input
            id="email"
            className="border border-grey rounded-full py-1 px-4 text-sm"
            type="email"
            name="email"
            placeholder="Sähköposti"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="justify-items-center">
            <button
              type="submit"
              disabled={!email}
              className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm"
            >
              Uusi salasana
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

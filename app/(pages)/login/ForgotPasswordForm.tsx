"use client";
import { resetPassword } from "@/app/actions";
import FilledButton from "@/app/components/Buttons";
import React from "react";
import { useFormState } from "react-dom";

const ForgotPasswordForm = () => {
  const [state, formAction] = useFormState<any, FormData>(
    resetPassword,
    undefined
  );

  return (
    <div className="flex-col justify-center mx-4 mt-4 mb-8">
      <div className="grid mb-8 gap-4">
        <p>
          Anna sähköpostiosoitteesi salasanan nollausta varten ja paina Lähetä.
          Ohjeet lähetetään antamaasi sähköpostiosoitteeseen.
        </p>
        <p>
          <b> Vain rekisteröity sähköpostiosoite voidaan nollata!</b>
          <p>
            Ota yhteyttä OSEn sihteeriin, jos et ole varma millä
            sähköpostiosoitteella olet rekisteröitynyt.
          </p>
        </p>
      </div>
      <form action={formAction} className="grid gap-2 mr-8 md:flex">
        <input
          id="email"
          className="border border-grey rounded-lg py-1 px-4 text-sm"
          type="email"
          name="email"
          placeholder="Sähköposti"
          required
        />
        <FilledButton title="Lähetä" color="blue" />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

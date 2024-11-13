"use client";
import { addToPasswordResets, resetPassword } from "@/app/actions";
import FilledButton from "@/app/components/Buttons";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState<string | null>(null);
  const token = crypto.randomUUID();

  const sendResetEmail = async () => {
    if (!email) {
      toast.error("Anna sähköpostiosoitteesi!");
      return;
    } else {
      await fetch("api/resetpassword", {
        method: "POST",
        body: JSON.stringify({ token, email }),
      }).then(() => {
        //resetPassword;
        saveToPasswordResets();
      });
    }
  };

  const saveToPasswordResets = async () => {
    if (!email) {
      toast.error("Anna sähköpostiosoitteesi!");
      return;
    } else {
      const saveOk = await addToPasswordResets({ token, email });
      if (saveOk) {
        toast.success(
          "Salasanan vaihto-ohjeet on lähetetty antamaasi sähköpostiosoitteeseen."
        );
        redirect("/");
      } else {
        toast.error(saveOk, { id: "saveError" });
        return;
      }
    }
  };

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
      <form className="grid gap-2 mr-8 md:flex">
        <input
          id="email"
          className="border border-grey rounded-lg py-1 px-4 text-sm"
          type="email"
          name="email"
          placeholder="Sähköposti"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FilledButton onClick={sendResetEmail} title="Lähetä" color="blue" />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

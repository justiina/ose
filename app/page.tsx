"use client";

import Image from "next/image";
import { useState } from "react";
import { auth } from "@/firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  const login = async () => {
    return await signInWithEmailAndPassword(auth, email || "", password || "")
      .then((userCredential) => {
        if (userCredential.user) {
          console.log("login ok!")
          router.push('/main/calendar')
          return userCredential.user;
        }
        return null;
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="sm:flex justify-center items-center mt-10">
      <div className="p-4">
        <Image
          src="/images/logo300.png"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 180, height: "auto" }}
          alt="logo"
          placeholder="blur"
          blurDataURL={'/images/logo300.png'}
        />
      </div>
      <div className="sm:w-1/2 p-4">
        <h1 className="mb-4">Tervetuloa OSEn jäsensivustolle!</h1>
        <p>
          Oulun Seudun Etsintäkoirat OSE ry:n jäsenet voivat kirjautua
          sivustolle omilla tunnuksillaan.
        </p>
        <div className="grid gap-1 mt-8 mr-28">
          <input
            type="email"
            className="border border-grey rounded-full py-1 px-4 text-sm focus:border-grey"
            placeholder="Sähköposti"
            value={email}
            onChange={(text) => setEmail(text.target.value)}
          />
          <input
            type="password"
            className="border mb-2 border-grey rounded-full py-1 px-4 text-sm"
            placeholder="Salasana"
            value={password}
            onChange={(text) => setPassword(text.target.value)}
          />
          <div className="justify-items-center">
            <button
              type="button"
              onClick={login}
              className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-xs"
            >
              Kirjaudu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

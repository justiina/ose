"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row justify-center items-center">
      <div className="p-4">
        <Image
          src="/images/logo300.png"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 180, height: "auto" }}
          alt="logo"
          placeholder="blur"
          blurDataURL={"/images/logo300.png"}
        />
      </div>
      <div className="p-4">
        <h1 className="mb-2">Tervetuloa OSEn jäsensivustolle!</h1>
        <p className="mb-4 w-96">
          Oulun Seudun Etsintäkoirat OSE ry:n jäsenet voivat kirjautua
          sivustolle omilla tunnuksillaan.
        </p>
        <div className="grid gap-1">
          <input
            id="email"
            className="border border-grey rounded-full py-1 px-4 text-sm mr-8"
            type="email"
            name="email"
            placeholder="Sähköposti"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            id="password"
            className="border border-grey rounded-full py-1 px-4 text-sm mb-4  mr-8"
            type="password"
            name="password"
            placeholder="Salasana"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="grid gap-2">
            <button
              onClick={() =>
                signIn("credentials", {
                  email,
                  password,
                  redirect: true,
                  callbackUrl: "/main",
                })
              }
              className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm mr-8"
            >
              Kirjaudu sisään
            </button>
            <button
              onClick={() => router.push("/forgotpassword")}
              className="text-grey hover:text-orange text-sm mr-8"
            >
              Unohtuiko salasana?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

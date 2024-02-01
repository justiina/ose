"use client";

import Image from "next/image";
import { useState } from "react";
import { login } from "../actions/auth";

export default function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
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
          blurDataURL={"/images/logo300.png"}
        />
      </div>
      <div className="sm:w-4/12 p-4">
        <h1 className="mb-4">Tervetuloa OSEn jäsensivustolle!</h1>
        <p>
          Oulun Seudun Etsintäkoirat OSE ry:n jäsenet voivat kirjautua
          sivustolle omilla tunnuksillaan.
        </p>
        <form action={() => login(loginData)} className="grid gap-1 mt-8 mr-28">
          <input
            className="border border-grey rounded-full py-1 px-4 text-sm focus:border-grey"
            type="email"
            name="email"
            placeholder="Sähköposti"
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <input
            className="border mb-2 border-grey rounded-full py-1 px-4 text-sm"
            type="password"
            name="password"
            placeholder="Salasana"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <div className="justify-items-center">
            <button
              type="submit"
              className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-xs"
            >
              Kirjaudu sisään
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

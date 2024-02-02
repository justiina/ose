"use client";

import { AuthService } from "@/app/components/AuthService";
import { login } from "@/app/components/AuthFunctions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const user = await login(email, password);
      if (user !== null) {
        router.push("/main/calendar");
      }
    } catch (error) {
      window.alert(error);
    }
  }

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
        <form className="grid gap-1 mt-8" onSubmit={handleSubmit}>
          <input
            className="border border-grey rounded-full py-1 px-4 text-sm focus:border-grey"
            type="email"
            name="email"
            placeholder="Sähköposti"
            required
          />
          <input
            className="border border-grey rounded-full py-1 px-4 text-sm mb-2"
            type="password"
            name="password"
            placeholder="Salasana"
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

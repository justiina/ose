import Image from "next/image";
import LoginForm from "@/app/(pages)/login/LoginForm";


export default function Login() {
  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row justify-center items-center">
      <div className="flex p-4 justify-end">
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
      <div className="p-4 md:w-1/3">
        <h1 className="mb-2">Tervetuloa OSEn jäsensivustolle!</h1>
        <p className="mb-4">
          Oulun Seudun Etsintäkoirat OSE ry:n jäsenet voivat kirjautua
          sivustolle omilla tunnuksillaan.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

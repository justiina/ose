import Image from "next/image";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="sm:flex justify-center items-center mt-10">
      <div className="p-4">
        <Image src="/images/logo300.png" width={200} height={500} alt="logo" />
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
          />
          <input
            type="password"
            className="border mb-2 border-grey rounded-full py-1 px-4 text-sm"
            placeholder="Salasana"
          />
          <div className="justify-items-center">
            <Button which="SignIn" />
          </div>
        </div>
      </div>
    </div>
  );
}

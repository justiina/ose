import Image from "next/image";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="p-4">
        <Image src="/images/logo300.png" width={200} height={500} alt="logo" />
      </div>
      <div className="w-1/3 p-4">
        <h1 className="mb-4">Tervetuloa OSEn jäsensivustolle!</h1>
        <p>
          Oulun Seudun Etsintäkoirat OSE ry:n jäsenet voivat kirjautua
          sivustolle omilla tunnuksillaan.
        </p>
        <div className="grid gap-1 mt-2 justify-center">
          <input
            type="email"
            className="border border-grey rounded-full p-1 pl-4 text-sm"
            placeholder="Sähköposti"
          />
          <input
            type="password"
            className="border border-grey rounded-full p-1 pl-4 text-sm"
            placeholder="Salasana"
          />
          <Button which="SignIn" />
        </div>
      </div>
    </div>
  );
}

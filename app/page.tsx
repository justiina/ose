import Image from "next/image";
import Button from "./components/Button";

export default function Home() {
  return (
    <div className="flex">
      <div className="w-1/2 mr-[-6rem]">
        <Image src="/images/logo300.png" width={200} height={500} alt="logo" />
      </div>
      <div className="w-1/2">
        <h1 className="mb-4">Tervetuloa OSEn jäsensivustolle!</h1>
        <p>
          Oulun Seudun Etsintäkoirat OSE ry:n jäsenet voivat kirjautua
          sivustolle omilla tunnuksillaan.
        </p>
        <Button text="Kirjaudu" onClick={console.log('Button clicked!')}/>
      </div>
    </div>
  );
}

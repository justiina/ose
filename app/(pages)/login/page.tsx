import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "./LoginForm";

const Login = async () => {
  // Redirect to main if user is logged in
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return redirect("/main");
  }

  return (
    <div className="flex flex-col lg:flex-row lg:-ml-72 justify-center items-center lg:min-h-screen">
      <div className="flex p-4">
        <img
          src="https://ldlguzrtadadbymtessv.supabase.co/storage/v1/object/public/images/logo300.png?t=2024-04-08T10%3A03%3A54.657Z"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 180, height: "auto" }}
          alt="logo"
        />
      </div>
      <div className="flex flex-col p-4 lg:w-1/3">
        <h1 className="mb-2">Tervetuloa OSEn jäsensivustolle!</h1>
        <p className="mb-4">
          Oulun Seudun Etsintäkoirat OSE ry:n jäsenet voivat kirjautua
          sivustolle omilla tunnuksillaan.
        </p>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

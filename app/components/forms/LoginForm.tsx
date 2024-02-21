"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { object, string } from "yup";
import { toast } from "react-hot-toast";

const loginSchema = object().shape({
  email: string().required("Tämä on pakollinen tieto!"),
  password: string().required("Tämä on pakollinen tieto!"),
});

interface ILoginFormProps {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [userData, setUserData] = useState<ILoginFormProps>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await loginSchema.validate(userData, { abortEarly: false });
      await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        redirect: true,
        callbackUrl: "/main",
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const validationErrors = error.errors.join("\n");
        console.log(validationErrors)
      } else {
        console.error("Error happened: ", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
  };

  return (
    <div>
      <div className="grid gap-1">
        <input
          id="email"
          className="border border-grey rounded-full py-1 px-4 text-sm"
          type="email"
          name="email"
          placeholder="Sähköposti"
          autoComplete="email"
          value={userData.email}
          onChange={handleChange}
        />
        <input
          id="password"
          className="border border-grey rounded-full py-1 px-4 text-sm mb-4"
          type="password"
          name="password"
          placeholder="Salasana"
          autoComplete="current-password"
          value={userData.password}
          onChange={handleChange}
        />
        <div className="grid gap-2">
          <button
            onClick={() => handleSubmit}
            className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-sm"
          >
            Kirjaudu sisään
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

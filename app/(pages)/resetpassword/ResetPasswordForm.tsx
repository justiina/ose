"use client";
import {
  getResetPasswordInfo,
  getUidByEmail,
  resetPassword,
} from "@/app/actions";
import FilledButton from "@/app/components/Buttons";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const token: string | null = searchParams.get("token");
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  // Set the token lifespan to 30 minutes
  const tokenLifespanMinutes = 30;

  // Fetch the user info by token
  useEffect(() => {
    const fetchData = async () => {
      if (token !== null) {
        try {
          const userData = await getResetPasswordInfo(token);
          if (userData.error) {
            setFetchError(userData.error);
          } else if (userData.userData !== null) {
            // Check if the token is expired
            const createdAtDate = new Date(userData.userData?.created_at);
            const currentDateTime = new Date();
            const expirationTime =
              createdAtDate.getTime() + tokenLifespanMinutes * 60 * 1000;
            if (currentDateTime.getTime() > expirationTime) {
              setFetchError(
                "Linkki on vanhentunut! Lähetä itsellesi tarvittaessa uusi linkki Unohtuiko salasana? -kohdasta."
              );
            } else {
              setEmail(userData.userData.email);
              if (email !== null && email !== "") {
                const fetchedUid = await getUidByEmail(email);
                if (fetchedUid.error) {
                  setFetchError(fetchedUid.error);
                }
                setUid(fetchedUid);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleReset = async (event: FormEvent) => {
    event.preventDefault();
    if (uid !== null && !passwordError && !confirmPasswordError) {
      const result = await resetPassword(uid, password);
      if (result.error) {
        toast.error(result.error);
        router.push("/");
      } else {
        toast.success("Salasanan nollaus onnistui, tervetuloa sivustolle!");
        router.push("/");
      }
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  const validatePassword = (password: string) => {
    // Define your password rules here
    const rules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!?@#=$%^&*-]).{8,}$/;
    if (!rules.test(password)) {
      setPasswordError(
        "Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää isoja ja pieniä kirjaimia, numeroita sekä erikoismerkkejä"
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Salasanat eivät täsmää.");
    } else {
      setConfirmPasswordError("");
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <h1 className="mb-2">Salasanan nollaus</h1>
      {fetchError !== null ? (
        <p className="text-orange">{fetchError}</p>
      ) : (
        <>
          {" "}
          <p className="mb-4">Anna uusi salasana:</p>
          <div>
            <form onSubmit={handleReset} className="grid gap-1 mr-8 md:w-4/5">
              <input
                id="password"
                className="border border-grey rounded-lg mb-1 py-1 px-4 text-sm"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Salasana"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordError && (
                <p className="text-orange text-sm">{passwordError}</p>
              )}

              <input
                id="confirm-password"
                className="border border-grey rounded-lg mb-4 py-1 px-4 text-sm"
                type={showPassword ? "text" : "password"}
                name="confirm-password"
                placeholder="Vahvista salasana"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {confirmPasswordError && (
                <p className="text-orange text-sm">{confirmPasswordError}</p>
              )}

              <FilledButton title="Vaihda salasana" color="orange" />
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPasswordForm;

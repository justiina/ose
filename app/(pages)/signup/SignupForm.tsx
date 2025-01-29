"use client";
import { getInvitedUserByToken, signup } from "@/app/actions";
import FilledButton from "@/app/components/Buttons";
import { InvitedUserType } from "@/app/components/Types";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";

const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const token: string | null = searchParams.get("token");
  const [user, setUser] = useState<InvitedUserType | null>(null);
  const [invitedError, setInvitedError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  // Set the token lifespan to 7 days (in minutes)
  const tokenLifespanMinutes = 7 * 24 * 60;

  // Fetch the invited user data by token
  useEffect(() => {
    const fetchData = async () => {
      if (token !== null) {
        try {
          const userData = await getInvitedUserByToken(token);
          if (userData.error) {
            setInvitedError(userData.error);
          } else if (userData.userData !== null) {
            // Check if the token is expired
            const createdAtDate = new Date(userData.userData?.created_at);
            const currentDateTime = new Date();
            const expirationTime =
              createdAtDate.getTime() + tokenLifespanMinutes * 60 * 1000;
            if (currentDateTime.getTime() > expirationTime) {
              setInvitedError(
                "Tämä kutsu on vanhentunut! Ole hyvä ja pyydä sihteeriltä uusi kutsu."
              );
            } else {
              setUser(userData.userData);
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

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    if (passwordError) {toast.error("Tarkista salasanasi!")}
    if (user !== null && !passwordError && !confirmPasswordError) {
      const result = await signup(
        user.email,
        password,
        user.firstName,
        user.lastName,
        user.isAdmin
      );
      if (result.error) {
        toast.error(result.error);
        router.push("/");
      } else {
        toast.success("Rekisteröityminen onnistui, tervetuloa sivustolle!");
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

  const validatePassword = (passw: string) => {
    // Define your password rules here
    const rules = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!?@#=$%^&*-]).{8,}$/;
    if (!rules.test(passw)) {
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
      <h1 className="mb-2">Rekisteröidy OSEn jäsensivustolle</h1>
      {invitedError !== null ? (
        <p className="text-orange">{invitedError}</p>
      ) : (
        <>
          {" "}
          <p className="mb-4">Anna salasana sähköpostiosoitteelle:</p>
          <div>
            <p className="mb-4 font-bold">{user?.email}</p>
            <form onSubmit={handleSignup} className="grid gap-1 mr-8 md:w-4/5">
              <input
                id="password"
                className="border border-grey rounded-lg mb-1 py-1 px-4 text-sm"
                type="password"
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
                type="password"
                name="confirm-password"
                placeholder="Vahvista salasana"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {confirmPasswordError && (
                <p className="text-orange text-sm">{confirmPasswordError}</p>
              )}

              <FilledButton title="Rekisteröidy" color="orange" />
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default SignupForm;

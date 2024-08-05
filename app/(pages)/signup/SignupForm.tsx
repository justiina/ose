"use client";
import { getInvitedByToken, getInvitedUsers, signup } from "@/app/actions";
import FilledButton from "@/app/components/Buttons";
import { InvitedUserType } from "@/app/components/Types";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingIndicator from "@/app/components/LoadingIndicator";

const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const token: string | null = searchParams.get("token");
  const [user, setUser] = useState<InvitedUserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchInvitedUser = async () => {
      if (!token) {
        setError("Token puuttuu!");
        setLoading(false);
        return;
      }
      try {
        const { userData, error } = await getInvitedByToken(token);
        if (userData) {
          setUser(userData);
        } else {
          setError("Virheellinen tai vanhentunut token");
        }
        if (error) {
          toast.error(error, { id: "fetchError" });
        }
      } catch (error: any) {
        setError(error);
        console.error("Error fetching email:", error);
      }
      fetchInvitedUser();
    };
    setLoading(false);
    console.log(user)
  }, []);

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.target as HTMLFormElement);
    const result = await signup({ error: undefined }, formData);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/main");
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      {error ? (
        <p className="text-orange">{error}</p>
      ) : (
        <div>
          <p>{user?.email}</p>
          <form onSubmit={handleSignup} className="grid gap-1 mr-8 md:w-4/5">
            <input
              id="password"
              className="border border-grey rounded-lg mb-4 py-1 px-4 text-sm"
              type="password"
              name="password"
              placeholder="Salasana"
              required
            />

            <FilledButton title="Rekisteröidy" color="orange" />
          </form>
        </div>
      )}
    </>
  );
};

export default SignupForm;

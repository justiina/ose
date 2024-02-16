import NextAuth from "next-auth";
import CredientialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/firebaseConfig";

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/login",
  },
  providers: [
    CredientialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await signInWithEmailAndPassword(
          auth,
          (credentials as any).email || "",
          (credentials as any).password || ""
        )
          .then((userCredential) => {
            if (userCredential.user) {
              return userCredential.user;
            }
            return null;
          })
          .catch((error) => console.log(error))
          .catch((error) => {
            const errorCode = error.errorCode;
            const errorMessage = error.message;
            console.log(error);
          });
      },
    }),
  ],
};

export default NextAuth(authOptions);

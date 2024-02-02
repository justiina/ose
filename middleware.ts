import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth, getCurrentUser } from "@/firebase/firebaseConfig";
import { checkUser } from "./app/components/AuthFunctions";

const protectedRoutes = ["/calendar"];

export async function middleware(request: NextRequest) {
  // if user is not signed in and the route is protected redirect to
  // login page
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    return new Promise((resolve) => {
      const user = getCurrentUser();
      if (user !== null) {
        resolve(NextResponse.next());
      } else {
        const absoluteURL = new URL("/", request.nextUrl.origin);
        resolve(NextResponse.redirect(absoluteURL.toString()));
      }
      /*
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log(user)
        if (user !== null) {
          resolve(NextResponse.next());
        } else {
          const absoluteURL = new URL("/", request.nextUrl.origin);
          resolve(NextResponse.redirect(absoluteURL.toString()));
        }
        unsubscribe();
      });*/
    });
  }
}

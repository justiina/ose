
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./firebase/firebase-config";


const protectedRoutes = ["/main/calendar"];

export function middleware(request: NextRequest) {/*
  const currentUser = request.cookies.get("currentUser")?.value;

  if (currentUser) {
    return NextResponse.redirect(new URL("/main/calendar", request.url));
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"], */
};

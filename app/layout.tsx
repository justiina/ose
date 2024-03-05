import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { getSession } from "./actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OSEn jäsensivusto",
  description: "Generated by create next app",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getSession();

  return (
    <html lang="fi">
      <body className="md:flex max-w-full">
        {session.isLoggedIn && <Navbar />}
        <div className="grow">{children}</div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
};

export default RootLayout;

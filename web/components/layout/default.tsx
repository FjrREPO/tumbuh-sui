"use client";

import { usePathname } from "next/navigation";

import Navbar from "../navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between antialiased max-w-7xl mx-auto">
      <div className="flex flex-col flex-1 pb-5 px-5 sm:px-10 items-center w-full h-full mx-auto text-white">
        <Navbar />
        <main
          className={`"flex-1 w-full h-full flex ${pathname === "/home" ? "pt-5" : "pt-20"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

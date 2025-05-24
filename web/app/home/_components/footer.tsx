import Image from "next/image";
import Link from "next/link";

import { GithubIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const Footer = () => {
  return (
    <footer className="py-10 text-center text-sm text-[#BCBCBC]">
      <div className="container">
        <div className="before:content-[' '] relative inline-flex before:absolute before:bottom-0 before:top-2 before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD98,#C2F0B1,#2FD8FE)] before:blur">
          <Image
            alt="Sass Logo"
            className="relative"
            height={40}
            src={"/assets/logosaas.png"}
            width={40}
          />
        </div>
        <nav className="mt-6 flex flex-col gap-6 md:flex-row md:justify-center">
          <Link href="/">Home</Link>
          <Link href="/earn">Earn</Link>
        </nav>
        <div className="mt-6 flex justify-center gap-6">
          <Link href={siteConfig.links.twitter}>
            <TwitterIcon />
          </Link>
          <Link href={siteConfig.links.github}>
            <GithubIcon />
          </Link>
        </div>
        <p className="mt-6">
          &copy; 2025 {siteConfig.name}, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

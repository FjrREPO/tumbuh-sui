"use client";

import Link from "next/link";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { BookText } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";

import ConnectButtonCustom from "./wallet/connect-button-custom";

import { GithubIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname === "/home") {
    return null;
  }

  return (
    <HeroUINavbar
      className="absolute border-l-1 border-r-1 border-b-1 border-zinc-800 bg-transparent rounded-b-3xl backdrop-saturate-100 z-[100] max-w-[1200px] left-1/2 top-0 transform -translate-x-1/2"
      isMenuOpen={isMenuOpen}
      maxWidth="full"
      position="static"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent
        className="basis-1/5 xl:basis-full hidden xl:flex xl:flex-row items-center"
        justify="start"
      >
        <Link href="/home" title="Home">
          <Image
            alt="logo"
            className="min-w-11 min-h-11 w-11 h-11 rounded-full"
            height={50}
            src={siteConfig.logo}
            width={50}
          />
        </Link>
        <div className="relative flex items-center w-fit">
          <div className="realtive flex p-1">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href} className="relative navbar-item">
                <Link
                  className={clsx(
                    "text-sm font-normal px-4 py-2 rounded-none",
                    pathname.startsWith(item.href)
                      ? "text-foreground"
                      : "text-gray-400",
                  )}
                  href={item.href}
                >
                  {pathname.startsWith(item.href) && (
                    <motion.span
                      className="absolute inset-0 z-10 border-b-2 border-yellow-500 -mb-1 mix-blend-difference rounded-none"
                      layoutId="bubble"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="z-10">{item.label}</span>
                </Link>
              </NavbarItem>
            ))}
          </div>
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden xl:flex basis-1/5 xl:basis-full items-center mb-4 pt-3"
        justify="end"
      >
        <NavbarItem className="hidden xl:flex items-center gap-4">
          <Link href={siteConfig.links.docs} target="_blank" title="Docs">
            <BookText className="text-default-500 h-5 w-5" />
          </Link>
          <Link href={siteConfig.links.github} target="_blank" title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <ConnectButtonCustom />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="xl:hidden basis-1 pl-4">
        <div className="flex justify-between items-center w-full">
          <NavbarMenuToggle className="p-5 -ml-5" />
          <div className="flex flex-row gap-3">
            <Link href={siteConfig.links.docs} target="_blank" title="Docs">
              <BookText className="text-default-500 h-5 w-5" />
            </Link>
            <Link href={siteConfig.links.github} target="_blank" title="GitHub">
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </NavbarContent>

      <NavbarMenu className="z-[1000] absolute inset-0 full-height bg-background/50">
        <div className="mx-4 flex-col gap-5 flex-grow inline-flex justify-between py-10">
          <div className="inline-flex flex-col gap-5">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={clsx(
                    "border-l-2 pl-5 h-10",
                    pathname.startsWith(item.href)
                      ? "border-warning text-warning"
                      : "border-transparent",
                  )}
                  color="foreground"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
          <ConnectButtonCustom />
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
}

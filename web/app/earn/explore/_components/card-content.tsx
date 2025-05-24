"use client";

import { Button } from "@heroui/button";
import Link from "next/link";

export default function CardContent({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
  buttonTarget = "_self",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonTarget?: string;
}) {
  return (
    <div className="flex w-full items-center justify-stretch py-8 md:py-20 lg:px-28">
      <div className="inline-flex min-h-14 grow flex-col items-start justify-between space-y-4 overflow-hidden rounded-bl-lg rounded-br-lg rounded-tl-lg border-[0.5px] border-gray-400 bg-opacity-5 bg-purple-400 px-6 py-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 md:py-2 lg:space-x-0">
        <div className="flex flex-col items-start justify-start gap-4 space-y-4 md:flex-row md:items-center md:space-y-0">
          {icon}
          <div className="inline-flex flex-col items-start justify-center text-warning-900">
            <p className="uppercase tracking-normal font-mono font-bold antialiased text-base leading-5">
              {title}
            </p>
            <p className="uppercase tracking-normal font-mono font-normal antialiased text-xs leading-5">
              {description}
            </p>
          </div>
        </div>
        <Link
          className="tap-highlight-none inline-flex"
          href={buttonLink}
          target={buttonTarget}
        >
          <Button color="warning" type="button" variant="flat">
            <span className="uppercase text-base tracking-normal font-mono font-normal leading-none antialiased text-current group-disabled:opacity-44">
              {buttonText}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

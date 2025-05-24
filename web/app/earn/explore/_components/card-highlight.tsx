"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CardHighlight({
  token,
  description,
}: {
  token: any;
  description: string;
}) {
  return (
    <div className="mt-5 relative inline-flex w-full flex-col items-center overflow-hidden rounded-3xl rounded-b-3xl rounded-tr-none border-[0.5px] border-warning-500 lg:col-span-2">
      <Link
        className="inline-flex h-24 w-full items-center justify-start bg-warning-400 bg-opacity-10 duration-75 ease-linear hover:opacity-70"
        href={`https://www.usdc.com/`}
        target="_blank"
      >
        <div className="self-grow inline-flex flex-1 items-center space-x-2 space-y-1 self-stretch py-6 pl-5 lg:rounded-tl-3xl">
          <div className="sup-asset-pair inline-flex relative">
            <span className="sup-asset inline-flex rounded-full overflow-hidden h-8 w-8">
              <Image
                alt="Token logo"
                className="object-cover object-center"
                height={32}
                src={token.image}
                width={32}
              />
            </span>
            <span className="sup-asset inline-flex rounded-full overflow-hidden h-4 w-4 absolute bottom-0 bg-neutral-950 right-0">
              <Image
                alt="Chain logo"
                className="object-cover object-center bg-white p-0.5"
                height={16}
                src={token.chain.icon ?? "/placeholder.png"}
                width={16}
              />
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-sans font-bold antialiased text-2xl normal-case leading-8 tracking-wide">
              {token.symbol}
            </p>
            <p className="uppercase font-mono font-bold antialiased text-sm leading-4 tracking-wide">
              {token.chain.name}
            </p>
          </div>
        </div>

        <div className="h-full bg-warning-400 bg-opacity-20 px-6 py-8">
          <div className="uppercase font-mono font-bold antialiased text-3xl leading-none tracking-wide shadow-primary-50">
            <div className="inline-flex flex-none justify-center cursor-pointer">
              <div className="sup-asset-label inline-flex w-fit items-center gap-0.5 h-full">
                <div className="inline-flex flex-row justify-center items-start shrink-0 gap-1 text-lg sm:text-2xl">
                  view <ArrowRight className="h-7 w-4 sm:h-8 sm:w-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex w-full flex-col items-start justify-start px-6 py-4">
        <div className="flex w-full flex-col items-center justify-start gap-5 self-stretch lg:items-start">
          <div className="flex flex-col items-start justify-start gap-1 self-stretch lg:items-start">
            <p className="uppercase text-xs font-mono font-normal antialiased leading-none tracking-[1px] text-warning-800">
              DESCRIPTION
            </p>
            <div className="inline-flex items-center justify-center gap-2 self-stretch lg:justify-start">
              <p className="tracking-normal font-mono font-normal antialiased text-start text-sm normal-case leading-4 lg:text-left">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

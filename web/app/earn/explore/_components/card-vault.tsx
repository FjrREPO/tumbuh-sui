import Image from "next/image";
import Link from "next/link";
import React from "react";

import { normalizeTVL } from "@/lib/helper";

export default function CardVault({ item, idx }: { item: any; idx: number }) {
  return (
    <Link key={item.id} className="group" href={`/earn/vault/${item.id}`}>
      <div className="flex sm:h-20">
        <div className="flex w-10 shrink-0 items-center justify-center rounded-l-2xl border-b border-l border-t border-warning-300 bg-warning-25 text-xs font-bold">
          {idx + 1}
        </div>
        <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-br-2xl border border-warning-300 bg-neutral-25 px-4 py-6  group-hover:bg-warning-50 sm:flex-row sm:gap-0 sm:py-0">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0">
            <div className="sup-asset-pair inline-flex relative pr-4 mr-2">
              <span className="sup-asset inline-flex rounded-full overflow-hidden h-8 w-8">
                <Image
                  alt={item.protocol.name}
                  className="object-cover object-center rounded-full"
                  height={32}
                  src={item.assets[0].image}
                  width={32}
                />
              </span>
              <span className="sup-asset inline-flex rounded-full overflow-hidde h-8 w-8 absolute bottom-0 bg-neutral-950 right-0">
                <Image
                  alt={item.friendly_name}
                  className="object-cover object-center rounded-full"
                  height={32}
                  src={item.protocol.graphics.icon}
                  width={32}
                />
              </span>
            </div>
            <div className="block text-center sm:text-left">
              <p className="uppercase text-base tracking-normal font-mono font-bold leading-none antialiased">
                {item.friendly_name}
              </p>
              <p className="uppercase text-xs tracking-normal font-mono font-normal antialiased leading-4">
                {item.assets[0].name}
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-full border border-neutral-300 p-2 text-sm leading-4 text-white">
            TVL{" "}
            <b className="font-mono">
              {normalizeTVL(item.vault_statistics.tvl_now, item.decimals)}
            </b>
          </div>
        </div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { normalizeTVL } from "@/lib/helper";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";

export default function CardProtocol({
  item,
  idx,
}: {
  item: any;
  idx: number;
}) {
  return (
    <Link key={item.id} className="group" href={`/earn/protocol/${item.id}`}>
      <div className="flex sm:h-20">
        <div className="flex w-10 shrink-0 items-center justify-center rounded-l-2xl border-b border-l border-t border-warning-300 bg-warning-25 text-xs font-bold">
          {idx + 1}
        </div>
        <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-br-2xl border border-warning-300 bg-neutral-25 px-4 py-6  group-hover:bg-warning-50 sm:flex-row sm:gap-0 sm:py-0">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0">
            <Image
              alt={item.name}
              className="mr-2 overflow-hidden rounded-full object-cover"
              height={32}
              src={item.graphics.icon}
              width={32}
            />
            <div className="block text-center sm:text-left">
              <p className="uppercase text-base tracking-normal font-mono font-bold leading-none antialiased">
                {item.name}
              </p>
              <p className="uppercase text-xs tracking-normal font-mono font-normal antialiased leading-4">
                {item.vaults_amount} Vaults
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-full border border-neutral-300 p-2 text-sm leading-4 text-white">
            TVL{" "}
            <b className="font-mono">
              {normalizeTVL(item.tvl, DECIMALS_MOCK_TOKEN)}
            </b>
          </div>
        </div>
      </div>
    </Link>
  );
}

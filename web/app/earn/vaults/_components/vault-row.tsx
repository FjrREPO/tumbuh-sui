import Image from "next/image";
import { Chip } from "@heroui/chip";

import { Vault } from "@/types/api/vault.type";
import { normalizeTVL } from "@/lib/helper";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";

interface VaultRowProps {
  vault: Vault;
}

export default function VaultRow({ vault }: VaultRowProps) {
  return (
    <div
      className="grid grid-cols-7 h-[88px] border-t border-neutral-900 hover:bg-neutral-900"
      style={{
        gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr auto",
      }}
    >
      <div className="flex items-center px-4">
        <div className="inline-flex h-[72px] items-center justify-start gap-2">
          <div className="flex w-[48px] items-center justify-center">
            <div className="flex items-center -space-x-3">
              {vault.yield_type === "Yield" ? (
                <div className="sup-asset-pair inline-flex relative pr-4 mr-2">
                  <span className="sup-asset inline-flex rounded-full overflow-hidden h-8 w-8">
                    <Image
                      alt={vault.protocol.name}
                      className="object-cover object-center rounded-full"
                      height={32}
                      src={vault.assets[0].image}
                      width={32}
                    />
                  </span>
                  <span className="sup-asset inline-flex rounded-full overflow-hidde h-8 w-8 absolute bottom-0 bg-transparent right-0">
                    <Image
                      alt={vault.friendly_name}
                      className="object-cover object-center rounded-full"
                      height={32}
                      src={vault.protocol.graphics.icon}
                      width={32}
                    />
                  </span>
                </div>
              ) : (
                <div className="inline-flex relative">
                  <span className="inline-flex rounded-full overflow-hidden h-6 w-6">
                    <Image
                      alt={vault.friendly_name}
                      className="object-cover object-center rounded-full"
                      height={24}
                      src={vault.chain.icon}
                      width={24}
                    />
                  </span>
                  <span className="inline-flex rounded-full overflow-hidden h-3 w-3 absolute bottom-0 bg-transparent right-0">
                    <Image
                      alt="Chain"
                      className="object-cover object-center rounded-full"
                      height={12}
                      src={vault.assets[0].image}
                      width={12}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="inline-flex min-w-0 shrink grow basis-0 flex-col items-start justify-start">
            <a
              className="inline-flex w-full flex-auto cursor-pointer overflow-hidden text-warning-700 decoration-from-font underline-offset-2 hover:underline"
              href={`/earn/vault/${vault.id}/`}
            >
              <p className="uppercase text-base tracking-normal font-mono font-normal antialiased leading-6 text-white line-clamp-2">
                {vault.name}
              </p>
            </a>
            <a
              className="inline-flex w-full flex-auto cursor-pointer overflow-hidden text-warning-700 decoration-from-font underline-offset-2 hover:underline"
              href={`/earn/protocol/${vault.protocol.id}/`}
            >
              <p className="text-xs tracking-normal font-mono font-normal antialiased w-full uppercase leading-4">
                {vault.protocol.name}
              </p>
            </a>
            <div className="inline-flex items-center justify-start gap-1 self-stretch pt-1" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4">
        <span className="font-sans text-[16px] font-normal leading-none tracking-normal antialiased">
          {normalizeTVL(vault.vault_statistics.tvl_now, DECIMALS_MOCK_TOKEN)}
        </span>
      </div>

      <div className="flex justify-center items-center px-4">
        <Chip color="warning" variant="flat">
          {vault.yield_type}
        </Chip>
      </div>

      <div className="flex items-center justify-center px-4">
        <div className="inline-flex flex-none justify-center">
          <span className="font-sans text-[16px] font-normal leading-none tracking-normal antialiased">
            {vault.vault_statistics.apy_day.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center px-4">
        <div className="inline-flex flex-none justify-center">
          <span className="font-sans text-[16px] font-normal leading-none tracking-normal antialiased">
            {vault.vault_statistics.apy_month.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

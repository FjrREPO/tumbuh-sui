import Image from "next/image";
import { Chip } from "@heroui/chip";

import { Protocol } from "@/types/api/protocol.type";
import { normalizeTVL } from "@/lib/helper";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";

interface ProtocolRowProps {
  protocol: Protocol;
}

export default function ProtocolRow({ protocol }: ProtocolRowProps) {
  return (
    <div
      className="grid grid-cols-7 h-[88px] border-t border-neutral-900 hover:bg-neutral-900"
      style={{
        gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
      }}
    >
      <div className="flex items-center px-4">
        <div className="inline-flex h-[72px] items-center justify-start gap-2">
          <div className="flex w-[48px] items-center justify-center">
            <div className="flex items-center -space-x-3">
              <div className="inline-flex relative">
                <span className="inline-flex rounded-full overflow-hidden h-6 w-6">
                  <Image
                    alt={protocol.name}
                    className="object-cover object-center"
                    height={24}
                    src={protocol.graphics.icon}
                    width={24}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="inline-flex min-w-0 shrink grow basis-0 flex-col items-start justify-start">
            <a
              className="inline-flex w-full flex-auto cursor-pointer overflow-hidden text-warning-700 decoration-from-font underline-offset-2 hover:underline"
              href={`/earn/protocol/${protocol.id}/`}
            >
              <p className="uppercase text-base tracking-normal font-mono font-normal antialiased leading-6 text-white">
                {protocol.name}
              </p>
            </a>
            <a
              className="inline-flex w-full flex-auto cursor-pointer overflow-hidden text-warning-700 decoration-from-font underline-offset-2 hover:underline"
              href={`/earn/protocol/${protocol.id}/`}
            >
              <p className="text-xs tracking-normal font-mono font-normal antialiased w-full uppercase leading-4">
                {protocol.name}
              </p>
            </a>
            <div className="inline-flex items-center justify-start gap-1 self-stretch pt-1" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4">
        <span className="font-sans text-[16px] font-normal leading-none tracking-normal antialiased">
          {normalizeTVL(protocol.tvl, DECIMALS_MOCK_TOKEN)}
        </span>
      </div>

      <div className="flex justify-center items-center px-4">
        <Chip color="warning" variant="flat">
          {protocol.type}
        </Chip>
      </div>

      <div className="flex items-center justify-end px-4">
        <div className="inline-flex flex-none justify-center">
          <Chip color="success" variant="flat">
            {protocol.is_authenticated === true
              ? "Authenticated"
              : "Unauthenticated"}
          </Chip>
        </div>
      </div>
    </div>
  );
}

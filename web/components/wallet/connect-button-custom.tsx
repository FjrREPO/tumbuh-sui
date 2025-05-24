import { Button } from "@heroui/button";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import React from "react";
import Image from "next/image";

import { addressTumbuh } from "@/lib/constants";
import { useBalanceUser } from "@/hooks/query/use-balance-user";
import { tokensData } from "@/data/tokens-data";

export default function ConnectButtonCustom() {
  const account = useCurrentAccount();
  const address = account?.address;

  const { normalizedBalance } = useBalanceUser(addressTumbuh);

  return (
    <div className="w-full">
      {!address ? (
        <ConnectButton />
      ) : (
        <div className="flex flex-row items-center gap-2">
          <Button className="px-4 py-[25px] bg-white text-black rounded-xl font-medium text-sm">
            <div className="flex flex-row items-center gap-1">
              <span>{parseFloat(normalizedBalance ?? 0).toFixed(2)}</span>
              <Image
                alt="logo"
                className="min-w-5 min-h-5 w-5 h-5 rounded-full"
                height={50}
                src={tokensData[0].image}
                width={50}
              />
            </div>
          </Button>
          <ConnectButton />
        </div>
      )}
    </div>
  );
}

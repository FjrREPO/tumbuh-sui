"use client";

import EarnTabs from "../_components/earn-tabs";

import CardDeposit from "./_components/card-deposit";

import WalletWrapper from "@/components/wallet/wallet-wrapper";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full">
      <EarnTabs />
      <WalletWrapper>
        <CardDeposit />
      </WalletWrapper>
    </div>
  );
}

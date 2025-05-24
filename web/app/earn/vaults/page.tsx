"use client";

import EarnTabs from "../_components/earn-tabs";

import VaultDataGrid from "./_components/vault-data-grid";

import { vaultsData } from "@/data/vaults-data";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full">
      <EarnTabs />
      <VaultDataGrid isLoading={false} vaults={vaultsData} />
    </div>
  );
}

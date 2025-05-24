"use client";

import EarnTabs from "../_components/earn-tabs";

import ProtocolDataGrid from "./_components/protocol-data-grid";

import { protocolsData } from "@/data/protocols-data";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full">
      <EarnTabs />
      <ProtocolDataGrid isLoading={false} protocols={protocolsData} />
    </div>
  );
}

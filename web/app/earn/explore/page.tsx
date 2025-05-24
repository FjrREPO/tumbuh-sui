"use client";

import EarnTabs from "../_components/earn-tabs";

import Explore from "./_components/explore";

export default function Page() {
  return (
    <div className="flex flex-col w-full h-full">
      <EarnTabs />
      <Explore />
    </div>
  );
}

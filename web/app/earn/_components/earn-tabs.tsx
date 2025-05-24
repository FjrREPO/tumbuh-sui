"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

export default function EarnTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = ["explore", "deposit", "vaults", "protocols"];

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center gap-1 pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            className={`rounded-none border-b uppercase ${pathname.startsWith(`/earn/${tab}`) ? "border-warning" : "border-gray-500 text-gray-300"}`}
            color={"warning"}
            variant={"light"}
            onPress={() => router.push(`/earn/${tab}`)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <Divider className="mt-1" orientation="horizontal" />
    </div>
  );
}

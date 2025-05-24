import Link from "next/link";
import { MoonStar, Sparkles } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";

import CardProtocol from "./card-protocol";
import CardCategory from "./card-category";
import CardVault from "./card-vault";
import CardContent from "./card-content";
import CardHighlight from "./card-highlight";

import { categoriesData } from "@/data/categories-data";
import { vaultsData } from "@/data/vaults-data";
import { tokensData } from "@/data/tokens-data";
import { protocolsData } from "@/data/protocols-data";

export default function Explore() {
  const vaults = vaultsData;
  const protocols = protocolsData;
  const tokens = tokensData;

  const isLoading = false;

  const usdcToken = tokens?.find((token) => token.symbol === "USDC");

  const protocolsSorted = protocols?.sort((a, b) => {
    if (a.tvl > b.tvl) {
      return -1;
    }
    if (a.tvl < b.tvl) {
      return 1;
    }

    return 0;
  });

  return (
    <div className="w-full h-full text-white flex flex-col pb-10">
      {isLoading ? (
        <div className="mt-5 relative inline-flex w-full flex-col items-center overflow-hidden rounded-3xl rounded-b-3xl border-[0.5px] border-warning-500 lg:col-span-2">
          <div className="inline-flex h-24 w-full items-center justify-start bg-warning-400 bg-opacity-10">
            <div className="inline-flex flex-1 items-center space-x-2 space-y-1 py-6 pl-5">
              <div className="relative inline-flex">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-full absolute bottom-0 right-0" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            </div>
            <div className="min-w-[164px] px-6 py-8 bg-warning-400 bg-opacity-20">
              <div className="inline-flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start px-6 py-4 gap-5">
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full">
              <div className="flex flex-col gap-1 w-full">
                <Skeleton className="h-3 w-32 rounded-md" />
                <Skeleton className="h-6 w-[200px] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        usdcToken && (
          <CardHighlight
            description="USD Coin (USDC) is a fully-backed, regulated stablecoin pegged 1:1 to the U.S. dollar. It is issued by Circle and governed by the Centre Consortium, which was founded by Circle and Coinbase. USDC is designed to provide a fast, secure, and transparent digital dollar for global transactions, DeFi (decentralized finance), trading, and payments."
            token={usdcToken}
          />
        )
      )}

      <section className="mt-20">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 md:gap-2">
            <h3 className="font-mono text-base font-bold uppercase leading-5 tracking-normal md:text-xl md:leading-6">
              Top Protocols
            </h3>
          </div>
          <Link
            className="inline-flex rounded-lg rounded-tr-none border border-warning-500 bg-warning-25 px-4 py-2 font-mono text-sm uppercase leading-4 tracking-[1px] text-warning-900 hover:bg-warning-75 md:text-base md:leading-6"
            href="/earn/protocols"
          >
            View Protocols
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {protocolsSorted &&
            protocolsSorted
              .slice(0, 8)
              .map((protocol, idx) => (
                <CardProtocol key={protocol.id} idx={idx} item={protocol} />
              ))}
        </div>
      </section>

      <CardContent
        buttonLink="/earn/protocols"
        buttonText="Discover Protocols"
        description="Search and discover many protocols and vaults in the DeFi space."
        icon={<MoonStar />}
        title="Discover the best protocols"
      />

      <section>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 md:gap-2">
            <h3 className="font-mono text-base font-bold uppercase leading-5 tracking-normal md:text-xl md:leading-6">
              Hot Vaults
            </h3>
          </div>
          <Link
            className="inline-flex rounded-lg rounded-tr-none border border-warning-500 bg-warning-25 px-4 py-2 font-mono text-sm uppercase leading-4 tracking-[1px] text-warning-900 hover:bg-warning-75 md:text-base md:leading-6"
            href="/earn/vaults"
          >
            View Vaults
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {vaults &&
            vaults
              ?.slice(0, 8)
              .map((item, idx) => (
                <CardVault key={item.id} idx={idx} item={item} />
              ))}
        </div>
      </section>

      <CardContent
        buttonLink="/earn/vaults"
        buttonText="Explore Vaults"
        description="Discover the best vaults in the DeFi space. Explore our curated list of top-performing vaults."
        icon={<Sparkles />}
        title="Explore the best vaults"
      />

      <section>
        <div className="flex">
          <div className="flex flex-1 flex-col gap-1 md:gap-2">
            <h3 className="font-mono text-base font-bold uppercase leading-5 tracking-normal md:text-xl md:leading-6">
              Categories
            </h3>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {categoriesData.map((cat) => (
            <CardCategory key={cat.title} item={cat} />
          ))}
        </div>
      </section>
    </div>
  );
}

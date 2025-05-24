"use client";

import { Card, CardBody } from "@heroui/card";
// import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
// import { Divider } from "@heroui/divider";
// import { useState } from "react";
import Link from "next/link";
// import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
// import { Transaction } from "@mysten/sui/transactions";

import PortfolioTabs from "../_components/portfolio-tabs";

// import ModalTransactionCustom from "@/components/modal/modal-transaction-custom";
// import SkeletonWrapper from "@/components/loader/skeleton-wrapper";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import {
  addressTumbuh,
  // addressUSDCVault,
  // chainIdentifier,
} from "@/lib/constants";
import { useBalanceVault } from "@/hooks/query/use-balance-vault";
// import { tokensData } from "@/data/tokens-data";
// import { vaultsData } from "@/data/vaults-data";
// import { denormalize } from "@/lib/bignumber";
// import { useCurrentStrategy } from "@/hooks/query/use-current-strategy";

export default function PositionStaking() {
  // const [isOpen, setIsOpen] = useState(false);
  // const {
  //   mutate: mWithdraw,
  //   isPending: ipWithdraw,
  //   error: eWithdraw,
  //   status: sWithdraw,
  // } = useSignAndExecuteTransaction();
  // const [output, setOutput] = useState<null | { digest: string }>(null);

  const { normalizedBalance: bNormalized } = useBalanceVault(addressTumbuh);

  // const { data, loading: csLoading } = useCurrentStrategy({
  //   objectId: addressUSDCVault as string,
  // });

  // const tokens = tokensData;
  // const vaults = vaultsData;

  // const isLoading = bLoading || csLoading;

  // const token = tokens?.find((token) => token.symbol.toLowerCase() === "usdc");
  // const protocolName = contractAddress.protocols.find(
  //   (protocol) =>
  //     protocol.contract_address.toLowerCase() === data?.protocol.toLowerCase(),
  // )?.name;

  // const vault = vaults?.find(
  //   (protocol) => protocol.name.toLowerCase() === protocolName?.toLowerCase(),
  // );

  // const formatNumber = (num: number) => {
  //   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // };

  // const handleWithdraw = () => {
  //   if (!bNormalized || Number(bNormalized) <= 0 || ipWithdraw) {
  //     return;
  //   }

  //   const tx = new Transaction();

  //   tx.moveCall({
  //     target: `${addressTumbuh}::usdc_vault::withdraw`,
  //     arguments: [tx.pure.u64(denormalize(bNormalized, 6))],
  //   });

  //   mWithdraw(
  //     {
  //       transaction: tx,
  //       chain: chainIdentifier,
  //     },
  //     {
  //       onSuccess: (data) => {
  //         setIsOpen(true);
  //         setOutput({
  //           digest: data.digest,
  //         });
  //       },
  //       onError: () => {
  //         setIsOpen(true);
  //       },
  //     },
  //   );
  // };

  // const onClose = () => {
  //   setIsOpen(false);
  // };

  return (
    <div className="flex flex-col space-y-6 w-full mx-auto">
      {/* <ModalTransactionCustom
        data={output?.digest ?? ""}
        errorMessage={eWithdraw?.message}
        isOpen={isOpen}
        name={"Withdraw"}
        status={sWithdraw ?? ""}
        onClose={onClose}
      /> */}
      <PortfolioTabs />
      <WalletWrapper>
        {Number(bNormalized ?? 0) > 0 ? (
          <Card
            className={`bg-background/10 border-1 shadow-warning/30 transition-all hover:border-warning/60 cursor-pointer rounded-[30px] rounded-tr-none max-w-xl`}
          >
            <CardBody className="p-5">
              <p className="border-1 border-warning/30 p-2 rounded-2xl text-sm text-gray-300">
                The agent will automatically move your USDC to the new protocol
                to rebalance your portfolio.
              </p>

              <p>Under Maintenance</p>
              {/* <div className="flex flex-col space-y-4">
                <div className="inline-flex h-[72px] items-center justify-start gap-3">
                  <div className="flex w-[48px] items-center justify-center">
                    <div className="flex items-center -space-x-3">
                      <div className="sup-asset-pair inline-flex relative pr-4 mr-2">
                        <span className="sup-asset inline-flex rounded-full overflow-hidden h-8 w-8">
                          <SkeletonWrapper isLoading={isLoading}>
                            <Image
                              alt="Asset A"
                              className="object-cover object-center"
                              height={32}
                              src={
                                vault?.protocol.graphics.icon ||
                                "/placeholder.png"
                              }
                              width={32}
                            />
                          </SkeletonWrapper>
                        </span>
                        <span className="sup-asset inline-flex rounded-full overflow-hidden h-8 w-8 absolute bottom-0 bg-neutral-950 right-0">
                          <SkeletonWrapper isLoading={isLoading}>
                            <Image
                              alt="Asset B"
                              className="object-cover object-center"
                              height={32}
                              src={token?.image || "/placeholder.png"}
                              width={32}
                            />
                          </SkeletonWrapper>
                        </span>
                      </div>
                    </div>
                  </div>
                  <SkeletonWrapper isLoading={isLoading}>
                    <div className="inline-flex min-w-0 shrink grow basis-0 flex-col items-start justify-start">
                      <p className="uppercase text-base tracking-normal font-mono font-normal antialiased leading-6 text-white">
                        {vault?.name}
                      </p>
                      <p className="text-xs tracking-normal font-mono font-normal antialiased w-full uppercase leading-4 text-gray-400">
                        USDC
                      </p>
                    </div>
                  </SkeletonWrapper>
                  <SkeletonWrapper isLoading={isLoading}>
                    <Chip
                      color={
                        (vault?.vault_statistics.apy_now as number) > 10
                          ? "success"
                          : "warning"
                      }
                      variant="flat"
                    >
                      {vault?.vault_statistics.apy_now.toFixed(2)}% APY
                    </Chip>
                  </SkeletonWrapper>
                </div>

                <Divider className="my-1 bg-gray-800" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Staked Amount</p>
                    <SkeletonWrapper isLoading={isLoading}>
                      <p className="text-sm font-mono">
                        {formatNumber(parseFloat(bNormalized))} USDC
                      </p>
                    </SkeletonWrapper>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Rewards Earned</p>
                    <SkeletonWrapper isLoading={isLoading}>
                      <p className="text-sm font-mono text-success">
                        {data?.harvestedYield} USDC
                      </p>
                    </SkeletonWrapper>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-2">
                  <SkeletonWrapper isLoading={isLoading}>
                    <Button
                      className={`w-full py-4 text-white font-medium rounded-xl flex items-center justify-center transition-all duration-200 ${ipWithdraw || Number(bNormalized ?? 0) <= 0 ? "bg-warning/20 cursor-not-allowed" : "bg-warning/70 hover:bg-warning-200"}`}
                      color="warning"
                      disabled={ipWithdraw || Number(bNormalized ?? 0) <= 0}
                      onPress={handleWithdraw}
                    >
                      {ipWithdraw ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          Processing Withdraw...
                        </div>
                      ) : (
                        <div className="flex items-center">Withdraw All</div>
                      )}
                    </Button>
                  </SkeletonWrapper>
                </div>
              </div> */}
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center w-full h-[300px]">
            <p className="text-gray-400">No USDC Staked</p>
            <Link
              className="ml-2 text-warning-500 underline"
              href="/earn/deposit"
              rel="noopener noreferrer"
            >
              <Button color="warning" variant="flat">
                Deposit Now
              </Button>
            </Link>
          </div>
        )}
      </WalletWrapper>
    </div>
  );
}

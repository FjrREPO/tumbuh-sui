import { useState } from "react";
import { ChevronRight, Info, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Link from "next/link";

import { tokensData } from "@/data/tokens-data";
import { useBalanceUser } from "@/hooks/query/use-balance-user";
import ModalTransactionCustom from "@/components/modal/modal-transaction-custom";
import {
  addressTumbuh,
  addressUSDCVault,
  chainIdentifier,
} from "@/lib/constants";
import { useTokenType } from "@/hooks/query/use-token-type";
import { denormalize } from "@/lib/bignumber";

export default function CardDeposit() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const [amount, setAmount] = useState("");
  const [output, setOutput] = useState<null | {
    digest: string;
  }>(null);

  const account = useCurrentAccount();
  const address = account?.address ?? "";

  const { data } = useTokenType();

  const { normalizedBalance } = useBalanceUser(addressTumbuh);

  const bNormalized = parseFloat(normalizedBalance ?? "0");

  const { mutate, isPending, error, status } = useSignAndExecuteTransaction();
  const {
    mutate: mutateWithdraw,
    isPending: isPendingWithdraw,
    error: errorWithdraw,
    status: statusWithdraw,
  } = useSignAndExecuteTransaction();

  const isValidAmount = () => {
    const numAmount = parseFloat(amount);

    return numAmount > 0 && numAmount <= bNormalized;
  };

  const handleDeposit = () => {
    if (!isValidAmount()) return;
    const tx = new Transaction();

    const coinObjects = data.map((item) => tx.object(item.coinObjectId));
    // const coinTypes = data.map((item) => item.coinType);

    tx.moveCall({
      target: `${addressTumbuh}::usdc_vault::deposit`,
      arguments: [
        tx.object(addressUSDCVault),
        tx.object(coinObjects[0]), // TreasuryCap object ID
        // tx.pure.vector(coinObjects, coinTypes[0]),
        // tx.makeMoveVec({
        //   elements: coinObjects,
        //   type: coinTypes[0],
        // }),
        tx.pure.u64(denormalize(amount, 6)),
        tx.pure.address(address),
      ],
    });

    mutate(
      {
        transaction: tx,
        chain: chainIdentifier,
      },
      {
        onSuccess: (data) => {
          setIsOpen(true);
          setAmount("");
          setOutput({
            digest: data.digest,
          });
        },
        onError: () => {
          setIsOpen(true);
        },
      },
    );
  };

  const handleWithdraw = () => {
    if (!bNormalized || Number(bNormalized) <= 0 || isPending) {
      return;
    }
    const tx = new Transaction();

    const coinObjects = data.map((item) => tx.object(item.coinObjectId));

    tx.moveCall({
      target: `${addressTumbuh}::usdc_vault::withdraw`,
      arguments: [
        tx.object(addressUSDCVault),
        tx.object(coinObjects[0]), // TreasuryCap object ID
        // tx.pure.vector(coinObjects, coinTypes[0]),
        // tx.makeMoveVec({
        //   elements: coinObjects,
        //   type: coinTypes[0],
        // }),
        tx.pure.u64(1_000_000_000),
        tx.pure.address(address),
      ],
    });

    mutateWithdraw(
      {
        transaction: tx,
        chain: chainIdentifier,
      },
      {
        onSuccess: (data) => {
          setIsOpen(true);
          setOutput({
            digest: data.digest,
          });
        },
        onError: () => {
          setIsOpen(true);
        },
      },
    );
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumberInput = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, "");

    const parts = cleaned.split(".");
    const integerPart = parts[0] || "0";
    const decimalPart = parts[1] || "";

    return parts.length > 2
      ? `${integerPart}.${decimalPart}`
      : cleaned === "."
        ? "0."
        : cleaned;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-warning/30 bg-background/20 shadow-lg mt-5 max-w-xl">
      <ModalTransactionCustom
        data={output?.digest ?? ""}
        errorMessage={error?.message}
        isOpen={isOpen}
        name={"Deposit"}
        status={status ?? ""}
        onClose={onClose}
      />
      <ModalTransactionCustom
        data={output?.digest ?? ""}
        errorMessage={errorWithdraw?.message}
        isOpen={isOpen}
        name={"Withdraw"}
        status={statusWithdraw ?? ""}
        onClose={onClose}
      />
      <div className="border-b border-warning/20 p-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              alt="USDC Token"
              height={40}
              src={tokensData[0].image}
              width={40}
            />
            <h2 className="text-xl font-bold text-white">Deposit USDC</h2>
          </div>
          <Chip
            className="flex flex-row items-center"
            color="warning"
            variant="flat"
          >
            <span className="text-sm text-white font-medium">
              Automated Earnings
            </span>
          </Chip>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5">
          <label
            className="block mb-2 text-sm font-medium"
            htmlFor="deposit-amount"
          >
            Amount to Deposit
          </label>
          <div className="relative">
            <Input
              aria-describedby="balance-info"
              classNames={{
                inputWrapper: "h-20 bg-white/10 data-[hover=true]:bg-white/10",
                input: "text-2xl font-bold placeholder:text-gray-500",
              }}
              disabled={isPending}
              id="deposit-amount"
              max="16000000"
              min="0"
              placeholder="0.0"
              type="text"
              value={amount}
              onChange={(e) => {
                const raw = parseNumberInput(e.target.value);

                setAmount(raw);
              }}
            />

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <Button
                className="px-3 py-1 hover:bg-warning/20 text-white rounded-lg font-medium text-sm transition-colors"
                disabled={isPending}
                variant="flat"
                onPress={() => setAmount(bNormalized.toString())}
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-6" id="balance-info">
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4 text-warning-500" />
            <span>Available Balance: {`${bNormalized?.toFixed(2)} USDC`}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl mb-6 border border-warning/20">
          <div className="flex justify-between mb-3">
            <span className="text-sm">Transaction Fee</span>
            <span className="text-sm font-medium">~0.00002 ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">You Will Deposit</span>
            <span className="text-sm font-medium">
              {amount ? `${formatNumber(parseFloat(amount))} USDC` : "0.0 USDC"}
            </span>
          </div>
        </div>

        <Button
          className={`w-full py-4 text-white font-medium rounded-xl flex items-center justify-center transition-all duration-200 ${isValidAmount() ? "bg-warning/70 hover:bg-warning-200" : "bg-warning/20 cursor-not-allowed"}`}
          color="warning"
          disabled={!isValidAmount() || isPending}
          onPress={handleDeposit}
        >
          {isPending ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Processing Deposit...
            </div>
          ) : (
            <div className="flex items-center">
              Deposit Now
              <ChevronRight className="ml-1 w-5 h-5" />
            </div>
          )}
        </Button>

        <Button
          className={`mt-5 w-full py-4 text-white font-medium rounded-xl flex items-center justify-center transition-all duration-200 ${bNormalized && Number(bNormalized) > 0 ? "bg-warning/70 hover:bg-warning-200" : "bg-warning/20 cursor-not-allowed"}`}
          color="warning"
          disabled={
            !bNormalized || Number(bNormalized) <= 0 || isPendingWithdraw
          }
          onPress={handleWithdraw}
        >
          {isPendingWithdraw ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Processing Withdraw...
            </div>
          ) : (
            <div className="flex items-center">
              Withdraw All
              <ChevronRight className="ml-1 w-5 h-5" />
            </div>
          )}
        </Button>
      </div>

      <div className="p-4 border-t border-warning/20 bg-opacity-50">
        <div className="flex items-center text-sm text-gray-300">
          <Info className="w-4 h-4 mr-2 text-warning-500" />
          If you don&apos;t have USDC, you can get some from the faucet.{" "}
          <Link className="text-blue-500 hover:underline pl-1" href="/faucet">
            Claim Faucet
          </Link>
        </div>
      </div>
    </div>
  );
}

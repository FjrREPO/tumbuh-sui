"use client";
import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Alert } from "@heroui/alert";
import { Snippet } from "@heroui/snippet";
import { CheckCircle, Wallet } from "lucide-react";
import { IconExclamationCircle } from "@tabler/icons-react";
import Image from "next/image";

import { addressTumbuh, chainIdentifier, treasuryCapId } from "@/lib/constants";
import ModalTransactionCustom from "@/components/modal/modal-transaction-custom";

export default function Page() {
  const account = useCurrentAccount();
  const address = account?.address;

  const [output, setOutput] = useState<null | {
    digest: string;
    status: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const { mutate, isPending } = useSignAndExecuteTransaction();

  const execute = () => {
    if (!address) {
      setError("Wallet not connected");

      return;
    }
    setOutput(null);
    setError(null);

    const tx = new Transaction();

    // NOTE:
    // The argument order usually: treasuryCap object ID, recipient address, amount (u64)
    // Also amount should be a BigInt for u64 type.
    tx.moveCall({
      target: `${addressTumbuh}::mock_usdc::mint`,
      arguments: [
        tx.object(treasuryCapId),
        tx.pure.u64(1_000_000_000),
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
          const digest = data?.digest || "unknown";
          const status = "success";

          setOutput({ digest, status });
          setIsOpen(true);
        },
        onError: (err) => {
          setError(err.message);
          setIsOpen(true);
        },
      },
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-warning/30 bg-background/20 shadow-lg mt-5 max-w-xl">
      <ModalTransactionCustom
        data={output?.digest ?? ""}
        errorMessage={error ?? ""}
        isOpen={isOpen}
        name={"Deposit"}
        status={output?.status ?? ""}
        onClose={onClose}
      />
      <div className="border-b border-warning/20 p-4 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full">
            <Image
              alt="USDC Logo"
              className="rounded-full"
              height={40}
              src="/usdc.png"
              width={40}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">USDC Faucet</h1>
            <p className="text-sm text-default-500">
              Get testnet tokens instantly
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Status */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-default-500" />
            <span className="text-sm font-medium">Wallet Status</span>
          </div>

          {address ? (
            <div className="space-y-2">
              <Chip
                color="success"
                startContent={<CheckCircle className="w-4 h-4" />}
                variant="flat"
              >
                Connected
              </Chip>
            </div>
          ) : (
            <Chip
              color="warning"
              startContent={<IconExclamationCircle className="w-4 h-4" />}
              variant="flat"
            >
              Not Connected
            </Chip>
          )}
        </div>

        {address && (
          <Snippet className="w-full" size="md" symbol="" variant="flat">
            {`${address.slice(0, 10)}...${address.slice(-4)}`}
          </Snippet>
        )}

        {/* Request Button */}
        <Button
          className="w-full"
          color="warning"
          disabled={!address || isPending}
          isLoading={isPending}
          size="lg"
          variant="shadow"
          onPress={execute}
        >
          {isPending ? "Processing Request..." : "Request 1,000 USDC"}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert
            color="danger"
            description={error}
            startContent={<IconExclamationCircle className="w-5 h-5" />}
            title="Transaction Error"
            variant="flat"
          />
        )}

        {/* Help Text */}
        <div className="text-center text-xs text-default-400 space-y-1">
          <p>
            This faucet provides testnet USDC tokens for development purposes.
          </p>
          <p>Tokens have no real value and are only for testing.</p>
        </div>
      </div>
    </div>
  );
}

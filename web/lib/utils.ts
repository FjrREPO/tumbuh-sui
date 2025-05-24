import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const explorer = "https://suiscan.xyz/testnet/tx/" as const;

export function urlExplorer({
  address,
  txHash,
  type = "object",
}: {
  address?: string;
  txHash?: string;
  type?: "object" | "tx" | "none";
}) {
  return `${explorer}${type === "object" ? "object/" : type === "none" ? "" : "tx/"}${address || txHash}`;
}

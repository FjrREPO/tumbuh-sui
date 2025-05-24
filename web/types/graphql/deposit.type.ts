import { z } from "zod";

export const DepositsSchema = z.object({
  id: z.string(),
  owner: z.string(),
  assets: z.string(),
  sender: z.string(),
  shares: z.string(),
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  transactionHash: z.string(),
});

export type Deposits = z.infer<typeof DepositsSchema>;
export type DepositsList = Deposits[];

import { z } from "zod";

export const WithdrawnsSchema = z.object({
  id: z.string(),
  owner: z.string(),
  receiver: z.string(),
  usdcAmount: z.string(),
  blockNumber: z.string(),
  sUSDCAmount: z.string(),
  blockTimestamp: z.string(),
  transactionHash: z.string(),
});

export type Withdrawns = z.infer<typeof WithdrawnsSchema>;
export type WithdrawnsList = Withdrawns[];

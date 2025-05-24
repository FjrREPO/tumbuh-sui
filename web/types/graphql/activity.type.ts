import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string(),
  owner: z.string(),
  receiver: z.string(),
  shares: z.string(),
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  transactionHash: z.string(),
  type: z.enum(["Deposit", "Withdraw"]),
});

export const ActivitiesSchema = z.array(ActivitySchema);

export type Activity = z.infer<typeof ActivitySchema>;

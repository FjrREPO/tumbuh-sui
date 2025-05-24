import { z } from "zod";

export const tokenSchema = z.object({
  id: z.number(),
  contract_address: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  decimals: z.number(),
  chain: z.string(),
  chain_id: z.number().int(),
});

export type Token = z.infer<typeof tokenSchema>;
export type Tokens = Token[];

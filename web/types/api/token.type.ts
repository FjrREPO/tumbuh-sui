import { z } from "zod";

import { ChainSchema } from "./chain.type";

export const tokenSchema = z.object({
  id: z.string(),
  contract_address: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  decimals: z.number(),
  chain: ChainSchema,
});

export type Token = z.infer<typeof tokenSchema>;
export type Tokens = Token[];

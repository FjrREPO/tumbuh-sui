import { z } from "zod";

export const NativeTokenSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  logo: z.string().url(),
});

export const ChainSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_L1: z.boolean(),
  icon: z.string().url(),
  rpcs: z.string().url(),
  explorers: z.string().url(),
  nativeTokenId: z.string(),
  protocolId: z.string().nullable(),
  native_token: NativeTokenSchema,
});

export type Chain = z.infer<typeof ChainSchema>;
export type Chains = Chain[];

import { z } from "zod";

import { ProtocolSchema } from "./protocol.type";
import { ChainSchema } from "./chain.type";

const AssetSchema = z.object({
  id: z.string(),
  contract_address: z.string(),
  name: z.string(),
  symbol: z.string(),
  image: z.string().url(),
  decimals: z.number(),
});

const VaultStatisticsSchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  apy_now: z.number(),
  tvl_now: z.number(),
  sharpe_day: z.number(),
  sharpe_month: z.number(),
  apy_day: z.number(),
  apy_week: z.number(),
  apy_month: z.number(),
  apy_day_change: z.number(),
  apy_week_change: z.number(),
  apy_month_change: z.number(),
  tvl_day_change: z.number(),
  tvl_week_change: z.number(),
  tvl_month_change: z.number(),
  pps: z.number(),
  pps_usd: z.number(),
  reward_rate: z.number(),
  created_at: z.string().datetime(),
});

export const VaultSchema: z.ZodType<{
  id: string;
  contract_address: string;
  decimals: number;
  symbol: string;
  name: string;
  protocol_id: string;
  friendly_name: string;
  description: string;
  yield_type: string;
  external_url: string;
  deploy_date: string;
  visibility: string;
  availability: string;
  num_depositors: number;
  created_at: string;
  updated_at: string;
  protocol: z.infer<typeof ProtocolSchema>;
  chain: z.infer<typeof ChainSchema>;
  assets: Array<z.infer<typeof AssetSchema>>;
  vault_statistics: z.infer<typeof VaultStatisticsSchema>;
}> = z.object({
  id: z.string(),
  contract_address: z.string(),
  decimals: z.number(),
  symbol: z.string(),
  name: z.string(),
  protocol_id: z.string(),
  friendly_name: z.string(),
  description: z.string(),
  yield_type: z.string(),
  external_url: z.string().url(),
  deploy_date: z.string().datetime(),
  visibility: z.string(),
  availability: z.string(),
  num_depositors: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  protocol: ProtocolSchema,
  chain: ChainSchema,
  assets: z.array(AssetSchema),
  vault_statistics: VaultStatisticsSchema,
});

export type Vault = z.infer<typeof VaultSchema>;
export type Vaults = Vault[];

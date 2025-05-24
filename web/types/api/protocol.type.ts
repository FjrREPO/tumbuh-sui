import { z } from "zod";

import { VaultSchema } from "./vault.type";

const AuditSchema = z.object({
  id: z.string(),
  protocol_id: z.string(),
  audit_name: z.string(),
  audit_link: z.string().url(),
  audit_date: z.string(),
  is_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const FAQSchema = z.object({
  id: z.string(),
  protocol_id: z.string(),
  question: z.string(),
  answer: z.string(),
  is_deleted: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const GraphicsSchema = z.object({
  id: z.string(),
  icon: z.string().url(),
  header: z.string().url(),
  avatar: z.string().url(),
  watermark: z.string().nullable(),
  protocol_id: z.string(),
});

const LinksSchema = z.object({
  id: z.string(),
  website: z.string().url(),
  twitter: z.string().url(),
  discord: z.string().url(),
  telegram: z.string().nullable(),
  protocol_id: z.string(),
});

const UserSchema = z.object({
  id: z.string(),
  dynamic_id: z.string(),
  dynamic_wallet_id: z.string(),
  address: z.string(),
  protocol_id: z.string(),
  name: z.string(),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProtocolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  tagline: z.string(),
  is_hidden: z.boolean(),
  is_authenticated: z.boolean(),
  defillama_id: z.string().nullable(),
  vanity_url: z.string(),
  primary_color: z.string(),
  num_depositors: z.number(),
  status: z.string().nullable(),
  status_message: z.string().nullable(),
  deploy_date: z.string(),
  exploits: z.any().nullable(),
  vaults_amount: z.number(),
  tvl: z.number(),
  tvl_day_change: z.number(),
  tvl_week_change: z.number(),
  tvl_month_change: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  analytics: z.array(z.any()),
  audits: z.array(AuditSchema),
  deployers: z.array(z.any()),
  faq: z.array(FAQSchema),
  graphics: GraphicsSchema,
  links: LinksSchema,
  vault: VaultSchema,
  users: z.array(UserSchema),
  chains: z.array(z.any()),
});

export type Protocol = z.infer<typeof ProtocolSchema>;
export type Protocols = Protocol[];

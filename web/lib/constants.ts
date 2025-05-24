// TreasuryCapId → Object ID of TreasuryStore (Shared object)
export const treasuryCapId =
  "0x95a5c80cfc2b29c64fc0b9db58269a7ec1d6cfcfe391ba23d9595481a07ccbb4" as HexAddress;

// addressTumbuh → Object ID of Deployer or Main Protocol Module (Shared object, assume main VaultRoot)
export const addressTumbuh =
  "0x84e87f2e960aeef7807568352075a136970a1c133f14cd97f61ba0b9f54818a7" as HexAddress;

// addressUSDC → Object ID of MOCK_USDC (CoinMetadata) – typically Immutable, but you may use the object ID directly
export const addressUSDC =
  "0xc021c02d02657829a98cedec566c5ab35bdd41e27f6ea09215e0de7eca5974f5" as HexAddress;

// addressUSDCVault → Object ID of Vault (Shared object)
export const addressUSDCVault =
  "0x233bf0845cbf111cd7c9d781211da7099994e01767da6205206d3ab85a9cf339" as HexAddress;

const network = process.env.SUI_NETWORK || "testnet";

export const DECIMALS_MOCK_TOKEN = 6;

export const chainIdentifier: `${string}:${string}` = `sui:${network}`;

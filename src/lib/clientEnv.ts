const read = (key: string, fallback = ""): string =>
  process.env[key] ?? fallback;

export const clientEnv = {
  API_URL: read("NEXT_PUBLIC_API_URL", "/api"),
  CHAIN_ID: read("NEXT_PUBLIC_CHAIN_ID", "11155111"),
  CONTRACT_ADDRESS: read(
    "NEXT_PUBLIC_CONTRACT_ADDRESS",
    "0x9dE8472Ef25Fc12380FC889bd8f337a5De5A6615",
  ),
  ETHEREUM_RPC_URL: read("NEXT_PUBLIC_ETHEREUM_RPC_URL", "https://rpc.sepolia.org"),
  USDC_TOKEN_ADDRESS: read(
    "NEXT_PUBLIC_USDC_TOKEN_ADDRESS",
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  ),
  WALLETCONNECT_PROJECT_ID: read("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID", ""),
  APP_NAME: read("NEXT_PUBLIC_APP_NAME", "crosschainBule"),
  APP_DESCRIPTION: read(
    "NEXT_PUBLIC_APP_DESCRIPTION",
    "Ethereum-native escrow protocol",
  ),
  APP_URL: read("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  APP_ICON: read("NEXT_PUBLIC_APP_ICON", "/logo.svg"),
  SOLANA_PROGRAM_ID: read(
    "NEXT_PUBLIC_SOLANA_PROGRAM_ID",
    "6v2iemgJm3wqRmL36frHKAMNRMwjg5NdgjTjmtfamfvj",
  ),
  SOLANA_NETWORK: read("NEXT_PUBLIC_SOLANA_NETWORK", "devnet"),
  SOLANA_RPC_URL: read("NEXT_PUBLIC_SOLANA_RPC_URL", "https://api.devnet.solana.com"),
  isDev: process.env.NODE_ENV === "development",
};

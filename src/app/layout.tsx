import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/index.css";

export const metadata: Metadata = {
  title: "crosschainBule | Trustless Commerce",
  description:
    "Verifiable crypto-to-physical commerce using Ethereum-native smart contracts.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

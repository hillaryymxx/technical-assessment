"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/web3Config";
import { WalletProvider, useWallet } from "@/contexts/WalletContext";

const WalletModal = dynamic(
  () => import("@/components/wallet").then((m) => m.WalletModal),
  { ssr: false },
);
const NetworkEnforcementModal = dynamic(
  () => import("@/components/wallet/NetworkEnforcementModal"),
  { ssr: false },
);
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAccount, useChainId } from "wagmi";
import { checkNetwork } from "@/lib/web3Config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
});

function NetworkEnforcement() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | undefined>();

  useEffect(() => {
    const checkNetworkStatus = async () => {
      if (isConnected) {
        const networkCheck = await checkNetwork();
        setCurrentChainId(networkCheck.currentChainId);
        setShowNetworkModal(!networkCheck.isCorrect);
      }
    };
    checkNetworkStatus();
  }, [isConnected, chainId]);

  return (
    <NetworkEnforcementModal
      isOpen={showNetworkModal}
      onClose={() => setShowNetworkModal(false)}
      currentChainId={currentChainId}
    />
  );
}

function WalletModalWrapper() {
  const { isModalOpen, closeModal } = useWallet();
  return <WalletModal isOpen={isModalOpen} onClose={closeModal} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <TooltipProvider>
            <WalletProvider>
              <Toaster />
              <Sonner />
              <WalletModalWrapper />
              <NetworkEnforcement />
              {children}
            </WalletProvider>
          </TooltipProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

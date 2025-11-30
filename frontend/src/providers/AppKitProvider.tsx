import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

const projectId = "9f08f9ee7d6f9d01ad116dfe80f904d1";

const metadata = {
  name: "Warung",
  description:
    "Warung Madura brings the best of Madura to the world",
  icon: "https://warungmadura.io/logo.png",
  url: "https://warungmadura.io",
  icons: ["https://warungmadura.io/logo.png"],
};

const networks = [sepolia] as [AppKitNetwork, ...AppKitNetwork[]];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  chains: [sepolia],
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    legalCheckbox: false,
  },
  allWallets: "HIDE",
  themeMode: "dark",
  termsConditionsUrl: import.meta.env.VITE_TERMS_AND_CONDITION_URL || "",
  enableWalletConnect: false,
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_PUBLIC_REOWN_PROJECT_ID; // WILL NOT USE FOR PRODUCTION

const metadata = {
  name: "Warung",
  description: "Warung Madura brings the best of Madura to the world",
  icon: "https://warungmadura.io/logo.png",
  url: "https://warungmadura.io",
  icons: ["https://warungmadura.io/logo.png"],
};

const networks = [sepolia, mainnet] as [AppKitNetwork, ...AppKitNetwork[]];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  chains: [sepolia, mainnet],
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
    socials: false,
  },
  allWallets: "HIDE",
  themeMode: "dark",
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

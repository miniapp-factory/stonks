import { WagmiProvider, createConfig, configureChains, chain, http } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { base } from 'wagmi/chains';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
);

const config = createConfig({
  chains,
  publicClient,
  webSocketPublicClient,
  ssr: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

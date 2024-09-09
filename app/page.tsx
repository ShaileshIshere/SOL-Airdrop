"use client"
import React, { useMemo, useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import Airdrop from '@/components/Airdrop';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

const Home: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const endpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT; // Use the environment variable here
  if (!endpoint) {
    console.error("Solana endpoint is not defined");
    return <div>Error: Solana endpoint is not defined</div>;
  }
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  if (!isClient) {
    return null; // Return null during server-side rendering
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div>
            <WalletMultiButton />
            <WalletDisconnectButton />
            <Airdrop />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Home;
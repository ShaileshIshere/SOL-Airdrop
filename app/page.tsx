"use client"
import React, { useMemo, useEffect, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import Airdrop from '@/components/Airdrop';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import Navbar from '@/components/Navbar';

const Home: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const endpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT; // Use the environment variable here
  if (!endpoint) {
    console.error("Solana endpoint is not defined");
    return <div className="text-red-500 text-center p-4">Error: Solana endpoint is not defined</div>;
  }
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  if (!isClient) {
    return null; // Return null during server-side rendering
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <h1 className="md:text-4xl text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
                Solana Airdrop Demo
              </h1>
              <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-center mb-6">
                  <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 text-white font-bold py-2 px-4 rounded" />
                </div>
                <Airdrop />
              </div>
              <footer className="mt-12 text-center text-gray-600 dark:text-gray-400">
                <p>© 2024 SOL Airdrop. All rights reserved.</p>
              </footer>
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Home;
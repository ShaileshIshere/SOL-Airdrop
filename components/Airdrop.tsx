"use client";
import React, { useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from './UI/Button';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const Airdrop: React.FC = () => {
    const wallet = useWallet();
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_ENDPOINT!);
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: string, content: string }>({ type: '', content: '' });

    const handleAirdrop = async () => {
        if (!wallet.publicKey) {
            setMessage({ type: 'error', content: 'Please connect your wallet first.' });
            return;
        }

        setIsLoading(true);
        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 5) {
                throw new Error('Invalid amount. Please enter a number between 0 and 5.');
            }

            const lamports = parsedAmount * LAMPORTS_PER_SOL;
            
            // Request airdrop in chunks of 2 SOL
            const maxAirdropSize = 2 * LAMPORTS_PER_SOL;
            let remainingLamports = lamports;
            
            while (remainingLamports > 0) {
                const chunkSize = Math.min(remainingLamports, maxAirdropSize);
                const signature = await connection.requestAirdrop(wallet.publicKey, chunkSize);
                
                console.log(`Airdrop chunk requested, signature: ${signature}`);

                const latestBlockhash = await connection.getLatestBlockhash();
                await connection.confirmTransaction({
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                    signature: signature
                });

                remainingLamports -= chunkSize;
            }

            console.log('Airdrop completed');
            setMessage({ type: 'success', content: `Airdropped ${parsedAmount} SOL successfully` });
            setAmount('');
        } catch (error: unknown) {
            console.error('Airdrop failed:', error);
            
            if (error instanceof Error) {
                if (error.message.includes('429 Too Many Requests')) {
                    setMessage({ type: 'error', content: 'Rate limit exceeded. Please try again later.' });
                } else if (error.message.includes('Invalid amount')) {
                    setMessage({ type: 'error', content: error.message });
                } else if (error.message.includes('Not enough lamports available')) {
                    setMessage({ type: 'error', content: 'Insufficient funds in the airdrop faucet. Try again later.' });
                } else {
                    setMessage({ type: 'error', content: `Airdrop failed: ${error.message}` });
                }
            } else {
                setMessage({ type: 'error', content: 'An unknown error occurred' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount of SOL
                </label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount of SOL"
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
            </div>
            <Button
                onClick={handleAirdrop}
                disabled={isLoading || !wallet.connected}
                className={`w-full text-lg ${isLoading || !wallet.connected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                {isLoading ? 'Processing...' : 'Send Airdrop'}
            </Button>
            {message.content && (
                <div className={`mt-2 p-2 rounded ${
                    message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 
                    message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : ''
                }`}>
                    {message.content}
                </div>
            )}
        </div>
    );
};

export default Airdrop;

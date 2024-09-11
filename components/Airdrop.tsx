"use client"
import React, { useState } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from './UI/Button';

const Airdrop = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const sendAirdrop = async () => {
        if (!wallet.connected || !wallet.publicKey || !connection) {
            setMessage({ type: 'error', content: "Wallet not connected or invalid connection" });
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setMessage({ type: 'error', content: "Enter a valid amount" });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', content: '' });

        const retryCount = 3;
        let retries = 0;

        while (retries < retryCount) {
            try {
                const signature = await connection.requestAirdrop(wallet.publicKey, parsedAmount * 1e9);
                
                // Wait for confirmation
                const latestBlockhash = await connection.getLatestBlockhash();
                
                await connection.confirmTransaction({
                    signature,
                    ...latestBlockhash
                }, 'confirmed');

                setMessage({ type: 'success', content: `Airdropped ${parsedAmount} SOL successfully` });
                setAmount('');
                setIsLoading(false);
                return;
            } catch (error) {
                console.error(`Airdrop attempt ${retries + 1} failed:`, error);
                retries++;
                if (retries >= retryCount) {
                    setMessage({ type: 'error', content: `Airdrop failed after ${retryCount} attempts. Please try again later.` });
                } else {
                    setMessage({ type: 'warning', content: `Airdrop attempt failed. Retrying... (${retries}/${retryCount})` });
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
                }
            }
        }

        setIsLoading(false);
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
                onClick={sendAirdrop}
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

"use client"
import React from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Airdrop = () => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const sendAirdrop = async () => {
        if (!wallet.connected || !wallet.publicKey || !connection) {
            alert("Wallet not connected or invalid connection");
            return;
        }

        const amount = parseFloat((document.getElementById("publicKey") as HTMLInputElement).value);
        if (isNaN(amount) || amount <= 0) {
            alert("Enter a valid amount");
            return;
        }

        try {
            const signature = await connection.requestAirdrop(wallet.publicKey, amount * 1e9);
            await connection.confirmTransaction(signature);
            alert("Airdropped SOL successfully");
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert("Airdrop failed");
        }
    };

    return (
        <div>
            <input className='text-black' id="publicKey" type="number" placeholder="Enter amount of SOL" />
            <button onClick={sendAirdrop}>Send Airdrop</button>
        </div>
    );
};

export default Airdrop;

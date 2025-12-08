'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    balance: number;
    connect: () => void;
    disconnect: () => void;
    deposit: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType>({
    isConnected: false,
    address: null,
    balance: 0,
    connect: () => {},
    disconnect: () => {},
    deposit: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState(0);

    // Persist mock state if needed, but for now transient is fine (or simple local storage)
    useEffect(() => {
        // Check local storage for persistent mock session
        const stored = localStorage.getItem('mock-wallet');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.isConnected) {
                setIsConnected(true);
                setAddress(data.address);
                setBalance(data.balance);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('mock-wallet', JSON.stringify({ isConnected, address, balance }));
    }, [isConnected, address, balance]);

    const connect = () => {
        // Simulate delay
        setTimeout(() => {
            setIsConnected(true);
            setAddress('0x71C7...3E9A');
            // Give simulated 5000 USDC on first connect if 0
            setBalance(prev => prev === 0 ? 5000 : prev);
        }, 500);
    };

    const disconnect = () => {
        setIsConnected(false);
        setAddress(null);
    };

    const deposit = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    return (
        <WalletContext.Provider value={{ isConnected, address, balance, connect, disconnect, deposit }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);

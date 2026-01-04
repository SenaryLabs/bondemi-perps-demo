'use client';

import { useState, useEffect } from 'react';
import { AssetConfig } from '@/lib/market-config';

// Define TickerData type as it's not exported from config
type TickerData = {
    symbol: string;
    price: number;
    change24h: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMarketData(symbols: string[] = []) {
    // Initial static mock data (Deterministic for Hydration)
    const initialPrices: Record<string, TickerData> = {
        'US10Y': { symbol: 'US10Y', price: 4.25, change24h: 0.85 }, 
        'US02Y': { symbol: 'US02Y', price: 4.15, change24h: 0.42 },
        'HYG':   { symbol: 'HYG',   price: 7.75,  change24h: 0.05 },
        'BTC':   { symbol: 'BTC',   price: 92450,   change24h: 3.2 },
        'ETH':   { symbol: 'ETH',   price: 3850,      change24h: 1.5 },
        'SOL':   { symbol: 'SOL',   price: 245,        change24h: 4.8 },
        'NVDA':  { symbol: 'NVDA',  price: 135.50,     change24h: 2.1 },
        'TSLA':  { symbol: 'TSLA',  price: 345.20,     change24h: -1.2 },
    };

    const [prices, setPrices] = useState<Record<string, TickerData>>(initialPrices);

    useEffect(() => {
        const fetchPrices = async () => {
            if (symbols.length === 0) return;
            
            try {
                const res = await fetch(`/api/quote?symbols=${symbols.join(',')}`);
                
                if (!res.ok) {
                    console.warn(`Quote API returned ${res.status}:`, await res.text().catch(() => ''));
                    // Don't throw - just use existing cached data
                    return;
                }
                
                const data = await res.json();
                
                // Only update if we got valid data
                if (data && typeof data === 'object') {
                    setPrices(current => {
                        const next = { ...current };
                        
                        // Merge new data
                        Object.keys(data).forEach(key => {
                            if (data[key] && data[key].price !== undefined) {
                                next[key] = {
                                    ...next[key], // Keep existing props if any
                                    ...data[key]  // Overwrite with real data
                                };
                            }
                        });
                        
                        return next;
                    });
                }
            } catch (error) {
                console.error('Market Data Polling Error:', error);
                // Don't throw - just use existing cached data
            }
        };
        
        // Initial Fetch
        fetchPrices();

        const interval = setInterval(fetchPrices, 10000); // Poll every 10s (Yahoo rate limit safe)

        return () => clearInterval(interval);
    }, [symbols.join(',')]); // Re-run if symbols change

    return {
        prices,
        isLoading: false,
        isError: null
    };
}

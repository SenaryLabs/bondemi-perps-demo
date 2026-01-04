'use client';

import { useState, useEffect, useMemo } from 'react';

// Define TickerData type as it's not exported from config
type TickerData = {
    symbol: string;
    price: number;
    change24h: number;
};

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

    // Memoize symbols string to avoid unnecessary re-renders
    const symbolsKey = useMemo(() => symbols.join(','), [symbols]);

    useEffect(() => {
        const fetchPrices = async () => {
            if (symbols.length === 0) return;
            
            try {
                const res = await fetch(`/api/quote?symbols=${symbolsKey}`);
                
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

        // Poll every 60 seconds to avoid rate limiting (Yahoo Finance has strict rate limits)
        // For real-time data, consider using a paid API service
        const interval = setInterval(fetchPrices, 60000); // Poll every 60s

        return () => clearInterval(interval);
    }, [symbols, symbolsKey]); // Re-run if symbols change

    return {
        prices,
        isLoading: false,
        isError: null
    };
}

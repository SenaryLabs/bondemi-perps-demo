'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MARKET_CONFIG } from '@/lib/market-config';

// Define TickerData type as it's not exported from config
type TickerData = {
    symbol: string;
    price: number;
    change24h: number;
};

// Initial static mock data (Deterministic for Hydration)
const initialPrices: Record<string, TickerData> = {
    'US10Y': { symbol: 'US10Y', price: 4.25, change24h: 0.85 }, 
    'US02Y': { symbol: 'US02Y', price: 4.15, change24h: 0.42 },
    'HYG':   { symbol: 'HYG',   price: 7.75,  change24h: 0.05 },
    'BTC':   { symbol: 'BTC',   price: 92450,   change24h: 3.2 },
    'ETH':   { symbol: 'ETH',   price: 3850,      change24h: 1.5 },
    'SOL':   { symbol: 'SOL',   price: 245,        change24h: 4.8 },
    'XAU':   { symbol: 'XAU',   price: 2650.50,    change24h: 0.85 },
    'NVDA':  { symbol: 'NVDA',  price: 135.50,     change24h: 2.1 },
    'TSLA':  { symbol: 'TSLA',  price: 345.20,     change24h: -1.2 },
};

// Global state to track if initial fetch has been done
let initialFetchDone = false;
let globalPrices = { ...initialPrices };

export function useMarketData(symbols: string[] = []) {
    const [prices, setPrices] = useState<Record<string, TickerData>>(globalPrices);
    const initialFetchRef = useRef(false);

    // Fetch all prices once on initialization
    useEffect(() => {
        if (initialFetchDone || initialFetchRef.current) return;
        initialFetchRef.current = true;

        const fetchAllPrices = async () => {
            try {
                const allSymbols = Object.keys(MARKET_CONFIG);
                const symbolsKey = allSymbols.join(',');
                
                console.log('Initializing all prices...');
                const res = await fetch(`/api/quote?symbols=${symbolsKey}`);
                
                if (!res.ok) {
                    console.warn(`Initial price fetch returned ${res.status}:`, await res.text().catch(() => ''));
                    return;
                }
                
                const data = await res.json();
                
                if (data && typeof data === 'object') {
                    const updatedPrices = { ...globalPrices };
                    
                    // Merge new data
                    Object.keys(data).forEach(key => {
                        if (data[key] && data[key].price !== undefined) {
                            updatedPrices[key] = {
                                ...updatedPrices[key],
                                ...data[key]
                            };
                        }
                    });
                    
                    globalPrices = updatedPrices;
                    setPrices(updatedPrices);
                    initialFetchDone = true;
                    console.log('All prices initialized');
                }
            } catch (error) {
                console.error('Initial price fetch error:', error);
            }
        };

        fetchAllPrices();
    }, []); // Only run once on mount

    // Poll selected symbol(s) every 60 seconds
    const symbolsKey = useMemo(() => symbols.join(','), [symbols]);

    useEffect(() => {
        if (symbols.length === 0) return;
        
        const fetchSelectedPrices = async () => {
            try {
                const res = await fetch(`/api/quote?symbols=${symbolsKey}`);
                
                if (!res.ok) {
                    console.warn(`Quote API returned ${res.status}:`, await res.text().catch(() => ''));
                    return;
                }
                
                const data = await res.json();
                
                if (data && typeof data === 'object') {
                    setPrices(current => {
                        const next = { ...current };
                        
                        // Merge new data
                        Object.keys(data).forEach(key => {
                            if (data[key] && data[key].price !== undefined) {
                                next[key] = {
                                    ...next[key],
                                    ...data[key]
                                };
                            }
                        });
                        
                        // Update global state
                        globalPrices = next;
                        return next;
                    });
                }
            } catch (error) {
                console.error('Market Data Polling Error:', error);
            }
        };
        
        // Wait a bit after initial fetch before starting polling
        let intervalId: NodeJS.Timeout | null = null;
        const timeoutId = setTimeout(() => {
            fetchSelectedPrices();
            
            // Poll every 60 seconds to avoid rate limiting
            intervalId = setInterval(fetchSelectedPrices, 60000);
        }, 2000); // Wait 2 seconds after initial fetch

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [symbolsKey, symbols.length]);

    return {
        prices,
        isLoading: false,
        isError: null
    };
}

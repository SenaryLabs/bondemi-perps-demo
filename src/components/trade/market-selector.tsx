'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Search, LineChart, Flame, Zap, Box, Building2 } from 'lucide-react';
import { useMarketData } from '@/hooks/use-market-data';
import { TickerIcon } from './ticker-icon';
import { MARKET_CONFIG, AssetType } from '@/lib/market-config';
import { getMarketStatus } from '@/lib/market-hours';

export function MarketSelector({ 
    selected, 
    onSelect 
}: { 
    selected: string, 
    onSelect: (id: string) => void 
}) {
    // Only two main tabs for now per spec: RATES vs CRYPTO
    // We can group Commodities/FX into Rates or separate if user prefers.
    // Spec says: "Tab: RATES (Assets: US10Y, US3M, HYG)"
    // Spec says: "Tab: CRYPTO (Assets: BTC, ETH, SOL)"
    // Let's implement dynamic tabs based on types present in MARKET_CONFIG.
    const [tab, setTab] = useState<'RATES' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS'>('RATES');
    const [search, setSearch] = useState('');

    const allSymbols = Object.keys(MARKET_CONFIG);
    const { prices, isLoading } = useMarketData(allSymbols);
    
    // Filter Logic
    const filteredMarkets = useMemo(() => {
        return allSymbols
            .map(id => ({ id, ...MARKET_CONFIG[id] }))
            .filter(m => {
                // Tab Logic
                if (tab === 'RATES') return m.type === 'rates' || m.type === 'fx'; 
                if (tab === 'CRYPTO') return m.type === 'crypto';
                if (tab === 'COMMODITIES') return m.type === 'commodity';
                if (tab === 'STOCKS') return m.type === 'stock';
                return false;
            })
            .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));
    }, [allSymbols, tab, search]);

    return (
        <div className="flex flex-col h-full bg-card/30 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-border space-y-3">
                 <div className="flex items-center gap-2 text-foreground font-bold px-1">
                    <LineChart className="w-4 h-4 text-primary" />
                    <span className="tracking-tight text-sm">Markets</span>
                 </div>
                 
                 {/* Search */}
                 <div className="relative group">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search markets..." 
                        className="w-full h-9 pl-9 pr-3 bg-muted/20 border border-border/50 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground hover:bg-muted/30 transition-all font-medium"
                    />
                 </div>

                 {/* Tabs (RATES | CRYPTO | COMMODITIES | STOCKS) */}
                 <div className="flex w-full gap-1 p-0.5 bg-muted/10 rounded-lg overflow-x-auto no-scrollbar">
                     <button
                        onClick={() => setTab('RATES')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[60px]",
                            tab === 'RATES' 
                                ? "bg-primary/10 text-primary shadow-sm" 
                                : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                        )}
                     >
                         <Flame size={12} />
                         Rates
                     </button>
                     <button
                        onClick={() => setTab('CRYPTO')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[60px]",
                            tab === 'CRYPTO' 
                                ? "bg-primary/10 text-primary shadow-sm" 
                                : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                        )}
                     >
                         <Zap size={12} />
                         Crypto
                     </button>
                     <button
                        onClick={() => setTab('COMMODITIES')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[60px]",
                            tab === 'COMMODITIES' 
                                ? "bg-primary/10 text-primary shadow-sm" 
                                : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                        )}
                     >
                         <Box size={12} />
                         Comm.
                     </button>
                     <button
                        onClick={() => setTab('STOCKS')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[60px]",
                            tab === 'STOCKS' 
                                ? "bg-primary/10 text-primary shadow-sm" 
                                : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                        )}
                     >
                         <Building2 size={12} />
                         Stocks
                     </button>
                 </div>
            </div>

            {/* Column Headers */}
            <div className="px-4 py-2 flex text-[10px] font-bold text-muted-foreground border-b border-border bg-muted/5 uppercase tracking-wider">
                <span className="flex-1">Asset</span>
                <span className="w-20 text-right">{tab === 'RATES' ? 'Yield/Px' : 'Price'}</span>
                <span className="w-16 text-right">24h</span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading && Object.keys(prices).length === 0 ? (
                     <div className="p-4 space-y-2">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-muted/10 rounded animate-pulse" />)}
                    </div>
                ) : (
                    filteredMarkets.map((m) => {
                        const data = prices[m.id];
                        const price = data?.price || 0;
                        const change = data?.change24h || 0; // Fixed property name match
                        const isPos = change >= 0;
                        const active = selected === m.id;
                        
                        // Market Status Check
                        const status = getMarketStatus(m.type);
                        const isClosed = !status.isOpen;

                        return (
                            <button
                                key={m.id}
                                onClick={() => onSelect(m.id)}
                                className={cn(
                                    "flex items-center w-full px-4 py-3 border-b border-border/20 hover:bg-muted/10 transition-colors group text-left relative",
                                    active && "bg-primary/5 hover:bg-primary/10"
                                )}
                            >
                                {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                                
                                {/* Status Dot + Symbol */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="relative">
                                        <TickerIcon symbol={m.id} size={28} />
                                        {/* Status Indicator Dot */}
                                        <div className={cn(
                                            "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                                            isClosed ? "bg-muted-foreground/50" : "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                                        )} />
                                    </div>
                                    
                                    <div className="flex flex-col min-w-0">
                                        <span className={cn("text-xs font-bold font-mono transition-colors", active ? "text-primary" : "text-foreground")}>
                                            {m.id}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity">
                                            {m.name}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Price */}
                                <div className="w-20 text-right font-mono text-xs text-foreground/90 font-medium">
                                    {price > 0 
                                        ? (m.type === 'rates' 
                                            ? price.toFixed(2) // No * 10, standard 2 decimals for yield
                                            : m.id === 'XAU'
                                                ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                : m.type === 'commodity'
                                                    ? price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                                                    : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                          )
                                        : '---'
                                    }
                                    {m.type === 'rates' && <span className="text-[9px] text-muted-foreground ml-0.5">%</span>}
                                    {['ZC', 'ZW'].includes(m.id) && <span className="text-[9px] text-muted-foreground/70 ml-1">(cents)</span>}
                                </div>
                                
                                {/* Change */}
                                <div className={cn(
                                    "w-16 text-right font-mono text-[11px] font-bold",
                                    isPos ? "text-[var(--emerald-500)]" : "text-[var(--rose-500)]"
                                )}>
                                    {isPos ? '+' : ''}{change.toFixed(2)}%
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

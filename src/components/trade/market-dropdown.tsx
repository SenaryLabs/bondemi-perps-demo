'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Search, LineChart, Flame, Zap, Box, Building2, ChevronDown, X } from 'lucide-react';
import { TickerIcon } from './ticker-icon';
import { MARKET_CONFIG, AssetType } from '@/lib/market-config';
import { getMarketStatus } from '@/lib/market-hours';

interface MarketDropdownProps {
    selected: string;
    onSelect: (id: string) => void;
    prices?: Record<string, { symbol: string; price: number; change24h: number }>;
    trigger: React.ReactNode;
}

export function MarketDropdown({ selected, onSelect, prices, trigger }: MarketDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<'RATES' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS'>('COMMODITIES');
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const allSymbols = Object.keys(MARKET_CONFIG);
    
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

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsOpen(false);
        setSearch('');
    };

    // Auto-select tab based on selected symbol
    useEffect(() => {
        const asset = MARKET_CONFIG[selected];
        if (asset) {
            if (asset.type === 'rates' || asset.type === 'fx') setTab('RATES');
            else if (asset.type === 'crypto') setTab('CRYPTO');
            else if (asset.type === 'commodity') setTab('COMMODITIES');
            else if (asset.type === 'stock') setTab('STOCKS');
        }
    }, [selected]);

    return (
        <>
            <div 
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
            >
                {trigger}
            </div>

            {mounted && isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed z-[100] w-[420px] max-h-[600px] bg-card border border-border rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                    style={{
                        top: position.top,
                        left: position.left
                    }}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-card/95 backdrop-blur">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <LineChart className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold tracking-tight">Select Market</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                            >
                                <X size={16} className="text-muted-foreground" />
                            </button>
                        </div>
                        
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search markets..." 
                                className="w-full h-9 pl-9 pr-3 bg-muted/20 border border-border/50 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground hover:bg-muted/30 transition-all font-medium"
                                autoFocus
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex w-full gap-1 p-0.5 bg-muted/10 rounded-lg mt-3 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setTab('RATES')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1 text-[9px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[70px]",
                                    tab === 'RATES' 
                                        ? "bg-primary/10 text-primary shadow-sm" 
                                        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                                )}
                            >
                                <Flame size={10} />
                                Rates
                            </button>
                            <button
                                onClick={() => setTab('CRYPTO')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1 text-[9px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[70px]",
                                    tab === 'CRYPTO' 
                                        ? "bg-primary/10 text-primary shadow-sm" 
                                        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                                )}
                            >
                                <Zap size={10} />
                                Crypto
                            </button>
                            <button
                                onClick={() => setTab('COMMODITIES')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1 text-[9px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[70px]",
                                    tab === 'COMMODITIES' 
                                        ? "bg-primary/10 text-primary shadow-sm" 
                                        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                                )}
                            >
                                <Box size={10} />
                                Comm.
                            </button>
                            <button
                                onClick={() => setTab('STOCKS')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-1 text-[9px] font-bold py-1.5 rounded transition-all uppercase tracking-wider min-w-[70px]",
                                    tab === 'STOCKS' 
                                        ? "bg-primary/10 text-primary shadow-sm" 
                                        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                                )}
                            >
                                <Building2 size={10} />
                                Stocks
                            </button>
                        </div>
                    </div>

                    {/* Column Headers */}
                    <div className="px-4 py-2 flex text-[9px] font-bold text-muted-foreground border-b border-border bg-muted/5 uppercase tracking-wider sticky top-0 bg-card/95 backdrop-blur">
                        <span className="flex-1">Asset</span>
                        <span className="w-24 text-right">{tab === 'RATES' ? 'Yield/Px' : 'Price'}</span>
                        <span className="w-20 text-right">24h</span>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                        {filteredMarkets.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No markets found
                            </div>
                        ) : (
                            filteredMarkets.map((m) => {
                                const data = prices?.[m.id];
                                const price = data?.price || 0;
                                const change = data?.change24h || 0;
                                const isPos = change >= 0;
                                const active = selected === m.id;
                                
                                const status = getMarketStatus(m.type);
                                const isClosed = !status.isOpen;

                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => handleSelect(m.id)}
                                        className={cn(
                                            "flex items-center w-full px-4 py-2.5 border-b border-border/20 hover:bg-muted/10 transition-colors group text-left relative",
                                            active && "bg-primary/5 hover:bg-primary/10"
                                        )}
                                    >
                                        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                                        
                                        {/* Status Dot + Symbol */}
                                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                            <div className="relative">
                                                <TickerIcon symbol={m.id} size={24} />
                                                <div className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-background",
                                                    isClosed ? "bg-muted-foreground/50" : "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                                                )} />
                                            </div>
                                            
                                            <div className="flex flex-col min-w-0">
                                                <span className={cn("text-xs font-bold font-mono transition-colors", active ? "text-primary" : "text-foreground")}>
                                                    {m.id}
                                                </span>
                                                <span className="text-[9px] text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity">
                                                    {m.name}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Price */}
                                        <div className="w-24 text-right font-mono text-xs text-foreground/90 font-medium">
                                            {price > 0 
                                                ? (m.type === 'rates' 
                                                    ? price.toFixed(2)
                                                    : m.id === 'XAU'
                                                        ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                        : m.type === 'commodity'
                                                            ? price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                                                            : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                  )
                                                : '---'
                                            }
                                            {m.type === 'rates' && <span className="text-[8px] text-muted-foreground ml-0.5">%</span>}
                                        </div>
                                        
                                        {/* Change */}
                                        <div className={cn(
                                            "w-20 text-right font-mono text-[10px] font-bold",
                                            isPos ? "text-[var(--emerald-500)]" : "text-[var(--rose-500)]"
                                        )}>
                                            {isPos ? '+' : ''}{change.toFixed(2)}%
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}



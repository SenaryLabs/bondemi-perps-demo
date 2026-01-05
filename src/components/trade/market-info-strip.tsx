import { ChevronDown, ShieldCheck, Activity } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { TickerIcon } from './ticker-icon';
import { MARKET_CONFIG } from '@/lib/market-config';
import { getMarketStatus } from '@/lib/market-hours';
import { MarketDropdown } from './market-dropdown';

interface MarketInfoStripProps {
    symbol: string;
    price: number;
    funding: number;
    openInterest: string;
    volume24h: string;
    oracle: string;
    onSymbolChange?: (symbol: string) => void;
    prices?: Record<string, { symbol: string; price: number; change24h: number }>;
}

export function MarketInfoStrip({ symbol, price, funding, openInterest, volume24h, oracle, onSymbolChange, prices }: MarketInfoStripProps) {
    const fmtPrice = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtPercent = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
    
    // Status Logic
    const asset = MARKET_CONFIG[symbol];
    const status = asset ? getMarketStatus(asset.type) : { isOpen: true, message: 'OPEN' };
    const isCrypto = asset?.type === 'crypto';
    
    // Mock Data for extended stats
    const confidence = 0.001; 
    const nextFunding = "00:45:12";
    const range24h = asset?.type === 'rates' 
        ? `${(price * 0.99).toFixed(3)} - ${(price * 1.01).toFixed(3)}`
        : `${(price * 0.95).toLocaleString()} - ${(price * 1.05).toLocaleString()}`;

    return (
        <div className="h-14 border-b border-border/30 flex items-center gap-6 px-4 bg-card/20 backdrop-blur-sm overflow-x-auto no-scrollbar">
            {/* Market Selector Dropdown */}
            {onSymbolChange ? (
                <MarketDropdown
                    selected={symbol}
                    onSelect={onSymbolChange}
                    prices={prices}
                    trigger={
                        <button className="flex items-center gap-3 hover:bg-muted/20 px-2 py-1.5 rounded-lg transition-colors group shrink-0">
                            <TickerIcon symbol={symbol} size={32} />
                            <div className="flex flex-col items-start min-w-[100px]">
                                <span className="text-base font-bold flex items-center gap-1 group-hover:text-primary transition-colors">
                                    {symbol}
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </span>
                                {/* Market Status Badge */}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {asset?.type === 'crypto' ? (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider border bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10">
                                            <Activity className="w-3 h-3 text-amber-400" />
                                            24/7 Market
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "flex items-center gap-1.5 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider border transition-all shadow-sm",
                                            status.isOpen 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" 
                                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", status.isOpen ? "bg-emerald-400" : "bg-rose-400")} />
                                            {status.isOpen ? "Market Open" : "Market Closed"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    }
                />
            ) : (
                <div className="flex items-center gap-3 px-2 py-1.5 shrink-0">
                    <TickerIcon symbol={symbol} size={32} />
                    <div className="flex flex-col items-start min-w-[100px]">
                        <span className="text-base font-bold">
                            {symbol}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {asset?.type === 'crypto' ? (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider border bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10">
                                    <Activity className="w-3 h-3 text-amber-400" />
                                    24/7 Market
                                </div>
                            ) : (
                                <div className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider border transition-all shadow-sm",
                                    status.isOpen 
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" 
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", status.isOpen ? "bg-emerald-400" : "bg-rose-400")} />
                                    {status.isOpen ? "Market Open" : "Market Closed"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="h-8 w-px bg-border/30 shrink-0" />

            {/* Oracle Shield Badge */}
            <OracleHoverCard 
                isCrypto={isCrypto} 
                oracle={oracle} 
                confidence={confidence} 
                nextFunding={nextFunding} 
            />

            {/* Stats Group */}
            <div className="flex items-center gap-6 shrink-0">
                {/* Price */}
            <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold font-mono text-foreground">
                        {asset?.type === 'rates' 
                            ? `${price.toFixed(2)}%` 
                            : asset?.type === 'commodity' 
                                ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`
                                : `$${fmtPrice(price)}`
                        }
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">±{confidence}σ</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {asset?.type === 'rates' ? 'Yield Oracle' : 'Oracle Price'}
                </span>
            </div>

                {/* Funding Rate */}
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                        <span className={cn(
                            "text-sm font-mono font-medium",
                            funding >= 0 ? "text-[var(--emerald-500)]" : "text-[var(--rose-500)]"
                        )}>
                            {fmtPercent(funding)}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">{nextFunding}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Funding / Next</span>
                </div>

                {/* 24h Range */}
                 <div className="flex flex-col hidden lg:flex">
                    <span className="text-sm font-mono font-medium text-foreground">
                        {range24h}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">24h Range</span>
                </div>
                
                 {/* Open Interest */}
                 <div className="flex flex-col hidden xl:flex">
                    <span className="text-sm font-mono font-medium text-amber-400">
                        {openInterest}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Open Interest</span>
                </div>
            </div>

            <div className="flex-1" />
        </div>
    );
}

function OracleHoverCard({ isCrypto, oracle, confidence, nextFunding }: { isCrypto: boolean, oracle: string, confidence: number, nextFunding: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8, // 8px gap
                left: rect.left
            });
            setIsHovered(true);
        }
    };

    return (
        <div 
            className="hidden md:flex relative group z-20"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            ref={triggerRef}
        >
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-sky-500/10 border border-sky-500/20 shrink-0 cursor-help transition-colors hover:bg-sky-500/20">
                <ShieldCheck size={12} className="text-sky-400" />
                <span className="text-[10px] font-bold text-sky-100">ORACLE {isCrypto ? 'FEED' : 'PREVIEW'}</span>
            </div>

            {mounted && isHovered && createPortal(
                <div 
                    className="fixed z-[9999] w-64 p-3 rounded-xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
                    style={{
                        top: coords.top,
                        left: coords.left
                    }}
                >
                    <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-border/30">
                            <span className="text-xs font-bold text-muted-foreground">Oracle Details</span>
                            <span className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20">
                                {oracle} {isCrypto ? 'Feed' : 'Simulated'}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                            <div>
                                <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Confidence</span>
                                <span className="text-xs font-mono font-medium">±{confidence}σ</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Spread</span>
                                <span className="text-xs font-mono font-medium">0.02%</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Next Funding</span>
                                <span className="text-xs font-mono font-medium text-amber-400">{nextFunding}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground uppercase block mb-0.5">Status</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-medium text-emerald-400">Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

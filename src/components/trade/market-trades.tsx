'use client';

import { cn } from '@/lib/utils';

import { useEffect, useState } from 'react';

// Mock Trade Generator
const generateTrade = (price: number) => {
    if (price <= 0) price = 100; // Fallback to avoid NaN
    const isBuy = Math.random() > 0.5;
    const size = (Math.random() * 5).toFixed(4); // 4 decimals max
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    return {
        id: Math.random().toString(36),
        price: isBuy ? price * (1 + Math.random() * 0.0001) : price * (1 - Math.random() * 0.0001),
        size,
        side: isBuy ? 'Long' : 'Short',
        time,
    };
};

export function MarketTrades({ currentPrice }: { currentPrice: number }) {
    const [trades, setTrades] = useState<any[]>([]);

    useEffect(() => {
        // Init fake history
        const initial = Array.from({ length: 20 }).map(() => generateTrade(currentPrice));
        setTrades(initial);

        const interval = setInterval(() => {
            setTrades(prev => [generateTrade(currentPrice), ...prev].slice(0, 50));
        }, 800);

        return () => clearInterval(interval);
    }, [currentPrice]);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/20">
                <span>Side</span>
                <span className="text-right">Price</span>
                <span className="text-right">Size</span>
                <span className="text-right">Time</span>
            </div>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {trades.map((t) => {
                    const isLong = t.side === 'Long';
                    const colorClass = isLong ? 'text-[var(--emerald-500)]' : 'text-[var(--rose-500)]';
                    return (
                        <div key={t.id} className="grid grid-cols-4 px-4 py-1.5 text-xs border-b border-border/10 hover:bg-white/5 transition-colors">
                            <span className={cn("font-bold", colorClass)}>
                                {t.side}
                            </span>
                             <span className={cn("text-right font-mono", colorClass)}>
                                {t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={cn("text-right font-mono", colorClass)}>{t.size}</span>
                            <span className="text-right text-muted-foreground font-mono text-[10px]">{t.time}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

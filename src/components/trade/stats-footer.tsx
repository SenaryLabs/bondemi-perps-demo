'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AssetConfig } from '@/lib/market-config';

interface StatsFooterProps {
    symbol: string;
    price: number;
    asset: AssetConfig;
}

export function StatsFooter({ symbol, price, asset }: StatsFooterProps) {
    const [times, setTimes] = useState<Record<string, string>>({});

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTimes({
                UTC: now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit' }),
                NY: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit' }),
                LDN: now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour12: false, hour: '2-digit', minute: '2-digit' }),
                TKY: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour12: false, hour: '2-digit', minute: '2-digit' }),
            });
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full w-full flex items-center px-4 gap-4 select-none">
            {/* System Status */}
            <div className="flex items-center gap-2 shrink-0">
                 <div className="relative flex items-center justify-center w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                 </div>
                 <span className="text-[10px] font-medium text-emerald-500/90 whitespace-nowrap">Systems Operational</span>
            </div>

            <div className="w-px h-3 bg-white/10 shrink-0" />

            {/* World Clock */}
            <div className="flex items-center gap-4 shrink-0">
                <ClockItem label="UTC" time={times.UTC} isMain />
                <ClockItem label="NY" time={times.NY} />
                <ClockItem label="LDN" time={times.LDN} />
                <ClockItem label="TKY" time={times.TKY} />
            </div>

            <div className="flex-1" />

            {/* System Status / Network */}
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                    Demo Mode: Simulated Feed
                </div>
                
                {/* Version */}
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                        v1.0.0-alpha
                    </span>
                </div>
            </div>
        </div>
    );
}

function ClockItem({ label, time, isMain }: { label: string, time: string, isMain?: boolean }) {
    return (
        <div className="flex items-baseline gap-1.5">
            <span className={cn("text-[9px] font-bold tracking-wider", isMain ? "text-primary" : "text-muted-foreground")}>{label}</span>
            <span className={cn("text-[10px] font-mono", isMain ? "text-foreground" : "text-muted-foreground/80")}>{time}</span>
        </div>
    )
}

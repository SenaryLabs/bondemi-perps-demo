import { ShieldCheck, ArrowUpRight } from 'lucide-react';

const FEEDS = [
    { symbol: 'US10Y', status: 'Live', latency: '200ms', conf: 'High' },
    { symbol: 'BTC/USD', status: 'Live', latency: '45ms', conf: 'Max' },
    { symbol: 'XAU/USD', status: 'Live', latency: '410ms', conf: 'High' },
    { symbol: 'EUR/USD', status: 'Live', latency: '180ms', conf: 'High' },
];

export function OraclePulse() {
    return (
         <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-sky-500" />
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Oracle Status (Pyth)</h3>
                </div>
                <a href="#" className="text-[10px] text-sky-500 hover:text-sky-400 flex items-center gap-1">
                    View Contract <ArrowUpRight size={10} />
                </a>
             </div>

             <div className="space-y-2">
                {FEEDS.map((feed) => (
                    <div key={feed.symbol} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                            <span className="text-sm font-bold font-mono">{feed.symbol}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="flex flex-col items-end">
                                <span className="text-muted-foreground text-[9px] uppercase">Latency</span>
                                <span className="text-foreground">{feed.latency}</span>
                            </div>
                            <div className="w-px h-6 bg-border/50" />
                             <div className="flex flex-col items-end min-w-[30px]">
                                <span className="text-muted-foreground text-[9px] uppercase">State</span>
                                <span className="text-emerald-500 font-bold">LIVE</span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
             
             <div className="pt-2 text-center">
                 <p className="text-[10px] text-muted-foreground">
                     Aggregated from 40+ publishers via Pyth Network Low-Latency Feed.
                 </p>
             </div>
         </div>
    );
}

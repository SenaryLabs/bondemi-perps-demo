import { cn } from '@/lib/utils';

export function VaultHealth() {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Vault Health (bLP)</h3>
                <span className="text-xs font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                    APY: 14.2%
                </span>
             </div>

             {/* Utilization */}
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Utilized Liquidity</span>
                    <span className="font-bold font-mono">35%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[35%] rounded-full shadow-[0_0_10px_#6366f1]" />
                </div>
                <p className="text-[10px] text-muted-foreground text-right pl-1">
                    $1.8M Active / $5.2M Total
                </p>
             </div>

             {/* Skew */}
             <div className="space-y-2 pt-2 border-t border-border/30">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Global Skew (Net Exposure)</span>
                </div>
                
                <div className="flex items-center h-8 rounded-lg overflow-hidden font-bold text-[10px] text-white">
                    <div className="flex-1 bg-emerald-500 flex items-center pl-3">
                        LONG 60%
                    </div>
                    <div className="w-[40%] bg-rose-500 flex items-center justify-end pr-3">
                        SHORT 40%
                    </div>
                </div>
                
                <p className="text-[10px] text-muted-foreground">
                    Vault is mildly Long-skewed. Funding rates paying Shorts.
                </p>
             </div>
        </div>
    );
}

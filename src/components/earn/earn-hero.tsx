import { Trophy, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EarnHero() {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-xl relative overflow-hidden group">
            {/* Background Gradient Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-colors duration-500" />

            <div className="relative z-10 space-y-6">
                
                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Your Performance</h2>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-bold font-mono text-amber-500 text-shadow-sm">15,420</span>
                            <span className="text-xs font-bold text-amber-500/80">PTS</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground uppercase mb-1">Global Rank</span>
                        <div className="flex items-center gap-1.5 bg-muted/20 px-2 py-1 rounded border border-border/50">
                            <Trophy size={14} className="text-amber-400" />
                            <span className="font-mono font-bold text-lg text-foreground">#84</span>
                            <span className="text-[10px] text-muted-foreground">/ 15,420</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-border/40" />

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Epoch */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>Current Epoch</span>
                        </div>
                        <div className="font-bold text-sm text-foreground">Phase 1: Genesis</div>
                        <div className="text-[10px] text-emerald-500 font-mono">Ends in 04D 12H 30M</div>
                    </div>

                    {/* Boost */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Zap size={12} />
                            <span>Active Boost</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="font-bold text-sm text-foreground">Early Adopter</div>
                            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20">
                                1.25x
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Coins, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VaultCard() {
    return (
        <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 shadow-sm">
             <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">Liquidity Mining</h3>
                    <p className="text-xs text-muted-foreground w-3/4">
                        Deposit USDC into the bLP Vault to back trader positions and earn passive points.
                    </p>
                </div>
                <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-500">
                    <Coins size={24} />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-background/40 p-3 rounded-lg border border-border/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Your Deposit</span>
                    <div className="font-mono font-bold text-lg">$5,000.00</div>
                </div>
                <div className="space-y-1 bg-background/40 p-3 rounded-lg border border-border/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold text-indigo-400">Reward Rate</span>
                    <div className="font-mono font-bold text-lg text-indigo-400">20 PTS <span className="text-xs text-muted-foreground font-sans">/ $100 / Day</span></div>
                </div>
            </div>

            <div className="mt-6">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20">
                    Manage Liquidity
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

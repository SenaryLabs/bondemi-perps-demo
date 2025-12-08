import { DollarSign, Activity, Lock, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroStats() {
    const stats = [
        {
            label: 'Total Volume',
            value: '$125.4M',
            sub: '+12% this week',
            icon: Activity,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Total Value Locked',
            value: '$5.2M',
            sub: 'USDC Vault Liquidity',
            icon: Lock,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        {
            label: 'Open Interest',
            value: '$8.4M',
            sub: 'Longs + Shorts',
            icon: Coins,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            label: 'Protocol Fees',
            value: '$124.5k',
            sub: 'Cumulative Revenue',
            icon: DollarSign,
            color: 'text-cyan-500',
            bg: 'bg-cyan-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:border-primary/20 transition-colors group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold font-mono tracking-tight text-foreground">{stat.value}</h3>
                        </div>
                        <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground font-medium bg-muted/20 px-1.5 py-0.5 rounded">
                            {stat.sub}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

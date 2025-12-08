'use client';

import { HeroStats } from '@/components/dashboard/hero-stats';
import { MacroChart } from '@/components/dashboard/macro-chart';
import { VaultHealth } from '@/components/dashboard/vault-health';
import { OraclePulse } from '@/components/dashboard/oracle-pulse';

export default function DashboardPage() {
    return (
        <main className="h-full w-full bg-background overflow-y-auto overflow-x-hidden p-6 space-y-6">
            <div className="max-w-[1600px] mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Protocol Analytics</h1>
                    <p className="text-sm text-muted-foreground">Real-time transparency into Bondemi's institutional liquidity engine.</p>
                </div>

                {/* KPI Cards */}
                <HeroStats />

                {/* Middle Row: Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                    {/* Volume/Fees Growth (Left 2/3) */}
                    <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                         <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4">Protocol Growth (Volume & Fees)</h3>
                         <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-sm italic border border-dashed border-border/30 rounded-lg">
                            {/* Placeholder for Bar Chart */}
                            Growth Chart Coming Soon
                            {/* We can implement a Recharts BarChart here if time permits */}
                         </div>
                    </div>

                    {/* Asset Diversity (Right 1/3) */}
                    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col">
                        <MacroChart />
                    </div>
                </div>

                {/* Bottom Row: Health & Oracles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <VaultHealth />
                     <OraclePulse />
                </div>
            </div>
        </main>
    );
}

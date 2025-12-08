'use client';

import { EarnHero } from '@/components/earn/earn-hero';
import { QuestLog } from '@/components/earn/quest-log';
import { VaultCard } from '@/components/earn/vault-card';
import { ReferralCard } from '@/components/earn/referral-card';

export default function EarnPage() {
    return (
        <main className="h-full w-full bg-background overflow-y-auto overflow-x-hidden p-6 space-y-6">
            <div className="max-w-[1200px] mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Airdrop Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Compete in the Incentivized Testnet to earn rewards.</p>
                </div>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    
                    {/* Left Column (60% -> 3/5 cols) */}
                    <div className="lg:col-span-3 space-y-6">
                        <QuestLog />
                        <VaultCard />
                    </div>

                    {/* Right Column (40% -> 2/5 cols) */}
                    <div className="lg:col-span-2 space-y-6 sticky top-6">
                        <EarnHero />
                        <ReferralCard />
                    </div>
                </div>
            </div>
        </main>
    );
}

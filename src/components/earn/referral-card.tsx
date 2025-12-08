'use client';

import { Copy, Users, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ReferralCard() {
    const [copied, setCopied] = useState(false);
    const code = "BOND-992A";
    const link = `https://bondemi.finance?ref=${code}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    Referrals
                </h3>
            </div>

            <div className="p-3 bg-muted/20 rounded-lg border border-border/40 text-center mb-6">
                <div className="grid grid-cols-2 gap-px bg-border/20">
                    <div className="bg-card p-2">
                        <span className="block text-[10px] text-muted-foreground uppercase">Friends</span>
                        <span className="font-bold font-mono">12</span>
                    </div>
                    <div className="bg-card p-2">
                        <span className="block text-[10px] text-muted-foreground uppercase">Earned</span>
                        <span className="font-bold font-mono text-amber-500">1,200 PTS</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Your Link</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-9 bg-muted/10 border border-border/40 rounded px-3 flex items-center text-xs font-mono text-muted-foreground truncate">
                            {link}
                        </div>
                        <button 
                            onClick={handleCopy}
                            className={cn(
                                "h-9 px-3 rounded flex items-center gap-1.5 text-xs font-bold transition-all",
                                copied ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-primary/10 text-primary hover:bg-primary/20"
                            )}
                        >
                            <Copy size={12} />
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                 </div>

                 {/* Quest Progress / Tier */}
                 <div className="p-3 bg-gradient-to-r from-amber-500/5 to-transparent border-l-2 border-amber-500 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-500">Silver Tier Status</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        Refer 5 more friends to confirm Silver Tier (1.2x Boost).
                    </p>
                 </div>
            </div>
        </div>
    );
}

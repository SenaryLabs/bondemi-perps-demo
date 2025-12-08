'use client';

import { CheckCircle2, Circle, ArrowRight, ChevronRight, BarChart3, Globe, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Quest {
    id: string;
    title: string;
    desc: string;
    reward: number;
    completed: boolean;
    progress?: number; // 0-100
    icon: any;
    actionLabel?: string;
}

const QUESTS: Quest[] = [
    {
        id: 'macro',
        title: 'The Macro Trader',
        desc: 'Open a position on US10Y or EUR/USD to test the Rates engine.',
        reward: 500,
        completed: false,
        icon: Globe,
        actionLabel: 'Go to Rates'
    },
    {
        id: 'diversifier',
        title: 'The Diversifier',
        desc: 'Hold open positions in 3 different Asset Classes simultaneously.',
        reward: 1000,
        completed: false,
        icon: Layers,
    },
    {
        id: 'volume',
        title: 'High Volume',
        desc: 'Generate >$100k in total trading volume.',
        reward: 1500,
        completed: false,
        progress: 45,
        icon: BarChart3
    }
];

export function QuestLog() {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    Quest Log
                    <span className="text-xs font-normal text-muted-foreground ml-2 bg-muted/20 px-2 py-0.5 rounded-full">
                        3 Available
                    </span>
                </h3>
                <button className="text-xs text-primary hover:text-primary/80 font-medium">View All</button>
            </div>

            <div className="space-y-3">
                {QUESTS.map((quest) => (
                    <div 
                        key={quest.id}
                        className={cn(
                            "relative overflow-hidden rounded-lg border p-4 transition-all hover:border-border/80 group",
                            quest.completed 
                                ? "bg-emerald-500/5 border-emerald-500/20" 
                                : "bg-muted/5 border-border/40"
                        )}
                    >
                         <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                                <div className={cn(
                                    "p-2 rounded-lg shrink-0",
                                    quest.completed ? "bg-emerald-500/10 text-emerald-500" : "bg-muted/20 text-muted-foreground group-hover:text-foreground"
                                )}>
                                    <quest.icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className={cn("text-sm font-bold", quest.completed && "text-emerald-500")}>{quest.title}</h4>
                                    <p className="text-xs text-muted-foreground">{quest.desc}</p>
                                    
                                    {/* Reward Badge */}
                                    <div className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                        +{quest.reward} PTS
                                    </div>
                                </div>
                            </div>

                            {/* Action / Status */}
                            <div className="shrink-0 flex flex-col items-end gap-2">
                                {quest.completed ? (
                                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                                        <CheckCircle2 size={16} />
                                        <span>Claimed</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end gap-2">
                                        {quest.actionLabel && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors">
                                                {quest.actionLabel}
                                                <ArrowRight size={12} />
                                            </button>
                                        )}
                                        {quest.progress !== undefined && (
                                            <div className="w-24 space-y-1">
                                                <div className="flex justify-between text-[9px] text-muted-foreground uppercase font-bold">
                                                    <span>Progress</span>
                                                    <span>{quest.progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary transition-all" style={{ width: `${quest.progress}%` }} />
                                                </div>
                                            </div>
                                        )}
                                        {!quest.actionLabel && !quest.progress && (
                                            <button className="text-xs text-muted-foreground font-medium flex items-center gap-1 hover:text-foreground">
                                                Details <ChevronRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

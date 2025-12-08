'use client';

import Link from 'next/link';
import { ArrowRight, LayoutDashboard, Terminal, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroInterfaceMockup } from '@/components/landing/hero-interface-mockup';
import { EmailAccessModal } from '@/components/landing/email-access-modal';
import { useState } from 'react';

export default function LandingPage() {
    const [showAccessModal, setShowAccessModal] = useState(false);
    return (
        <main className="h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-8 p-6 max-w-4xl">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-muted/20 backdrop-blur-sm text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    Incentivized Testnet (Phase 1) is Live
                </div>
                
                {/* Hero Title */}
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Institutional Grade <br className="hidden md:block" /> Perps
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Trade Commodities, Rates, and Crypto with zero slippage. The first vAMM on Base backed by real-world yield.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <button 
                        onClick={() => setShowAccessModal(true)}
                        className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-wide transition-all hover:scale-105 hover:bg-primary/90 flex items-center gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                    >
                        <Terminal size={18} />
                        Launch App
                    </button>
                    
                    <Link href="/dashboard">
                        <button className="h-12 px-8 rounded-lg bg-muted/10 border border-border/50 text-foreground font-bold text-sm tracking-wide transition-all hover:bg-muted/20 flex items-center gap-2 backdrop-blur-sm">
                            <LayoutDashboard size={18} />
                            View Dashboard
                        </button>
                    </Link>
                </div>

                {/* Powered By Strip */}
                <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3 tracking-widest">Powered By</p>
                    <div className="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                         {/* Base */}
                         <div className="flex items-center gap-1.5 font-bold text-sm">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Base</span>
                         </div>
                         <div className="w-px h-3 bg-border" />
                         {/* Pyth */}
                         <div className="flex items-center gap-1.5 font-bold text-sm">
                            <ShieldCheck size={14} className="text-indigo-500" />
                            <span>Pyth</span>
                         </div>
                         <div className="w-px h-3 bg-border" />
                         {/* USDC */}
                         <div className="flex items-center gap-1.5 font-bold text-sm">
                            <div className="w-3 h-3 rounded-full border-2 border-primary" />
                            <span>USDC</span>
                         </div>
                    </div>
                </div>
                
                {/* Hero Visual */}
                <HeroInterfaceMockup />
            </div>
            
            {/* Footer Footer / Minimal */}
             <div className="absolute bottom-6 text-[10px] text-muted-foreground/50">
                Bondemi Protocol © 2025
             </div>

             <EmailAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
        </main>
    );
}

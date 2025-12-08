'use client';

import { cn } from '@/lib/utils';
import { Wallet, Settings, Bell, LogOut, ShieldCheck, PieChart, Coins } from 'lucide-react';
import { useState } from 'react';
import { SettingsModal } from './settings-modal';
import { useWallet } from '@/context/wallet-context';

import { useTheme } from '@/hooks/use-theme';

import { DepositModal } from '@/components/trade/deposit-modal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TopNav() {
    const { theme, changeTheme } = useTheme();
    const { isConnected, address, balance, connect, disconnect } = useWallet(); // Use Hook
    const [showSettings, setShowSettings] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const pathname = usePathname();

    return (
        <header className="h-14 border-b border-border bg-card/40 backdrop-blur-md flex items-center px-4 justify-between z-30 flex-shrink-0">
            {/* ... LHS ... */}
            <div className="flex items-center gap-8">
                {/* ... Logo & Nav ... */}
                 <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight select-none">
                  <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20",
                      theme === 'lime' 
                        ? "bg-gradient-to-br from-primary to-[var(--emerald-500)]" 
                        : "bg-primary"
                  )}>B</div>
                  Bondemi
                </div>
                
                {/* Main Nav - Hide on Landing Page */}
                {pathname !== '/' && (
                    <nav className="flex items-center gap-1">
                      {[
                        { name: 'Trade', path: '/trade' },
                        { name: 'Dashboard', path: '/dashboard' },
                        { name: 'Earn', path: '/earn' },
                        { name: 'Portfolio', path: '/portfolio' }
                      ].map(item => {
                          const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
                          return (
                              <Link 
                                key={item.name} 
                                href={item.path}
                                className={cn(
                                  "px-3 py-1.5 rounded-md text-sm font-bold transition-all cursor-pointer select-none",
                                  isActive
                                    ? "bg-primary/10 text-primary scale-105" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                                )}
                              >
                                  {item.name}
                              </Link>
                          );
                      })}
                    </nav>
                )}
            </div>
            
            {/* Right Actions - Hide on Landing Page */}
            {pathname !== '/' && (
                <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 border border-border/30 text-xs font-bold text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span>Base Sepolia</span>
                     </div>

                     <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/20 rounded-full">
                        <Bell size={18} />
                     </button>
                     <button 
                        onClick={() => setShowSettings(true)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/20 rounded-full"
                     >
                        <Settings size={18} />
                     </button>

                     <div className="ml-2 flex items-center gap-2">
                        {isConnected ? (
                            <>
                                <button 
                                    onClick={() => setShowDeposit(true)}
                                    className="px-3 py-1.5 bg-muted/10 hover:bg-muted/20 text-primary text-xs font-bold rounded-lg transition-colors border border-primary/20"
                                >
                                    Deposit
                                </button>
                                <div className="flex items-center gap-3 bg-muted/10 border border-border/40 rounded-lg pl-3 pr-2 py-1.5">
                                    <span className="text-xs font-mono font-bold">{balance.toLocaleString()} USDC</span>
                                    <div className="px-2 py-0.5 bg-background rounded text-[10px] text-muted-foreground font-mono border border-border/20 shadow-sm">
                                        {address}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button 
                                onClick={connect}
                                className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold text-xs transition-colors shadow-lg shadow-primary/20"
                            >
                                <Wallet size={14} />
                                Connect Wallet
                            </button>
                        )}
                     </div>
                </div>
            )}

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
            <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
          </header>
    );
}

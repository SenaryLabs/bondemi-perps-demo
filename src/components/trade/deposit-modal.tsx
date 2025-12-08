'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, Wallet, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/context/wallet-context';

import { createPortal } from 'react-dom';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'input' | 'approving' | 'approved' | 'depositing' | 'success';

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const { deposit, balance } = useWallet();
    const [amount, setAmount] = useState('1000');
    const [step, setStep] = useState<Step>('input');
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setAmount('1000');
        }
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleApprove = () => {
        setStep('approving');
        // Simulate MetaMask signature delay
        setTimeout(() => {
            setStep('approved');
        }, 1500);
    };

    const handleDeposit = () => {
        setStep('depositing');
        // Simulate Transaction delay
        setTimeout(() => {
            const val = parseFloat(amount);
            if (!isNaN(val)) deposit(val);
            setStep('success');
            
            // Auto close after success? Or let user close.
            // Let's keep it open for a moment or let user close
            setTimeout(() => {
                onClose();
            }, 1000);
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <h3 className="font-bold flex items-center gap-2">
                        <Wallet size={18} className="text-primary" />
                        Deposit USDC
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                            <span>Amount</span>
                            <span>Balance: {balance.toLocaleString()} USDC</span>
                        </div>
                        <div className="relative">
                            <input 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-3 text-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                placeholder="0.00"
                                disabled={step !== 'input' && step !== 'approved'}
                            />
                            <div className="absolute right-3 top-3 text-sm font-bold text-muted-foreground">USDC</div>
                        </div>
                    </div>

                    {/* Progress / Actions */}
                    <div className="space-y-3">
                        {/* Step 1: Approve */}
                        <div className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-all",
                            step === 'approving' ? "bg-primary/10 border-primary/50" : 
                            (step === 'approved' || step === 'depositing' || step === 'success') ? "bg-emerald-500/10 border-emerald-500/20" : 
                            "bg-muted/10 border-border/50"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                    (step === 'approved' || step === 'depositing' || step === 'success') ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    {(step === 'approved' || step === 'depositing' || step === 'success') ? <CheckCircle2 size={14} /> : '1'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">Approve USDC</span>
                                    <span className="text-[10px] text-muted-foreground">Allow contract to spend funds</span>
                                </div>
                            </div>
                            
                            {step === 'input' && (
                                <button 
                                    onClick={handleApprove}
                                    disabled={!amount || parseFloat(amount) <= 0}
                                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Approve
                                </button>
                            )}
                            {step === 'approving' && (
                                <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                                    <Loader2 size={14} className="animate-spin" />
                                    Signing...
                                </div>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center text-muted-foreground/30">
                            <ArrowRight size={14} className="rotate-90" />
                        </div>

                        {/* Step 2: Deposit */}
                        <div className={cn(
                            "flex items-center justify-between p-3 rounded-lg border transition-all",
                            step === 'depositing' ? "bg-primary/10 border-primary/50" :
                            step === 'success' ? "bg-emerald-500/10 border-emerald-500/20" :
                            "bg-muted/10 border-border/50"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                    step === 'success' ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    {step === 'success' ? <CheckCircle2 size={14} /> : '2'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">Deposit</span>
                                    <span className="text-[10px] text-muted-foreground">Transfer funds to vault</span>
                                </div>
                            </div>

                            {step === 'approved' && (
                                <button 
                                    onClick={handleDeposit}
                                    className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                                >
                                    Deposit
                                </button>
                            )}
                             {step === 'depositing' && (
                                <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
                                    <Loader2 size={14} className="animate-spin" />
                                    Confirming...
                                </div>
                            )}
                            {step === 'success' && (
                                <div className="text-xs font-bold text-emerald-500">
                                    Success!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="bg-muted/20 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">
                        {step === 'approving' ? "Check your wallet to sign the approval..." : 
                         step === 'depositing' ? "Confirming transaction on chain..." : 
                         "Secure connection via Base Sepolia"}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}

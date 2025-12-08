'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/hooks/use-orders';

interface OrderConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderData: Partial<Order> | null;
    onConfirm: () => void;
    symbol: string;
}

export function OrderConfirmationModal({ isOpen, onClose, orderData, onConfirm, symbol }: OrderConfirmationModalProps) {
    const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep('review');
        }
    }, [isOpen]);

    console.log("Modal Render:", { isOpen, mounted, hasOrderData: !!orderData, step });

    if (!isOpen || !mounted || !orderData) return null;

    const handleConfirm = () => {
        setStep('processing');
        // Simulate Order Execution delay
        setTimeout(() => {
            onConfirm();
            setStep('success');
            
            // Auto close shortly after success
            setTimeout(() => {
                onClose();
            }, 1500);
        }, 1500);
    };

    const isLong = orderData.side === 'long';
    const leverage = orderData.leverage || 1;
    const collateral = orderData.collateral || 0;
    const size = orderData.size || 0;
    const price = orderData.entryPrice || 0;
    
    // Mock Calculations
    const liquidationPrice = isLong 
        ? price * (1 - (1 / leverage) + 0.005) // Approx logic
        : price * (1 + (1 / leverage) - 0.005);
    
    const fee = (size * price) * 0.001; // 0.1%

    return createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
             <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                    <h3 className="font-bold flex items-center gap-2">
                        Review Order
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Summary Card */}
                    <div className={cn(
                        "p-4 rounded-lg border flex flex-col items-center text-center gap-1",
                        isLong ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
                    )}>
                        <span className={cn(
                            "text-xs font-bold uppercase tracking-wider",
                            isLong ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {isLong ? 'Long' : 'Short'} {symbol}
                        </span>
                        <div className="text-2xl font-mono font-bold">
                            {size.toLocaleString(undefined, { maximumFractionDigits: 4 })} {symbol}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            @ ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Collateral</span>
                            <span className="font-mono">{collateral.toLocaleString()} USDC</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Leverage</span>
                            <span className="font-mono">{leverage}x</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Entry Price</span>
                            <span className="font-mono">${price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground/80">
                            <span>Liq. Price</span>
                            <span className="font-mono text-rose-400">
                                ${liquidationPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                         <div className="flex justify-between text-muted-foreground/80">
                            <span>Est. Fee</span>
                            <span className="font-mono text-muted-foreground">
                                ${fee.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Warning */}
                    <div className="flex gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500/90">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <p>Market orders executing at current price. Slippage may apply.</p>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleConfirm}
                        disabled={step !== 'review'}
                        className={cn(
                            "w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
                            step === 'success' 
                                ? "bg-emerald-500 text-white" 
                                : isLong 
                                    ? "bg-emerald-500 hover:brightness-110 text-white shadow-lg shadow-emerald-500/20" 
                                    : "bg-rose-500 hover:brightness-110 text-white shadow-lg shadow-rose-500/20"
                        )}
                    >
                        {step === 'processing' ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Confirming...
                            </>
                        ) : step === 'success' ? (
                            <>
                                <CheckCircle2 size={16} />
                                Order Filled
                            </>
                        ) : (
                            `Confirm ${isLong ? 'Buy' : 'Sell'}`
                        )}
                    </button>
                    
                    {step === 'processing' && (
                        <p className="text-[10px] text-center text-muted-foreground animate-pulse">
                            Sending transaction to sequencer...
                        </p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

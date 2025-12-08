import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MARKET_CONFIG } from '@/lib/market-config';
import { Order } from '@/hooks/use-orders';
import { useWallet } from '@/context/wallet-context';
import { OrderConfirmationModal } from './order-confirmation-modal';

export function OrderForm({ symbol, price, onPlaceOrder }: { symbol: string, price: number, onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void }) {
    // Config & Asset Type Logic
    const asset = MARKET_CONFIG[symbol] || MARKET_CONFIG['US10Y'];
    const isRates = asset.type === 'rates';
    const maxLev = asset.leverageMax;
    
    const { isConnected, balance, connect } = useWallet();

    // Inputs
    const [collateral, setCollateral] = useState<string>('100');
    const [leverage, setLeverage] = useState<number>(10);
    const [side, setSide] = useState<'long' | 'short'>('long');
    const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
    const [tpSlOpen, setTpSlOpen] = useState(false);
    
    // Confirmation State
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingOrder, setPendingOrder] = useState<Partial<Order> | null>(null);

    // Reset leverage if current exceeds max when asset changes
    useEffect(() => {
        if (leverage > maxLev) setLeverage(maxLev);
    }, [symbol, maxLev]);

    // Simulation Constants
    const MAINT_MARGIN = 0.01; // 1%
    const FEE_RATE = 0.001; // 0.1%

    // Calculations
    const collNum = parseFloat(collateral) || 0;
    const sizeUSD = collNum * leverage; // Notional Value
    
    // Unit Size = Notional / Price
    const sizeAsset = price > 0 ? sizeUSD / price : 0;
    
    // Fees
    const fees = sizeUSD * FEE_RATE;

    // Liquidation Price
    const liqPrice = useMemo(() => {
        if (price <= 0 || leverage <= 0) return 0;
        if (side === 'long') {
            return price * (1 - (1/leverage) + MAINT_MARGIN);
        } else {
            return price * (1 + (1/leverage) - MAINT_MARGIN);
        }
    }, [price, leverage, side]);
    
    // Actions
    const handleAction = () => {
        console.log("handleAction called", { isConnected, orderType, balance, collNum });
        if (!isConnected) {
            console.log("Not connected");
            connect();
            return;
        }

        // Validate Balance (Soft Check for Demo - allow opening modal to see UI)
        if (collNum > balance) {
            console.log("Insufficient Balance - Proceeding for Demo UI", { collNum, balance });
            // In real app: return; 
            // For Demo: Open modal but maybe warn there?
        }
        
        console.log("Opening Confirmation Modal", { sizeAsset, sizeUSD });
        
        // Prepare pending order structure
        const orderData = {
            symbol,
            side,
            type: orderType || 'market', // Handle limit logic in modal confirmation if needed
            size: sizeAsset,
            notional: sizeUSD,
            collateral: collNum,
            leverage,
            entryPrice: price,
            triggerPrice: orderType === 'limit' ? (document.getElementById('trigger-price-input') as HTMLInputElement)?.value : undefined
        };

        setPendingOrder(orderData as any); // Cast to avoid strict type issues for now
        // Small timeout to ensure state settles before modal renders (React batching usually handles this, but being safe)
        requestAnimationFrame(() => setShowConfirm(true));
    };

    const finalizeOrder = () => {
        if (pendingOrder) {
            onPlaceOrder({
                symbol: pendingOrder.symbol!,
                side: pendingOrder.side!,
                type: pendingOrder.type!, // Use the type from pendingOrder
                triggerPrice: pendingOrder.triggerPrice || 0, // Default for market orders
                size: pendingOrder.size!,
                notional: pendingOrder.notional!,
                collateral: pendingOrder.collateral!,
                leverage: pendingOrder.leverage!,
                entryPrice: pendingOrder.entryPrice!
            });
            setShowConfirm(false); // Close modal after placing order
            setPendingOrder(null); // Clear pending order
        }
    };

    // Button Text
    const getButtonText = () => {
        if (!isConnected) return 'Connect Wallet';
        return 'Place Order';
    };
    
    // Formatters
    const fmtUSD = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtAsset = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 4 });
    const fmtPrice = (n: number) => {
        if (isRates) return n.toFixed(3);
        // Gold Standard: 2 decimals
        if (symbol === 'XAU') return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // Commodities default
        if (asset.type === 'commodity') return n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
        return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="flex flex-col h-full bg-background text-[13px] font-sans border-l border-border/30">
            {/* Header: Long/Short Toggles with Price/Yield Display */}
            <div className="flex border-b border-border/30 h-12">
                <button
                    onClick={() => setSide('long')}
                    className={cn(
                        "flex-1 flex items-center justify-between px-3 py-2 transition-colors border-r border-border/30 relative overflow-hidden group",
                        side === 'long' 
                            ? "bg-[var(--emerald-500)]/10 text-[var(--emerald-500)] border-b-2 border-b-[var(--emerald-500)]" 
                            : "bg-transparent text-muted-foreground hover:bg-muted/5 border-b-2 border-b-transparent"
                    )}
                >
                    <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-foreground transition-colors">Long</span>
                    <span className="text-xs font-mono font-bold text-foreground">
                        {fmtPrice(price)}
                        {isRates && <span className="text-[10px] text-muted-foreground ml-0.5">%</span>}
                    </span>
                </button>
                <button
                    onClick={() => setSide('short')}
                    className={cn(
                        "flex-1 flex items-center justify-between px-3 py-2 transition-colors relative overflow-hidden group",
                        side === 'short' 
                            ? "bg-[var(--rose-500)]/10 text-[var(--rose-500)] border-b-2 border-b-[var(--rose-500)]" 
                            : "bg-transparent text-muted-foreground hover:bg-muted/5 border-b-2 border-b-transparent"
                    )}
                >
                    <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-foreground transition-colors">Short</span>
                    <span className="text-xs font-mono font-bold text-foreground">
                        {fmtPrice(price)}
                        {isRates && <span className="text-[10px] text-muted-foreground ml-0.5">%</span>}
                    </span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Inputs */}
                <div className="space-y-4">
                    {/* Collateral Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] text-muted-foreground">Margin (USDC)</span>
                            <span className="text-[10px] text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => setCollateral(balance.toString())}>
                                Bal: {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="relative group">
                            <input 
                                type="number" 
                                placeholder="0.00"
                                value={collateral}
                                onChange={(e) => setCollateral(e.target.value)}
                                className="w-full h-10 bg-muted/5 border border-border/40 rounded px-3 text-sm font-mono focus:outline-none focus:border-primary/50 focus:bg-muted/10 transition-all placeholder:text-muted-foreground/30"
                            />
                            <div className="absolute right-2 top-2.5 px-1.5 py-0.5 bg-muted/20 rounded text-[10px] font-bold text-muted-foreground pointer-events-none">
                                USDC
                            </div>
                        </div>
                    </div>

                    {/* Order Type Selector */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setOrderType('market')}
                            className={cn(
                                "py-1.5 text-xs font-bold rounded border transition-all",
                                orderType === 'market' 
                                    ? "bg-primary/10 text-primary border-primary/30" 
                                    : "bg-muted/5 text-muted-foreground border-border/30 hover:text-foreground"
                            )}
                        >
                            Market
                        </button>
                        <button
                            onClick={() => setOrderType('limit')}
                            className={cn(
                                "py-1.5 text-xs font-bold rounded border transition-all",
                                orderType === 'limit' 
                                    ? "bg-primary/10 text-primary border-primary/30" 
                                    : "bg-muted/5 text-muted-foreground border-border/30 hover:text-foreground"
                            )}
                        >
                            Limit
                        </button>
                    </div>

                    {/* Trigger Price Input (Conditional) */}
                    {orderType === 'limit' && (
                         <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                             <div className="flex justify-between text-[11px]">
                                  <span className="text-muted-foreground font-medium">Trigger Price</span>
                                  <span className="text-muted-foreground/50">Curr: {fmtPrice(price)}</span>
                             </div>
                             <div className="relative group">
                                 <input 
                                     type="number" 
                                     placeholder={price.toFixed(isRates ? 3 : 2)}
                                     defaultValue={price.toFixed(isRates ? 3 : 2)}
                                     id="trigger-price-input"
                                     className="w-full h-10 bg-muted/5 border border-border/40 rounded px-3 text-sm font-mono focus:outline-none focus:border-primary/50 focus:bg-muted/10 transition-all placeholder:text-muted-foreground/30"
                                 />
                                 <div className="absolute right-2 top-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-muted-foreground pointer-events-none">
                                     {isRates ? '%' : 'USD'}
                                 </div>
                             </div>
                             <p className="text-[10px] text-amber-500/80 italic pl-1">
                                 Simulated Keeper Fee: ~0.002 ETH
                             </p>
                         </div>
                    )}

                    {/* Leverage Section */}
                    <div className="space-y-3 p-3 rounded-lg border border-border/30 bg-card/30">
                         <div className="flex justify-between items-end">
                            <span className="text-[11px] text-muted-foreground">Leverage</span>
                            <div className="flex items-baseline gap-1">
                                 <span className="text-foreground font-mono font-bold text-sm">{leverage}x</span>
                                 <span className="text-[10px] text-muted-foreground">/ {maxLev}x Max</span>
                            </div>
                        </div>
                        
                        {/* Native Slider */}
                        <input 
                            type="range" 
                            min="1" 
                            max={maxLev}
                            value={leverage} 
                            onChange={(e) => setLeverage(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/90"
                        />

                        {/* Quick Select Pills (Dynamic based on maxLev) */}
                        <div className="flex gap-1 pt-1 justify-between">
                             {[1, 5, 10, 20, 50, 100].filter(v => v <= maxLev).slice(0, 5).map(v => (
                                 <button
                                    key={v}
                                    onClick={() => setLeverage(v)}
                                    className={cn(
                                        "flex-1 py-1 text-[10px] font-bold rounded border transition-all font-mono",
                                        leverage === v 
                                            ? "bg-primary/10 text-primary border-primary/30" 
                                            : "bg-muted/10 text-muted-foreground border-transparent hover:bg-muted/20 hover:text-foreground"
                                    )}
                                 >
                                     {v}x
                                 </button>
                             ))}
                             {/* Always show Max */}
                             <button
                                onClick={() => setLeverage(maxLev)}
                                className={cn(
                                    "flex-1 py-1 text-[10px] font-bold rounded border transition-all font-mono",
                                    leverage === maxLev 
                                        ? "bg-primary/10 text-primary border-primary/30" 
                                        : "bg-muted/10 text-muted-foreground border-transparent hover:bg-muted/20 hover:text-foreground"
                                )}
                             >
                                 Max
                             </button>
                        </div>
                    </div>

                    {/* TP / SL Collapsible */}
                    <div className="border border-border/30 rounded-lg overflow-hidden bg-card/30">
                        <button 
                            onClick={() => setTpSlOpen(!tpSlOpen)}
                            className="w-full flex items-center justify-between p-3 text-xs hover:bg-muted/10 transition-colors"
                        >
                            <div className="flex gap-2 font-mono">
                                <span className="text-[var(--emerald-500)] font-medium">TP 900%</span>
                                <span className="text-muted-foreground">/</span>
                                <span className="text-muted-foreground">SL None</span>
                            </div>
                            {tpSlOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                        </button>
                    </div>

                    {/* Action Button - Primary Action */}
                    {/* Action Button - Primary Action */}
                    <button
                        onClick={handleAction}
                        className={cn(
                            "w-full h-9 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg transition-all active:scale-[0.99] mt-2 flex items-center justify-center gap-2",
                            side === 'long'
                                ? "bg-[var(--emerald-500)] text-primary-foreground hover:brightness-110 shadow-[var(--emerald-500)]/20"
                                : "bg-[var(--rose-500)] text-primary-foreground hover:brightness-110 shadow-[var(--rose-500)]/20"
                        )}
                    >
                        {getButtonText()}
                    </button>

                    {/* Detailed Key/Value Grid */}
                    <div className="space-y-1 pt-2 px-1">
                        {/* Slippage & Spread */}
                         <div className="flex justify-between items-center text-[11px] h-6">
                             <span className="text-muted-foreground underline decoration-dashed decoration-border/50 underline-offset-2">Slippage Tolerance</span>
                             <div className="bg-muted/20 border border-border/30 rounded px-1.5 py-0.5 text-foreground/80 font-mono text-[10px]">1%</div>
                         </div>
                         <div className="flex justify-between items-center text-[11px] h-6">
                             <div className="flex items-center gap-1 cursor-help group/tooltip relative">
                                <span className="text-muted-foreground underline decoration-dashed decoration-border/50 underline-offset-2">Simulated Spread</span>
                                {/* Simple Custom Tooltip */}
                                <div className="absolute bottom-full left-0 w-48 p-2 bg-popover text-popover-foreground text-[10px] rounded border border-border/50 shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 mb-1 pointer-events-none">
                                    Buffer applied to protect LPs from Oracle latency.
                                </div>
                             </div>
                             <span className="text-foreground/80 font-mono">0.0047%</span>
                         </div>
                         
                         <div className="h-2" /> {/* Spacer */}

                         {/* Order Details */}
                         <div className="flex justify-between items-center text-[11px] h-5">
                             <span className="text-muted-foreground underline decoration-dashed decoration-border/50 underline-offset-2">Amount</span>
                             <span className="text-foreground/90 font-mono">{fmtAsset(sizeAsset)} {symbol}</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] h-5">
                             <span className="text-muted-foreground underline decoration-dashed decoration-border/50 underline-offset-2">Exposure</span>
                             <span className="text-foreground/90 font-mono">${fmtUSD(sizeUSD)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] h-5">
                             <span className="text-muted-foreground underline decoration-dashed decoration-border/50 underline-offset-2">Collateral at Open</span>
                             <span className="text-foreground/90 font-mono">{fmtUSD(collNum)} USDC</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] h-5">
                             <span className="text-muted-foreground underline decoration-dashed decoration-border/50 underline-offset-2">Liquidation Price</span>
                             <span className="text-foreground/90 font-mono">{fmtPrice(liqPrice)}{isRates && '%'}</span>
                         </div>

                         <div className="h-2" /> {/* Spacer */}

                         <div className="flex justify-between items-center text-[11px] h-5">
                             <span className="text-muted-foreground underline decoration-dashed decoration-border/50 underline-offset-2">Fees (0.1%)</span>
                             <span className="text-muted-foreground/60 text-[10px] hidden">Hover for breakdown</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] h-5 pl-2 border-l border-border/30 ml-0.5">
                             <span className="text-muted-foreground/50">Open</span>
                             <span className="text-foreground/70 font-mono">${fmtUSD(fees)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px] h-5 pl-2 border-l border-border/30 ml-0.5">
                             <span className="text-muted-foreground/50">Close</span>
                             <span className="text-foreground/70 font-mono">${fmtUSD(fees)}</span>
                         </div>
                    </div>

                    {/* Margin Info Section (Drift-style) */}
                    <div className="mt-4 p-3 rounded-lg bg-muted/10 border border-border/30 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Margin Info</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-muted-foreground">Account Health</span>
                            <span className="text-[var(--emerald-500)] font-mono font-bold">100%</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-muted-foreground">Total Collateral</span>
                            <span className="text-foreground font-mono">$0.00</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-muted-foreground">Maintenance Margin</span>
                            <span className="text-foreground font-mono">$0.00</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-muted-foreground">Account Leverage</span>
                            <span className="text-foreground font-mono">0x</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

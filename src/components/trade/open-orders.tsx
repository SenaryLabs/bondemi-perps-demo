import { Trash2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/hooks/use-orders';

interface OpenOrdersProps {
    orders: Order[];
    onCancel: (id: string) => void;
    currentPrice: number;
}

export function OpenOrders({ orders, onCancel, currentPrice }: OpenOrdersProps) {
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3 opacity-50">
                <div className="p-3 bg-muted/20 rounded-full">
                    <AlertCircle size={24} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-xs font-medium">No open orders</p>
                    <p className="text-[10px]">Use the "Limit" tab to place triggers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Disclaimer */}
            <div className="px-4 py-2 bg-amber-500/5 border-b border-border/30 text-[10px] text-amber-500/80 flex items-center gap-2">
                <Info size={12} />
                <span>Orders trigger based on <strong>Pyth Oracle Price</strong>, not Chart Price.</span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-8 px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/20">
                <span className="col-span-1">Date</span>
                <span className="col-span-1">Market</span>
                <span className="col-span-1">Type</span>
                <span className="col-span-1 text-right">Trigger</span>
                <span className="col-span-1 text-right">Mark</span>
                <span className="col-span-1 text-right">Size</span>
                <span className="col-span-1 text-right">Collateral</span>
                <span className="col-span-1 text-right">Action</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/10">
                {orders.map((order) => {
                    const isLong = order.side === 'long';
                    const distPercent = ((currentPrice - order.triggerPrice) / order.triggerPrice) * 100;
                    // For Long: Trigger is below current (usually). Dist is positive.
                    // For Short: Trigger is above current. Dist is negative.
                    
                    const fmtDate = new Date(order.timestamp).toLocaleTimeString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

                    return (
                        <div key={order.id} className="grid grid-cols-8 px-4 py-3 text-xs hover:bg-muted/5 transition-colors items-center group">
                            <span className="col-span-1 font-mono text-muted-foreground">{fmtDate}</span>
                            <span className="col-span-1 font-bold">{order.symbol}</span>
                            <span className={cn("col-span-1 font-bold uppercase", isLong ? "text-teal-400" : "text-rose-400")}>
                                Limit {order.side}
                            </span>
                            <span className="col-span-1 text-right font-mono font-medium">
                                {order.triggerPrice.toFixed(3)}
                            </span>
                            <div className="col-span-1 text-right flex flex-col items-end">
                                <span className="font-mono text-muted-foreground">{currentPrice.toFixed(3)}</span>
                                <span className="text-[9px] text-muted-foreground/50">
                                    {Math.abs(distPercent).toFixed(2)}% away
                                </span>
                            </div>
                            <span className="col-span-1 text-right font-mono text-foreground/90">
                                ${order.notional.toLocaleString()}
                            </span>
                            <span className="col-span-1 text-right font-mono text-muted-foreground">
                                {order.collateral.toLocaleString()} USDC
                            </span>
                            <div className="col-span-1 flex justify-end">
                                <button 
                                    onClick={() => onCancel(order.id)}
                                    className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all opacity-50 group-hover:opacity-100"
                                    title="Cancel Order"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

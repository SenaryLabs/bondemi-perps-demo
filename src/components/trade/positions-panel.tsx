'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Archive, Layers, X } from 'lucide-react';
import { OpenOrders } from './open-orders';
import { MarketTrades } from './market-trades';
import { Order } from '@/hooks/use-orders';

interface PositionsPanelProps {
    orders: Order[];
    onCancelOrder: (id: string) => void;
    currentPrice: number;
}

export function PositionsPanel({ orders, onCancelOrder, currentPrice }: PositionsPanelProps) {
    const [tab, setTab] = useState<'positions' | 'orders' | 'market-trades' | 'balances' | 'order-history' | 'position-history'>('positions');
    
    const fmtPrice = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col h-full bg-card/20 backdrop-blur-md">
            {/* Toolbar */}
            <div className="flex items-center gap-6 px-4 border-b border-border/50 h-10">
                <div className="flex gap-6">
                     {['Positions', 'Orders', 'Market Trades', 'Balances', 'Order History'].map((t) => {
                         const tabKey = t.toLowerCase().replace(' ', '-');
                         // Count logic for orders
                         const count = t === 'Orders' ? orders.length : (t === 'Positions' ? 0 : undefined);
                         
                         return (
                             <button
                                key={t}
                                onClick={() => setTab(tabKey as any)}
                                className={cn(
                                    "text-xs font-bold h-10 border-b-2 transition-colors flex items-center",
                                    tab === tabKey 
                                        ? "text-foreground border-primary" 
                                        : "text-muted-foreground border-transparent hover:text-foreground"
                                )}
                             >
                                 {t}
                                 {count !== undefined && (
                                     <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted/40 text-[9px] min-w-[1.25rem] text-center">
                                         {count}
                                     </span>
                                 )}
                             </button>
                         );
                     })}
                </div>
                
                <div className="flex-1" />
                
                <div className="flex items-center gap-2">
                     <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Unrealized P&L</span>
                     <span className="font-mono text-xs text-muted-foreground">---</span>
                </div>
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-auto bg-background/20 relative">
                {tab === 'orders' ? (
                    <OpenOrders orders={orders} onCancel={onCancelOrder} currentPrice={currentPrice} />
                ) : tab === 'market-trades' ? (
                    <MarketTrades currentPrice={currentPrice} />
                ) : ( // This is the 'positions' tab content
                    <>
                        {/* Headers (Default for Positions) */}
                        <div className="grid grid-cols-7 px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/20">
                            <span className="col-span-2">Market</span>
                            <span className="text-right">Size</span>
                            <span className="text-right">Entry Price</span>
                            <span className="text-right">Mark Price</span>
                            <span className="text-right">Liq. Price</span>
                            <span className="text-right">uP&L</span>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-auto max-h-[165px]"> {/* Fixed height for scroll */}
                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[120px] text-muted-foreground/50 gap-2">
                                    <div className="p-3 rounded-full bg-muted/10">
                                        <Layers size={24} />
                                    </div>
                                    <span className="text-xs font-medium">No open positions</span>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <tbody className="divide-y divide-border/20 text-xs text-foreground/80">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-muted/5 transition-colors group">
                                                <td className="px-4 py-2 font-mono flex items-center gap-2">
                                                    <span className={cn(
                                                        "w-1 h-8 rounded-full",
                                                        order.side === 'long' ? "bg-emerald-500" : "bg-rose-500"
                                                    )} />
                                                    <div>
                                                        <div className="font-bold">{order.symbol}</div>
                                                        <div className={cn("text-[10px] uppercase font-bold", order.side === 'long' ? "text-emerald-500" : "text-rose-500")}>
                                                            {order.side} {order.leverage}x
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 font-mono text-right">{order.size.toFixed(4)}</td>
                                                <td className="px-4 py-2 font-mono text-right">${order.notional.toLocaleString()}</td>
                                                <td className="px-4 py-2 font-mono text-right">{fmtPrice(order.entryPrice)}</td>
                                                <td className="px-4 py-2 font-mono text-right">{fmtPrice(currentPrice)}</td>
                                                <td className="px-4 py-2 font-mono text-right">
                                                    <div className={cn(
                                                        "font-bold",
                                                        (currentPrice - order.entryPrice) * (order.side === 'long' ? 1 : -1) >= 0 ? "text-emerald-500" : "text-rose-500"
                                                    )}>
                                                        ${((currentPrice - order.entryPrice) * (order.side === 'long' ? 1 : -1) * order.size).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button 
                                                        onClick={() => onCancelOrder(order.id)}
                                                        className="p-1 hover:bg-rose-500/10 hover:text-rose-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Close Position"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

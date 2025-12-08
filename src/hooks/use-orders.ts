import { useState, useEffect, useRef } from 'react'; 

export interface Order {
    id: string;
    timestamp: number;
    symbol: string;
    side: 'long' | 'short';
    type: 'limit' | 'stop';
    triggerPrice: number;
    size: number; // Unit size
    notional: number; // USD value
    collateral: number;
    leverage: number;
    entryPrice: number;
}

export function useOrders(currentPrice: number, currentSymbol: string) {
    const [orders, setOrders] = useState<Order[]>([]);

    // Use specific refs for simulation to avoid dependency loop in useEffect
    const priceRef = useRef(currentPrice);
    const ordersRef = useRef(orders);

    useEffect(() => {
        priceRef.current = currentPrice;
    }, [currentPrice]);

    useEffect(() => {
        ordersRef.current = orders;
    }, [orders]);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const price = priceRef.current;
            const currentOrders = ordersRef.current;
            
            if (price <= 0 || currentOrders.length === 0) return;

            const executedIds: string[] = [];

            currentOrders.forEach(order => {
                // Only simulate for the active symbol for now
                if (order.symbol !== currentSymbol) return;

                let filled = false;
                
                // Limit Long: Buy if Price <= Trigger (Buying the dip)
                if (order.side === 'long' && order.type === 'limit') {
                    if (price <= order.triggerPrice) {
                        filled = true;
                    }
                }
                // Limit Short: Sell if Price >= Trigger (Selling the top)
                else if (order.side === 'short' && order.type === 'limit') {
                    if (price >= order.triggerPrice) {
                        filled = true;
                    }
                }

                if (filled) {
                    executedIds.push(order.id);
                }
            });

            if (executedIds.length > 0) {
                // Remove filled orders
                setOrders(prev => {
                     const remaining = prev.filter(o => !executedIds.includes(o.id));
                     // Find the executed ones to log
                     const executed = prev.filter(o => executedIds.includes(o.id));
                     executed.forEach(o => {
                         console.log("Order Filled", o);
                     });
                     return remaining;
                });
            }

        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [currentSymbol]);


    const placeOrder = (order: Omit<Order, 'id' | 'timestamp'>) => {
        const newOrder: Order = {
            ...order,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
        };
        setOrders(prev => [newOrder, ...prev]);
        console.log("Order Placed", newOrder);
    };

    const cancelOrder = (id: string) => {
        setOrders(prev => prev.filter(o => o.id !== id));
    };

    return {
        orders,
        placeOrder,
        cancelOrder
    };
}

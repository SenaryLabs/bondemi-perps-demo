'use client';

import { useState } from 'react';
import { MarketSelector } from '@/components/trade/market-selector';
import { OrderForm } from '@/components/trade/order-form';
import { PriceChart } from '@/components/trade/price-chart';
import { PositionsPanel } from '@/components/trade/positions-panel';
import { MarketInfoStrip } from '@/components/trade/market-info-strip';
import { useMarketData } from '@/hooks/use-market-data';
import { MARKET_CONFIG } from '@/lib/market-config';
import { StatsFooter } from '@/components/trade/stats-footer';
import { useOrders } from '@/hooks/use-orders'; 
import { getOrganicStats, fmtCompact } from '@/lib/market-stats';

export default function TradePage() { 
    const [selectedSymbol, setSelectedSymbol] = useState('US10Y');
    
    const asset = MARKET_CONFIG[selectedSymbol] || MARKET_CONFIG['US10Y'];

    // Market Data Hook using simulated mock feed
    const { prices } = useMarketData([selectedSymbol]);
    const marketData = prices[selectedSymbol];
    const currentPrice = marketData?.price || 100;
    // @ts-ignore - funding is in the mock but maybe not in the type definition yet
    const fundingRate = marketData?.funding || 0.0042;

    // Organic Stats
    const stats = getOrganicStats(selectedSymbol, asset.type);

    // Order Management Hook (Simulation)
    const { orders, placeOrder, cancelOrder } = useOrders(currentPrice, selectedSymbol);

    return (
        <main className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden">
            <div className="flex-1 flex overflow-hidden min-h-0 relative">
                {/* Left: Market Selector (Fixed Width) */}
                <div className="hidden md:block w-[260px] border-r border-border/30 bg-card/20 backdrop-blur-sm h-full overflow-y-auto flex-shrink-0">
                    <MarketSelector
                        selected={selectedSymbol}
                        onSelect={setSelectedSymbol}
                    />
                </div>

                {/* Center: Chart & Positions (Flexible) */}
                <div className="flex-1 flex flex-col border-r border-border/30 relative h-full min-w-0">
                     {/* Top Bar: Market Info & Stats (Moved here) */}
                    <MarketInfoStrip
                        symbol={selectedSymbol}
                        price={currentPrice}
                        funding={fundingRate}
                        openInterest={fmtCompact(stats.openInterest)}
                        volume24h={fmtCompact(stats.volume)}
                        oracle="Pyth"
                    />

                    {/* Chart Area */}
                    <div className="flex-1 relative min-h-0">
                        <PriceChart
                            symbol={selectedSymbol} 
                            currentPrice={currentPrice} 
                            assetType={asset.type} 
                        />
                        
                        {/* Watermark / Brand Overlay if needed */}
                        <div className="absolute top-4 left-4 pointer-events-none opacity-50">
                            {/* <BrandLogo /> */}
                        </div>
                    </div>

                    {/* Positions Panel (Collapsible/Fixed) */}
                    <div className="h-[220px] bg-card/60 flex-shrink-0 border-t border-border/50">
                        <PositionsPanel 
                            orders={orders}
                            onCancelOrder={cancelOrder}
                            currentPrice={currentPrice}
                        />
                    </div>
                </div>
        
                {/* Right: Order Form (Fixed Width, Narrower) */}
                <aside className="w-[340px] bg-card/20 flex flex-col overflow-hidden border-l border-border flex-shrink-0">
                    <OrderForm 
                        symbol={selectedSymbol}
                        price={currentPrice}
                        onPlaceOrder={placeOrder}
                    />
                </aside>
            </div>

            {/* Global Status Footer - Now Flex Item */}
            <div className="h-[32px] w-full flex-shrink-0 border-t border-border bg-card z-[50]">
                <StatsFooter 
                    symbol={selectedSymbol}
                    price={currentPrice}
                    asset={asset}
                />
           </div>
        </main>
      );
}

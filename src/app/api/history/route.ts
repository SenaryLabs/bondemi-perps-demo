import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { SYMBOL_MAP } from '@/lib/market-config';

export const dynamic = 'force-dynamic'; // Ensure no caching for realtime

// Map frontend timeframe to Yahoo config (days back)
const INTERVAL_MAP: Record<string, { interval: "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo"; days: number }> = {
    '15m': { interval: '15m', days: 5 },
    '1H': { interval: '60m', days: 30 },
    '4H': { interval: '60m', days: 90 }, 
    '1D': { interval: '1d', days: 365 },
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const tf = searchParams.get('timeframe') || '15m';

    if (!symbol) return NextResponse.json({ error: 'Symbol required' }, { status: 400 });

    const yahooSymbol = SYMBOL_MAP[symbol] || symbol;
    
    // Default to 15m config
    const config = INTERVAL_MAP[tf] || INTERVAL_MAP['15m'];
    
    // Calculate period1 (start date)
    const period1 = new Date();
    period1.setDate(period1.getDate() - config.days);

    try {
        const yahooFinance = new YahooFinance();
        const result = await yahooFinance.chart(yahooSymbol, {
            period1: period1.toISOString().split('T')[0], // YYYY-MM-DD format
            interval: config.interval,
        }) as { quotes?: Array<{ date: Date; open: number; high: number; low: number; close: number; volume?: number }> }; 

        if (!result || !result.quotes || result.quotes.length === 0) {
            // Return empty array instead of 404 to prevent client crashes
            return NextResponse.json([]); 
        }

        // Process Candles
        const candles = result.quotes.map((q) => {
            const open = Number(q.open);
            const high = Number(q.high);
            const low = Number(q.low);
            const close = Number(q.close);

            if (!open || !high || !low || !close || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
                return null;
            }

            // Fix Yields (Yahoo returns index * 10) - REMOVED as checked previously
            // if (['^TNX', '^FVX', '^TYX', '^IRX'].includes(yahooSymbol)) { ... }

            return {
                time: Math.floor(new Date(q.date).getTime() / 1000), // Unix timestamp
                open,
                high,
                low,
                close,
                volume: Number(q.volume || 0), // Normalized key to 'volume'
            };
        }).filter((c): c is NonNullable<typeof c> => c !== null); // Remove nulls with type guard

        return NextResponse.json(candles); // Return array directly to match Client expect matches

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Yahoo History Error:', errorMessage, { symbol, yahooSymbol, timeframe: tf });
        // Return empty array on error to prevent client crashes
        // The client can handle empty data gracefully
        return NextResponse.json([], { status: 200 });
    }
}

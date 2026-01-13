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
        const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
        const period1Str = period1.toISOString().split('T')[0];
        
        console.log('Fetching chart data:', { symbol, yahooSymbol, timeframe: tf, period1: period1Str, interval: config.interval });
        
        // Retry logic for rate limiting (reduced to 1 retry to minimize API calls)
        let result;
        let lastError;
        const maxRetries = 1;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    // Exponential backoff: wait 2^attempt seconds
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
                
                result = await yahooFinance.chart(yahooSymbol, {
                    period1: period1Str, // YYYY-MM-DD format
                    interval: config.interval,
                    includePrePost: false, // Ensure we don't get extended hours spikes
                }) as { quotes?: Array<{ date: Date; open: number; high: number; low: number; close: number; volume?: number }> };
                
                // Success, break out of retry loop
                break;
            } catch (error: unknown) {
                lastError = error;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                
                // If it's a rate limit error and we have retries left, continue
                if (errorMessage.includes('Too Many Requests') || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
                    if (attempt < maxRetries - 1) {
                        console.warn(`Rate limited, will retry... (attempt ${attempt + 1}/${maxRetries})`);
                        continue;
                    }
                }
                
                // For other errors or final attempt, throw
                throw error;
            }
        }
        
        if (!result) {
            throw lastError || new Error('Failed to fetch chart data after retries');
        } 

        console.log('Chart API response:', { 
            hasResult: !!result, 
            hasQuotes: !!result?.quotes, 
            quotesLength: result?.quotes?.length || 0,
            firstQuote: result?.quotes?.[0] 
        });

        if (!result || !result.quotes || result.quotes.length === 0) {
            console.warn('No chart data returned for:', { symbol, yahooSymbol });
            // Return empty array instead of 404 to prevent client crashes
            return NextResponse.json([]); 
        }

        // Process Candles
        const rawCandles = result.quotes.map((q) => {
            const open = Number(q.open);
            const high = Number(q.high);
            const low = Number(q.low);
            const close = Number(q.close);

            if (!open || !high || !low || !close || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
                return null;
            }

            // Fix Yields (Yahoo returns index * 10) - REMOVED as checked previously
            // if (['^TNX', '^FVX', '^TYX', '^IRX'].includes(yahooSymbol)) { ... }

            // Handle date - it might be a Date object or a number
            let timestamp: number;
            if (q.date instanceof Date) {
                timestamp = Math.floor(q.date.getTime() / 1000);
            } else if (typeof q.date === 'number') {
                timestamp = Math.floor(q.date / 1000);
            } else {
                timestamp = Math.floor(new Date(q.date as string).getTime() / 1000);
            }

            // Outlier check: Remove candles with extreme wicks (>10% range in intraday)
            // This is common in free APIs where bad data points appear as spikes to near-zero.
            const range = high - low;
            const avgPrice = (open + close) / 2;
            const isStock = !symbol.includes('-USD') && !['XAU', 'XAG', 'WTI', 'BRENT'].includes(symbol);
            
            if (isStock && tf !== '1D' && range > avgPrice * 0.15) {
                console.warn(`Filtering outlier candle for ${symbol}:`, { open, high, low, close, range: range.toFixed(2), price: avgPrice.toFixed(2) });
                return null;
            }

            return {
                time: timestamp, // Unix timestamp
                open,
                high,
                low,
                close,
                volume: Number(q.volume || 0), // Normalized key to 'volume'
            };
        }).filter((c): c is NonNullable<typeof c> => c !== null); // Remove nulls with type guard

        // Aggregate 4H if needed (Yahoo doesn't provide 4H natively)
        let candles = rawCandles;
        if (tf === '4H') {
            const aggregated = [];
            for (let i = 0; i < rawCandles.length; i += 4) {
                const chunk = rawCandles.slice(i, i + 4);
                if (chunk.length === 0) continue;
                
                aggregated.push({
                    time: chunk[0].time,
                    open: chunk[0].open,
                    high: Math.max(...chunk.map(c => c.high)),
                    low: Math.min(...chunk.map(c => c.low)),
                    close: chunk[chunk.length - 1].close,
                    volume: chunk.reduce((sum, c) => sum + c.volume, 0),
                });
            }
            candles = aggregated;
        }

        console.log('Processed candles:', { count: candles.length, type: tf });

        return NextResponse.json(candles); // Return array directly to match Client expect matches

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isRateLimit = errorMessage.includes('Too Many Requests') || errorMessage.includes('429') || errorMessage.includes('rate limit');
        
        console.error('Yahoo History Error:', errorMessage, { 
            symbol, 
            yahooSymbol, 
            timeframe: tf,
            isRateLimit 
        });
        
        // Return empty array on error - no mock data
        return NextResponse.json([], { status: 200 });
    }
}

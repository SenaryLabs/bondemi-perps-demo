import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { SYMBOL_MAP } from '@/lib/market-config';

export const dynamic = 'force-dynamic'; // Ensure no caching for realtime

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');

    if (!symbolsParam) {
        return NextResponse.json({ error: 'Symbols required' }, { status: 400 });
    }

    const symbols = symbolsParam.split(',');
    
    // Map internal symbols to Yahoo symbols
    const yahooSymbols = symbols.map(s => SYMBOL_MAP[s] || s);

    try {
        const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
        
        // Retry logic for rate limiting
        let results;
        let lastError;
        const maxRetries = 1;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    // Wait before retry
                    const waitTime = 2000; // 2 seconds
                    console.log(`Quote API retry attempt ${attempt}/${maxRetries} after ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
                
                results = await yahooFinance.quote(yahooSymbols) as Array<{ symbol: string; regularMarketPrice?: number; regularMarketChange?: number; regularMarketChangePercent?: number }> | { symbol: string; regularMarketPrice?: number; regularMarketChange?: number; regularMarketChangePercent?: number };
                
                // Success, break out of retry loop
                break;
            } catch (error: unknown) {
                lastError = error;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                
                // If it's a rate limit error and we have retries left, continue
                if ((errorMessage.includes('Too Many Requests') || errorMessage.includes('429') || errorMessage.includes('rate limit') || errorMessage.includes('Failed to get crumb')) && attempt < maxRetries) {
                    console.warn(`Rate limited, will retry... (attempt ${attempt + 1}/${maxRetries + 1})`);
                    continue;
                }
                
                // For other errors or final attempt, throw
                throw error;
            }
        }
        
        if (!results) {
            throw lastError || new Error('Failed to fetch quotes after retries');
        }
        
        // Normalize Response
        const data: Record<string, { symbol: string; price: number; change24h: number }> = {};

        // Single result vs Array result handling
        const quotes = Array.isArray(results) ? results : [results];

        const mapped = symbols.reduce((acc, sym, idx) => {
            const ySym = yahooSymbols[idx];
            const q = quotes.find(item => item.symbol === ySym);
            
            if (q && q.regularMarketPrice !== undefined) {
                let price = q.regularMarketPrice;
                let change = q.regularMarketChange ?? 0;
                let changePercent = q.regularMarketChangePercent ?? 0;

                // Fix Yields
                // if (['^TNX', '^FVX', '^TYX', '^IRX'].includes(ySym)) {
                //    price /= 10;
                //    change /= 10;
                //    // Percent is usually correct on yield delta, but let's trust raw
                // }

                // Hardcode HYG to expected yield (User Request)
                if (sym === 'HYG') {
                    price = 7.75;
                    change = 0.05;
                    changePercent = 0.65;
                }

                acc[sym] = {
                    symbol: sym,
                    price,
                    change24h: changePercent // mapping changePercent to our 'change24h' field
                };
            }
            return acc;
        }, {} as Record<string, { symbol: string; price: number; change24h: number }>);

        // Return empty object if no data, but with 200 status to prevent client crashes
        return NextResponse.json(mapped);

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Yahoo Quote Error:', errorMessage, { symbols, yahooSymbols });
        // Return empty object on error to prevent client crashes
        // The client can handle empty data gracefully and will use cached/initial data
        return NextResponse.json({}, { status: 200 });
    }
}

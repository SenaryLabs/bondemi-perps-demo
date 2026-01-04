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
        const yahooFinance = new YahooFinance();
        const results = await yahooFinance.quote(yahooSymbols) as Array<{ symbol: string; regularMarketPrice?: number; regularMarketChange?: number; regularMarketChangePercent?: number }> | { symbol: string; regularMarketPrice?: number; regularMarketChange?: number; regularMarketChangePercent?: number };
        
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

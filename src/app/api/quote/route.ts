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
        // @ts-ignore
        const results = await yahooFinance.quote(yahooSymbols) as any[];
        
        // Normalize Response
        const data: Record<string, any> = {};

        // Single result vs Array result handling
        const quotes = Array.isArray(results) ? results : [results];

        quotes.forEach(q => {
             // Reverse map to internal symbol (not perfect if 1-to-many, but works for us)
             // We can use the requested symbol order if needed, but quote returns generic data.
             // Better: Iterate requested symbols and find matching result via yahoo symbol.
        });

        const mapped = symbols.reduce((acc, sym, idx) => {
            const ySym = yahooSymbols[idx];
            const q = quotes.find(item => item.symbol === ySym);
            
            if (q) {
                let price = q.regularMarketPrice;
                let change = q.regularMarketChange;
                let changePercent = q.regularMarketChangePercent;

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
        }, {} as Record<string, any>);

        return NextResponse.json(mapped);

    } catch (error: any) {
        console.error('Yahoo Quote Error:', error);
        return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
    }
}

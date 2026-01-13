import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { MARKET_CONFIG, SYMBOL_MAP } from '@/lib/market-config';
import { fetchPythPrices } from '@/lib/pyth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');

    if (!symbolsParam) {
        return NextResponse.json({ error: 'Symbols required' }, { status: 400 });
    }

    const symbols = symbolsParam.split(',');
    const results: Record<string, { symbol: string; price: number; change24h: number; high24h?: number; low24h?: number }> = {};
    
    // Separate symbols by data source
    const pythSymbols = symbols.filter(s => MARKET_CONFIG[s]?.pythPriceId);
    
    // 1. Fetch from Pyth Hermes (Prices only)
    let pythData: Record<string, { price: number; timestamp: number }> = {};
    if (pythSymbols.length > 0) {
        try {
            const pythIds = pythSymbols.map(s => MARKET_CONFIG[s].pythPriceId!);
            pythData = await fetchPythPrices(pythIds);
        } catch (e) {
            console.error('Pyth fetch failed', e);
        }
    }

    // 2. Fetch from Yahoo Finance (Stats & Fallback Prices)
    // We try to get Yahoo data for ALL symbols to fill in change24h/high/low even for Pyth assets
    const yahooSymbols = symbols.map(s => SYMBOL_MAP[s] || s);
    let quotes: any[] = [];
    try {
        const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
        const yahooResults = await yahooFinance.quote(yahooSymbols);
        quotes = Array.isArray(yahooResults) ? yahooResults : [yahooResults];
    } catch (error) {
        console.error('Yahoo Fallback Error:', error);
    }

    // 3. Merge Data
    symbols.forEach((sym, idx) => {
        const pythId = MARKET_CONFIG[sym]?.pythPriceId;
        const pData = pythId ? pythData[pythId] : null;
        
        const ySym = yahooSymbols[idx];
        const q = quotes.find(item => item.symbol === ySym);
        
        // Base object from Yahoo (Stats)
        const stats = q && q.regularMarketPrice !== undefined ? {
            price: q.regularMarketPrice,
            change24h: q.regularMarketChangePercent ?? 0,
            high24h: q.regularMarketDayHigh || q.regularMarketPrice * 1.02,
            low24h: q.regularMarketDayLow || q.regularMarketPrice * 0.98,
        } : null;

        // Override price/symbol if Pyth is available
        if (pData) {
            results[sym] = {
                symbol: sym,
                price: pData.price, // Pyth is authority on price
                change24h: stats?.change24h ?? 0,
                high24h: stats?.high24h, // Use Yahoo stats if available, else undefined
                low24h: stats?.low24h
            };
        } else if (stats) {
            results[sym] = {
                symbol: sym,
                ...stats
            };
        }
    });

    // Hardcode HYG/Rates if needed (for specific demo values)
    if (results['HYG']) results['HYG'].price = 7.75;
    if (results['US10Y'] && results['US10Y'].price > 100) results['US10Y'].price /= 100; // Normalizing yield if Yahoo returns bps

    return NextResponse.json(results);
}

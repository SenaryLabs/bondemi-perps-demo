import { Gem, Droplet, Mountain, Coins, Sprout, Coffee, Flame, Zap, Thermometer, Square, Activity } from 'lucide-react';
import { MARKET_CONFIG } from '@/lib/market-config';
/* eslint-disable @next/next/no-img-element */

interface TickerIconProps {
    symbol: string;
    size?: number;
    className?: string;
}

// 1. Crypto Icons (cdn.jsdelivr.net)
const getCryptoIconUrl = (symbol: string): string => {
    // Map generic commodities to tokenized versions if available
    const overrides: Record<string, string> = {
        'XAU': 'paxg', // Paxos Gold
        'XAG': 'kagu', // Kinesis Silver
    };
    const s = overrides[symbol] || symbol;
    return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${s.toLowerCase()}.png`;
};

// 2. Flag Icons (flagcdn.com)
const getFlagUrl = (countryCode: string): string => {
    return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
};

// Map symbols to flag codes
const FLAG_MAP: Record<string, string> = {
    // FX
    'EUR': 'eu',
    'GBP': 'gb',
    'JPY': 'jp',
    'USD': 'us',
    'AUD': 'au',
    'CAD': 'ca',
    'CHF': 'ch',
    'NZD': 'nz',
    'TRY': 'tr',
    'BRL': 'br',
    'MXN': 'mx',
    'INR': 'in',
    'CNH': 'cn',
    // Rates
    'US10Y': 'us',
    'US02Y': 'us',
    'DE10Y': 'de',
    // Indices
    'SPX': 'us',
    'NDX': 'us',
    'DJI': 'us',
    'DAX': 'de',
    'HSI': 'hk',
};

// Fallback / Custom for Commodities without good tokens
function AssetIcon({ symbol, size = 28 }: { symbol: string; size?: number }) {
    const iconSize = size * 0.55;
    
    // Gradients for manually handled assets
    const iconMap: Record<string, { icon: any; bg: string; iconColor: string }> = {
        'WTI': { icon: Droplet, bg: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)', iconColor: '#FFFFFF' },
        'BRENT': { icon: Droplet, bg: 'linear-gradient(135deg, #0f172a 0%, #000000 100%)', iconColor: '#FFFFFF' },
        'NG': { icon: Flame, bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', iconColor: '#FFFFFF' },
        'HG': { icon: Mountain, bg: 'linear-gradient(135deg, #b87333 0%, #a05a2c 100%)', iconColor: '#FFFFFF' },
        'XAG': { icon: Gem, bg: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)', iconColor: '#424242' },
        'XAU': { icon: Gem, bg: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)', iconColor: '#FFFFFF' },
        
        // Energy & Others
        'RBOB': { icon: Droplet, bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', iconColor: '#FFFFFF' },
        'HO':   { icon: Droplet, bg: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', iconColor: '#FFFFFF' },
        'AL':   { icon: Square, bg: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)', iconColor: '#FFFFFF' },
        'ZN':   { icon: Square, bg: 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)', iconColor: '#FFFFFF' },
        'NI':   { icon: Square, bg: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)', iconColor: '#1e293b' },

        // Soft Commodities
        'ZW': { icon: Sprout, bg: 'linear-gradient(135deg, #E6B800 0%, #FDB931 100%)', iconColor: '#FFFFFF' }, 
        'ZC': { icon: Sprout, bg: 'linear-gradient(135deg, #FDE047 0%, #EAB308 100%)', iconColor: '#713F12' },
        'ZS': { icon: Sprout, bg: 'linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)', iconColor: '#FFFFFF' },
        'KC': { icon: Coffee, bg: 'linear-gradient(135deg, #78350F 0%, #451a03 100%)', iconColor: '#FFFFFF' },
        'SB': { icon: Sprout, bg: 'linear-gradient(135deg, #F5F5F5 0%, #E5E5E5 100%)', iconColor: '#404040' },
        'CT': { icon: Sprout, bg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', iconColor: '#64748b' },
        'COCOA': { icon: Coffee, bg: 'linear-gradient(135deg, #3f2b1e 0%, #1a0f0a 100%)', iconColor: '#FFFFFF' },
    };
    
    const config = iconMap[symbol] || { 
        icon: (MARKET_CONFIG[symbol]?.type === 'stock' || MARKET_CONFIG[symbol]?.type === 'rates') ? Activity : Coins, 
        bg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', 
        iconColor: '#FFFFFF' 
    };
    
    const Icon = config.icon;
    
    return (
        <div 
            className="flex items-center justify-center rounded-lg shadow-sm border border-white/5"
            style={{ 
                width: size, 
                height: size, 
                background: config.bg,
            }}
        >
            <Icon size={iconSize} style={{ color: config.iconColor }} strokeWidth={2} />
        </div>
    );
}

// 3. Stock Icons (simpleicons.org)
const STOCK_MAP: Record<string, string> = {
    'NVDA': 'nvidia',
    'TSLA': 'tesla',
    'AAPL': 'apple',
    'MSFT': 'microsoft',
    'GOOGL': 'google',
    'AMZN': 'amazon',
    'COIN': 'coinbase',
    'MSTR': 'microstrategy',
    'AMD': 'amd',
    'META': 'meta',
    'NFLX': 'netflix',
    'ASML': 'asml',
    'LVMH': 'louisvuitton',
    'SAP': 'sap',
    'NVO': 'novonordisk',
    'BABA': 'alibaba',
    'TCEHY': 'tencent',
    'TM': 'toyota',
    'BP': 'bp',
    'SHEL': 'shell',
    'SSNLF': 'samsung',
    // European Mappings
    'OR.PA': 'loreal',
    'SIE.DE': 'siemens',
    'AZN': 'astrazeneca',
    'TTE.PA': 'totalenergies',
    'RACE': 'ferrari',
    'P911.DE': 'porsche',
    'HSBC': 'hsbc',
    'BARC.L': 'barclays',
    // Chinese / HK Mappings
    '601288.SS': 'abc', // Agricultural Bank of China
    '1398.HK': 'icbc',
    '300750.SZ': 'catl',
    '0941.HK': 'chinamobile',
    'SPY': 'spdr',
    'QQQ': 'invesco',
};

const getStockIconUrl = (slug: string): string => {
    return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
};

import { useState } from 'react';

export function TickerIcon({ symbol, size = 28, className = '' }: TickerIconProps) {
    const [failedSources, setFailedSources] = useState<Set<string>>(new Set());
    const hasFailed = (src: string) => failedSources.has(src);
    const markFailed = (src: string) => setFailedSources(prev => new Set([...prev, src]));

    // 1. Config Override (Primary source)
    const config = MARKET_CONFIG[symbol];
    if (config?.icon && !hasFailed('config')) {
        return (
            <div className={`relative flex-shrink-0 ${className} rounded-full bg-white/5 overflow-hidden`} style={{ width: size, height: size }}>
                <img
                    src={config.icon}
                    alt={`${symbol} icon`}
                    width={size}
                    height={size}
                    className="rounded-full object-contain w-full h-full"
                    onError={() => markFailed('config')}
                />
            </div>
        );
    }

    // 2. Check for Flag Mappings (FX & Rates)
    if (FLAG_MAP[symbol] && !hasFailed('flag')) {
        return (
            <div className={`relative flex-shrink-0 ${className} overflow-hidden rounded-lg shadow-sm border border-white/10`} style={{ width: size, height: size }}>
                <img
                    src={getFlagUrl(FLAG_MAP[symbol])}
                    alt={`${symbol} flag`}
                    className="object-cover w-full h-full"
                    onError={() => markFailed('flag')}
                />
            </div>
        );
    }

    // 3. Check for Stocks (SimpleIcons)
    if (STOCK_MAP[symbol] && !hasFailed('stock')) {
         return (
            <div className={`relative flex-shrink-0 ${className} flex items-center justify-center bg-white/5 rounded-lg border border-white/10 p-1.5`} style={{ width: size, height: size }}>
                <img
                    src={getStockIconUrl(STOCK_MAP[symbol])}
                    alt={`${symbol} logo`}
                    width={size}
                    height={size}
                    className="object-contain invert opacity-90"
                    onError={() => markFailed('stock')}
                />
            </div>
        );
    }

    // 4. Check for Crypto / Tokenized mappings (SpotHQ)
    const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'USDT', 'USDC', 'BNB', 'ADA', 'DOGE', 'XRP', 'DOT', 'XAU', 'HYPE', 'ONDO', 'AERO', 'SHIB', 'PEPE', 'TRX', 'LDO', 'TIA', 'RENDER', 'ICP', 'INJ', 'JASMY', 'CAKE', 'JUP', 'PYTH', 'DRIFT', 'VIRTUALS', 'PENGU', 'POL', 'KAS', 'TRUMP', 'ALGO', 'CRO', 'QNT'];
    
    if (cryptoSymbols.includes(symbol) && !hasFailed('crypto')) {
        return (
             <div className={`relative flex-shrink-0 ${className} rounded-full bg-white/5`} style={{ width: size, height: size }}>
                <img
                    src={getCryptoIconUrl(symbol)}
                    alt={`${symbol} icon`}
                    width={size}
                    height={size}
                    className="rounded-full object-contain"
                    onError={() => markFailed('crypto')}
                />
            </div>
        );
    }

    // 5. High-Impact Fallback (Favicon / Google S2)
    // Try to get a favicon based on the 'domain' field in MARKET_CONFIG
    if (config?.domain && !hasFailed('favicon')) {
        return (
            <div className={`relative flex-shrink-0 ${className} rounded-lg bg-white overflow-hidden p-1 shadow-sm border border-white/10`} style={{ width: size, height: size }}>
                <img
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${config.domain}`}
                    alt={`${symbol} favicon`}
                    width={size}
                    height={size}
                    className="object-contain w-full h-full"
                    onError={() => markFailed('favicon')}
                />
            </div>
        );
    }

    // 6. Final Fallback (Lucide)
    return <AssetIcon symbol={symbol} size={size} />;
}

import { Gem, Droplet, Mountain, Coins, Sprout, Coffee } from 'lucide-react';
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
    // Rates
    'US10Y': 'us',
    'US02Y': 'us',
    'DE10Y': 'de',
};

// Fallback / Custom for Commodities without good tokens
function AssetIcon({ symbol, size = 28 }: { symbol: string; size?: number }) {
    const iconSize = size * 0.55;
    
    // Gradients for manually handled assets
    const iconMap: Record<string, { icon: any; bg: string; iconColor: string }> = {
        'WTI': { icon: Droplet, bg: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)', iconColor: '#FFFFFF' },
        'HG': { icon: Mountain, bg: 'linear-gradient(135deg, #b87333 0%, #a05a2c 100%)', iconColor: '#FFFFFF' },
        'XAG': { icon: Gem, bg: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)', iconColor: '#424242' },
        
        // Soft Commodities
        'ZW': { icon: Sprout, bg: 'linear-gradient(135deg, #E6B800 0%, #FDB931 100%)', iconColor: '#FFFFFF' }, 
        'ZC': { icon: Sprout, bg: 'linear-gradient(135deg, #FDE047 0%, #EAB308 100%)', iconColor: '#713F12' },
        'ZS': { icon: Sprout, bg: 'linear-gradient(135deg, #84CC16 0%, #4D7C0F 100%)', iconColor: '#FFFFFF' },
        'KC': { icon: Coffee, bg: 'linear-gradient(135deg, #78350F 0%, #451a03 100%)', iconColor: '#FFFFFF' },
        'SB': { icon: Sprout, bg: 'linear-gradient(135deg, #F5F5F5 0%, #E5E5E5 100%)', iconColor: '#404040' },
    };
    
    const config = iconMap[symbol] || { 
        icon: Coins, 
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
};

const getStockIconUrl = (slug: string): string => {
    return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;
};

export function TickerIcon({ symbol, size = 28, className = '' }: TickerIconProps) {
    // 1. Check for Flag Mappings (FX & Rates)
    if (FLAG_MAP[symbol]) {
        return (
            <div className={`relative flex-shrink-0 ${className} overflow-hidden rounded-lg shadow-sm border border-white/10`} style={{ width: size, height: size }}>
                <img
                    src={getFlagUrl(FLAG_MAP[symbol])}
                    alt={`${symbol} flag`}
                    className="object-cover w-full h-full"
                />
            </div>
        );
    }

    // 2. Check for Stocks
    if (STOCK_MAP[symbol]) {
         return (
            <div className={`relative flex-shrink-0 ${className} flex items-center justify-center bg-white/5 rounded-lg border border-white/10 p-1.5`} style={{ width: size, height: size }}>
                <img
                    src={getStockIconUrl(STOCK_MAP[symbol])}
                    alt={`${symbol} logo`}
                    width={size}
                    height={size}
                    className="object-contain invert opacity-90"
                />
            </div>
        );
    }

    // 3. Check for Crypto / Tokenized mappings
    const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'USDT', 'USDC', 'BNB', 'ADA', 'DOGE', 'XRP', 'DOT', 'XAU'];
    
    if (cryptoSymbols.includes(symbol)) {
        return (
             <div className={`relative flex-shrink-0 ${className} rounded-full bg-white/5`} style={{ width: size, height: size }}>
                <img
                    src={getCryptoIconUrl(symbol)}
                    alt={`${symbol} icon`}
                    width={size}
                    height={size}
                    className="rounded-full object-contain"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
        );
    }
    
    // 4. Fallback for others
    return <AssetIcon symbol={symbol} size={size} />;
}

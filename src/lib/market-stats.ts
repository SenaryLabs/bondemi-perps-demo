import { AssetType } from './market-config';

interface MarketStats {
    volume: number;
    openInterest: number;
}

// Configuration for "Organic" ranges by asset class
const STATS_CONFIG: Record<AssetType | 'default', { oiBase: number; volRatio: [number, number] }> = {
    crypto: { 
        oiBase: 8_000_000, // $5M - $12M Target -> Base $8M
        volRatio: [0.3, 0.7] // High velocity
    },
    rates: {
        oiBase: 12_000_000, // $8M - $15M Target
        volRatio: [0.05, 0.15] // Low churn (5-15% of OI)
    },
    stock: {
        oiBase: 4_000_000, // $2M - $6M Target
        volRatio: [0.2, 0.5] // Med velocity
    },
    commodity: {
        oiBase: 500_000, // $200k - $800k Target
        volRatio: [0.2, 0.4] // Low-Med velocity
    },
    fx: {
        oiBase: 12_000_000, // Similar to Rates
        volRatio: [0.1, 0.3]
    },
    default: {
        oiBase: 2_000_000,
        volRatio: [0.2, 0.5]
    }
};

// Seeded-like random (simple hash) to keep stats consistent per session/asset but varied across assets
function pseudoRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

export function getOrganicStats(symbol: string, type: AssetType = 'crypto'): MarketStats {
    const config = STATS_CONFIG[type] || STATS_CONFIG.default;
    
    // Variance: +/- 20% on Base OI
    // Using symbol as seed so it's consistent for that asset re-renders (unless we want live jitter)
    // Let's add a time component (minute-based) so it updates slowly? 
    // For now, let's keep it static per load or per symbol to avoid jumping numbers during trade.
    // User requested: "Variance... +/- 15%"
    
    const rand1 = pseudoRandom(symbol + 'OI');
    // Map 0..1 to 0.85..1.15
    const variance = 0.85 + (rand1 * 0.3); 
    
    const openInterest = config.oiBase * variance;
    
    // Volume: Ratio of OI
    const rand2 = pseudoRandom(symbol + 'VOL');
    const [minRatio, maxRatio] = config.volRatio;
    const ratio = minRatio + (rand2 * (maxRatio - minRatio));
    
    const volume = openInterest * ratio;
    
    return {
        volume,
        openInterest
    };
}

export function fmtCompact(n: number): string {
    return '$' + Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(n);
}

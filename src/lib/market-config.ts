export type AssetType = 'rates' | 'crypto' | 'fx' | 'commodity' | 'stock';

export interface AssetConfig {
    ticker: string;
    type: AssetType;
    leverageMax: number;
    name: string;
    description: string;
}

export const MARKET_CONFIG: Record<string, AssetConfig> = {
    // RATES (RWA)
    'US10Y': { ticker: '^TNX', type: 'rates', leverageMax: 100, name: 'US 10Y Yield', description: '10-Year Treasury Note Yield' },
    'US02Y': { ticker: '^IRX', type: 'rates', leverageMax: 100, name: 'US 2Y Yield', description: '2-Year Treasury Note Yield' },  
    'HYG':   { ticker: 'HYG',  type: 'rates', leverageMax: 50,  name: 'High Yield Corp', description: 'iShares iBoxx High Yield Corp Bond ETF' },

    // CRYPTO
    'BTC': { ticker: 'BTC-USD', type: 'crypto', leverageMax: 20, name: 'Bitcoin', description: 'Digital Gold' },
    'ETH': { ticker: 'ETH-USD', type: 'crypto', leverageMax: 20, name: 'Ethereum', description: 'Smart Contract Platform' },
    'SOL': { ticker: 'SOL-USD', type: 'crypto', leverageMax: 20, name: 'Solana', description: 'High Performance Chain' },
    'BNB': { ticker: 'BNB-USD', type: 'crypto', leverageMax: 20, name: 'Binance Coin', description: 'Exchange Utility Token' },
    'XRP': { ticker: 'XRP-USD', type: 'crypto', leverageMax: 20, name: 'Ripple', description: 'Digital Payment Network' },
    'DOGE': { ticker: 'DOGE-USD', type: 'crypto', leverageMax: 20, name: 'Dogecoin', description: 'Original Meme Coin' },
    'ADA': { ticker: 'ADA-USD', type: 'crypto', leverageMax: 20, name: 'Cardano', description: 'Proof of Stake Blockchain' },
    'AVAX': { ticker: 'AVAX-USD', type: 'crypto', leverageMax: 20, name: 'Avalanche', description: 'High Throughput L1' },
    'LINK': { ticker: 'LINK-USD', type: 'crypto', leverageMax: 20, name: 'Chainlink', description: 'Decentralized Oracle Network' },
    'DOT': { ticker: 'DOT-USD', type: 'crypto', leverageMax: 20, name: 'Polkadot', description: 'Interoperability Protocol' },

    // COMMODITIES
    'XAU': { ticker: 'GC=F', type: 'commodity', leverageMax: 50, name: 'Gold', description: 'Gold Futures' },
    'WTI': { ticker: 'CL=F', type: 'commodity', leverageMax: 50, name: 'Crude Oil', description: 'WTI Crude Oil Futures' },
    'ZC':  { ticker: 'ZC=F', type: 'commodity', leverageMax: 50, name: 'Corn', description: 'Corn Futures' },
    'ZW':  { ticker: 'ZW=F', type: 'commodity', leverageMax: 50, name: 'Wheat', description: 'Wheat Futures' },
    'KC':  { ticker: 'KC=F', type: 'commodity', leverageMax: 50, name: 'Coffee', description: 'Coffee Futures' },

    // STOCKS
    'NVDA': { ticker: 'NVDA', type: 'stock', leverageMax: 20, name: 'NVIDIA', description: 'AI Computing' },
    'TSLA': { ticker: 'TSLA', type: 'stock', leverageMax: 20, name: 'Tesla', description: 'EV & Robotics' },
    'AAPL': { ticker: 'AAPL', type: 'stock', leverageMax: 20, name: 'Apple', description: 'Consumer Electronics' },
    'MSFT': { ticker: 'MSFT', type: 'stock', leverageMax: 20, name: 'Microsoft', description: 'Software & Cloud' },
    'AMZN': { ticker: 'AMZN', type: 'stock', leverageMax: 20, name: 'Amazon', description: 'E-commerce & Cloud' },
    'SPY':  { ticker: 'SPY',  type: 'stock', leverageMax: 50, name: 'S&P 500', description: 'SPDR S&P 500 ETF Trust' },
    'QQQ':  { ticker: 'QQQ',  type: 'stock', leverageMax: 50, name: 'Nasdaq 100', description: 'Invesco QQQ Trust' },

    // FX
    'EUR': { ticker: 'EURUSD=X', type: 'fx', leverageMax: 100, name: 'Euro', description: 'EUR/USD' },
    'JPY': { ticker: 'JPY=X', type: 'fx', leverageMax: 100, name: 'Yen', description: 'USD/JPY' },
};

export const SYMBOL_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(MARKET_CONFIG).map(([k, v]) => [k, v.ticker])
);

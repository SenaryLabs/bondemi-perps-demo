export type AssetType = 'rates' | 'crypto' | 'fx' | 'commodity' | 'stock';

export interface AssetConfig {
    ticker: string;
    type: AssetType;
    leverageMax: number;
    name: string;
    description: string;
    pythPriceId?: string;
    icon?: string;
    domain?: string;
}

export const MARKET_CONFIG: Record<string, AssetConfig> = {
    // RATES (RWA)
    'US10Y': { ticker: '^TNX', type: 'rates', leverageMax: 100, name: 'US 10Y Yield', description: '10-Year Treasury Note Yield' },
    'US02Y': { ticker: '^IRX', type: 'rates', leverageMax: 100, name: 'US 2Y Yield', description: '2-Year Treasury Note Yield' }, 
    'HYG':   { ticker: 'HYG',  type: 'rates', leverageMax: 50,  name: 'High Yield Corp', description: 'iShares iBoxx High Yield Corp Bond ETF' },

    // CRYPTO
    'BTC': { ticker: 'BTC-USD', type: 'crypto', leverageMax: 20, name: 'Bitcoin', description: 'Digital Gold', pythPriceId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png' },
    'ETH': { ticker: 'ETH-USD', type: 'crypto', leverageMax: 20, name: 'Ethereum', description: 'Smart Contract Platform', pythPriceId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png' },
    'SOL': { ticker: 'SOL-USD', type: 'crypto', leverageMax: 20, name: 'Solana', description: 'High Performance Chain', pythPriceId: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png' },
    'BNB': { ticker: 'BNB-USD', type: 'crypto', leverageMax: 20, name: 'Binance Coin', description: 'Exchange Utility Token', pythPriceId: '0x2f95862b045670cd22bee31114c39763a4a08beeb663b145d283c31d7d1101c4f', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png' },
    'XRP': { ticker: 'XRP-USD', type: 'crypto', leverageMax: 20, name: 'Ripple', description: 'Digital Payment Network', pythPriceId: '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png' },
    'ADA': { ticker: 'ADA-USD', type: 'crypto', leverageMax: 20, name: 'Cardano', description: 'PoS Blockchain', pythPriceId: '0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ada.png' },
    'TRX': { ticker: 'TRX-USD', type: 'crypto', leverageMax: 20, name: 'TRON', description: 'Entertainment Content System', pythPriceId: '0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/trx.png' },
    'LINK': { ticker: 'LINK-USD', type: 'crypto', leverageMax: 20, name: 'Chainlink', description: 'Oracle Network', pythPriceId: '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221', icon: 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/link.png' },
    'HYPE': { ticker: 'HYPE-USD', type: 'crypto', leverageMax: 20, name: 'Hyperliquid', description: 'L1 for Perps', pythPriceId: '0x00038f83323b6b08116d1614cf33a9bd71ab5e0abf0c9f1b783a74a43e7bd992', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/33285.png' },
    'ONDO': { ticker: 'ONDO-USD', type: 'crypto', leverageMax: 20, name: 'Ondo Finance', description: 'RWA Yield', pythPriceId: '0xd40472610abe56d36d065a0cf889fc8f1dd9f3b7f2a478231a5fc6df07ea5ce3', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21159.png' },
    'AERO': { ticker: 'AERO-USD', type: 'crypto', leverageMax: 20, name: 'Aerodrome', description: 'Base DEX', pythPriceId: '0x9db37f4d5654aad3e37e2e14ffd8d53265fb3026d1d8f91146539eebaa2ef45f', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/29013.png' },
    'DOGE': { ticker: 'DOGE-USD', type: 'crypto', leverageMax: 20, name: 'Dogecoin', description: 'Original Meme Coin', pythPriceId: '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png' },
    'BONK': { ticker: 'BONK-USD', type: 'crypto', leverageMax: 20, name: 'Bonk', description: 'Solana Meme Coin', pythPriceId: '0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png' },
    'AAVE': { ticker: 'AAVE-USD', type: 'crypto', leverageMax: 20, name: 'Aave', description: 'Lending Protocol', pythPriceId: '0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png' },
    'AVAX': { ticker: 'AVAX-USD', type: 'crypto', leverageMax: 20, name: 'Avalanche', description: 'Smart Contract Platform', pythPriceId: '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png' },
    'ENA': { ticker: 'ENA-USD', type: 'crypto', leverageMax: 20, name: 'Ethena', description: 'Synthetic Dollar Protocol', pythPriceId: '0xb7918a99475e533087dd48e65315b8004f114631317d7b1d471d4ed9a6c96bd4', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/29877.png' },
    'PEPE': { ticker: 'PEPE-USD', type: 'crypto', leverageMax: 20, name: 'Pepe', description: 'Frog Meme Coin', pythPriceId: '0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png' },
    'LDO': { ticker: 'LDO-USD', type: 'crypto', leverageMax: 20, name: 'Lido', description: 'Liquid Staking', pythPriceId: '0xc63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png' },
    'TIA': { ticker: 'TIA-USD', type: 'crypto', leverageMax: 20, name: 'Celestia', description: 'Modular DA', pythPriceId: '0x09f7a47545b632488d5e869cf32912255743b35520a0efb32e0e47087e834723', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/22861.png' },
    'RENDER': { ticker: 'RENDER-USD', type: 'crypto', leverageMax: 20, name: 'Render', description: 'Decentralized GPU Rendering', pythPriceId: '0x627d79b6999330a10408544c03b1236f04770e59995c643bb89c670a4427e1f4', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5632.png' },
    'ICP': { ticker: 'ICP-USD', type: 'crypto', leverageMax: 20, name: 'Internet Computer', description: 'World Computer', pythPriceId: '0xc9907d786c5821547777780a1e4f89484f3417cb14dd244f2b0a34ea7a554d67', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png' },
    'INJ': { ticker: 'INJ-USD', type: 'crypto', leverageMax: 20, name: 'Injective', description: 'Finance-focused L1', pythPriceId: '0x7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png' },
    'JASMY': { ticker: 'JASMY-USD', type: 'crypto', leverageMax: 20, name: 'Jasmy', description: 'Data Democracy', pythPriceId: '0x2b38ef06e00cf0440026e696f5b248a31818274d758b972fd41c2c4d9241972f', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8421.png' },
    'ALGO': { ticker: 'ALGO-USD', type: 'crypto', leverageMax: 20, name: 'Algorand', description: 'Pure PoS', pythPriceId: '0x08f781a893bc9340140c5f89c8a96f438bcfae4d1474cc0f688e3a52892c7318', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' },
    'CRO': { ticker: 'CRO-USD', type: 'crypto', leverageMax: 20, name: 'Cronos', description: 'Crypto.com Chain', pythPriceId: '0x23199c2bcb1303f667e733b9934db9eca5991e765b45f5ed18bc4b231415f2fe', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3635.png' },
    'QNT': { ticker: 'QNT-USD', type: 'crypto', leverageMax: 20, name: 'Quant', description: 'Interoperability Protocol', pythPriceId: '0x19ab139032007c8bd7d1fd3842ef392a5434569a72b555504a5aee47df2a0a35', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3155.png' },
    'CAKE': { ticker: 'CAKE-USD', type: 'crypto', leverageMax: 20, name: 'PancakeSwap', description: 'DEX Utility', pythPriceId: '0x2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png' },
    'SHIB': { ticker: 'SHIB-USD', type: 'crypto', leverageMax: 20, name: 'Shiba Inu', description: 'Community Ecosystem', pythPriceId: '0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png' },
    'JUP':  { ticker: 'JUP-USD', type: 'crypto', leverageMax: 20, name: 'Jupiter', description: 'Solana Aggregator', pythPriceId: '0x07f8905da24c0d02b9e6c271871270543597c36a49591e1d053228c24d86407d5', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/29210.png' },
    'PYTH': { ticker: 'PYTH-USD', type: 'crypto', leverageMax: 20, name: 'Pyth Network', description: 'Oracle Protocol', pythPriceId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27444.png' },
    'DRIFT': { ticker: 'DRIFT-USD', type: 'crypto', leverageMax: 20, name: 'Drift', description: 'Solana Perps DEX', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/30971.png' },
    'VIRTUALS': { ticker: 'VIRTUALS-USD', type: 'crypto', leverageMax: 20, name: 'Virtuals', description: 'AI Agent Layer', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/33815.png' },
    'PENGU': { ticker: 'PENGU-USD', type: 'crypto', leverageMax: 20, name: 'Pudgy Penguins', description: 'NFT Ecosystem', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/34493.png' },
    'POL': { ticker: 'POL-USD', type: 'crypto', leverageMax: 20, name: 'Polygon', description: 'Ethereum Scaling', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' },
    'KAS': { ticker: 'KAS-USD', type: 'crypto', leverageMax: 20, name: 'Kaspa', description: 'BlockDAG Protocol', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20396.png' },
    'TRUMP': { ticker: 'TRUMP-USD', type: 'crypto', leverageMax: 20, name: 'Trump Coin', description: 'PolitiFi Meme', icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/30310.png' },

    // COMMODITIES
    'XAU': { ticker: 'GC=F', type: 'commodity', leverageMax: 50, name: 'Gold', description: 'Gold Futures', pythPriceId: '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2', icon: 'https://cdn-icons-png.flaticon.com/128/2443/2443219.png' },
    'XAG': { ticker: 'SI=F', type: 'commodity', leverageMax: 50, name: 'Silver', description: 'Silver Futures', pythPriceId: '0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e', icon: 'https://cdn-icons-png.flaticon.com/128/2443/2443221.png' },
    'WTI': { ticker: 'CL=F', type: 'commodity', leverageMax: 50, name: 'Crude Oil', description: 'WTI Crude Oil Futures', pythPriceId: '0x925cb2410a56f082e057f9235e2373df899f84826a760f3844f227b49466b3e6', icon: 'https://cdn-icons-png.flaticon.com/128/9501/9501099.png' },
    'BRENT': { ticker: 'BZ=F', type: 'commodity', leverageMax: 50, name: 'Brent Crude', description: 'Brent Crude Oil Futures', pythPriceId: '0x27f08c37d8009b02a573216827050543597c36a49591e1d053228c24d86407d5', icon: 'https://cdn-icons-png.flaticon.com/128/9501/9501103.png' },
    'NG': { ticker: 'NG=F', type: 'commodity', leverageMax: 50, name: 'Natural Gas', description: 'Natural Gas Futures', icon: 'https://cdn-icons-png.flaticon.com/128/9501/9501102.png' },
    'ZC':  { ticker: 'ZC=F', type: 'commodity', leverageMax: 50, name: 'Corn', description: 'Corn Futures', icon: 'https://cdn-icons-png.flaticon.com/128/2443/2443224.png' },
    'ZW':  { ticker: 'ZW=F', type: 'commodity', leverageMax: 50, name: 'Wheat', description: 'Wheat Futures', icon: 'https://cdn-icons-png.flaticon.com/128/2443/2443225.png' },
    'HG':  { ticker: 'HG=F', type: 'commodity', leverageMax: 50, name: 'Copper', description: 'Copper Futures', icon: 'https://cdn-icons-png.flaticon.com/128/2443/2443222.png' },
    'ZW-SOY': { ticker: 'ZS=F', type: 'commodity', leverageMax: 50, name: 'Soybeans', description: 'Soybean Futures' },
    'KC':  { ticker: 'KC=F', type: 'commodity', leverageMax: 50, name: 'Coffee', description: 'Coffee Futures' },
    'SB':  { ticker: 'SB=F', type: 'commodity', leverageMax: 50, name: 'Sugar', description: 'Sugar Futures' },
    'CT':  { ticker: 'CT=F', type: 'commodity', leverageMax: 50, name: 'Cotton', description: 'Cotton Futures' },
    'RBOB': { ticker: 'RB=F', type: 'commodity', leverageMax: 50, name: 'Gasoline', description: 'RBOB Gasoline Futures' },
    'HO':   { ticker: 'HO=F', type: 'commodity', leverageMax: 50, name: 'Heating Oil', description: 'Heating Oil Futures' },
    'AL':   { ticker: 'ALI=F', type: 'commodity', leverageMax: 50, name: 'Aluminium', description: 'Aluminium Futures' },
    'ZN':   { ticker: 'ZNC=F', type: 'commodity', leverageMax: 50, name: 'Zinc', description: 'Zinc Futures' },
    'NI':   { ticker: 'NICK=F', type: 'commodity', leverageMax: 50, name: 'Nickel', description: 'Nickel Futures' },
    'COCOA': { ticker: 'CC=F', type: 'commodity', leverageMax: 50, name: 'Cocoa', description: 'Cocoa Futures' },

    // STOCKS
    'NVDA': { ticker: 'NVDA', type: 'stock', leverageMax: 20, name: 'NVIDIA', description: 'AI Computing', pythPriceId: '0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593', icon: 'https://logo.clearbit.com/nvidia.com' },
    'TSLA': { ticker: 'TSLA', type: 'stock', leverageMax: 20, name: 'Tesla', description: 'Electric Vehicles', pythPriceId: '0xc98f21217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419', icon: 'https://logo.clearbit.com/tesla.com' },
    'AAPL': { ticker: 'AAPL', type: 'stock', leverageMax: 20, name: 'Apple', description: 'Consumer Electronics', pythPriceId: '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688', icon: 'https://logo.clearbit.com/apple.com' },
    'MSFT': { ticker: 'MSFT', type: 'stock', leverageMax: 20, name: 'Microsoft', description: 'Software & Cloud', pythPriceId: '0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1', icon: 'https://logo.clearbit.com/microsoft.com' },
    'AMZN': { ticker: 'AMZN', type: 'stock', leverageMax: 20, name: 'Amazon', description: 'E-commerce & Cloud', pythPriceId: '0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a', icon: 'https://logo.clearbit.com/amazon.com' },
    'GOOGL': { ticker: 'GOOGL', type: 'stock', leverageMax: 20, name: 'Alphabet', description: 'Google search & AI', pythPriceId: '0xe65ff64121e100f89012423366e6c21e64359858593444fb9a5723b7a5a3f3f2', icon: 'https://logo.clearbit.com/google.com' },
    'META': { ticker: 'META', type: 'stock', leverageMax: 20, name: 'Meta', description: 'Social Media & Metaverse', pythPriceId: '0x78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe', icon: 'https://logo.clearbit.com/meta.com' },
    'SPY':  { ticker: 'SPY',  type: 'stock', leverageMax: 50, name: 'S&P 500', description: 'SPDR S&P 500 ETF Trust', icon: 'https://flagcdn.com/w80/us.png' },
    'QQQ':  { ticker: 'QQQ',  type: 'stock', leverageMax: 50, name: 'Nasdaq 100', description: 'Invesco QQQ Trust', icon: 'https://flagcdn.com/w80/us.png' },

    // FX
    'EUR': { ticker: 'EURUSD=X', type: 'fx', leverageMax: 100, name: 'Euro', description: 'EUR/USD', icon: 'https://flagcdn.com/w80/eu.png' },
    'JPY': { ticker: 'JPY=X', type: 'fx', leverageMax: 100, name: 'Yen', description: 'USD/JPY', icon: 'https://flagcdn.com/w80/jp.png' },
    'GBP': { ticker: 'GBPUSD=X', type: 'fx', leverageMax: 100, name: 'British Pound', description: 'GBP/USD', pythPriceId: '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1', icon: 'https://flagcdn.com/w80/gb.png' },
    'AUD': { ticker: 'AUDUSD=X', type: 'fx', leverageMax: 100, name: 'Australian Dollar', description: 'AUD/USD', pythPriceId: '0x67a6f93030420c1c9e3fe37c1ab6b77966af82f995944a9fefce357a22854a80', icon: 'https://flagcdn.com/w80/au.png' },
    'CAD': { ticker: 'USDCAD=X', type: 'fx', leverageMax: 100, name: 'Canadian Dollar', description: 'USD/CAD', pythPriceId: '0x3112b03a41c910ed446852aacf67118cb1bec67b2cd0b9a214c58cc0eaa2ecca', icon: 'https://flagcdn.com/w80/ca.png' },
    'CHF': { ticker: 'USDCHF=X', type: 'fx', leverageMax: 100, name: 'Swiss Franc', description: 'USD/CHF', pythPriceId: '0x0b1e3297e69f162877b577b0d6a47a0d63b2392bc8499e6540da4187a63e28f8', icon: 'https://flagcdn.com/w80/ch.png' },
    'NZD': { ticker: 'NZDUSD=X', type: 'fx', leverageMax: 100, name: 'NZ Dollar', description: 'NZD/USD', pythPriceId: '0x92eea8ba1b00078cdc2ef6f64f091f262e8c7d0576ee4677572f314ebfafa4c7', icon: 'https://flagcdn.com/w80/nz.png' },
    'TRY': { ticker: 'USDTRY=X', type: 'fx', leverageMax: 50,  name: 'Lira', description: 'USD/TRY', pythPriceId: '0x8337c786c5821547777780a1e4f89484f3417cb14dd244f2b0a34ea7a554d67', icon: 'https://flagcdn.com/w80/tr.png' },
    'BRL': { ticker: 'USDBRL=X', type: 'fx', leverageMax: 50,  name: 'Real', description: 'USD/BRL', icon: 'https://flagcdn.com/w80/br.png' },
    'MXN': { ticker: 'USDMXN=X', type: 'fx', leverageMax: 50,  name: 'Peso', description: 'USD/MXN', icon: 'https://flagcdn.com/w80/mx.png' },
    'INR': { ticker: 'USDINR=X', type: 'fx', leverageMax: 50,  name: 'Rupee', description: 'USD/INR', icon: 'https://flagcdn.com/w80/in.png' },

    // INDICES
    'SPX': { ticker: '^GSPC', type: 'stock', leverageMax: 100, name: 'S&P 500', description: 'S&P 500 Index', icon: 'https://flagcdn.com/w80/us.png', domain: 'spglobal.com' },
    'NDX': { ticker: '^IXIC', type: 'stock', leverageMax: 100, name: 'Nasdaq 100', description: 'Nasdaq 100 Index', icon: 'https://flagcdn.com/w80/us.png', domain: 'nasdaq.com' },
    'DJI': { ticker: '^DJI', type: 'stock', leverageMax: 100, name: 'Dow Jones', description: 'Dow Jones Industrial Average', icon: 'https://flagcdn.com/w80/us.png', domain: 'spglobal.com' },
    'DAX': { ticker: '^GDAXI', type: 'stock', leverageMax: 100, name: 'DAX', description: 'German DAX Index', icon: 'https://flagcdn.com/w80/de.png', domain: 'boerse-frankfurt.de' },
    'HSI': { ticker: '^HSI', type: 'stock', leverageMax: 100, name: 'Hang Seng', description: 'Hang Seng Index', icon: 'https://flagcdn.com/w80/hk.png', domain: 'hsi.com.hk' },

    // INT STOCKS & CHINA
    'BABA': { ticker: 'BABA', type: 'stock', leverageMax: 20, name: 'Alibaba', description: 'China E-commerce giant', icon: 'https://static.cdnlogo.com/logos/a/8/alibaba.png', domain: 'alibaba.com' },
    'TCEHY': { ticker: 'TCEHY', type: 'stock', leverageMax: 20, name: 'Tencent', description: 'China Social Media & Gaming', icon: 'https://static.cdnlogo.com/logos/t/91/tencent.svg', domain: 'tencent.com' },
    'ASML': { ticker: 'ASML', type: 'stock', leverageMax: 20, name: 'ASML', description: 'Semiconductor Lithography', icon: 'https://static.cdnlogo.com/logos/a/30/asml.svg' },
    'LVMH': { ticker: 'MC.PA', type: 'stock', leverageMax: 20, name: 'LVMH', description: 'Luxury Goods', icon: 'https://static.cdnlogo.com/logos/l/86/lvmh.svg' },
    'SAP': { ticker: 'SAP.DE', type: 'stock', leverageMax: 20, name: 'SAP', description: 'Enterprise Software', icon: 'https://static.cdnlogo.com/logos/s/22/sap.svg' },
    'NVO': { ticker: 'NVO', type: 'stock', leverageMax: 20, name: 'Novo Nordisk', description: 'Pharmaceuticals', icon: 'https://static.cdnlogo.com/logos/n/22/novo-nordisk.svg' },
    'OR.PA': { ticker: 'OR.PA', type: 'stock', leverageMax: 20, name: "L'Oreal", description: 'Consumer Goods', icon: 'https://static.cdnlogo.com/logos/l/5/loreal-paris.svg', domain: 'loreal.com' },
    'SIE.DE': { ticker: 'SIE.DE', type: 'stock', leverageMax: 20, name: 'Siemens', description: 'Industrial Powerhouse', icon: 'https://static.cdnlogo.com/logos/s/1/siemens.svg', domain: 'siemens.com' },
    'AZN': { ticker: 'AZN', type: 'stock', leverageMax: 20, name: 'AstraZeneca', description: 'Pharmaceuticals', icon: 'https://static.cdnlogo.com/logos/a/31/astrazeneca.svg', domain: 'astrazeneca.com' },
    'TTE.PA': { ticker: 'TTE.PA', type: 'stock', leverageMax: 20, name: 'TotalEnergies', description: 'Energy giant', icon: 'https://static.cdnlogo.com/logos/t/61/totalenergies.svg', domain: 'totalenergies.com' },
    'RACE': { ticker: 'RACE', type: 'stock', leverageMax: 20, name: 'Ferrari', description: 'Luxury Automotive', icon: 'https://static.cdnlogo.com/logos/f/61/ferrari.svg', domain: 'ferrari.com' },
    'P911.DE': { ticker: 'P911.DE', type: 'stock', leverageMax: 20, name: 'Porsche', description: 'Automotive', icon: 'https://static.cdnlogo.com/logos/p/6/porsche.svg', domain: 'porsche.com' },
    'HSBC': { ticker: 'HSBC', type: 'stock', leverageMax: 20, name: 'HSBC', description: 'Banking & Finance', icon: 'https://static.cdnlogo.com/logos/h/81/hsbc.svg', domain: 'hsbc.com' },
    'BARC.L': { ticker: 'BARC.L', type: 'stock', leverageMax: 20, name: 'Barclays', description: 'Banking', icon: 'https://static.cdnlogo.com/logos/b/94/barclays.svg', domain: 'barclays.com' },
    '601288.SS': { ticker: '601288.SS', type: 'stock', leverageMax: 20, name: 'Agri Bank of China', description: 'China State Bank', icon: 'https://static.cdnlogo.com/logos/a/83/agricultural-bank-of-china.png', domain: 'abchina.com' },
    '1398.HK': { ticker: '1398.HK', type: 'stock', leverageMax: 20, name: 'ICBC', description: 'China State Bank', icon: 'https://static.cdnlogo.com/logos/i/65/icbc.png', domain: 'icbc-ltd.com' },
    '300750.SZ': { ticker: '300750.SZ', type: 'stock', leverageMax: 20, name: 'CATL', description: 'Battery Manufacturing', icon: 'https://static.cdnlogo.com/logos/c/8/contemporary-amperex-technology.svg', domain: 'catl.com' },
    '0941.HK': { ticker: '0941.HK', type: 'stock', leverageMax: 20, name: 'China Mobile', description: 'Telecommunications', icon: 'https://static.cdnlogo.com/logos/c/96/china-mobile.svg', domain: 'chinamobileltd.com' },
    
    // EXOTIC GLOBAL EQUITIES
    'TM': { ticker: 'TM', type: 'stock', leverageMax: 20, name: 'Toyota', description: 'Automotive giant', icon: 'https://static.cdnlogo.com/logos/t/61/toyota.png', domain: 'toyota.com' },
    'BP': { ticker: 'BP', type: 'stock', leverageMax: 20, name: 'BP', description: 'Energy & Petrochemicals', icon: 'https://static.cdnlogo.com/logos/b/15/bp.png', domain: 'bp.com' },
    'SHEL': { ticker: 'SHEL', type: 'stock', leverageMax: 20, name: 'Shell', description: 'Oil & Gas giant', icon: 'https://static.cdnlogo.com/logos/s/77/shell.png', domain: 'shell.com' },
    'SSNLF': { ticker: 'SSNLF', type: 'stock', leverageMax: 20, name: 'Samsung', description: 'Electronics & Tech', icon: 'https://static.cdnlogo.com/logos/s/23/samsung.png', domain: 'samsung.com' },
    'RELIANCE': { ticker: 'RELIANCE.NS', type: 'stock', leverageMax: 20, name: 'Reliance', description: 'India Conglomerate', icon: 'https://static.cdnlogo.com/logos/r/17/reliance-industries.png', domain: 'ril.com' },
    'ARAMCO': { ticker: '2222.SR', type: 'stock', leverageMax: 20, name: 'Saudi Aramco', description: 'Oil powerhouse', icon: 'https://static.cdnlogo.com/logos/s/17/saudi-aramco.png', domain: 'aramco.com' },
};

export const SYMBOL_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(MARKET_CONFIG).map(([k, v]) => [k, v.ticker])
);

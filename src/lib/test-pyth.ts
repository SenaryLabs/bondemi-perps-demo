
import { fetchPythPrices } from './pyth';

async function test() {
    const testIds = [
        '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD
        '0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593', // NVDA/USD
        '0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec52fabedc1f335d673df0a7c1', // GBP/USD
        '0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2'  // Gold/USD
    ];

    console.log('Testing Pyth Hermes fetch...');
    try {
        const prices = await fetchPythPrices(testIds);
        console.log('Results:', JSON.stringify(prices, null, 2));
        
        if (Object.keys(prices).length > 0) {
            console.log('✅ Pyth Hermes integration successful!');
        } else {
            console.log('❌ Pyth Hermes integration returned no data.');
        }
    } catch (error) {
        console.error('❌ Pyth Hermes integration failed:', error);
    }
}

test();

export async function fetchPythPrices(priceIds: string[]) {
    // Basic validation: must be 64-char hex string (32 bytes)
    const validIds = priceIds.filter(id => 
        id.startsWith('0x') && 
        id.length === 66 && 
        !id.includes('placeholder')
    );

    if (validIds.length === 0) return {};

    const idsParam = validIds.map(id => `ids[]=${id}`).join('&');
    const url = `https://hermes.pyth.network/v2/updates/price/latest?${idsParam}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Pyth Hermes API error: ${response.status}`);
        }

        const data = await response.json();
        const results: Record<string, { price: number; timestamp: number }> = {};

        if (data.parsed) {
            data.parsed.forEach((update: any) => {
                const id = '0x' + update.id;
                const priceData = update.price;
                // Price = price * 10^expo
                const price = Number(priceData.price) * Math.pow(10, priceData.expo);
                results[id] = {
                    price,
                    timestamp: priceData.publish_time
                };
            });
        }

        return results;
    } catch (error) {
        console.error('Error fetching from Pyth Hermes:', error);
        return {};
    }
}

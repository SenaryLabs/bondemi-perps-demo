import { AssetType } from "./market-config";

export interface MarketStatus {
    isOpen: boolean;
    nextOpen?: Date;
    nextClose?: Date;
    message: string;
}

export function getMarketStatus(type: AssetType): MarketStatus {
    if (type === 'crypto') {
        return { isOpen: true, message: '24/7 MARKET' };
    }

    const now = new Date();
    const day = now.getUTCDay(); // 0 = Sun
    const utcHour = now.getUTCHours();
    const utcMin = now.getUTCMinutes();

    // STOCKS: NYSE (9:30 AM - 4:00 PM ET)
    // ET is UTC-5 (Standard) or UTC-4 (DST). 
    // Simplified to UTC-5 for now (EST).
    // Open: 14:30 UTC -> Close: 21:00 UTC
    if (type === 'stock') {
         // Weekend
         if (day === 0 || day === 6) {
             return { isOpen: false, message: 'MARKET CLOSED (WEEKEND)' };
         }

         // Simple UTC-5 logic
         const openHour = 14; 
         const openMin = 30;
         const closeHour = 21;
         const closeMin = 0;

         const currentMinutes = utcHour * 60 + utcMin;
         const openMinutes = openHour * 60 + openMin;
         const closeMinutes = closeHour * 60 + closeMin;

         if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
             return { isOpen: true, message: 'MARKET OPEN' };
         }
         return { isOpen: false, message: 'MARKET CLOSED' };
    }

    // RATES / COMMODITIES / FX (CME/CBOT Approx)
    // Weekdays: Open 23:00 UTC (Sun) to 22:00 UTC (Fri)
    // Daily Break: 22:00 UTC - 23:00 UTC
    
    // 1. Weekend Closure: Friday 22:00 UTC -> Sunday 23:00 UTC
    if (day === 6) { // Saturday (Closed all day)
         const nextOpen = new Date(now);
         nextOpen.setUTCDate(now.getUTCDate() + (day === 6 ? 1 : 0)); // Move to Sunday
         nextOpen.setUTCHours(23, 0, 0, 0);
         return { isOpen: false, nextOpen, message: 'MARKET CLOSED (WEEKEND)' };
    }
    
    if (day === 0 && utcHour < 23) { // Sunday before Open
        const nextOpen = new Date(now);
        nextOpen.setUTCHours(23, 0, 0, 0);
        return { isOpen: false, nextOpen, message: 'MARKET CLOSED (PRE-OPEN)' };
    }

    if (day === 5 && utcHour >= 22) { // Friday After Close
         const nextOpen = new Date(now);
         nextOpen.setUTCDate(now.getUTCDate() + 2); // Move to Sunday
         nextOpen.setUTCHours(23, 0, 0, 0);
         return { isOpen: false, nextOpen, message: 'MARKET CLOSED (WEEKEND)' };
    }

    // 2. Daily Maintenance Break (22:00 - 23:00 UTC) Mon-Thu
    if (utcHour === 22) {
        const nextOpen = new Date(now);
        nextOpen.setUTCHours(23, 0, 0, 0);
        return { isOpen: false, nextOpen, message: 'MARKET BREAK' };
    }

    return { isOpen: true, message: 'MARKET OPEN' };
}

'use client';


import { useEffect, useRef, useState } from 'react';
import { 
    createChart, 
    ColorType, 
    IChartApi, 
    ISeriesApi, 
    CandlestickSeries, 
    AreaSeries, 
    HistogramSeries 
} from 'lightweight-charts';
import { Settings, Maximize2, Camera, BarChart2, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssetType } from '@/lib/market-config';
import { useTheme } from '@/hooks/use-theme';

// Theme Configuration Mapping
const THEME_COLORS = {
    midnight: {
        background: 'transparent',
        textColor: '#94a3b8', // Slate-400
        gridColor: 'rgba(39, 39, 42, 0.2)', // Zinc-800/20
        upColor: '#2dd4bf', // Teal-400
        downColor: '#f43f5e', // Rose-500
        areaTop: 'rgba(45, 212, 191, 0.4)',
        areaLine: '#2dd4bf',
    },
    obsidian: {
        background: 'transparent',
        textColor: '#a1a1aa', // Zinc-400
        gridColor: 'rgba(39, 39, 42, 0.4)', // Zing-800/40
        upColor: '#10b981', // Emerald-500
        downColor: '#e11d48', // Rose-600
        areaTop: 'rgba(255, 255, 255, 0.1)',
        areaLine: '#ffffff',
    },
    terminal: {
        background: 'transparent',
        textColor: '#a8a29e', // Warm Gray
        gridColor: 'rgba(251, 146, 60, 0.1)', // Orange-400/10
        upColor: '#4ade80', // Green-400
        downColor: '#ef4444', // Red-500
        areaTop: 'rgba(249, 115, 22, 0.2)',
        areaLine: '#f97316',
    },
    mindful: {
        background: 'transparent',
        textColor: '#9EB0AA', // Grey Morning
        gridColor: 'rgba(36, 84, 125, 0.2)', // Blueberry Twist/20
        upColor: '#9EB0AA', // Grey Morning
        downColor: '#C1967C', // Maple Sugar
        areaTop: 'rgba(223, 198, 170, 0.2)',
        areaLine: '#DFC6AA',
    },
    lime: {
        background: 'transparent',
        textColor: '#B2A69A', // Deer Run
        gridColor: 'rgba(28, 59, 66, 0.3)', // Royal Neptune/30
        upColor: '#B8E100', // Livid Lime
        downColor: '#B2A69A', // Deer Run (Neutral for Drops)
        areaTop: 'rgba(184, 225, 0, 0.15)', // Lime/15
        areaLine: '#B8E100',
    },
    sunset: {
        background: 'transparent', // Using parent bg
        textColor: '#E8D9CE', // Malted Milk
        gridColor: 'rgba(105, 39, 70, 0.3)', // Witch Soup/30
        upColor: '#FBCA69', // Sunspark
        downColor: '#E45E32', // Red Clay
        areaTop: 'rgba(251, 202, 105, 0.2)', // Sunspark/20
        areaLine: '#FBCA69',
    },
    arctic: {
        background: 'transparent', // Using parent bg (Light)
        textColor: '#1C3B42', // Royal Neptune (Dark Teal for Contrast)
        gridColor: 'rgba(28, 59, 66, 0.1)', // Royal Neptune/10
        upColor: '#1B8188', // Riviera Sea
        downColor: '#E45E32', // Red Clay
        areaTop: 'rgba(27, 129, 136, 0.15)', // Riviera/15
        areaLine: '#1B8188',
    }
};

interface PriceChartProps {
    symbol: string;
    currentPrice: number;
    assetType?: AssetType; 
}

export function PriceChart({ symbol, currentPrice, assetType = 'crypto' }: PriceChartProps) {
    const { theme } = useTheme();
    
    // Resolve 'system' theme to actual theme based on system preference
    const resolvedTheme = theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnight' : 'arctic')
        : theme === 'capital'
        ? 'midnight' // Fallback for 'capital' theme
        : theme;
    
    const colors = THEME_COLORS[resolvedTheme as keyof typeof THEME_COLORS] || THEME_COLORS.midnight;

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick" | "Area"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    
    const [timeframe, setTimeframe] = useState('15m');
    const [chartType, setChartType] = useState<'candles' | 'area'>('candles');
    const [isLoading, setIsLoading] = useState(false);
    const [historyData, setHistoryData] = useState<any[]>([]);

    // Auto-select chart type based on Asset
    useEffect(() => {
        if (assetType === 'rates') setChartType('area');
        else setChartType('candles');
    }, [assetType]);

    // FETCH HISTORY with debouncing to reduce update frequency
    useEffect(() => {
        // Debounce: wait 500ms before fetching to avoid rapid refetches
        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const url = `/api/history?symbol=${symbol}&timeframe=${timeframe}`;
                console.log('Fetching history:', { symbol, timeframe, url });
                
                const res = await fetch(url);
                
                if (!res.ok) {
                    const errorText = await res.text().catch(() => '');
                    let errorData;
                    try {
                        errorData = JSON.parse(errorText);
                    } catch {
                        errorData = { error: errorText };
                    }
                    
                    console.warn(`History API returned ${res.status}:`, errorData);
                    setHistoryData([]);
                    setIsLoading(false);
                    return;
                }
                
                const data = await res.json();
                console.log('History API response:', { 
                    isArray: Array.isArray(data), 
                    length: Array.isArray(data) ? data.length : 0,
                    firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null
                });
                
                if (data && Array.isArray(data)) {
                     let sorted = data.sort((a: any, b: any) => (a.time as number) - (b.time as number));
                     
                     // Scale Data for Rates (x10) to match display - REMOVED
                     // if (assetType === 'rates') {
                     //    sorted = sorted.map(d => ({
                     //        ...d,
                     //        open: d.open * 10,
                     //        high: d.high * 10,
                     //        low: d.low * 10,
                     //        close: d.close * 10,
                     //    }));
                     // }

                     // Filter out invalid/zero data points to prevent "barcode" glitches
                     const validData = sorted.filter((d: any) => 
                        d.open > 0 && d.high > 0 && d.low > 0 && d.close > 0
                     );

                     console.log('Valid history data:', { 
                         originalLength: sorted.length, 
                         validLength: validData.length,
                         firstValid: validData[0],
                         lastValid: validData[validData.length - 1]
                     });

                     setHistoryData(validData);
                } else {
                    // Handle non-array responses gracefully
                    console.warn('History API returned non-array data:', data);
                    setHistoryData([]);
                }
            } catch (error) {
                console.error("Chart History Error:", error);
                setHistoryData([]); // Set empty array on error
            } finally {
                setIsLoading(false);
            }
        }, 1000); // Debounce: wait 1 second before fetching to reduce API calls

        return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or dependency change
    }, [symbol, timeframe, assetType]);

    // INIT CHART (only when container, chartType, assetType, or colors change)
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Ensure we don't have a lingering chart from a previous mount that wasn't cleaned up (rare but possible in dev)
        if (chartRef.current) {
            try {
                chartRef.current.remove();
            } catch (e) {
                // Ignore if already disposed
            }
            chartRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors.background },
                textColor: colors.textColor,
            },
            grid: {
                vertLines: { color: colors.gridColor },
                horzLines: { color: colors.gridColor },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: colors.gridColor,
                rightOffset: assetType === 'crypto' ? 20 : 12,
            },
            rightPriceScale: {
                borderColor: colors.gridColor,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
            },
        });

        chartRef.current = chart;

        // MAIN SERIES
        let mainSeries: ISeriesApi<"Candlestick" | "Area">;

        if (chartType === 'area') {
            mainSeries = chart.addSeries(AreaSeries, {
                topColor: colors.areaTop,
                bottomColor: 'rgba(0, 0, 0, 0)',
                lineColor: colors.areaLine, 
                lineWidth: 2,
            });
        } else {
            mainSeries = chart.addSeries(CandlestickSeries, {
                upColor: colors.upColor,
                downColor: colors.downColor,
                borderVisible: false,
                wickUpColor: colors.upColor,
                wickDownColor: colors.downColor,
            });
        }
        seriesRef.current = mainSeries;

        // VOLUME
        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: '', // Overlay
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });
        volumeSeriesRef.current = volumeSeries;

        // RESIZE HANDLER
        const handleResize = () => {
             if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ 
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight
                });
             }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
        };
    }, [chartType, assetType, colors]); // Only recreate chart when these change

    // UPDATE CHART DATA when historyData changes
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current || !volumeSeriesRef.current || historyData.length === 0) {
            return;
        }

        console.log('Updating chart with data:', { dataLength: historyData.length });

        if (chartType === 'area') {
            const mappedData = historyData.map(d => ({
                time: d.time as number,
                value: d.close,
            }));
            (seriesRef.current as ISeriesApi<"Area">).setData(mappedData);
        } else {
            const mappedData = historyData.map(d => ({
                time: d.time as number,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            }));
            (seriesRef.current as ISeriesApi<"Candlestick">).setData(mappedData);
        }
        
        const volumeData = historyData.map(d => ({
            time: d.time as number,
            value: d.volume || 0,
            color: d.close >= d.open ? colors.upColor + '40' : colors.downColor + '40', // 25% opacity
        }));
        volumeSeriesRef.current.setData(volumeData);
        
        chartRef.current.timeScale().fitContent();
        
        console.log('Chart data updated successfully');
    }, [historyData, chartType, colors]);

    return (
        <div className="flex flex-col h-full bg-card/10 relative group overflow-hidden">
            {/* Toolbar */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                 <div className="flex bg-card/80 backdrop-blur-md rounded-lg border border-border/40 p-0.5 shadow-sm">
                    {['15m', '1H', '4H', '1D'].map(tf => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={cn(
                                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all",
                                timeframe === tf 
                                    ? "bg-muted text-foreground shadow-sm" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                            )}
                        >
                            {tf}
                        </button>
                    ))}
                 </div>
                 
                 {/* Type Indicator */}
                 <div className="flex bg-card/80 backdrop-blur-md rounded-lg border border-border/40 p-1.5 shadow-sm text-muted-foreground">
                    {chartType === 'area' ? <Activity size={14} /> : <BarChart2 size={14} />}
                 </div>
            </div>

            {/* Loading */}
            {isLoading && (
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/20 backdrop-blur-[1px]">
                     <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                 </div>
            )}

            <div ref={chartContainerRef} className="w-full h-full relative" />
        </div>
    );
}

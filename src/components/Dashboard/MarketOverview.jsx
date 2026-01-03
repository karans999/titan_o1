/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";



const MarketOverview = () => {
    const [surfaceData, setSurfaceData] = useState(null);
    const [symbol] = useState('SPY');
    const [probs, setProbs] = useState({ low: 55, med: 40, high: 6 });

    // Fetch Live Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use relative path for deployment compatibility
                // Vite proxy (dev) or express static (prod) will handle routing
                const response = await fetch(`/api/market/surface/${symbol}`);
                if (!response.ok) throw new Error('Failed to fetch backend data');
                const data = await response.json();
                setSurfaceData(data.surface);
                if (data.probabilities) setProbs(data.probabilities);
            } catch (err) {
                console.error("Fetch error:", err);
                // Fallback to mock data on error is handled by plotData check
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000); // Poll every 2 seconds
        return () => clearInterval(interval);
    }, [symbol]);

    // Fallback Mock Data for Initial Load or Error
    const mockZData = useMemo(() => {
        const z = [];
        const size = 20;
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                const val = 10 + Math.pow(i - size / 2, 2) * 0.1 + Math.pow(j - size / 2, 2) * 0.1 + Math.random() * 2;
                row.push(val);
            }
            z.push(row);
        }
        return z;
    }, []);

    const plotData = surfaceData ? {
        z: surfaceData.z,
        x: surfaceData.x,
        y: surfaceData.y,
    } : {
        z: mockZData
    };

    return (
        <div className="flex flex-col h-full space-y-4 bg-black overflow-hidden relative p-4">

            {/* Top Text Overlay */}
            <div className="text-center z-10">
                <p className="text-gray-400 text-sm font-mono mb-1">
                    P(Low)={probs.low}% P(Med)={probs.med}% P(High)={probs.high}%
                </p>
                <h1 className="text-3xl text-white font-sans tracking-tight">
                    POV: Citadel Quant “titan_o.1” Demo
                </h1>
            </div>

            {/* 3D Surface Plot */}
            <div className="flex-1 min-h-[400px] w-full relative">
                <div className="absolute inset-0">
                    <Plot
                        data={[
                            {
                                type: 'surface',
                                ...plotData,
                                contours: {
                                    z: {
                                        show: true,
                                        usecolormap: true,
                                        highlightcolor: "#42f462",
                                        project: { z: true }
                                    }
                                },
                                colorscale: 'Jet',
                            }
                        ]}
                        layout={{
                            autosize: true,
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            title: '',
                            margin: { l: 0, r: 0, b: 0, t: 0 },
                            scene: {
                                xaxis: { title: 'Time to Expiry (years)', color: 'white' },
                                yaxis: { title: 'Moneyness (K/S)', color: 'white' },
                                zaxis: { title: 'Implied Vol (%)', color: 'white' },
                                camera: {
                                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                                }
                            },
                            showlegend: false,
                        }}
                        style={{ width: '100%', height: '100%' }}
                        useResizeHandler={true}
                        config={{ displayModeBar: false }}
                    />
                </div>
                {/* Floating Labels (Simulated based on image) */}
                <div className="absolute top-10 left-10 text-white/50 text-xs font-mono pointer-events-none">
                    50
                </div>
            </div>

            {/* Middle Section: Week Info */}
            <div className="text-center py-2">
                <p className="text-white text-xs font-mono uppercase tracking-widest">Live Market Data | TradingView</p>
            </div>

            {/* Bottom: TradingView Integration */}
            <div className="h-[300px] w-full bg-black/50 border-t border-white/10 pt-1 relative z-0">
                <AdvancedRealTimeChart
                    theme="dark"
                    symbol={symbol}
                    autosize
                    hide_side_toolbar={false}
                    interval="D"
                    timezone="Etc/UTC"
                    style="1"
                    locale="en"
                    toolbar_bg="#f1f3f6"
                    enable_publishing={false}
                    withdateranges={true}
                    hide_top_toolbar={false}
                    allow_symbol_change={true}
                    container_id="tradingview_chart"
                />
            </div>

        </div>
    );
};

export default MarketOverview;

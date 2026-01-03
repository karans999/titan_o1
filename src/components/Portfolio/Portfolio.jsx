import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { Shield, Target, AlertTriangle, TrendingUp, DollarSign, Percent, RefreshCw, Plus, Minus } from 'lucide-react';

const initialAllocation = [
    { name: 'Equities (US)', value: 45, color: '#3b82f6', target: 40 },
    { name: 'Fixed Income', value: 20, color: '#737373', target: 25 },
    { name: 'Crypto Alpha', value: 15, color: '#00ff9d', target: 20 },
    { name: 'Commodities', value: 10, color: '#f59e0b', target: 10 },
    { name: 'Cash', value: 10, color: '#404040', target: 5 },
];

const riskData = [
    { subject: 'Volatility', A: 120, B: 110, fullMark: 150 },
    { subject: 'Sharpe', A: 98, B: 130, fullMark: 150 },
    { subject: 'Drawdown', A: 86, B: 130, fullMark: 150 },
    { subject: 'Beta', A: 99, B: 100, fullMark: 150 },
    { subject: 'Alpha', A: 85, B: 90, fullMark: 150 },
    { subject: 'Liquidity', A: 65, B: 85, fullMark: 150 },
];

const transactions = [
    { id: 1, type: 'buy', asset: 'Crypto Alpha', amount: 5000, date: '2024-01-03', status: 'completed' },
    { id: 2, type: 'sell', asset: 'Cash', amount: 2500, date: '2024-01-02', status: 'completed' },
    { id: 3, type: 'rebalance', asset: 'Full Portfolio', amount: 0, date: '2024-01-01', status: 'completed' },
];

const Portfolio = () => {
    const [allocation, setAllocation] = useState(initialAllocation);
    const [totalValue] = useState(1000000);
    const [isRebalancing, setIsRebalancing] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);

    const handleAllocationChange = (index, delta) => {
        setAllocation(prev => {
            const newAlloc = [...prev];
            const newValue = Math.max(0, Math.min(100, newAlloc[index].value + delta));
            const diff = newValue - newAlloc[index].value;
            newAlloc[index].value = newValue;

            // Distribute the difference to other assets proportionally
            const othersTotal = newAlloc.reduce((sum, item, i) => i === index ? sum : sum + item.value, 0);
            if (othersTotal > 0) {
                newAlloc.forEach((item, i) => {
                    if (i !== index) {
                        item.value = Math.max(0, item.value - (diff * (item.value / othersTotal)));
                    }
                });
            }

            // Normalize to 100%
            const total = newAlloc.reduce((sum, item) => sum + item.value, 0);
            newAlloc.forEach(item => item.value = Math.round((item.value / total) * 100));

            return newAlloc;
        });
    };

    const applyTargetAllocation = (prev) => prev.map(item => ({ ...item, value: item.target }));

    const executeRebalance = () => {
        setIsRebalancing(true);
        setTimeout(() => {
            setAllocation(applyTargetAllocation);
            setIsRebalancing(false);
        }, 2000);
    };

    const totalDeviation = allocation.reduce((sum, item) => sum + Math.abs(item.value - item.target), 0);

    const getDeviationColor = () => {
        if (totalDeviation > 10) return 'text-obsidian-accent';
        if (totalDeviation > 0) return 'text-obsidian-secondary';
        return 'text-obsidian-success';
    };

    const pieData = allocation.map(item => ({ ...item, dollarValue: (item.value / 100) * totalValue }));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-obsidian-border/50 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Portfolio Allocation</h2>
                    <p className="text-obsidian-muted text-sm mt-1">Interactive portfolio management • Total: ${totalValue.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowTransactions(!showTransactions)}
                        className={`px-3 py-2 rounded text-sm border transition-colors ${showTransactions ? 'bg-obsidian-primary/10 border-obsidian-primary/30 text-obsidian-primary' : 'bg-obsidian-surface border-obsidian-border text-obsidian-muted hover:text-white'}`}
                    >
                        History
                    </button>
                    <button
                        onClick={executeRebalance}
                        disabled={isRebalancing || totalDeviation === 0}
                        className={`flex items-center px-4 py-2 rounded text-sm font-medium transition-all ${(() => {
                            if (isRebalancing) return 'bg-obsidian-secondary/20 text-obsidian-secondary border border-obsidian-secondary/30';
                            if (totalDeviation > 0) return 'bg-obsidian-primary/10 text-obsidian-primary border border-obsidian-primary/30 hover:bg-obsidian-primary/20';
                            return 'bg-obsidian-surface text-obsidian-muted border border-obsidian-border cursor-not-allowed';
                        })()
                            }`}
                    >
                        {isRebalancing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Rebalancing...</> : <><Target className="w-4 h-4 mr-2" /> Auto Rebalance</>}
                    </button>
                </div>
            </div>

            {/* Transactions Panel */}
            {showTransactions && (
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Recent Transactions</h3>
                    <div className="space-y-2">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-obsidian-border/30 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${{ buy: 'bg-obsidian-success/10', sell: 'bg-obsidian-danger/10', rebalance: 'bg-obsidian-primary/10' }[tx.type] || 'bg-obsidian-primary/10'}`}>
                                        {{ buy: <Plus className="w-4 h-4 text-obsidian-success" />, sell: <Minus className="w-4 h-4 text-obsidian-danger" />, rebalance: <RefreshCw className="w-4 h-4 text-obsidian-primary" /> }[tx.type] || <RefreshCw className="w-4 h-4 text-obsidian-primary" />}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm capitalize">{tx.type} {tx.asset}</p>
                                        <p className="text-obsidian-muted text-xs">{tx.date}</p>
                                    </div>
                                </div>
                                {tx.amount > 0 && <span className={`font-mono text-sm ${tx.type === 'buy' ? 'text-obsidian-success' : 'text-obsidian-danger'}`}>{tx.type === 'buy' ? '+' : '-'}${tx.amount.toLocaleString()}</span>}
                                <span className="text-xs px-2 py-1 bg-obsidian-success/10 text-obsidian-success rounded">{tx.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-4">
                    <div className="flex items-center text-obsidian-muted mb-2"><DollarSign className="w-4 h-4 mr-2" /> Total Value</div>
                    <p className="text-2xl font-bold text-white">${(totalValue / 1000000).toFixed(2)}M</p>
                </div>
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-4">
                    <div className="flex items-center text-obsidian-muted mb-2"><TrendingUp className="w-4 h-4 mr-2" /> YTD Return</div>
                    <p className="text-2xl font-bold text-obsidian-success">+12.4%</p>
                </div>
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-4">
                    <div className="flex items-center text-obsidian-muted mb-2"><Percent className="w-4 h-4 mr-2" /> Deviation</div>
                    <p className={`text-2xl font-bold ${getDeviationColor()}`}>{totalDeviation}%</p>
                </div>
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-4">
                    <div className="flex items-center text-obsidian-muted mb-2"><Shield className="w-4 h-4 mr-2" /> Risk Score</div>
                    <p className="text-2xl font-bold text-white">B+</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Interactive Allocation Editor */}
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Allocation Editor</h3>
                    <div className="space-y-4">
                        {allocation.map((item, index) => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-white text-sm">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAllocationChange(index, -5)}
                                            className="w-6 h-6 rounded bg-obsidian-bg border border-obsidian-border text-obsidian-muted hover:text-white hover:border-obsidian-primary flex items-center justify-center"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-white font-mono w-12 text-center">{item.value}%</span>
                                        <button
                                            onClick={() => handleAllocationChange(index, 5)}
                                            className="w-6 h-6 rounded bg-obsidian-bg border border-obsidian-border text-obsidian-muted hover:text-white hover:border-obsidian-primary flex items-center justify-center"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-obsidian-bg rounded-full overflow-hidden">
                                        <div className="h-full transition-all duration-300" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                                    </div>
                                    <span className="text-obsidian-muted text-xs w-16">Target: {item.target}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6 flex flex-col items-center justify-center relative">
                    <h3 className="absolute top-6 left-6 text-lg font-medium text-white">Asset Distribution</h3>
                    <div className="h-[300px] w-full mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#161616', borderColor: '#262626', color: '#ededed' }}
                                    formatter={(value, name, props) => [`$${props.payload.dollarValue.toLocaleString()} (${value}%)`, name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Radar */}
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-white mb-6">Risk Profile</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
                                <PolarGrid stroke="#262626" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Titan" dataKey="B" stroke="#00ff9d" strokeWidth={2} fill="#00ff9d" fillOpacity={0.1} />
                                <Radar name="Market" dataKey="A" stroke="#737373" strokeWidth={1} fill="#737373" fillOpacity={0.1} />
                                <Tooltip contentStyle={{ backgroundColor: '#161616', borderColor: '#262626' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-5">
                    <div className="flex items-start">
                        <Target className="w-6 h-6 text-obsidian-primary mt-1 mr-3" />
                        <div>
                            <h4 className="text-white font-bold">Rebalance Suggestion</h4>
                            <p className="text-xs text-obsidian-muted mt-1">Reduce Cash by 5%, increase Crypto Alpha to match model targets.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-5">
                    <div className="flex items-start">
                        <Shield className="w-6 h-6 text-obsidian-secondary mt-1 mr-3" />
                        <div>
                            <h4 className="text-white font-bold">Hedge Protection</h4>
                            <p className="text-xs text-obsidian-muted mt-1">Consider SPX Puts (Delta -0.30) for downside protection.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-5">
                    <div className="flex items-start">
                        <AlertTriangle className="w-6 h-6 text-obsidian-accent mt-1 mr-3" />
                        <div>
                            <h4 className="text-white font-bold">Correlation Alert</h4>
                            <p className="text-xs text-obsidian-muted mt-1">Commodities and Crypto showing 0.89 correlation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;

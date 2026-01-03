import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Lock, ChevronUp, ChevronDown, X } from 'lucide-react';

const initialResearchData = [
    { id: 1, symbol: 'TITAN-A1', type: 'Equity-L/S', signal: 'Strong Buy', confidence: 98, return: 14.2, risk: 'Low' },
    { id: 2, symbol: 'TITAN-X9', type: 'Macro-Global', signal: 'Neutral', confidence: 65, return: 4.1, risk: 'Med' },
    { id: 3, symbol: 'OBSIDIAN-Prime', type: 'Crypto-Arb', signal: 'Buy', confidence: 88, return: 24.5, risk: 'High' },
    { id: 4, symbol: 'VANGUARD-Flow', type: 'Fixed Income', signal: 'Sell', confidence: 92, return: -2.3, risk: 'Low' },
    { id: 5, symbol: 'ALGO-Delta', type: 'Derivatives', signal: 'Strong Buy', confidence: 95, return: 18.9, risk: 'Med' },
    { id: 6, symbol: 'QUANT-Z', type: 'FX-HFT', signal: 'Hold', confidence: 50, return: 0.5, risk: 'Low' },
    { id: 7, symbol: 'DEEP-Value', type: 'Equity-Long', signal: 'Sell', confidence: 82, return: -5.6, risk: 'Med' },
    { id: 8, symbol: 'YIELD-Max', type: 'DeFi-Yield', signal: 'Buy', confidence: 76, return: 12.4, risk: 'High' },
    { id: 9, symbol: 'MOMENTUM-Pro', type: 'Equity-Momentum', signal: 'Strong Buy', confidence: 91, return: 22.1, risk: 'High' },
    { id: 10, symbol: 'BOND-Shield', type: 'Fixed Income', signal: 'Buy', confidence: 85, return: 3.2, risk: 'Low' },
];

const getSignalStyle = (signal) => {
    if (signal === 'Strong Buy' || signal === 'Buy') return 'bg-obsidian-success/10 text-obsidian-success border-obsidian-success/20';
    if (signal === 'Sell') return 'bg-obsidian-danger/10 text-obsidian-danger border-obsidian-danger/20';
    return 'bg-obsidian-muted/10 text-obsidian-muted border-obsidian-muted/20';
};

const Research = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'confidence', direction: 'desc' });
    const [filterRisk, setFilterRisk] = useState('all');
    const [filterSignal, setFilterSignal] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let data = [...initialResearchData];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.symbol.toLowerCase().includes(query) ||
                item.type.toLowerCase().includes(query) ||
                item.signal.toLowerCase().includes(query)
            );
        }

        // Risk filter
        if (filterRisk !== 'all') {
            data = data.filter(item => item.risk === filterRisk);
        }

        // Signal filter
        if (filterSignal !== 'all') {
            data = data.filter(item => item.signal === filterSignal);
        }

        // Sorting
        if (sortConfig.key) {
            data.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [searchQuery, sortConfig, filterRisk, filterSignal]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const exportCSV = () => {
        const headers = ['Symbol', 'Type', 'Signal', 'Confidence', 'Return', 'Risk'];
        const rows = filteredData.map(item => [
            item.symbol, item.type, item.signal, item.confidence, `${item.return}%`, item.risk
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `titan_research_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronUp className="w-3 h-3 opacity-30" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="w-3 h-3 text-obsidian-primary" />
            : <ChevronDown className="w-3 h-3 text-obsidian-primary" />;
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterRisk('all');
        setFilterSignal('all');
    };

    const hasActiveFilters = searchQuery || filterRisk !== 'all' || filterSignal !== 'all';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-obsidian-border/50 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Research Terminal</h2>
                    <p className="text-obsidian-muted text-sm mt-1">
                        Proprietary Model Signals • {filteredData.length} of {initialResearchData.length} models
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center px-3 py-2 border rounded text-sm transition-colors ${showFilters || hasActiveFilters
                            ? 'bg-obsidian-primary/10 border-obsidian-primary/30 text-obsidian-primary'
                            : 'bg-obsidian-surface border-obsidian-border text-obsidian-muted hover:text-white'
                            }`}
                    >
                        <Filter className="w-4 h-4 mr-2" /> Filter
                        {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-obsidian-primary rounded-full"></span>}
                    </button>
                    <button
                        onClick={exportCSV}
                        className="flex items-center px-3 py-2 bg-obsidian-primary/10 border border-obsidian-primary/30 rounded text-sm text-obsidian-primary hover:bg-obsidian-primary/20 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-obsidian-muted w-5 h-5" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search models, symbols, or strategies..."
                    className="w-full bg-obsidian-surface border border-obsidian-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-obsidian-primary transition-colors"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-muted hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-obsidian-muted text-sm">Risk:</span>
                        <select
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                            className="bg-obsidian-bg border border-obsidian-border rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-obsidian-primary"
                        >
                            <option value="all">All</option>
                            <option value="Low">Low</option>
                            <option value="Med">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-obsidian-muted text-sm">Signal:</span>
                        <select
                            value={filterSignal}
                            onChange={(e) => setFilterSignal(e.target.value)}
                            className="bg-obsidian-bg border border-obsidian-border rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-obsidian-primary"
                        >
                            <option value="all">All</option>
                            <option value="Strong Buy">Strong Buy</option>
                            <option value="Buy">Buy</option>
                            <option value="Neutral">Neutral</option>
                            <option value="Hold">Hold</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="ml-auto text-obsidian-muted hover:text-white text-sm flex items-center">
                            <X className="w-4 h-4 mr-1" /> Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Data Grid */}
            <div className="bg-obsidian-surface border border-obsidian-border rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-obsidian-bg border-b border-obsidian-border">
                        <tr>
                            <th onClick={() => handleSort('symbol')} className="px-6 py-4 text-xs font-mono text-obsidian-muted uppercase tracking-wider cursor-pointer hover:text-white">
                                <div className="flex items-center gap-1">Model Name <SortIcon column="symbol" /></div>
                            </th>
                            <th className="px-6 py-4 text-xs font-mono text-obsidian-muted uppercase tracking-wider">Strategy Type</th>
                            <th onClick={() => handleSort('signal')} className="px-6 py-4 text-xs font-mono text-obsidian-muted uppercase tracking-wider cursor-pointer hover:text-white">
                                <div className="flex items-center gap-1">Signal <SortIcon column="signal" /></div>
                            </th>
                            <th onClick={() => handleSort('confidence')} className="px-6 py-4 text-xs font-mono text-obsidian-muted uppercase tracking-wider cursor-pointer hover:text-white">
                                <div className="flex items-center gap-1">Confidence <SortIcon column="confidence" /></div>
                            </th>
                            <th onClick={() => handleSort('return')} className="px-6 py-4 text-xs font-mono text-obsidian-muted uppercase tracking-wider text-right cursor-pointer hover:text-white">
                                <div className="flex items-center justify-end gap-1">Proj. Return <SortIcon column="return" /></div>
                            </th>
                            <th onClick={() => handleSort('risk')} className="px-6 py-4 text-xs font-mono text-obsidian-muted uppercase tracking-wider cursor-pointer hover:text-white">
                                <div className="flex items-center gap-1">Risk Level <SortIcon column="risk" /></div>
                            </th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-obsidian-border/30">
                        {filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-obsidian-surfaceHighlight/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="font-medium text-white group-hover:text-obsidian-primary transition-colors">{item.symbol}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-obsidian-muted">{item.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getSignalStyle(item.signal)}`}>
                                        {item.signal}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-24 h-1.5 bg-obsidian-bg rounded-full overflow-hidden mr-3">
                                            <div className="h-full bg-gradient-to-r from-obsidian-secondary to-obsidian-primary" style={{ width: `${item.confidence}%` }}></div>
                                        </div>
                                        <span className="text-xs text-white">{item.confidence}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`font-mono text-sm ${item.return < 0 ? 'text-obsidian-danger' : 'text-obsidian-success'}`}>
                                        {item.return > 0 ? '+' : ''}{item.return}%
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm ${{ High: 'text-obsidian-accent', Med: 'text-obsidian-secondary', Low: 'text-white' }[item.risk] || 'text-white'
                                        }`}>
                                        {item.risk}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-obsidian-muted hover:text-white transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-obsidian-muted">
                                    No models match your search criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Research;

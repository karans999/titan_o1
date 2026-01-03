import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, User, Save, RefreshCw, Key, Globe, Moon, Sun } from 'lucide-react';

const Settings = () => {
    const [notifications, setNotifications] = useState({
        tradingAlerts: true,
        portfolioUpdates: true,
        riskWarnings: true,
        marketNews: false,
        emailDigest: true
    });

    const [preferences, setPreferences] = useState({
        theme: 'dark',
        refreshRate: '2',
        defaultSymbol: 'SPY',
        riskTolerance: 'moderate'
    });

    const [apiKeys, setApiKeys] = useState({
        tradingView: '••••••••••••',
        alphaVantage: '',
        polygonIo: ''
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // In a real app, this would persist to backend/localStorage
        localStorage.setItem('titan_settings', JSON.stringify({ notifications, preferences, apiKeys }));
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-obsidian-border/50 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
                    <p className="text-obsidian-muted text-sm mt-1">Configure your Titan_o.1 experience</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center px-4 py-2 rounded text-sm font-medium transition-all ${saved
                            ? 'bg-obsidian-success/20 text-obsidian-success border border-obsidian-success/30'
                            : 'bg-obsidian-primary/10 text-obsidian-primary border border-obsidian-primary/30 hover:bg-obsidian-primary/20'
                        }`}
                >
                    {saved ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saved!</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </button>
            </div>

            {/* Appearance Section */}
            <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <Palette className="w-5 h-5 text-obsidian-primary mr-3" />
                    <h3 className="text-lg font-medium text-white">Appearance</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white text-sm font-medium">Theme</p>
                            <p className="text-obsidian-muted text-xs">Choose your preferred color scheme</p>
                        </div>
                        <div className="flex bg-obsidian-bg rounded-lg p-1">
                            <button
                                onClick={() => setPreferences(p => ({ ...p, theme: 'dark' }))}
                                className={`flex items-center px-3 py-2 rounded text-sm transition-all ${preferences.theme === 'dark' ? 'bg-obsidian-primary/20 text-obsidian-primary' : 'text-obsidian-muted hover:text-white'}`}
                            >
                                <Moon className="w-4 h-4 mr-2" /> Dark
                            </button>
                            <button
                                onClick={() => setPreferences(p => ({ ...p, theme: 'light' }))}
                                className={`flex items-center px-3 py-2 rounded text-sm transition-all ${preferences.theme === 'light' ? 'bg-obsidian-primary/20 text-obsidian-primary' : 'text-obsidian-muted hover:text-white'}`}
                            >
                                <Sun className="w-4 h-4 mr-2" /> Light
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white text-sm font-medium">Data Refresh Rate</p>
                            <p className="text-obsidian-muted text-xs">How often to poll for new market data</p>
                        </div>
                        <select
                            value={preferences.refreshRate}
                            onChange={(e) => setPreferences(p => ({ ...p, refreshRate: e.target.value }))}
                            className="bg-obsidian-bg border border-obsidian-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-obsidian-primary"
                        >
                            <option value="1">1 second</option>
                            <option value="2">2 seconds</option>
                            <option value="5">5 seconds</option>
                            <option value="10">10 seconds</option>
                            <option value="30">30 seconds</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Trading Preferences */}
            <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <Database className="w-5 h-5 text-obsidian-secondary mr-3" />
                    <h3 className="text-lg font-medium text-white">Trading Preferences</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">Default Symbol</label>
                        <input
                            type="text"
                            value={preferences.defaultSymbol}
                            onChange={(e) => setPreferences(p => ({ ...p, defaultSymbol: e.target.value.toUpperCase() }))}
                            className="w-full bg-obsidian-bg border border-obsidian-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-obsidian-primary"
                            placeholder="SPY"
                        />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">Risk Tolerance</label>
                        <select
                            value={preferences.riskTolerance}
                            onChange={(e) => setPreferences(p => ({ ...p, riskTolerance: e.target.value }))}
                            className="w-full bg-obsidian-bg border border-obsidian-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-obsidian-primary"
                        >
                            <option value="conservative">Conservative</option>
                            <option value="moderate">Moderate</option>
                            <option value="aggressive">Aggressive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <Bell className="w-5 h-5 text-obsidian-accent mr-3" />
                    <h3 className="text-lg font-medium text-white">Notifications</h3>
                </div>
                <div className="space-y-3">
                    {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2">
                            <span className="text-white text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <button
                                onClick={() => handleNotificationChange(key)}
                                className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-obsidian-primary' : 'bg-obsidian-border'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* API Keys */}
            <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <Key className="w-5 h-5 text-obsidian-danger mr-3" />
                    <h3 className="text-lg font-medium text-white">API Integrations</h3>
                </div>
                <div className="space-y-4">
                    {Object.entries(apiKeys).map(([key, value]) => (
                        <div key={key}>
                            <label className="block text-white text-sm font-medium mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input
                                type="password"
                                value={value}
                                onChange={(e) => setApiKeys(prev => ({ ...prev, [key]: e.target.value }))}
                                className="w-full bg-obsidian-bg border border-obsidian-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-obsidian-primary"
                                placeholder="Enter API key..."
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-obsidian-surface border border-obsidian-border rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-obsidian-success mr-3" />
                    <h3 className="text-lg font-medium text-white">Account</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Titan_o.1 Pro License</p>
                        <p className="text-obsidian-muted text-sm">Institutional Access • Unlimited API Calls</p>
                    </div>
                    <span className="px-3 py-1 bg-obsidian-success/10 text-obsidian-success text-xs font-bold rounded border border-obsidian-success/30">ACTIVE</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;

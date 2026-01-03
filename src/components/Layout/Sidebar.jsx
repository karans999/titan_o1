import React from 'react';
import { LayoutDashboard, PieChart, LineChart, Settings, Hexagon } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Market Overview', id: 'dashboard' },
        { icon: PieChart, label: 'Portfolio', id: 'portfolio' },
        { icon: LineChart, label: 'Research', id: 'research' },
        { icon: Settings, label: 'Settings', id: 'settings' },
    ];

    return (
        <div className="w-64 h-full bg-obsidian-surface border-r border-obsidian-border flex flex-col z-20">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-obsidian-border/50">
                <Hexagon className="w-6 h-6 text-obsidian-primary mr-3 fill-obsidian-primary/20" />
                <h1 className="font-mono text-lg font-bold tracking-wider text-white">
                    TITAN<span className="text-obsidian-primary text-xs ml-1">o.1</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab?.(item.id)}
                        className={`w-full flex items-center px-3 py-2.5 rounded-md transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-obsidian-surfaceHighlight text-obsidian-primary border-l-2 border-obsidian-primary shadow-[0_0_15px_rgba(0,255,157,0.1)]'
                            : 'text-obsidian-muted hover:text-white hover:bg-obsidian-surfaceHighlight/50 border-l-2 border-transparent'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 mr-3 transition-colors ${activeTab === item.id ? 'text-obsidian-primary' : 'group-hover:text-white'}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-obsidian-border/50">
                <div className="flex items-center space-x-3 px-2 py-2 rounded bg-obsidian-bg/50 border border-obsidian-border/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-obsidian-primary to-obsidian-secondary flex items-center justify-center text-xs font-bold text-black border border-white/10 shadow-lg">
                        K
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-medium text-white truncate">Karan (User)</p>
                        <p className="text-[10px] text-obsidian-muted truncate">Obsidian Series</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

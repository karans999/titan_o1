import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, sidebarProps }) => {
    return (
        <div className="flex h-screen w-full bg-obsidian-bg overflow-hidden text-obsidian-text font-sans">
            <Sidebar {...sidebarProps} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Background ambient glow effect */}
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-obsidian-primary/5 to-transparent pointer-events-none z-0" />

                <div className="flex-1 overflow-y-auto p-6 z-10 relative scrollbar-thin scrollbar-thumb-obsidian-border scrollbar-track-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;

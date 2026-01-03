import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import MarketOverview from './components/Dashboard/MarketOverview';
import Portfolio from './components/Portfolio/Portfolio';
import Research from './components/Research/Research';
import Settings from './components/Settings/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MarketOverview />;
      case 'portfolio':
        return <Portfolio />;
      case 'research':
        return <Research />;
      case 'settings':
        return <Settings />;
      default:
        return <MarketOverview />;
    }
  };

  return (
    <Layout sidebarProps={{ activeTab, setActiveTab }}>
      {renderContent()}
    </Layout>
  );
}

export default App;

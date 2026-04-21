import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import Dashboard from './components/Dashboard';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopNavigation />
          <Dashboard />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracker';
import CopingToolkit from './pages/CopingToolkit';
import Resources from './pages/Resources';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'chat':
        return <Chat setActiveTab={setActiveTab} />;
      case 'mood':
        return <MoodTracker setActiveTab={setActiveTab} />;
      case 'coping':
        return <CopingToolkit setActiveTab={setActiveTab} />;
      case 'resources':
        return <Resources setActiveTab={setActiveTab} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

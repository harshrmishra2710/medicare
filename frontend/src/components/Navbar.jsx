import React from 'react';
import { Heart, MessageSquare, Smile, Compass, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'mood', label: 'Mood Tracker', icon: Smile },
    { id: 'coping', label: 'Coping Toolkit', icon: Compass },
    { id: 'resources', label: 'Helplines & Resources', icon: BookOpen }
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-logo" onClick={() => setActiveTab('home')}>
          <div className="brand-icon">
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <span className="brand-title">MindCare AI</span>
            <span className="brand-badge">PBL Project</span>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    className={isActive ? 'active' : ''}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

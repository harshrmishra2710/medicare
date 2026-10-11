import React from 'react';
import { MessageSquare, Smile, Compass, BookOpen, ShieldAlert, Sparkles } from 'lucide-react';

export default function Home({ setActiveTab }) {
  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>AI-Powered Mental Health Support</span>
        </div>
        <h1 className="hero-title">
          Compassionate Mental Health Support, Right When You Need It.
        </h1>
        <p className="hero-subtitle">
          MindCare AI is a simple, confidential emotional support companion designed to help you manage stress, track daily moods, and practice evidence-based coping exercises.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setActiveTab('chat')}>
            <MessageSquare size={18} />
            <span>Start AI Support Chat</span>
          </button>
          <button className="btn-secondary" onClick={() => setActiveTab('coping')}>
            <Compass size={18} />
            <span>Try Personal Coping Toolkit</span>
          </button>
        </div>
      </section>

      {/* Emergency Quick Alert Banner */}
      <div 
        style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px', borderRadius: '50%', flexShrink: 0 }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <strong style={{ color: '#991b1b', fontSize: '0.98rem' }}>In Crisis or Need Immediate Help?</strong>
            <p style={{ color: '#7f1d1d', fontSize: '0.88rem', marginTop: 2 }}>
              Free 24/7 Tele-MANAS Helpline (India): <strong>14416</strong> or <strong>1800-891-4416</strong> | KIRAN: <strong>1800-599-0019</strong> | US: <strong>988</strong>
            </p>
          </div>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => setActiveTab('resources')}
          style={{ borderColor: '#fca5a5', color: '#991b1b', fontSize: '0.85rem', padding: '8px 14px' }}
        >
          View All Helplines →
        </button>
      </div>

      {/* Core Features Grid */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Explore MindCare AI Features</h2>
      <div className="feature-grid">
        <div className="feature-card" onClick={() => setActiveTab('chat')}>
          <div className="feature-icon">
            <MessageSquare size={24} />
          </div>
          <h3>AI Chatbot Support</h3>
          <p>Talk with our supportive AI assistant for empathy, stress reflection, and calming guidance.</p>
        </div>

        <div className="feature-card" onClick={() => setActiveTab('mood')}>
          <div className="feature-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Smile size={24} />
          </div>
          <h3>Mood Tracker</h3>
          <p>Log your daily emotional state with short notes and monitor your emotional patterns over time.</p>
        </div>

        <div className="feature-card" onClick={() => setActiveTab('coping')}>
          <div className="feature-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Compass size={24} />
          </div>
          <h3>Personal Coping Toolkit</h3>
          <p>Guided step-by-step relaxation, breathing, grounding, and journaling exercises with interactive timer.</p>
        </div>

        <div className="feature-card" onClick={() => setActiveTab('resources')}>
          <div className="feature-icon" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <BookOpen size={24} />
          </div>
          <h3>Verified Helplines</h3>
          <p>Access 24/7 emergency helplines, Tele-MANAS, KIRAN, global crisis lines, and professional guides.</p>
        </div>
      </div>
    </div>
  );
}

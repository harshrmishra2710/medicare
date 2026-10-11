import React, { useState, useEffect, useRef } from 'react';
import { Compass, Clock, Play, Pause, RotateCcw, Bookmark, BookmarkCheck, Search, RefreshCw, Sparkles, Brain, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import fallbackActivities from '../data/seedActivities';
import { apiUrl } from '../utils/api';

export default function CopingToolkit() {
  const [activities, setActivities] = useState(fallbackActivities);
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(fallbackActivities[0]);
  const [favorites, setFavorites] = useState([]);

  // AI Coping Plan state
  const [aiSituation, setAiSituation] = useState('');
  const [aiTime, setAiTime] = useState(5);
  const [aiMood, setAiMood] = useState('');
  const [aiPlan, setAiPlan] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiIsCrisis, setAiIsCrisis] = useState(false);
  const planRef = useRef(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(120); // in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Fetch activities from backend (with local seed fallback)
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch(apiUrl('/api/activities'));
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setActivities(data.data);
          setSelectedActivity(data.data[0]);
          setTimeLeft(data.data[0].durationMinutes * 60);
        }
      } catch (err) {
        console.warn('Using fallback local coping activities:', err);
      }
    };
    loadActivities();
  }, []);

  // Filtered activities computation
  const filteredActivities = activities.filter(act => {
    const matchesMood = selectedMood === 'All' || act.moods.includes(selectedMood);
    const matchesDuration = selectedDuration === 'All' || act.durationMinutes === Number(selectedDuration);
    const matchesCategory = selectedCategory === 'All' || act.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.steps.some(step => step.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMood && matchesDuration && matchesCategory && matchesSearch;
  });

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setTimeLeft(activity.durationMinutes * 60);
    setTimerActive(false);
  };

  const handleResetFilters = () => {
    setSelectedMood('All');
    setSelectedDuration('All');
    setSelectedCategory('All');
    setSearchQuery('');
  };

  // Countdown Timer Interval Effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      alert('🎉 Exercise completed! Take a deep breath and notice how you feel.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const toggleFavorite = (exerciseTitle) => {
    setFavorites(prev => {
      if (prev.includes(exerciseTitle)) {
        return prev.filter(t => t !== exerciseTitle);
      } else {
        return [...prev, exerciseTitle];
      }
    });
  };

  // ── AI Coping Plan Generator ──────────────────────────────────
  const generateAiPlan = async () => {
    setAiError('');
    setAiPlan('');
    setAiIsCrisis(false);

    if (!aiSituation.trim() || aiSituation.trim().length < 10) {
      setAiError('Please describe your situation in at least a few words (10 characters minimum) so we can personalize your plan.');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(apiUrl('/api/coping-plan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: aiSituation.trim(),
          timeMinutes: aiTime,
          mood: aiMood || 'Not specified'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setAiError(data.error || 'Something went wrong generating your plan. Please try again.');
        return;
      }

      setAiIsCrisis(data.isCrisis || false);
      setAiPlan(data.plan || '');

      // Scroll to the plan result
      setTimeout(() => {
        planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setAiError('Network error — please check your connection and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isFav = selectedActivity && favorites.includes(selectedActivity.title);

  const moodsList = ['All', 'Stressed', 'Anxious', 'Sad', 'Okay', 'Calm', 'Happy'];
  const aiMoodOptions = ['', 'Stressed', 'Anxious', 'Sad', 'Overwhelmed', 'Angry', 'Tired', 'Okay', 'Calm'];

  return (
    <div className="coping-toolkit-page">
      <DisclaimerBanner />

      <div className="hero-section" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div className="brand-icon" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <Compass size={20} />
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>Personal Coping Toolkit</h1>
        </div>
        <p style={{ color: '#475569', fontSize: '0.98rem' }}>
          Use the filters below to find self-care exercises tailored by your current mood, time available, and preferred relaxation technique.
        </p>
      </div>

      {/* Interactive Filter Control Panel */}
      <div className="filter-box" style={{ flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        
        {/* Filter Row 1: Search & Reset */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search exercises by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="filter-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Duration:</label>
              <select 
                value={selectedDuration} 
                onChange={(e) => setSelectedDuration(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
              >
                <option value="All">All Durations ⏱️</option>
                <option value="2">2 Minutes (Quick Reset)</option>
                <option value="5">5 Minutes (Focused Session)</option>
                <option value="10">10 Minutes (Deep Session)</option>
              </select>
            </div>

            <div className="filter-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
              >
                <option value="All">All Categories 🎯</option>
                <option value="breathing">Breathing Exercises 🫁</option>
                <option value="grounding">5-4-3-2-1 Grounding 🌿</option>
                <option value="journaling">Expressive Journaling 📝</option>
                <option value="relaxation">Somatic Relaxation 🧘‍♂️</option>
              </select>
            </div>

            {(selectedMood !== 'All' || selectedDuration !== 'All' || selectedCategory !== 'All' || searchQuery !== '') && (
              <button
                onClick={handleResetFilters}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <RefreshCw size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Row 2: Mood Pills */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
            Filter by Mood:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {moodsList.map(mood => {
              const isSelected = selectedMood === mood;
              return (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: isSelected ? '2px solid #0d9488' : '1px solid #cbd5e1',
                    backgroundColor: isSelected ? '#0d9488' : 'white',
                    color: isSelected ? 'white' : '#475569',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {mood === 'All' ? '🌟 All Moods' : mood}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Filter Results Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>
          Matching Exercises ({filteredActivities.length})
        </h3>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Click any card to start exercise
        </span>
      </div>

      {/* Exercise Cards Grid */}
      {filteredActivities.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', color: '#64748b', marginBottom: '24px' }}>
          <p>No exercises match your selected filters. Try broadening your filter criteria or clicking <strong>Reset Filters</strong>.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {filteredActivities.map((act, index) => {
            const isSelected = selectedActivity && selectedActivity.title === act.title;
            return (
              <div
                key={index}
                onClick={() => handleSelectActivity(act)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #0d9488' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f0fdfa' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(13, 148, 136, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f766e', backgroundColor: '#ccfbf1', padding: '3px 8px', borderRadius: '6px' }}>
                    ⏱️ {act.durationMinutes} min
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                    {act.category}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px', fontWeight: 700 }}>
                  {act.title}
                </h4>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.6em' }}>
                  {act.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Selected Exercise View & Interactive Timer */}
      {selectedActivity && (
        <div className="activity-display">
          <div className="activity-header">
            <div>
              <div className="activity-meta">
                <span className="tag tag-time">⏱️ {selectedActivity.durationMinutes} Minutes</span>
                <span className="tag tag-cat">🎯 {selectedActivity.category.toUpperCase()}</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', color: '#0f172a' }}>{selectedActivity.title}</h2>
              <p style={{ color: '#475569', marginTop: 4 }}>{selectedActivity.description}</p>
            </div>

            <button 
              className="btn-secondary"
              onClick={() => toggleFavorite(selectedActivity.title)}
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
            >
              {isFav ? (
                <>
                  <BookmarkCheck size={18} color="#0d9488" />
                  <span style={{ color: '#0d9488', fontWeight: 700 }}>Saved to Favorites</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  <span>Save Favorite</span>
                </>
              )}
            </button>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: '#0d9488' }}>
            Step-by-Step Instructions:
          </h3>
          <ol className="steps-list">
            {selectedActivity.steps.map((step, idx) => (
              <li key={idx} style={{ fontSize: '0.95rem', color: '#334155' }}>
                {step}
              </li>
            ))}
          </ol>

          {/* Interactive Countdown Timer */}
          <div className="timer-box">
            <h4 style={{ fontSize: '1rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Clock size={18} color="#0d9488" />
              <span>Interactive Session Timer</span>
            </h4>
            <div className="timer-digits">{formatTime(timeLeft)}</div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button 
                className="btn-primary" 
                onClick={() => setTimerActive(!timerActive)}
                style={{ padding: '8px 20px' }}
              >
                {timerActive ? (
                  <>
                    <Pause size={18} />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Start Exercise</span>
                  </>
                )}
              </button>

              <button 
                className="btn-secondary" 
                onClick={() => {
                  setTimerActive(false);
                  setTimeLeft(selectedActivity.durationMinutes * 60);
                }}
                style={{ padding: '8px 16px' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Favorites List */}
      {favorites.length > 0 && (
        <div className="team-card" style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookmarkCheck size={20} color="#0d9488" />
            <span>Your Favorited Coping Exercises ({favorites.length})</span>
          </h3>
          <ul style={{ paddingLeft: '20px' }}>
            {favorites.map((fav, i) => (
              <li key={i} style={{ margin: '6px 0', fontWeight: 600, color: '#334155' }}>
                {fav}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── AI Personalized Coping Plan ──────────────────────────── */}
      <div className="ai-plan-section">
        <div className="ai-plan-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="ai-plan-icon">
              <Brain size={22} />
            </div>
            <div>
              <h2 className="ai-plan-title">AI Personalized Coping Plan</h2>
              <p className="ai-plan-subtitle">
                Describe what you're going through and get a tailored coping plan generated by AI — just for you.
              </p>
            </div>
          </div>
        </div>

        <div className="ai-plan-form">
          {/* Situation Textarea */}
          <div className="ai-field-group">
            <label className="ai-field-label">
              📝 What's going on for you right now?
              <span className="ai-field-required">*</span>
            </label>
            <textarea
              className="ai-situation-input"
              placeholder="e.g. I have a big exam tomorrow and I've been feeling overwhelmed and unable to focus. My mind keeps racing and I can't sleep..."
              value={aiSituation}
              onChange={(e) => setAiSituation(e.target.value)}
              rows={4}
              maxLength={800}
              disabled={aiLoading}
            />
            <div className="ai-char-count">
              {aiSituation.length}/800 characters
            </div>
          </div>

          {/* Time & Mood Row */}
          <div className="ai-options-row">
            <div className="ai-field-group" style={{ flex: 1 }}>
              <label className="ai-field-label">⏱️ Available time</label>
              <div className="ai-time-pills">
                {[2, 5, 10].map(t => (
                  <button
                    key={t}
                    className={`ai-time-pill ${aiTime === t ? 'active' : ''}`}
                    onClick={() => setAiTime(t)}
                    disabled={aiLoading}
                    type="button"
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>

            <div className="ai-field-group" style={{ flex: 1 }}>
              <label className="ai-field-label">😊 Current mood <span className="ai-field-optional">(optional)</span></label>
              <select
                className="ai-mood-select"
                value={aiMood}
                onChange={(e) => setAiMood(e.target.value)}
                disabled={aiLoading}
              >
                <option value="">— Select mood —</option>
                {aiMoodOptions.filter(m => m !== '').map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error message */}
          {aiError && (
            <div className="ai-error-box">
              <AlertTriangle size={16} />
              <span>{aiError}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            className={`ai-generate-btn ${aiLoading ? 'loading' : ''}`}
            onClick={generateAiPlan}
            disabled={aiLoading || !aiSituation.trim()}
            type="button"
          >
            {aiLoading ? (
              <>
                <span className="ai-spinner" />
                <span>Generating your plan...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate My Plan</span>
              </>
            )}
          </button>
        </div>

        {/* ── Plan Output ── */}
        {(aiPlan || aiLoading) && (
          <div ref={planRef} className={`ai-plan-output ${aiIsCrisis ? 'crisis' : ''}`}>
            {aiLoading && !aiPlan ? (
              <div className="ai-plan-loading-state">
                <div className="ai-loading-dots">
                  <span /><span /><span />
                </div>
                <p>MindCare AI is crafting your personalized plan…</p>
              </div>
            ) : (
              <>
                {aiIsCrisis && (
                  <div className="ai-crisis-notice">
                    <AlertTriangle size={18} />
                    <span>We noticed your message may indicate a crisis. Please see the emergency resources below.</span>
                  </div>
                )}
                <div className="ai-plan-content">
                  {aiPlan.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="ai-plan-h2">{line.replace(/^##\s*/, '')}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={i} className="ai-plan-h3">{line.replace(/^###\s*/, '')}</h3>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="ai-plan-bold">{line.replace(/\*\*/g, '')}</p>;
                    } else if (/^\*\*.*\*\*/.test(line)) {
                      // Inline bold: render with bold spans
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={i} className="ai-plan-line">
                          {parts.map((part, j) =>
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </p>
                      );
                    } else if (/^\d+\.\s/.test(line)) {
                      return <p key={i} className="ai-plan-step">{line}</p>;
                    } else if (line === '---') {
                      return <hr key={i} className="ai-plan-divider" />;
                    } else if (line.trim() === '') {
                      return <div key={i} style={{ height: '6px' }} />;
                    } else {
                      return <p key={i} className="ai-plan-line">{line}</p>;
                    }
                  })}
                </div>
                <div className="ai-plan-footer">
                  <CheckCircle2 size={14} color="#0d9488" />
                  <span>Generated by MindCare AI · Not a substitute for professional support</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Smile, Trash2, Plus, Calendar, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { apiUrl } from '../utils/api';

export default function MoodTracker({ setActiveTab }) {
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [note, setNote] = useState('');
  const [moodsList, setMoodsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  const moodOptions = [
    { label: 'Happy', emoji: '😊', color: '#10b981' },
    { label: 'Calm', emoji: '😌', color: '#0d9488' },
    { label: 'Okay', emoji: '😐', color: '#0284c7' },
    { label: 'Sad', emoji: '😢', color: '#6366f1' },
    { label: 'Anxious', emoji: '😟', color: '#d97706' },
    { label: 'Stressed', emoji: '😫', color: '#ef4444' }
  ];

  // Fetch past mood entries from backend API
  const fetchMoods = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/moods'));
      const data = await response.json();
      if (data.success) {
        setMoodsList(data.data || []);
        if (data.message) {
          setNotice(data.message);
        }
      }
    } catch (err) {
      console.error('Fetch moods error:', err);
      // Fallback local memory list
      setMoodsList([
        { _id: 'local_1', mood: 'Calm', note: 'Took a morning walk in the park.', createdAt: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleAddMood = async (e) => {
    e.preventDefault();
    if (!selectedMood || submitting) return;

    setSubmitting(true);
    setNotice('');

    try {
      const response = await fetch(apiUrl('/api/moods'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, note: note.trim() })
      });

      const data = await response.json();
      if (data.success) {
        setMoodsList(prev => [data.data, ...prev]);
        setNote('');
        if (data.message) setNotice(data.message);
      } else {
        alert(data.error || 'Failed to save mood entry.');
      }
    } catch (err) {
      console.error('Save mood error:', err);
      // Fallback local append
      const localEntry = {
        _id: 'local_' + Date.now(),
        mood: selectedMood,
        note: note.trim(),
        createdAt: new Date()
      };
      setMoodsList(prev => [localEntry, ...prev]);
      setNote('');
      setNotice('Saved locally to browser state (Server offline).');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mood entry?')) return;

    try {
      await fetch(apiUrl(`/api/moods/${id}`), { method: 'DELETE' });
      setMoodsList(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete mood error:', err);
      setMoodsList(prev => prev.filter(item => item._id !== id));
    }
  };

  const getEmoji = (moodName) => {
    const found = moodOptions.find(m => m.label === moodName);
    return found ? found.emoji : '😊';
  };

  return (
    <div className="mood-tracker-page">
      <DisclaimerBanner onOpenResources={() => setActiveTab('resources')} />

      {/* Safety Notice Banner */}
      <div 
        style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          color: '#0369a1',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Educational Mood Journal:</strong> Mood entries are for personal reflection only. MindCare AI does not diagnose clinical depression, anxiety, or mental health disorders.
        </span>
      </div>

      {notice && (
        <div 
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            padding: '10px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.85rem'
          }}
        >
          ℹ️ {notice}
        </div>
      )}

      {/* Log Mood Section */}
      <div className="hero-section" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>How are you feeling right now?</h2>

        <div className="mood-grid">
          {moodOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              className={`mood-btn ${selectedMood === option.label ? 'selected' : ''}`}
              onClick={() => setSelectedMood(option.label)}
            >
              <span className="mood-emoji">{option.emoji}</span>
              <span className="mood-label" style={{ color: selectedMood === option.label ? '#0d9488' : '#334155' }}>
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleAddMood}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px', color: '#475569' }}>
              Add an optional short note (e.g., "Finished my exam", "Took a walk outside"):
            </label>
            <textarea
              className="note-input"
              placeholder="Write a brief reflection here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={submitting}
          >
            <Plus size={18} />
            <span>{submitting ? 'Saving...' : 'Log Mood Entry'}</span>
          </button>
        </form>
      </div>

      {/* Past Mood Entries List */}
      <div className="team-card" style={{ marginTop: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={20} color="#0d9488" />
            <span>Your Saved Mood Journal</span>
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Total Entries: {moodsList.length}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw className="animate-spin" size={24} style={{ marginBottom: 8 }} />
            <p>Loading mood history...</p>
          </div>
        ) : moodsList.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
            <Smile size={36} color="#94a3b8" style={{ marginBottom: 8 }} />
            <p>No mood entries logged yet. Select a mood above to start tracking!</p>
          </div>
        ) : (
          <div className="mood-list">
            {moodsList.map((entry) => (
              <div key={entry._id} className="mood-item">
                <div className="mood-item-info">
                  <span style={{ fontSize: '2rem' }}>{getEmoji(entry.mood)}</span>
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{entry.mood}</strong>
                    {entry.note && (
                      <p style={{ color: '#475569', fontSize: '0.92rem', marginTop: 2 }}>
                        "{entry.note}"
                      </p>
                    )}
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>
                      {new Date(entry.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                </div>

                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(entry._id)}
                  title="Delete Entry"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { BookOpen, PhoneCall, ExternalLink, ShieldCheck, Search, Filter, Globe, MapPin } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import fallbackResources from '../data/seedResources';
import { apiUrl } from '../utils/api';

export default function Resources() {
  const [resources, setResources] = useState(fallbackResources);
  const [regionFilter, setRegionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl('/api/resources'));
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setResources(data.data);
        }
      } catch (err) {
        console.warn('Using fallback verified resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = [
    'All',
    'Crisis & Helplines',
    'Stress Management',
    'Sleep & Relaxation',
    'Emotional Wellbeing',
    'Professional Support'
  ];

  const filteredResources = resources.filter(res => {
    const matchesRegion = regionFilter === 'All' || res.region === regionFilter;
    const matchesCategory = categoryFilter === 'All' || res.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.contact.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesCategory && matchesSearch;
  });

  return (
    <div className="resources-page">
      <DisclaimerBanner />

      <div className="hero-section" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div className="brand-icon" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <BookOpen size={20} />
          </div>
          <h1 style={{ fontSize: '1.8rem' }}>Verified Mental Health Resources</h1>
        </div>
        <p style={{ color: '#475569', fontSize: '0.98rem' }}>
          Explore official, verified 24/7 emergency helplines, educational guides, and professional mental health support services across India and International regions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-box">
        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={15} /> Search Resources:
          </label>
          <input
            type="text"
            placeholder="Type keyword or helpline number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.92rem'
            }}
          />
        </div>

        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={15} /> Select Region:
          </label>
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
            <option value="All">All Regions (Global & India)</option>
            <option value="India">India 🇮🇳</option>
            <option value="Global">Global / International 🌐</option>
          </select>
        </div>

        <div className="filter-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={15} /> Category:
          </label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', color: '#64748b' }}>
          <p>No resources found matching your search criteria. Try resetting filters.</p>
        </div>
      ) : (
        <div className="resource-grid">
          {filteredResources.map((item, idx) => (
            <div key={item._id || idx} className="resource-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="resource-badge">{item.badge || item.category}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: 12 }}>
                    {item.region}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: 14 }}>
                  {item.description}
                </p>
              </div>

              <div>
                {item.contact && (
                  <div 
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0d9488'
                    }}
                  >
                    <PhoneCall size={16} />
                    <span>Contact: {item.contact}</span>
                  </div>
                )}

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    padding: '8px 12px'
                  }}
                >
                  <span>Visit Verified Website</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="main-content" style={{ padding: 0 }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
          <ShieldCheck size={18} color="#0d9488" />
          <span><strong>MindCare AI</strong> — MERN Stack Mental Health Support Platform</span>
        </p>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 4 }}>
          ⚠️ <strong>Disclaimer:</strong> MindCare AI is an automated educational support tool. It is NOT a substitute for professional mental health advice, diagnosis, or clinical treatment. If in crisis, please call Tele-MANAS (14416) or local emergency services.
        </p>
      </div>
    </footer>
  );
}

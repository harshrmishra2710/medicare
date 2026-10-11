import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DisclaimerBanner({ onOpenResources }) {
  return (
    <div className="disclaimer-banner">
      <AlertCircle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <strong>Important Safety Notice:</strong> MindCare AI provides automated emotional support and self-care exercises. It does not provide medical diagnoses or replace professional therapy.
        {onOpenResources && (
          <button
            onClick={onOpenResources}
            style={{
              marginLeft: 10,
              background: 'transparent',
              color: '#78350f',
              textDecoration: 'underline',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            View Verified Helplines & Crisis Numbers →
          </button>
        )}
      </div>
    </div>
  );
}

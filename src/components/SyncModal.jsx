import React, { useState } from 'react';
import { X, Cloud, Save, Download, Upload, Check, Database, RefreshCw } from 'lucide-react';
import { CUSTOM_CLOUD_KEY, getActiveCloudEndpoint } from '../utils/cloudSync';

export default function SyncModal({ isOpen, onClose, students, onImportData, showToast }) {
  const [customEndpoint, setCustomEndpoint] = useState(localStorage.getItem(CUSTOM_CLOUD_KEY) || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const activeEndpoint = getActiveCloudEndpoint();

  const handleSaveCustomEndpoint = (e) => {
    e.preventDefault();
    if (customEndpoint.trim()) {
      localStorage.setItem(CUSTOM_CLOUD_KEY, customEndpoint.trim());
      showToast('Saved Custom Cloud Database Endpoint!');
    } else {
      localStorage.removeItem(CUSTOM_CLOUD_KEY);
      showToast('Reset to Default Master Cloud Database');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '1.75rem' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cloud size={24} color="var(--skarion-orange)" />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                Cloud Database & Multi-User Sync Settings
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Guarantees candidate audit inputs from anyone on any device are saved 24/7
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Active Cloud Endpoint Card */}
        <div style={{ background: '#f5f3ff', padding: '1.15rem', borderRadius: '12px', border: '1px solid #ddd6fe', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '0.88rem', color: '#6d28d9', marginBottom: '0.35rem' }}>
            <Database size={16} /> Active Cloud Database Endpoint
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Current cloud REST endpoint handling universal multi-user edits:
          </p>
          <div style={{ background: '#ffffff', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #ddd6fe', fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--skarion-navy)', wordBreak: 'break-all' }}>
            {activeEndpoint}
          </div>
        </div>

        {/* Custom Cloud Endpoint Setup Form */}
        <form onSubmit={handleSaveCustomEndpoint} style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.35rem' }}>
            Connect Custom Private Cloud DB (Optional)
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Paste your own Firebase, Supabase, JSONBin, or REST API endpoint to use a private dedicated database:
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input 
              type="text"
              placeholder="e.g. https://api.jsonbin.io/v3/b/your_bin_id"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              className="input-control"
              style={{ fontSize: '0.8rem' }}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {savedSuccess ? <Check size={16} color="#34d399" /> : <Save size={16} />} {savedSuccess ? 'Saved!' : 'Save Endpoint'}
            </button>
          </div>
          {customEndpoint && (
            <button 
              type="button" 
              onClick={() => { setCustomEndpoint(''); localStorage.removeItem(CUSTOM_CLOUD_KEY); showToast('Reset to Default Master DB'); }}
              style={{ fontSize: '0.72rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Reset to Default Master Database
            </button>
          )}
        </form>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}

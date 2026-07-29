import React, { useRef, useState, useEffect } from 'react';
import { 
  Plus, 
  Table, 
  Calendar as CalendarIcon, 
  FileText,
  GraduationCap,
  Download, 
  Upload, 
  RotateCcw, 
  Search,
  Database,
  Share2,
  Check,
  Moon,
  Sun
} from 'lucide-react';
import { generateShareableUrl } from '../utils/cloudSync';

export default function Header({ 
  activeView, 
  setActiveView, 
  searchQuery, 
  setSearchQuery, 
  students,
  onOpenAddModal, 
  onExportData, 
  onImportData, 
  onResetData,
  showToast
}) {
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Night Mode / Light Mode State
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('SKARION_THEME_MODE') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('SKARION_THEME_MODE', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    if (showToast) showToast(`Switched to ${nextTheme === 'dark' ? 'Night 🌙' : 'Light ☀️'} Mode`);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportData(parsed);
          } else {
            alert('Invalid JSON file format. Expected student audit list.');
          }
        } catch (err) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleShareLiveState = () => {
    const shareUrl = generateShareableUrl(students);
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (showToast) showToast('Copied Live Sync Link! Open on Phone to view exact updated status.');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <header className="card-panel" style={{ padding: '1.15rem 1.75rem', marginBottom: '1.35rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        
        {/* Brand with Exact SKARION Interlaced Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="36" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45 20 L25 40 L40 55 L75 20 L55 5 L40 20 Z" fill={themeMode === 'dark' ? '#38bdf8' : '#132247'} />
              <path d="M40 55 L60 75 L45 90 L10 55 L25 40 Z" fill={themeMode === 'dark' ? '#38bdf8' : '#132247'} />
              <path d="M75 20 L95 40 L80 55 L45 20 L60 5 Z" fill="#FF5252" />
              <path d="M80 55 L100 75 L85 90 L50 55 L65 40 Z" fill="#FF5252" />
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: themeMode === 'dark' ? '#f8fafc' : 'var(--skarion-navy)', letterSpacing: '-0.03em' }}>
                SKARION
              </h1>
              <span style={{ 
                background: 'rgba(255, 82, 82, 0.15)', 
                color: 'var(--skarion-orange)', 
                fontSize: '0.72rem', 
                fontWeight: '800', 
                padding: '0.15rem 0.55rem', 
                borderRadius: '6px', 
                border: '1px solid rgba(255, 82, 82, 0.3)',
                letterSpacing: '0.04em'
              }}>
                STUDENT AUDIT LOG
              </span>
              <span style={{
                background: themeMode === 'dark' ? 'rgba(5, 150, 105, 0.2)' : '#ecfdf5',
                color: '#059669',
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '0.15rem 0.55rem',
                borderRadius: '6px',
                border: '1px solid #a7f3d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Database size={12} color="#059669" /> NeonDB Online
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Candidate Progress, Mock Interviews & Calendar Audit Hub
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: '1', maxWidth: '240px', position: 'relative' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search candidate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.4rem', height: '42px', fontSize: '0.86rem' }}
          />
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`tab-pill ${activeView === 'table' ? 'active' : ''}`}
            onClick={() => setActiveView('table')}
          >
            <Table size={15} /> Roster
          </button>
          <button 
            className={`tab-pill ${activeView === 'sticky' ? 'active' : ''}`}
            onClick={() => setActiveView('sticky')}
          >
            <FileText size={15} /> Audit Feed
          </button>
          <button 
            className={`tab-pill ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveView('calendar')}
          >
            <CalendarIcon size={15} /> Calendar
          </button>
          <button 
            className={`tab-pill ${activeView === 'placed' ? 'active' : ''}`}
            onClick={() => setActiveView('placed')}
            style={{ background: activeView === 'placed' ? '#7c3aed' : 'transparent', color: activeView === 'placed' ? '#ffffff' : 'inherit' }}
          >
            <GraduationCap size={15} /> Placed 🎓
          </button>
        </div>

        {/* Actions including Night Mode toggle button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
          
          {/* Night Mode / Light Mode Toggle Button */}
          <button 
            className="btn-icon" 
            onClick={toggleTheme}
            style={{ 
              height: '40px', 
              width: '40px', 
              background: themeMode === 'dark' ? '#192642' : 'var(--bg-surface-subtle)',
              borderColor: themeMode === 'dark' ? 'var(--skarion-orange)' : 'var(--border-color)',
              color: themeMode === 'dark' ? '#fbbf24' : 'var(--skarion-navy)' 
            }}
            title={themeMode === 'dark' ? 'Switch to Light Mode ☀️' : 'Switch to Night Mode 🌙'}
          >
            {themeMode === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="var(--skarion-navy)" />}
          </button>

          <button 
            className="btn-primary" 
            style={{ height: '40px', padding: '0 0.85rem', background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', border: 'none' }} 
            onClick={handleShareLiveState} 
            title="Copy Live State Link to open on Phone or share with team"
          >
            {copied ? <Check size={16} color="#34d399" /> : <Share2 size={15} />} {copied ? 'Copied Link!' : 'Share Live State'}
          </button>

          <button className="btn-secondary" style={{ height: '40px', padding: '0 0.65rem' }} onClick={onExportData} title="Export Audit Log JSON">
            <Download size={15} />
          </button>
          <button className="btn-secondary" style={{ height: '40px', padding: '0 0.65rem' }} onClick={() => fileInputRef.current.click()} title="Import JSON Audit Log">
            <Upload size={15} />
          </button>
          <button className="btn-primary" style={{ height: '40px' }} onClick={onOpenAddModal}>
            <Plus size={18} /> New Audit
          </button>
        </div>

      </div>
    </header>
  );
}

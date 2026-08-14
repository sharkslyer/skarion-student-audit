import React, { useState } from 'react';
import { RATING_CONFIG } from '../data/initialData';
import { getTodayLocalDate } from '../utils/dateUtils';
import { X, UserPlus, Save } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentFormModal({ isOpen, onClose, onSaveStudent, initialData = null, students = [] }) {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || '');
  const [domain, setDomain] = useState(initialData?.domain || initialData?.targetRole || '');
  const [joiningDate, setJoiningDate] = useState(initialData?.joiningDate || getTodayLocalDate());
  const [progress, setProgress] = useState(initialData?.progress || 0);
  const [mockInterviews, setMockInterviews] = useState(initialData?.mockInterviews || 0);
  const [rating, setRating] = useState(initialData?.rating || 'good');
  const [placementCompany, setPlacementCompany] = useState(initialData?.placementCompany || '');
  const [placementRole, setPlacementRole] = useState(initialData?.placementRole || '');
  const [initialComment, setInitialComment] = useState('');

  // Extract all existing unique domains from all students in database
  const existingDomains = Array.from(
    new Set(
      (students || [])
        .map(s => s?.domain || s?.targetRole)
        .filter(d => Boolean(d && typeof d === 'string' && d.trim()))
    )
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const studentObj = {
      id: initialData?.id || `skr-${Date.now()}`,
      name: name.trim(),
      domain: domain.trim() || 'Software Engineering',
      targetRole: domain.trim() || 'Software Engineering',
      joiningDate,
      progress: Number(progress),
      mockInterviews: Number(mockInterviews),
      rating,
      placementCompany: rating === 'placed' ? placementCompany.trim() : '',
      placementRole: rating === 'placed' ? placementRole.trim() : '',
      placementDate: rating === 'placed' ? (initialData?.placementDate || getTodayLocalDate()) : '',
      stickyNotes: initialData?.stickyNotes || []
    };

    if (initialComment.trim()) {
      studentObj.stickyNotes.unshift({
        id: `note-${Date.now()}`,
        date: getTodayLocalDate(),
        content: initialComment.trim(),
        category: 'General',
        author: 'Mayukh',
        accent: rating === 'placed' ? 'green' : rating === 'excellent' ? 'green' : rating === 'bad' ? 'orange' : 'navy',
        pinned: true
      });
    }

    if (rating === 'excellent' || rating === 'placed') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    onSaveStudent(studentObj);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={22} color="var(--skarion-orange)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
              {isEdit ? `Edit Audit Log: ${initialData.name}` : 'Add New Candidate Audit Entry'}
            </h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            
            {/* Student Name */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                Candidate Full Name *
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Vikram Malhotra" 
                className="input-control" 
                required 
              />
            </div>

            {/* Joining Date */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                Joining Date *
              </label>
              <input 
                type="date" 
                value={joiningDate} 
                onChange={(e) => setJoiningDate(e.target.value)} 
                className="input-control" 
                required 
              />
            </div>

            {/* Mock Interviews Count */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                Mock Interviews Conducted
              </label>
              <input 
                type="number" 
                min="0" 
                max="50" 
                value={mockInterviews} 
                onChange={(e) => setMockInterviews(e.target.value)} 
                className="input-control" 
              />
            </div>

            {/* Tech Domain & Career Track Assignment */}
            <div style={{ gridColumn: '1 / -1', background: 'var(--bg-surface-subtle)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  🎯 Candidate Tech Domain / Career Track
                </label>
                {existingDomains.length > 0 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {existingDomains.length} unique domains recorded
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Freeform Text Input for Domain */}
                <input 
                  type="text" 
                  value={domain} 
                  onChange={(e) => setDomain(e.target.value)} 
                  placeholder="Type domain (e.g. OSP Design Engineer, Full-Stack, Backend Go)..." 
                  className="input-control" 
                  style={{ flex: 1, minWidth: '220px', fontSize: '0.86rem', fontWeight: '600' }}
                />

                {/* Quick-Select / Merge Dropdown from already existing database domains */}
                {existingDomains.length > 0 && (
                  <select 
                    value=""
                    onChange={(e) => {
                      if (e.target.value) setDomain(e.target.value);
                    }} 
                    className="input-control" 
                    style={{ maxWidth: '240px', fontSize: '0.82rem', fontWeight: '700', color: 'var(--skarion-navy)', background: 'var(--bg-surface)' }}
                    title="Select an already recorded domain to merge"
                  >
                    <option value="">-- Quick Assign Existing --</option>
                    {existingDomains.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                )}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0' }}>
                Type a custom domain name or pick from existing recorded domains to merge candidates into identical tracks.
              </p>
            </div>

            {/* Course Progress Slider */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                Course Progress ({progress}%)
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={(e) => setProgress(e.target.value)} 
                style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--skarion-orange)' }} 
              />
            </div>

          </div>

          {/* Audit Status Rating Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
              Candidate Audit Mark / Rating *
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(RATING_CONFIG).map(([key, cfg]) => {
                const isSelected = rating === key;
                return (
                  <div 
                    key={key}
                    onClick={() => setRating(key)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${cfg.color}` : '1px solid var(--border-color)',
                      background: isSelected ? cfg.bg : 'var(--bg-surface-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.82rem', color: isSelected ? cfg.color : 'var(--skarion-navy)' }}>
                        {cfg.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Placement Details if Rating is Placed */}
          {rating === 'placed' && (
            <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd6fe', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: '800', color: '#6d28d9', marginBottom: '0.75rem' }}>
                🎓 Placement Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Company Placed</label>
                  <input 
                    type="text" 
                    value={placementCompany} 
                    onChange={(e) => setPlacementCompany(e.target.value)} 
                    placeholder="e.g. Innovate Tech Solutions" 
                    className="input-control" 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Job Role</label>
                  <input 
                    type="text" 
                    value={placementRole} 
                    onChange={(e) => setPlacementRole(e.target.value)} 
                    placeholder="e.g. Frontend Engineer" 
                    className="input-control" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Initial Sticky Note Comment */}
          {!isEdit && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                Initial Mentor Audit Observation (Optional)
              </label>
              <textarea 
                rows={2} 
                value={initialComment} 
                onChange={(e) => setInitialComment(e.target.value)} 
                placeholder="Log an initial observation or placement confirmation..." 
                className="input-control" 
              />
            </div>
          )}

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} /> {isEdit ? 'Save Changes' : 'Create Record'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

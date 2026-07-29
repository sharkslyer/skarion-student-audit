import React, { useState } from 'react';
import { RATING_CONFIG, EVALUATORS } from '../data/initialData';
import { 
  X, 
  FileText, 
  Pin, 
  Trash2, 
  Edit, 
  Send 
} from 'lucide-react';

export default function StudentDetailModal({ 
  student, 
  onClose, 
  onAddStickyNote, 
  onDeleteStickyNote, 
  onTogglePinStickyNote,
  onOpenEditModal 
}) {
  if (!student) return null;

  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Mock Feedback');
  const [newNoteAccent, setNewNoteAccent] = useState('navy');
  const [newNoteDate, setNewNoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNoteAuthor, setNewNoteAuthor] = useState(EVALUATORS[0]); // Default 'Mayukh'

  const ratingObj = RATING_CONFIG[student.rating] || RATING_CONFIG.good;
  const stickyNotes = student.stickyNotes || [];

  const handlePostNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    onAddStickyNote(student.id, {
      id: `note-${Date.now()}`,
      date: newNoteDate,
      content: newNoteContent.trim(),
      category: newNoteCategory,
      author: newNoteAuthor,
      accent: newNoteAccent,
      pinned: false
    });

    setNewNoteContent('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'var(--skarion-navy)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.5rem'
            }}>
              {student.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>{student.name}</h2>
                <span className={`status-badge ${ratingObj.badgeClass}`}>
                  {ratingObj.icon} {ratingObj.label}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Joined {new Date(student.joiningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ height: '36px' }} onClick={() => { onClose(); onOpenEditModal(student); }}>
              <Edit size={14} /> Edit
            </button>
            <button className="btn-icon" style={{ width: '36px', height: '36px' }} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>COURSE COMPLETION</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: '0.25rem 0' }}>{student.progress}%</div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${student.progress}%`, background: 'var(--skarion-orange)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>MOCK INTERVIEWS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--skarion-orange)', margin: '0.25rem 0' }}>{student.mockInterviews || 0} Sessions</div>
          </div>

          <div style={{ background: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>AUDIT LOG ENTRIES</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: '0.25rem 0' }}>{stickyNotes.length} Entries</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Historical audit timeline</span>
          </div>
        </div>

        {/* Post New Audit Entry with Evaluator Selector */}
        <form onSubmit={handlePostNote} style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            📝 Log Audit Comment
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <select value={newNoteAuthor} onChange={(e) => setNewNoteAuthor(e.target.value)} className="input-control" style={{ fontSize: '0.8rem', fontWeight: '700' }}>
              {EVALUATORS.map(e => (
                <option key={e} value={e}>✍️ {e}</option>
              ))}
            </select>

            <select value={newNoteCategory} onChange={(e) => setNewNoteCategory(e.target.value)} className="input-control" style={{ fontSize: '0.8rem' }}>
              <option value="Mock Feedback">Mock Feedback</option>
              <option value="Technical">Technical</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Attendance">Attendance</option>
              <option value="General">General</option>
            </select>

            <input type="date" value={newNoteDate} onChange={(e) => setNewNoteDate(e.target.value)} className="input-control" style={{ fontSize: '0.8rem' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Log candidate observation or mock interview evaluation..."
              className="input-control"
              required 
            />
            <button type="submit" className="btn-navy" style={{ whiteSpace: 'nowrap' }}>
              <Send size={15} /> Save
            </button>
          </div>
        </form>

        {/* Audit Feed */}
        <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--skarion-navy)' }}>
          Candidate Audit Log Timeline ({stickyNotes.length})
        </h3>

        {stickyNotes.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No audit logs recorded for this candidate yet.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
            {stickyNotes.map((n) => (
              <div key={n.id} className="audit-card" style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--skarion-navy)', textTransform: 'uppercase' }}>{n.category}</span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => onTogglePinStickyNote(student.id, n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: n.pinned ? 1 : 0.4 }}>
                      <Pin size={13} fill={n.pinned ? 'var(--skarion-orange)' : 'none'} color={n.pinned ? 'var(--skarion-orange)' : 'var(--text-muted)'} />
                    </button>
                    <button onClick={() => onDeleteStickyNote(student.id, n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
                      <Trash2 size={13} color="var(--text-muted)" />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '500' }}>"{n.content}"</p>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--skarion-navy)', fontWeight: '800' }}>✍️ Logged by: {n.author}</span>
                  <span>{new Date(n.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { RATING_CONFIG, EVALUATORS, EVALUATOR_CONFIG } from '../data/initialData';
import { getTodayLocalDate } from '../utils/dateUtils';
import { 
  X, 
  FileText, 
  Pin, 
  Trash2, 
  Edit, 
  Send,
  Calendar,
  Award,
  BookOpen
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
  const [newNoteDate, setNewNoteDate] = useState(getTodayLocalDate());
  const [newNoteAuthor, setNewNoteAuthor] = useState(EVALUATORS[0]); // Default 'Mayukh'

  const ratingObj = RATING_CONFIG[student.rating] || RATING_CONFIG.good;
  const stickyNotes = student.stickyNotes || [];

  const handlePostNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    onAddStickyNote(student.id, {
      id: `note-${Date.now()}`,
      date: newNoteDate || getTodayLocalDate(),
      content: newNoteContent.trim(),
      category: newNoteCategory,
      author: newNoteAuthor,
      accent: newNoteAccent,
      pinned: false
    });

    setNewNoteContent('');
    setNewNoteDate(getTodayLocalDate());
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--skarion-navy)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.55rem',
              boxShadow: '0 4px 14px rgba(19, 34, 71, 0.25)'
            }}>
              {student.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>{student.name}</h2>
                <span className={`status-badge ${ratingObj.badgeClass}`}>
                  {ratingObj.icon} {ratingObj.label}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="var(--text-dim)" /> Joined {new Date(student.joiningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn-secondary" style={{ height: '38px', padding: '0 0.85rem' }} onClick={() => { onClose(); onOpenEditModal(student); }}>
              <Edit size={14} /> Edit Record
            </button>
            <button className="btn-icon" style={{ width: '38px', height: '38px' }} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Executive Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '800' }}>COURSE COMPLETION</span>
              <BookOpen size={16} color="var(--skarion-orange)" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: '0.2rem 0' }}>{student.progress}%</div>
            <div className="progress-bar-track" style={{ marginTop: '0.5rem' }}>
              <div className="progress-bar-fill" style={{ width: `${student.progress}%`, background: 'var(--skarion-orange)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '800' }}>MOCK INTERVIEWS</span>
              <Award size={16} color="var(--skarion-orange)" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--skarion-orange)', margin: '0.2rem 0' }}>{student.mockInterviews || 0} Sessions</div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Attended tech evaluations</span>
          </div>

          <div style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '800' }}>AUDIT LOG ENTRIES</span>
              <FileText size={16} color="var(--skarion-navy)" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: '0.2rem 0' }}>{stickyNotes.length} Records</div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Historical mentor observation trail</span>
          </div>
        </div>

        {/* Post New Audit Entry Form */}
        <form onSubmit={handlePostNote} style={{ background: 'var(--bg-surface-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            📝 Add Candidate Observation Record
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Evaluator</label>
              <select value={newNoteAuthor} onChange={(e) => setNewNoteAuthor(e.target.value)} className="input-control" style={{ fontSize: '0.82rem', fontWeight: '700' }}>
                {EVALUATORS.map(e => (
                  <option key={e} value={e}>✍️ {e}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Category</label>
              <select value={newNoteCategory} onChange={(e) => setNewNoteCategory(e.target.value)} className="input-control" style={{ fontSize: '0.82rem' }}>
                <option value="Mock Feedback">Mock Feedback</option>
                <option value="Technical">Technical</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Attendance">Attendance</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Observation Date</label>
              <input type="date" value={newNoteDate} onChange={(e) => setNewNoteDate(e.target.value)} className="input-control" style={{ fontSize: '0.82rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input 
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Record candidate observation, mock interview feedback or attendance alert..."
              className="input-control"
              style={{ fontSize: '0.86rem' }}
              required 
            />
            <button type="submit" className="btn-navy" style={{ whiteSpace: 'nowrap', padding: '0 1.25rem' }}>
              <Send size={15} /> Save Log
            </button>
          </div>
        </form>

        {/* Audit Feed Timeline */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.85rem', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Candidate Audit Log Trail</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>{stickyNotes.length} Total Entries</span>
        </h3>

        {stickyNotes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              No audit logs recorded for this candidate yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
            {stickyNotes.map((n) => {
              const evalCfg = EVALUATOR_CONFIG[n.author] || EVALUATOR_CONFIG.Mayukh;
              return (
                <div key={n.id} className="card-panel" style={{ padding: '1rem 1.15rem', borderLeft: `4px solid ${evalCfg.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{n.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button onClick={() => onTogglePinStickyNote(student.id, n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: n.pinned ? 1 : 0.4 }} title={n.pinned ? 'Unpin' : 'Pin'}>
                        <Pin size={14} fill={n.pinned ? 'var(--skarion-orange)' : 'none'} color={n.pinned ? 'var(--skarion-orange)' : 'var(--text-muted)'} />
                      </button>
                      <button onClick={() => onDeleteStickyNote(student.id, n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }} title="Delete entry">
                        <Trash2 size={14} color="var(--text-muted)" />
                      </button>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: '500', lineHeight: '1.5' }}>"{n.content}"</p>
                  
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.65rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.55rem' }}>
                    <span style={{ 
                      color: evalCfg.text, 
                      fontWeight: '800', 
                      background: evalCfg.bg, 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '5px',
                      border: `1px solid ${evalCfg.border}`
                    }}>
                      ✍️ {n.author}
                    </span>
                    <span>{new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

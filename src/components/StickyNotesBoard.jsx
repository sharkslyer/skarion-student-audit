import React, { useState } from 'react';
import { 
  Plus, 
  Pin, 
  Trash2, 
  FileText,
  User,
  Tag,
  Calendar,
  Filter,
  Search,
  MessageSquare
} from 'lucide-react';
import { RATING_CONFIG, EVALUATORS, EVALUATOR_CONFIG, CATEGORIES, CATEGORY_COLORS } from '../data/initialData';
import { getTodayLocalDate } from '../utils/dateUtils';

export default function StickyNotesBoard({ students, onAddStickyNote, onDeleteStickyNote, onTogglePinStickyNote, onSelectStudent }) {
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedEvaluatorFilter, setSelectedEvaluatorFilter] = useState('all');
  const [noteSearch, setNoteSearch] = useState('');

  // Quick Add Note Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Mock Feedback');
  const [noteAccent, setNoteAccent] = useState('navy');
  const [noteDate, setNoteDate] = useState(getTodayLocalDate());
  const [noteAuthor, setNoteAuthor] = useState(EVALUATORS[0]); // Default 'Mayukh'

  // Collect all notes across all students
  const allNotes = students.flatMap(student => 
    (student.stickyNotes || []).map(note => ({
      ...note,
      studentId: student.id,
      studentName: student.name,
      studentRating: student.rating
    }))
  );

  // Filtering
  const filteredNotes = allNotes.filter(note => {
    const matchesStudent = selectedStudentFilter === 'all' || note.studentId === selectedStudentFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || note.category === selectedCategoryFilter;
    const matchesEvaluator = selectedEvaluatorFilter === 'all' || note.author === selectedEvaluatorFilter;
    const matchesSearch = noteSearch === '' || 
      note.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
      note.studentName.toLowerCase().includes(noteSearch.toLowerCase()) ||
      (note.author && note.author.toLowerCase().includes(noteSearch.toLowerCase()));
    return matchesStudent && matchesCategory && matchesEvaluator && matchesSearch;
  });

  // Sort pinned notes to top
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onAddStickyNote(targetStudentId, {
      id: `note-${Date.now()}`,
      date: noteDate || getTodayLocalDate(),
      content: noteContent,
      category: noteCategory,
      author: noteAuthor,
      accent: noteAccent,
      pinned: false
    });
    setNoteContent('');
    setShowAddForm(false);
  };

  const categories = CATEGORIES;
  const categoryColors = CATEGORY_COLORS;

  return (
    <div className="card-panel" style={{ padding: '1.5rem' }}>
      {/* Header & Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={22} color="var(--skarion-orange)" /> Candidate Audit Feed & Evaluator Logs
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Real-time feedback color-coded by evaluator: <span style={{ color: '#e11d48', fontWeight: '700' }}>Mayukh (Light Red)</span>, <span style={{ color: '#0369a1', fontWeight: '700' }}>Kasshaf (Sky Blue)</span>, <span style={{ color: '#15803d', fontWeight: '700' }}>Faisal (Green)</span>, <span style={{ color: '#a16207', fontWeight: '700' }}>Saki (Light Yellow)</span>, <span style={{ color: '#7c3aed', fontWeight: '700' }}>Ferdous (Purple)</span>, <span style={{ color: '#ea580c', fontWeight: '700' }}>Piyas (Orange)</span>.
          </p>
        </div>

        <button 
          className="btn-primary" 
          style={{ height: '42px', padding: '0 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} /> Log Audit Comment
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justify: 'space-between', 
        flexWrap: 'wrap', 
        gap: '0.85rem', 
        marginBottom: '1.5rem',
        background: 'var(--bg-surface-subtle)',
        padding: '0.85rem 1.15rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: '1' }}>
          {/* Candidate Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={15} color="var(--skarion-navy)" />
            <select 
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="input-control"
              style={{ height: '38px', fontSize: '0.84rem', minWidth: '170px' }}
            >
              <option value="all">👥 All Candidates ({students.length})</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.stickyNotes?.length || 0})</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tag size={15} color="var(--skarion-navy)" />
            <select 
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="input-control"
              style={{ height: '38px', fontSize: '0.84rem', minWidth: '150px' }}
            >
              <option value="all">🏷️ All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Evaluator Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--skarion-navy)" />
            <select 
              value={selectedEvaluatorFilter}
              onChange={(e) => setSelectedEvaluatorFilter(e.target.value)}
              className="input-control"
              style={{ height: '38px', fontSize: '0.84rem', minWidth: '150px' }}
            >
              <option value="all">✍️ All Evaluators</option>
              {EVALUATORS.map(ev => {
                const cfg = EVALUATOR_CONFIG[ev];
                return <option key={ev} value={ev}>{ev}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Note Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search feed notes..."
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.2rem', height: '38px', fontSize: '0.84rem' }}
          />
        </div>
      </div>

      {/* Quick Add Form with Evaluator Selector */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={{ 
          background: 'var(--bg-surface)', 
          padding: '1.35rem', 
          borderRadius: '14px', 
          marginBottom: '1.75rem', 
          border: '2px solid var(--skarion-navy)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '1.15rem', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} color="var(--skarion-orange)" /> Create New Audit Observation Record
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--skarion-navy)', display: 'block', marginBottom: '0.3rem' }}>Evaluator / Mentor</label>
              <select value={noteAuthor} onChange={(e) => setNoteAuthor(e.target.value)} className="input-control" required style={{ fontWeight: '700', color: 'var(--skarion-navy)' }}>
                {EVALUATORS.map(evaluator => (
                  <option key={evaluator} value={evaluator}>✍️ {evaluator}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--skarion-navy)', display: 'block', marginBottom: '0.3rem' }}>Candidate</label>
              <select value={targetStudentId} onChange={(e) => setTargetStudentId(e.target.value)} className="input-control" required>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--skarion-navy)', display: 'block', marginBottom: '0.3rem' }}>Category</label>
              <select value={noteCategory} onChange={(e) => setNoteCategory(e.target.value)} className="input-control">
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--skarion-navy)', display: 'block', marginBottom: '0.3rem' }}>Audit Date</label>
              <input type="date" value={noteDate} onChange={(e) => setNoteDate(e.target.value)} className="input-control" required />
            </div>
          </div>

          <div style={{ marginBottom: '1.15rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--skarion-navy)', display: 'block', marginBottom: '0.3rem' }}>Mentor Audit Feedback / Observations</label>
            <textarea 
              rows={3} 
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record candidate progress, mock evaluation notes, technical strengths or attendance alerts..."
              className="input-control"
              style={{ lineHeight: '1.5' }}
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-navy" style={{ padding: '0.6rem 1.5rem' }}>Save Audit Log</button>
          </div>
        </form>
      )}

      {/* Audit Log Cards Grid with Evaluator-Specific Color Coding */}
      {sortedNotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
          <MessageSquare size={36} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1.05rem', color: 'var(--skarion-navy)', fontWeight: '700' }}>No audit feed entries found</p>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Try clearing your filters or create a new observation entry.</p>
          <button className="btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => setShowAddForm(true)}>
            <Plus size={16} /> Create Audit Entry
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.35rem' }}>
          {sortedNotes.map((note) => {
            const ratingObj = RATING_CONFIG[note.studentRating] || RATING_CONFIG.good;
            const catStyle = categoryColors[note.category] || categoryColors['General'];
            
            // Evaluator Specific Color Palette:
            // Kasshaf: Sky Blue | Mayukh: Light Red | Faisal: Green | Saki: Light Yellow
            const evalCfg = EVALUATOR_CONFIG[note.author] || EVALUATOR_CONFIG.Mayukh;

            return (
              <div 
                key={note.id}
                style={{ 
                  background: 'var(--bg-surface)', 
                  borderRadius: '14px', 
                  padding: '1.25rem', 
                  border: note.pinned ? '2px solid var(--skarion-orange)' : `1px solid ${evalCfg.border}`,
                  boxShadow: note.pinned ? '0 8px 20px rgba(255, 82, 82, 0.12)' : '0 4px 14px rgba(0,0,0,0.03)',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Card Header Tag & Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: '800', 
                      background: catStyle.bg, 
                      color: catStyle.text, 
                      padding: '0.25rem 0.65rem', 
                      borderRadius: '6px',
                      border: `1px solid ${catStyle.border}`,
                      letterSpacing: '0.02em'
                    }}>
                      {note.category}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onTogglePinStickyNote(note.studentId, note.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: note.pinned ? 1 : 0.4, padding: '4px' }}
                        title={note.pinned ? 'Unpin observation' : 'Pin observation to top'}
                      >
                        <Pin size={15} color={note.pinned ? 'var(--skarion-orange)' : 'var(--text-muted)'} fill={note.pinned ? 'var(--skarion-orange)' : 'none'} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteStickyNote(note.studentId, note.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '4px' }}
                        title="Delete audit entry"
                      >
                        <Trash2 size={15} color="var(--text-muted)" />
                      </button>
                    </div>
                  </div>

                  {/* Candidate Name Card Link */}
                  <div 
                    onClick={() => {
                      const student = students.find(s => s.id === note.studentId);
                      if (student) onSelectStudent(student);
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'space-between',
                      background: 'var(--bg-surface-subtle)', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '10px',
                      marginBottom: '0.85rem',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '0.92rem', color: 'var(--skarion-navy)' }}>
                      <span style={{ fontSize: '1rem' }}>{ratingObj.icon}</span>
                      <span>{note.studentName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      <Calendar size={13} color="var(--text-dim)" />
                      <span>{new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Note Body */}
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.55', fontWeight: '500', margin: '0.5rem 0' }}>
                    "{note.content}"
                  </p>
                </div>

                {/* Footer with Evaluator-Specific Distinct Color Pill */}
                <div style={{ borderTop: `1px solid ${evalCfg.border}`, paddingTop: '0.65rem', marginTop: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ 
                    color: evalCfg.text, 
                    fontWeight: '800', 
                    background: evalCfg.bg, 
                    padding: '0.25rem 0.65rem', 
                    borderRadius: '6px',
                    border: `1px solid ${evalCfg.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    ✍️ {note.author}
                  </span>
                  
                  {note.pinned && (
                    <span style={{ color: 'var(--skarion-orange)', fontWeight: '800', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      📌 PINNED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

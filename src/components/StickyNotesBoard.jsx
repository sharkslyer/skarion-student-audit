import React, { useState } from 'react';
import { 
  Plus, 
  Pin, 
  Trash2, 
  FileText
} from 'lucide-react';
import { RATING_CONFIG, EVALUATORS } from '../data/initialData';

export default function StickyNotesBoard({ students, onAddStickyNote, onDeleteStickyNote, onTogglePinStickyNote, onSelectStudent }) {
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [noteSearch, setNoteSearch] = useState('');

  // Quick Add Note Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Mock Feedback');
  const [noteAccent, setNoteAccent] = useState('navy');
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);
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
    const matchesSearch = noteSearch === '' || 
      note.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
      note.studentName.toLowerCase().includes(noteSearch.toLowerCase()) ||
      note.author.toLowerCase().includes(noteSearch.toLowerCase());
    return matchesStudent && matchesCategory && matchesSearch;
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
      date: noteDate,
      content: noteContent,
      category: noteCategory,
      author: noteAuthor,
      accent: noteAccent,
      pinned: false
    });
    setNoteContent('');
    setShowAddForm(false);
  };

  const categories = ['Mock Feedback', 'Technical', 'Soft Skills', 'Attendance', 'General'];

  return (
    <div className="card-panel" style={{ padding: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="var(--skarion-orange)" /> Professional Audit Log & Calendar Feed
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Chronological audit entries, mentor observations, and mock interview performance records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Student Filter */}
          <select 
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
            className="input-control"
            style={{ height: '40px', fontSize: '0.84rem' }}
          >
            <option value="all">👥 All Candidates ({students.length})</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.stickyNotes?.length || 0})</option>
            ))}
          </select>

          {/* Category Filter */}
          <select 
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="input-control"
            style={{ height: '40px', fontSize: '0.84rem' }}
          >
            <option value="all">🏷️ All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Add Audit Entry Button */}
          <button className="btn-primary" style={{ height: '40px' }} onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> Log Audit Comment
          </button>
        </div>
      </div>

      {/* Quick Add Form with Evaluator Selector */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={{ background: 'var(--bg-surface-subtle)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--skarion-navy)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            ✏️ Post New Calendar Audit Entry
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Logged By (Evaluator)</label>
              <select value={noteAuthor} onChange={(e) => setNoteAuthor(e.target.value)} className="input-control" required style={{ fontWeight: '700', color: 'var(--skarion-navy)' }}>
                {EVALUATORS.map(evaluator => (
                  <option key={evaluator} value={evaluator}>✍️ {evaluator}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Candidate</label>
              <select value={targetStudentId} onChange={(e) => setTargetStudentId(e.target.value)} className="input-control" required>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Category</label>
              <select value={noteCategory} onChange={(e) => setNoteCategory(e.target.value)} className="input-control">
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Audit Date</label>
              <input type="date" value={noteDate} onChange={(e) => setNoteDate(e.target.value)} className="input-control" required />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Mentor Feedback / Audit Observations</label>
            <textarea 
              rows={3} 
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record candidate progress, mock evaluation notes, or assignment feedback..."
              className="input-control"
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-navy">Save Audit Log</button>
          </div>
        </form>
      )}

      {/* Enterprise Audit Log Cards Grid */}
      {sortedNotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>No audit entries found matching your criteria.</p>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowAddForm(true)}>
            Create Audit Entry
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {sortedNotes.map((note) => {
            const ratingObj = RATING_CONFIG[note.studentRating] || RATING_CONFIG.good;
            const accentClass = note.accent === 'orange' ? 'audit-card-orange' : note.accent === 'green' ? 'audit-card-green' : note.accent === 'blue' ? 'audit-card-blue' : note.accent === 'amber' ? 'audit-card-amber' : '';

            return (
              <div 
                key={note.id}
                className={`audit-card ${accentClass}`}
              >
                <div>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: '800', 
                      background: 'var(--bg-surface-subtle)', 
                      color: 'var(--skarion-navy)', 
                      padding: '0.2rem 0.55rem', 
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      textTransform: 'uppercase'
                    }}>
                      {note.category}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onTogglePinStickyNote(note.studentId, note.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: note.pinned ? 1 : 0.4 }}
                        title={note.pinned ? 'Unpin audit log' : 'Pin audit log to top'}
                      >
                        <Pin size={14} color={note.pinned ? 'var(--skarion-orange)' : 'var(--text-muted)'} fill={note.pinned ? 'var(--skarion-orange)' : 'none'} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteStickyNote(note.studentId, note.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}
                        title="Delete audit entry"
                      >
                        <Trash2 size={14} color="var(--text-muted)" />
                      </button>
                    </div>
                  </div>

                  {/* Student Tag */}
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
                      padding: '0.4rem 0.65rem', 
                      borderRadius: '8px',
                      marginBottom: '0.75rem',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.86rem', color: 'var(--skarion-navy)' }}>
                      <span>{ratingObj.icon}</span>
                      <span>{note.studentName}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Content */}
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5', fontWeight: '500' }}>
                    "{note.content}"
                  </p>
                </div>

                {/* Footer with Evaluator Name */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <span style={{ color: 'var(--skarion-navy)', fontWeight: '800' }}>✍️ Logged by: {note.author}</span>
                  {note.pinned && (
                    <span style={{ color: 'var(--skarion-orange)', fontWeight: '700' }}>📌 Pinned</span>
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

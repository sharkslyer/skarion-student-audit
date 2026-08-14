import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  User, 
  FileText, 
  CheckCircle2, 
  Send,
  Plus,
  Trash2,
  Tag,
  Clock,
  Sparkles,
  MessageSquare,
  X
} from 'lucide-react';
import { RATING_CONFIG, EVALUATOR_CONFIG, EVALUATORS } from '../data/initialData';

const CALENDAR_CUSTOM_NOTES_KEY = 'SKARION_CALENDAR_CUSTOM_NOTES_V2';

const NOTE_TAGS = ['General', 'Reminder', 'Meeting', 'Mock Prep', 'Urgent', 'Milestone'];

const TAG_STYLES = {
  General: { bg: 'rgba(56, 189, 248, 0.12)', color: '#0284c7', border: 'rgba(56, 189, 248, 0.3)' },
  Reminder: { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: 'rgba(245, 158, 11, 0.3)' },
  Meeting: { bg: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', border: 'rgba(124, 58, 237, 0.3)' },
  'Mock Prep': { bg: 'rgba(255, 82, 82, 0.12)', color: 'var(--skarion-orange)', border: 'rgba(255, 82, 82, 0.3)' },
  Urgent: { bg: 'rgba(220, 38, 38, 0.12)', color: '#dc2626', border: 'rgba(220, 38, 38, 0.3)' },
  Milestone: { bg: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: 'rgba(5, 150, 105, 0.3)' },
};

export default function CalendarView({ students, onSelectStudent }) {
  const [currentDate, setCurrentDate] = useState(() => new Date()); // Always loads at current month & year
  const [selectedDayNotes, setSelectedDayNotes] = useState(null);
  const [hoveredDayNum, setHoveredDayNum] = useState(null);

  // Custom Day Notes State
  const [customNotes, setCustomNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(CALENDAR_CUSTOM_NOTES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading calendar custom notes', e);
    }
    return [
      {
        id: 'cal-sample-1',
        date: '2026-08-14',
        content: 'Mock Interview evaluations review & OSP tech prep check',
        author: 'Mayukh',
        tag: 'General',
        createdAt: '2026-08-14T08:00:00.000Z'
      }
    ];
  });

  // New Note Form State
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState(EVALUATORS[0] || 'Mayukh');
  const [newNoteTag, setNewNoteTag] = useState('General');

  const saveCustomNotes = (newNotes) => {
    setCustomNotes(newNotes);
    try {
      localStorage.setItem(CALENDAR_CUSTOM_NOTES_KEY, JSON.stringify(newNotes));
    } catch (e) {
      console.error('Error saving calendar custom notes', e);
    }
  };

  const handleAddCustomNote = (date) => {
    if (!newNoteContent.trim()) return;
    const newNote = {
      id: `custom-note-${Date.now()}`,
      date,
      content: newNoteContent.trim(),
      author: newNoteAuthor,
      tag: newNoteTag,
      createdAt: new Date().toISOString()
    };
    const updated = [newNote, ...customNotes];
    saveCustomNotes(updated);
    setNewNoteContent('');
    
    // Update selected day notes in modal
    if (selectedDayNotes && selectedDayNotes.formattedDate === date) {
      setSelectedDayNotes({
        ...selectedDayNotes,
        dayCustomNotes: [newNote, ...(selectedDayNotes.dayCustomNotes || [])]
      });
    }
  };

  const handleDeleteCustomNote = (noteId) => {
    const updated = customNotes.filter(n => n.id !== noteId);
    saveCustomNotes(updated);
    if (selectedDayNotes) {
      setSelectedDayNotes({
        ...selectedDayNotes,
        dayCustomNotes: (selectedDayNotes.dayCustomNotes || []).filter(n => n.id !== noteId)
      });
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Aggregate events for each day
  const getDayEvents = (dayNum) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    // Custom notes on this day
    const dayCustomNotes = customNotes.filter(n => n.date === formattedDate);

    // Students who joined on this day
    const joiningStudents = students.filter(s => s.joiningDate === formattedDate);

    // Audit logs on this day
    const notesOnDay = students.flatMap(s => 
      (s.stickyNotes || [])
        .filter(n => n.date === formattedDate)
        .map(n => ({ ...n, studentName: s.name, studentRating: s.rating, studentId: s.id }))
    );

    // Mock interviews on this day
    const mocksOnDay = students.flatMap(s => 
      (s.mockSessions || [])
        .filter(m => m.date === formattedDate)
        .map(m => ({ ...m, studentName: s.name, studentRating: s.rating, studentId: s.id }))
    );

    return { dayCustomNotes, joiningStudents, notesOnDay, mocksOnDay, formattedDate };
  };

  const dayGrid = [];
  for (let i = 0; i < firstDayIndex; i++) {
    dayGrid.push(null); // Empty slot for previous month
  }
  for (let d = 1; d <= totalDays; d++) {
    dayGrid.push(d);
  }

  return (
    <div className="card-panel" style={{ padding: '1.75rem' }}>
      {/* Calendar Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarIcon size={22} color="var(--skarion-orange)" /> SKARION Audit Calendar Timeline
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Interactive timeline mapping custom day notes, mock interviews, student joining milestones, and mentor audit events.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ height: '38px', padding: '0 0.85rem' }} onClick={prevMonth}>
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', minWidth: '160px', textAlign: 'center', color: 'var(--skarion-navy)' }}>
            {monthNames[month]} {year}
          </span>
          <button className="btn-secondary" style={{ height: '38px', padding: '0 0.85rem' }} onClick={nextMonth}>
            Next <ChevronRight size={16} />
          </button>
          <button className="btn-navy" style={{ height: '38px', padding: '0 1rem' }} onClick={todayMonth}>
            Today
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '8px', marginBottom: '8px', textAlign: 'center', width: '100%' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ background: 'var(--skarion-navy)', color: '#ffffff', fontSize: '0.76rem', fontWeight: '800', padding: '0.55rem 0.2rem', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '8px', width: '100%' }}>
        {dayGrid.map((dayNum, idx) => {
          if (!dayNum) {
            return (
              <div 
                key={`empty-${idx}`} 
                style={{ 
                  minHeight: '115px', 
                  background: 'var(--bg-surface-subtle)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)',
                  opacity: 0.4,
                  minWidth: 0,
                  overflow: 'hidden'
                }} 
              />
            );
          }

          const { dayCustomNotes, joiningStudents, notesOnDay, mocksOnDay, formattedDate } = getDayEvents(dayNum);
          const totalEvents = dayCustomNotes.length + joiningStudents.length + notesOnDay.length + mocksOnDay.length;
          const hasEvents = totalEvents > 0;
          const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();
          const isHovered = hoveredDayNum === dayNum;

          // Unified list of all audits, custom notes, mocks, and milestones for this date
          const allDayItems = [
            ...dayCustomNotes.map(cn => ({ type: 'customNote', data: cn, id: cn.id })),
            ...mocksOnDay.map(m => ({ type: 'mock', data: m, id: m.id })),
            ...notesOnDay.map(n => ({ type: 'auditNote', data: n, id: n.id })),
            ...joiningStudents.map(s => ({ type: 'joining', data: s, id: s.id }))
          ];

          // Threshold for adding "See all" tab
          const MAX_VISIBLE_CHIPS = 3;
          const visibleItems = allDayItems.slice(0, MAX_VISIBLE_CHIPS);
          const remainingCount = allDayItems.length - MAX_VISIBLE_CHIPS;

          return (
            <div
              key={dayNum}
              onMouseEnter={() => setHoveredDayNum(dayNum)}
              onMouseLeave={() => setHoveredDayNum(null)}
              onClick={() => setSelectedDayNotes({ dayNum, formattedDate, dayCustomNotes, joiningStudents, notesOnDay, mocksOnDay })}
              style={{
                minHeight: '125px',
                background: isToday ? 'rgba(255, 82, 82, 0.08)' : 'var(--bg-surface)',
                border: isToday ? '2px solid var(--skarion-orange)' : isHovered ? '1.5px solid var(--skarion-navy)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.6rem 0.55rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isHovered ? 'var(--shadow-md)' : hasEvents ? 'var(--shadow-sm)' : 'none',
                minWidth: 0,
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
              title="Click to add note or view all details"
            >
              <div>
                {/* Day Number and in-date Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', gap: '2px', minWidth: 0 }}>
                  <span style={{ 
                    fontWeight: '800', 
                    fontSize: '0.92rem',
                    color: isToday ? 'var(--skarion-orange)' : 'var(--skarion-navy)',
                    flexShrink: 0
                  }}>
                    {dayNum}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                    {hasEvents && (
                      <span style={{ fontSize: '0.68rem', background: 'var(--skarion-orange)', color: 'white', padding: '1px 5px', borderRadius: '99px', fontWeight: '800' }}>
                        {totalEvents}
                      </span>
                    )}
                    
                    {/* + Note Button appearing directly inside the date card */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDayNotes({ dayNum, formattedDate, dayCustomNotes, joiningStudents, notesOnDay, mocksOnDay });
                      }}
                      style={{
                        background: 'var(--skarion-navy)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        padding: '1px 5px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        opacity: isHovered ? 1 : 0.65,
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap'
                      }}
                      title="Add note for this date"
                    >
                      <Plus size={10} /> Note
                    </button>
                  </div>
                </div>

                {/* Day Event Chips rendered inside the date tile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden', minWidth: 0, width: '100%' }}>
                  {visibleItems.map(item => {
                    if (item.type === 'customNote') {
                      const cn = item.data;
                      const tagStyle = TAG_STYLES[cn.tag] || TAG_STYLES.General;
                      return (
                        <div 
                          key={cn.id} 
                          style={{ 
                            fontSize: '0.67rem', 
                            background: tagStyle.bg, 
                            color: tagStyle.color, 
                            border: `1px solid ${tagStyle.border}`, 
                            padding: '2px 4px', 
                            borderRadius: '4px', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            minWidth: 0,
                            maxWidth: '100%'
                          }}
                          title={`[${cn.author} • ${cn.tag}]: ${cn.content}`}
                        >
                          <span style={{ flexShrink: 0 }}>📝</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{cn.content}</span>
                        </div>
                      );
                    }

                    if (item.type === 'mock') {
                      const m = item.data;
                      return (
                        <div 
                          key={m.id} 
                          style={{ 
                            fontSize: '0.67rem', 
                            background: 'rgba(124, 58, 237, 0.12)', 
                            color: '#7c3aed', 
                            border: '1px solid rgba(124, 58, 237, 0.3)', 
                            padding: '2px 4px', 
                            borderRadius: '4px', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            fontWeight: '700',
                            minWidth: 0,
                            maxWidth: '100%'
                          }}
                          title={`Mock Interview: ${m.studentName} (${m.score}/10) by ${m.evaluator}`}
                        >
                          🎙️ {m.studentName} ({m.score}/10)
                        </div>
                      );
                    }

                    if (item.type === 'auditNote') {
                      const n = item.data;
                      const evalCfg = EVALUATOR_CONFIG[n.author] || EVALUATOR_CONFIG.Mayukh;
                      return (
                        <div 
                          key={n.id} 
                          style={{ 
                            fontSize: '0.67rem', 
                            background: evalCfg.bg, 
                            color: evalCfg.text, 
                            border: `1px solid ${evalCfg.border}`, 
                            padding: '2px 4px', 
                            borderRadius: '4px', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            fontWeight: '700',
                            minWidth: 0,
                            maxWidth: '100%'
                          }}
                          title={`Audit Note: ${n.studentName} (${n.category || 'Audit'}): ${n.content} by ${n.author}`}
                        >
                          📌 {n.studentName}
                        </div>
                      );
                    }

                    if (item.type === 'joining') {
                      const s = item.data;
                      return (
                        <div 
                          key={s.id} 
                          style={{ 
                            fontSize: '0.67rem', 
                            background: 'rgba(5, 150, 105, 0.12)', 
                            color: '#059669', 
                            border: '1px solid rgba(5, 150, 105, 0.3)', 
                            padding: '2px 4px', 
                            borderRadius: '4px', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            fontWeight: '700',
                            minWidth: 0,
                            maxWidth: '100%'
                          }}
                          title={`${s.name} Joined`}
                        >
                          🚀 {s.name} Joined
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>

              {/* "See all N audits →" Tab at Bottom of Day Card */}
              {remainingCount > 0 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDayNotes({ dayNum, formattedDate, dayCustomNotes, joiningStudents, notesOnDay, mocksOnDay });
                  }}
                  style={{
                    marginTop: '4px',
                    background: 'rgba(19, 34, 71, 0.08)',
                    color: 'var(--skarion-navy)',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '5px',
                    fontSize: '0.66rem',
                    fontWeight: '800',
                    padding: '2px 4px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.15s ease'
                  }}
                  title={`View all ${allDayItems.length} audits and events for ${formattedDate}`}
                >
                  <span>See all {allDayItems.length} audits →</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day Details & Custom Notes Popover Modal */}
      {selectedDayNotes && (
        <div className="modal-backdrop" onClick={() => setSelectedDayNotes(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <CalendarIcon size={20} color="var(--skarion-orange)" />
                  Timeline & Notes for {selectedDayNotes.formattedDate}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Manage custom notes, view mock interviews, and student milestones for this day.
                </span>
              </div>
              <button className="btn-secondary" style={{ height: '36px' }} onClick={() => setSelectedDayNotes(null)}>
                <X size={16} /> Close
              </button>
            </div>

            {/* 📝 Add Custom Note Form */}
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '14px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={16} color="var(--skarion-orange)" />
                Add Custom Note / Reminder for {selectedDayNotes.formattedDate}
              </div>

              <textarea 
                className="input-control"
                placeholder="Type note, reminder, team meeting schedule, or follow-up details..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                style={{ width: '100%', minHeight: '65px', fontSize: '0.84rem', padding: '0.65rem', marginBottom: '0.65rem', resize: 'vertical' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)' }}>Author:</span>
                    <select 
                      value={newNoteAuthor}
                      onChange={(e) => setNewNoteAuthor(e.target.value)}
                      className="input-control"
                      style={{ height: '34px', fontSize: '0.78rem', fontWeight: '700', padding: '0 0.5rem' }}
                    >
                      {EVALUATORS.map(author => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)' }}>Tag:</span>
                    <select 
                      value={newNoteTag}
                      onChange={(e) => setNewNoteTag(e.target.value)}
                      className="input-control"
                      style={{ height: '34px', fontSize: '0.78rem', fontWeight: '700', padding: '0 0.5rem' }}
                    >
                      {NOTE_TAGS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  className="btn-primary"
                  onClick={() => handleAddCustomNote(selectedDayNotes.formattedDate)}
                  style={{ height: '36px', padding: '0 1rem', fontSize: '0.82rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Plus size={15} /> Save Note
                </button>
              </div>
            </div>

            {/* 📝 Existing Custom Day Notes */}
            {selectedDayNotes.dayCustomNotes && selectedDayNotes.dayCustomNotes.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--skarion-navy)', fontWeight: '800', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>📝 Custom Notes for this Date ({selectedDayNotes.dayCustomNotes.length})</span>
                </h4>
                {selectedDayNotes.dayCustomNotes.map(n => {
                  const tagStyle = TAG_STYLES[n.tag] || TAG_STYLES.General;
                  return (
                    <div 
                      key={n.id} 
                      style={{ 
                        background: 'var(--bg-surface)', 
                        padding: '0.85rem 1rem', 
                        borderRadius: '12px', 
                        marginBottom: '0.5rem', 
                        border: '1px solid var(--border-color)',
                        borderLeft: `4px solid ${tagStyle.color}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: '800', 
                            background: tagStyle.bg, 
                            color: tagStyle.color, 
                            padding: '1px 6px', 
                            borderRadius: '4px', 
                            border: `1px solid ${tagStyle.border}` 
                          }}>
                            {n.tag}
                          </span>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                            by {n.author}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.45', fontWeight: '500' }}>
                          {n.content}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleDeleteCustomNote(n.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                        title="Delete note"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 🎙️ Mock Interviews on this Date */}
            {selectedDayNotes.mocksOnDay && selectedDayNotes.mocksOnDay.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#7c3aed', fontWeight: '800', marginBottom: '0.65rem' }}>
                  🎙️ Mock Interviews on this Date ({selectedDayNotes.mocksOnDay.length}):
                </h4>
                {selectedDayNotes.mocksOnDay.map(m => (
                  <div 
                    key={m.id} 
                    style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '0.5rem', border: '1px solid var(--border-color)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '800', color: 'var(--skarion-navy)', fontSize: '0.92rem' }}>{m.studentName} ({m.category})</span>
                      <span style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800', border: '1px solid rgba(124, 58, 237, 0.25)' }}>
                        Score: {m.score}/10 • Evaluator: {m.evaluator}
                      </span>
                    </div>
                    {m.feedback && (
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontStyle: 'italic', margin: 0 }}>"{m.feedback}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 🚀 Joining Candidates */}
            {selectedDayNotes.joiningStudents && selectedDayNotes.joiningStudents.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#059669', fontWeight: '800', marginBottom: '0.65rem' }}>
                  🚀 Candidates Joined on this Date ({selectedDayNotes.joiningStudents.length}):
                </h4>
                {selectedDayNotes.joiningStudents.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => { setSelectedDayNotes(null); onSelectStudent(s); }}
                    style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}
                  >
                    <span style={{ fontWeight: '800', color: 'var(--skarion-navy)', fontSize: '0.92rem' }}>{s.name}</span>
                    <span className={`status-badge badge-${s.rating}`}>{RATING_CONFIG[s.rating]?.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 📌 Mentor Audit Notes on this Date */}
            {selectedDayNotes.notesOnDay && selectedDayNotes.notesOnDay.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--skarion-orange)', fontWeight: '800', marginBottom: '0.65rem' }}>
                  📌 Mentor Audit Notes on this Date ({selectedDayNotes.notesOnDay.length}):
                </h4>
                {selectedDayNotes.notesOnDay.map(n => {
                  const evalCfg = EVALUATOR_CONFIG[n.author] || EVALUATOR_CONFIG.Mayukh;
                  return (
                    <div key={n.id} className="card-panel" style={{ marginBottom: '0.75rem', padding: '0.95rem 1.15rem', borderLeft: `4px solid ${evalCfg.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.35rem', color: 'var(--skarion-navy)' }}>
                        <span>{n.studentName} ({n.category})</span>
                        <span style={{ 
                          color: evalCfg.text, 
                          background: evalCfg.bg, 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '5px', 
                          border: `1px solid ${evalCfg.border}` 
                        }}>
                          {n.author}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>"{n.content}"</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

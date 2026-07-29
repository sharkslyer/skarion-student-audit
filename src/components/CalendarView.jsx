import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, FileText, CheckCircle2 } from 'lucide-react';
import { RATING_CONFIG } from '../data/initialData';

export default function CalendarView({ students, onSelectStudent }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default July 2026
  const [selectedDayNotes, setSelectedDayNotes] = useState(null);

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
    
    // Students who joined on this day
    const joiningStudents = students.filter(s => s.joiningDate === formattedDate);

    // Audit logs on this day
    const notesOnDay = students.flatMap(s => 
      (s.stickyNotes || [])
        .filter(n => n.date === formattedDate)
        .map(n => ({ ...n, studentName: s.name, studentRating: s.rating, studentId: s.id }))
    );

    return { joiningStudents, notesOnDay, formattedDate };
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={22} color="var(--skarion-orange)" /> SKARION Audit Calendar Timeline
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Interactive month schedule mapping student joining milestones and logged mentor audit events.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ height: '38px', padding: '0 0.75rem' }} onClick={prevMonth}>
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', minWidth: '160px', textAlign: 'center', color: 'var(--skarion-navy)' }}>
            {monthNames[month]} {year}
          </span>
          <button className="btn-secondary" style={{ height: '38px', padding: '0 0.75rem' }} onClick={nextMonth}>
            Next <ChevronRight size={16} />
          </button>
          <button className="btn-navy" style={{ height: '38px', padding: '0 0.85rem' }} onClick={todayMonth}>
            Today
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px', textAlign: 'center' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ background: 'var(--skarion-navy)', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '0.5rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {dayGrid.map((dayNum, idx) => {
          if (!dayNum) {
            return (
              <div 
                key={`empty-${idx}`} 
                style={{ 
                  minHeight: '110px', 
                  background: 'var(--bg-surface-subtle)', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)',
                  opacity: 0.5
                }} 
              />
            );
          }

          const { joiningStudents, notesOnDay, formattedDate } = getDayEvents(dayNum);
          const hasEvents = joiningStudents.length > 0 || notesOnDay.length > 0;
          const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();

          return (
            <div
              key={dayNum}
              onClick={() => hasEvents && setSelectedDayNotes({ dayNum, formattedDate, joiningStudents, notesOnDay })}
              style={{
                minHeight: '110px',
                background: isToday ? 'rgba(255, 82, 82, 0.05)' : '#ffffff',
                border: isToday ? '2px solid var(--skarion-orange)' : '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.6rem',
                cursor: hasEvents ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: hasEvents ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontWeight: '800', 
                  fontSize: '0.92rem',
                  color: isToday ? 'var(--skarion-orange)' : 'var(--skarion-navy)'
                }}>
                  {dayNum}
                </span>
                {hasEvents && (
                  <span style={{ fontSize: '0.68rem', background: 'var(--skarion-orange)', color: 'white', padding: '1px 6px', borderRadius: '99px', fontWeight: '800' }}>
                    {joiningStudents.length + notesOnDay.length}
                  </span>
                )}
              </div>

              {/* Day Event Previews */}
              <div style={{ marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                {joiningStudents.map(s => (
                  <div key={s.id} style={{ fontSize: '0.68rem', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '2px 5px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '700' }}>
                    🚀 {s.name} Joined
                  </div>
                ))}

                {notesOnDay.map(n => (
                  <div key={n.id} style={{ fontSize: '0.68rem', background: 'rgba(19, 34, 71, 0.08)', color: 'var(--skarion-navy)', border: '1px solid rgba(19, 34, 71, 0.2)', padding: '2px 5px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '700' }}>
                    📝 {n.studentName}: {n.category}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Details Popover Modal */}
      {selectedDayNotes && (
        <div className="modal-backdrop" onClick={() => setSelectedDayNotes(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                📅 Audit Events for {selectedDayNotes.formattedDate}
              </h3>
              <button className="btn-secondary" onClick={() => setSelectedDayNotes(null)}>Close</button>
            </div>

            {/* Joining Candidates */}
            {selectedDayNotes.joiningStudents.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '800', marginBottom: '0.5rem' }}>
                  🚀 Candidates Joined on this Date:
                </h4>
                {selectedDayNotes.joiningStudents.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => { setSelectedDayNotes(null); onSelectStudent(s); }}
                    style={{ background: 'var(--bg-surface-subtle)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}
                  >
                    <span style={{ fontWeight: '700', color: 'var(--skarion-navy)' }}>{s.name} ({s.module})</span>
                    <span className={`status-badge badge-${s.rating}`}>{RATING_CONFIG[s.rating]?.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Audit Logs on this Date */}
            {selectedDayNotes.notesOnDay.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--skarion-orange)', fontWeight: '800', marginBottom: '0.5rem' }}>
                  📝 Mentor Audit Notes on this Date:
                </h4>
                {selectedDayNotes.notesOnDay.map(n => (
                  <div key={n.id} className="audit-card" style={{ marginBottom: '0.75rem', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--skarion-navy)' }}>
                      <span>{n.studentName} ({n.category})</span>
                      <span style={{ color: 'var(--text-muted)' }}>✍️ {n.author}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>"{n.content}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

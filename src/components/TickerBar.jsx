import React from 'react';
import { Volume2, BellRing, MessageSquare } from 'lucide-react';

export default function TickerBar({ students, onSelectStudent }) {
  // Collect all notes sorted by date descending
  const recentNotes = students.flatMap(student => 
    (student.stickyNotes || []).map(note => ({
      ...note,
      studentId: student.id,
      studentName: student.name
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (recentNotes.length === 0) return null;

  // Duplicate items for continuous seamless infinite loop
  const tickerItems = [...recentNotes, ...recentNotes];

  return (
    <div className="ticker-container">
      {/* Live Badge Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--skarion-orange)', padding: '0.25rem 0.65rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
        <BellRing size={14} color="white" />
        <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          LATEST AUDIT UPDATES
        </span>
      </div>

      {/* Side-Swiping Marquee Wrapper */}
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {tickerItems.map((item, idx) => {
            const student = students.find(s => s.id === item.studentId);
            return (
              <div 
                key={`${item.id}-${idx}`}
                className="ticker-item"
                onClick={() => student && onSelectStudent(student)}
                title="Click to view candidate audit trail"
              >
                <span style={{ color: '#ff8a8a', fontWeight: '800' }}>✍️ {item.author}:</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>{item.studentName}</span>
                <span style={{ opacity: 0.85, fontStyle: 'italic' }}>— "{item.content}"</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.6, background: 'rgba(255,255,255,0.1)', padding: '1px 5px', borderRadius: '4px' }}>
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

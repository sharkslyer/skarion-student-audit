import React from 'react';
import { BellRing, ChevronRight } from 'lucide-react';
import { EVALUATOR_CONFIG } from '../data/initialData';

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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.45rem', 
        background: 'var(--skarion-orange)', 
        padding: '0.35rem 0.85rem', 
        borderRadius: '8px', 
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(255, 82, 82, 0.4)'
      }}>
        <BellRing size={14} color="white" />
        <span style={{ fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          LATEST OBSERVATIONS
        </span>
      </div>

      {/* Side-Swiping Marquee Wrapper (Slower 90s Smooth Animation) */}
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {tickerItems.map((item, idx) => {
            const student = students.find(s => s.id === item.studentId);
            const evalCfg = EVALUATOR_CONFIG[item.author] || EVALUATOR_CONFIG.Mayukh;

            return (
              <div 
                key={`${item.id}-${idx}`}
                className="ticker-item"
                onClick={() => student && onSelectStudent(student)}
                title="Click candidate to view full audit record"
              >
                <span style={{ 
                  background: evalCfg.bg, 
                  color: evalCfg.text, 
                  fontWeight: '800', 
                  fontSize: '0.74rem',
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '5px',
                  border: `1px solid ${evalCfg.border}` 
                }}>
                  ✍️ {item.author}
                </span>

                <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '0.86rem' }}>
                  {item.studentName}
                </span>

                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.84rem', fontWeight: '500' }}>
                  "{item.content.length > 70 ? item.content.slice(0, 70) + '...' : item.content}"
                </span>

                <span style={{ 
                  fontSize: '0.72rem', 
                  color: 'rgba(255,255,255,0.6)', 
                  fontWeight: '600',
                  marginLeft: '0.2rem' 
                }}>
                  {item.date}
                </span>

                <ChevronRight size={13} color="rgba(255,255,255,0.4)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

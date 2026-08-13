import React, { useState, useEffect } from 'react';
import { BellRing, ChevronLeft, ChevronRight, Calendar, User, ArrowRight, Pause, Play } from 'lucide-react';
import { EVALUATOR_CONFIG, CATEGORY_COLORS } from '../data/initialData';

export default function TickerBar({ students, onSelectStudent }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Collect all audit notes sorted by date descending
  const recentNotes = students.flatMap(student => 
    (student.stickyNotes || []).map(note => ({
      ...note,
      studentId: student.id,
      studentName: student.name
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalNotes = recentNotes.length;

  // Auto-cycle through observations every 5 seconds unless paused
  useEffect(() => {
    if (totalNotes <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalNotes);
    }, 5500);

    return () => clearInterval(timer);
  }, [totalNotes, isPaused]);

  if (totalNotes === 0) return null;

  const currentNote = recentNotes[currentIndex] || recentNotes[0];
  const student = students.find(s => s.id === currentNote.studentId);
  const evalCfg = EVALUATOR_CONFIG[currentNote.author] || EVALUATOR_CONFIG.Mayukh;
  const catColor = CATEGORY_COLORS[currentNote.category] || CATEGORY_COLORS.General;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + totalNotes) % totalNotes);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalNotes);
  };

  return (
    <div 
      className="card-panel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ 
        marginBottom: '1.5rem',
        padding: '1.15rem 1.35rem',
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        transition: 'all 0.25s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Category / Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'var(--skarion-orange)', 
            color: '#ffffff',
            padding: '0.35rem 0.85rem', 
            borderRadius: '8px', 
            fontWeight: '800', 
            fontSize: '0.74rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(255, 82, 82, 0.35)'
          }}>
            <BellRing size={14} color="#ffffff" />
            <span>LATEST OBSERVATIONS</span>
          </div>

          <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--text-muted)' }}>
            Audit #{currentIndex + 1} of {totalNotes}
          </span>
        </div>

        {/* Right Side: Evaluator & Category Badges + Auto-Cycle Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          
          {/* Category Pill */}
          {currentNote.category && (
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: '800', 
              background: catColor.bg, 
              color: catColor.text, 
              border: `1px solid ${catColor.border}`, 
              padding: '2px 8px', 
              borderRadius: '6px' 
            }}>
              {currentNote.category}
            </span>
          )}

          {/* Evaluator Pill */}
          <span style={{ 
            background: evalCfg.bg, 
            color: evalCfg.text, 
            fontWeight: '800', 
            fontSize: '0.74rem',
            padding: '2px 8px', 
            borderRadius: '6px',
            border: `1px solid ${evalCfg.border}` 
          }}>
            Evaluator: {currentNote.author}
          </span>

          {/* Date Tag */}
          <span style={{ 
            fontSize: '0.74rem', 
            fontWeight: '700', 
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Calendar size={13} /> {currentNote.date}
          </span>

          {/* Play/Pause Auto-Cycle Indicator */}
          <span 
            onClick={() => setIsPaused(!isPaused)}
            style={{ 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.2rem',
              fontSize: '0.68rem',
              fontWeight: '800',
              color: isPaused ? 'var(--skarion-orange)' : 'var(--text-dim)',
              background: 'var(--bg-surface)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)'
            }}
            title={isPaused ? "Auto-cycle paused (click to resume)" : "Auto-cycling (hover or click to pause)"}
          >
            {isPaused ? <Pause size={11} /> : <Play size={11} />}
            {isPaused ? 'Paused' : 'Auto'}
          </span>

        </div>

      </div>

      {/* Center Spotlight Card Body with Left & Right Manual Cycle Arrows */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justify: 'space-between', 
        marginTop: '0.9rem',
        gap: '0.85rem'
      }}>
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="btn-icon"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Previous Observation"
        >
          <ChevronLeft size={20} color="var(--skarion-navy)" />
        </button>

        {/* Spacious Observation Content Card */}
        <div 
          onClick={() => student && onSelectStudent(student)}
          style={{ 
            flex: '1', 
            background: 'var(--bg-surface)', 
            border: '1.5px solid var(--border-color)', 
            borderRadius: '14px', 
            padding: '1rem 1.35rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.15s ease, border-color 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <User size={16} color="var(--skarion-orange)" />
              <span style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--skarion-navy)' }}>
                {currentNote.studentName}
              </span>
            </div>

            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View Candidate Profile <ArrowRight size={13} />
            </span>
          </div>

          {/* Audit Note Content Text */}
          <p style={{ 
            fontSize: '0.92rem', 
            color: 'var(--text-main)', 
            lineHeight: '1.6', 
            margin: '0.2rem 0', 
            fontWeight: '500',
            fontStyle: 'italic'
          }}>
            "{currentNote.content}"
          </p>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="btn-icon"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Next Observation"
        >
          <ChevronRight size={20} color="var(--skarion-navy)" />
        </button>

      </div>

      {/* Bottom Pagination Dots */}
      {totalNotes > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', marginTop: '0.85rem' }}>
          {recentNotes.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '22px' : '7px',
                height: '7px',
                borderRadius: '4px',
                background: i === currentIndex ? 'var(--skarion-orange)' : 'var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              title={`Jump to observation #${i + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
}

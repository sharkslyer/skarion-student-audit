import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight, Sparkles, Quote, Pause, Play } from 'lucide-react';
import { EVALUATOR_CONFIG, CATEGORY_COLORS } from '../data/initialData';

export default function TickerBar({ students, onSelectStudent }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeKey, setFadeKey] = useState(0); // Triggers card switch animation

  // Collect top 10 latest audit notes sorted by date descending
  const recentNotes = students.flatMap(student => 
    (student.stickyNotes || []).map(note => ({
      ...note,
      studentId: student.id,
      studentName: student.name
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  const totalNotes = recentNotes.length;

  // Auto-cycle through top 10 observations every 4.0 seconds (4000ms) with smooth progress bar
  useEffect(() => {
    if (totalNotes <= 1 || isPaused) return;

    // Reset progress bar on new card
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (40 / 4000) * 100;
      });
    }, 40);

    const cardTimer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalNotes);
      setFadeKey(prev => prev + 1);
      setProgress(0);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(cardTimer);
    };
  }, [totalNotes, isPaused, currentIndex]);

  if (totalNotes === 0) return null;

  const currentNote = recentNotes[currentIndex] || recentNotes[0];
  const student = students.find(s => s.id === currentNote.studentId);
  const evalCfg = EVALUATOR_CONFIG[currentNote.author] || EVALUATOR_CONFIG.Mayukh;
  const catColor = CATEGORY_COLORS[currentNote.category] || CATEGORY_COLORS.General;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + totalNotes) % totalNotes);
    setFadeKey(prev => prev + 1);
    setProgress(0);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % totalNotes);
    setFadeKey(prev => prev + 1);
    setProgress(0);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.75rem' }}>
      
      {/* Center-Stage Eyegrabbing Spotlight Card Container */}
      <div 
        className="card-panel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ 
          width: '100%',
          maxWidth: '860px',
          padding: '1.35rem 1.65rem',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%)',
          border: '2px solid var(--skarion-orange)',
          borderRadius: '20px',
          boxShadow: '0 12px 35px rgba(255, 82, 82, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        
        {/* Top Progress Line Bar (Auto-Fills every 4 seconds) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '4px',
          width: isPaused ? `${progress}%` : `${progress}%`,
          background: 'linear-gradient(90deg, #ff5252 0%, #7c3aed 50%, #0284c7 100%)',
          transition: isPaused ? 'none' : 'width 40ms linear',
          zIndex: 10
        }} />

        {/* Header Bar: Eye-Grabbing Pulsing Badge + Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          {/* Pulsing Live Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              background: 'linear-gradient(135deg, #ff5252 0%, #e04343 100%)', 
              color: '#ffffff',
              padding: '0.4rem 0.95rem', 
              borderRadius: '99px', 
              fontWeight: '900', 
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(255, 82, 82, 0.4)'
            }}>
              <Sparkles size={15} color="#ffffff" />
              <span>TOP 10 LATEST AUDITS</span>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#ffffff',
                display: 'inline-block',
                marginLeft: '2px',
                animation: 'pulseRing 1.5s infinite'
              }} />
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>
              Top #{currentIndex + 1} of {totalNotes}
            </span>
          </div>

          {/* Right Header Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Category Tag */}
            {currentNote.category && (
              <span style={{ 
                fontSize: '0.74rem', 
                fontWeight: '800', 
                background: catColor.bg, 
                color: catColor.text, 
                border: `1px solid ${catColor.border}`, 
                padding: '3px 10px', 
                borderRadius: '8px' 
              }}>
                {currentNote.category}
              </span>
            )}

            {/* Evaluator Badge */}
            <span style={{ 
              background: evalCfg.bg, 
              color: evalCfg.text, 
              fontWeight: '800', 
              fontSize: '0.76rem',
              padding: '3px 10px', 
              borderRadius: '8px',
              border: `1px solid ${evalCfg.border}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              ✍️ {currentNote.author}
            </span>

            {/* Hover Status Indicator */}
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: '800', 
              color: isPaused ? '#ff5252' : 'var(--text-muted)',
              background: 'var(--bg-surface)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              {isPaused ? <Pause size={12} color="#ff5252" /> : <Play size={12} />}
              {isPaused ? 'Paused (Hovering)' : 'Cycling (4s)'}
            </span>
          </div>

        </div>

        {/* Center Main Stage Content with Left & Right Floating Arrow Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '2px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
              outline: 'none'
            }}
            title="Previous Top 10 Audit"
          >
            <ChevronLeft size={24} color="var(--skarion-navy)" />
          </button>

          {/* Main Hero Spotlight Quote Card with Fixed Height & Fade Animation */}
          <div 
            key={fadeKey}
            onClick={() => student && onSelectStudent(student)}
            className="animate-pop-in"
            style={{ 
              flex: '1', 
              height: '120px',
              minHeight: '120px',
              maxHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              background: 'var(--bg-surface)', 
              border: '2px solid var(--border-color)', 
              borderRadius: '16px', 
              padding: '1.05rem 1.45rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden'
            }}
          >
            {/* Candidate Title & Date Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <User size={18} color="var(--skarion-orange)" />
                <span style={{ fontWeight: '900', fontSize: '1.05rem', color: 'var(--skarion-navy)', letterSpacing: '-0.01em' }}>
                  {currentNote.studentName}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={13} /> {currentNote.date}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Open Audit Profile <ArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* Observation Quote Body with Line Clamping */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', overflow: 'hidden' }}>
              <Quote size={20} color="var(--skarion-orange)" style={{ flexShrink: 0, marginTop: '2px', opacity: 0.8 }} />
              <p style={{ 
                fontSize: '0.94rem', 
                color: 'var(--text-main)', 
                lineHeight: '1.5', 
                margin: 0, 
                fontWeight: '600',
                fontStyle: 'italic',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentNote.content}
              </p>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '2px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
              outline: 'none'
            }}
            title="Next Top 10 Audit"
          >
            <ChevronRight size={24} color="var(--skarion-navy)" />
          </button>

        </div>

        {/* Bottom Pagination Dots Bar */}
        {totalNotes > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '1rem' }}>
            {recentNotes.map((_, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                  setFadeKey(prev => prev + 1);
                  setProgress(0);
                }}
                style={{
                  width: i === currentIndex ? '26px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentIndex ? 'var(--skarion-orange)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                title={`Jump to top 10 audit #${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

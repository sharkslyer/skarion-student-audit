import React, { useState } from 'react';
import { GraduationCap, Briefcase, Award, Calendar, CheckCircle2, Sparkles, Rocket, PartyPopper, Flame, DollarSign, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PlacedCandidatesView({ students, onSelectStudent, onOpenAddModal }) {
  const placedStudents = students.filter(s => s.rating === 'placed');
  const [activeHype, setActiveHype] = useState(null);

  // Goofy Celebration 1: Fireworks Explosion
  const fireFireworks = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff5252', '#7c3aed', '#059669', '#f59e0b']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff5252', '#7c3aed', '#0284c7', '#ec4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
    triggerHypeText('🎆 BOOM! Fireworks Exploding!');
  };

  // Goofy Celebration 2: Rocket To The Moon
  const launchRocket = () => {
    confetti({
      particleCount: 150,
      startVelocity: 60,
      spread: 360,
      ticks: 100,
      origin: { x: 0.5, y: 0.8 },
      colors: ['#7c3aed', '#ff5252', '#fbbf24', '#ffffff']
    });
    triggerHypeText('🚀 TO THE MOON! Candidate Hired!');
  };

  // Goofy Celebration 3: Streamers & Balloons
  const popStreamers = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
      origin: { y: 0.5 }
    });
    triggerHypeText('🥳 PARTY TIME! Confetti Rain!');
  };

  // Goofy Celebration 4: Secure The Bag
  const secureTheBag = (studentName) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#34d399', '#fbbf24']
    });
    triggerHypeText(`💰 SECURED THE BAG! Congrats ${studentName || 'Alumni'}!`);
  };

  const triggerHypeText = (msg) => {
    setActiveHype(msg);
    setTimeout(() => setActiveHype(null), 3000);
  };

  return (
    <div className="card-panel" style={{ padding: '1.75rem', position: 'relative' }}>
      
      {/* Floating Goofy Hype Overlay */}
      {activeHype && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #7c3aed 0%, #ff5252 100%)',
          color: '#ffffff',
          padding: '1.25rem 2.5rem',
          borderRadius: '20px',
          fontWeight: '900',
          fontSize: '1.5rem',
          boxShadow: '0 20px 50px rgba(124, 58, 237, 0.6)',
          zIndex: 9999,
          textAlign: 'center',
          animation: 'scaleUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {activeHype}
        </div>
      )}

      {/* Header Banner with Goofy Control Deck */}
      <div style={{ 
        background: 'linear-gradient(135deg, #132247 0%, #2e1065 100%)', 
        padding: '1.5rem 1.75rem', 
        borderRadius: '16px', 
        color: '#ffffff',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
        border: '1px solid rgba(167, 139, 250, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <GraduationCap size={32} color="#c4b5fd" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#ffffff' }}>
              SKARION Placed Hall of Fame 🎓
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#c4b5fd' }}>
            Interactive celebration arena for hired candidates! Trigger goofy fireworks, rockets, and hype popups!
          </p>
        </div>

        {/* Goofy Global Celebration Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary"
            onClick={popStreamers}
            style={{ background: '#ec4899', border: 'none', padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
          >
            🥳 Party Rain
          </button>
          <button 
            className="btn-primary"
            onClick={launchRocket}
            style={{ background: '#7c3aed', border: 'none', padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
          >
            🚀 Rocket
          </button>
          <button 
            className="btn-primary"
            onClick={fireFireworks}
            style={{ background: '#ff5252', border: 'none', padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
          >
            🎆 Fireworks
          </button>
        </div>
      </div>

      {/* Grid of Placed Candidate Cards */}
      {placedStudents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          <GraduationCap size={52} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.35rem' }}>
            No candidates marked as Placed yet
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            When candidates secure job offers, set their rating mark to 🎓 Placed in the roster!
          </p>
          <button className="btn-primary" onClick={onOpenAddModal}>
            + Add Placed Candidate Record
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
          {placedStudents.map(student => (
            <div 
              key={student.id}
              style={{
                background: '#ffffff',
                border: '2px solid #ddd6fe',
                borderTop: '5px solid #7c3aed',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.1)',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
              className="card-panel"
            >
              <div>
                {/* Top header bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="status-badge badge-placed" style={{ fontWeight: '800' }}>
                    🎓 HIRED ALUMNI
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '6px' }}>
                    {student.mockInterviews || 0} Mocks Passed
                  </span>
                </div>

                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '1.25rem',
                    boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
                  }}>
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>{student.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Joined {new Date(student.joiningDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Company & Role Details */}
                <div style={{ background: '#f5f3ff', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '0.85rem', border: '1px solid #ede9fe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '0.95rem', color: '#6d28d9', marginBottom: '0.2rem' }}>
                    <Briefcase size={16} color="#7c3aed" />
                    <span>{student.placementCompany || 'Tech Company'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    Role: {student.placementRole || 'Software Engineer'}
                  </div>
                </div>

                {/* Latest Sticky Note / Feedback */}
                {student.stickyNotes && student.stickyNotes.length > 0 && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontStyle: 'italic', background: 'var(--bg-surface-subtle)', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid #7c3aed' }}>
                    "{student.stickyNotes[0].content}"
                  </p>
                )}
              </div>

              {/* Individual Candidate Goofy Action Buttons */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  🎉 Candidate Hype Controls:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  <button 
                    className="btn-secondary"
                    onClick={(e) => { e.stopPropagation(); secureTheBag(student.name); }}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontWeight: '700' }}
                  >
                    💰 Secure Bag
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={(e) => { e.stopPropagation(); fireFireworks(); }}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: '700' }}
                  >
                    🎆 Fireworks
                  </button>
                </div>

                <div 
                  onClick={() => onSelectStudent(student)}
                  style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed', textAlign: 'center', marginTop: '0.6rem', cursor: 'pointer' }}
                >
                  View Full Audit Log ➔
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

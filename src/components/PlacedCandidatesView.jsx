import React from 'react';
import { GraduationCap, Briefcase, Calendar } from 'lucide-react';

export default function PlacedCandidatesView({ students, onSelectStudent, onOpenAddModal }) {
  const placedStudents = students.filter(s => s.rating === 'placed');

  return (
    <div className="card-panel" style={{ padding: '1.75rem' }}>
      
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--skarion-navy) 0%, #1e1b4b 100%)', 
        padding: '1.5rem 1.75rem', 
        borderRadius: '16px', 
        color: '#ffffff',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
        border: '1px solid rgba(167, 139, 250, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <GraduationCap size={32} color="#c4b5fd" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#ffffff' }}>
              SKARION Placed Alumni Hall of Fame
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#c4b5fd' }}>
            Directory of candidates successfully placed in industry positions with company and role records.
          </p>
        </div>

        <span style={{
          background: 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          fontWeight: '800',
          fontSize: '0.85rem',
          padding: '0.45rem 0.95rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.25)'
        }}>
          {placedStudents.length} Placed Alumni
        </span>
      </div>

      {/* Grid of Placed Candidate Cards */}
      {placedStudents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          <GraduationCap size={52} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.35rem' }}>
            No candidates marked as Placed yet
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            When candidates secure job offers, set their rating mark to Placed in the roster!
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
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderTop: '5px solid #7c3aed',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
              className="card-panel"
            >
              <div>
                {/* Top header bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="status-badge badge-placed" style={{ fontWeight: '800' }}>
                    HIRED ALUMNI
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#7c3aed', background: 'rgba(124, 58, 237, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
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
                    justify: 'center',
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
                <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '0.85rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '0.95rem', color: '#7c3aed', marginBottom: '0.2rem' }}>
                    <Briefcase size={16} color="#7c3aed" />
                    <span>{student.placementCompany || 'Tech Company'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    Role: {student.placementRole || 'Software Engineer'}
                  </div>
                </div>

                {/* Latest Observation Feedback */}
                {student.stickyNotes && student.stickyNotes.length > 0 && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontStyle: 'italic', background: 'var(--bg-surface-subtle)', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid #7c3aed' }}>
                    "{student.stickyNotes[0].content}"
                  </p>
                )}
              </div>

              {/* Action Link */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
                <div 
                  onClick={() => onSelectStudent(student)}
                  style={{ fontSize: '0.8rem', fontWeight: '800', color: '#7c3aed', cursor: 'pointer' }}
                >
                  View Candidate Audit Trail ➔
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

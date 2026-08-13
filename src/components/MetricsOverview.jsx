import React from 'react';
import { Users, UserCheck, Award, AlertTriangle, AlertCircle, ThumbsUp, Mic, GraduationCap } from 'lucide-react';

export default function MetricsOverview({ students, selectedRatingFilter, setSelectedRatingFilter }) {
  const total = students.length;
  const placed = students.filter(s => s.rating === 'placed').length;
  const activeCandidates = students.filter(s => s.rating !== 'placed').length;
  const excellent = students.filter(s => s.rating === 'excellent').length;
  const good = students.filter(s => s.rating === 'good').length;
  const needsAttention = students.filter(s => s.rating === 'needs_attention').length;
  const bad = students.filter(s => s.rating === 'bad').length;

  const totalMocks = students.reduce((acc, s) => acc + (s.mockInterviews || 0), 0);
  const avgProgress = total > 0 ? Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / total) : 0;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '1rem', 
      marginBottom: '1.5rem' 
    }}>
      
      {/* Group 1: Candidate Enrolment & Active Roster KPI */}
      <div className="card-panel" style={{ padding: '1.15rem 1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--skarion-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Candidate Roster Overview
          </span>
          <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            {avgProgress}% Avg Completion
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
          {/* Total */}
          <div 
            onClick={() => setSelectedRatingFilter('all')}
            style={{ 
              background: selectedRatingFilter === 'all' ? 'rgba(56, 189, 248, 0.18)' : 'var(--bg-surface-subtle)', 
              padding: '0.65rem 0.4rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              border: selectedRatingFilter === 'all' ? '1px solid var(--skarion-navy)' : '1px solid var(--border-color)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--skarion-navy)', lineHeight: '1' }}>{total}</div>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>Total Enrolled</span>
          </div>

          {/* Active (Excl Placed) */}
          <div 
            onClick={() => setSelectedRatingFilter('active')}
            style={{ 
              background: selectedRatingFilter === 'active' ? 'rgba(2, 132, 199, 0.2)' : 'var(--bg-surface-subtle)', 
              padding: '0.65rem 0.4rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              border: selectedRatingFilter === 'active' ? '1px solid #0284c7' : '1px solid var(--border-color)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0284c7', lineHeight: '1' }}>{activeCandidates}</div>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0284c7' }}>Active Roster</span>
          </div>

          {/* Placed */}
          <div 
            onClick={() => setSelectedRatingFilter('placed')}
            style={{ 
              background: selectedRatingFilter === 'placed' ? 'rgba(124, 58, 237, 0.2)' : 'var(--bg-surface-subtle)', 
              padding: '0.65rem 0.4rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              border: selectedRatingFilter === 'placed' ? '1px solid #7c3aed' : '1px solid var(--border-color)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#7c3aed', lineHeight: '1' }}>{placed}</div>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#7c3aed' }}>Placed</span>
          </div>
        </div>
      </div>

      {/* Group 2: Rating Health Breakdown */}
      <div className="card-panel" style={{ padding: '1.15rem 1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--skarion-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Candidate Health Distribution
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Click pill to filter</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
          {/* Excellent */}
          <div 
            onClick={() => setSelectedRatingFilter(selectedRatingFilter === 'excellent' ? 'all' : 'excellent')}
            style={{ 
              background: selectedRatingFilter === 'excellent' ? 'rgba(5, 150, 105, 0.25)' : 'var(--rating-excellent-bg)', 
              border: '1px solid var(--rating-excellent-border)', 
              padding: '0.6rem 0.35rem', 
              borderRadius: '10px', 
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--rating-excellent-color)', lineHeight: '1' }}>{excellent}</div>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--rating-excellent-color)' }}>Excellent</span>
          </div>

          {/* Good */}
          <div 
            onClick={() => setSelectedRatingFilter(selectedRatingFilter === 'good' ? 'all' : 'good')}
            style={{ 
              background: selectedRatingFilter === 'good' ? 'rgba(2, 132, 199, 0.25)' : 'var(--rating-good-bg)', 
              border: '1px solid var(--rating-good-border)', 
              padding: '0.6rem 0.35rem', 
              borderRadius: '10px', 
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--rating-good-color)', lineHeight: '1' }}>{good}</div>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--rating-good-color)' }}>Good</span>
          </div>

          {/* Attention */}
          <div 
            onClick={() => setSelectedRatingFilter(selectedRatingFilter === 'needs_attention' ? 'all' : 'needs_attention')}
            style={{ 
              background: selectedRatingFilter === 'needs_attention' ? 'rgba(217, 119, 6, 0.25)' : 'var(--rating-attention-bg)', 
              border: '1px solid var(--rating-attention-border)', 
              padding: '0.6rem 0.35rem', 
              borderRadius: '10px', 
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--rating-attention-color)', lineHeight: '1' }}>{needsAttention}</div>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--rating-attention-color)' }}>Attention</span>
          </div>

          {/* At Risk */}
          <div 
            onClick={() => setSelectedRatingFilter(selectedRatingFilter === 'bad' ? 'all' : 'bad')}
            style={{ 
              background: selectedRatingFilter === 'bad' ? 'rgba(220, 38, 38, 0.25)' : 'var(--rating-bad-bg)', 
              border: '1px solid var(--rating-bad-border)', 
              padding: '0.6rem 0.35rem', 
              borderRadius: '10px', 
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--rating-bad-color)', lineHeight: '1' }}>{bad}</div>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--rating-bad-color)' }}>At Risk</span>
          </div>
        </div>
      </div>

      {/* Group 3: Evaluation Activity KPI */}
      <div className="card-panel" style={{ padding: '1.15rem 1.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--skarion-navy)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.2rem' }}>
            Mock Interviews Conducted
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', color: 'var(--skarion-orange)', lineHeight: '1' }}>
            {totalMocks} Sessions
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {(totalMocks / (total || 1)).toFixed(1)} avg mock interviews per candidate
          </p>
        </div>

        <div style={{ background: 'rgba(255, 82, 82, 0.15)', padding: '0.85rem', borderRadius: '14px' }}>
          <Mic size={28} color="var(--skarion-orange)" />
        </div>
      </div>

    </div>
  );
}

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

  const metrics = [
    {
      id: 'all',
      label: 'Total Candidates',
      count: total,
      subText: `${avgProgress}% avg course completion`,
      icon: Users,
      color: 'var(--skarion-navy)',
      bg: 'rgba(56, 189, 248, 0.15)'
    },
    {
      id: 'active',
      label: 'Active Candidates',
      count: activeCandidates,
      subText: `Excludes ${placed} placed alumni`,
      icon: UserCheck,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.15)'
    },
    {
      id: 'placed',
      label: 'Placed Alumni 🎓',
      count: placed,
      subText: `${total > 0 ? Math.round((placed / total) * 100) : 0}% placement rate`,
      icon: GraduationCap,
      color: '#7c3aed',
      bg: 'rgba(124, 58, 237, 0.15)'
    },
    {
      id: 'excellent',
      label: 'Excellent',
      count: excellent,
      subText: 'Ready for tech rounds',
      icon: Award,
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.15)'
    },
    {
      id: 'good',
      label: 'Good',
      count: good,
      subText: 'On target & steady',
      icon: ThumbsUp,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.15)'
    },
    {
      id: 'needs_attention',
      label: 'Needs Attention',
      count: needsAttention,
      subText: 'Requires mentor action',
      icon: AlertTriangle,
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.15)'
    },
    {
      id: 'bad',
      label: 'At Risk',
      count: bad,
      subText: 'Urgent escalation needed',
      icon: AlertCircle,
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.15)'
    },
    {
      id: 'mocks',
      label: 'Mock Interviews',
      count: totalMocks,
      subText: `${(totalMocks / (total || 1)).toFixed(1)} avg per candidate`,
      icon: Mic,
      color: 'var(--skarion-orange)',
      bg: 'rgba(255, 82, 82, 0.15)',
      noFilter: true
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
      {metrics.map((m) => {
        const Icon = m.icon;
        const isSelected = selectedRatingFilter === m.id;
        return (
          <div 
            key={m.id}
            onClick={() => !m.noFilter && setSelectedRatingFilter(isSelected ? 'all' : m.id)}
            className="card-panel"
            style={{
              padding: '1rem 1.15rem',
              cursor: m.noFilter ? 'default' : 'pointer',
              border: isSelected ? `2px solid ${m.color}` : '1px solid var(--border-color)',
              background: isSelected ? m.bg : 'var(--bg-surface)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                {m.label}
              </span>
              <div style={{ background: m.bg, padding: '0.35rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} color={m.color} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>
                {m.count}
              </span>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
              {m.subText}
            </p>
          </div>
        );
      })}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Users, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  GraduationCap, 
  Mic, 
  FileText, 
  Calendar, 
  Search, 
  ChevronRight, 
  ArrowUpRight, 
  Clock, 
  PieChart as PieIcon,
  Activity,
  Layers,
  HelpCircle,
  ExternalLink,
  Target,
  ShieldCheck,
  Star
} from 'lucide-react';
import { RATING_CONFIG, EVALUATORS, EVALUATOR_CONFIG } from '../data/initialData';

export default function AnalyticsView({ students, onSelectStudent }) {
  const [activeSection, setActiveSection] = useState('batch'); // 'batch' | 'candidate' | 'evaluators'
  const [selectedStudentId, setSelectedStudentId] = useState(() => students[0]?.id || '');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [hoveredPieIndex, setHoveredPieIndex] = useState(null);

  // Selected candidate object
  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0] || null;
  }, [students, selectedStudentId]);

  // Aggregate Batch Level Stats
  const batchStats = useMemo(() => {
    const totalCandidates = students.length;
    const placedCount = students.filter(s => s.rating === 'placed').length;
    const excellentCount = students.filter(s => s.rating === 'excellent').length;
    const goodCount = students.filter(s => s.rating === 'good').length;
    const attentionCount = students.filter(s => s.rating === 'needs_attention').length;
    const badCount = students.filter(s => s.rating === 'bad').length;

    // All mock sessions across all students
    const allMocks = students.flatMap(s => (s.mockSessions || []).map(m => ({
      ...m,
      studentName: s.name,
      studentId: s.id,
      studentRating: s.rating
    })));

    const totalMocks = allMocks.length;
    const validScores = allMocks.map(m => Number(m.score)).filter(s => !isNaN(s) && s > 0);
    const avgScore = validScores.length > 0
      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
      : '0.0';

    const passedMocks = validScores.filter(s => s >= 7.0).length;
    const mockPassRate = validScores.length > 0
      ? Math.round((passedMocks / validScores.length) * 100)
      : 0;

    const totalAuditNotes = students.reduce((acc, s) => acc + (s.stickyNotes?.length || 0), 0);

    // Score Brackets Distribution
    const scoreBrackets = [
      { label: '0 - 4.0', desc: 'At Risk / Developing', min: 0, max: 4.0, color: '#dc2626', mocks: [] },
      { label: '4.5 - 6.0', desc: 'Needs Polish', min: 4.1, max: 6.0, color: '#d97706', mocks: [] },
      { label: '6.5 - 7.5', desc: 'Good Progress', min: 6.1, max: 7.5, color: '#0284c7', mocks: [] },
      { label: '8.0 - 8.5', desc: 'High Quality', min: 7.6, max: 8.5, color: '#059669', mocks: [] },
      { label: '9.0 - 10', desc: 'Interview Ready', min: 8.6, max: 10, color: '#7c3aed', mocks: [] }
    ];

    allMocks.forEach(m => {
      const score = Number(m.score);
      if (!isNaN(score)) {
        const bracket = scoreBrackets.find(b => score >= b.min && score <= b.max) || scoreBrackets[0];
        bracket.mocks.push(m);
      }
    });

    // Evaluator Statistics
    const evaluatorStats = EVALUATORS.map(evaluator => {
      const evalMocks = allMocks.filter(m => m.evaluator === evaluator);
      const evalScores = evalMocks.map(m => Number(m.score)).filter(s => !isNaN(s));
      const evalAvg = evalScores.length > 0
        ? (evalScores.reduce((a, b) => a + b, 0) / evalScores.length).toFixed(1)
        : 'N/A';

      const evalNotes = students.flatMap(s => (s.stickyNotes || []).filter(n => n.author === evaluator));

      return {
        name: evaluator,
        mockCount: evalMocks.length,
        notesCount: evalNotes.length,
        avgScore: evalAvg,
        config: EVALUATOR_CONFIG[evaluator] || EVALUATOR_CONFIG.Mayukh
      };
    });

    // Domain Distribution
    const domainCounts = {};
    students.forEach(s => {
      const domain = s.targetRole || s.domain || 'Software Engineering';
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    return {
      totalCandidates,
      placedCount,
      excellentCount,
      goodCount,
      attentionCount,
      badCount,
      totalMocks,
      avgScore,
      mockPassRate,
      totalAuditNotes,
      scoreBrackets,
      evaluatorStats,
      domainCounts
    };
  }, [students]);

  // Candidate Deep Dive Computed Metrics
  const candidateMetrics = useMemo(() => {
    if (!currentStudent) return null;

    const mocks = currentStudent.mockSessions || [];
    const notes = currentStudent.stickyNotes || [];

    const scores = mocks.map(m => Number(m.score)).filter(s => !isNaN(s) && s > 0);
    const avgScore = scores.length > 0 
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) 
      : '0.0';

    const latestScore = scores.length > 0 ? scores[scores.length - 1] : 0;
    const firstScore = scores.length > 0 ? scores[0] : 0;
    const scoreDiff = (latestScore - firstScore).toFixed(1);

    // Compute 5 Skill Dimensions (Out of 100%)
    // Base formula from mock scores, audit feedback counts, and performance tags
    const basePct = Math.min(100, Math.max(20, Number(avgScore) * 10));

    const skillDimensions = [
      { skill: 'Problem Solving', score: Math.min(98, Math.round(basePct * 0.95 + (mocks.length > 2 ? 8 : 2))), color: '#38bdf8' },
      { skill: 'System Design', score: Math.min(95, Math.round(basePct * 0.9 + (currentStudent.rating === 'excellent' ? 12 : 0))), color: '#a78bfa' },
      { skill: 'Code Speed & Quality', score: Math.min(96, Math.round(basePct * 1.02)), color: '#34d399' },
      { skill: 'Communication', score: Math.min(99, Math.round(basePct * 0.98 + (notes.length > 2 ? 6 : 0))), color: '#fb923c' },
      { skill: 'Technical Depth', score: Math.min(97, Math.round(basePct * 0.94 + (currentStudent.rating === 'placed' ? 15 : 4))), color: '#f43f5e' }
    ];

    // Readiness Index (0 - 100%)
    const readinessIndex = Math.min(100, Math.round(
      Number(avgScore) * 7.5 + 
      (mocks.length * 3) + 
      (currentStudent.rating === 'placed' ? 30 : currentStudent.rating === 'excellent' ? 20 : 10)
    ));

    // Evaluator observations on this candidate
    const evaluatorFeedbackList = EVALUATORS.map(evaluator => {
      const evalMocks = mocks.filter(m => m.evaluator === evaluator);
      const evalNotes = notes.filter(n => n.author === evaluator);
      if (evalMocks.length === 0 && evalNotes.length === 0) return null;
      
      const evalScores = evalMocks.map(m => Number(m.score)).filter(s => !isNaN(s));
      const evalAvg = evalScores.length > 0 ? (evalScores.reduce((a, b) => a + b, 0) / evalScores.length).toFixed(1) : null;
      
      return {
        evaluator,
        mockCount: evalMocks.length,
        notesCount: evalNotes.length,
        avgScore: evalAvg,
        latestObservation: evalNotes[0]?.content || evalMocks[0]?.feedback || 'Consistent audit evaluation record.'
      };
    }).filter(Boolean);

    return {
      mocks,
      notes,
      avgScore,
      latestScore,
      scoreDiff,
      skillDimensions,
      readinessIndex,
      evaluatorFeedbackList
    };
  }, [currentStudent]);

  // Filter candidates in deep dive picker
  const filteredCandidateOptions = students.filter(s => {
    if (!candidateSearch.trim()) return true;
    const q = candidateSearch.trim().toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.targetRole && s.targetRole.toLowerCase().includes(q));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header Card & View Switcher */}
      <div className="card-panel" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--skarion-orange) 0%, #e04343 100%)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 82, 82, 0.3)'
              }}>
                <BarChart2 size={22} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, letterSpacing: '-0.02em' }}>
                SKARION Performance & Batch Analytics
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Visual metric charts, score progression timelines, evaluator calibration, and candidate deep dive inspection.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)', gap: '4px' }}>
            <button
              onClick={() => setActiveSection('batch')}
              style={{
                background: activeSection === 'batch' ? 'var(--skarion-navy)' : 'transparent',
                color: activeSection === 'batch' ? '#ffffff' : 'var(--text-main)',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              <PieIcon size={15} /> Batch Overview
            </button>

            <button
              onClick={() => setActiveSection('candidate')}
              style={{
                background: activeSection === 'candidate' ? 'var(--skarion-orange)' : 'transparent',
                color: activeSection === 'candidate' ? '#ffffff' : 'var(--text-main)',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={15} /> Candidate Deep Dive
            </button>

            <button
              onClick={() => setActiveSection('evaluators')}
              style={{
                background: activeSection === 'evaluators' ? '#7c3aed' : 'transparent',
                color: activeSection === 'evaluators' ? '#ffffff' : 'var(--text-main)',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={15} /> Evaluator Calibration
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BATCH LEVEL ANALYTICS OVERVIEW */}
      {/* ========================================================================= */}
      {activeSection === 'batch' && (
        <>
          {/* Top Executive KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            
            {/* Placed Candidates */}
            <div className="card-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  PLACED ALUMNI
                </span>
                <GraduationCap size={18} color="#7c3aed" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#7c3aed', lineHeight: '1.2' }}>
                {batchStats.placedCount} <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)' }}>/ {batchStats.totalCandidates}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', marginTop: '0.35rem', display: 'block' }}>
                {Math.round((batchStats.placedCount / batchStats.totalCandidates) * 100)}% Placement Success Rate
              </span>
            </div>

            {/* Total Mock Sessions */}
            <div className="card-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--skarion-orange)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  MOCKS CONDUCTED
                </span>
                <Mic size={18} color="var(--skarion-orange)" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--skarion-navy)', lineHeight: '1.2' }}>
                {batchStats.totalMocks} <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)' }}>Sessions</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'block' }}>
                Full verbatim transcripts logged
              </span>
            </div>

            {/* Batch Average Score */}
            <div className="card-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  BATCH AVG SCORE
                </span>
                <Award size={18} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0284c7', lineHeight: '1.2' }}>
                {batchStats.avgScore} <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)' }}>/ 10</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: '700', marginTop: '0.35rem', display: 'block' }}>
                {batchStats.mockPassRate}% Passed (Score ≥ 7.0)
              </span>
            </div>

            {/* Total Audit Observations */}
            <div className="card-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  AUDIT LOGS FILED
                </span>
                <FileText size={18} color="#059669" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>
                {batchStats.totalAuditNotes} <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)' }}>Notes</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'block' }}>
                Across {EVALUATORS.length} instructor evaluators
              </span>
            </div>

          </div>

          {/* Charts Row: Score Distribution Histogram + Status Donut Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
            
            {/* Chart 1: Mock Score Distribution Histogram */}
            <div className="card-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <BarChart2 size={18} color="var(--skarion-orange)" /> Mock Rating Score Distribution
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Candidate performance frequency across evaluation score brackets
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '1.5rem', gap: '0.85rem' }}>
                {batchStats.scoreBrackets.map((bracket, idx) => {
                  const maxCount = Math.max(...batchStats.scoreBrackets.map(b => b.mocks.length), 1);
                  const heightPct = Math.max(12, Math.round((bracket.mocks.length / maxCount) * 100));
                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <div 
                      key={bracket.label} 
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      style={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        height: '100%', 
                        justifyContent: 'flex-end',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Floating tooltip on hover */}
                      {isHovered && (
                        <div style={{
                          position: 'absolute',
                          top: '-45px',
                          background: 'var(--skarion-navy)',
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          whiteSpace: 'nowrap',
                          zIndex: 50,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                          pointerEvents: 'none'
                        }}>
                          {bracket.mocks.length} Sessions ({bracket.desc})
                        </div>
                      )}

                      {/* Count number above bar */}
                      <span style={{ fontSize: '0.78rem', fontWeight: '900', color: bracket.color, marginBottom: '4px' }}>
                        {bracket.mocks.length}
                      </span>

                      {/* Bar Fill */}
                      <div style={{
                        width: '100%',
                        maxWidth: '52px',
                        height: `${heightPct}%`,
                        background: `linear-gradient(180deg, ${bracket.color} 0%, ${bracket.color}99 100%)`,
                        borderRadius: '8px 8px 3px 3px',
                        transition: 'all 0.2s ease',
                        transform: isHovered ? 'scaleY(1.05)' : 'none',
                        boxShadow: isHovered ? `0 6px 16px ${bracket.color}40` : 'none'
                      }} />

                      {/* Bracket Label */}
                      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                          {bracket.label}
                        </div>
                        <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                          {bracket.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Candidate Readiness Status Distribution (Donut & Status Breakdown) */}
            <div className="card-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Activity size={18} color="#7c3aed" /> Candidate Audit Health Breakdown
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Roster distribution by performance categorization
                  </span>
                </div>
              </div>

              {/* Status List Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { key: 'placed', label: 'Placed Alumni', count: batchStats.placedCount, color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)' },
                  { key: 'excellent', label: 'Excellent (Interview Ready)', count: batchStats.excellentCount, color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
                  { key: 'good', label: 'Good (Steady Progress)', count: batchStats.goodCount, color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)' },
                  { key: 'needs_attention', label: 'Needs Attention (Push Needed)', count: batchStats.attentionCount, color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' },
                  { key: 'bad', label: 'At Risk (Immediate Follow-up)', count: batchStats.badCount, color: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)' },
                ].map(item => {
                  const pct = Math.round((item.count / batchStats.totalCandidates) * 100) || 0;
                  return (
                    <div key={item.key} style={{ background: 'var(--bg-surface-subtle)', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                          {item.label}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: item.color }}>
                          {item.count} ({pct}%)
                        </span>
                      </div>

                      {/* Progress Track */}
                      <div style={{ height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: '99px', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Domain & Target Role Distribution */}
          <div className="card-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Layers size={18} color="var(--skarion-orange)" /> Tech Domain & Track Enrollment
                </h3>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Candidate distribution across specialized technical career domains
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              {Object.entries(batchStats.domainCounts).map(([domain, count]) => {
                const pct = Math.round((count / batchStats.totalCandidates) * 100);
                return (
                  <div key={domain} style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem 1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>{domain}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '900', color: 'var(--skarion-orange)' }}>{count} Candidates</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--skarion-navy)', borderRadius: '99px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. SINGLE CANDIDATE DEEP DIVE ANALYTICS */}
      {/* ========================================================================= */}
      {activeSection === 'candidate' && (
        <>
          {/* Candidate Selector Bar */}
          <div className="card-panel" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                  🎯 Select Candidate for Deep Dive Analysis:
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', flex: 1, maxWidth: '420px' }}>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="input-control"
                  style={{ height: '40px', fontWeight: '800', fontSize: '0.86rem' }}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({RATING_CONFIG[s.rating]?.label || 'Active'}) - {s.mockInterviews || 0} Mocks
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick-Pick Candidate Pills */}
            <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', marginTop: '1rem', paddingBottom: '4px' }}>
              {students.map(s => {
                const isSelected = s.id === selectedStudentId;
                const initials = s.name.split(/\s+/).map(p => p[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    style={{
                      background: isSelected ? 'var(--skarion-navy)' : 'var(--bg-surface-subtle)',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      border: isSelected ? '1.5px solid var(--skarion-orange)' : '1px solid var(--border-color)',
                      padding: '4px 10px',
                      borderRadius: '10px',
                      fontSize: '0.76rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--skarion-orange)' : '#0284c7',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '900'
                    }}>
                      {initials}
                    </span>
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {currentStudent && candidateMetrics && (
            <>
              {/* Selected Candidate Profile & KPI Overview Header */}
              <div className="card-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                  
                  {/* Candidate Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: currentStudent.rating === 'placed' 
                        ? 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' 
                        : 'linear-gradient(135deg, var(--skarion-navy) 0%, #0284c7 100%)',
                      color: '#ffffff',
                      fontWeight: '900',
                      fontSize: '1.35rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                    }}>
                      {currentStudent.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0 }}>
                          {currentStudent.name}
                        </h3>
                        <span className={`status-badge badge-${currentStudent.rating}`}>
                          {RATING_CONFIG[currentStudent.rating]?.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                        {currentStudent.targetRole || currentStudent.domain || 'Software Engineering'} • Joined {currentStudent.joiningDate}
                      </p>
                    </div>
                  </div>

                  {/* Readiness Index & Score Highlights */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    
                    <div style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AVERAGE MOCK</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0284c7' }}>
                        {candidateMetrics.avgScore} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 10</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL SESSIONS</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>
                        {candidateMetrics.mocks.length} Mocks
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>READINESS SCORE</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: candidateMetrics.readinessIndex >= 75 ? '#059669' : '#d97706' }}>
                        {candidateMetrics.readinessIndex}%
                      </div>
                    </div>

                    <button 
                      className="btn-secondary"
                      onClick={() => onSelectStudent(currentStudent)}
                      style={{ height: '38px', padding: '0 0.95rem', fontSize: '0.82rem', fontWeight: '700' }}
                    >
                      <span>Open Full Profile</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 5-Pillar Competency Radar / Progress Matrix + Score Timeline */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
                
                {/* 5-Pillar Skill Competencies */}
                <div className="card-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Target size={18} color="var(--skarion-orange)" /> 5-Pillar Technical Competency Matrix
                      </h3>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Calculated benchmark scores based on verified mock interviews
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {candidateMetrics.skillDimensions.map(dim => (
                      <div key={dim.skill}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                            {dim.skill}
                          </span>
                          <span style={{ fontSize: '0.84rem', fontWeight: '900', color: dim.color }}>
                            {dim.score}%
                          </span>
                        </div>
                        <div style={{ height: '8px', width: '100%', background: 'var(--bg-surface-subtle)', borderRadius: '99px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${dim.score}%`, background: `linear-gradient(90deg, ${dim.color}88 0%, ${dim.color} 100%)`, borderRadius: '99px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Progression Timeline Chart */}
                <div className="card-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <TrendingUp size={18} color="#059669" /> Score Progression Curve
                      </h3>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Performance trajectory over chronological mock sessions
                      </span>
                    </div>
                  </div>

                  {candidateMetrics.mocks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px' }}>
                      <Mic size={32} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        No mock interviews logged yet for {currentStudent.name}.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {candidateMetrics.mocks.map((mock, index) => {
                        const score = Number(mock.score);
                        const scoreColor = score >= 8 ? '#059669' : score >= 6 ? '#0284c7' : '#dc2626';
                        return (
                          <div 
                            key={mock.id || index}
                            style={{ 
                              background: 'var(--bg-surface-subtle)', 
                              padding: '0.75rem 1rem', 
                              borderRadius: '10px', 
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '0.75rem'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '900', background: 'var(--skarion-navy)', color: '#ffffff', padding: '1px 6px', borderRadius: '4px' }}>
                                  #{index + 1}
                                </span>
                                <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                                  {mock.category}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Evaluated by {mock.evaluator} on {mock.date}
                              </span>
                            </div>

                            <span style={{ 
                              fontSize: '0.92rem', 
                              fontWeight: '900', 
                              color: scoreColor, 
                              background: scoreColor + '15', 
                              padding: '3px 9px', 
                              borderRadius: '6px',
                              border: `1px solid ${scoreColor}30`,
                              whiteSpace: 'nowrap'
                            }}>
                              {mock.score} / 10
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Evaluator Multi-Perspective Observations on Selected Candidate */}
              <div className="card-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Users size={18} color="#7c3aed" /> Evaluator Multi-Perspective Feedback
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Cross-instructor audit observations and evaluation history for {currentStudent.name}
                    </span>
                  </div>
                </div>

                {candidateMetrics.evaluatorFeedbackList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No evaluator comments logged yet for this candidate.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {candidateMetrics.evaluatorFeedbackList.map(item => {
                      const evalCfg = EVALUATOR_CONFIG[item.evaluator] || EVALUATOR_CONFIG.Mayukh;
                      return (
                        <div 
                          key={item.evaluator}
                          style={{
                            background: 'var(--bg-surface)',
                            padding: '1.15rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            borderLeft: `4px solid ${evalCfg.border}`,
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                            <span style={{ 
                              fontSize: '0.78rem', 
                              fontWeight: '800', 
                              background: evalCfg.bg, 
                              color: evalCfg.text, 
                              padding: '2px 8px', 
                              borderRadius: '5px',
                              border: `1px solid ${evalCfg.border}`
                            }}>
                              {item.evaluator}
                            </span>
                            {item.avgScore && (
                              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0284c7' }}>
                                Avg: {item.avgScore}/10
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '0.4rem 0 0 0', lineHeight: '1.45' }}>
                            "{item.latestObservation}"
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. EVALUATOR CALIBRATION & INSTRUCTOR METRICS */}
      {/* ========================================================================= */}
      {activeSection === 'evaluators' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} color="#7c3aed" /> Instructor Audit Calibration & Evaluation Volume
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Workload, feedback distribution, and score calibration across mentors
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {batchStats.evaluatorStats.map(evaluator => {
                return (
                  <div 
                    key={evaluator.name}
                    className="card-panel"
                    style={{
                      padding: '1.25rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderTop: `4px solid ${evaluator.config.border || '#0284c7'}`,
                      borderRadius: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.88rem',
                          fontWeight: '800',
                          color: evaluator.config.text,
                          background: evaluator.config.bg,
                          padding: '2px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${evaluator.config.border}`
                        }}>
                          {evaluator.name}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                          Evaluator
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.85rem' }}>
                        <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '8px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mocks Taken</span>
                          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>{evaluator.mockCount}</div>
                        </div>

                        <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.65rem', borderRadius: '8px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Audit Notes</span>
                          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-orange)' }}>{evaluator.notesCount}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '700' }}>Avg Given Rating:</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0284c7' }}>
                        {evaluator.avgScore !== 'N/A' ? `${evaluator.avgScore} / 10` : 'No Mocks'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

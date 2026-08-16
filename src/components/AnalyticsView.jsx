import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
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
  ExternalLink,
  Target,
  Zap,
  Check,
  Edit3,
  BookOpen,
  Sliders
} from 'lucide-react';
import { RATING_CONFIG, EVALUATORS, EVALUATOR_CONFIG } from '../data/initialData';
import ExecutiveAuditReportModal from './ExecutiveAuditReportModal';
import ExecutiveAuditReportCard from './ExecutiveAuditReportCard';
import { parseAuditAnalysis } from '../utils/auditAnalysisParser';

// Interactive SVG Donut / Pie Chart Component
function SvgDonutChart({ data, size = 260, strokeWidth = 36, centerTitle = "Total", centerSubtitle = "" }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedAngle = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        {data.map((item, idx) => {
          if (item.value === 0) return null;
          const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
          const strokeDashoffset = -accumulatedAngle;
          accumulatedAngle += (item.value / total) * circumference;

          return (
            <circle
              key={item.label || idx}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))'
              }}
            >
              <title>{`${item.label}: ${item.value} (${Math.round((item.value / total) * 100)}%)`}</title>
            </circle>
          );
        })}
      </svg>

      {/* Centered Donut Stat */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--skarion-navy)', lineHeight: '1.1' }}>
          {centerTitle}
        </div>
        {centerSubtitle && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '2px' }}>
            {centerSubtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// Clean, Perfectly Spaced Speedometer Gauge with Zero Overlap
function SvgSpeedometerGauge({ score = 85, size = 260 }) {
  const radius = size * 0.42;
  const strokeWidth = 22;
  const cx = size / 2;
  const cy = size * 0.55;
  const startAngle = Math.PI * 0.85;
  const endAngle = Math.PI * 2.15;
  const totalArc = endAngle - startAngle;

  const currentAngle = startAngle + (Math.min(100, Math.max(0, score)) / 100) * totalArc;

  const polarToCartesian = (cx, cy, r, angle) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  });

  const p1 = polarToCartesian(cx, cy, radius, startAngle);
  const p2 = polarToCartesian(cx, cy, radius, endAngle);
  const bgPath = `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 1 1 ${p2.x} ${p2.y}`;

  const cp = polarToCartesian(cx, cy, radius, currentAngle);
  const largeArcFlag = (currentAngle - startAngle) > Math.PI ? 1 : 0;
  const fillPath = `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${cp.x} ${cp.y}`;

  const gaugeColor = score >= 80 ? '#059669' : score >= 60 ? '#0284c7' : score >= 40 ? '#d97706' : '#dc2626';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0' }}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`} style={{ overflow: 'visible' }}>
        {/* Background Track */}
        <path
          d={bgPath}
          fill="none"
          stroke="var(--bg-surface-subtle)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Filled Progress Arc */}
        <path
          d={fillPath}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 4px 10px ${gaugeColor}40)` }}
        />
      </svg>

      {/* Clean Spaced Stat & Label with ZERO text overlap */}
      <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: gaugeColor, lineHeight: '1' }}>
          {score}%
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--skarion-navy)', marginTop: '0.45rem' }}>
          {score >= 80 ? '🔥 Job Interview Ready' : score >= 60 ? '⚡ Good Progress / Polish Needed' : score >= 40 ? '📚 Needs Practice in Mock Rounds' : '⚠️ Intensive Practice Required'}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsView({ students, onSelectStudent, onSaveStudent, showToast }) {
  const [activeSection, setActiveSection] = useState('batch'); // 'batch' | 'candidate' | 'evaluators'
  const [selectedStudentId, setSelectedStudentId] = useState(() => students[0]?.id || '');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [showRubrics, setShowRubrics] = useState(false);

  // Executive Audit Analysis Modal State
  const [activeAuditSession, setActiveAuditSession] = useState(null);
  const [activeAuditCandidate, setActiveAuditCandidate] = useState(null);
  const [selectedAuditSessionIndex, setSelectedAuditSessionIndex] = useState(0);

  // Selected candidate object
  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0] || null;
  }, [students, selectedStudentId]);

  // Handle saving audit analysis text and synchronizing score
  const handleSaveAuditAnalysis = (sessionId, newAnalysisText, updatedScore) => {
    const candidateToUpdate = activeAuditCandidate || currentStudent;
    if (!candidateToUpdate || !onSaveStudent) return;

    const parsed = parseAuditAnalysis(newAnalysisText);
    const finalScore = updatedScore !== undefined && updatedScore !== null && !isNaN(Number(updatedScore))
      ? Number(updatedScore)
      : (parsed?.overallScore !== null && parsed?.overallScore !== undefined ? Number(parsed.overallScore) : undefined);

    const existingSessions = candidateToUpdate.mockSessions || [];
    const updatedSessions = existingSessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          auditAnalysis: newAnalysisText,
          score: finalScore !== undefined && !isNaN(finalScore) ? finalScore : s.score
        };
      }
      return s;
    });

    const updatedStudent = {
      ...candidateToUpdate,
      mockSessions: updatedSessions
    };

    onSaveStudent(updatedStudent);
    if (activeAuditSession && activeAuditSession.id === sessionId) {
      setActiveAuditSession({
        ...activeAuditSession,
        auditAnalysis: newAnalysisText,
        score: finalScore !== undefined && !isNaN(finalScore) ? finalScore : activeAuditSession.score
      });
    }
  };

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

    // Large Score Brackets Distribution
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

    // Dynamic Domain Distribution
    const domainCounts = {};
    students.forEach(s => {
      const domain = s.domain || s.targetRole || 'Software Engineering';
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    // Domain Pie Chart Data
    const domainPalette = ['#ff5252', '#7c3aed', '#0284c7', '#059669', '#d97706', '#ec4899', '#6366f1'];
    const domainPieData = Object.entries(domainCounts).map(([domain, count], idx) => ({
      label: domain,
      value: count,
      color: domainPalette[idx % domainPalette.length]
    }));

    // Status Pie Chart Data
    const statusPieData = [
      { label: 'Placed', value: placedCount, color: '#7c3aed' },
      { label: 'Excellent', value: excellentCount, color: '#059669' },
      { label: 'Good', value: goodCount, color: '#0284c7' },
      { label: 'Needs Attention', value: attentionCount, color: '#d97706' },
      { label: 'At Risk', value: badCount, color: '#dc2626' }
    ].filter(i => i.value > 0);

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
      domainCounts,
      domainPieData,
      statusPieData
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

    // Mock Categories Breakdown from real candidate session records
    const categoryMap = {};
    mocks.forEach(m => {
      const cat = m.category || 'General';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, totalScore: 0, scores: [], evaluators: new Set() };
      }
      categoryMap[cat].count += 1;
      const sc = Number(m.score);
      if (!isNaN(sc)) {
        categoryMap[cat].totalScore += sc;
        categoryMap[cat].scores.push(sc);
      }
      if (m.evaluator) categoryMap[cat].evaluators.add(m.evaluator);
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      avgScore: data.scores.length > 0 ? (data.totalScore / data.scores.length).toFixed(1) : 'N/A',
      evaluators: Array.from(data.evaluators).join(', ')
    }));

    // Manual or Computed Readiness Score
    const defaultCalculated = Math.min(100, Math.round(
      Number(avgScore) * 7.5 + 
      (mocks.length * 3) + 
      (currentStudent.rating === 'placed' ? 30 : currentStudent.rating === 'excellent' ? 20 : 10)
    ));

    const effectiveReadiness = currentStudent.placementReadiness !== undefined 
      ? Number(currentStudent.placementReadiness) 
      : defaultCalculated;

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
      categoryBreakdown,
      readinessIndex: effectiveReadiness,
      evaluatorFeedbackList
    };
  }, [currentStudent]);

  // Compute Rubric Assessment Breakdown based on candidate's database milestones
  const rubricScores = useMemo(() => {
    if (!currentStudent || !candidateMetrics) return null;
    const progress = currentStudent.progress || 0;
    const mocks = currentStudent.mockSessions || [];
    const avgScore = Number(candidateMetrics.avgScore) || 0;

    // Pillar 1: Curriculum & Capstone Project Completion (Max 25 pts)
    const curriculumPts = Math.min(25, Math.round((progress / 100) * 25));

    // Pillar 2: Technical Mock Interview Evaluations (Max 30 pts)
    const mockCountPts = Math.min(15, mocks.length * 5);
    const mockScorePts = Math.min(15, Math.round((avgScore / 10) * 15));
    const mockEvalPts = mockCountPts + mockScorePts;

    // Pillar 3: Target Domain & System Design Depth (Max 25 pts)
    const domainPts = currentStudent.rating === 'placed' ? 25 
      : currentStudent.rating === 'excellent' ? 23 
      : currentStudent.rating === 'good' ? 18 
      : currentStudent.rating === 'needs_attention' ? 12 : 8;

    // Pillar 4: Technical Communication & Behavioral Presence (Max 20 pts)
    const commPts = currentStudent.rating === 'placed' ? 20 
      : currentStudent.rating === 'excellent' ? 18 
      : currentStudent.rating === 'good' ? 14 
      : currentStudent.rating === 'needs_attention' ? 10 : 6;

    const totalCalculated = curriculumPts + mockEvalPts + domainPts + commPts;

    return {
      curriculumPts,
      mockEvalPts,
      domainPts,
      commPts,
      totalCalculated: Math.min(100, Math.max(0, totalCalculated))
    };
  }, [currentStudent, candidateMetrics]);

  // Handle Manual Readiness Edit
  const handleUpdateReadiness = (newScore) => {
    if (!currentStudent || !onSaveStudent) return;
    const clamped = Math.min(100, Math.max(0, newScore));
    onSaveStudent({
      ...currentStudent,
      placementReadiness: clamped
    });
    if (showToast) showToast(`Updated ${currentStudent.name}'s Placement Readiness to ${clamped}%`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Header Card & View Switcher */}
      <div className="card-panel" style={{ padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--skarion-orange) 0%, #e04343 100%)',
                color: '#ffffff',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255, 82, 82, 0.35)'
              }}>
                <BarChart2 size={26} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, letterSpacing: '-0.03em' }}>
                SKARION Performance & Batch Analytics
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
              Instructor-grade visual graphs, score distribution histograms, interactive pie charts, and candidate deep-dive inspection.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-subtle)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-color)', gap: '6px' }}>
            <button
              onClick={() => setActiveSection('batch')}
              style={{
                background: activeSection === 'batch' ? 'var(--skarion-navy)' : 'transparent',
                color: activeSection === 'batch' ? '#ffffff' : 'var(--text-main)',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <PieIcon size={17} /> Batch Overview
            </button>

            <button
              onClick={() => setActiveSection('candidate')}
              style={{
                background: activeSection === 'candidate' ? 'var(--skarion-orange)' : 'transparent',
                color: activeSection === 'candidate' ? '#ffffff' : 'var(--text-main)',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={17} /> Candidate Deep Dive
            </button>

            <button
              onClick={() => setActiveSection('evaluators')}
              style={{
                background: activeSection === 'evaluators' ? '#7c3aed' : 'transparent',
                color: activeSection === 'evaluators' ? '#ffffff' : 'var(--text-main)',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={17} /> Evaluator Calibration
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            
            {/* Placed Candidates */}
            <div className="card-panel" style={{ padding: '1.5rem', borderLeft: '5px solid #7c3aed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  PLACED ALUMNI
                </span>
                <GraduationCap size={22} color="#7c3aed" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#7c3aed', lineHeight: '1.2' }}>
                {batchStats.placedCount} <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-muted)' }}>/ {batchStats.totalCandidates}</span>
              </div>
              <span style={{ fontSize: '0.84rem', color: '#059669', fontWeight: '800', marginTop: '0.45rem', display: 'block' }}>
                {Math.round((batchStats.placedCount / batchStats.totalCandidates) * 100)}% Placement Success Rate
              </span>
            </div>

            {/* Total Mock Sessions */}
            <div className="card-panel" style={{ padding: '1.5rem', borderLeft: '5px solid var(--skarion-orange)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  MOCKS CONDUCTED
                </span>
                <Mic size={22} color="var(--skarion-orange)" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--skarion-navy)', lineHeight: '1.2' }}>
                {batchStats.totalMocks} <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-muted)' }}>Sessions</span>
              </div>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.45rem', display: 'block' }}>
                Verbatim transcripts recorded
              </span>
            </div>

            {/* Batch Average Score */}
            <div className="card-panel" style={{ padding: '1.5rem', borderLeft: '5px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  BATCH AVG SCORE
                </span>
                <Award size={22} color="#0284c7" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0284c7', lineHeight: '1.2' }}>
                {batchStats.avgScore} <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-muted)' }}>/ 10</span>
              </div>
              <span style={{ fontSize: '0.84rem', color: '#0284c7', fontWeight: '800', marginTop: '0.45rem', display: 'block' }}>
                {batchStats.mockPassRate}% Passed (Score ≥ 7.0)
              </span>
            </div>

            {/* Total Audit Observations */}
            <div className="card-panel" style={{ padding: '1.5rem', borderLeft: '5px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AUDIT LOGS FILED
                </span>
                <FileText size={22} color="#059669" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#059669', lineHeight: '1.2' }}>
                {batchStats.totalAuditNotes} <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-muted)' }}>Notes</span>
              </div>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.45rem', display: 'block' }}>
                Across {EVALUATORS.length} instructor evaluators
              </span>
            </div>

          </div>

          {/* LARGE VISUAL GRAPH 1: Mock Rating Score Distribution Histogram */}
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <BarChart2 size={24} color="var(--skarion-orange)" /> Mock Rating Score Distribution Histogram
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500', display: 'block', marginTop: '4px' }}>
                  Complete distribution of candidate mock performance frequency across score brackets
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--skarion-navy)', background: 'var(--bg-surface-subtle)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  Total Evaluated Sessions: <strong style={{ color: 'var(--skarion-orange)' }}>{batchStats.totalMocks}</strong>
                </span>
              </div>
            </div>

            {/* Large Height Bar Chart (300px) */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '300px', paddingTop: '2.5rem', paddingBottom: '1.5rem', gap: '1.5rem', borderBottom: '2px solid var(--border-color)' }}>
              {batchStats.scoreBrackets.map((bracket, idx) => {
                const maxCount = Math.max(...batchStats.scoreBrackets.map(b => b.mocks.length), 1);
                const heightPct = Math.max(14, Math.round((bracket.mocks.length / maxCount) * 100));
                const isHovered = hoveredBarIndex === idx;
                const percentage = batchStats.totalMocks > 0 ? Math.round((bracket.mocks.length / batchStats.totalMocks) * 100) : 0;

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
                    {/* Floating Tooltip Card */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        top: '-55px',
                        background: 'var(--skarion-navy)',
                        color: '#ffffff',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '0.84rem',
                        fontWeight: '800',
                        whiteSpace: 'nowrap',
                        zIndex: 50,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        pointerEvents: 'none'
                      }}>
                        {bracket.mocks.length} Sessions • {percentage}% ({bracket.desc})
                      </div>
                    )}

                    {/* Count Callout Badge Above Bar */}
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '900', color: bracket.color, display: 'block', lineHeight: '1' }}>
                        {bracket.mocks.length}
                      </span>
                      <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                        ({percentage}%)
                      </span>
                    </div>

                    {/* Thick Gradient Bar */}
                    <div style={{
                      width: '100%',
                      maxWidth: '72px',
                      height: `${heightPct}%`,
                      background: `linear-gradient(180deg, ${bracket.color} 0%, ${bracket.color}99 100%)`,
                      borderRadius: '12px 12px 4px 4px',
                      transition: 'all 0.25s ease',
                      transform: isHovered ? 'scaleY(1.04)' : 'none',
                      boxShadow: isHovered ? `0 10px 24px ${bracket.color}50` : `0 4px 12px ${bracket.color}25`
                    }} />

                    {/* Bracket Name & Description Below Bar */}
                    <div style={{ marginTop: '0.85rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>
                        {bracket.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                        {bracket.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TWO LARGE INTERACTIVE PIE / DONUT CHARTS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
            
            {/* Pie Chart 1: Candidate Status & Audit Health */}
            <div className="card-panel" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PieIcon size={22} color="#7c3aed" /> Candidate Audit Health Breakdown (Pie Chart)
                </h3>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  Proportional distribution across performance classifications
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
                <SvgDonutChart 
                  data={batchStats.statusPieData} 
                  size={240} 
                  strokeWidth={34} 
                  centerTitle={String(batchStats.totalCandidates)} 
                  centerSubtitle="Candidates" 
                />

                {/* Pie Chart Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minWidth: '200px' }}>
                  {batchStats.statusPieData.map(item => {
                    const pct = Math.round((item.value / batchStats.totalCandidates) * 100);
                    return (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-subtle)', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: '900', color: item.color }}>
                          {item.value} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pie Chart 2: Tech Domain & Track Distribution */}
            <div className="card-panel" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={22} color="var(--skarion-orange)" /> Tech Domain & Career Track Distribution
                </h3>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  Dynamic domain distribution assigned to candidates in the database
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
                <SvgDonutChart 
                  data={batchStats.domainPieData} 
                  size={240} 
                  strokeWidth={34} 
                  centerTitle={String(Object.keys(batchStats.domainCounts).length)} 
                  centerSubtitle="Career Tracks" 
                />

                {/* Domain Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minWidth: '200px' }}>
                  {batchStats.domainPieData.map(item => {
                    const pct = Math.round((item.value / batchStats.totalCandidates) * 100);
                    return (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-subtle)', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: '900', color: item.color }}>
                          {item.value} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Domain Breakdown Progress Cards */}
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={22} color="#059669" /> Career Track Enrollment & Readiness Progress
              </h3>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                Detailed track-by-track breakdown of candidate headcount and progress
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {Object.entries(batchStats.domainCounts).map(([domain, count], idx) => {
                const pct = Math.round((count / batchStats.totalCandidates) * 100);
                const color = batchStats.domainPieData[idx]?.color || 'var(--skarion-navy)';
                return (
                  <div key={domain} style={{ background: 'var(--bg-surface-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>{domain}</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: '900', color: color }}>{count} Candidates ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px' }} />
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
          <div className="card-panel" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0 }}>
                  🎯 Select Candidate for Deep Dive Analysis:
                </h3>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Inspect candidate's evaluated mock performance, readiness index, and mentor feedback
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '450px' }}>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="input-control"
                  style={{ height: '44px', fontWeight: '800', fontSize: '0.92rem' }}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.domain || s.targetRole || 'Software Engineering'}) - {s.mockInterviews || 0} Mocks
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick-Pick Candidate Pills */}
            <div style={{ display: 'flex', gap: '0.55rem', overflowX: 'auto', marginTop: '1.25rem', paddingBottom: '6px' }}>
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
                      border: isSelected ? '2px solid var(--skarion-orange)' : '1px solid var(--border-color)',
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontSize: '0.84rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--skarion-orange)' : '#0284c7',
                      color: '#ffffff',
                      fontSize: '0.7rem',
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
              <div className="card-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  
                  {/* Candidate Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      background: currentStudent.rating === 'placed' 
                        ? 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)' 
                        : 'linear-gradient(135deg, var(--skarion-navy) 0%, #0284c7 100%)',
                      color: '#ffffff',
                      fontWeight: '900',
                      fontSize: '1.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.18)'
                    }}>
                      {currentStudent.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.55rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0 }}>
                          {currentStudent.name}
                        </h3>
                        <span className={`status-badge badge-${currentStudent.rating}`} style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                          {RATING_CONFIG[currentStudent.rating]?.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0', fontWeight: '600' }}>
                        🎯 Domain: <strong style={{ color: 'var(--skarion-orange)' }}>{currentStudent.domain || currentStudent.targetRole || 'Software Engineering'}</strong> • Joined {currentStudent.joiningDate}
                      </p>
                    </div>
                  </div>

                  {/* Readiness Index & Score Highlights */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    
                    <div style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '0.85rem 1.35rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AVERAGE MOCK</span>
                      <div style={{ fontSize: '1.7rem', fontWeight: '900', color: '#0284c7' }}>
                        {candidateMetrics.avgScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 10</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', background: 'var(--bg-surface)', padding: '0.85rem 1.35rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL SESSIONS</span>
                      <div style={{ fontSize: '1.7rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>
                        {candidateMetrics.mocks.length} Mocks
                      </div>
                    </div>

                    <button 
                      className="btn-secondary"
                      onClick={() => onSelectStudent(currentStudent)}
                      style={{ height: '44px', padding: '0 1.25rem', fontSize: '0.88rem', fontWeight: '800' }}
                    >
                      <span>Open Full Profile</span>
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* TWO LARGE VISUAL CARDS: Real Mock Category Performance + Interactive Speedometer Readiness Meter */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
                
                {/* Visual Card 1: Verified Mock Category Performance & Milestone Breakdown */}
                <div className="card-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={22} color="var(--skarion-orange)" /> Mock Evaluation Categories & Progress Breakdown
                      </h3>
                      <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        Verified evaluation scores grouped by evaluated interview round category
                      </span>
                    </div>

                    {/* Course Progress Bar */}
                    <div style={{ background: 'var(--bg-surface-subtle)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <BookOpen size={16} color="var(--skarion-orange)" /> Overall Curriculum Progress
                        </span>
                        <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--skarion-orange)' }}>
                          {currentStudent.progress || 0}% Complete
                        </span>
                      </div>
                      <div style={{ height: '8px', width: '100%', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${currentStudent.progress || 0}%`, background: 'var(--skarion-orange)', borderRadius: '99px' }} />
                      </div>
                    </div>

                    {/* Category Breakdown Items */}
                    {candidateMetrics.categoryBreakdown.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        No categorized mock interview sessions logged yet for this candidate.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {candidateMetrics.categoryBreakdown.map(catItem => {
                          const avgScoreNum = Number(catItem.avgScore);
                          const scoreColor = avgScoreNum >= 8 ? '#059669' : avgScoreNum >= 6 ? '#0284c7' : '#d97706';
                          const pct = Math.min(100, Math.round(avgScoreNum * 10));

                          return (
                            <div key={catItem.category} style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem 1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <div>
                                  <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                                    {catItem.category} Round
                                  </span>
                                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                                    ({catItem.count} Session{catItem.count !== 1 ? 's' : ''} by {catItem.evaluators})
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.95rem', fontWeight: '900', color: scoreColor }}>
                                  {catItem.avgScore} / 10
                                </span>
                              </div>
                              <div style={{ height: '6px', width: '100%', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: scoreColor, borderRadius: '99px' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Summary Footer */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      Audit Observations Filed: <strong>{candidateMetrics.notes.length} notes</strong>
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--skarion-navy)', fontWeight: '800' }}>
                      Joined: {currentStudent.joiningDate}
                    </span>
                  </div>
                </div>

                {/* Visual Card 2: Interactive Manually Editable Job Market Placement Readiness Meter with Rubrics */}
                <div className="card-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Zap size={22} color="#059669" /> Job Market Placement Readiness Meter
                        </h3>
                        <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                          Evaluation rubrics matrix with manual number input & instant slider controls
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setShowRubrics(!showRubrics)}
                          style={{
                            background: showRubrics ? 'var(--skarion-navy)' : 'var(--bg-surface-subtle)',
                            color: showRubrics ? '#ffffff' : 'var(--text-main)',
                            border: '1px solid var(--border-color)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <BookOpen size={13} /> {showRubrics ? 'Hide Rubrics' : 'View Rubrics'}
                        </button>

                        <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#059669', background: 'rgba(5, 150, 105, 0.12)', padding: '4px 9px', borderRadius: '6px' }}>
                          <Sliders size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} /> Editable
                        </span>
                      </div>
                    </div>

                    {/* Perfectly Spaced Speedometer Gauge */}
                    <SvgSpeedometerGauge score={candidateMetrics.readinessIndex} size={280} />
                  </div>

                  {/* Rubrics Assessment Matrix Panel (Collapsible) */}
                  {showRubrics && rubricScores && (
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', marginTop: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: '900', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          📋 Official Placement Assessment Rubrics:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateReadiness(rubricScores.totalCalculated)}
                          style={{
                            background: 'linear-gradient(135deg, var(--skarion-orange) 0%, #e04343 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: '900',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Zap size={12} /> Apply Rubric Score ({rubricScores.totalCalculated}%)
                        </button>
                      </div>

                      {/* 4 Rubric Criteria Rows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                          <div>
                            <strong>1. Curriculum & Capstone Progress (Max 25 pts):</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{currentStudent.progress || 0}% coursework completed</div>
                          </div>
                          <span style={{ fontWeight: '900', color: '#0284c7' }}>{rubricScores.curriculumPts} / 25 pts</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                          <div>
                            <strong>2. Technical Mock Interviews (Max 30 pts):</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{candidateMetrics.mocks.length} mocks attended • Avg {candidateMetrics.avgScore}/10</div>
                          </div>
                          <span style={{ fontWeight: '900', color: 'var(--skarion-orange)' }}>{rubricScores.mockEvalPts} / 30 pts</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                          <div>
                            <strong>3. Domain Depth & Applied Skills (Max 25 pts):</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Technical audit rating: {RATING_CONFIG[currentStudent.rating]?.label}</div>
                          </div>
                          <span style={{ fontWeight: '900', color: '#7c3aed' }}>{rubricScores.domainPts} / 25 pts</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                          <div>
                            <strong>4. Verbal Communication & Soft Skills (Max 20 pts):</strong>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Clarity, confidence, and trade-off articulation</div>
                          </div>
                          <span style={{ fontWeight: '900', color: '#059669' }}>{rubricScores.commPts} / 20 pts</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Direct Number Input, Slider & Presets Controls */}
                  <div style={{ background: 'var(--bg-surface-subtle)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)', marginTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Edit3 size={15} color="var(--skarion-orange)" /> Manual Score Input & Slider:
                      </label>
                      
                      {/* Direct Manual Number Input Box */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={candidateMetrics.readinessIndex}
                          onChange={(e) => handleUpdateReadiness(Number(e.target.value))}
                          style={{
                            width: '64px',
                            height: '34px',
                            textAlign: 'center',
                            fontSize: '1rem',
                            fontWeight: '900',
                            color: 'var(--skarion-navy)',
                            background: 'var(--bg-surface)',
                            border: '2px solid var(--skarion-orange)',
                            borderRadius: '8px',
                            outline: 'none',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                          }}
                        />
                        <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>%</span>
                      </div>
                    </div>

                    {/* Range Slider */}
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={candidateMetrics.readinessIndex}
                      onChange={(e) => handleUpdateReadiness(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--skarion-orange)', cursor: 'pointer', height: '6px' }}
                    />

                    {/* Quick Preset Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginTop: '0.85rem' }}>
                      {[
                        { label: '30% Early', val: 30, color: '#dc2626' },
                        { label: '60% Polish', val: 60, color: '#d97706' },
                        { label: '85% Ready', val: 85, color: '#0284c7' },
                        { label: '100% Placed', val: 100, color: '#059669' }
                      ].map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleUpdateReadiness(preset.val)}
                          style={{
                            background: candidateMetrics.readinessIndex === preset.val ? preset.color : 'var(--bg-surface)',
                            color: candidateMetrics.readinessIndex === preset.val ? '#ffffff' : 'var(--text-main)',
                            border: `1px solid ${preset.color}`,
                            padding: '6px 4px',
                            borderRadius: '8px',
                            fontSize: '0.74rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* EXECUTIVE CANDIDATE PERFORMANCE METRICS & AUDIT BREAKDOWN */}
              {/* ========================================================================= */}
              {(() => {
                const auditSessions = (currentStudent.mockSessions || []).filter(s => s.auditAnalysis && s.auditAnalysis.trim().length > 0);
                const hasAuditReport = auditSessions.length > 0;
                const safeSessionIndex = selectedAuditSessionIndex < auditSessions.length ? selectedAuditSessionIndex : 0;
                const activeDisplaySession = auditSessions[safeSessionIndex] || currentStudent.mockSessions?.[0] || null;

                return (
                  <div className="card-panel" style={{ padding: '1.5rem 1.75rem', marginTop: '1.5rem', background: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                          <span style={{ 
                            background: 'linear-gradient(135deg, var(--skarion-orange) 0%, #e04343 100%)',
                            color: '#ffffff',
                            fontSize: '0.72rem',
                            fontWeight: '900',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            letterSpacing: '0.03em'
                          }}>
                            EXECUTIVE AUDIT
                          </span>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0 }}>
                            Candidate Performance Metrics & Evaluation Breakdown
                          </h3>
                        </div>
                        <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                          {hasAuditReport 
                            ? `Comprehensive multi-dimensional evaluation filed for ${currentStudent.name} (${auditSessions.length} Report${auditSessions.length !== 1 ? 's' : ''})`
                            : `No multi-dimensional audit report filed yet for ${currentStudent.name}. Paste verbatim analysis to parse automatically.`}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {hasAuditReport && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                              setActiveAuditSession(activeDisplaySession);
                              setActiveAuditCandidate(currentStudent);
                            }}
                            style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.84rem', fontWeight: '800' }}
                          >
                            <BarChart2 size={16} /> View Performance Analysis
                          </button>
                        )}

                        <button
                          type="button"
                          className={hasAuditReport ? "btn-secondary" : "btn-primary"}
                          onClick={() => {
                            const targetSess = activeDisplaySession || {
                              id: `mock-${Date.now()}`,
                              date: '2026-08-16',
                              score: 7.0,
                              evaluator: 'Mayukh',
                              category: 'Technical',
                              feedback: 'Interview evaluation performance',
                              auditAnalysis: ''
                            };
                            setActiveAuditSession(targetSess);
                            setActiveAuditCandidate(currentStudent);
                          }}
                          style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.84rem' }}
                        >
                          <Edit3 size={15} /> {hasAuditReport ? 'Edit / Calibrate' : '+ Add / Paste Performance Audit'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Score Progression History */}
              <div className="card-panel" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={22} color="#059669" /> Chronological Score Progression Log
                  </h3>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                    Verified evaluation scores across all mock interviews taken
                  </span>
                </div>

                {candidateMetrics.mocks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '14px' }}>
                    <Mic size={36} color="var(--text-dim)" style={{ marginBottom: '0.65rem' }} />
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>
                      No mock interviews logged yet for {currentStudent.name}.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                    {candidateMetrics.mocks.map((mock, index) => {
                      const score = Number(mock.score);
                      const scoreColor = score >= 8 ? '#059669' : score >= 6 ? '#0284c7' : '#dc2626';
                      return (
                        <div 
                          key={mock.id || index}
                          style={{ 
                            background: 'var(--bg-surface-subtle)', 
                            padding: '1rem 1.25rem', 
                            borderRadius: '12px', 
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '1rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: '900', background: 'var(--skarion-navy)', color: '#ffffff', padding: '2px 8px', borderRadius: '5px' }}>
                                Round #{index + 1}
                              </span>
                              <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>
                                {mock.category}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                              Evaluated by {mock.evaluator} on {mock.date}
                            </span>
                          </div>

                          <span style={{ 
                            fontSize: '1.15rem', 
                            fontWeight: '900', 
                            color: scoreColor, 
                            background: scoreColor + '15', 
                            padding: '4px 12px', 
                            borderRadius: '8px',
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

              {/* Evaluator Multi-Perspective Observations */}
              <div className="card-panel" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={22} color="#7c3aed" /> Evaluator Multi-Perspective Observations
                  </h3>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                    Instructor feedback trail and observations for {currentStudent.name}
                  </span>
                </div>

                {candidateMetrics.evaluatorFeedbackList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                    No evaluator comments logged yet for this candidate.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {candidateMetrics.evaluatorFeedbackList.map(item => {
                      const evalCfg = EVALUATOR_CONFIG[item.evaluator] || EVALUATOR_CONFIG.Mayukh;
                      return (
                        <div 
                          key={item.evaluator}
                          style={{
                            background: 'var(--bg-surface)',
                            padding: '1.35rem',
                            borderRadius: '14px',
                            border: '1px solid var(--border-color)',
                            borderLeft: `5px solid ${evalCfg.border}`,
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                            <span style={{ 
                              fontSize: '0.86rem', 
                              fontWeight: '800', 
                              background: evalCfg.bg, 
                              color: evalCfg.text, 
                              padding: '3px 10px', 
                              borderRadius: '6px',
                              border: `1px solid ${evalCfg.border}`
                            }}>
                              {item.evaluator}
                            </span>
                            {item.avgScore && (
                              <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#0284c7' }}>
                                Avg: {item.avgScore}/10
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '0.5rem 0 0 0', lineHeight: '1.55' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Users size={24} color="#7c3aed" /> Instructor Audit Calibration & Evaluation Volume
              </h3>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                Workload, feedback distribution, and score calibration across mentors
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {batchStats.evaluatorStats.map(evaluator => {
                return (
                  <div 
                    key={evaluator.name}
                    className="card-panel"
                    style={{
                      padding: '1.5rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderTop: `5px solid ${evaluator.config.border || '#0284c7'}`,
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '900',
                          color: evaluator.config.text,
                          background: evaluator.config.bg,
                          padding: '3px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${evaluator.config.border}`
                        }}>
                          {evaluator.name}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                          Evaluator
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.15rem' }}>
                        <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mocks Taken</span>
                          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--skarion-navy)' }}>{evaluator.mockCount}</div>
                        </div>

                        <div style={{ background: 'var(--bg-surface-subtle)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Audit Notes</span>
                          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--skarion-orange)' }}>{evaluator.notesCount}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '700' }}>Avg Given Rating:</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0284c7' }}>
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

      {/* Executive Performance Audit & Deep Analysis Modal */}
      {activeAuditSession && (
        <ExecutiveAuditReportModal
          isOpen={Boolean(activeAuditSession)}
          onClose={() => {
            setActiveAuditSession(null);
            setActiveAuditCandidate(null);
          }}
          session={activeAuditSession}
          candidate={activeAuditCandidate || currentStudent}
          onSaveAnalysis={handleSaveAuditAnalysis}
          showToast={showToast}
        />
      )}

    </div>
  );
}

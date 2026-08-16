import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Copy, 
  Check, 
  Edit3, 
  BookOpen, 
  Award, 
  FileText, 
  Save, 
  Quote, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  BarChart2,
  Sliders,
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { parseAuditAnalysis, serializeAuditAnalysis } from '../utils/auditAnalysisParser';

const DEFAULT_PILLARS = [
  'Communication & Delivery',
  'Technical & Domain Knowledge',
  'Tools & Practical Workflow',
  'Problem-Solving & Methodology',
  'Standards & Quality Processes'
];

export default function ExecutiveAuditReportModal({
  isOpen,
  onClose,
  session,
  candidate,
  onSaveAnalysis,
  showToast
}) {
  if (!isOpen || !session) return null;

  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'customize' | 'edit'
  const [rawText, setRawText] = useState(session.auditAnalysis || '');
  const [isCopied, setIsCopied] = useState(false);
  const modalBodyRef = useRef(null);

  // Parse structured data from rawText or session
  const parsed = parseAuditAnalysis(rawText || session.auditAnalysis || session.feedback || '');

  // Customizable score state
  const initialScore = parsed?.overallScore !== null && parsed?.overallScore !== undefined 
    ? parsed.overallScore 
    : Number(session.score || 7.0);

  const [customOverallScore, setCustomOverallScore] = useState(initialScore);
  const [customOverallSummary, setCustomOverallSummary] = useState(parsed?.overallSummary || session.feedback || '');
  
  // Custom metrics array
  const [customMetrics, setCustomMetrics] = useState(() => {
    if (parsed?.metrics && parsed.metrics.length > 0) {
      return parsed.metrics.map(m => ({
        name: m.name,
        score: Number(m.score !== null ? m.score : 7),
        maxScore: Number(m.maxScore || 10),
        note: m.note || ''
      }));
    }
    return DEFAULT_PILLARS.map(name => ({
      name,
      score: 7,
      maxScore: 10,
      note: ''
    }));
  });

  // Lock background scroll when modal is open and reset modal scroll to top
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, activeTab]);

  // Sync state if session changes
  useEffect(() => {
    const currentParsed = parseAuditAnalysis(session.auditAnalysis || session.feedback || '');
    setRawText(session.auditAnalysis || '');
    const sc = currentParsed?.overallScore !== null && currentParsed?.overallScore !== undefined 
      ? currentParsed.overallScore 
      : Number(session.score || 7.0);
    setCustomOverallScore(sc);
    setCustomOverallSummary(currentParsed?.overallSummary || session.feedback || '');

    if (currentParsed?.metrics && currentParsed.metrics.length > 0) {
      setCustomMetrics(currentParsed.metrics.map(m => ({
        name: m.name,
        score: Number(m.score !== null ? m.score : 7),
        maxScore: Number(m.maxScore || 10),
        note: m.note || ''
      })));
    }
  }, [session]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText || session.auditAnalysis || '');
    setIsCopied(true);
    if (showToast) showToast('Copied performance analysis report to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Handle saving raw text editor changes
  const handleSaveRawText = () => {
    const parsedCurrent = parseAuditAnalysis(rawText);
    const finalScore = parsedCurrent?.overallScore !== null && parsedCurrent?.overallScore !== undefined 
      ? parsedCurrent.overallScore 
      : customOverallScore;

    if (onSaveAnalysis) {
      onSaveAnalysis(session.id, rawText, finalScore);
      if (showToast) showToast(`Saved performance audit report (Score: ${finalScore}/10)!`);
    }
    setActiveTab('visual');
  };

  // Handle saving custom manual scores
  const handleSaveCustomScores = () => {
    const updatedParsed = {
      ...parsed,
      candidateName: parsed?.candidateName || candidate?.name || '',
      targetRole: parsed?.targetRole || candidate?.targetRole || candidate?.domain || '',
      overallScore: Number(customOverallScore),
      overallSummary: customOverallSummary.trim(),
      metrics: customMetrics
    };

    const newSerializedText = serializeAuditAnalysis(updatedParsed);
    setRawText(newSerializedText);

    if (onSaveAnalysis) {
      onSaveAnalysis(session.id, newSerializedText, Number(customOverallScore));
      if (showToast) showToast(`Updated & synchronized score to ${customOverallScore}/10!`);
    }
    setActiveTab('visual');
  };

  // Auto-calculate overall score as the exact mean of all metric scores
  const handleAutoCalculateOverall = () => {
    if (!customMetrics || customMetrics.length === 0) return;
    const sum = customMetrics.reduce((acc, m) => acc + (Number(m.score) || 0), 0);
    const avg = parseFloat((sum / customMetrics.length).toFixed(1));
    setCustomOverallScore(avg);
    if (showToast) showToast(`Calculated average score: ${avg}/10`);
  };

  // Metric color helper
  const getMetricColor = (score, max = 10) => {
    const ratio = score / max;
    if (ratio >= 0.8) return { bar: '#059669', bg: 'rgba(5, 150, 105, 0.12)', text: '#059669' };
    if (ratio >= 0.65) return { bar: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', text: '#0284c7' };
    if (ratio >= 0.5) return { bar: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706' };
    return { bar: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', text: '#dc2626' };
  };

  const currentScoreVal = Number(customOverallScore || session.score || 0);

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      style={{ 
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 15, 29, 0.82)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        margin: 0,
        padding: '1.25rem',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '960px', 
          width: '100%',
          maxHeight: '92vh',
          display: 'flex', 
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '1.25rem 1.75rem', 
          background: 'linear-gradient(135deg, var(--skarion-navy) 0%, #1e293b 100%)', 
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span style={{ 
                background: 'linear-gradient(135deg, var(--skarion-orange) 0%, #e04343 100%)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: '900',
                padding: '3px 9px',
                borderRadius: '6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                EXECUTIVE AUDIT
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '600' }}>
                Candidate: <strong style={{ color: '#ffffff' }}>{candidate?.name || parsed?.candidateName}</strong> • Evaluator: {session.evaluator}
              </span>
            </div>
            <h2 style={{ fontSize: '1.28rem', fontWeight: '900', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Performance Metrics & Evaluation Breakdown
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* 3-Way Tab Switcher */}
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '3px', borderRadius: '10px', display: 'flex' }}>
              <button
                type="button"
                onClick={() => setActiveTab('visual')}
                style={{
                  background: activeTab === 'visual' ? '#ffffff' : 'transparent',
                  color: activeTab === 'visual' ? 'var(--skarion-navy)' : '#cbd5e1',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={13} /> Visual Matrix
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('customize')}
                style={{
                  background: activeTab === 'customize' ? 'var(--skarion-orange)' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sliders size={13} /> Customize Scores
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                style={{
                  background: activeTab === 'edit' ? '#ffffff' : 'transparent',
                  color: activeTab === 'edit' ? 'var(--skarion-navy)' : '#cbd5e1',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Edit3 size={13} /> Raw Text
              </button>
            </div>

            <button 
              type="button"
              onClick={handleCopy}
              className="btn-secondary"
              style={{ height: '34px', padding: '0 0.75rem', background: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78rem' }}
              title="Copy analysis text"
            >
              {isCopied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button 
              type="button" 
              onClick={onClose} 
              className="btn-icon" 
              style={{ width: '34px', height: '34px', color: '#ffffff', background: 'rgba(255,255,255,0.1)', border: 'none' }}
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={modalBodyRef} style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>
          
          {/* ========================================================================= */}
          {/* TAB 1: VISUAL MATRIX VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'visual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Top Banner: Score & Executive Assessment */}
              <div style={{ 
                background: 'var(--bg-surface-subtle)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '16px', 
                padding: '1.35rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--skarion-navy)' }}>
                      {parsed?.candidateName || candidate?.name}
                    </strong>
                    <span style={{ 
                      fontSize: '0.78rem', 
                      fontWeight: '800', 
                      color: 'var(--skarion-orange)', 
                      background: 'rgba(255, 82, 82, 0.12)', 
                      padding: '3px 9px', 
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 82, 82, 0.25)'
                    }}>
                      🎯 {parsed?.targetRole || candidate?.targetRole || candidate?.domain || 'Technical Domain'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontWeight: '500', lineHeight: '1.5' }}>
                    {parsed?.overallSummary || session?.feedback}
                  </p>
                </div>

                {/* Synchronized Overall Assessment Score Badge */}
                <div style={{ 
                  background: 'var(--bg-surface)', 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '16px', 
                  padding: '0.85rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    OVERALL ASSESSMENT
                  </span>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '900', 
                    color: currentScoreVal >= 8 ? '#059669' : currentScoreVal >= 6 ? '#0284c7' : '#dc2626',
                    lineHeight: '1.1',
                    margin: '0.2rem 0'
                  }}>
                    {currentScoreVal.toFixed(1)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ 10</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('customize')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--skarion-orange)',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 0'
                    }}
                  >
                    <Sliders size={11} /> Calibrate
                  </button>
                </div>
              </div>

              {/* 1. Performance Metrics Breakdown */}
              {parsed?.metrics && parsed.metrics.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BarChart2 size={18} color="var(--skarion-orange)" /> 5-Pillar Performance Metrics
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('customize')}
                      className="btn-secondary"
                      style={{ height: '30px', padding: '0 0.65rem', fontSize: '0.74rem', fontWeight: '800' }}
                    >
                      <Sliders size={12} /> Adjust Scores
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.85rem' }}>
                    {parsed.metrics.map((metric, idx) => {
                      const col = getMetricColor(metric.score, metric.maxScore);
                      const pct = Math.min(100, Math.round((metric.score / metric.maxScore) * 100));

                      return (
                        <div key={idx} style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.95rem 1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <strong style={{ fontSize: '0.88rem', color: 'var(--skarion-navy)' }}>{metric.name}</strong>
                            <span style={{ fontSize: '0.82rem', fontWeight: '900', color: col.text, background: col.bg, padding: '2px 8px', borderRadius: '6px' }}>
                              {metric.score} / {metric.maxScore}
                            </span>
                          </div>

                          <div style={{ width: '100%', height: '7px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.45rem' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: col.bar, borderRadius: '99px', transition: 'width 0.3s ease' }} />
                          </div>

                          {metric.note && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                              {metric.note}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Key Strengths */}
              {parsed?.strengths && parsed.strengths.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#059669', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={19} color="#059669" /> Key Strengths Noted
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.85rem' }}>
                    {parsed.strengths.map((str, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(5, 150, 105, 0.04)', 
                        border: '1px solid rgba(5, 150, 105, 0.22)', 
                        borderRadius: '12px', 
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        gap: '0.75rem'
                      }}>
                        <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#065f46', display: 'block', marginBottom: '0.25rem' }}>
                            {str.title}
                          </strong>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                            {str.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Critical Weaknesses & Engineering Fixes */}
              {parsed?.weaknesses && parsed.weaknesses.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#dc2626', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={19} color="#dc2626" /> Critical Weaknesses & Mentor Engineering Fixes
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                    {parsed.weaknesses.map((weak, idx) => (
                      <div key={idx} style={{ 
                        background: 'var(--bg-surface-subtle)', 
                        border: '1px solid rgba(220, 38, 38, 0.25)', 
                        borderLeft: '4px solid #dc2626',
                        borderRadius: '14px', 
                        padding: '1.25rem 1.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                          <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '5px', fontSize: '0.74rem', fontWeight: '900' }}>
                            #{idx + 1}
                          </span>
                          <strong style={{ fontSize: '0.96rem', color: 'var(--skarion-navy)' }}>
                            {weak.title}
                          </strong>
                        </div>

                        {weak.mistake && (
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: '0 0 0.6rem 0', lineHeight: '1.5' }}>
                            {weak.mistake}
                          </p>
                        )}

                        {weak.quote && (
                          <div style={{ 
                            background: 'rgba(239, 68, 68, 0.08)', 
                            borderLeft: '3px solid #ef4444', 
                            padding: '0.65rem 0.95rem', 
                            borderRadius: '0 8px 8px 0', 
                            marginBottom: '0.65rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'flex-start'
                          }}>
                            <Quote size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ fontSize: '0.82rem', color: '#991b1b', fontStyle: 'italic', lineHeight: '1.45' }}>
                              "{weak.quote}"
                            </div>
                          </div>
                        )}

                        {weak.correction && (
                          <div style={{ 
                            background: 'rgba(2, 132, 199, 0.08)', 
                            border: '1px solid rgba(2, 132, 199, 0.25)', 
                            padding: '0.75rem 0.95rem', 
                            borderRadius: '10px',
                            display: 'flex',
                            gap: '0.55rem',
                            alignItems: 'flex-start'
                          }}>
                            <Sparkles size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong style={{ fontSize: '0.76rem', color: '#0369a1', textTransform: 'uppercase', display: 'block', marginBottom: '3px', letterSpacing: '0.02em' }}>
                                Mentor Engineering Correction:
                              </strong>
                              <p style={{ fontSize: '0.84rem', color: '#0f172a', margin: 0, lineHeight: '1.5' }}>
                                {weak.correction}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Action Items for Mentor */}
              {parsed?.actionItems && parsed.actionItems.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#7c3aed', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={19} color="#7c3aed" /> Action Items for Mentor
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.85rem' }}>
                    {parsed.actionItems.map((act, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(124, 58, 237, 0.04)', 
                        border: '1px solid rgba(124, 58, 237, 0.22)', 
                        borderRadius: '12px', 
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        gap: '0.75rem'
                      }}>
                        <div style={{ 
                          width: '26px', 
                          height: '26px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', 
                          color: '#ffffff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: '900', 
                          fontSize: '0.76rem',
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#5b21b6', display: 'block', marginBottom: '0.25rem' }}>
                            {act.title}
                          </strong>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                            {act.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CUSTOMIZE & CALIBRATE SCORES (MANUAL OVERRIDE) */}
          {/* ========================================================================= */}
          {activeTab === 'customize' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Header Info */}
              <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sliders size={20} color="var(--skarion-orange)" /> Manual Score Customization & Calibration
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                      Adjust the overall mock evaluation rating and individual 5-pillar scores. Scores will sync instantly across the entire platform.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoCalculateOverall}
                    className="btn-secondary"
                    style={{ height: '36px', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <RefreshCw size={13} /> Auto-Calculate Mean from 5 Pillars
                  </button>
                </div>
              </div>

              {/* Overall Assessment Score Input Card */}
              <div style={{ background: 'var(--bg-surface)', border: '2px solid var(--skarion-navy)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.92rem', fontWeight: '900', color: 'var(--skarion-navy)', display: 'block', marginBottom: '0.2rem' }}>
                      ⭐ Primary Overall Assessment Rating (Out of 10)
                    </label>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      This score will be synchronized with Candidate Profile, Mock Hub, and Analytics Stats
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={customOverallScore}
                      onChange={(e) => setCustomOverallScore(parseFloat(e.target.value) || 0)}
                      className="input-control"
                      style={{ width: '80px', height: '42px', fontSize: '1.25rem', fontWeight: '900', textAlign: 'center', color: currentScoreVal >= 8 ? '#059669' : currentScoreVal >= 6 ? '#0284c7' : '#dc2626' }}
                    />
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-muted)' }}>/ 10</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={customOverallScore}
                  onChange={(e) => setCustomOverallScore(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: currentScoreVal >= 8 ? '#059669' : currentScoreVal >= 6 ? '#0284c7' : '#dc2626', height: '8px' }}
                />

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Executive Assessment Summary Statement:
                  </label>
                  <input
                    type="text"
                    value={customOverallSummary}
                    onChange={(e) => setCustomOverallSummary(e.target.value)}
                    placeholder="e.g. High fluency and confidence, but critical engineering misconceptions require direct intervention"
                    className="input-control"
                    style={{ fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Individual 5-Pillar Score Cards */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0 }}>
                    Evaluation Pillar Breakdown & Custom Scores
                  </h4>

                  <button
                    type="button"
                    onClick={() => setCustomMetrics([...customMetrics, { name: 'New Custom Metric', score: 7, maxScore: 10, note: '' }])}
                    className="btn-secondary"
                    style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.76rem', fontWeight: '800' }}
                  >
                    <Plus size={13} /> Add Metric Pillar
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {customMetrics.map((metric, idx) => {
                    const col = getMetricColor(metric.score, metric.maxScore);

                    return (
                      <div key={idx} style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.15rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <input
                            type="text"
                            value={metric.name}
                            onChange={(e) => {
                              const updated = [...customMetrics];
                              updated[idx].name = e.target.value;
                              setCustomMetrics(updated);
                            }}
                            className="input-control"
                            style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--skarion-navy)' }}
                          />

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={metric.score}
                              onChange={(e) => {
                                const updated = [...customMetrics];
                                updated[idx].score = parseFloat(e.target.value) || 0;
                                setCustomMetrics(updated);
                              }}
                              className="input-control"
                              style={{ width: '70px', height: '36px', textAlign: 'center', fontWeight: '900', color: col.text }}
                            />
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>/ 10</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCustomMetrics(customMetrics.filter((_, i) => i !== idx))}
                            className="btn-icon"
                            style={{ color: '#dc2626', width: '36px', height: '36px' }}
                            title="Remove Metric"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={metric.score}
                          onChange={(e) => {
                            const updated = [...customMetrics];
                            updated[idx].score = parseFloat(e.target.value);
                            setCustomMetrics(updated);
                          }}
                          style={{ width: '100%', cursor: 'pointer', accentColor: col.bar, marginBottom: '0.65rem' }}
                        />

                        <input
                          type="text"
                          value={metric.note}
                          onChange={(e) => {
                            const updated = [...customMetrics];
                            updated[idx].note = e.target.value;
                            setCustomMetrics(updated);
                          }}
                          placeholder="Observation notes for this metric (e.g. Articulate, steady pacing, zero hesitation)..."
                          className="input-control"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveTab('visual')}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleSaveCustomScores}
                  style={{ height: '42px', padding: '0 1.5rem', fontWeight: '900' }}
                >
                  <Save size={16} /> Apply & Synchronize All Scores
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: RAW TEXT EDITOR */}
          {/* ========================================================================= */}
          {activeTab === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                    Paste or Edit Audit Analysis Text
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Supports structured evaluation reports (PERFORMANCE METRICS, STRENGTHS, CRITICAL WEAKNESSES, ACTION ITEMS).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const parsedCurrent = parseAuditAnalysis(rawText);
                    if (parsedCurrent) {
                      setRawText(serializeAuditAnalysis(parsedCurrent));
                      if (showToast) showToast('Cleaned & structured report text!');
                    }
                  }}
                  className="btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    fontSize: '0.78rem',
                    height: '34px',
                    padding: '0 0.85rem'
                  }}
                >
                  <Sparkles size={14} /> Auto-Format & Clean Text
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste performance metrics and feedback report text here..."
                rows={16}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '2px solid var(--skarion-orange)',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                  {rawText.length} Characters • {rawText.split(/\s+/).filter(Boolean).length} Words
                </span>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setActiveTab('visual')}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={handleSaveRawText}
                    style={{ height: '40px', padding: '0 1.5rem', fontWeight: '800' }}
                  >
                    <Save size={16} /> Save & Reparse Report
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

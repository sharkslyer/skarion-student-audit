import React, { useState } from 'react';
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
  BarChart2
} from 'lucide-react';
import { parseAuditAnalysis } from '../utils/auditAnalysisParser';

export default function ExecutiveAuditReportModal({
  isOpen,
  onClose,
  session,
  candidate,
  onSaveAnalysis,
  showToast
}) {
  if (!isOpen || !session) return null;

  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'edit'
  const [rawText, setRawText] = useState(session.auditAnalysis || '');
  const [isCopied, setIsCopied] = useState(false);

  const parsed = parseAuditAnalysis(rawText || session.auditAnalysis || session.feedback || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText || session.auditAnalysis || '');
    setIsCopied(true);
    if (showToast) showToast('Copied performance analysis report to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSave = () => {
    if (onSaveAnalysis) {
      onSaveAnalysis(session.id, rawText);
      if (showToast) showToast('Saved performance audit analysis report!');
    }
    setActiveTab('visual');
  };

  const getMetricColor = (score, max = 10) => {
    const ratio = score / max;
    if (ratio >= 0.8) return { bar: '#059669', bg: 'rgba(5, 150, 105, 0.12)', text: '#059669' };
    if (ratio >= 0.65) return { bar: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', text: '#0284c7' };
    if (ratio >= 0.5) return { bar: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706' };
    return { bar: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', text: '#dc2626' };
  };

  const overallScoreVal = parsed?.overallScore !== null && parsed?.overallScore !== undefined 
    ? parsed.overallScore 
    : Number(session.score || 0);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 99999 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '920px', 
          width: '95%',
          maxHeight: '90vh',
          display: 'flex', 
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '1.4rem 1.85rem', 
          background: 'linear-gradient(135deg, var(--skarion-navy) 0%, #1e293b 100%)', 
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
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
                Session Date: {session.date} • Evaluator: {session.evaluator}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ffffff', margin: 0 }}>
              Performance Metrics & Audit Breakdown
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Tab Switcher */}
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
                <Edit3 size={13} /> Edit / Paste Raw
              </button>
            </div>

            <button 
              type="button"
              onClick={handleCopy}
              className="btn-secondary"
              style={{ height: '36px', padding: '0 0.85rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
              title="Copy analysis text"
            >
              {isCopied ? <Check size={15} color="#34d399" /> : <Copy size={15} />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button 
              type="button" 
              onClick={onClose} 
              className="btn-icon" 
              style={{ width: '36px', height: '36px', color: '#ffffff', background: 'rgba(255,255,255,0.1)', border: 'none' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>
          
          {activeTab === 'edit' ? (
            /* RAW TEXT EDITOR MODE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                    Paste or Edit Audit Analysis Text
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Paste structured evaluation reports (including PERFORMANCE METRICS, STRENGTHS, CRITICAL WEAKNESSES with Quotes & Corrections, and ACTION ITEMS).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    background: 'linear-gradient(135deg, var(--skarion-orange) 0%, #e04343 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(255, 82, 82, 0.3)'
                  }}
                >
                  <Save size={15} /> Save & Apply
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="CANDIDATE PERFORMANCE METRICS & FEEDBACK&#10;&#10;Candidate: Name&#10;Target Role: Role&#10;Overall Assessment: 5.5 / 10 (Summary)&#10;&#10;PERFORMANCE METRICS:&#10;* Communication: 9 / 10 (Notes)&#10;* Technical: 3 / 10 (Notes)&#10;&#10;STRENGTHS:&#10;* Title: Description&#10;&#10;CRITICAL WEAKNESSES:&#10;* Issue: Explanation (Quote: &quot;...&quot;). Correction: ...&#10;&#10;ACTION ITEMS FOR MENTOR:&#10;* Item: Action"
                rows={18}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: '0.88rem',
                  lineHeight: '1.6',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>
          ) : (
            /* VISUAL MATRIX PRESENTATION MODE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              
              {/* Top Banner: Overall Score, Candidate & Executive Summary */}
              <div style={{ 
                background: 'linear-gradient(135deg, var(--bg-surface-subtle) 0%, var(--bg-surface) 100%)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '16px', 
                padding: '1.5rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0 }}>
                      {parsed?.candidateName || candidate?.name || 'Candidate Performance Review'}
                    </h3>
                    <span style={{ 
                      fontSize: '0.78rem', 
                      fontWeight: '800', 
                      color: 'var(--skarion-orange)', 
                      background: 'rgba(255, 82, 82, 0.12)', 
                      padding: '3px 9px', 
                      borderRadius: '6px' 
                    }}>
                      🎯 {parsed?.targetRole || candidate?.targetRole || candidate?.domain || 'Technical Track'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontWeight: '500', lineHeight: '1.5' }}>
                    {parsed?.overallSummary || session.feedback || 'Comprehensive performance audit and technical evaluation.'}
                  </p>
                </div>

                {/* Overall Score Badge */}
                <div style={{ 
                  background: 'var(--bg-surface)', 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '16px', 
                  padding: '1rem 1.6rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    OVERALL ASSESSMENT
                  </span>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '900', 
                    color: overallScoreVal >= 8 ? '#059669' : overallScoreVal >= 6 ? '#0284c7' : '#dc2626',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
                    {overallScoreVal.toFixed(1)}
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ 10</span>
                  </div>
                </div>
              </div>

              {/* 1. PERFORMANCE METRICS BARS */}
              {parsed?.metrics && parsed.metrics.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'var(--skarion-navy)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart2 size={18} color="var(--skarion-orange)" /> Multidimensional Performance Metrics
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '0.85rem' }}>
                    {parsed.metrics.map((metric, idx) => {
                      const col = getMetricColor(metric.score, metric.maxScore);
                      const pct = Math.min(100, Math.round((metric.score / metric.maxScore) * 100));

                      return (
                        <div key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem 1.15rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <strong style={{ fontSize: '0.88rem', color: 'var(--skarion-navy)' }}>{metric.name}</strong>
                            <span style={{ 
                              fontSize: '0.82rem', 
                              fontWeight: '900', 
                              color: col.text, 
                              background: col.bg, 
                              padding: '2px 8px', 
                              borderRadius: '6px' 
                            }}>
                              {metric.score} / {metric.maxScore}
                            </span>
                          </div>

                          {/* Progress Meter Bar */}
                          <div style={{ width: '100%', height: '7px', background: 'var(--bg-surface-subtle)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.45rem' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: col.bar, borderRadius: '99px', transition: 'width 0.4s ease' }} />
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

              {/* 2. KEY STRENGTHS */}
              {parsed?.strengths && parsed.strengths.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#059669', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={19} color="#059669" /> Key Engineering Strengths & Assets
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '0.85rem' }}>
                    {parsed.strengths.map((str, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(5, 150, 105, 0.04)', 
                        border: '1px solid rgba(5, 150, 105, 0.25)', 
                        borderRadius: '12px', 
                        padding: '1.1rem 1.25rem',
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

              {/* 3. CRITICAL WEAKNESSES & MISCONCEPTIONS WITH QUOTES & CORRECTIONS */}
              {parsed?.weaknesses && parsed.weaknesses.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#dc2626', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={19} color="#dc2626" /> Critical Weaknesses & Engineering Corrections
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {parsed.weaknesses.map((weak, idx) => (
                      <div key={idx} style={{ 
                        background: 'var(--bg-surface)', 
                        border: '1px solid rgba(220, 38, 38, 0.25)', 
                        borderLeft: '5px solid #dc2626',
                        borderRadius: '14px', 
                        padding: '1.25rem 1.4rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '800' }}>
                            GAP #{idx + 1}
                          </span>
                          <strong style={{ fontSize: '0.94rem', color: 'var(--skarion-navy)' }}>
                            {weak.title}
                          </strong>
                        </div>

                        {weak.mistake && (
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: '0 0 0.65rem 0', lineHeight: '1.5' }}>
                            {weak.mistake}
                          </p>
                        )}

                        {/* Quote Callout */}
                        {weak.quote && (
                          <div style={{ 
                            background: 'rgba(239, 68, 68, 0.07)', 
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

                        {/* Mentor Engineering Correction */}
                        {weak.correction && (
                          <div style={{ 
                            background: 'rgba(2, 132, 199, 0.07)', 
                            border: '1px solid rgba(2, 132, 199, 0.25)', 
                            padding: '0.75rem 1rem', 
                            borderRadius: '10px',
                            display: 'flex',
                            gap: '0.6rem',
                            alignItems: 'flex-start'
                          }}>
                            <Sparkles size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong style={{ fontSize: '0.8rem', color: '#0369a1', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
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

              {/* 4. ACTION ITEMS FOR MENTOR */}
              {parsed?.actionItems && parsed.actionItems.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#7c3aed', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={19} color="#7c3aed" /> Mentor Remediation & Action Plan
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '0.85rem' }}>
                    {parsed.actionItems.map((act, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(124, 58, 237, 0.04)', 
                        border: '1px solid rgba(124, 58, 237, 0.22)', 
                        borderRadius: '12px', 
                        padding: '1.1rem 1.25rem',
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
                          fontSize: '0.74rem',
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

        </div>

        {/* Modal Footer */}
        <div style={{ 
          padding: '1.1rem 1.85rem', 
          background: 'var(--bg-surface-subtle)', 
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            SKARION Candidate Audit Engine • Full Transcripts & Executive Analysis Sync
          </span>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            style={{ height: '38px', padding: '0 1.5rem', fontWeight: '800' }}
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}

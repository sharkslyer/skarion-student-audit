import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Copy, 
  Check, 
  Edit3, 
  BarChart2, 
  Quote, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { parseAuditAnalysis } from '../utils/auditAnalysisParser';

export default function ExecutiveAuditReportCard({
  rawText,
  candidate,
  session,
  onOpenModal,
  showToast
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const parsed = parseAuditAnalysis(rawText || session?.auditAnalysis || '');

  if (!parsed || (!parsed.metrics.length && !parsed.strengths.length && !parsed.weaknesses.length && !parsed.actionItems.length)) {
    return null;
  }

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(rawText || session?.auditAnalysis || '');
    setIsCopied(true);
    if (showToast) showToast('Copied performance analysis report!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getMetricColor = (score, max = 10) => {
    const ratio = score / max;
    if (ratio >= 0.8) return { bar: '#059669', bg: 'rgba(5, 150, 105, 0.12)', text: '#059669' };
    if (ratio >= 0.65) return { bar: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', text: '#0284c7' };
    if (ratio >= 0.5) return { bar: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706' };
    return { bar: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', text: '#dc2626' };
  };

  const overallScoreVal = parsed.overallScore !== null && parsed.overallScore !== undefined 
    ? parsed.overallScore 
    : Number(session?.score || 0);

  return (
    <div className="card-panel" style={{ padding: '1.75rem 2rem', marginTop: '1.5rem', background: 'var(--bg-surface)' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              Candidate Performance Metrics & Evaluation Breakdown
            </h3>
          </div>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            Multi-dimensional audit report, verbatim quote analysis & mentor action plan
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary"
            style={{ height: '36px', padding: '0 0.85rem', fontSize: '0.78rem' }}
            title="Copy Report"
          >
            {isCopied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="btn-primary"
              style={{ height: '36px', padding: '0 1rem', fontSize: '0.82rem' }}
            >
              <Edit3 size={14} /> Full View / Edit
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn-icon"
            style={{ width: '36px', height: '36px' }}
            title={isCollapsed ? 'Expand Report' : 'Collapse Report'}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top Banner: Score & Summary */}
          <div style={{ 
            background: 'var(--bg-surface-subtle)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '14px', 
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <strong style={{ fontSize: '1.15rem', color: 'var(--skarion-navy)' }}>
                  {parsed.candidateName || candidate?.name}
                </strong>
                <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--skarion-orange)', background: 'rgba(255, 82, 82, 0.12)', padding: '2px 8px', borderRadius: '5px' }}>
                  🎯 {parsed.targetRole || candidate?.targetRole || candidate?.domain}
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: 0, fontWeight: '500', lineHeight: '1.5' }}>
                {parsed.overallSummary || session?.feedback}
              </p>
            </div>

            <div style={{ 
              background: 'var(--bg-surface)', 
              border: '2px solid var(--border-color)', 
              borderRadius: '14px', 
              padding: '0.75rem 1.4rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                OVERALL ASSESSMENT
              </span>
              <div style={{ 
                fontSize: '1.8rem', 
                fontWeight: '900', 
                color: overallScoreVal >= 8 ? '#059669' : overallScoreVal >= 6 ? '#0284c7' : '#dc2626',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '3px'
              }}>
                {overallScoreVal.toFixed(1)}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ 10</span>
              </div>
            </div>
          </div>

          {/* 1. Performance Metrics Breakdown */}
          {parsed.metrics.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--skarion-navy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <BarChart2 size={17} color="var(--skarion-orange)" /> Performance Metrics
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.75rem' }}>
                {parsed.metrics.map((metric, idx) => {
                  const col = getMetricColor(metric.score, metric.maxScore);
                  const pct = Math.min(100, Math.round((metric.score / metric.maxScore) * 100));

                  return (
                    <div key={idx} style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.9rem 1.1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--skarion-navy)' }}>{metric.name}</strong>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: col.text, background: col.bg, padding: '2px 8px', borderRadius: '5px' }}>
                          {metric.score} / {metric.maxScore}
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: col.bar, borderRadius: '99px' }} />
                      </div>

                      {metric.note && (
                        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
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
          {parsed.strengths.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '900', color: '#059669', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={18} color="#059669" /> Strengths
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.75rem' }}>
                {parsed.strengths.map((str, idx) => (
                  <div key={idx} style={{ 
                    background: 'rgba(5, 150, 105, 0.04)', 
                    border: '1px solid rgba(5, 150, 105, 0.22)', 
                    borderRadius: '12px', 
                    padding: '0.95rem 1.15rem',
                    display: 'flex',
                    gap: '0.65rem'
                  }}>
                    <CheckCircle2 size={17} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#065f46', display: 'block', marginBottom: '0.2rem' }}>
                        {str.title}
                      </strong>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.45' }}>
                        {str.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Critical Weaknesses with Quotes & Corrections */}
          {parsed.weaknesses.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '900', color: '#dc2626', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <AlertTriangle size={18} color="#dc2626" /> Critical Weaknesses & Engineering Corrections
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {parsed.weaknesses.map((weak, idx) => (
                  <div key={idx} style={{ 
                    background: 'var(--bg-surface-subtle)', 
                    border: '1px solid rgba(220, 38, 38, 0.25)', 
                    borderLeft: '4px solid #dc2626',
                    borderRadius: '12px', 
                    padding: '1.15rem 1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                      <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '2px 7px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '800' }}>
                        #{idx + 1}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--skarion-navy)' }}>
                        {weak.title}
                      </strong>
                    </div>

                    {weak.mistake && (
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', lineHeight: '1.45' }}>
                        {weak.mistake}
                      </p>
                    )}

                    {weak.quote && (
                      <div style={{ 
                        background: 'rgba(239, 68, 68, 0.07)', 
                        borderLeft: '3px solid #ef4444', 
                        padding: '0.55rem 0.85rem', 
                        borderRadius: '0 6px 6px 0', 
                        marginBottom: '0.55rem',
                        display: 'flex',
                        gap: '0.45rem',
                        alignItems: 'flex-start'
                      }}>
                        <Quote size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '0.8rem', color: '#991b1b', fontStyle: 'italic', lineHeight: '1.4' }}>
                          "{weak.quote}"
                        </div>
                      </div>
                    )}

                    {weak.correction && (
                      <div style={{ 
                        background: 'rgba(2, 132, 199, 0.07)', 
                        border: '1px solid rgba(2, 132, 199, 0.22)', 
                        padding: '0.65rem 0.85rem', 
                        borderRadius: '8px',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'flex-start'
                      }}>
                        <Sparkles size={15} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong style={{ fontSize: '0.76rem', color: '#0369a1', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                            Mentor Engineering Correction:
                          </strong>
                          <p style={{ fontSize: '0.82rem', color: '#0f172a', margin: 0, lineHeight: '1.45' }}>
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
          {parsed.actionItems.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '900', color: '#7c3aed', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Target size={18} color="#7c3aed" /> Action Items for Mentor
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '0.75rem' }}>
                {parsed.actionItems.map((act, idx) => (
                  <div key={idx} style={{ 
                    background: 'rgba(124, 58, 237, 0.04)', 
                    border: '1px solid rgba(124, 58, 237, 0.2)', 
                    borderRadius: '12px', 
                    padding: '0.95rem 1.15rem',
                    display: 'flex',
                    gap: '0.65rem'
                  }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', 
                      color: '#ffffff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: '900', 
                      fontSize: '0.72rem',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: '#5b21b6', display: 'block', marginBottom: '0.2rem' }}>
                        {act.title}
                      </strong>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.45' }}>
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
  );
}

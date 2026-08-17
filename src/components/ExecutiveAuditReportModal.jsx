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
  FileText, 
  Save, 
  Quote, 
  Sliders,
  Calendar,
  User,
  Plus,
  Trash2,
  RefreshCw,
  Paperclip,
  UploadCloud,
  Download,
  Eye,
  ExternalLink
} from 'lucide-react';
import { parseAuditAnalysis, serializeAuditAnalysis } from '../utils/auditAnalysisParser';
import { createFastBlobUrl, savePdfToIndexedDb } from '../utils/pdfStorage';

const DEFAULT_METRIC_NAMES = [
  'Communication & Delivery',
  'Technical & Domain Knowledge',
  'Tools & Practical Workflow',
  'Problem-Solving & Methodology',
  'Standards & Quality Processes'
];

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '0 KB';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ExecutiveAuditReportModal({
  isOpen,
  onClose,
  session,
  candidate,
  onSaveAnalysis,
  showToast
}) {
  if (!isOpen || !session) return null;

  const fileInputRef = useRef(null);
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  const [isCustomizingScores, setIsCustomizingScores] = useState(false);
  const [rawText, setRawText] = useState(session.auditAnalysis || '');
  const [isCopied, setIsCopied] = useState(false);

  // PDF Attachment State
  const [pdfAttachment, setPdfAttachment] = useState(session.pdfAttachment || session.auditPdf || null);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  // Fast memoized blob URL for instant smooth preview
  useEffect(() => {
    let url = null;
    if (pdfAttachment?.dataUrl && isPdfPreviewOpen) {
      url = createFastBlobUrl(pdfAttachment.dataUrl);
      setPdfBlobUrl(url);
    } else {
      setPdfBlobUrl(null);
    }
    return () => {
      if (url && typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [pdfAttachment?.dataUrl, isPdfPreviewOpen]);

  // Parse structured data from rawText or session
  const parsed = parseAuditAnalysis(rawText || session.auditAnalysis || session.feedback || '');

  // Synchronized score states
  const initialScore = parsed?.overallScore !== null && parsed?.overallScore !== undefined 
    ? parsed.overallScore 
    : Number(session.score || 7.0);

  const [overallScore, setOverallScore] = useState(initialScore);
  const [overallSummary, setOverallSummary] = useState(parsed?.overallSummary || session.feedback || '');
  
  // Metrics state
  const [metrics, setMetrics] = useState(() => {
    if (parsed?.metrics && parsed.metrics.length > 0) {
      return parsed.metrics.map(m => ({
        name: m.name,
        score: Number(m.score !== null ? m.score : 7),
        maxScore: Number(m.maxScore || 10),
        note: m.note || ''
      }));
    }
    return DEFAULT_METRIC_NAMES.map(name => ({
      name,
      score: 7,
      maxScore: 10,
      note: ''
    }));
  });

  // Sync state whenever session changes
  useEffect(() => {
    const currentParsed = parseAuditAnalysis(session.auditAnalysis || session.feedback || '');
    setRawText(session.auditAnalysis || '');
    setPdfAttachment(session.pdfAttachment || session.auditPdf || null);
    setIsPdfPreviewOpen(false);

    const sc = currentParsed?.overallScore !== null && currentParsed?.overallScore !== undefined 
      ? currentParsed.overallScore 
      : Number(session.score || 7.0);
    setOverallScore(sc);
    setOverallSummary(currentParsed?.overallSummary || session.feedback || '');

    if (currentParsed?.metrics && currentParsed.metrics.length > 0) {
      setMetrics(currentParsed.metrics.map(m => ({
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
    if (showToast) showToast('Copied audit report to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Handle PDF file upload
  const handleFileUpload = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      if (showToast) showToast('Please select a valid PDF file (.pdf)');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      if (showToast) showToast('File too large. Maximum PDF size is 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newAttachment = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        dataUrl: e.target.result,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setPdfAttachment(newAttachment);
      if (showToast) showToast(`Attached PDF: "${file.name}"!`);
    };
    reader.readAsDataURL(file);
  };

  // Save all changes and sync score and PDF attachment throughout website
  const handleSaveAll = () => {
    let textToSave = rawText;

    if (!isEditingRaw) {
      const updatedParsed = {
        ...parsed,
        candidateName: parsed?.candidateName || candidate?.name || '',
        targetRole: parsed?.targetRole || candidate?.targetRole || candidate?.domain || '',
        overallScore: Number(overallScore),
        overallSummary: overallSummary.trim(),
        metrics: metrics
      };
      textToSave = serializeAuditAnalysis(updatedParsed);
      setRawText(textToSave);
    } else {
      const parsedFromRaw = parseAuditAnalysis(rawText);
      if (parsedFromRaw?.overallScore !== null && parsedFromRaw?.overallScore !== undefined) {
        setOverallScore(parsedFromRaw.overallScore);
      }
    }

    if (onSaveAnalysis) {
      if (pdfAttachment && session?.id) {
        savePdfToIndexedDb(session.id, pdfAttachment);
      }
      onSaveAnalysis(session.id, textToSave, Number(overallScore), pdfAttachment);
      if (showToast) showToast(`Saved performance audit & PDF attachment!`);
    }

    setIsEditingRaw(false);
    setIsCustomizingScores(false);
    onClose();
  };

  const getMetricColor = (score, max = 10) => {
    const ratio = score / max;
    if (ratio >= 0.8) return { bar: '#059669', bg: 'rgba(5, 150, 105, 0.12)', text: '#059669' };
    if (ratio >= 0.65) return { bar: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', text: '#0284c7' };
    if (ratio >= 0.5) return { bar: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706' };
    return { bar: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', text: '#dc2626' };
  };

  const candidateName = parsed?.candidateName || candidate?.name || 'Candidate';
  const targetRole = parsed?.targetRole || candidate?.targetRole || candidate?.domain || 'Technical Track';
  const scoreNum = Number(overallScore || session.score || 0);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '860px', 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          padding: '1.75rem',
          borderRadius: '16px'
        }}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--skarion-navy) 0%, #0284c7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.5rem',
              boxShadow: '0 4px 14px rgba(19, 34, 71, 0.2)'
            }}>
              {candidateName.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0 }}>
                  {candidateName}
                </h2>
                <span style={{ 
                  fontSize: '0.76rem', 
                  fontWeight: '800', 
                  color: 'var(--skarion-orange)', 
                  background: 'rgba(255, 82, 82, 0.12)', 
                  padding: '3px 8px', 
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 82, 82, 0.25)'
                }}>
                  🎯 {targetRole}
                </span>
                {pdfAttachment && (
                  <span style={{ 
                    fontSize: '0.74rem', 
                    fontWeight: '800', 
                    color: '#dc2626', 
                    background: '#fef2f2', 
                    padding: '2px 8px', 
                    borderRadius: '6px',
                    border: '1px solid #fecaca',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Paperclip size={11} /> PDF Attached
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} color="var(--text-dim)" /> Evaluated by {session.evaluator} on {session.date}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              type="button"
              className={isEditingRaw ? "btn-primary" : "btn-secondary"} 
              style={{ height: '36px', padding: '0 0.85rem', fontSize: '0.8rem', fontWeight: '700' }} 
              onClick={() => setIsEditingRaw(!isEditingRaw)}
            >
              <Edit3 size={14} /> {isEditingRaw ? 'View Mode' : 'Edit Raw Text'}
            </button>
            <button 
              type="button"
              className="btn-secondary" 
              style={{ height: '36px', padding: '0 0.85rem', fontSize: '0.8rem' }} 
              onClick={handleCopy}
              title="Copy formatted audit report"
            >
              {isCopied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            <button 
              type="button"
              className="btn-icon" 
              style={{ width: '36px', height: '36px' }} 
              onClick={onClose}
              title="Close window"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: RAW TEXT EDITOR MODE */}
        {/* ========================================================================= */}
        {isEditingRaw ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                  Paste or Edit Verbatim Audit Report:
                </label>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block' }}>
                  Includes PERFORMANCE METRICS, STRENGTHS, CRITICAL WEAKNESSES (Quotes & Corrections), and ACTION ITEMS.
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const currentParsed = parseAuditAnalysis(rawText);
                  if (currentParsed) {
                    setRawText(serializeAuditAnalysis(currentParsed));
                    if (showToast) showToast('Cleaned and structured report text!');
                  }
                }}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  fontSize: '0.76rem',
                  height: '32px',
                  padding: '0 0.8rem'
                }}
              >
                <Sparkles size={13} /> Auto-Clean & Format
              </button>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste performance evaluation metrics and feedback report text here..."
              rows={14}
              className="input-control"
              style={{
                fontSize: '13px',
                fontFamily: 'monospace',
                lineHeight: '1.6',
                padding: '1rem',
                borderRadius: '12px',
                border: '2px solid var(--skarion-orange)'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                {rawText.length} Characters • {rawText.split(/\s+/).filter(Boolean).length} Words
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsEditingRaw(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={handleSaveAll} style={{ height: '38px' }}>
                  <Save size={15} /> Save & Apply
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: CLEAN STRUCTURED REPORT & ACCORDION SCORE CONTROLS */
          /* ========================================================================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Score & Full Executive Summary Banner */}
            <div style={{ 
              background: 'var(--bg-surface-subtle)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '14px', 
              padding: '1.25rem 1.4rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}>
              {/* Full Executive Assessment Summary Box */}
              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.03em' }}>
                  EXECUTIVE ASSESSMENT SUMMARY
                </label>
                {isCustomizingScores ? (
                  <textarea
                    value={overallSummary}
                    onChange={(e) => setOverallSummary(e.target.value)}
                    placeholder="Record executive assessment summary feedback..."
                    rows={3}
                    className="input-control"
                    style={{ fontSize: '0.88rem', fontWeight: '500', lineHeight: '1.5', flex: 1, resize: 'vertical' }}
                  />
                ) : (
                  <div style={{ 
                    background: 'var(--bg-surface)', 
                    padding: '0.85rem 1.15rem', 
                    borderRadius: '10px', 
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    lineHeight: '1.55',
                    fontWeight: '500',
                    flex: 1,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {overallSummary || session?.feedback || 'No executive summary provided.'}
                  </div>
                )}
              </div>

              {/* Overall Rating Score Display + Optional Calibration Toggle */}
              <div style={{ 
                background: 'var(--bg-surface)', 
                border: '2px solid var(--border-color)', 
                borderRadius: '14px', 
                padding: '0.85rem 1.4rem',
                textAlign: 'center',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  OVERALL RATING
                </span>

                {isCustomizingScores ? (
                  <div style={{ margin: '0.3rem 0', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '0.3rem' }}>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={overallScore}
                        onChange={(e) => setOverallScore(parseFloat(e.target.value) || 0)}
                        className="input-control"
                        style={{ 
                          width: '62px', 
                          height: '34px', 
                          fontSize: '1.2rem', 
                          fontWeight: '900', 
                          textAlign: 'center', 
                          color: scoreNum >= 8 ? '#059669' : scoreNum >= 6 ? '#0284c7' : '#dc2626',
                          padding: '2px'
                        }}
                      />
                      <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--text-muted)' }}>/ 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={overallScore}
                      onChange={(e) => setOverallScore(parseFloat(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: scoreNum >= 8 ? '#059669' : scoreNum >= 6 ? '#0284c7' : '#dc2626' }}
                    />
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '1.95rem', 
                    fontWeight: '900', 
                    color: scoreNum >= 8 ? '#059669' : scoreNum >= 6 ? '#0284c7' : '#dc2626',
                    lineHeight: '1.1',
                    margin: '0.25rem 0'
                  }}>
                    {scoreNum.toFixed(1)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ 10</span>
                  </div>
                )}

                {/* Score Customization Choice Button */}
                <button
                  type="button"
                  onClick={() => setIsCustomizingScores(!isCustomizingScores)}
                  style={{
                    background: isCustomizingScores ? 'var(--skarion-orange)' : 'var(--bg-surface-subtle)',
                    color: isCustomizingScores ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '3px 9px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '0.25rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sliders size={11} /> {isCustomizingScores ? 'Done Editing' : 'Customize Scores'}
                </button>
              </div>
            </div>

            {/* 1. PDF Evaluation Document Attachment Section */}
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Paperclip size={16} color="var(--skarion-orange)" />
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0 }}>
                    Official PDF Evaluation Attachment
                  </h4>
                </div>

                {pdfAttachment && (
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669', background: 'rgba(5, 150, 105, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    ✓ Document Stored & Linked
                  </span>
                )}
              </div>

              {pdfAttachment ? (
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(220, 38, 38, 0.1)',
                        color: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}>
                        PDF
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--skarion-navy)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {pdfAttachment.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatFileSize(pdfAttachment.size)} • Uploaded {pdfAttachment.uploadedAt || 'recently'}
                        </span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setIsPdfPreviewOpen(!isPdfPreviewOpen)}
                        style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.76rem', fontWeight: '700' }}
                      >
                        <Eye size={13} /> {isPdfPreviewOpen ? 'Hide Preview' : 'Preview PDF'}
                      </button>

                      <a
                        href={pdfBlobUrl || pdfAttachment.dataUrl}
                        download={pdfAttachment.name || 'Audit_Evaluation.pdf'}
                        className="btn-secondary"
                        style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.76rem', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Download size={13} /> Download
                      </a>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ height: '32px', padding: '0 0.65rem', fontSize: '0.76rem' }}
                        title="Replace with another PDF"
                      >
                        <UploadCloud size={13} /> Replace
                      </button>

                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => {
                          setPdfAttachment(null);
                          setIsPdfPreviewOpen(false);
                          if (showToast) showToast('Removed PDF attachment');
                        }}
                        style={{ width: '32px', height: '32px', color: '#dc2626' }}
                        title="Remove attachment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Embedded PDF Viewer on Preview */}
                  {isPdfPreviewOpen && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                          Interactive Document Viewer
                        </span>
                        <a
                          href={pdfBlobUrl || pdfAttachment.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--skarion-orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        >
                          <ExternalLink size={12} /> Open in New Tab
                        </a>
                      </div>
                      <iframe
                        src={pdfBlobUrl || pdfAttachment.dataUrl}
                        title="PDF Attachment Preview"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '480px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: '#525659'
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Upload Drag & Drop Area */
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '2px dashed var(--border-color)',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UploadCloud size={28} color="var(--skarion-orange)" style={{ marginBottom: '0.35rem' }} />
                  <strong style={{ fontSize: '0.86rem', color: 'var(--skarion-navy)', display: 'block', marginBottom: '0.15rem' }}>
                    Click to upload or drag & drop evaluation PDF
                  </strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Supports evaluation rubrics, problem sheets, candidate test packages, or resume PDFs (up to 15MB)
                  </span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                accept="application/pdf,.pdf"
                style={{ display: 'none' }}
              />
            </div>

            {/* 2. Performance Metrics Breakdown */}
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0 }}>
                  Performance Evaluation Metrics {isCustomizingScores ? '(Manual Calibration Mode)' : '(Calculated from Analysis)'}
                </h4>

                {isCustomizingScores ? (
                  <button
                    type="button"
                    onClick={() => {
                      const avg = parseFloat((metrics.reduce((acc, m) => acc + (Number(m.score) || 0), 0) / metrics.length).toFixed(1));
                      setOverallScore(avg);
                      if (showToast) showToast(`Calculated overall rating from average: ${avg}/10`);
                    }}
                    className="btn-secondary"
                    style={{ height: '28px', padding: '0 0.65rem', fontSize: '0.72rem', fontWeight: '800' }}
                  >
                    ⚡ Auto-Average Score ({parseFloat((metrics.reduce((acc, m) => acc + (Number(m.score) || 0), 0) / metrics.length).toFixed(1))}/10)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCustomizingScores(true)}
                    className="btn-secondary"
                    style={{ height: '28px', padding: '0 0.65rem', fontSize: '0.72rem', fontWeight: '800' }}
                  >
                    <Sliders size={12} /> Customize Scores
                  </button>
                )}
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '0.75rem' }}>
                {metrics.map((metric, idx) => {
                  const col = getMetricColor(metric.score, metric.maxScore);
                  const pct = Math.min(100, Math.round((metric.score / metric.maxScore) * 100));

                  return (
                    <div key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--skarion-navy)' }}>{metric.name}</strong>
                        
                        {isCustomizingScores ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={metric.score}
                              onChange={(e) => {
                                const updated = [...metrics];
                                updated[idx].score = parseFloat(e.target.value) || 0;
                                setMetrics(updated);
                              }}
                              className="input-control"
                              style={{ width: '56px', height: '28px', fontSize: '0.84rem', fontWeight: '900', textAlign: 'center', color: col.text, padding: '2px' }}
                            />
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted)' }}>/ 10</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', fontWeight: '900', color: col.text, background: col.bg, padding: '2px 7px', borderRadius: '5px' }}>
                            {metric.score} / {metric.maxScore}
                          </span>
                        )}
                      </div>

                      {isCustomizingScores ? (
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={metric.score}
                          onChange={(e) => {
                            const updated = [...metrics];
                            updated[idx].score = parseFloat(e.target.value);
                            setMetrics(updated);
                          }}
                          style={{ width: '100%', cursor: 'pointer', accentColor: col.bar, marginBottom: '0.4rem' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: col.bar, borderRadius: '99px' }} />
                        </div>
                      )}

                      {metric.note && (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', lineHeight: '1.4' }}>
                          {metric.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Key Strengths */}
            {parsed?.strengths && parsed.strengths.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#059669', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="#059669" /> Key Strengths Noted
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.65rem' }}>
                  {parsed.strengths.map((str, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(5, 150, 105, 0.04)', 
                      border: '1px solid rgba(5, 150, 105, 0.22)', 
                      borderRadius: '10px', 
                      padding: '0.85rem 1rem'
                    }}>
                      <strong style={{ fontSize: '0.84rem', color: '#065f46', display: 'block', marginBottom: '0.2rem' }}>
                        {str.title}
                      </strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.45' }}>
                        {str.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Critical Weaknesses with Quotes & Corrections */}
            {parsed?.weaknesses && parsed.weaknesses.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#dc2626', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertTriangle size={16} color="#dc2626" /> Critical Observations & Mentor Corrections
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {parsed.weaknesses.map((weak, idx) => (
                    <div key={idx} style={{ 
                      background: 'var(--bg-surface-subtle)', 
                      border: '1px solid rgba(220, 38, 38, 0.25)', 
                      borderLeft: '4px solid #dc2626',
                      borderRadius: '10px', 
                      padding: '0.95rem 1.15rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                        <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}>
                          #{idx + 1}
                        </span>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--skarion-navy)' }}>
                          {weak.title}
                        </strong>
                      </div>

                      {weak.mistake && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: '0 0 0.45rem 0', lineHeight: '1.45' }}>
                          {weak.mistake}
                        </p>
                      )}

                      {weak.quote && (
                        <div style={{ 
                          background: 'rgba(239, 68, 68, 0.08)', 
                          borderLeft: '3px solid #ef4444', 
                          padding: '0.5rem 0.75rem', 
                          borderRadius: '0 6px 6px 0', 
                          marginBottom: '0.45rem',
                          display: 'flex',
                          gap: '0.45rem',
                          alignItems: 'flex-start'
                        }}>
                          <Quote size={13} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ fontSize: '0.78rem', color: '#991b1b', fontStyle: 'italic', lineHeight: '1.4' }}>
                            "{weak.quote}"
                          </div>
                        </div>
                      )}

                      {weak.correction && (
                        <div style={{ 
                          background: 'rgba(2, 132, 199, 0.08)', 
                          border: '1px solid rgba(2, 132, 199, 0.22)', 
                          padding: '0.55rem 0.75rem', 
                          borderRadius: '8px',
                          display: 'flex',
                          gap: '0.45rem',
                          alignItems: 'flex-start'
                        }}>
                          <Sparkles size={14} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ fontSize: '0.74rem', color: '#0369a1', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                              Mentor Engineering Correction:
                            </strong>
                            <p style={{ fontSize: '0.8rem', color: '#0f172a', margin: 0, lineHeight: '1.45' }}>
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

            {/* 5. Action Items for Mentor */}
            {parsed?.actionItems && parsed.actionItems.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#7c3aed', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Target size={16} color="#7c3aed" /> Action Items for Mentor
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.65rem' }}>
                  {parsed.actionItems.map((act, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(124, 58, 237, 0.04)', 
                      border: '1px solid rgba(124, 58, 237, 0.2)', 
                      borderRadius: '10px', 
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      gap: '0.65rem'
                    }}>
                      <div style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        background: 'var(--skarion-navy)', 
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
                        <strong style={{ fontSize: '0.84rem', color: '#5b21b6', display: 'block', marginBottom: '0.2rem' }}>
                          {act.title}
                        </strong>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.45' }}>
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

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-primary" onClick={handleSaveAll} style={{ height: '38px', padding: '0 1.25rem' }}>
            <Save size={15} /> Save & Synchronize Scores
          </button>
        </div>

      </div>
    </div>
  );
}

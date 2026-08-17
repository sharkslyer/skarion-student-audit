import React, { useState, useMemo } from 'react';
import { 
  Mic, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Award, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  User, 
  Trash2, 
  X, 
  Send,
  Sparkles,
  Search,
  Check,
  FileText,
  Copy,
  Edit3,
  BookOpen,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  MessageSquare,
  ArrowRight,
  Clock,
  Activity,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  BarChart2,
  Paperclip,
  Save
} from 'lucide-react';
import { EVALUATORS, EVALUATOR_CONFIG, MOCK_ROUND_TYPES, RATING_CONFIG } from '../data/initialData';
import { getTodayLocalDate } from '../utils/dateUtils';
import { parseAndOrganizeTranscript } from '../utils/transcriptParser';
import { parseAuditAnalysis } from '../utils/auditAnalysisParser';
import ExecutiveAuditReportModal from './ExecutiveAuditReportModal';
import ExecutiveAuditReportCard from './ExecutiveAuditReportCard';

export default function MockInterviewView({ students, onSaveStudent, onSelectStudent, showToast }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Recent Mocks Panel State
  const [recentEvaluatorFilter, setRecentEvaluatorFilter] = useState('all');
  const [recentMocksSearch, setRecentMocksSearch] = useState('');
  const [isRecentMocksExpanded, setIsRecentMocksExpanded] = useState(false);
  const [activeTranscriptStudent, setActiveTranscriptStudent] = useState(null);

  // Executive Audit Analysis Modal State
  const [activeAuditSession, setActiveAuditSession] = useState(null);
  const [activeAuditCandidate, setActiveAuditCandidate] = useState(null);

  // Transcript Reader / Editor Modal State
  const [activeTranscriptSession, setActiveTranscriptSession] = useState(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [transcriptTextBuffer, setTranscriptTextBuffer] = useState('');
  const [transcriptFontSize, setTranscriptFontSize] = useState(15); // Font size in px
  const [transcriptSpeakerFilter, setTranscriptSpeakerFilter] = useState('all'); // Speaker filter in viewer
  const [transcriptWordSearch, setTranscriptWordSearch] = useState(''); // Word search inside transcript viewer

  // Form state for logging / editing a mock session
  const [editingMockSession, setEditingMockSession] = useState(null);
  const [editingMockCandidate, setEditingMockCandidate] = useState(null);
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [mockDate, setMockDate] = useState(getTodayLocalDate());
  const [mockEvaluator, setMockEvaluator] = useState(EVALUATORS[0]);
  const [mockCategory, setMockCategory] = useState(MOCK_ROUND_TYPES[0]);
  const [mockScore, setMockScore] = useState(7.5);
  const [mockFeedback, setMockFeedback] = useState('');
  const [mockStrengths, setMockStrengths] = useState('');
  const [mockImprovement, setMockImprovement] = useState('');
  const [mockTranscript, setMockTranscript] = useState('');
  const [mockAuditAnalysis, setMockAuditAnalysis] = useState('');
  const [mockPdfAttachment, setMockPdfAttachment] = useState(null);

  // Filter candidates matching search query
  const searchableCandidates = students.filter(s => 
    !candidateSearchQuery || s.name.toLowerCase().includes(candidateSearchQuery.toLowerCase())
  );

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const mockSessions = currentStudent?.mockSessions || [];

  // Sort mock sessions chronologically (oldest to newest for the graph)
  const sortedSessions = [...mockSessions].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute performance metrics
  const totalMocks = sortedSessions.length;
  const scores = sortedSessions.map(s => Number(s.score || 0));
  const avgScore = totalMocks > 0 ? (scores.reduce((a, b) => a + b, 0) / totalMocks).toFixed(1) : '0.0';
  const firstScore = scores[0] || 0;
  const latestScore = scores[scores.length - 1] || 0;
  const scoreDiff = (latestScore - firstScore).toFixed(1);
  const isImproving = Number(scoreDiff) > 0;
  const isDeclining = Number(scoreDiff) < 0;

  // Extract and sort all recent mock sessions across the entire candidate database
  const allRecentMocks = useMemo(() => {
    return (students || []).flatMap(student => 
      (student?.mockSessions || []).map(session => ({
        ...session,
        studentId: student?.id,
        studentName: student?.name,
        studentRating: student?.rating,
        studentTargetRole: student?.targetRole || student?.domain || '',
        studentData: student
      }))
    ).sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      if (dateB !== dateA) return dateB - dateA;
      return String(b.id).localeCompare(String(a.id));
    });
  }, [students]);

  const evaluatorsWithMocks = useMemo(() => {
    return Array.from(new Set(allRecentMocks.map(m => m.evaluator).filter(Boolean)));
  }, [allRecentMocks]);

  const filteredRecentMocks = useMemo(() => {
    return allRecentMocks.filter(mock => {
      if (recentEvaluatorFilter !== 'all' && mock.evaluator !== recentEvaluatorFilter) {
        return false;
      }
      if (recentMocksSearch.trim()) {
        const q = recentMocksSearch.trim().toLowerCase();
        const matchName = mock.studentName?.toLowerCase().includes(q);
        const matchCategory = mock.category?.toLowerCase().includes(q);
        const matchFeedback = mock.feedback?.toLowerCase().includes(q);
        const matchEvaluator = mock.evaluator?.toLowerCase().includes(q);
        const matchStrengths = mock.strengths?.toLowerCase().includes(q);
        if (!matchName && !matchCategory && !matchFeedback && !matchEvaluator && !matchStrengths) return false;
      }
      return true;
    });
  }, [allRecentMocks, recentEvaluatorFilter, recentMocksSearch]);

  const displayedRecentMocks = isRecentMocksExpanded ? filteredRecentMocks : filteredRecentMocks.slice(0, 4);

  // Open Edit Mock Modal pre-populated with all session fields
  const handleOpenEditMock = (session, candidate) => {
    const student = candidate || students.find(s => s.id === session.studentId) || currentStudent;
    setEditingMockSession(session);
    setEditingMockCandidate(student);
    setTargetStudentId(student?.id || selectedStudentId);
    setMockDate(session.date || getTodayLocalDate());
    setMockEvaluator(session.evaluator || EVALUATORS[0]);
    setMockCategory(session.category || MOCK_ROUND_TYPES[0]);
    setMockScore(Number(session.score !== undefined && session.score !== null ? session.score : 7.5));
    setMockFeedback(session.feedback || '');
    setMockStrengths(session.strengths || '');
    setMockImprovement(session.improvement || '');
    setMockTranscript(session.transcript || '');
    setMockAuditAnalysis(session.auditAnalysis || '');
    setMockPdfAttachment(session.pdfAttachment || null);
    setIsLogModalOpen(true);
  };

  // Open New Mock Modal with clean defaults
  const handleOpenNewMock = () => {
    setEditingMockSession(null);
    setEditingMockCandidate(null);
    setTargetStudentId(selectedStudentId || students[0]?.id || '');
    setMockDate(getTodayLocalDate());
    setMockEvaluator(EVALUATORS[0]);
    setMockCategory(MOCK_ROUND_TYPES[0]);
    setMockScore(7.5);
    setMockFeedback('');
    setMockStrengths('');
    setMockImprovement('');
    setMockTranscript('');
    setMockAuditAnalysis('');
    setMockPdfAttachment(null);
    setIsLogModalOpen(true);
  };

  // Handle submitting new or edited mock interview record
  const handleLogMock = (e) => {
    e.preventDefault();
    if (!mockFeedback.trim()) return;

    const studentToUpdate = students.find(s => s.id === targetStudentId) || editingMockCandidate || currentStudent;
    if (!studentToUpdate) return;

    // Automatically parse raw transcript if pasted in form
    const studentRosterNames = (students || []).map(s => s?.name).filter(Boolean);
    const cleanedTranscript = mockTranscript.trim() ? parseAndOrganizeTranscript(mockTranscript.trim(), studentRosterNames) : '';

    const existingSessions = studentToUpdate.mockSessions || [];

    if (editingMockSession) {
      // EDIT MODE: Update existing session in place
      const updatedSessions = existingSessions.map(s => {
        if (s.id === editingMockSession.id) {
          return {
            ...s,
            date: mockDate || getTodayLocalDate(),
            score: Number(mockScore),
            evaluator: mockEvaluator,
            category: mockCategory,
            feedback: mockFeedback.trim(),
            strengths: mockStrengths.trim(),
            improvement: mockImprovement.trim(),
            transcript: cleanedTranscript,
            auditAnalysis: mockAuditAnalysis.trim(),
            pdfAttachment: mockPdfAttachment
          };
        }
        return s;
      });

      const updatedStudent = {
        ...studentToUpdate,
        mockSessions: updatedSessions
      };

      onSaveStudent(updatedStudent);
      if (showToast) showToast(`Updated Mock Interview record for ${studentToUpdate.name}`);
    } else {
      // CREATE MODE: Add new session
      const newSession = {
        id: `mock-${Date.now()}`,
        date: mockDate || getTodayLocalDate(),
        score: Number(mockScore),
        evaluator: mockEvaluator,
        category: mockCategory,
        feedback: mockFeedback.trim(),
        strengths: mockStrengths.trim(),
        improvement: mockImprovement.trim(),
        transcript: cleanedTranscript,
        auditAnalysis: mockAuditAnalysis.trim(),
        pdfAttachment: mockPdfAttachment
      };

      const updatedSessions = [...existingSessions, newSession];

      // Automatically update student's mockInterviews count
      const updatedStudent = {
        ...studentToUpdate,
        mockInterviews: updatedSessions.length,
        mockSessions: updatedSessions
      };

      // Automatically append an audit log entry for this mock interview
      const auditNote = {
        id: `note-mock-${Date.now()}`,
        date: mockDate || getTodayLocalDate(),
        content: `Mock Interview (${mockCategory}): Scored ${mockScore}/10. ${mockFeedback.trim()}`,
        category: 'Mock Feedback',
        author: mockEvaluator,
        accent: mockScore >= 8 ? 'green' : mockScore >= 5 ? 'blue' : 'amber',
        pinned: true
      };
      updatedStudent.stickyNotes = [auditNote, ...(updatedStudent.stickyNotes || [])];

      onSaveStudent(updatedStudent);
      if (showToast) showToast(`Logged ${mockScore}/10 Mock Interview for ${studentToUpdate.name}`);
    }

    // Reset form & close modal
    setMockFeedback('');
    setMockStrengths('');
    setMockImprovement('');
    setMockTranscript('');
    setMockAuditAnalysis('');
    setMockPdfAttachment(null);
    setEditingMockSession(null);
    setEditingMockCandidate(null);
    setIsLogModalOpen(false);
  };

  // Handle saving updated audit analysis text, score, and PDF attachment
  const handleSaveAuditAnalysis = (sessionId, newAnalysisText, updatedScore, pdfAttachment) => {
    const candidateToUpdate = activeAuditCandidate || currentStudent;
    if (!candidateToUpdate) return;

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
          score: finalScore !== undefined && !isNaN(finalScore) ? finalScore : s.score,
          pdfAttachment: pdfAttachment !== undefined ? pdfAttachment : s.pdfAttachment
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
        score: finalScore !== undefined && !isNaN(finalScore) ? finalScore : activeAuditSession.score,
        pdfAttachment: pdfAttachment !== undefined ? pdfAttachment : activeAuditSession.pdfAttachment
      });
    }
  };

  // Handle deleting a mock session record
  const handleDeleteMock = (sessionId) => {
    if (!currentStudent) return;
    const updatedSessions = mockSessions.filter(s => s.id !== sessionId);
    const updatedStudent = {
      ...currentStudent,
      mockInterviews: updatedSessions.length,
      mockSessions: updatedSessions
    };
    onSaveStudent(updatedStudent);
    if (showToast) showToast('Deleted mock interview record');
  };

  // Open Transcript Reader / Editor Modal
  const openTranscriptModal = (session, editMode = false, student = null) => {
    const targetStudent = student || currentStudent;
    setActiveTranscriptStudent(targetStudent);
    if (student && student.id !== selectedStudentId) {
      setSelectedStudentId(student.id);
    }
    setActiveTranscriptSession(session);
    setTranscriptTextBuffer(session.transcript || '');
    setIsEditingTranscript(editMode);
    setTranscriptSpeakerFilter('all');
    setTranscriptWordSearch('');
  };

  // Auto-clean raw Teams / Zoom / Meet copy-paste transcript
  const handleAutoCleanTranscript = () => {
    if (!transcriptTextBuffer) return;
    const studentRosterNames = (students || []).map(s => s?.name).filter(Boolean);
    const cleaned = parseAndOrganizeTranscript(transcriptTextBuffer, studentRosterNames);
    setTranscriptTextBuffer(cleaned);
    if (showToast) showToast('Raw meeting transcript auto-cleaned & organized!');
  };

  // Save Transcript changes
  const handleSaveTranscript = () => {
    const studentToUpdate = activeTranscriptStudent || currentStudent;
    if (!activeTranscriptSession || !studentToUpdate) return;

    const studentRosterNames = (students || []).map(s => s?.name).filter(Boolean);
    const cleanedText = parseAndOrganizeTranscript(transcriptTextBuffer.trim(), studentRosterNames);

    const studentSessions = studentToUpdate.mockSessions || [];
    const updatedSessions = studentSessions.map(s => {
      if (s.id === activeTranscriptSession.id) {
        return { ...s, transcript: cleanedText };
      }
      return s;
    });

    const updatedStudent = {
      ...studentToUpdate,
      mockSessions: updatedSessions
    };

    onSaveStudent(updatedStudent);
    setActiveTranscriptSession({
      ...activeTranscriptSession,
      transcript: cleanedText
    });
    setTranscriptTextBuffer(cleanedText);
    setIsEditingTranscript(false);
    if (showToast) showToast('Transcript saved successfully!');
  };

  // Copy full transcript to clipboard
  const handleCopyTranscript = () => {
    if (!transcriptTextBuffer) return;
    navigator.clipboard.writeText(transcriptTextBuffer);
    if (showToast) showToast('Transcript copied to clipboard!');
  };

  // Helper to count words in transcript
  const getWordCount = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Helper to render chat-style interview dialogue bubbles with rich speaker colors
  const renderChatBubble = (line, index, searchTerm = '') => {
    const speakerMatch = line.match(/^([^:\[\n]+)(?:\s*\[(\d{1,2}:\d{2})\])?\s*:(.*)$/);
    
    if (!speakerMatch) {
      return (
        <div key={index} style={{ marginBottom: '0.65rem', fontSize: `${transcriptFontSize}px`, color: 'var(--text-main)', lineHeight: '1.65' }}>
          {line}
        </div>
      );
    }

    const rawSpeaker = speakerMatch[1].trim();
    const timeTag = speakerMatch[2];
    const rawDialogue = speakerMatch[3].trim();
    // Clean up any leading timestamp numbers (e.g. "04 Hello!" -> "Hello!", "07 Hello?" -> "Hello?")
    const dialogue = rawDialogue.replace(/^\d{1,2}\s+/, '').replace(/^\[\d{1,2}:\d{2}\]:?\s*/, '').trim();
    
    // Filter speaker if filter is active
    if (transcriptSpeakerFilter !== 'all' && rawSpeaker.toLowerCase() !== transcriptSpeakerFilter.toLowerCase()) {
      return null;
    }

    const evalCfg = EVALUATOR_CONFIG[rawSpeaker];
    const isCandidate = !evalCfg && !/interviewer|mayukh|kasshaf|faisal|saki|ferdous|piyas/i.test(rawSpeaker);

    // Initials for avatar circle
    const initials = rawSpeaker.split(/\s+/).map(p => p[0]).join('').substring(0, 2).toUpperCase();

    // Distinct Evaluator & Candidate Color Themes
    const evaluatorKey = evalCfg ? evalCfg.label.toLowerCase() : isCandidate ? 'candidate' : 'interviewer';

    const speakerTheme = evalCfg ? {
      bg: evalCfg.bg,
      border: evalCfg.border,
      text: evalCfg.text,
      badgeBg: evalCfg.badgeBg || evalCfg.text,
      badgeText: '#ffffff',
      gradientStart: evalCfg.text,
      gradientEnd: evalCfg.border,
      evaluatorKey
    } : isCandidate ? {
      bg: 'rgba(99, 102, 241, 0.08)',
      border: 'rgba(99, 102, 241, 0.3)',
      text: '#4f46e5',
      badgeBg: '#4f46e5',
      badgeText: '#ffffff',
      gradientStart: '#6366f1',
      gradientEnd: '#4338ca',
      evaluatorKey
    } : {
      bg: 'rgba(2, 132, 199, 0.08)',
      border: 'rgba(2, 132, 199, 0.3)',
      text: '#0284c7',
      badgeBg: '#0284c7',
      badgeText: '#ffffff',
      gradientStart: '#0284c7',
      gradientEnd: '#0369a1',
      evaluatorKey
    };

    return (
      <div 
        key={index}
        style={{ 
          display: 'flex', 
          flexDirection: isCandidate ? 'row-reverse' : 'row',
          gap: '0.85rem', 
          marginBottom: '1.15rem',
          alignItems: 'flex-start'
        }}
      >
        <svg width="42" height="42" viewBox="0 0 42 42" style={{ flexShrink: 0, userSelect: 'none', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>
          <defs>
            <linearGradient id={`avatar-grad-${rawSpeaker.replace(/\s+/g, '_')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={speakerTheme.gradientStart} />
              <stop offset="100%" stopColor={speakerTheme.gradientEnd} />
            </linearGradient>
          </defs>
          <circle cx="21" cy="21" r="19" fill={`url(#avatar-grad-${rawSpeaker.replace(/\s+/g, '_')})`} stroke="var(--bg-surface)" strokeWidth="2.5" />
          <text 
            x="21" 
            y="21.5" 
            fill="#ffffff" 
            fontSize="14" 
            fontWeight="900" 
            textAnchor="middle" 
            dominantBaseline="central"
            fontFamily="var(--font-main)"
          >
            {initials}
          </text>
        </svg>

        {/* Chat Speech Bubble */}
        <div 
          className={`chat-bubble-card evaluator-${speakerTheme.evaluatorKey}`}
          style={{ 
            maxWidth: '84%',
            background: speakerTheme.bg,
            border: `1.5px solid ${speakerTheme.border}`,
            borderRadius: isCandidate ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            padding: '0.9rem 1.15rem',
            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.15s ease'
          }}
        >
          {/* Top Bar: Speaker Name & Role + Timestamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="chat-speaker-name" style={{ fontWeight: '900', fontSize: '0.86rem', color: speakerTheme.text }}>
                {rawSpeaker}
              </span>
              <span style={{ 
                fontSize: '0.66rem', 
                fontWeight: '800', 
                background: speakerTheme.badgeBg, 
                color: speakerTheme.badgeText, 
                padding: '1px 6px', 
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {isCandidate ? 'Candidate' : 'Interviewer'}
              </span>
            </div>

            {timeTag && (
              <span className="chat-timestamp-badge" style={{ 
                fontSize: '0.72rem', 
                color: 'var(--text-muted)', 
                fontWeight: '800', 
                background: 'var(--bg-surface)', 
                padding: '2px 8px', 
                borderRadius: '6px',
                border: '1px solid var(--border-color)' 
              }}>
                {timeTag}
              </span>
            )}
          </div>

          {/* Dialogue Body Text */}
          <div className="chat-bubble-text" style={{ 
            fontSize: `${transcriptFontSize}px`, 
            lineHeight: '1.68', 
            fontWeight: '400',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {searchTerm ? (() => {
              const parts = dialogue.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
              return parts.map((part, i) =>
                part.toLowerCase() === searchTerm.toLowerCase()
                  ? <mark key={i} style={{ background: '#fde047', color: '#1e1b4b', borderRadius: '3px', padding: '0 2px', fontWeight: '800' }}>{part}</mark>
                  : part
              );
            })() : dialogue}
          </div>
        </div>
      </div>
    );
  };

  // Graph dimensions for SVG performance chart
  const graphWidth = 680;
  const graphHeight = 230;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 45;
  const plotWidth = graphWidth - paddingLeft - paddingRight;
  const plotHeight = graphHeight - paddingTop - paddingBottom;

  // Compute SVG point coordinates
  const points = sortedSessions.map((session, index) => {
    const x = totalMocks === 1 
      ? paddingLeft + plotWidth / 2 
      : paddingLeft + (index / (totalMocks - 1)) * plotWidth;
    const y = paddingTop + plotHeight - ((session.score || 0) / 10) * plotHeight;
    return { x, y, session, index };
  });

  const pathD = points.length > 0 
    ? points.reduce((acc, point, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`
    : '';

  const getScoreColor = (score) => {
    if (score >= 8) return '#059669'; // Green
    if (score >= 5) return '#0284c7'; // Blue
    return '#dc2626'; // Red
  };

  const parsedDialogueParagraphs = useMemo(() => {
    if (!transcriptTextBuffer) return [];
    return parseAndOrganizeTranscript(transcriptTextBuffer).split('\n\n');
  }, [transcriptTextBuffer]);

  const availableSpeakers = useMemo(() => {
    return Array.from(new Set(
      parsedDialogueParagraphs
        .map(p => {
          const match = p.match(/^([^:[\n]+)/);
          return match ? match[1].trim() : null;
        })
        .filter(Boolean)
    ));
  }, [parsedDialogueParagraphs]);

  return (
    <div className="card-panel" style={{ padding: '1.75rem' }}>
      
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #132247 0%, #1e293b 100%)', 
        padding: '1.5rem 1.75rem', 
        borderRadius: '16px', 
        color: '#ffffff',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 8px 24px rgba(19, 34, 71, 0.25)',
        border: '1px solid rgba(56, 189, 248, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <Mic size={30} color="var(--skarion-orange)" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Candidate Mock Interview Performance Hub
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#cbd5e1' }}>
            Track each candidate's mock interview progression, ratings out of 10, evaluator feedback, and copy-paste full transcripts.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={handleOpenNewMock}
          style={{ height: '42px', padding: '0 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Log Mock Interview
        </button>
      </div>

      {/* Recent Mock Interviews Activity Feed Panel */}
      <div 
        className="card-panel" 
        style={{ 
          padding: '1.4rem', 
          marginBottom: '1.5rem', 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Panel Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
              <div style={{ 
                background: 'rgba(255, 82, 82, 0.12)', 
                color: 'var(--skarion-orange)', 
                padding: '6px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Activity size={18} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: 0, letterSpacing: '-0.01em' }}>
                Recent Mock Interviews Activity Feed
              </h3>
              <span style={{ 
                background: 'linear-gradient(135deg, #132247 0%, #1e293b 100%)', 
                color: '#38bdf8', 
                fontSize: '0.72rem', 
                fontWeight: '800', 
                padding: '2px 8px', 
                borderRadius: '12px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                {allRecentMocks.length} Recorded Across Academy
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Instantly view and inspect the latest mock evaluations and transcripts taken across all candidates without manual searching.
            </p>
          </div>

          {/* Quick Search within Recent Mocks */}
          <div style={{ position: 'relative', minWidth: '220px', maxWidth: '300px', flex: '1' }}>
            <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input 
              type="text"
              placeholder="Filter recent by name, topic..."
              value={recentMocksSearch}
              onChange={(e) => setRecentMocksSearch(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '2.1rem', height: '36px', fontSize: '0.82rem', borderRadius: '10px' }}
            />
            {recentMocksSearch && (
              <button 
                onClick={() => setRecentMocksSearch('')} 
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Evaluator Quick Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={12} /> Evaluator:
          </span>
          <button
            onClick={() => setRecentEvaluatorFilter('all')}
            style={{
              background: recentEvaluatorFilter === 'all' ? 'var(--skarion-navy)' : 'var(--bg-surface-subtle)',
              color: recentEvaluatorFilter === 'all' ? '#ffffff' : 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '3px 10px',
              borderRadius: '14px',
              fontSize: '0.74rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All Evaluators ({allRecentMocks.length})
          </button>
          {evaluatorsWithMocks.map(evaluatorName => {
            const isSelected = recentEvaluatorFilter === evaluatorName;
            const evalCfg = EVALUATOR_CONFIG[evaluatorName] || EVALUATOR_CONFIG.Mayukh;
            const count = allRecentMocks.filter(m => m.evaluator === evaluatorName).length;
            return (
              <button
                key={evaluatorName}
                onClick={() => setRecentEvaluatorFilter(evaluatorName)}
                style={{
                  background: isSelected ? evalCfg.badgeBg || evalCfg.text : 'var(--bg-surface-subtle)',
                  color: isSelected ? '#ffffff' : evalCfg.text,
                  border: isSelected ? `1px solid ${evalCfg.border}` : '1px solid var(--border-color)',
                  padding: '3px 10px',
                  borderRadius: '14px',
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>{evaluatorName}</span>
                <span style={{ 
                  background: isSelected ? 'rgba(255,255,255,0.25)' : evalCfg.bg, 
                  color: isSelected ? '#ffffff' : evalCfg.text,
                  padding: '0 4px', 
                  borderRadius: '6px', 
                  fontSize: '0.68rem' 
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recent Mocks Grid */}
        {filteredRecentMocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <FileText size={32} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.2rem' }}>
              No Recent Mocks Found
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              {recentMocksSearch ? 'No mock interviews match your search filter.' : 'Log a new mock interview above to see it appear in this live stream.'}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {displayedRecentMocks.map(mock => {
                const scoreColor = getScoreColor(mock.score);
                const evalCfg = EVALUATOR_CONFIG[mock.evaluator] || EVALUATOR_CONFIG.Mayukh;
                const hasTranscript = mock.transcript && mock.transcript.trim().length > 0;
                const wordCount = getWordCount(mock.transcript);
                const isCurrentSelected = mock.studentId === selectedStudentId;

                // Initials for avatar circle
                const initials = mock.studentName.split(/\s+/).map(p => p[0]).join('').substring(0, 2).toUpperCase();

                return (
                  <div
                    key={mock.id}
                    className="card-panel"
                    style={{
                      padding: '1.15rem',
                      background: isCurrentSelected ? 'var(--bg-surface)' : 'var(--bg-surface)',
                      border: isCurrentSelected ? '2px solid var(--skarion-navy)' : '1px solid var(--border-color)',
                      borderLeft: `5px solid ${scoreColor}`,
                      borderRadius: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: isCurrentSelected ? '0 4px 16px rgba(19, 34, 71, 0.12)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      minWidth: 0
                    }}
                  >
                    <div>
                      {/* Top Header: Candidate Name, Avatar & Score */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', minHeight: '38px', gap: '0.5rem' }}>
                        <div 
                          onClick={() => setSelectedStudentId(mock.studentId)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', minWidth: 0, flex: 1 }}
                          title={`Select ${mock.studentName} and view audit history`}
                        >
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--skarion-navy) 0%, #0284c7 100%)',
                            color: '#ffffff',
                            fontWeight: '900',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {initials}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ 
                              fontSize: '0.92rem', 
                              fontWeight: '800', 
                              color: 'var(--skarion-navy)', 
                              lineHeight: '1.25', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.35rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{mock.studentName}</span>
                              {isCurrentSelected && (
                                <span style={{ fontSize: '0.64rem', background: 'var(--skarion-navy)', color: '#ffffff', padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>Active</span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {mock.studentTargetRole || mock.category}
                            </span>
                          </div>
                        </div>

                        {/* Rating Score Badge */}
                        <span style={{
                          background: getScoreColor(mock.score) + '15',
                          color: scoreColor,
                          fontWeight: '800',
                          fontSize: '0.86rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '8px',
                          border: `1px solid ${scoreColor}30`,
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          {mock.score} / 10
                        </span>
                      </div>

                      {/* Evaluator, Category & Date Metadata Pills */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                        <span style={{
                          color: evalCfg.text,
                          fontWeight: '800',
                          fontSize: '0.72rem',
                          background: evalCfg.bg,
                          padding: '0.12rem 0.5rem',
                          borderRadius: '5px',
                          border: `1px solid ${evalCfg.border}`
                        }}>
                          {mock.evaluator}
                        </span>

                        <span style={{ fontSize: '0.72rem', fontWeight: '700', background: 'var(--bg-surface-subtle)', color: 'var(--skarion-navy)', padding: '0.12rem 0.45rem', borderRadius: '5px', border: '1px solid var(--border-color)' }}>
                          {mock.category}
                        </span>

                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: 'auto' }}>
                          <Calendar size={11} /> {mock.date}
                        </span>
                      </div>

                      {/* Feedback Excerpt - Fixed height with inner clamp to prevent text clipping */}
                      <div style={{
                        background: 'var(--bg-surface-subtle)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        marginBottom: '0.75rem',
                        minHeight: '52px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <p style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-main)',
                          fontStyle: 'italic',
                          lineHeight: '1.45',
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          "{mock.feedback}"
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr auto auto', 
                      gap: '0.45rem', 
                      paddingTop: '0.65rem', 
                      borderTop: '1px solid var(--border-color)', 
                      alignItems: 'center',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      {/* Executive Audit Report Button */}
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setActiveAuditSession(mock);
                          setActiveAuditCandidate(mock.studentData || currentStudent);
                        }}
                        style={{
                          height: '36px',
                          fontSize: '0.78rem',
                          fontWeight: '800',
                          borderRadius: '8px',
                          padding: '0 0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          gap: '0.3rem',
                          background: mock.auditAnalysis || mock.pdfAttachment ? 'rgba(124, 58, 237, 0.1)' : 'var(--bg-surface-subtle)',
                          color: mock.auditAnalysis || mock.pdfAttachment ? '#7c3aed' : 'var(--text-main)',
                          borderColor: mock.auditAnalysis || mock.pdfAttachment ? 'rgba(124, 58, 237, 0.35)' : 'var(--border-color)',
                          whiteSpace: 'nowrap',
                          width: '100%',
                          cursor: 'pointer',
                          boxSizing: 'border-box'
                        }}
                        title="View or edit structured candidate performance audit analysis & attached PDF"
                      >
                        <BarChart2 size={13} color={mock.auditAnalysis || mock.pdfAttachment ? '#7c3aed' : 'var(--text-dim)'} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                          {mock.pdfAttachment ? 'Audit + PDF' : mock.auditAnalysis ? 'Audit Report' : '+ Analysis'}
                        </span>
                      </button>

                      {/* Transcript Button (Always 50% width! Shows "+ Add Transcript" if unavailable) */}
                      {hasTranscript ? (
                        <button
                          className="btn-primary"
                          onClick={() => openTranscriptModal(mock, false, mock.studentData)}
                          style={{
                            background: 'var(--skarion-orange)',
                            color: '#ffffff',
                            height: '36px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            borderRadius: '8px',
                            padding: '0 0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            gap: '0.3rem',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(255, 82, 82, 0.25)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            width: '100%'
                          }}
                          title="Read full interview dialogue transcript"
                        >
                          <BookOpen size={13} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                            Transcript ({wordCount}w)
                          </span>
                        </button>
                      ) : (
                        <button
                          className="btn-secondary"
                          onClick={() => openTranscriptModal(mock, true, mock.studentData)}
                          style={{
                            height: '36px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            borderRadius: '8px',
                            padding: '0 0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            gap: '0.3rem',
                            border: '1px dashed #7c3aed',
                            color: '#7c3aed',
                            background: 'var(--bg-surface-subtle)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%'
                          }}
                          title="Add full interview transcript"
                        >
                          <Plus size={13} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                            + Add Transcript
                          </span>
                        </button>
                      )}

                      {/* Edit Mock Record Button */}
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleOpenEditMock(mock, mock.studentData || currentStudent)}
                        style={{
                          height: '36px',
                          padding: '0 0.55rem',
                          borderRadius: '8px',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                        title="Edit full mock interview record"
                      >
                        <Edit3 size={13} />
                      </button>

                      {/* Select Candidate Button */}
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setSelectedStudentId(mock.studentId);
                          if (showToast) showToast(`Selected ${mock.studentName}`);
                        }}
                        style={{
                          height: '36px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          borderRadius: '8px',
                          padding: '0 0.65rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          color: 'var(--skarion-navy)',
                          borderColor: isCurrentSelected ? 'var(--skarion-navy)' : 'var(--border-color)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          cursor: 'pointer'
                        }}
                        title={`Select ${mock.studentName} and view audit history`}
                      >
                        <span>Select</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Expand / Collapse All Recent Mocks Button */}
            {filteredRecentMocks.length > 4 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setIsRecentMocksExpanded(!isRecentMocksExpanded)}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    padding: '0.45rem 1.25rem',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--bg-surface-subtle)'
                  }}
                >
                  {isRecentMocksExpanded ? (
                    <>
                      <ChevronUp size={15} /> Show Less (Top 4)
                    </>
                  ) : (
                    <>
                      <ChevronDown size={15} /> View All {filteredRecentMocks.length} Recent Mock Sessions
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Candidate Switcher Section */}
      <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-surface-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
          
          {/* Candidate Dropdown Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--skarion-navy)', whiteSpace: 'nowrap' }}>
              Candidate:
            </label>
            <select 
              value={selectedStudentId} 
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="input-control"
              style={{ fontWeight: '800', fontSize: '0.88rem', height: '40px', minWidth: '220px' }}
            >
              {searchableCandidates.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.mockInterviews || (student.mockSessions || []).length} Mocks | {student.progress}%)
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Candidate Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.2rem' }}>
            Quick Select:
          </span>
          {searchableCandidates.slice(0, 8).map(student => {
            const isSelected = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                style={{
                  background: isSelected ? 'var(--skarion-navy)' : 'var(--bg-surface)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--skarion-navy)' : '1px solid var(--border-color)',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <span>{student.name}</span>
                <span style={{ 
                  fontSize: '0.68rem', 
                  opacity: 0.85,
                  background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface-subtle)',
                  padding: '1px 5px',
                  borderRadius: '99px'
                }}>
                  {student.mockInterviews || (student.mockSessions || []).length} Mocks
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Total Sessions */}
        <div className="card-panel" style={{ padding: '1.15rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            TOTAL MOCK SESSIONS
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--skarion-navy)', margin: '0.2rem 0' }}>
            {totalMocks} Sessions
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Attended by {currentStudent.name}</span>
        </div>

        {/* Avg Score */}
        <div className="card-panel" style={{ padding: '1.15rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            AVERAGE RATING
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: getScoreColor(Number(avgScore)), margin: '0.2rem 0' }}>
            {avgScore} <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-muted)' }}>/ 10</span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Overall mock average</span>
        </div>

        {/* Trend Indicator */}
        <div className="card-panel" style={{ padding: '1.15rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            PERFORMANCE TREND
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.2rem 0' }}>
            {isImproving ? (
              <>
                <TrendingUp size={24} color="#059669" />
                <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#059669' }}>+{scoreDiff} pts</span>
              </>
            ) : isDeclining ? (
              <>
                <TrendingDown size={24} color="#dc2626" />
                <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#dc2626' }}>{scoreDiff} pts</span>
              </>
            ) : (
              <>
                <Minus size={24} color="#0284c7" />
                <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0284c7' }}>Steady</span>
              </>
            )}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            {isImproving ? 'Performance Improving' : isDeclining ? 'Needs Performance Push' : 'Consistent Rating'}
          </span>
        </div>

        {/* Latest Score */}
        <div className="card-panel" style={{ padding: '1.15rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            LATEST MOCK SCORE
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: getScoreColor(latestScore), margin: '0.2rem 0' }}>
            {totalMocks > 0 ? `${latestScore} / 10` : 'N/A'}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            {totalMocks > 0 ? `Latest on ${sortedSessions[sortedSessions.length - 1]?.date}` : 'No mocks logged'}
          </span>
        </div>
      </div>

      {/* SVG Performance Improvement / Decline Line Chart with Hover Cursor Pop-Up */}
      <div className="card-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Score Progression Graph (Hover points to view exact log details)
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
            {currentStudent.name}'s Score Progression Trail
          </span>
        </div>

        {/* Hover Popover Card Floating Tooltip */}
        {hoveredPointIndex !== null && points[hoveredPointIndex] && (
          <div style={{
            position: 'absolute',
            left: `${Math.min(85, Math.max(15, (points[hoveredPointIndex].x / graphWidth) * 100))}%`,
            top: `${points[hoveredPointIndex].y - 12}px`,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-surface)',
            border: `2px solid ${getScoreColor(points[hoveredPointIndex].session.score)}`,
            borderRadius: '14px',
            padding: '0.9rem 1.15rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            width: '310px',
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--skarion-navy)' }}>
                Mock #{hoveredPointIndex + 1} • {points[hoveredPointIndex].session.date}
              </span>
              <span style={{ 
                fontWeight: '900', 
                fontSize: '0.9rem', 
                color: getScoreColor(points[hoveredPointIndex].session.score),
                background: getScoreColor(points[hoveredPointIndex].session.score) + '20',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {points[hoveredPointIndex].session.score} / 10
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.35rem' }}>
              {points[hoveredPointIndex].session.category} • {points[hoveredPointIndex].session.evaluator}
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontStyle: 'italic', background: 'var(--bg-surface-subtle)', padding: '0.5rem 0.75rem', borderRadius: '8px', margin: '0.4rem 0', lineHeight: '1.4' }}>
              "{points[hoveredPointIndex].session.feedback}"
            </p>

            {points[hoveredPointIndex].session.transcript && (
              <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: '800', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Full Transcript Saved ({getWordCount(points[hoveredPointIndex].session.transcript)} words)
              </div>
            )}
          </div>
        )}

        {totalMocks === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <Mic size={42} color="var(--text-dim)" style={{ marginBottom: '0.6rem' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.3rem' }}>
              No Mock Interviews Logged Yet for {currentStudent.name}
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Click "+ Log Mock Interview" above to record candidate performance out of 10 and view the score graph!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <svg width="100%" height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`} style={{ overflow: 'visible' }}>
              
              {/* Y-Axis Grid Lines & Labels (0, 2, 4, 6, 8, 10) */}
              {[0, 2, 4, 6, 8, 10].map(val => {
                const y = paddingTop + plotHeight - (val / 10) * plotHeight;
                return (
                  <g key={val}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={graphWidth - paddingRight} 
                      y2={y} 
                      stroke="var(--border-color)" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={paddingLeft - 10} 
                      y={y + 4} 
                      fill="var(--text-muted)" 
                      fontSize="11" 
                      fontWeight="700" 
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Gradient Fill under Line */}
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isImproving ? '#059669' : isDeclining ? '#dc2626' : '#0284c7'} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={isImproving ? '#059669' : isDeclining ? '#dc2626' : '#0284c7'} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {areaD && <path d={areaD} fill="url(#scoreGradient)" />}

              {/* Trend Line */}
              {pathD && (
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke={isImproving ? '#059669' : isDeclining ? '#dc2626' : '#0284c7'} 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}

              {/* Data Points with Hover Events */}
              {points.map((pt) => {
                const isHovered = hoveredPointIndex === pt.index;
                const pointColor = getScoreColor(pt.session.score);

                return (
                  <g 
                    key={pt.session.id}
                    onMouseEnter={() => setHoveredPointIndex(pt.index)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer hover ring */}
                    {isHovered && (
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r="12" 
                        fill={pointColor} 
                        fillOpacity="0.3" 
                      />
                    )}

                    {/* Point Circle */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isHovered ? "8" : "6"} 
                      fill={pointColor} 
                      stroke="#ffffff" 
                      strokeWidth="2.5"
                      style={{ transition: 'all 0.15s ease' }}
                    />

                    {/* Score Label above point */}
                    <text 
                      x={pt.x} 
                      y={pt.y - (isHovered ? 14 : 11)} 
                      fill={pointColor} 
                      fontSize={isHovered ? "13" : "11"} 
                      fontWeight="900" 
                      textAnchor="middle"
                    >
                      {pt.session.score}/10
                    </text>

                    {/* X-Axis Session Date Label */}
                    <text 
                      x={pt.x} 
                      y={paddingTop + plotHeight + 22} 
                      fill={isHovered ? 'var(--skarion-navy)' : 'var(--text-muted)'} 
                      fontSize="10" 
                      fontWeight={isHovered ? "900" : "700"} 
                      textAnchor="middle"
                    >
                      Mock #{pt.index + 1} ({pt.session.date})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Search bar right above roster */}
      <div id="candidate-mock-history" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', scrollMarginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0 }}>
          Candidate Audit Roster — {currentStudent.name} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>({sortedSessions.length} mocks)</span>
        </h3>
        <div style={{ position: 'relative', minWidth: '240px', maxWidth: '340px', flex: '1' }}>
          <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search candidate by name..."
            value={candidateSearchQuery}
            onChange={(e) => setCandidateSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '2.2rem', height: '38px', fontSize: '0.84rem' }}
          />
        </div>
      </div>

      {sortedSessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            No mock history available yet for {currentStudent.name}.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1rem' }}>
          {[...sortedSessions].reverse().map((session) => {
            const evalCfg = EVALUATOR_CONFIG[session.evaluator] || EVALUATOR_CONFIG.Mayukh;
            const scoreColor = getScoreColor(session.score);
            const hasTranscript = session.transcript && session.transcript.trim().length > 0;
            const wordCount = getWordCount(session.transcript);

            return (
              <div 
                key={session.id} 
                className="card-panel" 
                style={{ 
                  padding: '1.15rem', 
                  borderLeft: `5px solid ${scoreColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  {/* Top Bar: Rating Score & Evaluator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ 
                      background: getScoreColor(session.score) + '20', 
                      color: scoreColor, 
                      fontWeight: '900', 
                      fontSize: '0.95rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '8px',
                      border: `1px solid ${scoreColor}40`
                    }}>
                      {session.score} / 10 Rating
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ 
                        color: evalCfg.text, 
                        fontWeight: '800', 
                        fontSize: '0.74rem',
                        background: evalCfg.bg, 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: '5px', 
                        border: `1px solid ${evalCfg.border}`
                      }}>
                        {session.evaluator}
                      </span>
                      <button 
                        type="button"
                        onClick={() => handleOpenEditMock(session, currentStudent)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.75, padding: '2px', display: 'flex', alignItems: 'center' }}
                        title="Edit mock interview record"
                      >
                        <Edit3 size={14} color="var(--text-muted)" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteMock(session.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '2px', display: 'flex', alignItems: 'center' }}
                        title="Delete mock record"
                      >
                        <Trash2 size={14} color="var(--text-muted)" />
                      </button>
                    </div>
                  </div>

                  {/* Round Category & Date */}
                  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Category: {session.category}</span>
                    <span style={{ color: 'var(--text-dim)' }}>• {session.date}</span>
                  </div>

                  {/* Feedback Notes */}
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '0.65rem', lineHeight: '1.45', background: 'var(--bg-surface-subtle)', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
                    "{session.feedback}"
                  </p>

                  {/* Strengths & Improvement Points */}
                  {session.strengths && (
                    <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: '700', marginBottom: '0.2rem' }}>
                      Strength: {session.strengths}
                    </div>
                  )}
                  {session.improvement && (
                    <div style={{ fontSize: '0.76rem', color: '#d97706', fontWeight: '700', marginBottom: '0.6rem' }}>
                      Improvement: {session.improvement}
                    </div>
                  )}

                  {/* Prominent Mock Transcript & Performance Audit Buttons */}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {/* Executive Audit Analysis Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAuditSession(session);
                        setActiveAuditCandidate(currentStudent);
                      }}
                      style={{
                        height: '36px',
                        width: '100%',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '0.35rem',
                        padding: '0 0.5rem',
                        background: session.auditAnalysis || session.pdfAttachment ? 'linear-gradient(135deg, #132247 0%, #1e293b 100%)' : 'var(--bg-surface-subtle)',
                        color: session.auditAnalysis || session.pdfAttachment ? '#38bdf8' : '#7c3aed',
                        border: session.auditAnalysis || session.pdfAttachment ? '1px solid rgba(56, 189, 248, 0.4)' : '1px dashed #7c3aed',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        boxShadow: session.auditAnalysis || session.pdfAttachment ? '0 2px 8px rgba(19, 34, 71, 0.25)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                      title="View or edit performance audit report and attached evaluation PDF"
                    >
                      <BarChart2 size={14} color={session.auditAnalysis || session.pdfAttachment ? '#38bdf8' : '#7c3aed'} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {session.pdfAttachment ? 'Audit + PDF' : session.auditAnalysis ? 'Audit Report' : '+ Add Audit'}
                      </span>
                    </button>

                    {/* Transcript Button (Always 50% width! Shows "+ Add Transcript" if unavailable) */}
                    {hasTranscript ? (
                      <button 
                        type="button"
                        className="btn-primary"
                        onClick={() => openTranscriptModal(session, false)}
                        style={{ 
                          height: '36px',
                          width: '100%',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          fontFamily: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          gap: '0.35rem',
                          padding: '0 0.5rem',
                          background: 'var(--skarion-orange)', 
                          color: '#ffffff',
                          border: 'none',
                          boxShadow: '0 2px 8px rgba(255, 82, 82, 0.25)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        title="Read interview dialogue transcript"
                      >
                        <BookOpen size={14} color="#ffffff" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                          Transcript ({wordCount}w)
                        </span>
                      </button>
                    ) : (
                      <button 
                        type="button"
                        className="btn-secondary"
                        onClick={() => openTranscriptModal(session, true)}
                        style={{ 
                          height: '36px',
                          width: '100%',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          fontFamily: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          gap: '0.35rem',
                          padding: '0 0.5rem',
                          border: '1px dashed #7c3aed',
                          color: '#7c3aed',
                          background: 'var(--bg-surface-subtle)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title="Add transcript for this session"
                      >
                        <Plus size={14} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                          + Add Transcript
                        </span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log / Edit Mock Interview Modal */}
      {isLogModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLogModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editingMockSession ? <Edit3 size={20} color="var(--skarion-orange)" /> : <Plus size={20} color="var(--skarion-orange)" />}
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--skarion-navy)', margin: 0 }}>
                  {editingMockSession ? 'Edit Mock Interview Record' : 'Log Candidate Mock Interview Performance'}
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setIsLogModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLogMock}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                {/* Candidate Selection */}
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Candidate Name
                  </label>
                  <select 
                    value={targetStudentId} 
                    onChange={(e) => setTargetStudentId(e.target.value)} 
                    className="input-control" 
                    style={{ fontSize: '0.86rem', fontWeight: '700' }}
                  >
                    {(students || []).filter(s => s && s.id && s.name).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Mock Date
                  </label>
                  <input 
                    type="date" 
                    value={mockDate} 
                    onChange={(e) => setMockDate(e.target.value)} 
                    className="input-control" 
                    style={{ fontSize: '0.86rem' }} 
                  />
                </div>

                {/* Evaluator */}
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Interviewer / Evaluator
                  </label>
                  <select 
                    value={mockEvaluator} 
                    onChange={(e) => setMockEvaluator(e.target.value)} 
                    className="input-control" 
                    style={{ fontSize: '0.86rem', fontWeight: '700' }}
                  >
                    {EVALUATORS.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                {/* Round Category */}
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Mock Round Type
                  </label>
                  <select 
                    value={mockCategory} 
                    onChange={(e) => setMockCategory(e.target.value)} 
                    className="input-control" 
                    style={{ fontSize: '0.86rem' }} 
                  >
                    {MOCK_ROUND_TYPES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Score Range Input (0 to 10) */}
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>
                    Mock Rating Score (Out of 10)
                  </label>
                  <span style={{ 
                    fontSize: '1.15rem', 
                    fontWeight: '900', 
                    color: getScoreColor(mockScore),
                    background: getScoreColor(mockScore) + '20',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '8px'
                  }}>
                    {mockScore} / 10
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.5"
                  value={mockScore} 
                  onChange={(e) => setMockScore(Number(e.target.value))} 
                  style={{ width: '100%', cursor: 'pointer', accentColor: getScoreColor(mockScore) }} 
                />
              </div>

              {/* Detailed Feedback */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Detailed Performance Observation & Summary Feedback *
                </label>
                <textarea 
                  value={mockFeedback} 
                  onChange={(e) => setMockFeedback(e.target.value)} 
                  rows={2} 
                  className="input-control" 
                  placeholder="Record interviewer observations, coding speed, communication, and technical depth..." 
                  required 
                />
              </div>

              {/* Strengths & Improvement */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Key Strengths Noted
                  </label>
                  <input 
                    type="text" 
                    value={mockStrengths} 
                    onChange={(e) => setMockStrengths(e.target.value)} 
                    placeholder="e.g. Clean recursion, verbal communication" 
                    className="input-control" 
                    style={{ fontSize: '0.82rem' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Areas for Improvement
                  </label>
                  <input 
                    type="text" 
                    value={mockImprovement} 
                    onChange={(e) => setMockImprovement(e.target.value)} 
                    placeholder="e.g. Edge case testing, dynamic programming" 
                    className="input-control" 
                    style={{ fontSize: '0.82rem' }} 
                  />
                </div>
              </div>

              {/* Candidate Performance Metrics & Audit Report Box */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--skarion-orange)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BarChart2 size={15} /> Candidate Performance Metrics & Audit Breakdown (Optional)
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto-parsed into Visual Metrics & Action Matrix</span>
                </label>
                <textarea 
                  value={mockAuditAnalysis} 
                  onChange={(e) => setMockAuditAnalysis(e.target.value)} 
                  rows={6} 
                  className="input-control" 
                  placeholder="Paste evaluation breakdown text here (PERFORMANCE METRICS, STRENGTHS, CRITICAL WEAKNESSES with Quotes/Corrections, ACTION ITEMS)..." 
                  style={{ fontSize: '0.84rem', fontFamily: 'monospace', lineHeight: '1.5' }} 
                />
              </div>

              {/* Optional Large Text Box for Copy-Pasting Full Transcript */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: '800', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={15} /> Copy-Paste Full Mock Transcript (Teams / Zoom / Meet supported)
                  </span>
                </label>
                <textarea 
                  value={mockTranscript} 
                  onChange={(e) => setMockTranscript(e.target.value)} 
                  rows={4} 
                  className="input-control" 
                  placeholder="Paste verbatim dialogue from Teams, Zoom, Google Meet or raw text here. It will be automatically formatted!" 
                  style={{ fontSize: '0.84rem', fontFamily: 'inherit', lineHeight: '1.5' }} 
                />
              </div>

              {/* Optional PDF Evaluation Document Attachment */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Paperclip size={15} color="var(--skarion-orange)" /> Attach Official PDF Evaluation Sheet / Document (Optional)
                  </span>
                  {mockPdfAttachment && (
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '800' }}>✓ PDF Attached</span>
                  )}
                </label>

                {mockPdfAttachment ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                      <span style={{ background: '#fef2f2', color: '#dc2626', fontWeight: '900', fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px' }}>PDF</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--skarion-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {mockPdfAttachment.name}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>({(mockPdfAttachment.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setMockPdfAttachment(null)}
                      className="btn-icon" 
                      style={{ width: '28px', height: '28px', color: '#dc2626' }}
                      title="Remove PDF"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
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
                      reader.onload = (evt) => {
                        setMockPdfAttachment({
                          name: file.name,
                          size: file.size,
                          type: file.type || 'application/pdf',
                          dataUrl: evt.target.result,
                          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        });
                        if (showToast) showToast(`Attached "${file.name}"!`);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="input-control"
                    style={{ fontSize: '0.8rem', padding: '0.45rem' }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsLogModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0 1.25rem' }}>
                  {editingMockSession ? (
                    <>
                      <Save size={15} /> Save Changes
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Save Mock Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User-Friendly Long Screen Reader & Editor Modal Dialog */}
      {activeTranscriptSession && (
        <div 
          className="modal-backdrop" 
          onClick={() => setActiveTranscriptSession(null)} 
          style={{ 
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(8, 12, 20, 0.75)',
            backdropFilter: 'blur(6px)',
            padding: '1.5rem'
          }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '850px', 
              width: '100%',
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '1.75rem',
              borderRadius: '16px'
            }}
          >
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Mock Interview Transcript Reader
                  </h3>
                  <span style={{ 
                    background: getScoreColor(activeTranscriptSession.score) + '20', 
                    color: getScoreColor(activeTranscriptSession.score),
                    fontWeight: '900', 
                    fontSize: '0.85rem',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {activeTranscriptSession.score} / 10
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {(activeTranscriptStudent || currentStudent)?.name} • {activeTranscriptSession.date} • Category: {activeTranscriptSession.category} • Evaluator: {activeTranscriptSession.evaluator}
                </p>
              </div>

              {/* Reader Action Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                
                {/* Font size adjuster */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface-subtle)', padding: '2px 6px', borderRadius: '8px', border: '1px solid var(--border-color)', gap: '4px' }}>
                  <button 
                    className="btn-icon" 
                    style={{ height: '28px', width: '28px' }} 
                    onClick={() => setTranscriptFontSize(Math.max(12, transcriptFontSize - 1))}
                    title="Decrease Text Size"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--skarion-navy)', minWidth: '32px', textAlign: 'center' }}>
                    {transcriptFontSize}px
                  </span>
                  <button 
                    className="btn-icon" 
                    style={{ height: '28px', width: '28px' }} 
                    onClick={() => setTranscriptFontSize(Math.min(24, transcriptFontSize + 1))}
                    title="Increase Text Size"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>

                {/* Copy full transcript */}
                <button 
                  className="btn-secondary" 
                  onClick={handleCopyTranscript}
                  style={{ height: '36px', padding: '0 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Copy size={15} /> Copy Text
                </button>

                {/* Toggle Edit Mode */}
                <button 
                  className={isEditingTranscript ? "btn-primary" : "btn-secondary"} 
                  onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                  style={{ height: '36px', padding: '0 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Edit3 size={15} /> {isEditingTranscript ? 'View Mode' : 'Edit Transcript'}
                </button>

                <button className="btn-icon" onClick={() => setActiveTranscriptSession(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div style={{ flex: '1', overflow: 'hidden', paddingTop: '1rem', display: 'flex', flexDirection: 'column' }}>
              
              {isEditingTranscript ? (
                /* EDIT MODE: Large spacious text box for copy-pasting raw transcripts */
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#7c3aed' }}>
                      Paste Raw Transcript (Teams / Zoom / Meet supported):
                    </label>

                    {/* Auto-Clean & Organize Button */}
                    <button 
                      type="button"
                      className="btn-primary"
                      onClick={handleAutoCleanTranscript}
                      style={{
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        fontSize: '0.78rem',
                        height: '34px',
                        padding: '0 0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      title="Cleans Teams initials, double timestamps, and groups speaker dialogue cleanly!"
                    >
                      <Sparkles size={14} /> Auto-Clean & Format Raw Transcript
                    </button>
                  </div>

                  <textarea 
                    value={transcriptTextBuffer}
                    onChange={(e) => setTranscriptTextBuffer(e.target.value)}
                    placeholder="Paste full interview transcript copy-paste here from Teams, Zoom, or Google Meet..."
                    style={{ 
                      flex: '1', 
                      width: '100%', 
                      padding: '1.25rem', 
                      borderRadius: '12px', 
                      border: '2px solid #7c3aed', 
                      background: 'var(--bg-surface-subtle)', 
                      color: 'var(--text-main)', 
                      fontSize: `${transcriptFontSize}px`,
                      fontFamily: 'inherit',
                      lineHeight: '1.65',
                      resize: 'none',
                      outline: 'none'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                      {getWordCount(transcriptTextBuffer)} Words | {transcriptTextBuffer.length} Characters
                    </span>

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <button className="btn-secondary" onClick={() => setIsEditingTranscript(false)}>
                        Cancel
                      </button>
                      <button 
                        className="btn-primary" 
                        onClick={handleSaveTranscript}
                        style={{ background: '#7c3aed', padding: '0 1.5rem', height: '40px' }}
                      >
                        <Send size={15} /> Save Transcript
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW MODE: Ultra-friendly Chat Bubble Screen */
                <div style={{ flex: '1', overflowY: 'auto', background: 'var(--bg-surface-subtle)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  
                  {/* Feedback Summary Banner */}
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      MOCK EVALUATION SUMMARY
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '0.2rem 0' }}>
                      "{activeTranscriptSession.feedback}"
                    </p>
                    {activeTranscriptSession.strengths && (
                      <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '700', marginTop: '0.4rem' }}>
                        Strengths: {activeTranscriptSession.strengths}
                      </div>
                    )}
                    {activeTranscriptSession.improvement && (
                      <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: '700', marginTop: '0.2rem' }}>
                        Areas for Improvement: {activeTranscriptSession.improvement}
                      </div>
                    )}
                  </div>

                  {/* Transcript Content Box */}
                  {!transcriptTextBuffer || !transcriptTextBuffer.trim() ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <FileText size={42} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.3rem' }}>
                        No Full Transcript Recorded Yet
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Click "Edit Transcript" above to paste the raw MS Teams or Zoom meeting transcript for this mock session.
                      </p>
                      <button className="btn-primary" onClick={() => setIsEditingTranscript(true)} style={{ background: '#7c3aed' }}>
                        <Plus size={16} /> Paste Transcript Now
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Word Search Panel */}
                      <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                          <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                          <input
                            type="text"
                            placeholder="Search words in transcript..."
                            value={transcriptWordSearch}
                            onChange={(e) => setTranscriptWordSearch(e.target.value)}
                            className="input-control"
                            style={{ paddingLeft: '2.1rem', height: '36px', fontSize: '0.84rem' }}
                          />
                        </div>
                        {transcriptWordSearch.trim() && (() => {
                          const q = transcriptWordSearch.trim().toLowerCase();
                          const matchCount = parsedDialogueParagraphs.filter(p => p.toLowerCase().includes(q)).length;
                          return (
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: matchCount > 0 ? '#059669' : '#dc2626', whiteSpace: 'nowrap' }}>
                              {matchCount > 0 ? `${matchCount} bubble${matchCount !== 1 ? 's' : ''} matched` : 'No matches'}
                            </span>
                          );
                        })()}
                        {transcriptWordSearch && (
                          <button onClick={() => setTranscriptWordSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                            <X size={15} />
                          </button>
                        )}
                      </div>

                      {/* Interactive Speaker Filter Pills Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MessageSquare size={16} color="#7c3aed" />
                          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--skarion-navy)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            Interview Dialogue Feed
                          </span>
                        </div>

                        {/* Speaker filter selector pills */}
                        {availableSpeakers.length > 1 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>Filter:</span>
                            <button
                              onClick={() => setTranscriptSpeakerFilter('all')}
                              style={{
                                background: transcriptSpeakerFilter === 'all' ? '#7c3aed' : 'var(--bg-surface)',
                                color: transcriptSpeakerFilter === 'all' ? '#ffffff' : 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.74rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              All
                            </button>
                            {availableSpeakers.map(spk => (
                              <button
                                key={spk}
                                onClick={() => setTranscriptSpeakerFilter(spk)}
                                style={{
                                  background: transcriptSpeakerFilter === spk ? '#7c3aed' : 'var(--bg-surface)',
                                  color: transcriptSpeakerFilter === spk ? '#ffffff' : 'var(--text-main)',
                                  border: '1px solid var(--border-color)',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.74rem',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                {spk}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Chat Bubbles Container */}
                      <div>
                        {parsedDialogueParagraphs
                          .filter(p => !transcriptWordSearch.trim() || p.toLowerCase().includes(transcriptWordSearch.trim().toLowerCase()))
                          .map((paragraph, idx) => (
                            <React.Fragment key={idx}>
                              {renderChatBubble(paragraph, idx, transcriptWordSearch.trim())}
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

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

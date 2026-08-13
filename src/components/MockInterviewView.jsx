import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { EVALUATORS, EVALUATOR_CONFIG, MOCK_ROUND_TYPES, RATING_CONFIG } from '../data/initialData';
import { getTodayLocalDate } from '../utils/dateUtils';
import { parseAndOrganizeTranscript } from '../utils/transcriptParser';

export default function MockInterviewView({ students, onSaveStudent, onSelectStudent, showToast }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Transcript Reader / Editor Modal State
  const [activeTranscriptSession, setActiveTranscriptSession] = useState(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [transcriptTextBuffer, setTranscriptTextBuffer] = useState('');
  const [transcriptFontSize, setTranscriptFontSize] = useState(15); // Font size in px
  const [transcriptSpeakerFilter, setTranscriptSpeakerFilter] = useState('all'); // Speaker filter in viewer
  const [transcriptWordSearch, setTranscriptWordSearch] = useState(''); // Word search inside transcript viewer

  // Form state for logging a new mock session
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [mockDate, setMockDate] = useState(getTodayLocalDate());
  const [mockEvaluator, setMockEvaluator] = useState(EVALUATORS[0]);
  const [mockCategory, setMockCategory] = useState(MOCK_ROUND_TYPES[0]);
  const [mockScore, setMockScore] = useState(7.5);
  const [mockFeedback, setMockFeedback] = useState('');
  const [mockStrengths, setMockStrengths] = useState('');
  const [mockImprovement, setMockImprovement] = useState('');
  const [mockTranscript, setMockTranscript] = useState('');

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

  // Handle submitting new mock interview record
  const handleLogMock = (e) => {
    e.preventDefault();
    if (!mockFeedback.trim()) return;

    const studentToUpdate = students.find(s => s.id === targetStudentId);
    if (!studentToUpdate) return;

    // Automatically parse raw transcript if pasted in form
    const studentRosterNames = (students || []).map(s => s?.name).filter(Boolean);
    const cleanedTranscript = parseAndOrganizeTranscript(mockTranscript.trim(), studentRosterNames);

    const newSession = {
      id: `mock-${Date.now()}`,
      date: mockDate || getTodayLocalDate(),
      score: Number(mockScore),
      evaluator: mockEvaluator,
      category: mockCategory,
      feedback: mockFeedback.trim(),
      strengths: mockStrengths.trim(),
      improvement: mockImprovement.trim(),
      transcript: cleanedTranscript
    };

    const existingSessions = studentToUpdate.mockSessions || [];
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

    // Reset form & close modal
    setMockFeedback('');
    setMockStrengths('');
    setMockImprovement('');
    setMockTranscript('');
    setIsLogModalOpen(false);
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
  const openTranscriptModal = (session, editMode = false) => {
    setActiveTranscriptSession(session);
    setTranscriptTextBuffer(session.transcript || '');
    setIsEditingTranscript(editMode);
    setTranscriptSpeakerFilter('all');
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
    if (!activeTranscriptSession || !currentStudent) return;

    const studentRosterNames = (students || []).map(s => s?.name).filter(Boolean);
    const cleanedText = parseAndOrganizeTranscript(transcriptTextBuffer.trim(), studentRosterNames);

    const updatedSessions = mockSessions.map(s => {
      if (s.id === activeTranscriptSession.id) {
        return { ...s, transcript: cleanedText };
      }
      return s;
    });

    const updatedStudent = {
      ...currentStudent,
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

  const parsedDialogueParagraphs = parseAndOrganizeTranscript(transcriptTextBuffer).split('\n\n');
  const availableSpeakers = Array.from(new Set(
    parsedDialogueParagraphs
      .map(p => {
        const match = p.match(/^([^:\[\n]+)/);
        return match ? match[1].trim() : null;
      })
      .filter(Boolean)
  ));

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
          onClick={() => { setTargetStudentId(selectedStudentId); setIsLogModalOpen(true); }}
          style={{ height: '42px', padding: '0 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Log Mock Interview
        </button>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
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
                        onClick={() => handleDeleteMock(session.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}
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

                  {/* Prominent Mock Transcript Storage & 1-Click Reader Button */}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                    {hasTranscript ? (
                      <button 
                        className="btn-primary"
                        onClick={() => openTranscriptModal(session, false)}
                        style={{ 
                          width: '100%', 
                          background: 'var(--skarion-orange)', 
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          gap: '0.55rem',
                          height: '42px',
                          borderRadius: '12px',
                          fontSize: '0.88rem',
                          fontWeight: '800',
                          border: 'none',
                          boxShadow: '0 4px 14px rgba(255, 82, 82, 0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <BookOpen size={16} color="#ffffff" />
                        <span>View Full Transcript ({wordCount} words)</span>
                      </button>
                    ) : (
                      <button 
                        className="btn-secondary"
                        onClick={() => openTranscriptModal(session, true)}
                        style={{ 
                          width: '100%', 
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          gap: '0.45rem',
                          height: '36px',
                          fontSize: '0.8rem',
                          border: '1px dashed #7c3aed',
                          color: '#7c3aed'
                        }}
                      >
                        <Plus size={15} /> Add / Paste Mock Transcript
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log New Mock Interview Modal */}
      {isLogModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLogModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', padding: '1.75rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--skarion-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Log Candidate Mock Interview Performance
              </h3>
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
                    {students.map(s => (
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
                  Detailed Performance Observation & Feedback *
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
                  rows={5} 
                  className="input-control" 
                  placeholder="Paste verbatim dialogue from Teams, Zoom, Google Meet or raw text here. It will be automatically formatted!" 
                  style={{ fontSize: '0.84rem', fontFamily: 'inherit', lineHeight: '1.5' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsLogModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0 1.25rem' }}>
                  <Send size={15} /> Save Mock Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User-Friendly Long Screen Reader & Editor Modal Dialog */}
      {activeTranscriptSession && (
        <div className="transcript-modal-backdrop" onClick={() => setActiveTranscriptSession(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '900px', 
              width: '95%',
              height: '88vh', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '1.5rem',
              borderRadius: '20px',
              border: '2px solid #7c3aed',
              boxShadow: '0 20px 50px rgba(124, 58, 237, 0.25)'
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
                  {currentStudent.name} • {activeTranscriptSession.date} • Category: {activeTranscriptSession.category} • Evaluator: {activeTranscriptSession.evaluator}
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

    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, ArrowRight } from 'lucide-react';

// Friendly Cute AI Face Mascot Component
function CuteMascotAvatar({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, filter: 'drop-shadow(0 3px 8px rgba(124, 58, 237, 0.4))' }}>
      <defs>
        <linearGradient id="cuteMascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      
      {/* Antenna */}
      <line x1="20" y1="8" x2="20" y2="3" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="3" r="2.5" fill="#ff5252" />
      
      {/* Ears / Side Bolts */}
      <rect x="1" y="18" width="3" height="8" rx="1.5" fill="#c084fc" />
      <rect x="36" y="18" width="3" height="8" rx="1.5" fill="#c084fc" />

      {/* Head Outer Box */}
      <rect x="4" y="8" width="32" height="28" rx="14" fill="url(#cuteMascotGrad)" />

      {/* Face Screen */}
      <rect x="7" y="11" width="26" height="22" rx="11" fill="#0f172a" opacity="0.9" />
      
      {/* Shiny Sparkle Eyes */}
      <circle cx="14" cy="20" r="3.2" fill="#ffffff" />
      <circle cx="26" cy="20" r="3.2" fill="#ffffff" />
      <circle cx="15.2" cy="18.8" r="1.2" fill="#38bdf8" />
      <circle cx="27.2" cy="18.8" r="1.2" fill="#38bdf8" />

      {/* Rosy Pink Cheeks */}
      <circle cx="11" cy="24" r="2" fill="#fb7185" opacity="0.85" />
      <circle cx="29" cy="24" r="2" fill="#fb7185" opacity="0.85" />

      {/* Sweet Happy Smile */}
      <path d="M16.5 24.5 Q20 28.5 23.5 24.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Clean Formatted Message Renderer (Strips raw markdown symbols like ###, **, and stray *)
function renderFormattedMessage(text) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {lines.map((line, idx) => {
        let clean = line.trim();
        if (!clean) return <div key={idx} style={{ height: '4px' }} />;

        // Headers starting with ### or ####
        if (clean.startsWith('###') || clean.startsWith('####')) {
          const headerText = clean.replace(/^[#\s]+/, '').replace(/\*/g, '').replace(/`/g, '').trim();
          return (
            <div key={idx} style={{ 
              fontWeight: '900', 
              fontSize: '0.92rem', 
              color: 'var(--skarion-navy)', 
              marginTop: idx > 0 ? '0.45rem' : '0',
              marginBottom: '0.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              {headerText}
            </div>
          );
        }

        // Bullet point lines starting with -
        if (clean.startsWith('-')) {
          const bulletContent = clean.substring(1).trim();
          const parts = bulletContent.split(/\*\*/);

          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.84rem' }}>
              <span style={{ color: '#7c3aed', fontWeight: '900', marginTop: '1px' }}>•</span>
              <div>
                {parts.map((part, pIdx) => {
                  const cleanedPart = part.replace(/\*/g, '');
                  if (pIdx % 2 === 1) {
                    return <strong key={pIdx} style={{ fontWeight: '800' }}>{cleanedPart}</strong>;
                  }
                  const tickParts = cleanedPart.split(/`/);
                  return tickParts.map((tPart, tIdx) => {
                    if (tIdx % 2 === 1) {
                      return (
                        <span key={tIdx} style={{ 
                          background: 'rgba(124, 58, 237, 0.12)', 
                          color: '#7c3aed', 
                          fontWeight: '800', 
                          padding: '1px 6px', 
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          margin: '0 2px'
                        }}>
                          {tPart}
                        </span>
                      );
                    }
                    return tPart;
                  });
                })}
              </div>
            </div>
          );
        }

        // Normal paragraph lines - strip any stray *
        const parts = clean.split(/\*\*/);
        return (
          <p key={idx} style={{ margin: 0, fontSize: '0.86rem', lineHeight: '1.55' }}>
            {parts.map((part, pIdx) => {
              const cleanedPart = part.replace(/\*/g, '');
              if (pIdx % 2 === 1) {
                return <strong key={pIdx} style={{ fontWeight: '800' }}>{cleanedPart}</strong>;
              }
              return cleanedPart;
            })}
          </p>
        );
      })}
    </div>
  );
}

// Ultra-Smart Conversational AI Roster Intelligence Engine
function generateAiResponse(query, students, lastStudentId) {
  const q = query.toLowerCase().trim();

  // Helper to find student by name or ID
  const findStudentByNameOrId = (str) => {
    if (!str) return null;
    return students.find(s => {
      if (!s || !s.name) return false;
      const nameLower = s.name.toLowerCase();
      const parts = nameLower.split(/\s+/);
      return nameLower.includes(str) || parts.some(p => p.length >= 3 && str.includes(p));
    });
  };

  // A. Friendly Greetings (Hello, Hi, Hey)
  if (/^(hello|hi|hey|greetings|good morning|good afternoon|good evening)/i.test(q)) {
    return {
      text: `Hey there! 👋 I'm **Skarion AI** (◕‿◕✿), super happy to help you today!\n\n` +
            `I'm currently tracking **${students.length} candidates** in your active audit roster.\n\n` +
            `What candidate or mock evaluation details would you like me to look up for you?`
    };
  }

  // B. Warm Appreciations (Thanks, Thank you, Awesome, Great)
  if (/^(thanks|thank you|thank|awesome|great|cool|perfect|nice)/i.test(q)) {
    return {
      text: `You're so very welcome! 😊 (◕‿◕✿)\n\n` +
            `Always happy to help you manage and review your candidate roster. Feel free to ask anytime!`
    };
  }

  // C. Contextual Follow-up Detection ("his strengths", "her score", "what did evaluator say about him")
  const isPronounFollowup = /\b(his|her|he|she|him|them|this candidate|that student|their)\b/i.test(q) ||
    /^(what are (his|her|their) strengths|what (did|is) (his|her|their) (score|feedback|weakness)|how is (he|she) doing)/i.test(q);

  let activeStudent = findStudentByNameOrId(q);
  if (!activeStudent && isPronounFollowup && lastStudentId) {
    activeStudent = students.find(s => s.id === lastStudentId);
  }

  // D. Handle Specific Candidate Queries & Follow-ups
  if (activeStudent) {
    const mocks = activeStudent.mockSessions || [];
    const latestMock = mocks[mocks.length - 1];
    const notes = activeStudent.stickyNotes || [];

    // Follow-up: Strengths
    if (q.includes('strength') || q.includes('good at') || q.includes('best at')) {
      return {
        text: `Here are the key strengths recorded for **${activeStudent.name}**:\n\n` +
              `💪 **Primary Strengths**: ${latestMock?.strengths || 'Strong technical foundation and adaptable learning mindset'}\n\n` +
              `Progress Standing: \`${activeStudent.progress}%\` | Rating: \`${(activeStudent.rating || 'good').toUpperCase()}\``,
        studentId: activeStudent.id,
        studentName: activeStudent.name
      };
    }

    // Follow-up: Improvements / Growth
    if (q.includes('improvement') || q.includes('weakness') || q.includes('improve') || q.includes('work on') || q.includes('growth')) {
      return {
        text: `Here is what **${activeStudent.name}** is currently focusing to improve:\n\n` +
              `🎯 **Area for Growth**: ${latestMock?.improvement || 'Articulating technical experience with deeper domain context'}\n\n` +
              `Evaluator Note from ${latestMock?.evaluator || 'Audit Team'}: "${latestMock?.feedback || 'Good overall performance, continue practicing mock interview scenarios.'}"`,
        studentId: activeStudent.id,
        studentName: activeStudent.name
      };
    }

    // Follow-up: Evaluator feedback
    if (q.includes('evaluator') || q.includes('interviewer') || q.includes('feedback') || q.includes('faisal') || q.includes('mayukh')) {
      return {
        text: `Here is the detailed evaluator feedback for **${activeStudent.name}**:\n\n` +
              `🎙️ **Evaluated by ${latestMock?.evaluator || 'Mayukh'}** (Score: ⭐ \`${latestMock?.score || 8}/10\`)\n` +
              `- Category: \`${latestMock?.category || 'Technological'}\`\n` +
              `- Feedback: "${latestMock?.feedback || 'Demonstrated solid domain understanding.'}"\n` +
              `- Key Strengths: ${latestMock?.strengths || 'N/A'}\n` +
              `- Focus Focus: ${latestMock?.improvement || 'N/A'}`,
        studentId: activeStudent.id,
        studentName: activeStudent.name
      };
    }

    // Full Candidate Profile Breakdown
    let resp = `Here is the complete audit breakdown for **${activeStudent.name}**! 🚀\n\n`;
    resp += `### 👤 ${activeStudent.name} Profile Overview\n\n`;
    resp += `- **Status**: \`${(activeStudent.rating || 'good').toUpperCase()}\` (${activeStudent.progress || 0}% progress)\n`;
    resp += `- **Mock Interviews**: ${activeStudent.mockInterviews || 0} session(s) completed\n`;

    if (activeStudent.rating === 'placed') {
      resp += `- 🎓 **Placement**: Placed at **${activeStudent.placementCompany || 'Tech Corp'}** as **${activeStudent.placementRole || 'Engineer'}** on ${activeStudent.placementDate || '2026'}.\n`;
    }

    if (latestMock) {
      resp += `\n#### 🎯 Latest Mock Evaluation:\n`;
      resp += `- **Score**: ⭐ \`${latestMock.score} / 10\` (Evaluator: **${latestMock.evaluator}**)\n`;
      resp += `- **Category**: \`${latestMock.category}\`\n`;
      resp += `- **Feedback**: "${latestMock.feedback}"\n`;
      resp += `- **Strengths**: ${latestMock.strengths || 'N/A'}\n`;
      resp += `- **Growth Focus**: ${latestMock.improvement || 'N/A'}\n`;
    }

    if (notes.length > 0) {
      resp += `\n#### ✍️ Recent Audit Observation:\n`;
      resp += `- "${notes[0].content}" *(by ${notes[0].author} on ${notes[0].date})*\n`;
    }

    return { text: resp, studentId: activeStudent.id, studentName: activeStudent.name };
  }

  // E. Candidate Comparison Query ("compare Maahir and Ahmed", "difference between X and Y")
  if (q.includes('compare') || q.includes('versus') || q.includes(' vs ')) {
    const matched = students.filter(s => s.name && q.includes(s.name.toLowerCase().split(' ')[0]));
    if (matched.length >= 2) {
      const s1 = matched[0];
      const s2 = matched[1];
      const m1 = s1.mockSessions?.[s1.mockSessions.length - 1];
      const m2 = s2.mockSessions?.[s2.mockSessions.length - 1];

      let resp = `Here is a side-by-side audit comparison between **${s1.name}** and **${s2.name}**:\n\n`;
      resp += `### ⚔️ Candidate Comparison\n\n`;
      resp += `- **${s1.name}**: Progress \`${s1.progress}%\` | Status: \`${(s1.rating || 'good').toUpperCase()}\` | Mock: \`${m1?.score || 'N/A'}/10\` (${m1?.evaluator || 'Audit'})\n`;
      resp += `- **${s2.name}**: Progress \`${s2.progress}%\` | Status: \`${(s2.rating || 'good').toUpperCase()}\` | Mock: \`${m2?.score || 'N/A'}/10\` (${m2?.evaluator || 'Audit'})\n\n`;
      resp += `💡 Both candidates show strong dedication, with ${s1.name} at ${s1.progress}% progress and ${s2.name} at ${s2.progress}% progress.`;
      return { text: resp };
    }
  }

  // F. Evaluator Specific Queries ("what did Faisal say", "Mayukh's evaluations")
  if (q.includes('faisal') || q.includes('mayukh') || q.includes('kasshaf') || q.includes('ferdous') || q.includes('piyas') || q.includes('saki')) {
    const evaluatorName = ['faisal', 'mayukh', 'kasshaf', 'ferdous', 'piyas', 'saki'].find(e => q.includes(e));
    const evalCap = evaluatorName.charAt(0).toUpperCase() + evaluatorName.slice(1);

    const evaluatedStudents = students.filter(s => 
      (s.mockSessions || []).some(m => m.evaluator && m.evaluator.toLowerCase() === evaluatorName) ||
      (s.stickyNotes || []).some(n => n.author && n.author.toLowerCase() === evaluatorName)
    );

    let resp = `Here are the candidates audited and evaluated by **${evalCap}**:\n\n`;
    resp += `### 📋 Evaluations by ${evalCap} (${evaluatedStudents.length})\n\n`;
    evaluatedStudents.forEach(s => {
      const lastMock = (s.mockSessions || []).find(m => m.evaluator && m.evaluator.toLowerCase() === evaluatorName);
      resp += `- **${s.name}**: ${lastMock ? `Score \`${lastMock.score}/10\` ("${lastMock.feedback}")` : `Added observation note`}\n`;
    });
    return { text: resp };
  }

  // G. Placed Candidates Query
  const isExceptPlaced = q.includes('except placed') || q.includes('active') || q.includes('not placed') || q.includes('non placed') || q.includes('currently active') || q.includes('without placed');
  const isPlacedOnly = (q.includes('placed') || q.includes('hired') || q.includes('job') || q.includes('offer')) && !isExceptPlaced;

  if (isPlacedOnly) {
    const placedList = students.filter(s => s.rating === 'placed');
    if (placedList.length === 0) return { text: "No candidates are currently marked as Placed." };
    let resp = `Woohoo! 🎉 We've got **${placedList.length} amazing candidates** placed at top tech companies! Here is the victory breakdown:\n\n`;
    resp += `### 🎓 Placed Candidates (${placedList.length})\n\n`;
    placedList.forEach(s => {
      resp += `- **${s.name}**: Placed at **${s.placementCompany || 'Tech Corp'}** (${s.placementRole || 'Engineer'}) on ${s.placementDate || '2026'}\n`;
    });
    return { text: resp };
  }

  // H. Best Active Candidates Query
  if (q.includes('excellent') || q.includes('top') || q.includes('ready') || q.includes('best') || q.includes('star') || q.includes('high performer')) {
    let topList;
    if (isExceptPlaced) {
      topList = students.filter(s => s.rating !== 'placed' && (s.rating === 'excellent' || s.rating === 'good'));
      topList.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    } else {
      topList = students.filter(s => s.rating === 'excellent' || s.rating === 'placed');
    }

    let resp = isExceptPlaced
      ? `Here are our top **Active Candidates** currently in training (excluding placed graduates)! ⭐\n\n`
      : `Here are our top star performers doing phenomenal work right now! ⭐\n\n`;

    resp += `### 🌟 Top ${isExceptPlaced ? 'Active ' : ''}Candidates (${topList.length})\n\n`;
    topList.forEach(s => {
      const mockScore = s.mockSessions && s.mockSessions.length > 0 ? s.mockSessions[s.mockSessions.length - 1].score : 'N/A';
      resp += `- **${s.name}** (${s.progress || 0}% progress) - Status: \`${(s.rating || 'good').toUpperCase()}\` | Latest Mock: \`${mockScore}/10\`\n`;
    });
    return { text: resp };
  }

  // Default Response
  const total = students.length;
  const active = students.filter(s => s.rating !== 'placed').length;
  const placedCount = students.filter(s => s.rating === 'placed').length;

  return {
    text: `Hello! I'm **Skarion AI Assistant** (◕‿◕✿). I'm ready to help you explore any candidate in your audit roster!\n\n` +
          `Currently tracking **${total} candidates** (${active} active, ${placedCount} placed).\n\n` +
          `**Try asking me:**\n` +
          `- "Tell me about Maahir Azmain Chowdhury"\n` +
          `- "What are his strengths?"\n` +
          `- "Compare Maahir and Ahmed"\n` +
          `- "Show best active candidates except placed"`
  };
}

export default function AiChatbotModal({ students, onSelectStudent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastStudentId, setLastStudentId] = useState(null);
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm **Skarion AI Assistant** (◕‿◕✿). Ask me about active candidates, mock scores, follow-ups, or placement status!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResp = generateAiResponse(query, students, lastStudentId);
      if (aiResp.studentId) setLastStudentId(aiResp.studentId);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResp.text,
        studentId: aiResp.studentId,
        studentName: aiResp.studentName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handlePromptChipClick = (promptText) => {
    handleSend(promptText);
  };

  return (
    <>
      {/* Floating AI Chatbot Button with Cute Mascot */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '24px', 
          right: '24px', 
          zIndex: 999
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            padding: '0.6rem 1.15rem 0.6rem 0.75rem',
            borderRadius: '99px',
            boxShadow: '0 8px 25px rgba(124, 58, 237, 0.45)',
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '0.88rem',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none'
          }}
          className="btn-primary"
          title="Open Skarion AI Assistant"
        >
          <CuteMascotAvatar size={34} />
          <span>Skarion AI</span>
          <span style={{ 
            width: '9px', 
            height: '9px', 
            borderRadius: '50%', 
            background: '#34d399',
            boxShadow: '0 0 8px #34d399'
          }} />
        </button>
      </div>

      {/* AI Chat Window Modal */}
      {isOpen && (
        <div 
          className="animate-pop-in"
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            width: '430px',
            maxWidth: 'calc(100vw - 32px)',
            height: '570px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-color)',
            borderRadius: '20px',
            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* AI Header with Cute Mascot */}
          <div style={{
            padding: '0.95rem 1.25rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            position: 'relative',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
              <CuteMascotAvatar size={38} />
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '900', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Skarion AI Assistant (◕‿◕✿)
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '600', display: 'block' }}>
                  Active Roster Intelligence
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                flexShrink: 0,
                marginLeft: 'auto'
              }}
              title="Close AI Assistant"
            >
              <X size={18} color="#ffffff" style={{ display: 'block' }} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div style={{ 
            padding: '0.6rem 0.85rem', 
            background: 'var(--bg-surface-subtle)', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <button 
              onClick={() => handlePromptChipClick("Show best active candidates except placed")}
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '99px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              ⭐ Best Active Candidates
            </button>
            <button 
              onClick={() => handlePromptChipClick("Who is placed?")}
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '99px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              🎓 Placed Candidates
            </button>
            <button 
              onClick={() => handlePromptChipClick("Tell me about Maahir Azmain Chowdhury")}
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '99px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              👤 Maahir's Mock
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ 
            flex: '1', 
            padding: '1rem', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {messages.map(msg => (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  gap: '0.65rem',
                  alignItems: 'flex-start'
                }}
              >
                {msg.sender === 'ai' ? (
                  <CuteMascotAvatar size={32} />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--skarion-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(255, 82, 82, 0.35)',
                    padding: 0,
                    margin: 0
                  }}>
                    <User size={16} color="#ffffff" style={{ display: 'block', margin: 'auto' }} />
                  </div>
                )}

                <div style={{
                  maxWidth: '82%',
                  background: msg.sender === 'user' ? 'var(--skarion-navy)' : 'var(--bg-surface-subtle)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  padding: '0.8rem 1rem',
                  fontSize: '0.86rem',
                  lineHeight: '1.55',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.sender === 'ai' ? (
                    renderFormattedMessage(msg.text)
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.text}
                    </div>
                  )}

                  {msg.studentId && (
                    <button
                      onClick={() => {
                        const target = students.find(s => s.id === msg.studentId);
                        if (target && onSelectStudent) {
                          onSelectStudent(target);
                          setIsOpen(false);
                        }
                      }}
                      style={{
                        marginTop: '0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: '#7c3aed',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      Open {msg.studentName || 'Candidate'} Profile <ArrowRight size={13} />
                    </button>
                  )}

                  <div style={{ 
                    fontSize: '0.66rem', 
                    opacity: 0.6, 
                    textAlign: 'right', 
                    marginTop: '0.35rem' 
                  }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <CuteMascotAvatar size={30} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', fontStyle: 'italic' }}>
                  Analyzing roster intelligence...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ 
              padding: '0.75rem 1rem', 
              background: 'var(--bg-surface)', 
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <input 
              type="text"
              placeholder="Ask about candidates (e.g. best active)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                padding: 0,
                flexShrink: 0
              }}
            >
              <Send size={18} color="#ffffff" style={{ display: 'block', margin: '0 auto' }} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

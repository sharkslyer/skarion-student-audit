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

function generateAiResponse(query, students) {
  const q = query.toLowerCase().trim();

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

  // C. Specific Candidate Match
  const matchedStudent = students.find(s => {
    if (!s || !s.name) return false;
    const nameLower = s.name.toLowerCase();
    const parts = nameLower.split(/\s+/);
    return nameLower.includes(q) || parts.some(p => p.length >= 3 && q.includes(p));
  });

  if (matchedStudent) {
    const mocks = matchedStudent.mockSessions || [];
    const latestMock = mocks[mocks.length - 1];
    const notes = matchedStudent.stickyNotes || [];

    let resp = `Oh, great choice! Let me pull up everything we have on **${matchedStudent.name}** for you right away! 🚀\n\n`;
    resp += `### 👤 ${matchedStudent.name} Profile Overview\n\n`;
    resp += `- Current Status: \`${(matchedStudent.rating || 'good').toUpperCase()}\` (${matchedStudent.progress || 0}% progress)\n`;
    resp += `- Mock Interviews Completed: ${matchedStudent.mockInterviews || 0}\n`;

    if (matchedStudent.rating === 'placed') {
      resp += `- 🎓 Placement: Placed at **${matchedStudent.placementCompany || 'Tech Corp'}** as **${matchedStudent.placementRole || 'Engineer'}** on ${matchedStudent.placementDate || '2026'}.\n`;
    }

    if (latestMock) {
      resp += `\n#### 🎯 Latest Mock Evaluation:\n`;
      resp += `- Score: ⭐ \`${latestMock.score} / 10\` (Evaluator: **${latestMock.evaluator}**)\n`;
      resp += `- Category: \`${latestMock.category}\`\n`;
      resp += `- Feedback: "${latestMock.feedback}"\n`;
      resp += `- Strengths: ${latestMock.strengths || 'N/A'}\n`;
      resp += `- Area for Improvement: ${latestMock.improvement || 'N/A'}\n`;
    }

    if (notes.length > 0) {
      resp += `\n#### ✍️ Recent Audit Observation:\n`;
      resp += `- "${notes[0].content}" (by ${notes[0].author} on ${notes[0].date})\n`;
    }

    return { text: resp, studentId: matchedStudent.id, studentName: matchedStudent.name };
  }

  // D. Query about Placed Candidates
  if (q.includes('placed') || q.includes('hired') || q.includes('job') || q.includes('offer')) {
    const placedList = students.filter(s => s.rating === 'placed');
    if (placedList.length === 0) return { text: "No candidates are currently marked as Placed." };
    let resp = `Woohoo! 🎉 We've got **${placedList.length} amazing candidates** placed at top companies! Here is the victory list:\n\n`;
    resp += `### 🎓 Placed Candidates (${placedList.length})\n\n`;
    placedList.forEach(s => {
      resp += `- **${s.name}**: Placed at **${s.placementCompany || 'Tech Corp'}** (${s.placementRole || 'Engineer'}) on ${s.placementDate || '2026'}\n`;
    });
    return { text: resp };
  }

  // E. Query about High Performers
  if (q.includes('excellent') || q.includes('top') || q.includes('ready') || q.includes('best') || q.includes('star')) {
    const topList = students.filter(s => s.rating === 'excellent' || s.rating === 'placed');
    let resp = `Here are our top star performers doing phenomenal work right now! ⭐\n\n`;
    resp += `### 🌟 Top High-Performing Candidates\n\n`;
    topList.forEach(s => {
      resp += `- **${s.name}** (${s.progress}% progress) - Rating: \`${s.rating.toUpperCase()}\`\n`;
    });
    return { text: resp };
  }

  // F. Query about Candidates Needing Attention
  if (q.includes('attention') || q.includes('help') || q.includes('struggle') || q.includes('bad') || q.includes('risk') || q.includes('weak')) {
    const atRisk = students.filter(s => s.rating === 'needs_attention' || s.rating === 'bad');
    if (atRisk.length === 0) return { text: "🎉 Great news! All active candidates are currently performing well." };
    let resp = `Good call checking in on performance! Here are the candidates who could use a little extra coaching right now:\n\n`;
    resp += `### ⚠️ Candidates Requiring Follow-Up (${atRisk.length})\n\n`;
    atRisk.forEach(s => {
      resp += `- **${s.name}** (${s.progress}% progress) - Rating: \`${s.rating.toUpperCase()}\`\n`;
    });
    return { text: resp };
  }

  // G. Query about Mock Interviews / Scores
  if (q.includes('mock') || q.includes('score') || q.includes('interview') || q.includes('evaluator')) {
    let resp = `Sure thing! Here is a quick snapshot of our latest mock interview results:\n\n`;
    resp += `### 🎙️ Mock Interview Roster Summary\n\n`;
    const mocked = students.filter(s => s.mockSessions && s.mockSessions.length > 0);
    mocked.slice(0, 5).forEach(s => {
      const last = s.mockSessions[s.mockSessions.length - 1];
      resp += `- **${s.name}**: Score **${last.score}/10** (Evaluator: ${last.evaluator}, Category: ${last.category})\n`;
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
          `Try asking me:\n` +
          `- "Tell me about Maahir Azmain Chowdhury"\n` +
          `- "Show me Ahmed Chowdhury's feedback"\n` +
          `- "Who is ready for placement?"\n` +
          `- "Which candidates need attention?"`
  };
}

export default function AiChatbotModal({ students, onSelectStudent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm **Skarion AI Assistant** (◕‿◕✿). Ask me about candidate progress, mock scores, evaluators, or placement status!`,
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
      const aiResp = generateAiResponse(query, students);
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
    }, 450);
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
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
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
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CuteMascotAvatar size={38} />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '900', color: '#ffffff' }}>
                  Skarion AI Assistant (◕‿◕✿)
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '600' }}>
                  Active Roster Intelligence
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#ffffff',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              <X size={18} />
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
              onClick={() => handlePromptChipClick("Who is ready for placement?")}
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
              💡 Placed Candidates
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
            <button 
              onClick={() => handlePromptChipClick("Show Ahmed Chowdhury's feedback")}
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
              📊 Ahmed's Audit
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
                    justify: 'center',
                    flexShrink: 0
                  }}>
                    <User size={18} color="#ffffff" />
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
              placeholder="Ask about any candidate (e.g. Maahir)..."
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
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

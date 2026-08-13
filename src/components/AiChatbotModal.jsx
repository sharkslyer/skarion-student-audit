import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, ArrowRight, Settings, Zap, Check, Key } from 'lucide-react';

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

// Built-in Smart Roster Intent Engine
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

  // C. Check for Active-Only / Non-Placed Constraints
  const isExceptPlaced = q.includes('except placed') || q.includes('active') || q.includes('not placed') || q.includes('non placed') || q.includes('currently active') || q.includes('without placed');
  const isPlacedOnly = (q.includes('placed') || q.includes('hired') || q.includes('job') || q.includes('offer')) && !isExceptPlaced;

  // D. Specific Candidate Match
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

  // E. Placed Candidates Query
  if (isPlacedOnly) {
    const placedList = students.filter(s => s.rating === 'placed');
    if (placedList.length === 0) return { text: "No candidates are currently marked as Placed." };
    let resp = `Woohoo! 🎉 We've got **${placedList.length} amazing candidates** placed at top tech companies! Here is the victory list:\n\n`;
    resp += `### 🎓 Placed Candidates (${placedList.length})\n\n`;
    placedList.forEach(s => {
      resp += `- **${s.name}**: Placed at **${s.placementCompany || 'Tech Corp'}** (${s.placementRole || 'Engineer'}) on ${s.placementDate || '2026'}\n`;
    });
    return { text: resp };
  }

  // F. High Performers / Best Candidates Query
  if (q.includes('excellent') || q.includes('top') || q.includes('ready') || q.includes('best') || q.includes('star') || q.includes('high performer')) {
    let topList;
    if (isExceptPlaced) {
      topList = students.filter(s => s.rating !== 'placed' && (s.rating === 'excellent' || s.rating === 'good'));
      topList.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    } else {
      topList = students.filter(s => s.rating === 'excellent' || s.rating === 'placed');
    }

    if (topList.length === 0) {
      topList = students.filter(s => s.rating !== 'placed').slice(0, 5);
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

  // G. Candidates Needing Attention Query
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

  // H. Mock Interview Summary Query
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
          `- "Show best active candidates except placed"\n` +
          `- "Tell me about Maahir Azmain Chowdhury"\n` +
          `- "Who is ready for placement?"\n` +
          `- "Which candidates need attention?"`
  };
}

// Cloud LLM API Gateway (Gemini API Connector)
async function queryCloudGeminiApi(apiKey, query, students) {
  try {
    const rosterSummary = students.map(s => ({
      name: s.name,
      rating: s.rating,
      progress: s.progress,
      mockInterviews: s.mockInterviews,
      placementCompany: s.placementCompany,
      placementRole: s.placementRole,
      latestMock: s.mockSessions && s.mockSessions.length > 0 ? s.mockSessions[s.mockSessions.length - 1] : null,
      notes: (s.stickyNotes || []).map(n => n.content)
    }));

    const systemPrompt = `You are Skarion AI Assistant, a friendly, intelligent, cute AI assistant for Skarion Student Audit website. Answer the user's question clearly, warmly, and accurately using this live candidate roster context:\n\n${JSON.stringify(rosterSummary, null, 2)}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }] }
        ]
      })
    });

    if (!response.ok) throw new Error(`Gemini API returned status ${response.status}`);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return { text };
    throw new Error('Empty Gemini response');
  } catch (err) {
    console.warn('Cloud Gemini API fallback notice:', err);
    return generateAiResponse(query, students);
  }
}

export default function AiChatbotModal({ students, onSelectStudent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Gemini API Key state
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('SKARION_GEMINI_API_KEY') || '';
  });

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm **Skarion AI Assistant** (◕‿◕✿). Ask me about active candidates, mock scores, evaluators, or placement status!`,
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

  const handleSaveApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('SKARION_GEMINI_API_KEY', key);
  };

  const handleSend = async (textToSend) => {
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

    let aiResp;
    if (geminiApiKey.trim()) {
      aiResp = await queryCloudGeminiApi(geminiApiKey.trim(), query, students);
    } else {
      await new Promise(r => setTimeout(r, 450));
      aiResp = generateAiResponse(query, students);
    }

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
            background: geminiApiKey ? '#38bdf8' : '#34d399',
            boxShadow: geminiApiKey ? '0 0 8px #38bdf8' : '0 0 8px #34d399'
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
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CuteMascotAvatar size={38} />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '900', color: '#ffffff' }}>
                  Skarion AI Assistant (◕‿◕✿)
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {geminiApiKey ? <Zap size={11} color="#38bdf8" /> : null}
                  {geminiApiKey ? 'Cloud Gemini AI Mode' : 'Smart Roster Engine'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: showSettings ? 'rgba(255,255,255,0.3)' : 'rgba(255, 255, 255, 0.15)',
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
                title="AI Settings / API Key Connector"
              >
                <Settings size={16} />
              </button>

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
          </div>

          {/* AI Settings Drawer (Gemini / OpenAI API Key Config) */}
          {showSettings && (
            <div style={{
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface-subtle)',
              borderBottom: '1px solid var(--border-color)',
              fontSize: '0.82rem'
            }}>
              <div style={{ fontWeight: '800', color: 'var(--skarion-navy)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Key size={14} color="#7c3aed" /> Optional Cloud Gemini API Key
              </div>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.76rem', lineHeight: '1.4' }}>
                Connect your Google Gemini API key for advanced natural language reasoning. Leave empty to use built-in smart intent engine.
              </p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input 
                  type="password"
                  placeholder="Paste Gemini API Key..."
                  value={geminiApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)'
                  }}
                />
                {geminiApiKey && (
                  <button
                    onClick={() => handleSaveApiKey('')}
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      fontWeight: '800'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

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
                  {geminiApiKey ? 'Consulting Gemini Cloud AI...' : 'Analyzing roster intelligence...'}
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

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, MessageSquare, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';

function generateAiResponse(query, students) {
  const q = query.toLowerCase().trim();

  // 1. Specific Candidate Match
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

    let resp = `### 👤 **${matchedStudent.name}** Profile Overview\n\n`;
    resp += `- **Current Status**: \`${(matchedStudent.rating || 'good').toUpperCase()}\` (${matchedStudent.progress || 0}% progress)\n`;
    resp += `- **Mock Interviews Completed**: ${matchedStudent.mockInterviews || 0}\n`;

    if (matchedStudent.rating === 'placed') {
      resp += `- 🎓 **Placement**: Placed at **${matchedStudent.placementCompany || 'Tech Company'}** as **${matchedStudent.placementRole || 'Developer'}** on ${matchedStudent.placementDate || '2026'}.\n`;
    }

    if (latestMock) {
      resp += `\n#### 🎯 **Latest Mock Evaluation**:
- **Score**: ⭐ \`${latestMock.score} / 10\` (Evaluator: **${latestMock.evaluator}**)
- **Category**: \`${latestMock.category}\`
- **Feedback**: "${latestMock.feedback}"
- **Strengths**: ${latestMock.strengths || 'N/A'}
- **Area for Improvement**: ${latestMock.improvement || 'N/A'}\n`;
    }

    if (notes.length > 0) {
      resp += `\n#### ✍️ **Recent Audit Observation**:
- "${notes[0].content}" *(by ${notes[0].author} on ${notes[0].date})*\n`;
    }

    return { text: resp, studentId: matchedStudent.id, studentName: matchedStudent.name };
  }

  // 2. Query about Placed Candidates
  if (q.includes('placed') || q.includes('hired') || q.includes('job') || q.includes('offer')) {
    const placedList = students.filter(s => s.rating === 'placed');
    if (placedList.length === 0) return { text: "No candidates are currently marked as Placed." };
    let resp = `### 🎓 **Placed Candidates (${placedList.length})**\n\n`;
    placedList.forEach(s => {
      resp += `- **${s.name}**: Placed at **${s.placementCompany || 'Tech Corp'}** (${s.placementRole || 'Engineer'}) on ${s.placementDate || '2026'}\n`;
    });
    return { text: resp };
  }

  // 3. Query about High Performers
  if (q.includes('excellent') || q.includes('top') || q.includes('ready') || q.includes('best') || q.includes('star')) {
    const topList = students.filter(s => s.rating === 'excellent' || s.rating === 'placed');
    let resp = `### 🌟 **Top High-Performing Candidates**\n\n`;
    topList.forEach(s => {
      resp += `- **${s.name}** (${s.progress}% progress) - Rating: \`${s.rating.toUpperCase()}\`\n`;
    });
    return { text: resp };
  }

  // 4. Query about Candidates Needing Attention
  if (q.includes('attention') || q.includes('help') || q.includes('struggle') || q.includes('bad') || q.includes('risk') || q.includes('weak')) {
    const atRisk = students.filter(s => s.rating === 'needs_attention' || s.rating === 'bad');
    if (atRisk.length === 0) return { text: "🎉 Great news! All active candidates are currently performing well." };
    let resp = `### ⚠️ **Candidates Requiring Follow-Up (${atRisk.length})**\n\n`;
    atRisk.forEach(s => {
      resp += `- **${s.name}** (${s.progress}% progress) - Rating: \`${s.rating.toUpperCase()}\`\n`;
    });
    return { text: resp };
  }

  // 5. Query about Mock Interviews / Scores
  if (q.includes('mock') || q.includes('score') || q.includes('interview') || q.includes('evaluator')) {
    let resp = `### 🎙️ **Mock Interview Roster Summary**\n\n`;
    const mocked = students.filter(s => s.mockSessions && s.mockSessions.length > 0);
    mocked.slice(0, 5).forEach(s => {
      const last = s.mockSessions[s.mockSessions.length - 1];
      resp += `- **${s.name}**: Score **${last.score}/10** (Evaluated by ${last.evaluator}, Category: ${last.category})\n`;
    });
    return { text: resp };
  }

  // Default Response
  const total = students.length;
  const active = students.filter(s => s.rating !== 'placed').length;
  const placedCount = students.filter(s => s.rating === 'placed').length;

  return {
    text: `I'm **Skarion AI Assistant**! I can answer questions about any candidate in your audit roster.\n\n` +
          `Currently tracking **${total} candidates** (${active} active, ${placedCount} placed).\n\n` +
          `**Try asking me:**\n` +
          `- *"Tell me about Maahir Azmain Chowdhury"* \n` +
          `- *"Show me Ahmed Chowdhury's feedback"* \n` +
          `- *"Who is ready for placement?"* \n` +
          `- *"Which candidates need attention?"*`
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
      text: `Hello! I'm **Skarion AI Assistant**. Ask me about candidate progress, mock scores, evaluators, or placement status!`,
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
    }, 500);
  };

  const handlePromptChipClick = (promptText) => {
    handleSend(promptText);
  };

  return (
    <>
      {/* Floating AI Chatbot Button */}
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
            gap: '0.6rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            padding: '0.75rem 1.25rem',
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
          <Bot size={22} color="#ffffff" />
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
          {/* AI Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Sparkles size={20} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '900', color: '#ffffff' }}>
                  Skarion AI Assistant
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>
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
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={18} color="#ffffff" />
                  </div>
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
                  <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {msg.text}
                  </div>

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
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  <Bot size={18} color="#ffffff" />
                </div>
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

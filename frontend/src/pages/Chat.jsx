import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, Sparkles, RefreshCw, AlertTriangle, ShieldAlert, Cpu, Server } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { apiUrl } from '../utils/api';

// ── Lightweight Markdown Renderer ─────────────────────────────────
// Converts **bold**, *italic*, numbered lists, bullet lists, and newlines
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines (used as paragraph spacers)
    if (line.trim() === '') {
      elements.push(<div key={key++} style={{ height: '8px' }} />);
      i++;
      continue;
    }

    // Numbered list: lines starting with "1." "2." etc.
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const itemText = lines[i].replace(/^\d+\.\s*/, '').trim();
        listItems.push(<li key={i} style={{ marginBottom: '6px' }}>{inlineMarkdown(itemText)}</li>);
        i++;
      }
      elements.push(
        <ol key={key++} style={{ paddingLeft: '20px', margin: '8px 0' }}>
          {listItems}
        </ol>
      );
      continue;
    }

    // Bullet list: lines starting with - or •
    if (/^[-•*]\s/.test(line.trim())) {
      const listItems = [];
      while (i < lines.length && /^[-•*]\s/.test(lines[i].trim())) {
        const itemText = lines[i].replace(/^[-•*]\s*/, '').trim();
        listItems.push(<li key={i} style={{ marginBottom: '6px' }}>{inlineMarkdown(itemText)}</li>);
        i++;
      }
      elements.push(
        <ul key={key++} style={{ paddingLeft: '20px', margin: '8px 0', listStyle: 'disc' }}>
          {listItems}
        </ul>
      );
      continue;
    }

    // Heading: ## or ###
    if (/^#{2,3}\s/.test(line.trim())) {
      const headingText = line.replace(/^#{2,3}\s*/, '').trim();
      elements.push(
        <p key={key++} style={{ fontWeight: '700', fontSize: '0.95rem', margin: '8px 0 4px', color: 'inherit' }}>
          {inlineMarkdown(headingText)}
        </p>
      );
      i++;
      continue;
    }

    // Regular paragraph line
    elements.push(
      <p key={key++} style={{ margin: '0 0 6px', lineHeight: '1.65' }}>
        {inlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// Handles inline: **bold**, *italic*, and emoji — leaves rest as text
function inlineMarkdown(text) {
  // Split by bold (**text**) or italic (*text*)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// ─────────────────────────────────────────────────────────────────

export default function Chat({ setActiveTab }) {
  const welcomeMessage = {
    id: 1,
    sender: 'bot',
    source: 'local',
    text: `Hello! I'm **MindCare AI**, your gentle emotional support companion. 💙

How are you feeling today? You can share what's on your mind or select one of the suggested topics below.

*Remember: I am an AI support assistant and not a medical therapist. If you are in crisis, please use our Helplines page for immediate emergency assistance.*`
  };

  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "I'm feeling very stressed about my exams.",
    "Can you give me simple tips to sleep better?",
    "I need a 2-minute quick relaxation technique.",
    "How can I manage feeling anxious right now?",
    "I'm feeling really low and lonely today.",
    "Where can I find professional helpline support?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Build conversation history array (exclude first welcome message from history)
  const buildHistory = (currentMessages) => {
    return currentMessages
      .slice(1) // skip the initial welcome message
      .filter(m => m.sender !== 'crisis') // don't send crisis messages as context
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'bot',
        text: m.text
      }));
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);
    setErrorMessage('');

    try {
      const historyToSend = buildHistory(updatedMessages);

      const response = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: historyToSend
        })
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const botMsg = {
          id: Date.now() + 1,
          sender: data.isCrisis ? 'crisis' : 'bot',
          source: data.source || 'local',
          text: data.reply
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          source: 'local',
          text: `I hear that you're going through something difficult right now. 💙

Take a slow, deep breath: **inhale for 4 seconds**, hold for 4, and **exhale for 6 seconds**.

You can also explore our **Mood Tracker** and **Personal Coping Toolkit** anytime. I'm right here with you.`
        }]);
      }
    } catch (err) {
      console.error('Chat submit error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        source: 'local',
        text: `Thank you for sharing your thoughts with me. 💙

When things feel heavy, try taking a 2-minute break:

1. **Breathe**: Inhale for 4 counts, hold 4, exhale 6
2. **Ground yourself**: Name 5 things you can see right now
3. **Be kind to yourself**: You're doing your best

You can also explore our **Personal Coping Toolkit** in the menu for guided exercises.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear current chat conversation?')) {
      setMessages([{
        ...welcomeMessage,
        id: Date.now(),
        text: 'Chat cleared! 💙 How else can I support you today?'
      }]);
      setErrorMessage('');
    }
  };

  // Source badge for bot messages
  const SourceBadge = ({ source }) => {
    if (!source || source === 'local') {
      return (
        <span style={{
          fontSize: '0.68rem',
          color: '#94a3b8',
          marginTop: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          opacity: 0.85
        }}>
          <Server size={10} /> Local
        </span>
      );
    }
    return (
      <span style={{
        fontSize: '0.68rem',
        color: '#0d9488',
        marginTop: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontWeight: 600,
        opacity: 0.9
      }}>
        <Cpu size={10} /> AI Response
      </span>
    );
  };

  return (
    <div className="chat-page">
      <DisclaimerBanner onOpenResources={() => setActiveTab('resources')} />

      {errorMessage && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#b45309',
            padding: '10px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertTriangle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="brand-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
              <Bot size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>MindCare AI Assistant</strong>
              <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>
                ● Active • Supportive Companion
              </div>
            </div>
          </div>
          <button
            className="btn-secondary"
            onClick={handleClearChat}
            title="Clear Chat History"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <Trash2 size={15} />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="chat-messages">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isCrisis = msg.sender === 'crisis';

            return (
              <div
                key={msg.id}
                className={`message-bubble-wrapper ${isUser ? 'user' : isCrisis ? 'crisis' : 'bot'}`}
              >
                <div className={`chat-avatar ${isUser ? 'user' : isCrisis ? 'crisis' : 'bot'}`}>
                  {isUser ? <User size={16} /> : isCrisis ? <ShieldAlert size={16} /> : <Bot size={16} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
                  <div className={`message-bubble ${isUser ? 'user' : isCrisis ? 'crisis' : 'bot'}`}>
                    {isUser
                      ? msg.text
                      : renderMarkdown(msg.text)
                    }
                  </div>
                  {!isUser && !isCrisis && (
                    <div style={{ paddingLeft: '4px' }}>
                      <SourceBadge source={msg.source} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="message-bubble-wrapper bot">
              <div className="chat-avatar bot">
                <Bot size={16} />
              </div>
              <div className="message-bubble bot" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw className="animate-spin" size={16} color="#0d9488" />
                <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  MindCare AI is reflecting on your message...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="chat-prompts">
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={14} /> Suggestions:
          </span>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="prompt-chip"
              onClick={() => handleSend(prompt)}
              disabled={loading}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <form
          className="chat-input-area"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message here... (e.g., 'I am feeling overwhelmed today')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !input.trim()}
            style={{ opacity: (loading || !input.trim()) ? 0.6 : 1 }}
          >
            <Send size={18} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

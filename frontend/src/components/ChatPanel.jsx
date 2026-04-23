import React, { useState, useRef, useEffect } from 'react';
import { useReport } from '../context/ReportContext';
import { sendChatMessage } from '../services/api';

const CHIPS = [
  'Which risks should I prioritise?',
  'What if a port strike occurs?',
  'How can I reduce geopolitical risk?',
  'What alternative routes exist?',
];

export default function ChatPanel({ reportId }) {
  const { chatHistory, setChatHistory } = useReport();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    const userMsg = { role: 'user', content: msg };
    const updated = [...chatHistory, userMsg];
    setChatHistory(updated);
    setInput('');
    setSending(true);
    try {
      const { reply } = await sendChatMessage(reportId, msg, chatHistory);
      setChatHistory([...updated, { role: 'model', content: reply }]);
    } catch {
      setChatHistory([...updated, { role: 'model', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ borderLeft: '1px solid #1E3A5F' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #1E3A5F' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(59,130,246,0.2)' }}>🛰️</div>
        <div>
          <p className="text-sm font-semibold text-white">RouteRadar AI</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink" />
            <p className="text-xs" style={{ color: '#22C55E' }}>Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chatHistory.length === 0 && (
          <div>
            <p className="text-xs mb-3" style={{ color: '#475569' }}>Try asking:</p>
            <div className="space-y-2">
              {CHIPS.map((c, i) => (
                <button key={i} onClick={() => send(c)}
                  className="w-full text-left text-xs px-3 py-2 rounded-xl transition-all"
                  style={{ background: '#071525', border: '1px solid #1E3A5F', color: '#94A3B8' }}
                  onMouseEnter={e => e.target.style.borderColor = '#3B82F6'}
                  onMouseLeave={e => e.target.style.borderColor = '#1E3A5F'}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'model' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 shrink-0 mt-0.5"
                style={{ background: 'rgba(59,130,246,0.2)' }}>🛰️</div>
            )}
            <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed"
              style={m.role === 'user'
                ? { background: '#3B82F6', color: 'white', borderBottomRightRadius: 4 }
                : { background: '#0D1B2E', color: '#CBD5E1', border: '1px solid #1E3A5F', borderBottomLeftRadius: 4 }}>
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0" style={{ background: 'rgba(59,130,246,0.2)' }}>🛰️</div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: '#0D1B2E', border: '1px solid #1E3A5F' }}>
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#3B82F6', animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #1E3A5F' }}>
        <div className="flex gap-2">
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sending && input.trim()) send();
              }
            }}
            placeholder="Ask a what-if scenario..." disabled={sending}
            className="flex-1 text-xs px-4 py-2.5 rounded-xl outline-none"
            style={{ background: '#071525', border: '1px solid #1E3A5F', color: '#CBD5E1' }}
          />
          <button onClick={() => send()} disabled={sending || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40"
            style={{ background: '#3B82F6', color: 'white' }}>
            ➤
          </button>
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: '#334155' }}>AI responses are generated from real-time data</p>
      </div>
    </div>
  );
}

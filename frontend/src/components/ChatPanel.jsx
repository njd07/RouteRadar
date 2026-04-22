import React, { useState, useRef, useEffect } from 'react';
import { useReport } from '../context/ReportContext';
import { sendChatMessage } from '../services/api';

const PROMPT_CHIPS = [
  'What if a port strike occurs?',
  'How can I reduce geopolitical risk?',
  'What alternative routes exist?',
  'What if there is a natural disaster?',
  'How risky is single-supplier dependency?',
];

export default function ChatPanel({ reportId }) {
  const { chatHistory, setChatHistory } = useReport();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (text) => {
    const message = (text || input).trim();
    if (!message || isSending) return;

    const userMsg = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInput('');
    setIsSending(true);

    try {
      const { reply } = await sendChatMessage(reportId, message, chatHistory);
      setChatHistory([...updatedHistory, { role: 'model', content: reply }]);
    } catch (err) {
      console.error(err);
      setChatHistory([
        ...updatedHistory,
        { role: 'model', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ height: 480 }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          💬 Ask RouteRadar AI
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Explore what-if scenarios for your supply chain</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatHistory.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400 mb-4">Try one of these questions:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  id={`chip-${idx}`}
                  onClick={() => handleSend(chip)}
                  className="text-xs bg-accent-blue/5 text-accent-blue border border-accent-blue/20 rounded-full px-3 py-1.5 hover:bg-accent-blue/10 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent-blue text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a what-if question…"
            disabled={isSending}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition disabled:opacity-50"
          />
          <button
            id="chat-send"
            onClick={() => handleSend()}
            disabled={isSending || !input.trim()}
            className="bg-accent-blue hover:bg-accent-blue-hover text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

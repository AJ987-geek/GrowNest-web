import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, RefreshCw } from 'lucide-react';
import ChatBubble, { TypingBubble } from '../components/ChatBubble.jsx';
import { chatSuggestions, aiResponses } from '../data/sampleData.js';

const getResponse = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes('vegetable') || lower.includes('eating')) return aiResponses.vegetables;
  if (lower.includes('weight') || lower.includes('bmi') || lower.includes('normal')) return aiResponses.weight;
  if (lower.includes('iron') || lower.includes('food')) return aiResponses.iron;
  if (lower.includes('vaccine') || lower.includes('vaccination')) return aiResponses.vaccine;
  return aiResponses.default;
};

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m GrowNest AI, your personal child health assistant. 🌟\n\nI can help you with nutrition advice, vaccination schedules, growth tracking, and all your parenting questions. What would you like to know today?',
      time: formatTime(),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');

    const userMessage = { id: Date.now(), role: 'user', content: userMsg, time: formatTime() };
    setMessages(prev => [...prev, userMessage]);
    setTyping(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = getResponse(userMsg);
    const aiMessage = { id: Date.now() + 1, role: 'assistant', content: response, time: formatTime() };
    setMessages(prev => [...prev, aiMessage]);
    setTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: 'Chat cleared! How can I help you today? 😊',
      time: formatTime(),
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-primary-600 flex items-center justify-center shadow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white">AI Health Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Online • Medical-grade AI</span>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="btn-ghost text-sm gap-1.5">
          <RefreshCw className="w-4 h-4" /> Clear
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 card p-5 overflow-y-auto space-y-4 mb-4">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {typing && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Suggested questions
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {chatSuggestions.slice(0, 4).map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-xs px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="card p-3 flex items-end gap-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your child's health..."
          rows={1}
          className="flex-1 text-sm bg-transparent border-0 outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 min-h-[2rem] max-h-32"
          style={{ lineHeight: '1.5rem' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || typing}
          className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">AI responses are informational only. Always consult your pediatrician for medical decisions.</p>
    </div>
  );
}

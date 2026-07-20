export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1 ${
        isUser ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gradient-to-br from-teal-400 to-teal-600'
      }`}>
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-sm'
              : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
          }`}
        >
          {message.content}
        </div>
        <span className="text-xs text-gray-400 px-1">{message.time}</span>
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex items-end gap-2.5 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        AI
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

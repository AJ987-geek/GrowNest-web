import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-sm whitespace-pre-wrap'
              : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-black text-gray-900 dark:text-white mt-4 mb-3" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-3 mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 mt-2 mb-1" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1.5 mb-3" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1.5 mb-3" {...props} />,
                li: ({node, ...props}) => <li className="text-sm" {...props} />,
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-teal-700 dark:text-teal-400" {...props} />
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
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

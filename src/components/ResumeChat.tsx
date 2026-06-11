import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getResumeContext } from '../data/resume';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ResumeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm an AI assistant that can answer questions about Hari's resume. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { ref, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 65000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          context: getResumeContext(),
          history: messages,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: { answer?: string; error?: string; retry?: boolean } = {};
      try {
        data = await response.json();
      } catch {
        // Non-JSON response; fall through to the generic error below
      }

      if (!response.ok || data.error) {
        if (data.retry) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'The assistant is warming up. Please try again in a moment.' },
          ]);
          return;
        }
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'I could not generate an answer to that question. Please try rephrasing it.',
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      const content =
        error instanceof Error && error.name === 'AbortError'
          ? 'The request timed out. Please try again in a moment.'
          : 'Sorry, something went wrong. Please try again later.';
      setMessages((prev) => [...prev, { role: 'assistant', content }]);
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTED_QUESTIONS = [
    "What's Hari's most recent internship?",
    "What programming languages does he know?",
    "Tell me about his projects",
    "What's his GPA and major?",
  ];

  const handleChipClick = (question: string) => {
    if (isLoading) return;
    setInput(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section
      id="AI"
      ref={ref}
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-center text-stone-900 dark:text-cream-100 tracking-tight">
            Ask About <span className="italic font-medium">My Resume</span>
          </h2>
          <div className="serif-divider my-6"></div>
          <p className="text-stone-500 dark:text-cream-200 text-center text-sm sm:text-base max-w-2xl mx-auto px-2">
            Have questions about my experience, skills, or projects? Chat with my AI assistant to learn more.
          </p>
        </div>

        {/* Chat Interface */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-600/50 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
            {/* Messages */}
            <div ref={messagesContainerRef} className="h-[420px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 sm:gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-900 dark:bg-cream-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-darkBg" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 ${
                      message.role === 'user'
                        ? 'bg-stone-900 dark:bg-cream-100 text-white dark:text-darkBg'
                        : 'bg-cream-200/60 dark:bg-stone-700/60 text-stone-800 dark:text-cream-100 border border-stone-200/40 dark:border-stone-600/50'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="text-sm sm:text-base leading-relaxed mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc list-outside ml-4 my-1 space-y-0.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-outside ml-4 my-1 space-y-0.5">{children}</ol>,
                          li: ({ children }) => <li className="text-sm sm:text-base leading-relaxed">{children}</li>,
                          code: ({ children }) => <code className="bg-stone-200/60 dark:bg-stone-600/60 rounded px-1 py-0.5 text-xs font-mono">{children}</code>,
                          table: ({ children }) => <div className="overflow-x-auto my-2"><table className="text-sm border-collapse w-full">{children}</table></div>,
                          thead: ({ children }) => <thead className="border-b border-stone-300 dark:border-stone-500">{children}</thead>,
                          th: ({ children }) => <th className="text-left font-semibold px-3 py-1.5 whitespace-nowrap">{children}</th>,
                          td: ({ children }) => <td className="px-3 py-1.5 border-t border-stone-200/60 dark:border-stone-600/40">{children}</td>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-200 dark:bg-stone-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600 dark:text-cream-100" />
                    </div>
                  )}
                </div>
              ))}
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 px-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleChipClick(q)}
                      className="text-sm px-4 py-2 rounded-full border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-cream-200 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-cream-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="flex gap-2.5 sm:gap-3 justify-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-900 dark:bg-cream-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-darkBg" />
                  </div>
                  <div className="bg-cream-200/60 dark:bg-stone-700/60 border border-stone-200/40 dark:border-stone-600/50 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-stone-500 dark:text-cream-300 animate-spin" />
                    <span className="text-sm text-stone-500 dark:text-cream-200">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 sm:p-6 border-t border-stone-200/60 dark:border-stone-600/50 bg-cream-50/80 dark:bg-stone-800/80 backdrop-blur-sm">
              <div className="flex gap-2.5 sm:gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about my resume..."
                  className="flex-1 min-w-0 bg-white dark:bg-stone-700/50 text-stone-900 dark:text-cream-100 px-4 sm:px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 border border-stone-200/60 dark:border-stone-600/50 transition-all placeholder:text-stone-400 dark:placeholder:text-cream-400/60"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-stone-900 dark:bg-cream-100 hover:bg-stone-800 dark:hover:bg-cream-200 text-white dark:text-darkBg px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

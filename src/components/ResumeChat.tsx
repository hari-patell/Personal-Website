import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { getResumeContext } from '../data/resume';
import SectionHeader from './SectionHeader';

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
  const [isStreamingReply, setIsStreamingReply] = useState(false);
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

      // Headers have arrived; from here the stream manages its own pace
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') ?? '';

      // Errors (and empty answers) come back as JSON; real answers stream as plain text
      if (!response.ok || contentType.includes('application/json')) {
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
        return;
      }

      if (!response.body) {
        throw new Error('Streaming is not supported by this browser');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      let started = false;

      const showAnswer = (content: string, replaceLast: boolean) => {
        setMessages((prev) => {
          const next = replaceLast ? prev.slice(0, -1) : [...prev];
          next.push({ role: 'assistant', content });
          return next;
        });
      };

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        showAnswer(answer, started);
        if (!started) {
          started = true;
          setIsStreamingReply(true);
        }
      }
      answer += decoder.decode();

      if (!answer.trim()) {
        showAnswer('I could not generate an answer to that question. Please try rephrasing it.', started);
      } else if (started) {
        showAnswer(answer, true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const content =
        error instanceof Error && error.name === 'AbortError'
          ? 'The request timed out. Please try again in a moment.'
          : 'Sorry, something went wrong. Please try again later.';
      setMessages((prev) => [...prev, { role: 'assistant', content }]);
    } finally {
      setIsLoading(false);
      setIsStreamingReply(false);
    }
  };

  const SUGGESTED_QUESTIONS = [
    "What's Hari's most recent internship?",
    "What programming languages does he know?",
    "Tell me about his projects",
    "What is he building at AWS?",
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
      className="relative py-28 sm:py-36 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionHeader
            numeral="Ε"
            title="Ask"
            subtitle="Questions about my experience, skills, or projects? Ask the assistant."
          />
        </div>

        {/* Chat Interface */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="border-y border-stone-300/70 dark:border-stone-700">
            {/* Messages */}
            <div ref={messagesContainerRef} className="h-[420px] sm:h-[480px] overflow-y-auto py-6 space-y-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] ${
                      message.role === 'user'
                        ? 'px-4 py-2.5 bg-cream-200 dark:bg-stone-800 text-stone-900 dark:text-cream-100'
                        : 'py-1 font-light text-stone-700 dark:text-cream-200'
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
                </div>
              ))}
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleChipClick(q)}
                      className="text-sm px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-cream-300 hover:border-aegean hover:text-aegean dark:hover:border-aegean-light dark:hover:text-aegean-light transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {isLoading && !isStreamingReply && (
                <div className="flex gap-2.5 sm:gap-3 justify-start">
                  <div className="py-1 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-stone-500 dark:text-cream-300 animate-spin" />
                    <span className="text-sm text-stone-500 dark:text-cream-200">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="py-4 border-t border-stone-300/70 dark:border-stone-700">
              <div className="flex gap-2.5 sm:gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about my resume..."
                  className="flex-1 min-w-0 bg-transparent text-stone-900 dark:text-cream-100 px-1 py-3 focus:outline-none font-serif text-lg placeholder:italic placeholder:text-stone-400 dark:placeholder:text-cream-400/70"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center w-11 h-11 bg-aegean dark:bg-aegean-light text-white dark:text-darkBg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

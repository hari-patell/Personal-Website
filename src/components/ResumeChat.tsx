import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
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
  const [isInitialMount, setIsInitialMount] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { ref, hasIntersected } = useIntersectionObserver();

  const scrollToBottom = () => {
    // Scroll within the messages container only, not the entire page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Skip scrolling on initial mount to prevent page from scrolling to bottom on load
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    scrollToBottom();
  }, [messages, isInitialMount]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const resumeContext = getResumeContext();
      
      // Use relative path - works in both production and development with vercel dev
      // When running 'npm run dev' (Vite only), you need to use 'vercel dev' instead
      const apiUrl = '/api/chat';

      // Add timeout to frontend request (65 seconds to account for server timeout + model loading)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 65000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          context: resumeContext,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any = {};
        try {
          const text = await response.text();
          errorData = text ? JSON.parse(text) : {};
        } catch (e) {
          // If response isn't JSON, use status text
          errorData = { error: response.statusText || `HTTP ${response.status}` };
        }
        
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url: apiUrl,
        });
        
        if (response.status === 504 || response.status === 503) {
          throw new Error(errorData.error || 'Request timed out. Please try again.');
        }
        
        // More specific error messages
        if (response.status === 404) {
          throw new Error('API endpoint not found. Make sure you are running "vercel dev" or "npm run dev:vercel" instead of "npm run dev".');
        }
        
        if (response.status === 500) {
          throw new Error(errorData.error || errorData.message || 'Server error. Check console for details.');
        }
        
        throw new Error(errorData.error || errorData.message || `Failed to get response (${response.status})`);
      }

      const data = await response.json();
      
      if (data.error) {
        if (data.retry) {
          // Model is loading, suggest retry
          const errorMessage: Message = {
            role: 'assistant',
            content: 'The AI model is loading. Please wait a moment and try again.',
          };
          setMessages((prev) => [...prev, errorMessage]);
        } else {
          throw new Error(data.error);
        }
      } else {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.answer || 'I apologize, but I could not generate an answer to that question.',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'The request timed out after 60 seconds. The AI model may still be loading. Please wait 10-20 seconds and try again - subsequent requests will be much faster.';
        } else if (error.message.includes('loading')) {
          errorMessage = error.message;
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Network error. Make sure you are running "vercel dev" or "npm run dev:vercel" to start the development server with API support.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      const errorMsg: Message = {
        role: 'assistant',
        content: errorMessage,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-8 h-8 text-orange-500" />
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Ask About My Resume
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions about my experience, skills, or projects? Chat with my AI assistant to learn more!
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
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Messages */}
            <div ref={messagesContainerRef} className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : 'bg-zinc-800/80 text-gray-100 border border-zinc-700/50'
                    }`}
                  >
                    <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl px-5 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about the resume..."
                  className="flex-1 bg-zinc-800/80 text-white px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 border border-zinc-700/50 transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
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


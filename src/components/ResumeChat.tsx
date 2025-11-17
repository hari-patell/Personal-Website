import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref, hasIntersected } = useIntersectionObserver();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const resumeContext = getResumeContext();
      
      // Determine API endpoint based on environment
      const apiUrl = import.meta.env.PROD 
        ? '/api/chat'  // Production: Vercel serverless function
        : 'http://localhost:3000/api/chat';  // Development: local Vercel dev server

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
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 504 || response.status === 503) {
          throw new Error(errorData.error || 'Request timed out. Please try again.');
        }
        throw new Error(errorData.error || 'Failed to get response');
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
        } else {
          errorMessage = error.message || errorMessage;
        }
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
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
        aria-label="Open resume chat"
      >
        <Bot className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Ask about my resume</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Resume Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-800 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about the resume..."
                className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


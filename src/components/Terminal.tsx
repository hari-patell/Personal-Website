import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';
import { skills } from '../data/skills';
import { getResumeContext } from '../data/resume';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryEntry {
  id: number;
  kind: 'command' | 'output';
  content: React.ReactNode;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ACCENT = '#D97757';
const BG = '#0a0a0a';

const SECTIONS = ['home', 'about', 'skills', 'experience', 'projects', 'AI'];

const COMMANDS = [
  'help',
  'about',
  'projects',
  'experience',
  'skills',
  'contact',
  'goto',
  'theme',
  'model',
  'cost',
  'clear',
  'exit',
];

const HIDDEN_COMMANDS = ['whoami', 'date', 'echo', 'sudo', 'socials', 'quit'];

// Commands that only make sense with an argument; bare words with extra
// text that aren't one of these get routed to the AI instead
const COMMANDS_WITH_ARGS = ['goto', 'echo'];

const THINKING_VERBS = [
  'Pondering',
  'Brewing',
  'Percolating',
  'Noodling',
  'Reticulating',
  'Cogitating',
  'Vibing',
  'Crunching',
];

const SOCIALS = [
  { label: 'email', value: 'hari1880patel@gmail.com', href: 'mailto:hari1880patel@gmail.com' },
  { label: 'github', value: 'github.com/hari-patell', href: 'https://github.com/hari-patell' },
  { label: 'linkedin', value: 'linkedin.com/in/hari-krishna-patel', href: 'https://www.linkedin.com/in/hari-krishna-patel' },
  { label: 'x', value: 'x.com/hari_patell', href: 'https://x.com/hari_patell' },
  { label: 'instagram', value: 'instagram.com/hari_patell', href: 'https://instagram.com/hari_patell' },
];

const SKILL_CATEGORIES: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend & Languages',
  database: 'Databases',
  cloud: 'Cloud',
  tools: 'Tools',
};

/* Pixel mascot in the style of the Claude Code splash creature */
function Mascot() {
  return (
    <svg viewBox="0 0 14 10" className="w-12 sm:w-14 h-auto" aria-hidden="true">
      <g fill={ACCENT}>
        <rect x="2" y="0" width="2" height="2" />
        <rect x="10" y="0" width="2" height="2" />
        <rect x="1" y="2" width="12" height="6" />
        <rect x="3" y="8" width="2" height="2" />
        <rect x="9" y="8" width="2" height="2" />
      </g>
      <rect x="4" y="3.5" width="1.4" height="2.4" fill={BG} />
      <rect x="8.6" y="3.5" width="1.4" height="2.4" fill={BG} />
    </svg>
  );
}

/* Assistant text bullet: white ● followed by the response */
function Response({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-stone-200 select-none flex-shrink-0">●</span>
      <div className="min-w-0 flex-1 text-stone-300">{children}</div>
    </div>
  );
}

/* Collapsed tool activity line: green ● Searched for N patterns, read M files */
function ToolSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 pb-1.5">
      <span className="text-green-500 select-none flex-shrink-0">●</span>
      <div className="min-w-0 flex-1 text-stone-300">
        {children} <span className="text-stone-600">(ctrl+o to expand)</span>
      </div>
    </div>
  );
}

function HelpOutput() {
  const rows: Array<[string, string]> = [
    ['/about', 'who is hari?'],
    ['/projects', "things he's built"],
    ['/experience', "where he's worked"],
    ['/skills', 'tech he knows'],
    ['/contact', 'how to reach him'],
    ['/goto <section>', `jump to a section (${SECTIONS.join(', ').toLowerCase()})`],
    ['/theme', 'toggle light/dark mode'],
    ['/model', 'current model info'],
    ['/cost', 'show session cost'],
    ['/clear', 'clear the screen'],
    ['/exit', 'close the terminal (or press esc)'],
  ];
  return (
    <Response>
      <div className="text-stone-200 pb-1">Available commands:</div>
      {rows.map(([cmd, desc]) => (
        <div key={cmd} className="flex">
          <span className="w-40 flex-shrink-0" style={{ color: ACCENT }}>{cmd}</span>
          <span className="text-stone-400">{desc}</span>
        </div>
      ))}
      <div className="pt-1 text-stone-500">
        Anything else you type goes straight to Hari's resume AI — just ask a question.
      </div>
    </Response>
  );
}

function AboutOutput() {
  return (
    <div>
      <ToolSummary>
        Read <strong className="text-stone-100">1</strong> file
      </ToolSummary>
      <Response>
        <div className="space-y-2">
          <p>
            Hari-Krishna Patel is a Computer Science student at the University of Florida who likes
            making software fast.
          </p>
          <p>
            Currently a Capital One full stack SWE intern (Summer '26), previously at Honeywell
            (Summer '25), and incoming Amazon SDE intern on the Within Stores team (Fall '26). He builds across
            full-stack, ML, mobile, and market microstructure — favorite wins include taking a parser
            from 4.5s to 150ms and an order book engine pushing ~50,000 orders/sec.
          </p>
          <p className="text-stone-500">
            Off the keyboard: photography on a Fujifilm XT-30 II and volunteering with BAPS charities.
          </p>
        </div>
      </Response>
    </div>
  );
}

function ProjectsOutput() {
  return (
    <div>
      <ToolSummary>
        Searched for <strong className="text-stone-100">1</strong> pattern, read{' '}
        <strong className="text-stone-100">{projects.length}</strong> files
      </ToolSummary>
      <Response>
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id}>
              <div className="text-stone-100 font-semibold">{project.title}</div>
              <div className="text-stone-400">{project.description}</div>
              <div className="text-xs mt-0.5" style={{ color: ACCENT }}>
                [{project.technologies.join(', ')}]
              </div>
            </div>
          ))}
        </div>
      </Response>
    </div>
  );
}

function ExperienceOutput() {
  return (
    <div>
      <ToolSummary>
        Searched for <strong className="text-stone-100">2</strong> patterns, read{' '}
        <strong className="text-stone-100">{experiences.length}</strong> files
      </ToolSummary>
      <Response>
        <div className="space-y-2">
          {experiences.map((exp) => (
            <div key={exp.id}>
              <div>
                <span className="text-stone-100 font-semibold">{exp.company}</span>
                <span className="text-stone-500"> · {exp.location}</span>
              </div>
              <div className="text-stone-400">
                {exp.position} ({exp.startDate}
                {exp.endDate ? ` – ${exp.endDate}` : ''})
              </div>
              {exp.achievements.slice(0, 2).map((achievement) => (
                <div key={achievement} className="text-stone-500 text-xs pl-3">- {achievement}</div>
              ))}
            </div>
          ))}
        </div>
      </Response>
    </div>
  );
}

function SkillsOutput() {
  const grouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill.name);
    return acc;
  }, {});
  return (
    <div>
      <ToolSummary>
        Read <strong className="text-stone-100">1</strong> file, parsed{' '}
        <strong className="text-stone-100">{skills.length}</strong> skills
      </ToolSummary>
      <Response>
        {Object.entries(SKILL_CATEGORIES).map(([key, label]) =>
          grouped[key] ? (
            <div key={key} className="flex flex-col sm:flex-row">
              <span className="w-44 flex-shrink-0" style={{ color: ACCENT }}>{label}</span>
              <span className="text-stone-400">{grouped[key].join(', ')}</span>
            </div>
          ) : null,
        )}
      </Response>
    </div>
  );
}

function ContactOutput() {
  return (
    <Response>
      {SOCIALS.map(({ label, value, href }) => (
        <div key={label} className="flex">
          <span className="w-28 flex-shrink-0" style={{ color: ACCENT }}>{label}</span>
          <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="text-stone-300 underline decoration-stone-600 underline-offset-2 hover:text-stone-100"
          >
            {value}
          </a>
        </div>
      ))}
    </Response>
  );
}

let entryId = 0;
const nextId = () => ++entryId;

export default function Terminal({ isOpen, onClose }: TerminalProps) {
  const { isDark, toggleTheme } = useTheme();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [thinkingVerb, setThinkingVerb] = useState<string | null>(null);
  const [streamText, setStreamText] = useState<string | null>(null);
  const thinkingTimer = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Mirrors the shape ResumeChat sends: the API drops the first (greeting) entry
  const aiHistoryRef = useRef<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm an AI assistant that can answer questions about Hari's resume." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBusy = thinkingVerb !== null || streamText !== null;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, thinkingVerb, streamText]);

  useEffect(() => {
    return () => {
      if (thinkingTimer.current !== null) window.clearTimeout(thinkingTimer.current);
      abortRef.current?.abort();
    };
  }, []);

  const print = (content: React.ReactNode, kind: HistoryEntry['kind'] = 'output') => {
    setHistory((prev) => [...prev, { id: nextId(), kind, content }]);
  };

  const startThinking = () => {
    setThinkingVerb(THINKING_VERBS[Math.floor(Math.random() * THINKING_VERBS.length)]);
  };

  // Mimic the model "working" before a canned reply lands
  const printAfterThinking = (content: React.ReactNode) => {
    startThinking();
    thinkingTimer.current = window.setTimeout(() => {
      thinkingTimer.current = null;
      setThinkingVerb(null);
      print(content);
    }, 500 + Math.random() * 600);
  };

  const interrupt = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      return;
    }
    if (thinkingTimer.current !== null) {
      window.clearTimeout(thinkingTimer.current);
      thinkingTimer.current = null;
    }
    setThinkingVerb(null);
    print(<div className="pl-6 text-red-400">⎿  Interrupted by user</div>);
  };

  // Free-form input goes to the same streaming endpoint as the resume chat
  const askAI = async (question: string) => {
    startThinking();
    const controller = new AbortController();
    abortRef.current = controller;
    let answer = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: getResumeContext(),
          history: aiHistoryRef.current,
        }),
        signal: controller.signal,
      });

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
          const message = data.retry
            ? 'The model is warming up — try again in a moment.'
            : data.error || `Request failed (${response.status})`;
          print(<Response><span className="text-red-400">{message}</span></Response>);
          return;
        }
        answer = data.answer ?? '';
      } else {
        if (!response.body) throw new Error('Streaming is not supported by this browser');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          setThinkingVerb(null);
          setStreamText(answer);
        }
        answer += decoder.decode();
      }

      if (answer.trim()) {
        aiHistoryRef.current = [
          ...aiHistoryRef.current,
          { role: 'user', content: question },
          { role: 'assistant', content: answer },
        ];
        print(<Response><span className="whitespace-pre-wrap break-words">{answer}</span></Response>);
      } else {
        print(<Response><span className="text-stone-400">(no response — try rephrasing)</span></Response>);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        if (answer.trim()) {
          print(<Response><span className="whitespace-pre-wrap break-words">{answer}</span></Response>);
        }
        print(<div className="pl-6 text-red-400">⎿  Interrupted by user</div>);
      } else {
        console.error('Terminal chat error:', error);
        print(<Response><span className="text-red-400">Something went wrong talking to the model. Try again in a moment.</span></Response>);
      }
    } finally {
      abortRef.current = null;
      setThinkingVerb(null);
      setStreamText(null);
    }
  };

  const setLine = (value: string) => {
    setInput(value);
    setCursorPos(value.length);
  };

  const syncCursor = (el: HTMLInputElement) => {
    setCursorPos(el.selectionStart ?? el.value.length);
  };

  const runCommand = (raw: string) => {
    const line = raw.trim();
    print(line, 'command');

    if (!line) return;

    setCommandHistory((prev) => (prev[prev.length - 1] === line ? prev : [...prev, line]));
    setHistoryIndex(-1);

    const [rawCommand, ...args] = line.split(/\s+/);
    const isSlash = rawCommand.startsWith('/');
    const command = rawCommand.replace(/^\//, '').toLowerCase();
    const arg = args.join(' ');

    // Bare words only count as commands when they stand alone (or take args);
    // everything else reads like a question and goes to the AI
    const knownCommand = COMMANDS.includes(command) || HIDDEN_COMMANDS.includes(command);
    const looksLikeCommand =
      isSlash || (knownCommand && (args.length === 0 || COMMANDS_WITH_ARGS.includes(command)));

    if (!looksLikeCommand) {
      void askAI(line);
      return;
    }

    switch (command) {
      case 'help':
        print(<HelpOutput />);
        break;
      case 'about':
        printAfterThinking(<AboutOutput />);
        break;
      case 'projects':
        printAfterThinking(<ProjectsOutput />);
        break;
      case 'experience':
        printAfterThinking(<ExperienceOutput />);
        break;
      case 'skills':
        printAfterThinking(<SkillsOutput />);
        break;
      case 'contact':
      case 'socials':
        printAfterThinking(<ContactOutput />);
        break;
      case 'goto': {
        const target = SECTIONS.find((s) => s.toLowerCase() === arg.toLowerCase());
        if (!target) {
          print(
            <Response>
              <span className="text-red-400">usage: /goto &lt;{SECTIONS.join('|').toLowerCase()}&gt;</span>
            </Response>,
          );
          break;
        }
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        print(<Response>Navigating to {arg.toLowerCase()}…</Response>);
        onClose();
        break;
      }
      case 'theme':
        toggleTheme();
        print(<Response>Switched to {isDark ? 'light' : 'dark'} mode {isDark ? '☀' : '☾'}</Response>);
        break;
      case 'model':
        print(
          <Response>
            <span className="text-stone-200">hari-1.0</span>
            <span className="text-stone-500"> · context window: unlimited curiosity · knowledge cutoff: never</span>
          </Response>,
        );
        break;
      case 'cost':
        print(
          <Response>
            Total cost: $0.00<span className="text-stone-500"> · Hari's time: priceless · API calls: just vibes</span>
          </Response>,
        );
        break;
      case 'whoami':
        printAfterThinking(<Response>guest — but Hari is glad you found this.</Response>);
        break;
      case 'date':
        print(<Response>{new Date().toString()}</Response>);
        break;
      case 'echo':
        print(<Response>{arg || ''}</Response>);
        break;
      case 'sudo':
        print(
          <Response>
            <span className="text-red-400">guest is not in the sudoers file. This incident will be reported.</span>
          </Response>,
        );
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
      case 'quit':
        onClose();
        break;
      default:
        print(
          <Response>
            <span className="text-red-400">Unknown slash command: {rawCommand}</span>
            <span className="text-stone-500"> · type /help, or drop the slash to ask the AI</span>
          </Response>,
        );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (isBusy) {
        interrupt();
      } else {
        onClose();
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isBusy) return;
      runCommand(input);
      setLine('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const index = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setLine(commandHistory[index]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const index = historyIndex + 1;
      if (index >= commandHistory.length) {
        setHistoryIndex(-1);
        setLine('');
      } else {
        setHistoryIndex(index);
        setLine(commandHistory[index]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const typed = input.trimStart();
      const hasSlash = typed.startsWith('/');
      const partial = typed.replace(/^\//, '').toLowerCase();
      if (!partial || partial.includes(' ')) return;
      const matches = COMMANDS.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        setLine((hasSlash ? '/' : '') + matches[0] + ' ');
      } else if (matches.length > 1) {
        print(input, 'command');
        print(<Response>{matches.map((m) => (hasSlash ? '/' : '') + m).join('  ')}</Response>);
      }
    }
  };

  if (!isOpen) return null;

  // Mirror of the hidden input, split around the caret so a block cursor can sit on it
  const beforeCursor = input.slice(0, cursorPos);
  const atCursor = input.slice(cursorPos, cursorPos + 1) || ' ';
  const afterCursor = input.slice(cursorPos + 1);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
    >
      <div
        className="w-full max-w-2xl h-[75vh] sm:h-[34rem] flex flex-col rounded-md overflow-hidden border border-stone-700/80 bg-[#0a0a0a] shadow-2xl font-mono text-[13px] leading-snug"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1c1c1c] border-b border-black/60 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center text-stone-400 text-xs select-none">
            guest@hari-patel: ~/portfolio — hari-code
          </span>
          <button
            onClick={onClose}
            aria-label="Close terminal"
            className="text-stone-500 hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollback */}
        <div ref={scrollRef} className="terminal-scrollback flex-1 overflow-y-auto px-3 py-4 text-stone-300 space-y-1.5">
          {/* Splash: titled border box with welcome panel + tips panel */}
          <div className="relative rounded-md border mt-1 mb-3" style={{ borderColor: ACCENT }}>
            <span
              className="absolute -top-2.5 left-3 px-1.5 text-sm font-bold select-none"
              style={{ color: ACCENT, backgroundColor: BG }}
            >
              Hari Code v1.0.0
            </span>
            <div className="flex">
              {/* Left: welcome */}
              <div className="flex-1 min-w-0 flex flex-col items-center text-center gap-2.5 px-3 py-4">
                <div className="font-bold text-stone-100">Welcome back guest!</div>
                <Mascot />
                <div className="text-stone-400">
                  hari-1.0 · Hari Pro · guest@hari-patel's Organization
                </div>
                <div className="text-stone-500">/Users/guest/hari-patel/portfolio</div>
              </div>
              {/* Right: tips */}
              <div
                className="hidden sm:block w-56 flex-shrink-0 border-l px-3 py-4"
                style={{ borderColor: ACCENT }}
              >
                <div className="font-bold" style={{ color: ACCENT }}>Tips for getting started</div>
                <div className="text-stone-400 pb-3">Run /help to see what Hari Code can do</div>
                <div className="border-t pt-3" style={{ borderColor: `${ACCENT}66` }}>
                  <div className="font-bold" style={{ color: ACCENT }}>Recent activity</div>
                  <div className="text-stone-400">No recent activity</div>
                </div>
              </div>
            </div>
          </div>

          {history.map((entry) => (
            <div key={entry.id}>
              {entry.kind === 'command' ? (
                <div className="flex gap-2 bg-stone-800/70 rounded px-2.5 py-1.5 mt-1 break-all whitespace-pre-wrap">
                  <span className="text-stone-500 select-none flex-shrink-0">›</span>
                  <span className="text-stone-200 min-w-0">{entry.content}</span>
                </div>
              ) : (
                <div className="break-words py-0.5">{entry.content}</div>
              )}
            </div>
          ))}

          {streamText !== null && (
            <Response>
              <span className="whitespace-pre-wrap break-words">
                {streamText}
                <span className="terminal-cursor"> </span>
              </span>
            </Response>
          )}

          {thinkingVerb && (
            <div style={{ color: ACCENT }}>
              <span className="animate-pulse">✻</span> {thinkingVerb}…{' '}
              <span className="text-stone-500">(esc to interrupt)</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="px-3 pb-3 pt-1 flex-shrink-0">
          <div className="relative cursor-text rounded-lg border border-stone-600/80 px-3 py-2 flex bg-[#0a0a0a]">
            <span className="text-stone-400 select-none pr-2 flex-shrink-0">&gt;</span>
            <span className="text-stone-100 whitespace-pre-wrap break-all min-w-0" aria-hidden="true">
              {input ? (
                <>
                  {beforeCursor}
                  <span className="terminal-cursor">{atCursor}</span>
                  {afterCursor}
                </>
              ) : (
                <>
                  <span className="terminal-cursor"> </span>
                  <span className="text-stone-600">Try "/projects" or ask anything about Hari</span>
                </>
              )}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                syncCursor(e.target);
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={(e) => syncCursor(e.currentTarget)}
              onSelect={(e) => syncCursor(e.currentTarget)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </div>
          <div className="flex justify-between pt-1.5 px-1 text-xs text-stone-600">
            <span>/help for commands · tab to autocomplete · ↑ for history</span>
            <span className="hidden sm:inline">esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

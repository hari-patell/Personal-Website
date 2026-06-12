import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';
import { skills } from '../data/skills';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryEntry {
  id: number;
  kind: 'command' | 'output';
  content: React.ReactNode;
}

const ACCENT = '#D97757';

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

/* Claude Code-style assistant bullet: ⏺ followed by the response */
function Response({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span style={{ color: ACCENT }} className="select-none flex-shrink-0">⏺</span>
      <div className="min-w-0 flex-1 text-stone-300">{children}</div>
    </div>
  );
}

/* Claude Code-style tool call: ⏺ Read(file) with a ⎿ result line */
function ToolCall({ name, arg, result }: { name: string; arg: string; result: string }) {
  return (
    <div className="pb-1.5">
      <div className="flex gap-2">
        <span className="text-green-500 select-none flex-shrink-0">⏺</span>
        <div className="min-w-0">
          <span className="text-stone-200 font-semibold">{name}</span>
          <span className="text-stone-400">({arg})</span>
        </div>
      </div>
      <div className="pl-6 text-stone-500">⎿  {result}</div>
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
      <div className="pt-1 text-stone-500">The slash is optional. There may be undocumented commands.</div>
    </Response>
  );
}

function AboutOutput() {
  return (
    <div>
      <ToolCall name="Read" arg="hari/README.md" result="Read 42 lines" />
      <Response>
        <div className="space-y-2">
          <p>
            Hari-Krishna Patel is a Computer Science student at the University of Florida who likes
            making software fast.
          </p>
          <p>
            Honeywell SWE intern (Summer '25), incoming Capital One full stack intern (Summer '26),
            and incoming Amazon SDE intern on the Within Stores team (Fall '26). He builds across
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
      <ToolCall name="Glob" arg="hari/projects/**" result={`Found ${projects.length} projects`} />
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
      <ToolCall name="Grep" arg='pattern: "internship", path: hari/career' result={`${experiences.length} matches`} />
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
      <ToolCall name="Read" arg="hari/skills.json" result={`Parsed ${skills.length} skills`} />
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
  const thinkingTimer = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, thinkingVerb]);

  useEffect(() => {
    return () => {
      if (thinkingTimer.current !== null) window.clearTimeout(thinkingTimer.current);
    };
  }, []);

  const print = (content: React.ReactNode, kind: HistoryEntry['kind'] = 'output') => {
    setHistory((prev) => [...prev, { id: nextId(), kind, content }]);
  };

  // Mimic the model "working" before a reply lands
  const printAfterThinking = (content: React.ReactNode) => {
    setThinkingVerb(THINKING_VERBS[Math.floor(Math.random() * THINKING_VERBS.length)]);
    thinkingTimer.current = window.setTimeout(() => {
      thinkingTimer.current = null;
      setThinkingVerb(null);
      print(content);
    }, 500 + Math.random() * 600);
  };

  const interruptThinking = () => {
    if (thinkingTimer.current !== null) {
      window.clearTimeout(thinkingTimer.current);
      thinkingTimer.current = null;
    }
    setThinkingVerb(null);
    print(<div className="pl-6 text-red-400">⎿  Interrupted by user</div>);
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
    const command = rawCommand.replace(/^\//, '').toLowerCase();
    const arg = args.join(' ');

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
            <span className="text-red-400">Unknown command: {rawCommand}</span>
            <span className="text-stone-500"> · type /help to see what Hari Code can do</span>
          </Response>,
        );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (thinkingVerb) {
        interruptThinking();
      } else {
        onClose();
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (thinkingVerb) return;
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
        <div ref={scrollRef} className="terminal-scrollback flex-1 overflow-y-auto px-3 py-3 text-stone-300 space-y-1.5">
          {/* Welcome box */}
          <div className="rounded-lg border px-4 py-3" style={{ borderColor: `${ACCENT}99` }}>
            <div>
              <span style={{ color: ACCENT }}>✻</span>{' '}
              <span className="font-bold text-stone-100">Welcome to Hari Code!</span>
            </div>
            <div className="text-stone-500 mt-2 pl-4">/help for help, /about for Hari's story</div>
            <div className="text-stone-500 pl-4">cwd: /Users/guest/hari-patel/portfolio</div>
          </div>
          <div className="text-stone-500 pb-1">
            ※ Tip: Try <span style={{ color: ACCENT }}>/projects</span> to see what Hari has been building
          </div>

          {history.map((entry) => (
            <div key={entry.id}>
              {entry.kind === 'command' ? (
                <div className="text-stone-500 break-all whitespace-pre-wrap pt-1">
                  <span className="select-none">&gt; </span>
                  {entry.content}
                </div>
              ) : (
                <div className="break-words">{entry.content}</div>
              )}
            </div>
          ))}

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
                  <span className="text-stone-600">Try "/projects" or "/about"</span>
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

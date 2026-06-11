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

const BANNER_LINES = [
  ' _                _ ',
  '| |__   __ _ _ __(_)',
  "| '_ \\ / _` | '__| |",
  '| | | | (_| | |  | |',
  '|_| |_|\\__,_|_|  |_|',
];

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
  'whoami',
  'date',
  'echo',
  'clear',
  'exit',
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

function Prompt() {
  return (
    <span className="select-none whitespace-pre">
      <span className="text-green-400 font-bold">guest@hari-patel</span>
      <span className="text-stone-300">:</span>
      <span className="text-blue-400 font-bold">~</span>
      <span className="text-stone-300">$ </span>
    </span>
  );
}

function HelpOutput() {
  const rows: Array<[string, string]> = [
    ['about', 'who is hari?'],
    ['projects', "things I've built"],
    ['experience', "where I've worked"],
    ['skills', 'tech I know'],
    ['contact', 'how to reach me'],
    ['goto <section>', `jump to a section (${SECTIONS.join(', ').toLowerCase()})`],
    ['theme', 'toggle light/dark mode'],
    ['whoami', 'who are you?'],
    ['echo <text>', 'say it back'],
    ['clear', 'clear the screen'],
    ['exit', 'close the terminal (or press Esc)'],
  ];
  return (
    <div>
      {rows.map(([cmd, desc]) => (
        <div key={cmd} className="flex">
          <span className="w-40 flex-shrink-0 text-green-400">{cmd}</span>
          <span className="text-stone-400">{desc}</span>
        </div>
      ))}
      <div className="pt-1 text-stone-500">tip: ↑/↓ for history, Tab to autocomplete</div>
    </div>
  );
}

function AboutOutput() {
  return (
    <div className="space-y-2 text-stone-300">
      <p>
        Hey, I'm <span className="text-stone-100 font-semibold">Hari-Krishna Patel</span> — a Computer
        Science student at the University of Florida who likes making software fast.
      </p>
      <p>
        Honeywell SWE intern (Summer '25), incoming Capital One full stack intern (Summer '26), and
        incoming Amazon SDE intern on the Within Stores team (Fall '26). I build things across
        full-stack, ML, mobile, and market microstructure — favorite wins include taking a parser
        from 4.5s to 150ms and an order book engine pushing ~50,000 orders/sec.
      </p>
      <p className="text-stone-500">
        Off the keyboard: photography on a Fujifilm XT-30 II and volunteering with BAPS charities.
      </p>
    </div>
  );
}

function ProjectsOutput() {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div key={project.id}>
          <div className="text-stone-100 font-semibold">{project.title}</div>
          <div className="text-stone-400">{project.description}</div>
          <div className="text-green-400/80 text-xs mt-0.5">[{project.technologies.join(', ')}]</div>
        </div>
      ))}
    </div>
  );
}

function ExperienceOutput() {
  return (
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
  );
}

function SkillsOutput() {
  const grouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill.name);
    return acc;
  }, {});
  return (
    <div>
      {Object.entries(SKILL_CATEGORIES).map(([key, label]) =>
        grouped[key] ? (
          <div key={key} className="flex flex-col sm:flex-row">
            <span className="w-44 flex-shrink-0 text-green-400">{label}</span>
            <span className="text-stone-400">{grouped[key].join(', ')}</span>
          </div>
        ) : null,
      )}
    </div>
  );
}

function ContactOutput() {
  return (
    <div>
      {SOCIALS.map(({ label, value, href }) => (
        <div key={label} className="flex">
          <span className="w-28 flex-shrink-0 text-green-400">{label}</span>
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
    </div>
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
  const [lastLogin] = useState(() => new Date());
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
  }, [history]);

  const print = (content: React.ReactNode, kind: HistoryEntry['kind'] = 'output') => {
    setHistory((prev) => [...prev, { id: nextId(), kind, content }]);
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

    const [command, ...args] = line.split(/\s+/);
    const arg = args.join(' ');

    switch (command.toLowerCase()) {
      case 'help':
        print(<HelpOutput />);
        break;
      case 'about':
        print(<AboutOutput />);
        break;
      case 'projects':
        print(<ProjectsOutput />);
        break;
      case 'experience':
        print(<ExperienceOutput />);
        break;
      case 'skills':
        print(<SkillsOutput />);
        break;
      case 'contact':
      case 'socials':
        print(<ContactOutput />);
        break;
      case 'goto': {
        const target = SECTIONS.find((s) => s.toLowerCase() === arg.toLowerCase());
        if (!target) {
          print(
            <span className="text-red-400">
              usage: goto &lt;{SECTIONS.join('|').toLowerCase()}&gt;
            </span>,
          );
          break;
        }
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        print(`navigating to ${arg.toLowerCase()}...`);
        onClose();
        break;
      }
      case 'theme':
        toggleTheme();
        print(`switched to ${isDark ? 'light' : 'dark'} mode ${isDark ? '☀' : '☾'}`);
        break;
      case 'whoami':
        print('guest — but Hari is glad you found this.');
        break;
      case 'date':
        print(new Date().toString());
        break;
      case 'echo':
        print(arg || '');
        break;
      case 'sudo':
        print(<span className="text-red-400">guest is not in the sudoers file. This incident will be reported.</span>);
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
          <span>
            <span className="text-stone-300">zsh: command not found: {command}</span>
            <span className="text-stone-500"> — type 'help' to see what I can do</span>
          </span>,
        );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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
      const partial = input.trimStart().toLowerCase();
      if (!partial || partial.includes(' ')) return;
      const matches = COMMANDS.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        setLine(matches[0] + ' ');
      } else if (matches.length > 1) {
        print(input, 'command');
        print(matches.join('  '));
      }
    } else if (e.key === 'Escape') {
      onClose();
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
        className="w-full max-w-2xl h-[75vh] sm:h-[32rem] flex flex-col rounded-md overflow-hidden border border-stone-700/80 bg-[#0a0a0a] shadow-2xl font-mono text-[13px] leading-snug"
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
            guest@hari-patel: ~ — zsh
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
        <div ref={scrollRef} className="terminal-scrollback flex-1 overflow-y-auto px-3 py-2 text-stone-300">
          <pre className="text-green-400 text-[11px] leading-tight select-none">
            {BANNER_LINES.join('\n')}
          </pre>
          <div className="text-stone-400">
            Last login: {lastLogin.toDateString().slice(0, -5)} {lastLogin.toTimeString().slice(0, 8)} on ttys001
          </div>
          <div className="text-stone-500 pb-1.5">Type 'help' for available commands.</div>
          {history.map((entry) => (
            <div key={entry.id}>
              {entry.kind === 'command' ? (
                <div>
                  <Prompt />
                  <span className="text-stone-100 break-all whitespace-pre-wrap">{entry.content}</span>
                </div>
              ) : (
                <div className="break-words">{entry.content}</div>
              )}
            </div>
          ))}
          {/* Live prompt line: a hidden input drives the visible mirror + block cursor */}
          <div className="relative cursor-text">
            <Prompt />
            <span className="text-stone-100 whitespace-pre-wrap break-all" aria-hidden="true">
              {beforeCursor}
              <span className="terminal-cursor">{atCursor}</span>
              {afterCursor}
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
        </div>
      </div>
    </div>
  );
}

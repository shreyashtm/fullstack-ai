import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import curriculum from "./content/curriculum.json";
import "./App.css";

const DEPTH_COLOR = {
  Recognize: "var(--depth-recognize)",
  Understand: "var(--depth-understand)",
  Use: "var(--depth-use)",
  Reason: "var(--depth-reason)",
  Master: "var(--depth-master)",
};

function getInitialTheme() {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage unavailable (private browsing, etc.) — fall through to system preference
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore — theme just won't persist across reloads
    }
  }, [theme]);

  return [theme, setTheme];
}

function ThemeToggle({ theme, setTheme }) {
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}

function StatusDot({ written }) {
  return (
    <span
      className="status-dot"
      style={{ background: written ? "var(--status-written)" : "var(--status-unwritten)" }}
      aria-label={written ? "written" : "not yet authored"}
    />
  );
}

function DepthPill({ depth }) {
  if (!depth) return null;
  const color = DEPTH_COLOR[depth] || "var(--text-muted)";
  return (
    <span className="pill" style={{ color, borderColor: color }}>
      {depth}
    </span>
  );
}

function Sidebar({
  modules,
  concepts,
  activeId,
  onSelect,
  onlyWritten,
  setOnlyWritten,
  query,
  setQuery,
  theme,
  setTheme,
}) {
  const tracks = [
    { name: "Frontend + Backend", modules: modules.filter((m) => m.track === "Frontend + Backend") },
    { name: "Database + Cloud", modules: modules.filter((m) => m.track === "Database + Cloud") },
  ];

  const matches = (c) => {
    if (onlyWritten && !c.written) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-row">
          <div className="section-title">Full-Stack Curriculum</div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
        <h1 className="serif app-title">Learning Notebook</h1>
        <div className="progress-line">
          {curriculum.writtenConcepts} / {curriculum.totalConcepts} concepts authored
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(100 * curriculum.writtenConcepts) / curriculum.totalConcepts}%` }}
          />
        </div>
      </div>

      <div className="sidebar-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search concepts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search concepts"
        />
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={onlyWritten}
            onChange={(e) => setOnlyWritten(e.target.checked)}
          />
          Only show authored
        </label>
      </div>

      <nav className="module-nav">
        {tracks.map((track) => (
          <div key={track.name} className="track-group">
            <div className="track-title">{track.name}</div>
            {track.modules.map((m) => {
              const moduleConcepts = m.conceptIds.map((id) => concepts[id]).filter(matches);
              if (moduleConcepts.length === 0 && (query || onlyWritten)) return null;
              const writtenCount = m.conceptIds.filter((id) => concepts[id].written).length;
              return (
                <div key={m.code} className="module-block">
                  <div className="module-title">
                    Module {m.number} · {m.name}
                    <span className="module-count">
                      {writtenCount}/{m.conceptIds.length}
                    </span>
                  </div>
                  <ul className="concept-list">
                    {moduleConcepts.map((c) => (
                      <li key={c.id}>
                        <button
                          className={`concept-link${c.id === activeId ? " active" : ""}`}
                          onClick={() => onSelect(c.id)}
                        >
                          <StatusDot written={c.written} />
                          <span className="concept-link-title">{c.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function ConceptView({ concept }) {
  if (!concept) {
    return (
      <div className="empty-state">
        <p>Pick a concept from the left to view it.</p>
      </div>
    );
  }

  if (!concept.written) {
    return (
      <div className="concept-view">
        <div className="concept-header">
          <h1 className="serif">{concept.title}</h1>
          <DepthPill depth={concept.depthPlanned} />
        </div>
        <div className="not-written-card">
          <div className="section-title">Not yet authored</div>
          <p>
            This concept is modeled in the curriculum (Module {concept.moduleNumber},{" "}
            <code>{concept.id}</code>) but full content hasn't been written yet.
          </p>
          {concept.prereq && (
            <p>
              <strong>Prerequisite:</strong> {concept.prereq}
            </p>
          )}
          {concept.covers && (
            <p>
              <strong>Covers (original curriculum item):</strong> {concept.covers}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="concept-view">
      <div className="concept-header">
        <h1 className="serif">{concept.title}</h1>
        <DepthPill depth={concept.depthFromContent || concept.depthPlanned} />
      </div>
      <div className="concept-meta">
        Module {concept.moduleNumber} · <code>{concept.id}</code>
        {concept.sourceFile && <> · from {concept.sourceFile}</>}
      </div>
      {concept.note && <div className="ported-note">{concept.note}</div>}

      {concept.sections.map((s, i) => (
        <section key={i} className="concept-section">
          <div className="section-title">{s.heading}</div>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{s.content}</ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [onlyWritten, setOnlyWritten] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useTheme();

  const activeConcept = useMemo(
    () => (activeId ? curriculum.concepts[activeId] : null),
    [activeId]
  );

  return (
    <div className="app-shell">
      <Sidebar
        modules={curriculum.modules}
        concepts={curriculum.concepts}
        activeId={activeId}
        onSelect={setActiveId}
        onlyWritten={onlyWritten}
        setOnlyWritten={setOnlyWritten}
        query={query}
        setQuery={setQuery}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="main-pane">
        <ConceptView concept={activeConcept} />
      </main>
    </div>
  );
}

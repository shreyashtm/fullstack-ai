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

const STATUS_COLOR = {
  Current: "var(--status-written)",
  "Not started": "var(--status-unwritten)",
};

function MilestoneStatusDot({ status }) {
  return (
    <span
      className="status-dot"
      style={{ background: STATUS_COLOR[status] || "var(--text-muted)" }}
      aria-label={status}
    />
  );
}

/** Inline `code` renderer shared by concept + project markdown: turns any
 * inline code span matching a real concept id into a jump-to-curriculum
 * link instead of plain <code>, so the project layer stays a *reference*
 * to concepts rather than a re-explanation of them. */
function makeMarkdownComponents(concepts, onJumpToConcept) {
  return {
    code({ children, ...props }) {
      const text = String(children);
      const concept = concepts[text];
      if (concept && onJumpToConcept) {
        return (
          <button
            className="concept-ref-link"
            title={`Jump to ${concept.title} in the curriculum`}
            onClick={() => onJumpToConcept(text)}
          >
            {text}
          </button>
        );
      }
      return <code {...props}>{children}</code>;
    },
  };
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

function ViewTabs({ view, setView }) {
  return (
    <div className="view-tabs" role="tablist" aria-label="Notebook section">
      <button
        role="tab"
        aria-selected={view === "curriculum"}
        className={`view-tab${view === "curriculum" ? " active" : ""}`}
        onClick={() => setView("curriculum")}
      >
        Curriculum
      </button>
      <button
        role="tab"
        aria-selected={view === "project"}
        className={`view-tab${view === "project" ? " active" : ""}`}
        onClick={() => setView("project")}
      >
        Project
      </button>
    </div>
  );
}

function CurriculumNav({ modules, concepts, activeId, onSelect, onlyWritten, setOnlyWritten, query, setQuery }) {
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
    <>
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
    </>
  );
}

function ProjectNav({ project, activeMilestoneId, onSelectMilestone }) {
  return (
    <nav className="module-nav">
      <div className="track-group">
        <div className="track-title">Milestones</div>
        <ul className="concept-list">
          {project.milestones.map((m) => (
            <li key={m.id}>
              <button
                className={`concept-link${m.id === activeMilestoneId ? " active" : ""}`}
                onClick={() => onSelectMilestone(m.id)}
                disabled={!m.hasContent}
              >
                <MilestoneStatusDot status={m.status} />
                <span className="concept-link-title">
                  {m.number}. {m.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Sidebar({
  view,
  setView,
  modules,
  concepts,
  activeId,
  onSelect,
  onlyWritten,
  setOnlyWritten,
  query,
  setQuery,
  project,
  activeMilestoneId,
  onSelectMilestone,
  theme,
  setTheme,
}) {
  const isProject = view === "project";
  // "Started" tracks the learner's own build progress (status !== "Not started"),
  // not whether a spec/scaffold exists — every milestone can have a written
  // spec long before anyone has implemented it.
  const milestonesStarted = project ? project.milestones.filter((m) => m.status !== "Not started").length : 0;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-row">
          <ViewTabs view={view} setView={setView} />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
        <h1 className="serif app-title">Learning Notebook</h1>
        {isProject ? (
          project && (
            <>
              <div className="progress-line">
                {milestonesStarted} / {project.milestones.length} milestones started
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(100 * milestonesStarted) / project.milestones.length}%` }}
                />
              </div>
            </>
          )
        ) : (
          <>
            <div className="progress-line">
              {curriculum.writtenConcepts} / {curriculum.totalConcepts} concepts authored
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(100 * curriculum.writtenConcepts) / curriculum.totalConcepts}%` }}
              />
            </div>
          </>
        )}
      </div>

      {isProject ? (
        project ? (
          <>
            <div className="sidebar-controls">
              <button
                className={`concept-link${activeMilestoneId === null ? " active" : ""}`}
                onClick={() => onSelectMilestone(null)}
              >
                Project overview
              </button>
            </div>
            <ProjectNav project={project} activeMilestoneId={activeMilestoneId} onSelectMilestone={onSelectMilestone} />
          </>
        ) : (
          <div className="empty-state">
            <p>No project layer found.</p>
          </div>
        )
      ) : (
        <CurriculumNav
          modules={modules}
          concepts={concepts}
          activeId={activeId}
          onSelect={onSelect}
          onlyWritten={onlyWritten}
          setOnlyWritten={setOnlyWritten}
          query={query}
          setQuery={setQuery}
        />
      )}
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

function ProjectOverview({ project, concepts, onJumpToConcept }) {
  const components = useMemo(() => makeMarkdownComponents(concepts, onJumpToConcept), [concepts, onJumpToConcept]);

  return (
    <div className="concept-view">
      <div className="concept-header">
        <h1 className="serif">{project.title}</h1>
      </div>
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {project.intro}
        </ReactMarkdown>
      </div>
      {project.overviewSections.map((s, i) => (
        <section key={i} className="concept-section">
          <div className="section-title">{s.heading}</div>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {s.content}
            </ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  );
}

function MilestoneView({ milestone, concepts, onJumpToConcept }) {
  const components = useMemo(() => makeMarkdownComponents(concepts, onJumpToConcept), [concepts, onJumpToConcept]);

  if (!milestone || !milestone.hasContent) {
    return (
      <div className="empty-state">
        <p>This milestone hasn't been scaffolded yet.</p>
      </div>
    );
  }

  return (
    <div className="concept-view">
      <div className="concept-header">
        <h1 className="serif">{milestone.title}</h1>
        {milestone.guidanceLevel && <DepthPill depth={milestone.guidanceLevel} />}
      </div>
      <div className="concept-meta">
        Milestone {milestone.number} · {milestone.status} · practices {milestone.modulesPracticed}
      </div>
      {milestone.sections.map((s, i) => (
        <section key={i} className="concept-section">
          <div className="section-title">{s.heading}</div>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {s.content}
            </ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("curriculum");
  const [activeId, setActiveId] = useState(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);
  const [onlyWritten, setOnlyWritten] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useTheme();

  const activeConcept = useMemo(
    () => (activeId ? curriculum.concepts[activeId] : null),
    [activeId]
  );

  const activeMilestone = useMemo(
    () =>
      curriculum.project && activeMilestoneId
        ? curriculum.project.milestones.find((m) => m.id === activeMilestoneId)
        : null,
    [activeMilestoneId]
  );

  const jumpToConcept = (id) => {
    setView("curriculum");
    setActiveId(id);
  };

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        setView={setView}
        modules={curriculum.modules}
        concepts={curriculum.concepts}
        activeId={activeId}
        onSelect={(id) => {
          setView("curriculum");
          setActiveId(id);
        }}
        onlyWritten={onlyWritten}
        setOnlyWritten={setOnlyWritten}
        query={query}
        setQuery={setQuery}
        project={curriculum.project}
        activeMilestoneId={activeMilestoneId}
        onSelectMilestone={setActiveMilestoneId}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="main-pane">
        {view === "project" ? (
          curriculum.project ? (
            activeMilestone ? (
              <MilestoneView milestone={activeMilestone} concepts={curriculum.concepts} onJumpToConcept={jumpToConcept} />
            ) : (
              <ProjectOverview project={curriculum.project} concepts={curriculum.concepts} onJumpToConcept={jumpToConcept} />
            )
          ) : (
            <div className="empty-state">
              <p>No project layer found.</p>
            </div>
          )
        ) : (
          <ConceptView concept={activeConcept} />
        )}
      </main>
    </div>
  );
}

// Parses ../../curriculum/*.md into src/content/curriculum.json.
// Re-run automatically by `npm run dev` / `npm run build` (see package.json)
// so the app always reflects the latest curriculum content on disk.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CURRICULUM_DIR = path.resolve(__dirname, "../../curriculum");
const PROJECT_DIR = path.resolve(__dirname, "../../project");
const OUT_FILE = path.resolve(__dirname, "../src/content/curriculum.json");

function readCurriculumFile(name) {
  return readFileSync(path.join(CURRICULUM_DIR, name), "utf-8");
}

// ---- 1. Parse the full 103-concept skeleton out of 02-curriculum-model.md ----
function parseSkeleton(md) {
  const modules = [];
  const concepts = new Map();

  const moduleHeaderRe = /^### Module (\d+) — (.+?) \(`(\w+)`\)\s*$/gm;
  const headers = [...md.matchAll(moduleHeaderRe)];

  headers.forEach((m, i) => {
    const [, numStr, name, code] = m;
    const number = Number(numStr);
    const start = m.index + m[0].length;
    const end = i + 1 < headers.length ? headers[i + 1].index : md.length;
    const section = md.slice(start, end);

    const track = number <= 7 ? "Frontend + Backend" : "Database + Cloud";
    const conceptIds = [];

    const rows = section
      .split("\n")
      .filter((line) => line.trim().startsWith("|"));
    // rows[0] = header, rows[1] = --- separator, rows[2..] = data
    for (const row of rows.slice(2)) {
      const cells = row
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (cells.length < 5) continue;
      const [id, title, depth, prereq, covers] = cells;
      if (!id || id === "—") continue; // cross-referenced row (e.g. GCP's BigQuery bullet)
      conceptIds.push(id);
      concepts.set(id, {
        id,
        title: title.replace(/\*\*/g, ""),
        module: code,
        moduleNumber: number,
        track,
        depthPlanned: depth,
        prereq: prereq || null,
        covers: covers || null,
        written: false,
        sourceFile: null,
        depthFromContent: null,
        note: null,
        sections: null,
      });
    }

    modules.push({ code, number, name, track, conceptIds });
  });

  return { modules, concepts };
}

// ---- 2. Parse full concept content out of a module-*.md / chain-*.md file ----
function parseConceptFile(md) {
  const results = [];
  const parts = md.split(/^## /m);
  // parts[0] is the H1 preamble before the first concept — ignored here.
  for (const part of parts.slice(1)) {
    const firstNewline = part.indexOf("\n");
    const headerLine = part.slice(0, firstNewline).trim();
    let body = part.slice(firstNewline + 1);
    // strip a trailing "---" horizontal rule left over from the split
    body = body.replace(/\n---\s*$/m, "").trim();

    const dashIdx = headerLine.indexOf(" — ");
    if (dashIdx === -1) continue;
    const id = headerLine.slice(0, dashIdx).trim();
    const title = headerLine.slice(dashIdx + 3).trim();
    if (!/^[a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)+$/.test(id)) continue;

    const depthMatch = body.match(/\*\*Target depth:\*\*\s*([A-Za-z]+)/);
    const depthFromContent = depthMatch ? depthMatch[1] : null;

    const noteMatch = body.match(/\*\(Reproduced from[^)]*\)\*/);
    const note = noteMatch ? noteMatch[0].replace(/^\*\(|\)\*$/g, "") : null;

    const sectionParts = body.split(/^### /m);
    const sections = [];
    for (const sp of sectionParts.slice(1)) {
      const nl = sp.indexOf("\n");
      const heading = sp.slice(0, nl).trim();
      const content = sp.slice(nl + 1).trim();
      sections.push({ heading, content });
    }

    results.push({ id, title, depthFromContent, note, sections });
  }
  return results;
}

// ---- 3. Parse the project layer (project/README.md + project/milestones/*.md) ----
// Generic doc shape: H1 title, intro text before the first "## ", then one
// entry per "## " section. Separate from parseConceptFile's stricter
// "id — title" heading format — project docs use plain prose headings.
function parseDoc(md) {
  const h1Match = md.match(/^# (.+)$/m);
  const title = h1Match ? h1Match[1].trim() : null;
  const afterH1 = h1Match ? md.slice(h1Match.index + h1Match[0].length) : md;
  const firstH2Idx = afterH1.search(/^## /m);
  const intro = (firstH2Idx === -1 ? afterH1 : afterH1.slice(0, firstH2Idx)).trim();
  const sectionsMd = firstH2Idx === -1 ? "" : afterH1.slice(firstH2Idx);

  const sections = [];
  for (const part of sectionsMd.split(/^## /m).slice(1)) {
    const nl = part.indexOf("\n");
    const heading = part.slice(0, nl).trim();
    const content = part.slice(nl + 1).trim();
    sections.push({ heading, content });
  }
  return { title, intro, sections };
}

function parseMilestonesTable(tableContent) {
  const rows = tableContent.split("\n").filter((l) => l.trim().startsWith("|"));
  const out = [];
  for (const row of rows.slice(2)) {
    const cells = row.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 4) continue;
    const [numStr, linkCell, modules, status] = cells;
    const linkMatch = linkCell.match(/\[([^\]]+)\]\(([^)]+)\)/);
    out.push({
      number: Number(numStr),
      title: linkMatch ? linkMatch[1] : linkCell.replace(/\*\*/g, ""),
      href: linkMatch ? linkMatch[2] : null,
      modulesPracticed: modules,
      status: status.replace(/\*\*/g, ""),
    });
  }
  return out;
}

function buildProject() {
  let readmeRaw;
  try {
    readmeRaw = readFileSync(path.join(PROJECT_DIR, "README.md"), "utf-8");
  } catch {
    return null; // project layer doesn't exist yet — fine, it's optional
  }

  const readme = parseDoc(readmeRaw);
  const milestonesSection = readme.sections.find((s) => s.heading.toLowerCase() === "milestones");
  const tableRows = milestonesSection ? parseMilestonesTable(milestonesSection.content) : [];

  const milestones = tableRows.map((row) => {
    const id = row.href ? path.basename(row.href, ".md") : `milestone-${row.number}`;
    let doc = { title: row.title, intro: "", sections: [] };
    if (row.href) {
      try {
        doc = parseDoc(readFileSync(path.join(PROJECT_DIR, row.href), "utf-8"));
      } catch {
        // table references a milestone doc that doesn't exist yet — leave doc empty
      }
    }
    const guidanceMatch = doc.intro.match(/Guidance level:\s*\*\*(.+?)\*\*/);
    return {
      id,
      number: row.number,
      title: doc.title || row.title,
      status: row.status,
      modulesPracticed: row.modulesPracticed,
      guidanceLevel: guidanceMatch ? guidanceMatch[1] : null,
      hasContent: doc.sections.length > 0,
      sections: doc.sections,
    };
  });

  // Overview = everything in README.md except the Milestones table (shown as its own nav/list instead)
  const overviewSections = readme.sections.filter((s) => s.heading.toLowerCase() !== "milestones");

  return {
    title: readme.title,
    intro: readme.intro,
    overviewSections,
    milestones,
  };
}

// ---- Run ----
const skeleton = parseSkeleton(readCurriculumFile("02-curriculum-model.md"));

const contentFiles = readdirSync(CURRICULUM_DIR)
  .filter((f) => /^(module-\d+-|chain-\d+-).*\.md$/.test(f))
  .sort((a, b) => {
    // module-*.md files take priority over chain-*.md for the "canonical" copy
    const aMod = a.startsWith("module-") ? 0 : 1;
    const bMod = b.startsWith("module-") ? 0 : 1;
    return aMod - bMod || a.localeCompare(b);
  });

let writtenCount = 0;
for (const file of contentFiles) {
  const parsed = parseConceptFile(readCurriculumFile(file));
  for (const c of parsed) {
    const existing = skeleton.concepts.get(c.id);
    if (!existing) continue; // shouldn't happen, but don't crash the build
    if (existing.written) continue; // already filled from an earlier (preferred) file
    existing.written = true;
    existing.sourceFile = file;
    existing.depthFromContent = c.depthFromContent;
    existing.note = c.note;
    existing.sections = c.sections;
    writtenCount++;
  }
}

const project = buildProject();

const output = {
  generatedAt: new Date().toISOString(),
  totalConcepts: skeleton.concepts.size,
  writtenConcepts: writtenCount,
  modules: skeleton.modules,
  concepts: Object.fromEntries(skeleton.concepts),
  project,
};

mkdirSync(path.dirname(OUT_FILE), { recursive: true }); // fresh clone: src/content/ isn't tracked, only the generated file is gitignored
writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
console.log(
  `[build-content] ${writtenCount}/${skeleton.concepts.size} concepts written, ` +
    `across ${skeleton.modules.length} modules -> ${path.relative(process.cwd(), OUT_FILE)}` +
    (project ? `; project layer: ${project.milestones.length} milestone(s)` : "; no project layer found")
);

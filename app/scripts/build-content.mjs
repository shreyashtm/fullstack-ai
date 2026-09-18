// Parses ../../curriculum/*.md into src/content/curriculum.json.
// Re-run automatically by `npm run dev` / `npm run build` (see package.json)
// so the app always reflects the latest curriculum content on disk.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CURRICULUM_DIR = path.resolve(__dirname, "../../curriculum");
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

const output = {
  generatedAt: new Date().toISOString(),
  totalConcepts: skeleton.concepts.size,
  writtenConcepts: writtenCount,
  modules: skeleton.modules,
  concepts: Object.fromEntries(skeleton.concepts),
};

writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
console.log(
  `[build-content] ${writtenCount}/${skeleton.concepts.size} concepts written, ` +
    `across ${skeleton.modules.length} modules -> ${path.relative(process.cwd(), OUT_FILE)}`
);

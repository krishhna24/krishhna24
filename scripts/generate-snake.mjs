#!/usr/bin/env node
// Renders the contribution calendar as an animated "snake" SVG, in both themes,
// into assets/. Self-contained: no third-party service renders this, so it can
// never 404 or rate-limit the profile.
//
//   GITHUB_TOKEN=... node scripts/generate-snake.mjs
//
// Palette is the README's amber accent (#d29922). Change THEMES to restyle.

import { writeFileSync, mkdirSync } from "node:fs";

const USER = "krishhna24";
const OUT = new URL("../assets/", import.meta.url);

// -- geometry ---------------------------------------------------------------
const CELL = 11;      // side of a day square
const GAP = 3;        // space between squares
const PITCH = CELL + GAP;
const LEFT = 30;      // gutter for Mon/Wed/Fri labels
const TOP = 20;       // gutter for month labels
const TAIL = 26;      // room under the grid for the snake's return leg
const LEN = 5;        // snake segments
const DUR = 26;       // seconds per full loop

const THEMES = {
  dark: {
    empty: "#161b22",
    levels: ["#3b2f10", "#8a6a1c", "#b8871f", "#e3b341"],
    snake: ["#f2cc60", "#d29922", "#b8871f", "#8a6a1c", "#5d4712"],
    text: "#7d8590",
    stroke: "rgba(240,246,252,0.06)",
  },
  light: {
    empty: "#ebedf0",
    levels: ["#f7e2ab", "#e8c56a", "#d29922", "#9c6d12"],
    snake: ["#b8871f", "#d29922", "#e0b552", "#ecd08c", "#f5e6c0"],
    text: "#57606a",
    stroke: "rgba(27,31,35,0.06)",
  },
};

// -- data -------------------------------------------------------------------
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("generate-snake: GITHUB_TOKEN is not set");
  process.exit(1);
}

const query = `{
  user(login: "${USER}") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount weekday } }
      }
    }
  }
}`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
  body: JSON.stringify({ query }),
});
if (!res.ok) {
  console.error(`generate-snake: graphql -> ${res.status} ${await res.text()}`);
  process.exit(1);
}
const body = await res.json();
if (body.errors) {
  console.error(`generate-snake: graphql -> ${JSON.stringify(body.errors)}`);
  process.exit(1);
}

const cal = body.data.user.contributionsCollection.contributionCalendar;
const weeks = cal.weeks;
if (!weeks?.length) {
  console.error("generate-snake: empty calendar; refusing to write");
  process.exit(1);
}

// grid[week][weekday] -> { count, level } | null
const COLS = weeks.length;
const counts = weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount));
// Bucket by quartiles of the active days, the way GitHub's own graph does. Linear
// scaling against the max flattens everything into level 0 on a spiky calendar.
const active = counts.filter((n) => n > 0).sort((a, b) => a - b);
const q = (f) => active[Math.min(active.length - 1, Math.floor(active.length * f))] || 1;
const cuts = [q(0.25), q(0.5), q(0.75)];
const level = (n) => (n === 0 ? -1 : n <= cuts[0] ? 0 : n <= cuts[1] ? 1 : n <= cuts[2] ? 2 : 3);

const grid = Array.from({ length: COLS }, () => Array(7).fill(null));
const monthAt = [];
let lastMonth = -1;
for (let x = 0; x < COLS; x++) {
  for (const d of weeks[x].contributionDays) {
    grid[x][d.weekday] = { count: d.contributionCount, level: level(d.contributionCount) };
  }
  const first = weeks[x].contributionDays[0];
  const m = new Date(first.date + "T00:00:00Z").getUTCMonth();
  if (m !== lastMonth && x < COLS - 1) {
    monthAt.push({ x, label: "JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split(" ")[m] });
    lastMonth = m;
  }
}

// -- path: serpentine across the grid, then a return leg underneath ----------
const px = (x) => LEFT + x * PITCH;
const py = (y) => TOP + y * PITCH;

const path = [];
for (let y = 0; y < 7; y++) {
  const cols = y % 2 === 0 ? [...grid.keys()] : [...grid.keys()].reverse();
  for (const x of cols) path.push({ x, y, cx: px(x), cy: py(y) });
}
// close the loop: drop below the grid, run back to the left, and rise to the start
const floorY = py(6) + PITCH;
const endX = path.at(-1).cx;
const RETURN_STEPS = 30;
for (let i = 1; i <= RETURN_STEPS; i++) {
  const t = i / RETURN_STEPS;
  path.push({ cx: endX + (px(0) - endX) * t, cy: floorY, x: -1, y: -1 });
}
path.push({ cx: px(0), cy: py(0), x: -1, y: -1 });

const STEPS = path.length;
const pct = (i) => ((i / STEPS) * 100).toFixed(3);

// -- svg --------------------------------------------------------------------
function render(t) {
  const W = LEFT + COLS * PITCH - GAP + 8;
  const H = TOP + 7 * PITCH - GAP + TAIL;

  const rules = [];
  const cells = [];

  // eat order: the step index at which the snake covers each cell
  const eatenAt = new Map();
  path.forEach((p, i) => {
    if (p.x >= 0 && !eatenAt.has(`${p.x},${p.y}`)) eatenAt.set(`${p.x},${p.y}`, i);
  });

  let id = 0;
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < 7; y++) {
      const cell = grid[x][y];
      if (!cell) continue;
      const X = px(x);
      const Y = py(y);
      if (cell.level < 0) {
        cells.push(`<rect x="${X}" y="${Y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${t.empty}" stroke="${t.stroke}"/>`);
        continue;
      }
      const c = t.levels[cell.level];
      const i = eatenAt.get(`${x},${y}`);
      const n = `e${id++}`;
      // full colour until the snake arrives, empty for the rest of the loop
      rules.push(`@keyframes ${n}{0%,${pct(i)}%{fill:${c}}${pct(i + 0.9)}%,100%{fill:${t.empty}}}`);
      cells.push(
        `<rect class="${n}" x="${X}" y="${Y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${c}" stroke="${t.stroke}"/>`
      );
      rules.push(`.${n}{animation:${n} ${DUR}s linear infinite}`);
    }
  }

  // one shared path animation; segments trail it by phase offset
  const stops = path
    .map((p, i) => `${pct(i)}%{transform:translate(${p.cx.toFixed(1)}px,${p.cy.toFixed(1)}px)}`)
    .join("");
  rules.push(`@keyframes slither{${stops}100%{transform:translate(${px(0)}px,${py(0)}px)}}`);

  const segs = [];
  for (let k = 0; k < LEN; k++) {
    const delay = -(DUR - (k * DUR) / STEPS);
    const inset = k * 0.7;
    rules.push(
      `.s${k}{animation:slither ${DUR}s linear infinite;animation-delay:${delay.toFixed(4)}s}`
    );
    segs.push(
      `<rect class="s${k}" x="${(-CELL / 2 + inset / 2).toFixed(2)}" y="${(-CELL / 2 + inset / 2).toFixed(2)}" width="${(CELL - inset).toFixed(2)}" height="${(CELL - inset).toFixed(2)}" rx="${(3.5 - k * 0.4).toFixed(2)}" fill="${t.snake[k]}"/>`
    );
  }
  // segments are positioned by their centre, so shift the whole chain half a cell
  const snake = `<g transform="translate(${CELL / 2},${CELL / 2})">${segs.join("")}</g>`;

  const months = monthAt
    .map((m) => `<text x="${px(m.x)}" y="${TOP - 8}" class="lbl">${m.label}</text>`)
    .join("");
  const days = [
    [1, "MON"],
    [3, "WED"],
    [5, "FRI"],
  ]
    .map(([d, l]) => `<text x="${LEFT - 8}" y="${py(d) + CELL - 2}" class="lbl end">${l}</text>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace">
<style>
.lbl{fill:${t.text};font-size:9px;letter-spacing:.08em;font-weight:500}
.end{text-anchor:end}
${rules.join("\n")}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
${months}${days}
<g>${cells.join("")}</g>
${snake}
</svg>`;
}

mkdirSync(OUT, { recursive: true });
for (const [name, theme] of Object.entries(THEMES)) {
  const file = new URL(`snake-${name}.svg`, OUT);
  const svg = render(theme);
  writeFileSync(file, svg);
  console.log(`generate-snake: assets/snake-${name}.svg (${(svg.length / 1024).toFixed(1)} KB)`);
}
console.log(`generate-snake: ${COLS} weeks, ${cal.totalContributions} contributions, ${STEPS} steps`);
console.log(`generate-snake: level cuts at ${cuts.join(", ")} (max ${active.at(-1)})`);

#!/usr/bin/env node
// Generates the README's typographic furniture — hero wordmark and the numbered
// section headers — as theme-aware SVGs in assets/art/.
//
//   node scripts/generate-art.mjs
//
// Everything is monospace and shares one amber palette, so the page reads as a
// single designed system. Edit SECTIONS below and re-run.

import { writeFileSync, mkdirSync } from "node:fs";

const OUT = new URL("../assets/art/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";
const W = 880; // desktop README content width; every SVG scales down from here

// Amber accent, muted greys. `d` = dark theme, `l` = light theme.
const C = {
  accent: { d: "#d29922", l: "#9a6700" },
  bright: { d: "#f0f6fc", l: "#1f2328" },
  text: { d: "#c9d1d9", l: "#1f2328" },
  muted: { d: "#7d8590", l: "#59636e" },
  faint: { d: "#30363d", l: "#d1d9e0" },
};
const pick = (k, t) => C[k][t];

// A <style> block so both themes live in one file: the media query flips the
// palette, and [data-theme] is ignored by GitHub but respected if self-hosted.
const themed = (body, extra = "") => `
<style>
  .a{fill:${C.accent.d}} .b{fill:${C.bright.d}} .t{fill:${C.text.d}}
  .m{fill:${C.muted.d}} .f{fill:${C.faint.d}} .fs{stroke:${C.faint.d}}
  @media (prefers-color-scheme: light){
    .a{fill:${C.accent.l}} .b{fill:${C.bright.l}} .t{fill:${C.text.l}}
    .m{fill:${C.muted.l}} .f{fill:${C.faint.l}} .fs{stroke:${C.faint.l}}
  }
  text{font-family:${MONO}}
  ${extra}
</style>
${body}`;

const svg = (w, h, body, extra) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">${themed(body, extra)}</svg>`;

const write = (name, content) => {
  writeFileSync(new URL(name, OUT), content);
  console.log(`  assets/art/${name}  ${(content.length / 1024).toFixed(1)} KB`);
};

// -- hero wordmark ----------------------------------------------------------
{
  const h = 122;
  const body = `
<text x="0" y="62" class="b" font-size="46" font-weight="700" letter-spacing="6">KRISHHNA T</text>
<rect x="2" y="82" width="46" height="3" rx="1.5" class="a"/>
<text x="0" y="112" class="m" font-size="14.5" letter-spacing="2.6">DISTRIBUTED SYSTEMS &#183; EXCHANGE INFRASTRUCTURE</text>`;
  write("hero.svg", svg(560, h, body));
}

// -- section headers --------------------------------------------------------
const SECTIONS = [
  ["now", "NOW"],
  ["work", "WORK"],
  ["stack", "STACK"],
  ["upstream", "UPSTREAM"],
  ["signal", "SIGNAL"],
  ["principles", "HOW I WORK"],
  ["elsewhere", "ELSEWHERE"],
];

SECTIONS.forEach(([slug, title], i) => {
  const n = String(i + 1).padStart(2, "0");
  // rule starts after the title and fades out to the right
  const titleEnd = 46 + title.length * 11.6 + 18;
  const body = `
<defs><linearGradient id="g${slug}" x1="0" x2="1">
  <stop offset="0" stop-color="${C.accent.d}" stop-opacity=".55"/>
  <stop offset="1" stop-color="${C.accent.d}" stop-opacity="0"/>
</linearGradient></defs>
<text x="0" y="21" class="a" font-size="13" font-weight="700" letter-spacing="1">${n}</text>
<text x="34" y="21" class="f" font-size="13">/</text>
<text x="52" y="21" class="b" font-size="15" font-weight="700" letter-spacing="3.4">${title}</text>
<rect x="${titleEnd}" y="14" width="${W - titleEnd}" height="1.5" fill="url(#g${slug})"/>`;
  write(`sec-${slug}.svg`, svg(W, 32, body));
});

console.log("generate-art: done");

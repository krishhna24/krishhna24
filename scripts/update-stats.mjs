#!/usr/bin/env node
// Regenerates the numbers inside the <!-- STATS:START/END --> block in README.md.
// Zero dependencies; needs GITHUB_TOKEN in the environment.
//
// To track another upstream repo, add it to REPOS below. `areas` is editorial
// (it is not derived from the API), everything else is fetched live.

import { readFileSync, writeFileSync } from "node:fs";

const USER = "krishhna24";
const README = new URL("../README.md", import.meta.url);

const REPOS = [
  { repo: "kubernetes/kubernetes",   areas: "api-machinery · storage · auth · cli" },
  { repo: "kubeedge/kubeedge",       areas: "edge runtime · image refs" },
  { repo: "excalidraw/excalidraw",   areas: "editor · svg export" },
];

const token = process.env.GITHUB_TOKEN;
if (!token) die("GITHUB_TOKEN is not set");

function die(msg) {
  console.error(`update-stats: ${msg}`);
  process.exit(1);
}

const headers = {
  authorization: `Bearer ${token}`,
  accept: "application/vnd.github+json",
  "user-agent": `${USER}-profile-stats`,
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) die(`GET ${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function graphql(query) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) die(`graphql -> ${res.status} ${await res.text()}`);
  const body = await res.json();
  if (body.errors) die(`graphql -> ${JSON.stringify(body.errors)}`);
  return body.data;
}

// The search API is heavily rate limited and eventually consistent; retry a few
// times rather than letting one bad response write a wrong number.
async function mergedCount(repo) {
  const q = encodeURIComponent(`author:${USER} is:pr is:merged repo:${repo}`);
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=1`, { headers });
    if (res.ok) return (await res.json()).total_count;
    if (res.status !== 403 && res.status !== 429) die(`search ${repo} -> ${res.status}`);
    await new Promise((r) => setTimeout(r, attempt * 5000));
  }
  die(`search ${repo}: rate limited after 4 attempts`);
}

const compact = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n);

const rows = [];
for (const { repo, areas } of REPOS) {
  const [meta, merged] = await Promise.all([api(`/repos/${repo}`), mergedCount(repo)]);
  rows.push({ repo, areas, merged, stars: compact(meta.stargazers_count) });
}

const { user } = await graphql(`{
  user(login: "${USER}") {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      contributionCalendar { totalContributions }
    }
  }
}`);

const c = user.contributionsCollection;
const total = c.contributionCalendar.totalContributions;

// A zeroed-out result almost always means a bad token rather than a real zero.
if (rows.every((r) => r.merged === 0) || total === 0) die("all counts came back zero; refusing to write");

const pad = (s, n) => String(s).padEnd(n);
const lines = [
  `${pad("REPOSITORY", 26)}${pad("STARS", 8)}${pad("MERGED", 8)}AREAS`,
  ...rows.map((r) => `${pad(r.repo, 26)}${pad(r.stars, 8)}${pad(r.merged, 8)}${r.areas}`),
  "",
  `last 12 months   ${total} contributions   ${c.totalCommitContributions} commits   ${c.totalPullRequestContributions} pull requests`,
];

const block = ["<!-- STATS:START -->", "```text", ...lines, "```", "<!-- STATS:END -->"].join("\n");

const src = readFileSync(README, "utf8");
const re = /<!-- STATS:START -->[\s\S]*?<!-- STATS:END -->/;
if (!re.test(src)) die("STATS markers not found in README.md");

const next = src.replace(re, block);
if (next === src) {
  console.log("update-stats: no change");
} else {
  writeFileSync(README, next);
  console.log("update-stats: README.md updated");
}

<!--
  Profile README for github.com/krishhna24
  Accent colour is #d29922 (GitHub dark's amber) — it was chosen to sit with the
  warm palette of assets/JohanLiebert.gif. If you swap the GIF, re-pick the accent.
  Generated pieces (do not hand-edit):
    assets/art/*      -> scripts/generate-art.mjs
    assets/snake-*.svg-> scripts/generate-snake.mjs
    the STATS block   -> scripts/update-stats.mjs
  All three run daily from .github/workflows/refresh.yml.
-->

<table>
<tr>
<td width="62%" valign="top">

<img src="./assets/art/hero.svg" width="100%" alt="Krishhna T — distributed systems, exchange infrastructure" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=17&duration=3200&pause=1000&color=D29922&vCenter=true&width=440&height=32&lines=in-memory+order+books;durable+recovery%2C+exact+decimals;agentic+tooling+for+the+terminal;upstream%3A+kubernetes+%C2%B7+kubeedge" alt="in-memory order books · durable recovery, exact decimals · agentic tooling for the terminal · upstream: kubernetes, kubeedge" />

I build the parts of a system that are hard to get right twice — matching
engines that own their state, queues that survive a restart, and money math
that never touches a float.

When I'm not building my own, I send patches upstream to Kubernetes.

</td>
<td width="38%" valign="top">

<img src="./assets/JohanLiebert.gif" width="100%" alt="" />

<sub><i>calm is a property of systems that recover</i></sub>

</td>
</tr>
</table>

```console
$ whoami --verbose

  handle      krishhna24
  builds      matching engines · queues · recovery · agentic CLI tools
  upstream    kubernetes/kubernetes · kubeedge · excalidraw
  languages   TypeScript (mine) · Go (upstream) · C++ (close to the metal)
  learning    Rust
  rule        no floats in money math, ever
```

<img src="./assets/art/sec-now.svg" width="100%" alt="Now" />

<!-- Hand-edited — update this when your focus moves. Nothing here is generated. -->

- Graduating declarative validation rules beta → stable in Kubernetes
  ([tracking issue](https://github.com/kubernetes/kubernetes/issues/141532) ·
  [first PR](https://github.com/kubernetes/kubernetes/pull/141533))
- Hardening **perps** — integration coverage and retry/DLQ handling on the event queue
- Enabling the remaining `kube-api-linter` rules across the `batch` and `authorization` groups
- Extending **glyph-agent**'s tool loop

<img src="./assets/art/sec-work.svg" width="100%" alt="Work" />

<table>
<tr>
<td width="50%" valign="top">

### [perps](https://github.com/krishhna24/perps)

A perpetual-futures exchange built from scratch as a distributed system.
An in-memory matching engine owns the book, balances and positions; six
services around it handle persistence, market-data fan-out, the mark-price
oracle, 8-hourly funding settlement, liquidation and the REST API.

`TypeScript` `Bun` `Turborepo` `Redis` `BullMQ` `Postgres` `Prisma` `S3`

</td>
<td width="50%" valign="top">

### [glyph-agent](https://github.com/krishhna24/glyph-agent) · [`npm`](https://www.npmjs.com/package/glyph-agent)

An AI coding agent that lives in your terminal. Streams from any
OpenAI-compatible endpoint, runs an agentic tool-use loop and edits your
codebase from a TUI. Published and installable — `npx glyph-agent`.

`TypeScript` `pnpm` `Turborepo` `Vitest` `MIT`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [100xNess](https://github.com/krishhna24/100xNess)

A trading backend split into API, engine and price-poller services,
communicating over Redis streams and pub/sub. Built in the open across
twelve PRs, with a written day-by-day engineering log.

`TypeScript` `Redis Streams` `Prisma` `Postgres`

</td>
<td width="50%" valign="top">

### [api-rate-limiting](https://github.com/krishhna24/api-rate-limiting) <sub>· wip</sub>

Configurable IP rate-limiting middleware for Express. Memory or Redis
store, per-route policies, burst allowance and proxy-trust. Redis get-set
is Lua-scripted so concurrent requests can't race the counter.

`TypeScript` `Bun` `Express` `Redis` `Lua`

</td>
</tr>
</table>

<sub>Also: <a href="https://github.com/krishhna24/stock-view">stock-view</a> (Next.js market dashboard) ·
<a href="https://github.com/krishhna24/CEX-MatchingEngine-Assignment">CEX matching engine</a> (queue-based RPC) ·
<a href="https://github.com/krishhna24/r2-file-upload-demo">r2-file-upload</a></sub>

<img src="./assets/art/sec-stack.svg" width="100%" alt="Stack" />

<table>
<tr><td><sub>LANGUAGES</sub></td><td><img src="https://skillicons.dev/icons?i=ts,go,cpp,bash&theme=dark" height="38" alt="TypeScript, Go, C++, Bash" /></td></tr>
<tr><td><sub>RUNTIME</sub></td><td><img src="https://skillicons.dev/icons?i=bun,nodejs,pnpm,vite&theme=dark" height="38" alt="Bun, Node.js, pnpm, Vite" /></td></tr>
<tr><td><sub>SERVICES</sub></td><td><img src="https://skillicons.dev/icons?i=express,nextjs,react,prisma&theme=dark" height="38" alt="Express, Next.js, React, Prisma" /></td></tr>
<tr><td><sub>DATA</sub></td><td><img src="https://skillicons.dev/icons?i=redis,postgres,mongodb&theme=dark" height="38" alt="Redis, PostgreSQL, MongoDB" /></td></tr>
<tr><td><sub>INFRA</sub></td><td><img src="https://skillicons.dev/icons?i=docker,kubernetes,aws,cloudflare,linux,githubactions&theme=dark" height="38" alt="Docker, Kubernetes, AWS, Cloudflare, Linux, GitHub Actions" /></td></tr>
<tr><td><sub>LEARNING</sub></td><td><img src="https://skillicons.dev/icons?i=rust&theme=dark" height="38" alt="Rust" /></td></tr>
</table>

<img src="./assets/art/sec-upstream.svg" width="100%" alt="Upstream" />

Most of it is API machinery: migrating validation to declarative markers,
turning on `kube-api-linter` rules group by group, moving controllers to
`AddEventHandlerWithOptions`, and tracking down flaky tests to their cause.

<!-- Regenerated daily by scripts/update-stats.mjs — edit the script, not this block. -->
<!-- STATS:START -->
```text
REPOSITORY                STARS   MERGED  AREAS
kubernetes/kubernetes     125k    13      api-machinery · storage · auth · cli
kubeedge/kubeedge         7.6k    1       edge runtime · image refs
excalidraw/excalidraw     130k    2       editor · svg export

last 12 months   981 contributions   342 commits   49 pull requests
```
<!-- STATS:END -->

<sub>
<a href="https://github.com/kubernetes/kubernetes/pull/140062">storage: migrate CSIDriver volumeLifecycleModes to declarative validation</a> ·
<a href="https://github.com/kubernetes/kubernetes/pull/139890">ipallocator: replace sets.String with sets.Set</a> ·
<a href="https://github.com/kubernetes/kubernetes/pull/139943">volume: use AddEventHandlerWithOptions in protection controllers</a> ·
<a href="https://github.com/kubeedge/kubeedge/pull/6997">imageparser: keep both tag and digest when parsing a reference</a> ·
<a href="https://github.com/excalidraw/excalidraw/pull/11441">excalidraw: fix invisible labelled arrows in exported SVG</a> ·
<a href="https://github.com/krishhna24?tab=overview">all activity →</a>
</sub>

<img src="./assets/art/sec-signal.svg" width="100%" alt="Signal" />

<!-- Generated by scripts/generate-snake.mjs and committed to assets/.
     Nothing external renders this, so it cannot 404 or rate-limit.
     Refresh: GITHUB_TOKEN=... node scripts/generate-snake.mjs -->
<picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/snake-light.svg" />
  <img src="./assets/snake-dark.svg" width="100%" alt="Contribution graph for the last year, eaten by a snake" />
</picture>

<img src="./assets/art/sec-principles.svg" width="100%" alt="How I work" />

**Name what isn't done.** Every project I ship carries a *Known limitations*
section. An unmarked gap is a defect; a documented one is a roadmap.

**Exactness over convenience.** A float in a balance is a bug nobody has
noticed yet.

**Cleanup counts.** Most of my upstream work is linting, test coverage and
flake triage — unglamorous, and the reason the interesting changes land safely.

<img src="./assets/art/sec-elsewhere.svg" width="100%" alt="Elsewhere" />

<a href="https://github.com/krishhna24"><img src="https://img.shields.io/badge/GitHub-krishhna24-30363D?style=flat-square&logo=github&logoColor=white&labelColor=0D1117" alt="GitHub" /></a>
<a href="https://www.linkedin.com/in/krishhna-tupe-974593305/"><img src="https://img.shields.io/badge/LinkedIn-Krishhna%20Tupe-0A66C2?style=flat-square&logo=linkedin&logoColor=white&labelColor=0D1117" alt="LinkedIn" /></a>
<a href="https://x.com/krishhna_dev"><img src="https://img.shields.io/badge/X-@krishhna__dev-2F3439?style=flat-square&logo=x&logoColor=white&labelColor=0D1117" alt="X" /></a>
<a href="mailto:krishhnatupedev@gmail.com"><img src="https://img.shields.io/badge/Email-krishhnatupedev@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white&labelColor=0D1117" alt="Email" /></a>

<br>

<sub><img src="https://komarev.com/ghpvc/?username=krishhna24&style=flat-square&color=30363d&label=profile+views" alt="Profile views" /></sub>

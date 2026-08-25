<!--
  Profile README for github.com/krishhna24
  Accent colour is #d29922 (GitHub dark's amber) — it was chosen to sit with the
  warm palette of assets/JohanLiebert.gif. If you swap the GIF, re-pick the accent.
  The numbers in the "Upstream" section are rewritten daily by .github/workflows/stats.yml.
-->

<table>
<tr>
<td width="62%" valign="top">

# KrishhnaT

**Distributed systems · exchange infrastructure**

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

---

## Now

<!-- Hand-edited — update this when your focus moves. Nothing here is generated. -->

- Graduating declarative validation rules beta → stable in Kubernetes
  ([tracking issue](https://github.com/kubernetes/kubernetes/issues/141532) ·
  [first PR](https://github.com/kubernetes/kubernetes/pull/141533))
- Hardening **perps** — integration coverage and retry/DLQ handling on the event queue
- Enabling the remaining `kube-api-linter` rules across the `batch` and `authorization` groups
- Extending **glyph-agent**'s tool loop

---

## Work

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

---

## Inside `perps`

The piece I'd point at first — a single-writer engine that can lose its
process and come back correct.

```console
$ kubectl get workloads -n perps -o wide

NAME                     ROLE                                        STATE
engine                   in-memory book, balances, positions         source of truth
persistence              EVENT_QUEUE -> postgres read model          projecting
websocket                authenticated pub/sub fan-out               streaming
mark-price-engine        top-of-book -> mark price + funding rate    oracle
liquidation-engine       positions vs. mark price                    watching
funding-rate-scheduler   settles funding every 8h                    cron
server                   REST: auth, balances, orders, depth         serving

$ kubectl describe recovery/engine

  snapshot   S3 every ~3s (LocalStack in dev)
  replay     tail of EVENT_QUEUE since the last snapshot
  money      decimal.js end to end — no floats anywhere
  known      single instance by design; the repo lists what is out of scope
```

---

## Stack

<table>
<tr><td><sub>LANGUAGES</sub></td><td><img src="https://skillicons.dev/icons?i=ts,go,cpp,bash&theme=dark" height="38" alt="TypeScript, Go, C++, Bash" /></td></tr>
<tr><td><sub>RUNTIME</sub></td><td><img src="https://skillicons.dev/icons?i=bun,nodejs,pnpm,vite&theme=dark" height="38" alt="Bun, Node.js, pnpm, Vite" /></td></tr>
<tr><td><sub>SERVICES</sub></td><td><img src="https://skillicons.dev/icons?i=express,nextjs,react,prisma&theme=dark" height="38" alt="Express, Next.js, React, Prisma" /></td></tr>
<tr><td><sub>DATA</sub></td><td><img src="https://skillicons.dev/icons?i=redis,postgres,mongodb&theme=dark" height="38" alt="Redis, PostgreSQL, MongoDB" /></td></tr>
<tr><td><sub>INFRA</sub></td><td><img src="https://skillicons.dev/icons?i=docker,kubernetes,aws,cloudflare,linux,githubactions&theme=dark" height="38" alt="Docker, Kubernetes, AWS, Cloudflare, Linux, GitHub Actions" /></td></tr>
<tr><td><sub>LEARNING</sub></td><td><img src="https://skillicons.dev/icons?i=rust&theme=dark" height="38" alt="Rust" /></td></tr>
</table>

---

## Upstream

Most of it is API machinery: migrating validation to declarative markers,
turning on `kube-api-linter` rules group by group, moving controllers to
`AddEventHandlerWithOptions`, and tracking down flaky tests to their cause.

<!-- Numbers below are regenerated daily by .github/workflows/stats.yml — edit the script, not this block. -->
<!-- STATS:START -->
```text
REPOSITORY                STARS   MERGED  AREAS
kubernetes/kubernetes     125k    13      api-machinery · storage · auth · cli
kubeedge/kubeedge         7.6k    1       edge runtime · image refs
excalidraw/excalidraw     130k    2       editor · svg export

last 12 months   979 contributions   341 commits   49 pull requests
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

---

## Signal

<!-- Generated into this repo's `output` branch by .github/workflows/snake.yml.
     It 404s until that workflow has run once — trigger it from the Actions tab. -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/krishhna24/krishhna24/output/snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/krishhna24/krishhna24/output/snake.svg" />
  <img src="https://raw.githubusercontent.com/krishhna24/krishhna24/output/snake.svg" alt="Contribution graph" width="100%" />
</picture>

<img src="https://ghchart.rshah.org/d29922/krishhna24" alt="krishhna24's contribution chart" width="100%" />

---

## How I work

**Name what isn't done.** Every project I ship carries a *Known limitations*
section. An unmarked gap is a defect; a documented one is a roadmap.

**Exactness over convenience.** A float in a balance is a bug nobody has
noticed yet.

**Cleanup counts.** Most of my upstream work is linting, test coverage and
flake triage — unglamorous, and the reason the interesting changes land safely.

---

## Elsewhere

<a href="https://github.com/krishhna24"><img src="https://img.shields.io/badge/GitHub-krishhna24-C9D1D9?style=flat-square&logo=github&logoColor=white&labelColor=0D1117" alt="GitHub" /></a>
<a href="https://www.linkedin.com/in/krishhna-tupe-974593305/"><img src="https://img.shields.io/badge/LinkedIn-Krishhna%20Tupe-C9D1D9?style=flat-square&logo=linkedin&logoColor=white&labelColor=0D1117" alt="LinkedIn" /></a>
<a href="https://x.com/krishhna_dev"><img src="https://img.shields.io/badge/X-@krishhna__dev-C9D1D9?style=flat-square&logo=x&logoColor=white&labelColor=0D1117" alt="X" /></a>
<a href="mailto:krishhnatupedev@gmail.com"><img src="https://img.shields.io/badge/Email-krishhnatupedev@gmail.com-C9D1D9?style=flat-square&logo=gmail&logoColor=white&labelColor=0D1117" alt="Email" /></a>

<br>

<sub><img src="https://komarev.com/ghpvc/?username=krishhna24&style=flat-square&color=30363d&label=profile+views" alt="Profile views" /></sub>

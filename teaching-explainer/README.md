# teaching-explainer

A Claude Code skill that builds polished, accessible, single-page interactive teaching
explainers — lessons, class activities, or educational walkthroughs — for any subject and any
course. It runs a seven-phase process (Phase 0 scope, Phase 1 architecture, Phase 2 visual
design, Phase 3 build, Phase 4 quality loop, Phase 5 pedagogy + accessibility QA gate,
Phase 6 revise) with an enforced evidence-based pedagogy spine: active interactions by
default, spaced retrieval checks with instructional why-feedback, WCAG 2.2 AA accessibility
by construction, and an organizing structure fit to the content rather than forced onto it.

---

## Install

Copy or symlink the `teaching-explainer/` directory into your Claude Code skills folder:

```bash
# macOS / Linux — symlink (preferred; picks up edits in place)
ln -s /path/to/html-pedagogy/teaching-explainer ~/.claude/skills/teaching-explainer

# macOS / Linux — copy
cp -r /path/to/html-pedagogy/teaching-explainer ~/.claude/skills/teaching-explainer

# Windows (PowerShell, run as Administrator) — junction
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\skills\teaching-explainer" `
         -Target "<path-to-repo>\html-pedagogy\teaching-explainer"
```

The skill is then invoked like any other skill — trigger phrases include:
"make a lesson / interactive explainer for my class," "turn this topic into a teaching page,"
"create a class activity / interactive reading," or "build something students can work through
before/after lecture."

---

## Standalone — html-explainer is optional

`teaching-explainer` is **fully self-contained**. Nothing else needs to be installed. Its visual
design bar and quality loop live in [`references/visual-and-quality.md`](references/visual-and-quality.md)
(adapted from html-explainer's Phase 2/4 under the MIT License — see
[`THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md)); its pedagogy spine, component kit,
accessibility gate, and edit overlay are its own. Every explainer it builds is a single
self-contained `.html` file with all kit CSS/JS inlined.

It was **inspired by** [`html-explainer`](https://github.com/ds-vibe/html-explainer) by Derek
Schwede (credited below) — a separate skill you do **not** need to install. If you already use it,
it's compatible: the skill will happily use its fuller Phase 2/4 guidance and its
`scripts/assemble.mjs` / `scripts/shoot.mjs` helpers when present. That's a convenience, never a
requirement, and nothing about a generated explainer depends on it.

---

## What's ours (and what's optional)

Everything that determines an explainer's quality or correctness ships in this skill. Only optional
conveniences come from `html-explainer`.

| | Item | Notes |
|---|---|---|
| **OURS** | Pedagogy spine (7 rules, Phase 0–6 process) | `SKILL.md` — the core of the skill |
| **ADAPTED (MIT)** | Visual bar + quality loop | `references/visual-and-quality.md` — adapted from html-explainer's Phase 2/4; see `THIRD-PARTY-NOTICES.md` |
| **OURS** | Component kit (`assets/components.{css,js}`) | predict-reveal, retrieval-mc, self-explain, classify, step-through |
| **OURS** | Accessibility enforcement (`references/accessibility.md`, Phase 5 gate) | WCAG 2.2 AA, by-construction + verified |
| **OURS** | Instructor-framework intake (`references/instructor-framework.md`) | Elicitation, structure decision guidance, worked examples |
| **OURS** | Review-mode overlay (`assets/review-mode.js`) | A11y-hardened, owned outright |
| **OPTIONAL** | html-explainer Phase 2 / Phase 4 | Fuller visual + quality guidance; used only if it's installed |
| **OPTIONAL** | `scripts/assemble.mjs` / `scripts/shoot.mjs` | Assembler + screenshot helpers; used only if installed |

Because we don't depend on `html-explainer`, there is nothing to re-sync when it changes. If you
do run it, its improvements are simply available to draw on.

---

## Running the kit tests

Tests live at repo root (`test/`), not inside the skill package. From the repo root:

```bash
npm install
```

> If `npm install` fails with an error about a minimum release age policy (an `.npmrc`
> `min-release-age` setting), retry with:
> ```bash
> npm install --min-release-age=0
> ```

Then install the Playwright browser:

```bash
npx playwright install chromium
```

Then run the full suite:

```bash
npm test
```

The suite runs Playwright + axe-core and covers the automated half of the Phase 5 accessibility
gate. The manual half (keyboard walkthrough, live-region quality, reduced-motion check, etc.)
is documented in `references/accessibility.md` §5.

---

## Component quick reference — `data-te` contracts

All five kit components are initialized by `assets/components.js` automatically on
`DOMContentLoaded`. Add `data-te="<name>"` to the container element. Each component is
keyboard-operable, screen-reader-announced via its own ARIA live region (applied by the kit
during init — no author markup required), `prefers-reduced-motion`-aware, and enforces
≥24×24 px targets via design tokens.

`predict-reveal` and `self-explain` announce through the global `#te-live` region.
`retrieval-mc`, `classify`, and `step-through` use their own feedback/progress element as the
live region (the kit sets `role="status"` and `aria-live="polite"` on those elements during
init, so the guarantee holds even if the author omits those attributes from markup).

| Component | `data-te` value | Required interior elements | Key attributes |
|---|---|---|---|
| Predict-then-reveal | `predict-reveal` | `.te-pr-reveal` (button), `.te-pr-answer` (hidden answer) | — |
| Multiple-choice retrieval check | `retrieval-mc` | `input[type="radio"]` options, `.te-mc-check` (button), `.te-mc-feedback` | `data-answer` (correct radio value), `data-why` (explanation text). Kit sets `role="status" aria-live="polite"` on `.te-mc-feedback` during init. |
| Self-explain → model answer | `self-explain` | `.te-se-input` (textarea), `.te-se-reveal` (button), `.te-se-model` (hidden model answer) | — |
| Classify / sort | `classify` | `.te-cl-item` elements (items to sort), `.te-cl-cat` elements (target categories), `.te-cl-feedback` | `data-cat` on each item and each category (matching value = correct placement). Kit sets `role="status" aria-live="polite"` on `.te-cl-feedback` during init. |
| Step-through / sequence-builder | `step-through` | `.te-st-step` elements (one per step), `.te-st-progress`, `.te-st-prev` (button), `.te-st-next` (button) | Kit sets `role="status" aria-live="polite"` on `.te-st-progress` during init. |

### Review overlay

`assets/review-mode.js` is our a11y-hardened copy of the edit overlay, owned outright.

- **Activate:** `?edit` in the URL auto-opens the dialog immediately. `<body data-review-toggle>` makes the "Review & edit" launcher button visible on the page (click it to open). Precedence: when `data-review-toggle` is present, the launcher is shown and `?edit` does not additionally auto-open — click the launcher to open the dialog instead.
- **Controls:** Preview / Edit text / Add note / Download edits / Copy notes for LLM.
- **Score tally:** add a `[data-te-tally]` element anywhere on the page to display a running
  correct/total tally across all `retrieval-mc` components.

The optional `assemble.mjs` / `shoot.mjs` scripts and the `chat-dock.js` Q&A widget belong to
`html-explainer`. If you use it, see its *Drop-in widgets* and Phase 3 sections for their docs —
none of them are required by this skill.

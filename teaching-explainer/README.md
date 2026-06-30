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

## Soft dependency — html-explainer

`teaching-explainer` is designed to run alongside the `html-explainer` skill. Install both:

```bash
ln -s /path/to/html-explainer ~/.claude/skills/html-explainer
```

When `html-explainer` is present, Phases 2 and 4 reference its visual design system and
quality loop directly, and the build pipeline uses its helper scripts:

- `~/.claude/skills/html-explainer/scripts/assemble.mjs` — injects `review-mode.js` (and
  optionally `chat-dock.js`), validates unique IDs, flags escaping issues.
- `~/.claude/skills/html-explainer/scripts/shoot.mjs` — screenshot loop for visual QA.

**If `html-explainer` is not installed,** the skill degrades gracefully:

- Logs the missing dependency in build output.
- Inlines `assets/components.css`, `assets/components.js`, and `assets/review-mode.js`
  directly into the output file (all are self-contained; no bundler needed).
- Applies Phase 2 and Phase 4 principles from their written descriptions in `SKILL.md` rather
  than deferring to `html-explainer`'s phases.
- Skips `assemble.mjs` / `shoot.mjs`; delivers the raw assembled file instead.

The pedagogy spine, component kit, and accessibility gate are entirely ours and are unaffected
by whether `html-explainer` is installed.

---

## Referenced vs. owned — sync table

This skill deliberately references `html-explainer` rather than copying from it. The
maintenance burden is proportional to the amount copied — and we copied almost nothing.

| | Item | Notes |
|---|---|---|
| **REFERENCED** | html-explainer Phase 2 — visual design system | Pointed to, not duplicated; we add `assets/components.css` on top |
| **REFERENCED** | html-explainer Phase 4 — quality loop + pre-flight checklist | Run in full; our Phase 4 layers pedagogy checks on top |
| **REFERENCED** | `scripts/assemble.mjs` | Called from html-explainer's install path; we do not maintain it |
| **REFERENCED** | `scripts/shoot.mjs` | Same — called from html-explainer; not ours to maintain |
| **OWNED** | Pedagogy spine (7 rules, Phase 0–6 process) | `SKILL.md`; the core of what makes this skill distinct |
| **OWNED** | Component kit (`assets/components.{css,js}`) | predict-reveal, retrieval-mc, self-explain, classify, step-through |
| **OWNED** | Accessibility enforcement (`references/accessibility.md`, Phase 5 gate) | WCAG 2.2 AA, by-construction + verified |
| **OWNED** | Instructor-framework intake (`references/instructor-framework.md`) | Elicitation questions, structure decision tree, worked examples |
| **OWNED** | Review-mode overlay (`assets/review-mode.js`) | A11y-hardened copy we control outright |

**Maintenance rule:** sync burden ≈ copied surface; we copied ~none.

If `html-explainer` updates its Phase 2 or Phase 4, this skill benefits automatically
with zero re-sync work. The only things that need attention when `html-explainer` changes are
the handful of script invocations in `SKILL.md`'s Phase 3 — and those are call signatures,
not reimplementations.

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

For full `assemble.mjs` and `shoot.mjs` documentation and the drop-in widget API (including
`chat-dock.js` for built-in Q&A), see `html-explainer`'s *Drop-in widgets* and Phase 3
sections.

---
name: teaching-explainer
description: Build a polished, accessible, single-page interactive teaching explainer — a lesson, class activity, or educational walkthrough — for any subject and any course. Use when an instructor wants to make an active lesson page, interactive explainer, teaching activity, or classroom handout that students can work through on their own or in class — emphasizing evidence-based pedagogy (constructive interactions, spaced retrieval, no decorative noise), WCAG 2.2 AA accessibility by construction, and an organizing structure fit to the content rather than forced onto it. Triggers on requests like "make a lesson / interactive explainer for my class," "turn this topic into a teaching page," "create a class activity / interactive reading," "build something students can work through before/after lecture," or "make an interactive explainer for [law / science / history / any course]."
---

# Teaching Explainer

Build interactive teaching pages that make students do the thinking, not just read.
Output is a single portable `.html` file — self-contained, offline-capable, LMS-embeddable,
FERPA-safe (nothing leaves the browser).

This skill is a **process**, not a template. Quality comes from the loop, not from filling in
blanks. What matters most:

1. **Pedagogy first** — the organizing structure, the interactions, and the feedback are all
   derived from the evidence base in `references/pedagogy.md`. Active engagement, spaced
   retrieval, and instructional feedback are defaults, not options.
2. **Structure fit to content, never forced** — a process framework, a conceptual mental model,
   or a plain logical sequence is chosen to match what the content actually is. See
   `references/instructor-framework.md` for how to surface the structure that is already latent
   in how the instructor teaches the topic.
3. **Accessible by construction** — the component kit (`assets/components.{css,js}`) implements
   WCAG 2.2 AA mechanics for every interactive element. The QA gate in Phase 5 verifies both
   the automated and the manual checklist from `references/accessibility.md`.
4. **Referencing discipline** — this skill owns pedagogy, components, and accessibility. It
   delegates build craft (visual system, quality loop, helper scripts) to `html-explainer`.
   Reference, don't copy.

---

## Soft dependency — html-explainer

This skill is designed to run alongside the `html-explainer` skill. When `html-explainer` is
installed, Phases 2–4 reference its Phase 2 visual system and Phase 4 quality loop directly,
and the build uses its `scripts/assemble.mjs` and `scripts/shoot.mjs` helper scripts.

If `html-explainer` is not installed, the skill degrades gracefully:

- Note the missing dependency in the build output.
- Inline `assets/components.css`, `assets/components.js`, and `assets/review-mode.js` directly
  into the output file (already self-contained JS/CSS; no bundler needed).
- Apply Phase 2 and Phase 4 principles from their written descriptions here rather than
  deferring to html-explainer's phases.
- Skip the `assemble.mjs` / `shoot.mjs` step; instead, deliver the raw assembled file.

The amount that degrades is small. The pedagogy spine, component kit, and accessibility gate
are entirely ours and are unaffected.

---

> **STOP — do Phase 0 before writing any HTML or running any research.** Your FIRST response
> to a build request must be the Phase 0 scoping interview. Cover all axes in one consolidated
> message (or as option menus where the environment supports them). Do not start building or
> searching until the instructor has answered. Quietly defaulting the organizing structure or
> the mode is the most common reason a generated explainer misses the instructor's actual goal.

---

## Phase 0 — Scope, ground, research

*Built on html-explainer's Phase 0 (its scoping interview + settled/dynamic research gate),
adapted to be pedagogy-first.*

### The interview — ask all six axes, in one message

Present each as a clickable option menu where the environment supports it; otherwise list all
six in one consolidated message. Recommend the default for each axis; cover all six without
collapsing or substituting.

**Axis 1 — Grounding.** Does the instructor have their own materials to ground the explainer
in — slides, a PDF, lecture notes, a statute, a URL, case text? If yes, treat those materials
as the **primary source of truth**. Ask as: "Do you have your own materials to ground in?"
with options "No — research/build from scratch" and "Yes — I'll provide them." The
settled/dynamic research gate (below) handles the research decision separately and is invisible
to the instructor.

**Axis 2 — Organizing structure.** What is the throughline? This is the most important axis
and must not be skipped or defaulted. Three options; none is forced:
- **(a) Process framework** — a replicable, named procedure the learner will execute (e.g.,
  a legal-research workflow, an AI-prompting framework, a statutory-analysis sequence). Use
  when the instructor's goal is that students can *do* something in a fixed order.
- **(b) Conceptual mental model** — a way of thinking about how something works: a taxonomy,
  a set of key distinctions, a causal structure, a relational map. Use for doctrinal topics
  where the goal is comprehension, not procedure execution.
- **(c) Plain logical sequence** — a straightforward ordering by dependency, for content that
  is genuinely context or vocabulary with no deeper structure. The fallback, not the default.

Ask: "Tell me about this topic the way you'd explain it to students at the start of class —
what do they need to walk away able to do or understand?" Then listen for signals that reveal
which structure is already latent. If the instructor has no explicit structure, co-develop one
using the elicitation questions in `references/instructor-framework.md`. **Never impose a
structure the instructor doesn't recognize as their own.** Confirm fit before proceeding.

**Axis 3 — Audience and depth.** Who is this for, and how much do they already know? Newcomer
to the topic / students who have had an intro / both layered? How long should it run (quick
~5 min / standard ~10–15 min / comprehensive)?

**Axis 4 — Mode.** Async (default) or in-class? Async means fully self-contained: every
interaction gives its own "why" feedback immediately. In-class means reveals can be withheld
so the instructor asks the room first; projection-friendly type; optional "reveal all" control.
Recommend async as the default.

**Axis 5 — Spine elements.** All are on by default. Flag any the instructor wants to skip
and log the override explicitly (see Phase 5). The defaults:
- ≥1 constructive interaction per key concept (predict-reveal, self-explain, classify, or
  predictive step-through)
- ≥2 spaced retrieval checks with why-feedback and retry, distributed across the page
- Coherence: no decorative visuals or animation
- Conversational prose, words paired with relevant structural visuals
- Feedback that teaches, not just evaluates
- No learning-styles profiling; UDL multi-representation for all learners

**Axis 6 — AI chat.** Should the explainer include a built-in Q&A chat dock? This is an open
yes/no — no recommended default, no quiet assumption. Ask genuinely. (If yes, the build uses
`chat-dock.js` from html-explainer in BYOK single-file mode, or a server route for a managed
key — see html-explainer's *Drop-in widgets* section.)

### The settled/dynamic research gate

Before researching anything, ask: is this topic **settled** or **possibly dynamic**?

- **Settled** — stable, well-understood, and your training data is authoritative. No research
  needed; go straight to Phase 1. Examples: the rule against hearsay, how Boolean search works,
  the structure of the U.S. federal court system, foundational contract-law doctrine.
- **Possibly dynamic** — involves anything that changes: platform features, recent case law,
  pending legislation, vendor capabilities, anything post-cutoff, or a niche area where
  training data may be incomplete. Research before building.

**Cap research at 2–3 fetches.** One authoritative primary source plus at most one or two
cross-checks. Stop there. Collect a source list as you go; every non-obvious claim must be
traceable. Dynamic topics get visible date-stamps in the UI ("as of [date] — verify against
current sources").

---

## Phase 1 — Learning architecture

*Choose structure, order sections, place interactions — before any HTML.*

### Choose and confirm the organizing structure

Return to what emerged in Phase 0 Axis 2. If the instructor confirmed a process framework,
the sections follow the steps. If a conceptual mental model, sections follow the concept's
own dependency and contrast logic. If a plain logical sequence, sections follow content
dependency. See `references/instructor-framework.md` — especially the decision tree ("Does
the instructor have an explicit process framework?") and the section-order mapping — for the
full procedure.

The organizing structure must be confirmed with the instructor before you sequence the
sections. If you have any doubt about fit, re-ask rather than guess. A forced structure that
the instructor doesn't recognize is actively harmful — it adds cognitive overhead and creates
seams where the content doesn't fit the frame.

### Map concept dependencies and order sections

Which concepts must the learner understand before the next one makes sense? Order sections so
each assumes only what earlier ones taught. Signpost the path when it helps the learner orient
("Part 1 of 3"). Never print "depends on:" labels on the page — those expose the scaffolding
without serving the learner.

### Place the constructive interactions and retrieval checks

Work through each concept section and assign at least one interaction from the kit. The
evidence basis for these placements is in `references/pedagogy.md` (Rules 2, 3, and the ICAP
Quick Reference).

**Constructive interactions (≥1 per key concept):** `predict-reveal` — learner predicts an
answer before the reveal; `self-explain` — learner writes in their own words, then compares
to a model answer; `classify` — learner sorts items into categories; a predictive
`step-through` — learner predicts the next step before it advances. A click-to-reveal with
no generative prompt does not satisfy this rule. See `references/pedagogy.md` Rule 2.

**Spaced retrieval checks (≥2, distributed):** `retrieval-mc` — multiple-choice with
immediate why-feedback and a retry path. Place at least one intervening concept section
between checks; do not stack them at the end. Each must explain *why* the correct answer is
correct — bare right/wrong is insufficient. See `references/pedagogy.md` Rule 3.

**Bespoke interactions are welcome.** The kit is a starting set, not a straitjacket. A custom
interaction built for the content is encouraged, provided it clears the same accessibility and
pedagogy bar (constructive mode; instructional feedback). The Phase 5 QA gate checks the bar,
not the presence of any specific widget.

Sketch the section order and the interaction placement before building. IA is the biggest
quality lever. Reorder freely at this stage — it costs nothing here and everything later.

---

## Phase 2 — Visual design system

*Follow html-explainer's Phase 2 in full.* Its Phase 2 is the source of truth for what good
visual design looks like, including: the quality bar (professionally edited, purposeful,
restrained); the anti-slop checklist (no emoji as icons, no decorative gradients, no bento
grids, no generic SaaS texture); variety with rhythm; typography and space; horizontal use of
the page; motion with purpose; and contrast per surface.

Assemble with our kit by including `assets/components.css` (our interaction styles and design
tokens) alongside your bespoke page CSS. All design tokens (color, spacing, type scale) go
in `:root` CSS variables. The component kit uses these tokens; custom themes inherit them
automatically. Do not scatter magic numbers.

---

## Phase 3 — Build

*Follow html-explainer's Phase 3.* The deliverable is a real `.html` file, never pasted into
chat. Write the raw page content — bespoke HTML, CSS, and JS — without inlining
`assets/review-mode.js` or `chat-dock.js`. Then assemble:

```
node ~/.claude/skills/html-explainer/scripts/assemble.mjs <raw-file.html> [--chat] -o <output.html>
```

The assembler injects `review-mode.js` (and optionally `chat-dock.js`), validates unique IDs,
and flags escaping issues. Include `<body data-review-toggle>` so the Review & edit launcher
appears by default.

**Component kit quick reference — `data-te` contracts:**

All five kit components are initialized by `assets/components.js` automatically on
`DOMContentLoaded`. Add `data-te="<name>"` to the container element. Each component is
keyboard-operable, screen-reader-announced via ARIA live region (`#te-live`),
`prefers-reduced-motion`-aware, and enforces ≥24×24 px targets via design tokens.

| Component | `data-te` value | Required interior elements | Key attributes |
|---|---|---|---|
| Predict-then-reveal | `predict-reveal` | `.te-pr-reveal` (button), `.te-pr-answer` (hidden answer) | — |
| Multiple-choice retrieval check | `retrieval-mc` | `input[type="radio"]` options, `.te-mc-check` (button), `.te-mc-feedback` | `data-answer` (correct radio value), `data-why` (explanation text) |
| Self-explain → model answer | `self-explain` | `.te-se-input` (textarea), `.te-se-reveal` (button), `.te-se-model` (hidden model answer) | — |
| Classify / sort | `classify` | `.te-cl-item` elements (items to sort), `.te-cl-cat` elements (target categories), `.te-cl-feedback` | `data-cat` on each item and each category (matching value = correct placement) |
| Step-through / sequence-builder | `step-through` | `.te-st-step` elements (one per step), `.te-st-progress`, `.te-st-prev` (button), `.te-st-next` (button) | — |

`review-mode.js` (`assets/review-mode.js`) is our a11y-hardened copy of the edit overlay,
owned outright. Activated by `?edit` query parameter or `<body data-review-toggle>`. Provides
Preview / Edit text / Add note / Download edits / Copy notes for LLM. A running tally of
retrieval check scores is available by adding a `[data-te-tally]` element anywhere on the
page.

For the full `assemble.mjs` and `shoot.mjs` documentation and the drop-in widget API,
see html-explainer's *Drop-in widgets* and Phase 3 sections.

---

## Phase 4 — Quality loop

*Follow html-explainer's Phase 4 in full* — especially its mandatory Step 0 static pre-flight
checklist and the screenshot-before-done rule using `scripts/shoot.mjs`. Every item on
html-explainer's pre-flight list applies here without exception.

In addition, before declaring done, run a quick pedagogy pre-flight layered on top:

- [ ] Every concept section has at least one constructive interaction (predict-reveal,
      self-explain, classify, or predictive step-through) — not just a click-to-reveal.
- [ ] At least two `retrieval-mc` components are placed, distributed across the page (not all
      at the end), each with `data-why` text that teaches.
- [ ] Every interactive widget's feedback text is instructional prose, not praise language.
- [ ] No decorative imagery, gratuitous animation, or ornamental text that doesn't carry
      instructional meaning.
- [ ] Mode is correctly implemented: async (feedback fires immediately) or in-class (reveals
      held; instructor-controlled; projection-friendly).

---

## Phase 5 — Pedagogy + accessibility QA gate

**This gate must pass before the explainer is "done." No exceptions.**

It is layered on top of html-explainer's Phase 5 verify-and-ship step. Run it after the
screenshot loop confirms no visual bugs.

### Pedagogy gate

Check each item. Log any overrides explicitly (in build output and in the explainer's HTML
source as a comment):

- [ ] **Organizing structure confirmed with instructor** — not imposed; the instructor
      recognized it as their own.
- [ ] **≥1 constructive interaction per key concept** — predict-reveal, self-explain,
      classify, or a predictive step-through. Step-through with no prediction prompt does not
      count. (`references/pedagogy.md` Rule 2)
- [ ] **≥2 spaced retrieval checks** — `retrieval-mc` components distributed across the page;
      at least one intervening section between checks. (`references/pedagogy.md` Rule 3)
- [ ] **Each retrieval check has `data-why` text** — the explanation of the correct answer,
      in instructional prose. (`references/pedagogy.md` Rule 6)
- [ ] **Retry path is functional** — incorrect answers allow re-attempt.
- [ ] **No decorative elements** — no ornamental stock imagery, no purely aesthetic
      animations, no background textures, no icon sets that don't carry instructional meaning.
      (`references/pedagogy.md` Rule 4)
- [ ] **No learning-styles adaptation** — no UI for learners to select a style; no branching
      on inferred style. Multiple representations (prose + visual + interaction) are offered
      to all learners by default. (`references/pedagogy.md` Rule 7)
- [ ] **All sources cited** — every non-obvious claim is traceable to a cited source; dynamic
      content is date-stamped.
- [ ] **Overrides documented** — any spine element skipped at instructor request is logged
      with the reason (e.g., "Skipping 2nd retrieval check at instructor request — topic too
      short").

### Accessibility gate

Run `npm test` first. That runs Playwright + axe-core and clears the automated half. Then
complete the manual half. Full checklist in `references/accessibility.md` §5 — copy it into
your QA notes and check every item.

Automated (`npm test` / axe-core):

- [ ] `[auto]` 1.1.1 — alt present on all non-text content
- [ ] `[auto]` 1.4.3 — text contrast ≥ 4.5:1 body, ≥ 3:1 large text
- [ ] `[auto]` 1.4.11 — UI component contrast ≥ 3:1
- [ ] `[auto]` 2.1.1 / 2.1.2 — interactive elements have proper roles/tabindex; no trap
      (attribute check)
- [ ] `[auto]` 2.4.3 / 2.4.7 / 2.4.11 — focus order in DOM; visible focus; not fully
      obscured
- [ ] `[auto]` 2.5.3 / 2.5.8 — accessible names contain visible label; kit components
      ≥24×24 px
- [ ] `[auto]` 3.1.1 — `<html lang="...">` set
- [ ] `[auto]` 4.1.2 / 4.1.3 — ARIA roles, names, states correct; feedback in live region
- [ ] `[auto]` 200% zoom — no content clipped (1.4.4, 1.4.12)

Manual (human review required — axe cannot catch these):

- [ ] `[manual]` Full keyboard walkthrough — every interaction activatable without a mouse;
      no trap; tab order matches reading order
- [ ] `[manual]` 2.5.7 — click/keyboard non-drag path actually completes the classify task
- [ ] `[manual]` 2.5.8 — any custom/per-explainer components measured ≥24×24 px
- [ ] `[manual]` 1.1.1 — alt text conveys instructional meaning (not redundant, not filename)
- [ ] `[manual]` 4.1.3 — each live-region announcement is self-contained and meaningful
      without visual context
- [ ] `[manual]` 1.4.3 — any custom per-explainer colors verified with a contrast tool
- [ ] `[manual]` Focus after answer — newly injected feedback does not strand or kidnap focus
- [ ] `[manual]` Reduced motion — animations suppressed under `prefers-reduced-motion`
- [ ] `[manual]` New bespoke components clear the same keyboard + ARIA + target-size +
      contrast bar as kit components

For background on each criterion and what to check in an explainer, see
`references/accessibility.md` §2 and the manual-checks explanation in §4.

---

## Phase 6 — Revise

Via the Review & edit overlay (`review-mode.js`). The instructor or a reviewer opens the
assembled file, clicks "Review & edit" (or appends `?edit` to the URL), and leaves edits
or notes in-place. "Copy notes for LLM" exports a revision brief.

Apply the revision brief to the **raw source file**, re-run `assemble.mjs`, and then re-run
the full Phase 5 QA gate. Do not patch the assembled output directly.

**Any change to interactions, feedback text, or spine elements requires re-running the
pedagogy gate.** Any visual change requires re-running the screenshot loop (a token swap can
break contrast or legibility). Declare a revision done only after both gates pass and you have
seen the screenshots.

Expect at least one round of revisions. Treat v1 as a draft to react to.

---

## Modes

### Async (default)

Every interaction provides its own "why" feedback immediately on response. The learner works
through the explainer at their own pace with no instructor present. Retrieval checks fire
instant right/wrong + explanation + retry. Self-explain reveals the model answer on demand.
Predict-reveal fires the answer on click.

This is fully self-contained — no instructor needed to operate the page.

### In-class

A flag, not a rewrite. Same file; same components. Differences:

- **Reveals withheld by default.** Predict-reveal and classify components start with reveals
  held; the instructor clicks "Reveal" after asking the room. (Set `data-te-hold-reveal` on
  the component container.)
- **Projection-friendly type.** Larger base font size (recommend ≥18px base); high-contrast
  palette; minimal peripheral chrome.
- **Optional "Reveal all" control.** A single button the instructor can use to fire all
  held reveals at once at the end of a discussion.
- **Retrieval checks.** Can be run synchronously (all students answer, instructor reveals);
  polling is out of scope for v1 (no backend, no FERPA exposure).

In-class mode is lightweight for v1. A class that needs a full live-polling or LMS-gradebook
integration is out of scope; the output is purely self-check and nothing leaves the browser.

---

## References (do not duplicate — link to these)

- `references/pedagogy.md` — the evidence base as enforceable rules: the 7-rule spine,
  yield-ranked multimedia principles, ICAP quick reference, retrieval practice rules, the
  learning-styles guardrail, and honesty notes where evidence is thin.
- `references/accessibility.md` — WCAG 2.2 AA criteria for interactive explainers, what the
  component kit guarantees, what axe-core cannot catch, and the full Phase-5 checklist.
- `references/instructor-framework.md` — the three kinds of organizing structure, Phase-0
  elicitation questions, the "never force it" rule, section-order mapping, and two worked
  examples (legal research process framework; hearsay conceptual mental model).
- `html-explainer` SKILL.md — Phase 2 (visual design system), Phase 4 (quality loop and
  pre-flight checklist), Phase 5 (verify and ship), and the `scripts/assemble.mjs` /
  `scripts/shoot.mjs` helper scripts. This skill owns pedagogy, components, and accessibility;
  html-explainer owns build craft. Reference, don't copy.

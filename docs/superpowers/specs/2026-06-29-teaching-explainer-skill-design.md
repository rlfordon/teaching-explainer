# Design Spec — `teaching-explainer` skill

*Date: 2026-06-29 · Status: approved design, pre-implementation*

## 1. Purpose

A process skill that generates a single, portable, accessible `.html` explainer for a class
topic that is **active by construction** — organized around an instructor-supplied process
framework, carrying an enforced evidence-based pedagogy spine, and conforming to WCAG 2.2
Level AA. It reuses the existing `html-explainer` skill for generic build craft (visual
system, quality loop, helper scripts) rather than reimplementing it.

Built for the author (a law professor teaching legal research and legal technology) and
technical colleagues, but deliberately **subject-agnostic** so it works for any course and
any instructor's process model.

The evidence base behind every pedagogical decision is documented in
[`research/pedagogy-evidence-base.md`](../../../research/pedagogy-evidence-base.md).

## 2. Goals and non-goals

**Goals**
- Generate explainers that are active (not passive), accessible, and source-grounded.
- Enforce evidence-based pedagogy by default, with explicit per-explainer overrides.
- Stay low-maintenance by *referencing* `html-explainer`'s generic craft, not copying it.
- Ship a real first exemplar (AI prompting) that doubles as a dogfood test and a teaching asset.

**Non-goals (v1)**
- No backend, no server, no LMS gradebook integration (SCORM/xAPI/LTI). Output is purely
  self-check; nothing leaves the student's browser. (Sidesteps FERPA entirely.)
- No learner profiling / "learning styles" adaptation — deliberately excluded (see §4, guardrail).
- No library of many exemplars in v1 — one exemplar (AI prompting) only.

## 3. Key decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Architecture | **C — fork-and-specialize with referencing discipline** | Keeps html-explainer's proven build craft; owns only pedagogy/a11y/components; lowest sync burden of the options considered |
| Users | Author + technical colleagues | Clean packaging + docs, but may assume Claude Code / skill install |
| Output | Single portable `.html`, purely self-check | Works offline, in any LMS, emailable; no FERPA exposure |
| Pedagogy stance | Opinionated by default, explicit overrides | Matches evidence-based values; prevents "pretty but passive" output |
| Subject scope | Subject-agnostic; organizing structure (framework / model / sequence) fit to content, never forced | Works for legal research, the author's AI class, and doctrinal courses with no step-by-step process |
| Modes | Async (default) + lightweight in-class | Async needs self-contained feedback; in-class is a flag, not a rewrite |
| Edit overlay | Keep `review-mode.js`, a11y-hardened copy we own | Author values the in-page revise loop; original is only lightly accessible |
| Relationship to html-explainer | Soft dependency; reference, don't copy | Auto-benefits from upstream improvements; near-zero re-sync surface |

## 4. The enforced pedagogy spine

Every generated explainer must satisfy these unless explicitly overridden per explainer. Each
maps to a finding in the evidence base.

1. **A clear organizing structure, fit to the content — not necessarily a process framework.**
   The explainer needs *one* coherent throughline, which may be: (a) an instructor's **process
   framework** (the author's AI-prompting framework, Watson/Drake for legal research); (b) a
   **conceptual mental model** (common for doctrinal topics that have no step-by-step process for
   approaching an issue); or (c) a **plain logical sequence**. The skill picks the kind that fits
   and **never forces a framework where the content has none** — a leaky or forced structure is
   worse than none (see the evidence base on not forcing mental models). A process framework is
   offered and used *when it genuinely fits and the instructor wants it* (including to teach a
   specific skill), but it is never mandatory and is not always the right organizing choice even
   when one exists.
2. **≥1 Constructive interaction per key concept** — predict-then-reveal, self-explanation,
   generate, or classify. Not mere click-to-reveal (that is only "Active"). The ICAP lever.
3. **≥2 *spaced* retrieval checks**, distributed through the page (not one end quiz), each with
   instant right/wrong + a one-line **why** + retry. (Testing effect; repeated-retrieval finding.)
4. **Coherence / cut decoration** — no ornamental visuals or motion; every visual carries
   instructional meaning. (Highest-yield Mayer principle, g≈1.0.)
5. **Conversational, plain-language prose** + **words paired with a relevant structural visual**
   for any structured concept. (Personalization + multimedia principles.)
6. **Every interaction's feedback teaches** — the *why*, not just a score. (Formative-assessment
   framing; ABA Standard 314 spirit.)
7. **Guardrail — no "learning styles."** Never profile a learner as visual/kinesthetic and adapt
   (debunked: meshing hypothesis refuted, Pashler et al. 2008). Use **UDL multiple-means-of-
   representation** instead — same idea in more than one form for *everyone*.

Enforcement is mechanical: a Phase-5 QA gate (§7) that must pass before "done." Overrides are
explicit and logged in the build output (e.g., "Skipping 2nd retrieval check at instructor request").

## 5. Accessibility model (WCAG 2.2 AA, by construction)

Accessibility is built into the component kit so output is correct by construction, then verified
by the QA gate. Concrete enforced targets:

- Semantic HTML; full **keyboard operability** (2.1.1); **visible focus** (2.4.7).
- **Text alternatives** for every visual (1.1.1).
- **Target size ≥24×24 CSS px** (2.5.8); **drag alternatives** for any sort/classify (2.5.7).
- Contrast ≥4.5:1 body / ≥3:1 large, verified **per surface** (not eyeballed).
- Respects `prefers-reduced-motion`; **ARIA live regions** so feedback is announced to screen readers.

UDL is the pedagogical-accessibility frame (the *why* behind multi-representation), carried with
the honest caveat that UDL's measured efficacy is contested — used to structure choices, not as a
proven-gains claim.

## 6. Architecture and file layout

```
teaching-explainer/
  SKILL.md                     # the process: pedagogy-first Phase 0–6
  README.md                    # install, soft-dependency note, "referenced vs owned" sync notes
  references/
    pedagogy.md                # evidence base → actionable, enforceable rules
    accessibility.md           # WCAG 2.2 AA checklist for interactive educational content
    instructor-framework.md    # how a teacher's process model becomes structured input
  assets/
    components.css             # accessible-interaction kit (styles, design tokens)
    components.js              # predict-reveal, retrieval-MC, self-explain, classify, step-through
    review-mode.js             # edit overlay (a11y-hardened copy we control)
  examples/
    ai-prompting.html          # first exemplar, built by the skill (dogfood + proof)
    ai-prompting-sources.md    # researched, current prompting + legal-platform facts w/ citations
```

**Referencing discipline (the maintainability core):**
- **Reuse in place:** html-explainer's `assemble.mjs` and `shoot.mjs`; *point to* its Phase 2
  (visual system) and Phase 4 (quality loop) rather than copying them.
- **Own outright:** pedagogy spine, component kit, accessibility enforcement, framework intake,
  our copy of the edit overlay.
- **Soft dependency:** html-explainer should be installed alongside. If absent, the skill still
  runs, notes the missing references/scripts, and falls back to a minimal inline build.
- The amount that needs re-syncing ≈ the amount copied — kept near zero by design.

## 7. The accessible-interaction component kit

`assets/components.{css,js}` — reusable, WCAG-2.2-AA-by-construction blocks. Each: keyboard-
operable, screen-reader-announced, reduced-motion-aware, ≥24px targets, contrast-tokened.

| Component | ICAP mode | Example use |
|---|---|---|
| predict-then-reveal | Constructive | predict the holding, then reveal |
| retrieval-MC (why + retry + tally) | retrieval/testing | spaced low-stakes checks |
| self-explain → model-answer | Constructive | free-text, then compare to expert answer |
| classify / sort (keyboard + click; drag optional) | Constructive | sort sources primary vs. secondary; tag prompt parts |
| step-through / sequence-builder | Active→Constructive | assemble a research process or a prompt |

Adding a component later = one CSS block + one JS module + one QA-gate entry.

**Consistency of *behavior*, not of *appearance*.** The kit guarantees accessible interaction
mechanics (keyboard, ARIA, target size, contrast tokens) — it does **not** impose a fixed look.
Visual presentation is themeable via design tokens and varies per explainer, and html-explainer's
Phase 2 "variety with rhythm" still governs section-by-section treatment so pages never feel
templated or monotonous. The kit is a **starting set, not a straitjacket**: bespoke interactions
tailored to the content (and its look/structure) are encouraged, provided they clear the same
accessibility and pedagogy bar. The QA gate checks the *bar*, not the presence of any specific widget.

## 8. Process flow (SKILL.md)

- **Phase 0 — Scope, ground, research.** Built on html-explainer's Phase 0 (its scoping interview
  + settled/dynamic research gate), adapted to be pedagogy-first. Interview: (a) **grounding** —
  upload own materials (PDF/slides/notes/URL/statute) → primary source of truth, or none;
  (b) **organizing structure** — a process framework, a conceptual mental model, or a logical
  sequence, chosen to fit the content (or co-develop one); never forced; (c) audience & depth;
  (d) **mode** (async default / in-class); (e) which spine elements (defaults on); (f) AI-chat
  (open yes/no, off by default). Then the **settled/dynamic research gate** (cap 2–3 fetches, cite
  sources); dynamic topics verified for currency.
- **Phase 1 — Learning architecture.** Choose the organizing structure that fits (framework /
  mental model / sequence — never forced) and order sections to follow it; map concept
  dependencies; place the constructive interactions and the ≥2 spaced retrieval checks.
- **Phases 2–4 — Build & quality (reference html-explainer).** Use its visual system + quality
  loop + `assemble.mjs`/`shoot.mjs`; assemble with our component kit and the review overlay inlined.
- **Phase 5 — Pedagogy + accessibility QA gate (ours).** Must pass before done: spine satisfied,
  WCAG 2.2 AA verified, feedback teaches, no learning-styles, sources cited. Layered on top of
  html-explainer's slop pre-flight.
- **Phase 6 — Revise.** Via the edit overlay; re-run the QA gate after changes.

**Modes:**
- **Async (default):** fully self-contained — every interaction gives its own "why" feedback.
- **In-class:** lighter variant — reveals can be held until clicked (project + ask the room first),
  projection-friendly type, optional "reveal all." Same file; a flag. Minimal for v1.

## 9. First exemplar — AI-prompting explainer

Ships in `examples/` as a real teaching asset and the proof the skill works (built *with* the skill).

**Two layers:**
- **Generalizable prompting** — current, evidence-based principles, scrubbed of stale folklore
  (role-play cargo cult, forcing CoT on reasoning models, tipping/threat myths, max-length prompts).
  Emphasis on what holds now: clear task + context, structure, examples when they help, explicit
  output format, letting reasoning models reason, grounding for factual work, iteration/verification.
- **Legal-research-platform specifics** — prompting inside Lexis+ AI / Protégé, Westlaw CoCounsel
  & AI-Assisted Research, vLex/Vincent, etc., and how grounded-tool prompting differs from raw-
  chatbot prompting (citation behavior, hallucination guardrails).

**Currency handling (this topic is maximally dynamic):**
- Treated as **dynamic** → built from researched, cited, **date-stamped** sources, never memory.
  `ai-prompting-sources.md` holds every claim with its citation.
- UI **separates stable from fast-moving**: durable principles presented as settled; platform
  features carry a visible "as of June 2026 — verify against vendor docs" trust marker.
- At build time, needs from the author: **the AI-prompting framework** (organizing structure) and
  any **grounding materials** (or co-develop the framework).

**Interactions showcased** (demonstrates the whole kit): predict-then-reveal (fix a weak prompt,
compare), classify (tag parts of a good prompt / sort good vs. bad practices), self-explain (why
this grounded legal-search prompt beat that one), and ≥2 spaced retrieval checks with why-feedback.

## 10. Open items for implementation planning

- Exact internal API/shape of the component kit (data-attribute driven vs. JS-init).
- Whether `review-mode.js` is a true a11y-hardened rewrite or a patched copy of the upstream file.
- Minimal inline build fallback content when html-explainer is absent.
- Author to provide the AI-prompting framework + any grounding materials before building the exemplar.
```

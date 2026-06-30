# Final Fix Report — teaching-explainer whole-branch review

Date: 2026-06-29  
Branch: teaching-explainer  
Pre-fix tests: 25/25 passing  
Post-fix tests: 28/28 passing (3 new tests added)

---

## Issue-by-issue changes

### Issue 1 (IMPORTANT) — Live-region guarantee enforced by construction

**Files changed:**
- `teaching-explainer/assets/components.js`
- `test/fixtures/retrieval-mc.html`
- `test/fixtures/classify.html`
- `test/fixtures/step-through.html`
- `test/components/retrieval-mc.spec.js`
- `test/components/classify.spec.js`
- `test/components/step-through.spec.js`
- `teaching-explainer/SKILL.md` (Phase 3 quick reference table + preamble)
- `teaching-explainer/README.md` (component quick reference table + preamble)

**What changed in code:**
Added `ensureLiveRegion(el)` helper to `components.js` that sets `role="status"` and `aria-live="polite"` on an element only if those attributes are not already present. Called during init of `retrieval-mc` (on `.te-mc-feedback`), `classify` (on `.te-cl-feedback`), and `step-through` (on `.te-st-progress`). These three components do NOT route through `announce()`/`#te-live` to avoid double-announcement.

Added a comment above the global `announce()` function explaining the two announce functions are deliberately separate (global `#te-live` vs. component's own element) — see also Issue 7.

**What changed in fixtures:**
Removed hand-authored `role="status" aria-live="polite"` from `.te-mc-feedback`, `.te-cl-feedback`, and `.te-st-progress` in their respective fixtures. This proves the test now exercises the by-construction path rather than relying on author markup.

**New tests added (3):**
- `retrieval-mc.spec.js`: "kit adds role=status and aria-live to .te-mc-feedback by construction"
- `classify.spec.js`: "kit adds role=status and aria-live to .te-cl-feedback by construction"
- `step-through.spec.js`: "kit adds role=status and aria-live to .te-st-progress by construction"

Each asserts the attribute is present after kit init with no author markup.

**What changed in docs:**
SKILL.md Phase 3 quick reference and README component quick reference: updated preamble to say live region is "applied by the kit during init — no author markup required"; updated Key attributes column for the three components to document the kit-applied attributes.

---

### Issue 2 (IMPORTANT) — In-class `data-te-hold-reveal` / "Reveal all" documented but unimplemented

**File changed:** `teaching-explainer/SKILL.md`

Rewrote the "In-class" subsection of Modes. The old text described `data-te-hold-reveal` and a "Reveal all" control as kit-provided. New text explains that hold-reveal and reveal-all are **bespoke per-explainer work** — the generating model wires up per-page logic — and that the kit does not provide a `data-te-hold-reveal` attribute or a "Reveal all" control.

Also updated the Phase 4 quality loop checklist item for in-class mode to remove the reference to "optional 'reveal all' control" and add the clarification "bespoke per-page wiring; no kit-level hold attribute."

---

### Issue 3 (IMPORTANT) — README hardcoded Windows path

**File changed:** `teaching-explainer/README.md`

Replaced `-Target "C:\Users\Rebecca Fordon\Projects\html-pedagogy\teaching-explainer"` with `-Target "<path-to-repo>\html-pedagogy\teaching-explainer"`, consistent with the macOS/Linux placeholder style in the same block.

---

### Issue 4 (MINOR) — README "six-phase" count wrong

**File changed:** `teaching-explainer/README.md`

Changed "six-phase process (scope, architecture, visual design, build, QA, revise)" to "seven-phase process (Phase 0 scope, Phase 1 architecture, Phase 2 visual design, Phase 3 build, Phase 4 quality loop, Phase 5 pedagogy + accessibility QA gate, Phase 6 revise)" — matching SKILL.md's Phase 0–6 structure.

---

### Issue 5 (MINOR) — Guard-path feedback doesn't reset `className`

**File changed:** `teaching-explainer/assets/components.js`

In `retrieval-mc`: added `fb.className = 'te-mc-feedback';` on the "Select an answer first." guard path.

In `classify`: added `fb.className = 'te-cl-feedback';` on the "Select an item first." guard path.

This prevents a neutral prompt from inheriting `.te-correct` / `.te-incorrect` styling from a prior attempt.

---

### Issue 6 (MINOR) — `predict-reveal.html` dual-labels the textarea

**File changed:** `test/fixtures/predict-reveal.html`

The textarea had both `<label for="pr1-input">` and `aria-labelledby="pr1"` (pointing to the prompt paragraph), making the `<label>` inert for AT. Kept `<label for="pr1-input">Your prediction</label>` as the single labeling mechanism. Removed `aria-labelledby` from the textarea and removed `id="pr1"` from the prompt paragraph (no longer needed).

---

### Issue 7 (MINOR) — Comment noting two `announce()` functions are deliberately separate

**Files changed:**
- `teaching-explainer/assets/components.js` — added comment above `announce()` explaining it is the global `#te-live` region used by predict-reveal and self-explain, and that retrieval-mc/classify/step-through deliberately use their own element.
- `teaching-explainer/assets/review-mode.js` — added comment above `announce()` explaining it is scoped to the review dialog's own status region to avoid cross-contamination with the component kit's global region.

---

### Issue 8 (MINOR) — SKILL.md description under-triggers on doctrinal/concept requests

**File changed:** `teaching-explainer/SKILL.md` (frontmatter `description` field)

Added to the trigger examples: `"help me teach the concept of X,"` `"build a concept-based or doctrinal teaching activity,"` and `"create an interactive explainer for a doctrine / legal rule / scientific concept."`

---

### Issue 9 (MINOR) — Burch et al. (2019) orphan citation

**File changed:** `teaching-explainer/references/pedagogy.md`

Wired the d ≈ 0.43 experiential-learning finding from Burch et al. (2019) into the evidence basis of Rule 2 (the active/constructive rule), noting it corroborates the active/constructive advantage in law-school-specific contexts. The citation is no longer an orphan in the Sources list.

---

### Issue 10 (MINOR) — README review overlay activation precedence undocumented

**File changed:** `teaching-explainer/README.md`

Expanded the "Activate" bullet under the Review overlay section to document the precedence: `?edit` auto-opens the dialog immediately; when `data-review-toggle` is present, the launcher is shown and `?edit` does not additionally auto-open — the user clicks the launcher to open the dialog instead.

---

## New tests

| Spec file | New test name |
|---|---|
| `test/components/retrieval-mc.spec.js` | kit adds role=status and aria-live to .te-mc-feedback by construction |
| `test/components/classify.spec.js` | kit adds role=status and aria-live to .te-cl-feedback by construction |
| `test/components/step-through.spec.js` | kit adds role=status and aria-live to .te-st-progress by construction |

---

## Full `npm test` summary

```
Running 28 tests using 4 workers

  ok  1  retrieval-mc › wrong answer is retryable; right answer shows why
  ok  2  classify › correct classification via keyboard; wrong is corrected
  ok  3  review-mode › launcher opens an aria-modal dialog; Esc closes and restores focus
  ok  4  predict-reveal › answer hidden until reveal; reveal updates state, focus, a11y
  ok  5  retrieval-mc › check with no selection prompts a selection
  ok  6  review-mode › focus is trapped inside the dialog while open
  ok  7  predict-reveal › keyboard: reveal is operable via Enter
  ok  8  retrieval-mc › tally counts each question once (denominator stable across retries)
  ok  9  classify › category click with nothing selected prompts selection
  ok 10  review-mode › no axe violations with dialog open
  ok 11  predict-reveal › no axe violations before and after reveal
  ok 12  retrieval-mc › no axe violations after feedback shown
  ok 13  classify › sorting all items shows completion; no axe violations
  ok 14  review-mode › Tab wraps forward and Shift+Tab wraps backward (focus trap, both directions)
  ok 15  retrieval-mc › kit adds role=status and aria-live to .te-mc-feedback by construction
  ok 16  review-mode › mode switching toggles contentEditable and aria-pressed
  ok 17  classify › kit adds role=status and aria-live to .te-cl-feedback by construction
  ok 18  self-explain › reveal disabled until learner writes; then reveals model answer
  ok 19  smoke › kit exposes TE.init and runs on load
  ok 20  step-through › shows one step, advances, moves focus, bounds buttons
  ok 21  review-mode › Copy notes for LLM invokes clipboard with the brief text
  ok 22  self-explain › whitespace-only input does not enable reveal
  ok 23  step-through › no axe violations on each step
  ok 24  self-explain › no axe violations
  ok 25  review-mode › Download edits produces a download
  ok 26  review-mode › Add note saves and persists across reload (localStorage round-trip)
  ok 27  review-mode › ?edit auto-opens the dialog without clicking the launcher
  ok 28  step-through › kit adds role=status and aria-live to .te-st-progress by construction

  28 passed (5.4s)
```

Zero axe violations across all tests.

---

## Issues status

| # | Status |
|---|---|
| 1 (Live-region by construction) | Fully resolved |
| 2 (Hold-reveal documented but unimplemented) | Fully resolved (rewording) |
| 3 (README hardcoded Windows path) | Fully resolved |
| 4 (Phase count wrong in README) | Fully resolved |
| 5 (Guard-path className not reset) | Fully resolved |
| 6 (predict-reveal.html dual-labeling) | Fully resolved |
| 7 (Two announce() comment) | Fully resolved |
| 8 (SKILL.md description trigger examples) | Fully resolved |
| 9 (Burch et al. orphan citation) | Fully resolved |
| 10 (README review overlay precedence) | Fully resolved |

No deferred issues.

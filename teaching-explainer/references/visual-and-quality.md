# Visual design bar + quality loop

**Attribution.** This file is adapted from the Phase 2 (visual design system) and Phase 4
(quality loop) sections of **[html-explainer](https://github.com/ds-vibe/html-explainer) by
Derek Schwede**, used under the MIT License — Copyright (c) 2026 Derek Schwede. Full license text:
[`THIRD-PARTY-NOTICES.md`](../../THIRD-PARTY-NOTICES.md). Lightly edited to remove references to
assets this skill doesn't ship (html-explainer's reference screenshots, its `scripts/`, its style
presets and framework defaults). *To refresh:* re-copy from html-explainer's current SKILL.md
Phase 2 / Phase 4.

This is the build-craft half of the skill (Phases 2 and 4). The pedagogy spine, the component kit,
and the accessibility gate are this skill's own — see `pedagogy.md` and `accessibility.md`.

---

## The visual bar (Phase 2 — the 10x bar)

- **The quality bar: professionally edited, purposeful, restrained, polished** — the opposite of
  auto-generated SaaS texture. Target: confident editorial typography (a real display + text
  pairing), a restrained palette where color is mostly *semantic* (carries meaning, not
  decoration), generous whitespace, no emoji. Aim for the polish of Vox / FT / Stripe-docs / The
  Pudding.
- **Actively avoid the "AI slop" look** — the tells to design *out*:
  - **Emoji as icons/UI** (⏳🔒🚀✨🔍📊 in headers/cards/buttons) — the #1 slop signal. Use a
    *cohesive* SVG icon set (one style), CSS shapes, numerals, or nothing. Never emoji as iconography.
  - **Decorative gradients & rainbow color** — pastel hero washes, iridescent backgrounds,
    multi-colored titles, rainbow rows. Color must be intentional and mostly semantic.
  - **The default bento grid** — a 2×2/3×3 of identical soft-shadow cards as the answer to every
    section. Cards are *one* device; vary the treatment.
  - **Generic SaaS texture** — drop shadow on every box, faux-3D, "✨ AI-powered" flourishes,
    Inter-on-pure-white blandness. Restraint reads expensive; decoration reads auto-generated.
  - **The default editorial palette** — cream + a lone rust-orange accent + dark band + green/red
    chips: the AI house style, reads templated. Derive ≥1 accent from the subject; color semantic,
    not decorative.
- **A consistent visual language should teach.** Small *semantic* system used everywhere: color =
  category/meaning (e.g. risk tier); a recurring motif = state (before→after highlight; a status
  badge). Paper + ink + **one or two** accents that *mean* something.
- **Variety with rhythm:** each section gets a distinct treatment (cards, pyramid, flow, timeline,
  matrix) but shares spacing, type scale, and the color system. Alternate backgrounds to separate.
- **Typography & space:** strong hierarchy, ~60–70ch measure for prose, generous whitespace, a real
  type pairing (serif display + clean sans) over system-Inter-everywhere. Section eyebrows/kickers
  must read as signposts — weight 600–700, ~13–14px, not faint 11px labels. *(For a single portable
  file, prefer a refined **system** font stack over web fonts so the page stays offline and makes no
  network calls.)*
- **Spacing on a scale, not by feel.** Spacing tokens (4/8px scale) used everywhere → consistent
  rhythm: even section padding, hero elements separated, equal gaps in repeated groups.
- **Contrast is per-surface.** A color legible on the page background won't be on a dark band,
  colored chip, or inverted hero — give each surface its own ink (≥4.5:1 body); never a
  near-background tint as text. Light **and** dark → define and verify both.
- **Use the horizontal space — proportioned, not a lonely column.** Let the *page* use the width
  while *prose* stays ~60–70ch: give the **centerpiece** room (wide tables/timelines/diagrams), use
  **full-bleed section bands**, reach for **two-column/asymmetric** layouts where they help. Cap the
  outer container ~1100–1280px with balanced gutters — never a narrow column stranded in margins.
- **Motion with purpose:** scroll-reveal/transitions add life; never gratuitous. **Never hide
  content at `opacity:0` depending on `IntersectionObserver` firing** — it doesn't fire reliably in
  headless screenshots or on some mobile browsers, leaving pages blank. The safe pattern: make
  `.reveal` a no-op CSS marker only (content always visible by default); use CSS `@keyframes`
  entrance animations if you want motion on load. Respect `prefers-reduced-motion`.
- **Meaningful graphics — the "so what" test, then form follows data.** Every graphic must encode a
  *relationship*, not just store facts. If you can't name its one takeaway in a sentence, it's
  decoration — a 2×2 of disconnected stats is a list in costume; use prose. Match the form to the
  shape of the data: comparison / trade-off → two-up panels or before/after; position on a spectrum
  → dot/strip plot on a shared axis; sequence with real gaps → true-scale timeline (spacing ∝
  elapsed time); process / causal arc → flow with connectors; part-to-whole or magnitude → bar /
  meter, not a number in a box; "what applies to X" → filterable matrix. Run the **inverse check**
  too: dense comparative / numeric / sequential *prose* that should be a graphic.
- **Don't over-engineer the dataviz.** A clean conventional chart/table beats an exotic
  treemap/sunburst almost always. Reach for advanced viz only when the data needs it.
- **Design tokens, not magic numbers.** In a single file, hand-rolled CSS with `:root` CSS variables
  for color, spacing, and type scale; the component kit inherits these tokens.

---

## The quality loop (Phase 4 — this is where quality comes from)

**Not optional, not "if you have time."** A draft you haven't critiqued is a draft, not a
deliverable. The most common failure is declaring it done straight from generated code — that's how
slop ships. Don't skip it, even for a "quick" page, even on a weak model, even with no browser.

### Step 0 — Static pre-flight (MANDATORY, runs even with no browser)

Re-read your output and fix every one of these — each is a blocker:

- [ ] **No emoji as icons/UI** anywhere. Cohesive SVG/icon-font you *actually render*, CSS shapes,
      numerals, or nothing.
- [ ] **A real type pairing** — display/serif + clean sans, tokens at `:root`. Not the bare system
      stack, not Inter-on-white only. (System-font pairing is fine for an offline single file.)
- [ ] **Horizontal space used** — composed and proportioned (wide centerpiece and/or full-bleed
      bands); prose ~60–70ch but the *page* is not a ~720–800px column in empty margins.
- [ ] **No other slop tells** — no decorative/iridescent gradients, no rainbow text/rows, no 2×2
      bento grid of identical soft-shadow cards, no drop-shadow-on-everything.
- [ ] **Palette isn't the templated default** (cream + lone rust/orange accent); ≥1 accent
      subject-derived, color semantic — **and visually distinct from your other explainers** (don't
      reuse a prior stylesheet; see `themes.md`).
- [ ] **Bespoke theme not a costume** — if a topic-matched theme was used, it's an accent, not a
      full reskin: body text and UI controls stay clean and readable; theme tokens appear in the
      hero/display only.
- [ ] **The JS actually runs** — no syntax errors (watch unescaped quotes/apostrophes in JS
      strings), no undefined refs; every interactive widget works, not just renders.
- [ ] **Genuine interaction, not just toggles.** At least one manipulate-→-live-result or
      predict/generate interaction per concept. (This skill's component kit — predict-reveal,
      retrieval-mc, self-explain, classify, step-through — satisfies this; see `pedagogy.md` Rule 2.
      Toggles and reveal/expand cards alone do not count.)
- [ ] **Button hierarchy** — primary actions (Next, Submit, Check) are solid filled buttons with
      clear weight; secondary actions (Back, Reset, Skip) are ghost/outline. The primary must be
      unmissable.
- [ ] **Canvas/WebGL demos auto-initialize on load** — render the first frame on `DOMContentLoaded`
      / `window.onload`, never requiring a click.
- [ ] **SVG viewBox has padding around all content** — SVGs clip to their viewBox; add ≥16px on all
      sides beyond content bounds (e.g. `viewBox="-16 -16 [w+32] [h+32]"`). Check adjacent labels at
      the same y-level don't overlap.
- [ ] **Visual variety & a learnable semantic language** — sections don't all look identical; color
      carries meaning consistently.
- [ ] **Containment, unique IDs & rendered widgets** — interactive content sits **inset within the
      content column** (left/right edges within the gutter); every widget renders content (no empty
      cards/blank quiz). **Never reuse an `id`** on a wrapper and its inner content.
- [ ] **Contrast — computed, not eyeballed** — estimate the WCAG ratio per text/background pair
      (≥4.5:1 body, ≥3:1 large). Catch the classic fail: a highlight reused on the wrong surface.
- [ ] **Spacing on a scale, not cramped** — even section padding; hero eyebrow→title→subtitle
      clearly separated; nothing touching edges.
- [ ] **Title & voice** — `<h1>` plainly names the topic (not a bare metaphor); title/intro
      editorial, not slogan-y; a mental model appears once in the body, not stacked.
- [ ] **No stacked headers; open on substance** — at most one heading layer before body; no `<h3>`
      that restates its heading. Every lede states a concrete claim unguessable from the heading.
- [ ] **No flat redundancy** — each load-bearing concept has one home; elsewhere reference it. A
      recurring mental model restated at **new depth** is progressive teaching, not repetition.
- [ ] **Prose voice & slop tells** — plain, concrete-first, no rhetorical posture. Scan for overuse
      of: em-dashes (three per paragraph is a tell) · loaded metaphor nouns ("the spine",
      "load-bearing", "the throughline", "connective tissue", "the scaffolding") · "it's not just
      X — it's Y" framing · filler openers ("at its core", "put simply", "in short") · rhetorical
      questions as transitions · meta-narration ("this is where it gets interesting", "here's the
      thing") · every header a declarative sentence with a period. Standard: would an editor at
      *The Atlantic* flag this?
- [ ] **Visuals match the words** — every diagram/chart/demo depicts the claim (direction, order,
      magnitude, legend all agree with the caption).
- [ ] **Accessible & responsive** — semantic HTML, keyboard-operable, alt text, real mobile layout
      (stacks cleanly, no horizontal overflow, tap targets ≥24×24px — see `accessibility.md`).
- [ ] **Scroll-reveal / mobile visibility** — no content hidden at `opacity:0` or via an
      `IntersectionObserver`-dependent class. All sections render fully on mobile without interaction.
- [ ] **Kit assets inlined** — both `components.css` and `components.js` are present (plus
      `review-mode.js` for a standalone file). See SKILL.md Phase 3 and the Phase 5 build-integrity
      check.

### Step 1 — Render and actually look (when a browser is available)

1. **Render it for real and look.** Headless-browser screenshot — desktop *and* mobile — including
   every interactive state (revealed answers, feedback shown, each step). Then **read the
   screenshots** and judge.
   **Check for a browser first:** `which chromium google-chrome chromium-browser 2>/dev/null | head -1`.
   If none, **don't install** one — sandboxed environments can't run it. Run Step 0 rigorously
   (compute contrast from your tokens), then tell the user the visual pass didn't run and to confirm
   the demos render. (If html-explainer is installed, `node scripts/shoot.mjs <url> <outDir>` is a
   convenient Playwright helper.)
2. **Critique like a human seeing it cold:** What's confusing, barren, cramped, misaligned,
   low-contrast? Is the *order* right? Would a newcomer follow it? Does the mental model land?
3. **10x the weak spots** — then re-screenshot. Repeat until you'd ship it proudly unprompted.
4. "It builds / renders text" is **not** "it's good." Real improvements are found by *looking*.

Then run the Phase 5 pedagogy + accessibility QA gate (see SKILL.md).

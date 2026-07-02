# Pedagogy Reference: Evidence Base as Enforceable Rules

*Source: `research/pedagogy-evidence-base.md` (deep-research synthesis, 2026-06-29; 5 angles, 23 sources fetched, 25 claims adversarially verified, 0 refuted). All claims traceable to that file. Do not invent new claims or citations.*

---

## The Spine — 7 Enforced Rules

These rules are defaults that the skill enforces on every generated explainer. Each carries a one-line evidence basis and a concrete application note.

### Rule 1 — Organize around content structure, never force a structure

**Evidence basis:** Coherence principle (Cromley & Chen 2025, g ≈ 1.00) — the single highest-yield multimedia principle is removing content that doesn't teach. Imposing an artificial structure adds cognitive load without instructional return.

**How to apply:** Choose the organizing form (timeline, decision tree, anatomy diagram, step sequence) that matches *what the concept actually is*, not what a template requires. If a concept has no meaningful visual structure, use prose. Do not impose tabs, carousels, or section headers that fragment a naturally continuous explanation.

---

### Rule 2 — Include ≥1 Constructive interaction per concept

**Evidence basis:** ICAP framework (Chi & Wylie 2014) — Constructive activity (generating beyond what is given) produces learning gains above passive or merely active engagement. Freeman et al. (2014, PNAS, N=225 studies) showed active learning raised exam performance +0.47 SD and cut failure rates from 33.8% to 21.8%. Burch et al. (2019, JLE) found that experiential, active learning approaches in legal education yielded d ≈ 0.43 gains over passive formats, corroborating the active/constructive advantage in law-school-specific contexts.

**How to apply:** Every concept section must include at least one `predict-reveal`, `self-explain`, or `classify` component. A `step-through` that requires the learner to predict the next step before advancing also qualifies. A read-through with no generative prompt does not satisfy this rule.

---

### Rule 3 — Embed ≥2 spaced retrieval checks with why-feedback and a retry path

**Evidence basis:** Testing/retrieval effect — broad meta-analytic g ≈ 0.50–0.70. Kenney & Bailey (2021) found benefits only when material was retrieved *at least twice*; single retrieval was insufficient. ABA Standard 314 requires formative assessment with meaningful feedback.

**How to apply:** Use at least two `retrieval-mc` components distributed across the explainer (not stacked at the end). Each must display an explanation of *why* the correct answer is correct (not just right/wrong). Each must allow a retry on incorrect response. Spacing means at least one intervening concept section between retrieval checks.

---

### Rule 4 — Coherence: cut decoration

**Evidence basis:** Coherence principle is the single highest-yield principle in Cromley & Chen's (2025) re-analysis of Mayer's corpus (92 articles, 181 studies, 591 effect sizes): g ≈ 1.00.

**How to apply:** Generate no decorative stock imagery, no purely aesthetic animations, no background textures, no icon sets that don't carry instructional meaning. Every visual element must either label a concept, show a relationship, or illustrate a process. When in doubt, omit.

---

### Rule 5 — Conversational prose; pair words with relevant visuals only

**Evidence basis:** Personalization principle (Cromley & Chen 2025, g ≈ 0.70) — conversational tone outperforms formal academic register. Multimedia principle (g ≈ 0.68) — words plus *relevant* visuals outperform words alone; the benefit depends on the visual carrying real information.

**How to apply:** Write generated prose in second-person, plain language ("When you search for a case…" not "When the researcher searches…"). Include a diagram, timeline, or annotated example *only* when it conveys structure the prose cannot — citation anatomy, a search-syntax tree, a procedural sequence. Do not add a visual simply to break up text.

**Plain language means self-contained, too.** Define or replace every term of art on first use, and cut inside references — in-jokes, unexplained acronyms, niche idioms, or allusions that assume context not on the page (e.g., "cargo cult"). A reader with no outside context should understand every sentence. Jargon is invisible to the author who knows what it means, so the Phase 5 gate runs a dedicated fresh-eyes pass for this.

---

### Rule 6 — Feedback teaches; it does not just evaluate

**Evidence basis:** ABA Standard 314 requires "meaningful feedback." Self-explanation prompts show g ≈ 0.46 (Cromley & Chen 2025). Kenney & Bailey (2021) retrieval benefit occurred with explanatory feedback, not bare correct/incorrect indicators.

**How to apply:** Every interactive component (`predict-reveal`, `retrieval-mc`, `self-explain`, `classify`) must display, on completion or on incorrect response, an explanation of the correct reasoning — not just the correct answer. Feedback text is instructional prose, not praise language ("Correct! Well done!").

---

### Rule 7 — No learning-styles adaptation; use UDL multi-representation instead

**Evidence basis:** The learning-styles meshing hypothesis — that matching instruction modality to a learner's diagnosed style improves outcomes — has been repeatedly refuted (Pashler et al. 2008 and subsequent). No credible evidence supports style-matching. The evidence-based substitute is Universal Design for Learning (UDL): offer multiple means of representation to *all* learners.

**How to apply:** The skill must not detect, infer, or adapt to individual learning styles. Instead, represent every substantive concept in more than one form available to all learners: prose explanation + a visual where appropriate + at least one interactive engagement. This is the UDL "multiple means of representation" principle, not personalization-to-style.

---

## Yield-Ranked Multimedia Principles

From Cromley & Chen (2025) re-analysis of Mayer's corpus. Average multimedia effect is only moderate (g ≈ 0.37); principles are not uniformly effective. Prioritize accordingly.

| Principle | Effect (g) | Action |
|---|---|---|
| **Coherence** — remove seductive/decorative detail | ≈ 1.00 | **Prioritize: enforce by default** |
| **Personalization** — conversational, not formal tone | ≈ 0.70 | **Prioritize: enforce by default** |
| **Multimedia** — words + relevant visuals vs. words alone | ≈ 0.68 | **Prioritize: include when visual carries information** |
| **Self-explanation prompts** | ≈ 0.46 | **Prioritize: enforce via `self-explain` component** |
| Voice (human vs. machine narration) | ≈ 0.28 | Skip — low and mixed; not applicable to text explainers |
| Segmenting (self-paced chunks) | ≈ 0.19 | Low when pooled; single-page format is naturally chunkable, don't engineer elaborate self-pacing UI |
| Contiguity (place labels next to visuals) | ≈ 0.13 | Low when pooled; follow as a layout default, not a headline feature |
| Social presence | ≈ 0.12 | Negligible; skip |

---

## ICAP Quick Reference

From Chi & Wylie (2014). Predicts learning rises Interactive > Constructive > Active > Passive.

*Caveat:* the strict empirical ordering is contested (npj Science of Learning, 2023); the "8–10% gain per mode" figure comes from a single small lab study (Menekse 2013), not replicated. Use ICAP as a design target, not a precise quantitative guarantee.

| Mode | Learner behavior | Learning process | Example interaction | Component |
|---|---|---|---|---|
| **Passive** | Receiving — reading, watching | Storing/recall | Static text, read-through | (none — target to move above this) |
| **Active** | Manipulating — clicking, advancing, replaying | Integrating/applying | Advance through a worked example | `step-through` (Active baseline) |
| **Constructive** | Generating beyond what is given | Inferring/transferring | Predict the holding before reveal; explain in own words; sort cases into categories | `predict-reveal`, `self-explain`, `classify` |
| **Constructive** (retrieval variant) | Self-testing with feedback | Transfer + retention | Low-stakes quiz with why-explanation | `retrieval-mc` |
| **Interactive** | Co-constructing with another agent | Co-inferring/co-creating | Dialogue, defend-and-revise (requires a peer or AI interlocutor — out of scope for single-page static explainer) | (not in current kit) |

**Design target:** `step-through` moves a learner from Passive to Active. The real gains begin at **Constructive** — use `predict-reveal`, `self-explain`, `classify`, or a predictive `step-through` for every concept. `retrieval-mc` serves Constructive retrieval. Aim for Constructive as the floor.

---

## Retrieval Practice Rules

**Basis:** Testing effect — broad meta-analytic effect g ≈ 0.50–0.70, larger at longer retention intervals (Roediger & Karpicke; Kenney & Bailey 2021). Kenney & Bailey (2021) in a law-school-adjacent classroom (N=47): daily low-stakes quizzes + unit exams improved comprehensive final performance *and* reduced overconfidence — but **only when material was retrieved at least twice**. Single retrieval was insufficient.

Rules for the skill:

1. **Spaced, not one-shot.** Do not place all retrieval checks at the end of the explainer. Distribute them across concept sections.
2. **Minimum two checks.** One `retrieval-mc` is not enough. Embed at least two, targeting different concepts or the same concept at different levels.
3. **Why-feedback.** Every `retrieval-mc` must explain *why* the correct answer is correct. Bare correct/incorrect is insufficient; it must teach.
4. **Retry on failure.** Allow the learner to attempt a question again after seeing feedback. This is both pedagogically sound (formative, not evaluative) and required by ABA Standard 314's meaningful-feedback mandate.
5. **Low stakes.** No score is stored or surfaced as a grade. Retrieval here is a learning tool, not an assessment instrument.

---

## The Learning-Styles Guardrail

*Drawn verbatim from research §7a.*

**The rule:** The skill must NOT detect or adapt to individual "learning styles."

A significant portion of legal-education pedagogy scholarship (including DeGroff 2012; Kolb LSI; Myers-Briggs-derived work) rests on the learning-styles construct — diagnosing a learner as visual, kinesthetic, auditory, or reading/writing and matching instruction modality to that diagnosis. **The meshing hypothesis has been repeatedly refuted. Pashler et al. (2008) conducted a systematic review and concluded there is no credible evidence that style-matching improves learning outcomes.** Subsequent reviews have not rehabilitated the claim.

**The evidence-based substitute is UDL multiple means of representation:** offer the same content in more than one form — text plus a relevant visual plus an interactive element — to *all learners*. This helps all learners without relying on the debunked diagnosis-and-match mechanism.

**How the skill must implement this:**
- Do not include UI for learners to select a learning style.
- Do not branch content based on inferred style.
- Do include multiple representations (prose + visual + interaction) for every substantive concept, available to all learners by default.

*UDL caveat: UDL is solid as a descriptive and organizing framework. Its measured effectiveness as a teaching practice is contested — see Honesty Notes below.*

---

## Honesty Notes — Where Evidence Is Thin

The skill should avoid over-claiming. Three areas where the evidence is explicitly limited:

### 1. The exact artifact — single-page interactive HTML explainers

There is **essentially no direct outcome research** on custom single-page interactive HTML explainers, explorable explanations, or scrollytelling formats specifically. The pedagogical case for this artifact is built entirely by analogy from well-studied cousins (active learning in classrooms; CTML multimedia experiments; retrieval-practice lab and classroom studies). The analogy is principled and defensible, but it is not a direct evidence chain. Do not claim "research proves interactive HTML explainers improve learning."

### 2. CALI Lessons — genre precedent, not proven efficacy

CALI Lessons (1,200+ interactive, computer-based legal tutorials, widely adopted across ~50 subjects) are the established legal-tech analogue for this artifact. They prove genre adoption and demonstrate that law schools will use the format. **No rigorous independent outcome study on CALI lessons surfaced in the research synthesis.** Treat CALI as precedent for format viability, not as evidence of effectiveness.

### 3. UDL — framework without strong effectiveness evidence

UDL (CAST) is referenced throughout this document as the accessibility-and-representation framework. Boysen (2024) calls CAST's evidence base "weak." UDL is a useful organizing and design heuristic; its use does not guarantee measured learning gains. Use it to structure choices; do not claim proven learning outcomes from applying UDL.

---

## Sources

- Freeman et al. (2014), PNAS — active learning meta-analysis: https://www.pnas.org/doi/10.1073/pnas.1319030111
- Chi & Wylie (2014) — ICAP framework: https://www.tandfonline.com/doi/abs/10.1080/00461520.2014.965823
- Mayer (2024) — CTML: https://link.springer.com/article/10.1007/s10648-023-09842-1
- Cromley & Chen (2025) — multimedia principle yield: https://www.sciencedirect.com/science/article/pii/S1747938X25000673
- Kenney & Bailey (2021) — retrieval practice: https://scholarworks.iu.edu/journals/index.php/josotl/article/view/28650
- Pashler et al. (2008) — learning styles refutation (cited in research §7a)
- Burch et al. (2019) via JLE — experiential legal education: https://jle.aals.org/cgi/viewcontent.cgi?article=3266&context=home
- ABA Standard 314: https://www.americanbar.org/groups/legal_education/about/committees/outcomes-assessments/about/
- CALI Lessons: https://www.cali.org/content/cali-lessons
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- UDL (CAST): https://udlguidelines.cast.org/
- ICAP critique (npj Science of Learning 2023): https://www.nature.com/articles/s41539-023-00197-4

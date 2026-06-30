# Evidence-Based Pedagogy for Interactive HTML Explainers (Law School Focus)

*Research synthesis — deep-research workflow, 2026-06-29. 5 angles · 23 sources fetched · 25 claims adversarially verified (3-vote, 0 refuted).*

This is the evidence layer to inform a skill that generates accessible, interactive HTML explainers for law school classes (legal research, legal tech, and doctrinal courses). Findings are tagged by evidence strength so design decisions can be weighted accordingly.

---

## TL;DR for the skill

1. **Active learning works** — large, replicated effect in higher ed (Freeman 2014). Design explainers to *do something*, not just present.
2. **Push toward the "Constructive/Interactive" end of ICAP** — prompts that make the learner generate, explain, predict, or self-test beat passive reading.
3. **Apply the high-yield multimedia principles, skip the low-yield ones.** Not every Mayer principle pays off. Prioritize: cut decorative content (coherence), pair words+relevant visuals, conversational tone, and self-explanation prompts.
4. **Embed repeated, low-stakes retrieval** (not one-shot quizzes) — improves retention *and* reduces overconfidence.
5. **Lean on the legal-education mandate**: ABA Standard 314 *requires* formative assessment + meaningful feedback. Explainers are a clean fit.
6. **CALI Lessons are the established legal-tech genre** to model on (1,200+ lessons) — but their independent effectiveness evidence is thin.
7. **Target WCAG 2.2 Level AA** (current standard) + CAST's UDL framework.

---

## 1. Active learning — STRONG evidence

**Freeman et al. (2014), PNAS** — meta-analysis of 225 undergraduate STEM studies:
- Exam/concept-inventory performance **+0.47 SD** under active learning vs. lecture.
- Failure rates fell from **33.8% (lecture) → 21.8% (active)**; lecture students ~1.5× more likely to fail.
- Largest effects in **small classes (≤50)** — favorable for law seminars/research sections.
- Source: https://www.pnas.org/doi/10.1073/pnas.1319030111

**Legal-education-specific:** Burch et al. (2019) meta-analysis (89 controlled studies) found experiential pedagogies produced outcomes **~0.43 SD higher (d = .43)** than traditional environments; the *Journal of Legal Education* applies this to law teaching and cites Freeman approvingly.
- *Caveat:* the underlying meta-analysis is general experiential learning applied to law, not a law-classroom RCT. Direct law-school RCT evidence is thinner.
- Source: https://jle.aals.org/cgi/viewcontent.cgi?article=3266&context=home

---

## 2. The closest evidence-based analogues

There is **essentially no direct outcome research on custom single-page interactive HTML explainers** (or on "explorable explanations"/scrollytelling specifically). The case is built by analogy from well-studied cousins.

### ICAP framework — STRONG as framework, CONTESTED on strict ordering
Chi & Wylie (2014). Classifies overt learner behavior into four modes; predicts learning rises **Interactive > Constructive > Active > Passive**:
- **Passive** = receiving (storing/recall)
- **Active** = manipulating (integrating/apply) — e.g., highlighting, pausing, replaying
- **Constructive** = generating beyond what's given (inferring/transfer) — e.g., self-explaining, predicting, drawing
- **Interactive** = co-constructing (co-inferring/co-create) — dialogue, defending/revising
- *Caveats:* the I>C>A>P ordering is what ICAP *predicts*; 2023 work (npj Science of Learning) questions whether it always holds empirically. The "8–10% gain per mode" figure comes from a single self-reported lab study (Menekse 2013), not replicated.
- Sources: https://www.tandfonline.com/doi/abs/10.1080/00461520.2014.965823 · https://education.asu.edu/sites/g/files/litvpz656/files/lcl/chiwylie2014icap_2.pdf
- **Design takeaway:** A static read-through is Passive. Adding click-to-reveal/replay is Active. The real gains come from **Constructive** prompts — "predict the holding before revealing," "explain why this source beats that one," "draft the search query."

### Mayer's CTML — STRONG backbone
Mayer (2024). Three cognitive-science assumptions — **dual channels** (verbal/visual), **limited capacity** per channel, **active processing** — yield 15 evidence-based multimedia design principles from 200+ experiments.
- Source: https://link.springer.com/article/10.1007/s10648-023-09842-1

### Retrieval practice / testing effect — STRONG
- Broad meta-analytic effect **g ≈ 0.50–0.70**, larger at longer retention intervals.
- Kenney & Bailey (2021): daily low-stakes quizzes + unit exams improved comprehensive final performance **and reduced overconfidence** — *but only when material was retrieved at least twice.* Single retrieval wasn't enough.
- *Caveat:* the classroom study is small (N=47, one course), though directionally consistent with the large literature.
- Source: https://scholarworks.iu.edu/journals/index.php/josotl/article/view/28650
- **Design takeaway:** embed *repeated, spaced* low-stakes checks, not a single end-of-page quiz.

---

## 3. Design principles — ranked by actual yield (IMPORTANT nuance)

**Cromley & Chen (2025)** meta-analyzed Mayer's *own* corpus (92 articles, 181 studies, 591 effect sizes). Key finding: the average multimedia effect is only **moderate (g ≈ 0.37)**, and **principles are NOT uniformly effective.** This is the single most important "don't over-claim" result.

| Principle | Effect (g) | Priority |
|---|---|---|
| **Coherence** (remove seductive/decorative detail) | ≈ 1.00 | **Highest — do this** |
| **Personalization** (conversational, not formal tone) | ≈ 0.70 | **High** |
| **Multimedia** (words + relevant visuals vs. words alone) | ≈ 0.68 | **High** |
| **Self-explanation prompts** | ≈ 0.46 | **High** |
| Voice | ≈ 0.28 | Low / mixed |
| Segmenting (self-paced chunks) | ≈ 0.19 | Low when pooled |
| Contiguity (place labels next to visuals) | ≈ 0.13 | Low when pooled |
| Social presence | ≈ 0.12 | Negligible |

- Source: https://www.sciencedirect.com/science/article/pii/S1747938X25000673
- **Design takeaway for the skill:** bake in the top tier as *defaults* — ruthless coherence (no decorative stock imagery/animation that doesn't teach), plain conversational prose, visuals that carry real information, and explicit self-explanation prompts. Treat segmenting/self-pacing as a nice-to-have, not a headline feature (relevant because a single-page explainer is naturally chunkable anyway).

---

## 4. Law-school-specific considerations

- **ABA Standard 314 (in force):** "A law school shall utilize both formative and summative assessment methods in its curriculum to measure and improve student learning and provide meaningful feedback to students." Interactive explainers with embedded feedback are a direct, low-cost way to satisfy the *formative* half. (Proposed revisions add a first-third-of-program formative-assessment mandate.)
  - Source: https://www.americanbar.org/groups/legal_education/about/committees/outcomes-assessments/about/
- **CALI Lessons** are the established legal-tech analogue: 1,200+ interactive, computer-based tutorials on narrow legal topics, widely adopted across ~50 subjects. This proves genre + adoption precedent.
  - *Caveat:* no rigorous outcome study on CALI lessons surfaced — adoption scale is documented, independent effectiveness is an **open question.**
  - Source: https://www.cali.org/content/cali-lessons
- **Open gap:** the legal-*research*-instruction pedagogy literature (problem-based, process-oriented, formative) was not directly captured in the verified claims — worth a targeted follow-up if you want law-research-specific backing beyond the general experiential meta-analysis.

---

## 5. Accessibility — STRONG (standards-body primary sources)

**Target WCAG 2.2 Level AA** — current W3C Recommendation (Oct 2023, revised Dec 2024), now ISO/IEC 40500:2025; the operative standard for ADA Title II, Section 508, and EU. WCAG 3.0 is only a draft (~2028–2029) and won't supersede 2.x. Organized under **POUR** (Perceivable, Operable, Understandable, Robust).

Criteria that directly govern interactive explainer widgets/quizzes/visualizations:
- **1.1.1 Text Alternatives (A)** — alt text for all non-text content (diagrams, charts).
- **2.1.1 Keyboard (A)** — *everything* operable by keyboard alone.
- **2.4.7 Focus Visible (AA)** — visible keyboard focus indicator.
- **2.5.7 Dragging Movements (AA)** — any drag interaction needs a single-pointer (non-drag) alternative.
- **2.5.8 Target Size Minimum (AA)** — interactive targets ≥ **24×24 CSS px**.
- **2.4.11 Focus Not Obscured (AA)**, **3.2.6 Consistent Help (A)**, **3.3.7 Redundant Entry (A)**, **3.3.8 Accessible Authentication (AA)** — relevant to multi-step/interactive flows.
- Sources: https://www.w3.org/TR/WCAG22/ · https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

**UDL (CAST)** — pair with WCAG as the *pedagogical* accessibility frame (multiple means of engagement, representation, action/expression).
- *Caveat (MEDIUM confidence):* UDL is solid as a descriptive framework, but its *measured effectiveness* is contested (Boysen 2024 calls CAST's evidence base "weak"). Use it to structure choices, don't claim proven learning gains from UDL itself.
- Source: https://udlguidelines.cast.org/

---

## 6. Evidence-strength summary

- **STRONG:** active learning (Freeman); CTML assumptions & existence of principles; testing/retrieval effect; WCAG 2.2 facts; ABA Standard 314.
- **MODERATE / QUALIFIED:** *magnitude* of multimedia benefits (avg g ≈ 0.37); several textbook principles (segmenting, contiguity, voice, social presence) are small/non-significant when pooled — prioritize coherence, multimedia, personalization, self-explanation.
- **THIN:** direct evidence on the *exact* artifact (single-page interactive HTML explainers / explorable explanations / scrollytelling). Reasoned by analogy.
- **CONTESTED:** ICAP's strict empirical ordering; UDL's effectiveness.
- **SINGLE-STUDY (weak individually, directionally consistent):** ICAP 8–10%/mode; Kenney & Bailey retrieval (N=47).
- **LEGAL-SPECIFIC:** d=.43 experiential figure is general experiential learning applied to law, not a law-classroom RCT.

---

## 7. Concrete design implications for the skill

These become defaults/checklist items the skill enforces:

1. **Every explainer must include at least one Constructive interaction** — predict-then-reveal, self-explanation prompt, sort/classify, build-a-query, or draft-and-compare. (ICAP)
2. **Embed ≥2 spaced retrieval checks**, low-stakes, with immediate feedback — not one quiz at the end. (testing effect + Standard 314)
3. **Coherence by default:** no decorative imagery/animation that doesn't carry instructional meaning. Visuals must teach. (highest-yield principle)
4. **Conversational, plain-language tone** in generated prose. (personalization)
5. **Words + relevant visual** for any concept that has a structure (e.g., a citation's anatomy, a search-syntax tree, a procedural timeline). (multimedia)
6. **Immediate formative feedback** on every interactive element — explain *why*, not just right/wrong.
7. **Accessibility is non-negotiable scaffolding**, generated into every artifact: semantic HTML, full keyboard operability, visible focus, alt text on all visuals, ≥24px targets, drag alternatives, sufficient contrast, respects `prefers-reduced-motion`.
8. **Be honest about scope:** the skill should favor proven moves and not over-engineer low-yield features (elaborate self-pacing UI, decorative motion).

---

## 7a. Legal-education-specific addendum (targeted follow-up, 2026-06-29)

From DeGroff, *Training Tomorrow's Lawyers*, 36 S. Ill. U. L.J. 251 (2012) + targeted search:

- **Legal-ed pedagogy research is thin by its own admission** — the field "lags behind other disciplines" in empirical scholarship on teaching, assessment, and learning. Active/experiential/problem-based learning is endorsed largely on intuition + analogy + a modest growing body, not law-classroom RCTs. The strong evidence is the general cognitive-science literature (§§1–3); the law layer is mostly normative.
- **Law-specific empirical nuggets that DO support the design:**
  - **Curcio, Jones & Washington** — multiple practice essays with peer + self-assessment improved law students' rule-decomposition and complex factual analysis on exams. (= retrieval practice + formative feedback, in a law classroom.)
  - **Shapiro**, *The Use and Effectiveness of Various Learning Materials in an Evidence Class*, 46 J. Legal Educ. 101 (1996) — rare direct study of learning-materials effectiveness in a doctrinal course.
  - **Boyle & Dolle**, *programmed learning sequence as an instructional tool* — structured self-paced interactive instruction in law; closest pre-digital cousin to an interactive explainer.
- **CALI effectiveness: confirmed thin** — adoption + student-perception notes only; no rigorous outcome study found. Treat as genre precedent, not proven efficacy.

### ⚠️ DESIGN GUARDRAIL — do NOT build to "learning styles"
A large slice of legal-education pedagogy scholarship (incl. DeGroff; Kolb LSI; Myers-Briggs work) rests on the **"learning styles" construct** — diagnosing a learner as visual/kinesthetic/etc. and matching instruction to it. **The meshing hypothesis has been repeatedly refuted (Pashler et al. 2008 and after); no credible evidence that style-matching improves learning.** The skill must NOT detect or adapt to individual "learning styles." The evidence-based substitute is **UDL multiple means of representation**: offer the same content in more than one form (text + visual + interaction) to *everyone*. This helps all learners and avoids the debunked claim.

## 8. Open questions worth a follow-up pass

1. Any direct outcome study on interactive HTML explainers / explorable explanations / scrollytelling? (None surfaced.)
2. Independent effectiveness evidence for CALI lessons specifically?
3. Legal-research-instruction pedagogy literature (problem-based, process-oriented) — empirically validated for law students?
4. How do desirable difficulties / spaced practice / segmenting interact in a single-page format for adult law learners?

---

### Full source list
- Freeman 2014 (PNAS): https://www.pnas.org/doi/10.1073/pnas.1319030111
- Chi & Wylie 2014 (ICAP): https://www.tandfonline.com/doi/abs/10.1080/00461520.2014.965823
- Mayer 2024 (CTML): https://link.springer.com/article/10.1007/s10648-023-09842-1
- Cromley & Chen 2025 (multimedia boundary conditions): https://www.sciencedirect.com/science/article/pii/S1747938X25000673
- Kenney & Bailey 2021 (retrieval practice): https://scholarworks.iu.edu/journals/index.php/josotl/article/view/28650
- Burch et al. 2019 via JLE (experiential legal ed): https://jle.aals.org/cgi/viewcontent.cgi?article=3266&context=home
- ABA Standard 314: https://www.americanbar.org/groups/legal_education/about/committees/outcomes-assessments/about/
- CALI Lessons: https://www.cali.org/content/cali-lessons
- WCAG 2.2: https://www.w3.org/TR/WCAG22/ · https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- UDL (CAST): https://udlguidelines.cast.org/
- ICAP critique (npj Science of Learning 2023): https://www.nature.com/articles/s41539-023-00197-4
- Distill, interactive articles: https://distill.pub/2020/communicating-with-interactive-articles/

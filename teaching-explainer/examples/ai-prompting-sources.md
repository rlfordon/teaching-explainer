# Sources — AI-prompting explainer

Companion to `ai-prompting.html`. Every non-obvious claim in the explainer traces to one of these.
**Currency:** compiled June 2026. The platform features and the empirical error figures move quickly —
reconfirm against the primary/vendor source before relying on specifics.

## Durable prompting principles (general)
- **Reasoning models + chain-of-thought now often redundant; context placement (U-curve); structured output; decomposition.**
  - *Every AI Prompting Technique That Works on Reasoning Models (2026)* — https://karozieminski.substack.com/p/ai-prompting-techniques-reasoning-models-2026
  - *Prompt Engineering Best Practices 2026* (PE Collective) — https://pecollective.com/blog/prompt-engineering-best-practices/
  - *Prompt engineering techniques: Top 6 for 2026* (K2view) — https://www.k2view.com/blog/prompt-engineering-techniques/
  - Claim used: explicit "think step by step" can degrade reasoning-model output and is best reserved for cheaper non-reasoning models; role-play ("you are an expert") and tip/threat tricks are unreliable; put critical instructions first/last, not buried mid-prompt.

## Legal platform layer (date-stamped June 2026)
- **Lexis+ AI / Protégé** — Ask (grounded answer to a legal question) vs. guided research (editable step-by-step plan); legal questions only; verify everything.
  - LexisNexis product page — https://www.lexisnexis.com/en-us/products/lexis-plus-protege.page
  - USC Gould Law Library, Generative AI & Legal Research (Lexis) — https://lawlibguides.usc.edu/c.php?g=1447399&p=10757499
  - Widener Law (prompt creation resources) — https://libguides.law.widener.edu/c.php?g=1342893&p=10030713
- **Westlaw CoCounsel / AI-Assisted Research** — focused legal question + material facts; avoid Boolean-style "find cases that…" and proper names; accelerant, not a replacement.
  - USC Gould Law Library, Westlaw AI tools — https://lawlibguides.usc.edu/c.php?g=1447399&p=10757364
  - Suffolk Moakley Law Library, CoCounsel & Practical Law AI — https://lawguides.suffolk.edu/AIFac/CoCounsel
- **vLex Vincent** — converts one query into multiple searches across cases/statutes/secondary sources; hyperlinks every authority to the quoted passage; states when it can't find real support.
  - vLex, How It Works: Generative AI — https://vlex.com/news/How-It-Works-Generative-AI
  - Lawyerist, Vincent AI Review (2026) — https://lawyerist.com/reviews/artificial-intelligence-in-law-firms/vincent-ai-review-artificial-intelligence-for-lawyers/

## Verification / why it matters
- **Error rates for purpose-built legal AI tools.** Stanford RegLab / HAI, "Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools" (reported in the *Journal of Empirical Legal Studies*, 2025): Lexis+ AI 17%+ and Westlaw AI-Assisted Research 34%+ of responses contained incorrect information; general-purpose LLMs 69–88% on legal queries. **Verify the exact current figures against the published study** — they were reported via secondary coverage as of June 2026.
- **Catalogue of AI-fabricated content in filings.** AI Hallucination Cases Database (Damien Charlotin) — https://www.damiencharlotin.com/hallucinations/ (1,300+ proceedings as of mid-2026).
- **Escalating sanctions.** Sterne Kessler, AI hallucinations in court filings — a 2025 review of sanctions — https://www.sternekessler.com/news-insights/insights/ai-ip-year-in-reviewai-hallucinations-in-court-filings-and-orders-a-2025-review-of-sanctions-across-the-courts-and-rule-proposals/ ; Scientific American, "Why lawyers keep citing fake cases invented by AI" — https://www.scientificamerican.com/article/why-lawyers-keep-citing-fake-cases-invented-by-ai/

## Notes for a future refresh
- Re-pull the Stanford figures from the primary study and cite the exact table.
- Platform UIs/feature names change — reconfirm Protégé / CoCounsel / Vincent specifics each semester.
- Consider adding your own institution's approved-tools policy and any course-specific platform.

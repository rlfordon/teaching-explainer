# teaching-explainer

An evidence-based [Claude](https://claude.com/claude-code) **skill** that generates accessible,
lightly-interactive single-page HTML **explainers** for teaching — built for law school (legal
research, legal technology, and doctrinal courses) but deliberately subject-agnostic, so it works
for any course and any instructor.

Every explainer it produces is:

- **Active by construction** — organized around the way *you* teach the topic, with hands-on
  interactions (predict-then-reveal, retrieval checks, self-explanation, sort/classify,
  step-throughs) rather than passive text.
- **Grounded in the learning-sciences evidence** — active learning, retrieval practice, Mayer's
  high-yield multimedia principles, and the ICAP framework, with the thin/contested evidence
  flagged honestly. See [`research/pedagogy-evidence-base.md`](research/pedagogy-evidence-base.md).
- **Accessible** — conforms to **WCAG 2.2 Level AA**, verified by an automated Playwright + axe
  test suite, with the manual checks that automation can't cover documented.
- **Portable and private** — a single self-contained `.html` file that works offline, drops into
  any LMS, and is purely self-check (nothing leaves the student's browser).

## What's in this repo

| Path | What it is |
|------|-----------|
| [`teaching-explainer/`](teaching-explainer/) | The skill itself — `SKILL.md` (the Phase 0–6 process), reference docs, the accessible component kit, and the edit overlay. See its [README](teaching-explainer/README.md) to install. |
| [`teaching-explainer/examples/ai-prompting.html`](teaching-explainer/examples/ai-prompting.html) | The first exemplar: an interactive explainer on **prompting AI for legal work** (general principles + Westlaw / Lexis / vLex specifics + verification). Built *with* the skill. |
| [`research/pedagogy-evidence-base.md`](research/pedagogy-evidence-base.md) | The cited pedagogy research the skill is built on. |
| [`docs/superpowers/specs/`](docs/superpowers/specs/) · [`docs/superpowers/plans/`](docs/superpowers/plans/) | The design spec and implementation plan. |
| [`test/`](test/) | Playwright + axe-core tests for the component kit (behavior + accessibility). |

## The component kit

The skill assembles explainers from a small set of reusable interaction components that are
accessible **by construction** (keyboard-operable, screen-reader-announced via ARIA live regions,
≥24×24px targets, visible focus, reduced-motion aware):

`predict-reveal` · `retrieval-mc` (with *why* feedback + retry) · `self-explain` ·
`classify` (keyboard-first, no drag required) · `step-through` · plus an accessible **Review & edit**
overlay for a non-technical revision loop.

## Try the exemplar

Download [`ai-prompting.html`](teaching-explainer/examples/ai-prompting.html) and open it in any
browser — no server, no build. Add `?edit` to the URL (or click **Review & edit**) to annotate it
and export a revision brief.

> The AI-prompting explainer is an educational exemplar. Its platform details and the empirical
> figures were current as of **June 2026** and should be reconfirmed — see
> [`ai-prompting-sources.md`](teaching-explainer/examples/ai-prompting-sources.md).

## Run the tests

```bash
npm install            # if this fails on an npmrc setting, add --min-release-age=0
npx playwright install chromium
npm test
```

## Acknowledgments

This skill stands on the shoulders of **[html-explainer](https://github.com/ds-vibe/html-explainer)
by Derek Schwede** (MIT) — the original "polished interactive HTML explainer" skill that inspired
this project. `teaching-explainer` deliberately *references* html-explainer for the generic build
craft (its visual system, quality loop, and helper scripts) rather than copying it, and adds the
evidence-based pedagogy spine, the accessible-by-construction component kit, and WCAG 2.2 AA
enforcement on top. Thank you, Derek.

Also inspired by Anthropic's write-up on
[the unreasonable effectiveness of HTML with Claude Code](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html).

## License

[MIT](./LICENSE) © 2026 Rebecca Fordon

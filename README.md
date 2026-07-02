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

**See them live: [examples gallery](https://rlfordon.github.io/teaching-explainer/)** — open, share, or drop any explainer into an LMS.

## What's in this repo

| Path | What it is |
|------|-----------|
| [`teaching-explainer/`](teaching-explainer/) | The skill itself — `SKILL.md` (the Phase 0–6 process), reference docs, the accessible component kit, and the edit overlay. See its [README](teaching-explainer/README.md) to install. |
| [`teaching-explainer/examples/`](teaching-explainer/examples/) | Interactive explainers built *with* the skill — see the **Examples** section below for live links. |
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

## Examples

Built with this skill and hosted on GitHub Pages — each is a self-contained `.html` file you can open, share, or drop into an LMS:

| Explainer | Focus | Live |
|---|---|---|
| Prompting AI for legal work | general prompting principles + Westlaw / Lexis / vLex specifics + verification | [open](https://rlfordon.github.io/teaching-explainer/teaching-explainer/examples/ai-prompting.html) |
| Boolean searching, without the traps | terms & connectors, a four-move method, and the common pitfalls | [open](https://rlfordon.github.io/teaching-explainer/teaching-explainer/examples/boolean-search.html) |

Source lives in [`teaching-explainer/examples/`](teaching-explainer/examples/). Open any explainer with `?edit` (or click **Review & edit**) to annotate it in place and export a revision brief.

> The AI-prompting explainer's platform details and empirical figures were current as of **June 2026** and should be reconfirmed ([sources](teaching-explainer/examples/ai-prompting-sources.md)); the Boolean explainer's connector syntax is Westlaw's and varies by platform.

## Run the tests

```bash
npm install            # if this fails on an npmrc setting, add --min-release-age=0
npx playwright install chromium
npm test
```

## Acknowledgments

This skill was **inspired by — and includes adapted portions of — [html-explainer](https://github.com/ds-vibe/html-explainer)
by Derek Schwede** (MIT). Its visual-design bar and quality loop
([`references/visual-and-quality.md`](teaching-explainer/references/visual-and-quality.md)) are
adapted from html-explainer's Phase 2 and Phase 4 under the MIT License — see
[`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md). Everything else — the evidence-based pedagogy
spine, the accessible-by-construction component kit, WCAG 2.2 AA enforcement, the edit overlay, and
the explainers — is original. `teaching-explainer` is **standalone**: it does not require
html-explainer, though it stays compatible with it. Thank you, Derek; this project wouldn't exist
without yours.

Also inspired by Anthropic's write-up on
[the unreasonable effectiveness of HTML with Claude Code](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html).

## License

[MIT](./LICENSE) © 2026 Rebecca Fordon

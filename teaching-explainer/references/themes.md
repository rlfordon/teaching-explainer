# Visual identity themes

Give **every explainer its own look.** Two explainers in the same course should not look like twins.
The component kit is deliberately style-free (it only carries behavior + a11y), so the page's visual
identity is entirely up to the `:root` token block — swapping it reskins the whole page, kit
components included.

**How to use this file (the "both" approach):**
1. **Start from a preset** below (or a bespoke subject-matched identity).
2. **Tweak the accent to the subject** — derive at least one accent from what the topic *is*, so the
   look isn't generic. Keep it tasteful: an accent, not a costume.
3. **Never clone a prior explainer's stylesheet.** If the last explainer for this course used
   preset A, use a different one (or a real subject-matched identity) for the next.
4. **Verify contrast** for whatever accent you land on (≥4.5:1 body, ≥3:1 large/UI — see
   `accessibility.md`).

Each preset is a palette + a type-pairing intent. Wire the palette into the page `:root` tokens
**and** the kit tokens (`--te-accent`, `--te-focus` = your accent; `--te-ink` = your ink). The two
example explainers show two of these in practice.

---

## Preset A — Editorial navy  *(used by the AI-prompting example)*

Authoritative, editorial, "serious reading." Serif display over clean sans.

```
--paper:#fcfcfa; --ink:#17181b; --muted:#586070; --line:#e7e6e0; --band:#f4f3ee;
--accent:#1d4ed8; --accent-ink:#1b3aa8; --accent-tint:#eef2ff;   /* navy */
--secondary:#845c00; --secondary-tint:#fbf3df;                   /* gold, for the "try it" pill */
display font: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif
body font:    system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
```

## Preset B — Technical teal  *(used by the Boolean example)*

Precise, logical, modern. **Sans** display (heavier weight, tight tracking) over sans; mono-tinted
code/query blocks. Good for procedural / systems / how-it-works topics.

```
--paper:#f8fbfb; --ink:#0f1720; --muted:#4b5563; --line:#e3e8ec; --band:#edf4f3;
--accent:#0f766e; --accent-ink:#115e59; --accent-tint:#d7f2ee;   /* teal */
--secondary:#c2410c; --secondary-tint:#fff1ea;                   /* coral */
display font: "Segoe UI", system-ui, -apple-system, Roboto, sans-serif   (h1 800 / h2–h4 700)
body font:    system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
```

## Preset C — Warm scholarly

Bookish, humane, doctrinal. Serif display + serif or sans body; parchment paper. Good for history,
doctrine, ethics, close-reading topics.

```
--paper:#faf6ef; --ink:#26201a; --muted:#6b5d4f; --line:#e6ddcd; --band:#f2ebdd;
--accent:#8a1f2b; --accent-ink:#6f1620; --accent-tint:#f6e7e6;   /* burgundy (or forest #1f5136) */
--secondary:#1f5136; --secondary-tint:#e8f0ea;                   /* forest */
display font: Georgia, "Iowan Old Style", "Times New Roman", serif
body font:    Georgia, Charter, "Iowan Old Style", serif   (or a clean sans for body)
```

## Preset D — Slate minimalist

Clean, contemporary, low-chroma. Grotesk sans display + sans body; lots of white. Good for
frameworks, policy, comparative/analytical topics.

```
--paper:#ffffff; --ink:#0f172a; --muted:#475569; --line:#e2e8f0; --band:#f1f5f9;
--accent:#4338ca; --accent-ink:#3730a3; --accent-tint:#eef2ff;   /* indigo */
--secondary:#0d9488; --secondary-tint:#e6faf6;                   /* teal */
display font: system-ui, "Segoe UI", Roboto, Helvetica, sans-serif   (heavy weight)
body font:    system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
```

## Subject-matched (the highest bar)

Derive the identity from what the topic *is* — not just era or vibe. A citation-anatomy topic might
foreground a monospace motif; a topic about redlining might use map/parcel greens. Relevant beats
decorative; apply as an accent (hero + one signature element), keep body and controls clean and
readable. When in doubt, a preset beats a forced theme.

---

**Note on fonts.** Prefer system-font stacks so the file stays offline and makes no network calls.
The biggest cheap levers for a distinct feel are: **serif vs. sans display**, the **accent hue**,
**paper tint**, and **section treatment** (full-bleed bands vs. left rules vs. inset cards).

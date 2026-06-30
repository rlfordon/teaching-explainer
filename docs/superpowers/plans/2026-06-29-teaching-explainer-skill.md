# teaching-explainer Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained Claude skill (`teaching-explainer`) that generates single-file, accessible, evidence-based interactive HTML explainers for any class, reusing `html-explainer` for generic build craft.

**Architecture:** A process skill (SKILL.md + reference docs) plus an accessible-by-construction interaction component kit (`components.css` + `components.js`) and an a11y-hardened edit overlay (`review-mode.js`). The kit is data-attribute-driven progressive enhancement: on load, it scans the DOM for `data-te="<component>"` and wires up behavior, ARIA, keyboard support, and screen-reader announcements. Components are verified with Playwright + axe-core so the WCAG 2.2 AA promise is enforced by automated test, not by hope. The skill references `html-explainer`'s Phase 2/4 and its `assemble.mjs`/`shoot.mjs` scripts rather than copying them.

**Tech Stack:** Vanilla JS (ES modules, no framework) + hand-rolled CSS with design tokens; Node 18+; Playwright Test (`@playwright/test`) + `@axe-core/playwright` for component/a11y tests; Markdown for the skill + references. Output explainers are single-file vanilla HTML/CSS/JS.

## Global Constraints

- **Output target:** every generated explainer is a single self-contained `.html` file; vanilla JS/CSS only; opens offline; no build step required to view.
- **Privacy:** purely self-check — no network calls from generated explainers, no response data leaves the browser, no backend.
- **Accessibility floor:** WCAG 2.2 **Level AA**. Non-negotiable per-component: keyboard operable (2.1.1), visible focus (2.4.7), text alternatives (1.1.1), target size ≥24×24 CSS px (2.5.8), drag has a single-pointer alternative (2.5.7), contrast ≥4.5:1 body / ≥3:1 large verified per surface, `prefers-reduced-motion` respected, feedback announced via ARIA live regions.
- **No "learning styles":** the skill must never profile a learner and adapt to a diagnosed style. Use UDL multiple-means-of-representation instead.
- **Pedagogy spine (opinionated default, explicit override):** clear organizing structure fit to content (framework OR mental model OR sequence, never forced); ≥1 Constructive interaction per key concept; ≥2 *spaced* retrieval checks with instant right/wrong + one-line *why* + retry; coherence/cut-decoration; conversational prose + words paired with relevant visuals; every interaction's feedback teaches.
- **Referencing discipline:** reuse `html-explainer` in place (`~/.claude/skills/html-explainer/scripts/{assemble,shoot}.mjs`, its Phase 2 visual system, its Phase 4 quality loop). Copy as little as possible. Soft dependency: degrade gracefully if absent.
- **Naming:** all component hooks use the `data-te="…"` / `data-te-*` namespace and `.te-*` CSS classes to avoid collisions with host-page styles.
- **Browser-capability check before Playwright:** run `npx playwright install chromium` only after confirming a browser can run; in a sandbox, skip browser tests and say so.

---

## File Structure

```
html-pedagogy/                       # repo root (already a git repo on main)
  package.json                       # dev deps + test scripts (root-level tooling)
  playwright.config.js               # Playwright Test config (component tests)
  teaching-explainer/                # THE SKILL PACKAGE (installable)
    SKILL.md                         # the process (Phase 0–6)
    README.md                        # install, soft-dependency, "referenced vs owned" sync notes
    references/
      pedagogy.md                    # evidence base → enforceable rules
      accessibility.md               # WCAG 2.2 AA checklist for interactive ed content
      instructor-framework.md        # organizing-structure intake guidance
    assets/
      components.css                 # kit styles + design tokens
      components.js                  # kit behavior (data-attribute driven)
      review-mode.js                 # a11y-hardened edit overlay
    examples/                        # (exemplar lands here in Phase 7, gated)
  test/
    fixtures/                        # tiny HTML pages that load the kit, one per component
    components/                      # Playwright specs, one per component
    helpers/
      axe.js                         # shared axe-core runner
```

Each component is one CSS block + one JS init function + one fixture + one spec — added or changed in isolation.

---

## Task 1: Repo tooling + test harness

**Files:**
- Create: `package.json`
- Create: `playwright.config.js`
- Create: `test/helpers/axe.js`
- Create: `teaching-explainer/assets/components.css` (empty token stub)
- Create: `teaching-explainer/assets/components.js` (empty init stub)
- Create: `test/fixtures/_template.html`
- Create: `test/components/smoke.spec.js`

**Interfaces:**
- Produces: `window.TE.init(root = document)` — the kit's entry point; scans `root` for `[data-te]` and initializes each. Returns the count initialized. Called automatically on `DOMContentLoaded`.
- Produces: `runAxe(page, selector)` helper returning the axe results object (`{ violations: [] }` on pass).

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "teaching-explainer-dev",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.10.0",
    "@playwright/test": "^1.48.0"
  }
}
```

- [ ] **Step 2: Install deps and the browser**

Run: `npm install && npx playwright install chromium`
Expected: install completes; `npx playwright --version` prints a version. (If in a sandbox where Chromium cannot run, stop and report — component tests require it.)

- [ ] **Step 3: Create `playwright.config.js`**

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/components',
  use: { headless: true },
  reporter: 'list',
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

- [ ] **Step 4: Create `test/helpers/axe.js`**

```javascript
import { AxeBuilder } from '@axe-core/playwright';

// Run axe against `selector`, restricted to WCAG 2.2 A/AA rules.
export async function runAxe(page, selector) {
  return new AxeBuilder({ page })
    .include(selector)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
}
```

- [ ] **Step 5: Create the kit stubs**

`teaching-explainer/assets/components.css`:
```css
:root {
  /* Design tokens — overridable per explainer. Contrast verified in tests. */
  --te-ink: #1a1a1a;
  --te-bg: #ffffff;
  --te-accent: #1d4ed8;          /* 7.0:1 on white */
  --te-correct: #1b5e20;         /* 8.3:1 on white */
  --te-incorrect: #b00020;       /* 5.9:1 on white */
  --te-focus: #1d4ed8;
  --te-radius: 8px;
  --te-gap: 12px;
}
.te-component { color: var(--te-ink); }
.te-sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
*:focus-visible { outline: 3px solid var(--te-focus); outline-offset: 2px; }
.te-btn { min-height: 44px; min-width: 44px; padding: 10px 16px; border-radius: var(--te-radius);
  font: inherit; cursor: pointer; }
@media (prefers-reduced-motion: reduce) {
  .te-component * { animation: none !important; transition: none !important; }
}
```

`teaching-explainer/assets/components.js`:
```javascript
// teaching-explainer interaction kit. Data-attribute driven; no dependencies.
// Public API: window.TE.init(root). Auto-runs on DOMContentLoaded.
(function () {
  const registry = {}; // name -> init(el)

  function init(root) {
    const scope = root || document;
    const els = scope.querySelectorAll('[data-te]');
    let n = 0;
    els.forEach((el) => {
      const name = el.getAttribute('data-te');
      if (registry[name] && !el.dataset.teReady) {
        registry[name](el);
        el.dataset.teReady = '1';
        n++;
      }
    });
    return n;
  }

  window.TE = { init, _registry: registry };
  document.addEventListener('DOMContentLoaded', () => init(document));
})();
```

- [ ] **Step 6: Create `test/fixtures/_template.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TE fixture</title>
  <link rel="stylesheet" href="../../teaching-explainer/assets/components.css">
</head>
<body>
  <main id="root"><!-- component markup injected per spec --></main>
  <script src="../../teaching-explainer/assets/components.js"></script>
</body>
</html>
```

- [ ] **Step 7: Write the smoke spec**

`test/components/smoke.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const fixture = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/_template.html'
);

test('kit exposes TE.init and runs on load', async ({ page }) => {
  await page.goto('file://' + fixture);
  const hasInit = await page.evaluate(() => typeof window.TE?.init === 'function');
  expect(hasInit).toBe(true);
});
```

- [ ] **Step 8: Run the smoke test**

Run: `npm test -- smoke`
Expected: 1 passed.

- [ ] **Step 9: Commit**

```bash
git add package.json playwright.config.js test teaching-explainer/assets
git commit -m "chore: scaffold teaching-explainer kit + Playwright/axe harness"
```

---

## Task 2: `predict-reveal` component

The core Constructive move: the learner commits a prediction, then reveals the answer and self-compares.

**Files:**
- Modify: `teaching-explainer/assets/components.js` (register `predict-reveal`)
- Modify: `teaching-explainer/assets/components.css` (add `.te-pr-*` styles)
- Create: `test/fixtures/predict-reveal.html`
- Create: `test/components/predict-reveal.spec.js`

**Interfaces:**
- Consumes: `window.TE._registry` (from Task 1).
- Markup contract:
  ```html
  <div data-te="predict-reveal" class="te-component">
    <p class="te-pr-prompt" id="pr1">Predict the court's holding, then reveal.</p>
    <label class="te-sr-only" for="pr1-input">Your prediction</label>
    <textarea id="pr1-input" class="te-pr-input" aria-labelledby="pr1"></textarea>
    <button type="button" class="te-btn te-pr-reveal" aria-expanded="false">Reveal answer</button>
    <div class="te-pr-answer" hidden>The court held that…</div>
  </div>
  ```
- Produces (behavior): clicking reveal sets `aria-expanded="true"`, unhides `.te-pr-answer`, moves focus to the answer (which gets `tabindex="-1"`), and announces "Answer revealed" via a kit live region.

- [ ] **Step 1: Add a shared live-region helper to `components.js`** (insert above `function init`)

```javascript
  function announce(msg) {
    let live = document.getElementById('te-live');
    if (!live) {
      live = document.createElement('div');
      live.id = 'te-live';
      live.className = 'te-sr-only';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('role', 'status');
      document.body.appendChild(live);
    }
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = msg; });
  }
```

- [ ] **Step 2: Register the component in `components.js`** (insert before `window.TE = …`)

```javascript
  registry['predict-reveal'] = function (el) {
    const btn = el.querySelector('.te-pr-reveal');
    const answer = el.querySelector('.te-pr-answer');
    if (!btn || !answer) return;
    answer.setAttribute('tabindex', '-1');
    btn.addEventListener('click', () => {
      answer.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.disabled = true;
      answer.focus();
      announce('Answer revealed');
    });
  };
```

- [ ] **Step 3: Add styles to `components.css`**

```css
.te-pr-input { display: block; width: 100%; min-height: 80px; margin: var(--te-gap) 0;
  font: inherit; padding: 8px; border: 1px solid #6b7280; border-radius: var(--te-radius); }
.te-pr-reveal[aria-expanded="true"] { opacity: .6; }
.te-pr-answer { margin-top: var(--te-gap); padding: 12px; border-left: 4px solid var(--te-accent);
  background: #f3f4f6; color: var(--te-ink); }
```

- [ ] **Step 4: Create `test/fixtures/predict-reveal.html`** — copy `_template.html` and inject the markup contract above into `#root`.

- [ ] **Step 5: Write the failing spec**

`test/components/predict-reveal.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/predict-reveal.html');

test('answer hidden until reveal; reveal updates state, focus, a11y', async ({ page }) => {
  await page.goto(fixture);
  const answer = page.locator('.te-pr-answer');
  await expect(answer).toBeHidden();

  const btn = page.locator('.te-pr-reveal');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await btn.click();

  await expect(answer).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(answer).toBeFocused();
});

test('keyboard: reveal is operable via Enter', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-pr-reveal').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.te-pr-answer')).toBeVisible();
});

test('no axe violations before and after reveal', async ({ page }) => {
  await page.goto(fixture);
  expect((await runAxe(page, '#root')).violations).toEqual([]);
  await page.locator('.te-pr-reveal').click();
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
```

- [ ] **Step 6: Run to verify (it should pass — implementation done in steps 1–3)**

Run: `npm test -- predict-reveal`
Expected: 3 passed. (If a step was skipped, the failure names which behavior is missing — fix and re-run.)

- [ ] **Step 7: Commit**

```bash
git add teaching-explainer/assets test/fixtures/predict-reveal.html test/components/predict-reveal.spec.js
git commit -m "feat: predict-reveal component (a11y verified)"
```

---

## Task 3: `retrieval-mc` component (spaced retrieval check)

Multiple-choice retrieval check with instant right/wrong, a one-line *why*, retry, and a running tally.

**Files:**
- Modify: `teaching-explainer/assets/components.js` (register `retrieval-mc`)
- Modify: `teaching-explainer/assets/components.css` (`.te-mc-*`)
- Create: `test/fixtures/retrieval-mc.html`
- Create: `test/components/retrieval-mc.spec.js`

**Interfaces:**
- Consumes: `announce`, `registry` (Task 1–2).
- Markup contract:
  ```html
  <fieldset data-te="retrieval-mc" class="te-component te-mc"
            data-answer="1" data-why="Secondary sources orient you before primary search.">
    <legend>Where should you usually start unfamiliar research?</legend>
    <label class="te-mc-opt"><input type="radio" name="q1" value="0"> Primary statutes</label>
    <label class="te-mc-opt"><input type="radio" name="q1" value="1"> A secondary source</label>
    <button type="button" class="te-btn te-mc-check">Check answer</button>
    <p class="te-mc-feedback" role="status" aria-live="polite"></p>
  </fieldset>
  ```
- Produces: after a check, `.te-mc-feedback` shows "Correct — <why>" or "Not quite — try again." (wrong answers stay retryable); a `data-te-tally` element on the page (if present) updates `correct/total`.

- [ ] **Step 1: Register the component in `components.js`**

```javascript
  registry['retrieval-mc'] = function (el) {
    const correct = el.getAttribute('data-answer');
    const why = el.getAttribute('data-why') || '';
    const check = el.querySelector('.te-mc-check');
    const fb = el.querySelector('.te-mc-feedback');
    let solved = false;
    check.addEventListener('click', () => {
      const picked = el.querySelector('input[type="radio"]:checked');
      if (!picked) { fb.textContent = 'Select an answer first.'; return; }
      if (picked.value === correct) {
        if (!solved) { solved = true; bumpTally(true); }
        fb.className = 'te-mc-feedback te-correct';
        fb.textContent = 'Correct — ' + why;
      } else {
        if (!solved) bumpTally(false, el);
        fb.className = 'te-mc-feedback te-incorrect';
        fb.textContent = 'Not quite — try again.';
      }
    });
  };

  const counted = new WeakSet();
  function bumpTally(isCorrect, el) {
    const tally = document.querySelector('[data-te-tally]');
    if (!tally) return;
    if (el) { if (counted.has(el)) return; counted.add(el); }
    const c = +(tally.dataset.correct || 0) + (isCorrect ? 1 : 0);
    const t = +(tally.dataset.total || 0) + 1;
    tally.dataset.correct = c; tally.dataset.total = t;
    tally.textContent = `Score: ${c} / ${t}`;
  }
```

(Note: the first correct answer increments `correct` and `total`; a first wrong attempt increments `total` once via the `el` guard so retries don't inflate the denominator.)

- [ ] **Step 2: Add styles to `components.css`**

```css
.te-mc { border: 1px solid #6b7280; border-radius: var(--te-radius); padding: 16px; }
.te-mc-opt { display: block; min-height: 44px; padding: 8px 4px; }
.te-mc-feedback:empty { display: none; }
.te-correct { color: var(--te-correct); font-weight: 600; }
.te-incorrect { color: var(--te-incorrect); font-weight: 600; }
```

- [ ] **Step 3: Create `test/fixtures/retrieval-mc.html`** — `_template.html` with the markup contract injected, plus `<p data-te-tally data-correct="0" data-total="0"></p>` after the fieldset.

- [ ] **Step 4: Write the spec**

`test/components/retrieval-mc.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/retrieval-mc.html');

test('wrong answer is retryable; right answer shows why', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('input[value="0"]').check();
  await page.locator('.te-mc-check').click();
  await expect(page.locator('.te-mc-feedback')).toHaveText(/Not quite/);

  await page.locator('input[value="1"]').check();
  await page.locator('.te-mc-check').click();
  await expect(page.locator('.te-mc-feedback')).toHaveText(/Correct — Secondary sources/);
});

test('check with no selection prompts a selection', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-mc-check').click();
  await expect(page.locator('.te-mc-feedback')).toHaveText(/Select an answer/);
});

test('tally counts each question once (denominator stable across retries)', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('input[value="0"]').check();
  await page.locator('.te-mc-check').click();           // wrong → total becomes 1
  await page.locator('input[value="1"]').check();
  await page.locator('.te-mc-check').click();           // right → correct becomes 1
  await expect(page.locator('[data-te-tally]')).toHaveText('Score: 1 / 1');
});

test('no axe violations after feedback shown', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('input[value="1"]').check();
  await page.locator('.te-mc-check').click();
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
```

- [ ] **Step 5: Run**

Run: `npm test -- retrieval-mc`
Expected: 4 passed.

- [ ] **Step 6: Commit**

```bash
git add teaching-explainer/assets test/fixtures/retrieval-mc.html test/components/retrieval-mc.spec.js
git commit -m "feat: retrieval-mc component with why + retry + tally"
```

---

## Task 4: `self-explain` component

Free-text self-explanation, then reveal an expert model answer to self-compare. Reveal is enabled only after the learner writes something (encourages generation before seeing the answer).

**Files:**
- Modify: `teaching-explainer/assets/components.js`
- Modify: `teaching-explainer/assets/components.css`
- Create: `test/fixtures/self-explain.html`
- Create: `test/components/self-explain.spec.js`

**Interfaces:**
- Markup contract:
  ```html
  <div data-te="self-explain" class="te-component">
    <label for="se1" class="te-se-q">Why did the grounded prompt beat the open one?</label>
    <textarea id="se1" class="te-se-input"></textarea>
    <button type="button" class="te-btn te-se-reveal" disabled aria-disabled="true">
      Reveal model answer</button>
    <div class="te-se-model" hidden>Because grounding constrains the model to cited sources…</div>
  </div>
  ```
- Produces: typing non-whitespace enables the reveal button (`disabled` removed, `aria-disabled="false"`); clicking reveals the model answer, moves focus to it, announces.

- [ ] **Step 1: Register in `components.js`**

```javascript
  registry['self-explain'] = function (el) {
    const input = el.querySelector('.te-se-input');
    const btn = el.querySelector('.te-se-reveal');
    const model = el.querySelector('.te-se-model');
    model.setAttribute('tabindex', '-1');
    input.addEventListener('input', () => {
      const ready = input.value.trim().length > 0;
      btn.disabled = !ready;
      btn.setAttribute('aria-disabled', String(!ready));
    });
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      model.hidden = false; model.focus(); announce('Model answer revealed');
    });
  };
```

- [ ] **Step 2: Styles**

```css
.te-se-q { display:block; font-weight:600; margin-bottom: var(--te-gap); }
.te-se-input { display:block; width:100%; min-height:90px; font:inherit; padding:8px;
  border:1px solid #6b7280; border-radius:var(--te-radius); margin-bottom: var(--te-gap); }
.te-se-reveal[disabled] { opacity:.5; cursor:not-allowed; }
.te-se-model { margin-top: var(--te-gap); padding:12px; border-left:4px solid var(--te-accent);
  background:#f3f4f6; }
```

- [ ] **Step 3: Create `test/fixtures/self-explain.html`** from `_template.html` + contract markup.

- [ ] **Step 4: Spec**

`test/components/self-explain.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/self-explain.html');

test('reveal disabled until learner writes; then reveals model answer', async ({ page }) => {
  await page.goto(fixture);
  const btn = page.locator('.te-se-reveal');
  await expect(btn).toBeDisabled();
  await page.locator('.te-se-input').fill('grounding limits hallucination');
  await expect(btn).toBeEnabled();
  await btn.click();
  await expect(page.locator('.te-se-model')).toBeVisible();
  await expect(page.locator('.te-se-model')).toBeFocused();
});

test('whitespace-only input does not enable reveal', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-se-input').fill('    ');
  await expect(page.locator('.te-se-reveal')).toBeDisabled();
});

test('no axe violations', async ({ page }) => {
  await page.goto(fixture);
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
```

- [ ] **Step 5: Run**

Run: `npm test -- self-explain`
Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add teaching-explainer/assets test/fixtures/self-explain.html test/components/self-explain.spec.js
git commit -m "feat: self-explain component (write-then-reveal)"
```

---

## Task 5: `classify` component (keyboard-first, drag optional)

Assign items to categories (e.g., sort authorities primary vs. secondary). The **primary** interaction is click/keyboard: select an item, then activate a category button. This satisfies 2.5.7 (no drag required). Drag is out of scope for v1 to keep the non-drag path the canonical one.

**Files:**
- Modify: `teaching-explainer/assets/components.js`
- Modify: `teaching-explainer/assets/components.css`
- Create: `test/fixtures/classify.html`
- Create: `test/components/classify.spec.js`

**Interfaces:**
- Markup contract:
  ```html
  <div data-te="classify" class="te-component te-cl">
    <ul class="te-cl-items">
      <li><button type="button" class="te-btn te-cl-item" data-cat="secondary">A law review article</button></li>
      <li><button type="button" class="te-btn te-cl-item" data-cat="primary">A state statute</button></li>
    </ul>
    <div class="te-cl-cats">
      <button type="button" class="te-btn te-cl-cat" data-cat="primary">Primary</button>
      <button type="button" class="te-btn te-cl-cat" data-cat="secondary">Secondary</button>
    </div>
    <p class="te-cl-feedback" role="status" aria-live="polite"></p>
  </div>
  ```
- Behavior: click an item → it becomes "selected" (`aria-pressed="true"`, only one at a time); click a category → if item's `data-cat` matches, mark item done (`aria-disabled`, visually placed/checked) and announce "Correct"; else announce "Not quite — <item> is not <category>". When all items are done, feedback shows "All sorted."

- [ ] **Step 1: Register in `components.js`**

```javascript
  registry['classify'] = function (el) {
    const items = [...el.querySelectorAll('.te-cl-item')];
    const cats = [...el.querySelectorAll('.te-cl-cat')];
    const fb = el.querySelector('.te-cl-feedback');
    let selected = null;
    items.forEach((it) => {
      it.setAttribute('aria-pressed', 'false');
      it.addEventListener('click', () => {
        if (it.getAttribute('aria-disabled') === 'true') return;
        items.forEach((o) => o.setAttribute('aria-pressed', 'false'));
        it.setAttribute('aria-pressed', 'true');
        selected = it;
      });
    });
    cats.forEach((cat) => {
      cat.addEventListener('click', () => {
        if (!selected) { fb.textContent = 'Select an item first.'; return; }
        const want = selected.getAttribute('data-cat');
        if (want === cat.getAttribute('data-cat')) {
          selected.setAttribute('aria-disabled', 'true');
          selected.setAttribute('aria-pressed', 'false');
          selected.classList.add('te-cl-done');
          fb.className = 'te-cl-feedback te-correct';
          fb.textContent = items.every((i) => i.getAttribute('aria-disabled') === 'true')
            ? 'All sorted.' : 'Correct.';
          selected = null;
        } else {
          fb.className = 'te-cl-feedback te-incorrect';
          fb.textContent = 'Not quite — that item is not ' + cat.textContent.toLowerCase() + '.';
        }
      });
    });
  };
```

- [ ] **Step 2: Styles**

```css
.te-cl-items { list-style:none; padding:0; display:flex; flex-wrap:wrap; gap: var(--te-gap); }
.te-cl-item[aria-pressed="true"] { outline: 3px solid var(--te-accent); }
.te-cl-item.te-cl-done { background:#e8f5e9; color: var(--te-correct); }
.te-cl-cats { display:flex; gap: var(--te-gap); margin: var(--te-gap) 0; }
.te-cl-feedback:empty { display:none; }
```

- [ ] **Step 3: Create `test/fixtures/classify.html`** from `_template.html` + contract markup.

- [ ] **Step 4: Spec**

`test/components/classify.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/classify.html');

test('correct classification via keyboard; wrong is corrected', async ({ page }) => {
  await page.goto(fixture);
  const article = page.locator('.te-cl-item', { hasText: 'law review' });
  await article.click();
  await expect(article).toHaveAttribute('aria-pressed', 'true');

  await page.locator('.te-cl-cat', { hasText: 'Primary' }).click();   // wrong
  await expect(page.locator('.te-cl-feedback')).toHaveText(/Not quite/);

  await page.locator('.te-cl-cat', { hasText: 'Secondary' }).click(); // right
  await expect(article).toHaveAttribute('aria-disabled', 'true');
});

test('category click with nothing selected prompts selection', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-cl-cat', { hasText: 'Primary' }).click();
  await expect(page.locator('.te-cl-feedback')).toHaveText(/Select an item/);
});

test('sorting all items shows completion; no axe violations', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('.te-cl-item', { hasText: 'law review' }).click();
  await page.locator('.te-cl-cat', { hasText: 'Secondary' }).click();
  await page.locator('.te-cl-item', { hasText: 'statute' }).click();
  await page.locator('.te-cl-cat', { hasText: 'Primary' }).click();
  await expect(page.locator('.te-cl-feedback')).toHaveText('All sorted.');
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
```

- [ ] **Step 5: Run**

Run: `npm test -- classify`
Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add teaching-explainer/assets test/fixtures/classify.html test/components/classify.spec.js
git commit -m "feat: classify component (keyboard-first, 2.5.7 compliant)"
```

---

## Task 6: `step-through` component

Advance through ordered steps (e.g., walking a research process or building a prompt), one visible at a time, with prev/next, a progress indicator, and focus moved to each step's heading on advance.

**Files:**
- Modify: `teaching-explainer/assets/components.js`
- Modify: `teaching-explainer/assets/components.css`
- Create: `test/fixtures/step-through.html`
- Create: `test/components/step-through.spec.js`

**Interfaces:**
- Markup contract:
  ```html
  <div data-te="step-through" class="te-component te-st">
    <p class="te-st-progress" role="status" aria-live="polite"></p>
    <ol class="te-st-steps">
      <li class="te-st-step"><h3 tabindex="-1">Step 1</h3><p>Identify the issue.</p></li>
      <li class="te-st-step"><h3 tabindex="-1">Step 2</h3><p>Find a secondary source.</p></li>
    </ol>
    <div class="te-st-nav">
      <button type="button" class="te-btn te-st-prev">Back</button>
      <button type="button" class="te-btn te-st-next">Next</button>
    </div>
  </div>
  ```
- Behavior: only the current step is visible; `Back` disabled on first, `Next` disabled on last; progress shows "Step N of M"; advancing moves focus to the new step's `h3`.

- [ ] **Step 1: Register in `components.js`**

```javascript
  registry['step-through'] = function (el) {
    const steps = [...el.querySelectorAll('.te-st-step')];
    const prog = el.querySelector('.te-st-progress');
    const prev = el.querySelector('.te-st-prev');
    const next = el.querySelector('.te-st-next');
    let i = 0;
    function render(focus) {
      steps.forEach((s, j) => { s.hidden = j !== i; });
      prog.textContent = `Step ${i + 1} of ${steps.length}`;
      prev.disabled = i === 0;
      next.disabled = i === steps.length - 1;
      if (focus) steps[i].querySelector('h3').focus();
    }
    prev.addEventListener('click', () => { if (i > 0) { i--; render(true); } });
    next.addEventListener('click', () => { if (i < steps.length - 1) { i++; render(true); } });
    render(false);
  };
```

- [ ] **Step 2: Styles**

```css
.te-st-step[hidden] { display:none; }
.te-st-nav { display:flex; gap: var(--te-gap); margin-top: var(--te-gap); }
.te-st-prev[disabled], .te-st-next[disabled] { opacity:.5; cursor:not-allowed; }
```

- [ ] **Step 3: Create `test/fixtures/step-through.html`** from `_template.html` + contract markup.

- [ ] **Step 4: Spec**

`test/components/step-through.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/step-through.html');

test('shows one step, advances, moves focus, bounds buttons', async ({ page }) => {
  await page.goto(fixture);
  await expect(page.locator('.te-st-progress')).toHaveText('Step 1 of 2');
  await expect(page.locator('.te-st-prev')).toBeDisabled();

  await page.locator('.te-st-next').click();
  await expect(page.locator('.te-st-progress')).toHaveText('Step 2 of 2');
  await expect(page.locator('.te-st-step').nth(1).locator('h3')).toBeFocused();
  await expect(page.locator('.te-st-next')).toBeDisabled();
});

test('no axe violations on each step', async ({ page }) => {
  await page.goto(fixture);
  expect((await runAxe(page, '#root')).violations).toEqual([]);
  await page.locator('.te-st-next').click();
  expect((await runAxe(page, '#root')).violations).toEqual([]);
});
```

- [ ] **Step 5: Run**

Run: `npm test -- step-through`
Expected: 2 passed.

- [ ] **Step 6: Commit**

```bash
git add teaching-explainer/assets test/fixtures/step-through.html test/components/step-through.spec.js
git commit -m "feat: step-through component with progress + focus management"
```

---

## Task 7: a11y-hardened `review-mode.js` edit overlay

Port the edit overlay (Preview / Edit text / Add note / Copy notes for LLM / Download edits) into a copy we own and make it WCAG 2.2 AA: keyboard-operable launcher and panel, focus trap while open, `Esc` to close, focus restored on close, visible focus, ≥24px controls. Activated by `?edit` or `<body data-review-toggle>`.

**Files:**
- Create: `teaching-explainer/assets/review-mode.js`
- Create: `test/fixtures/review-mode.html`
- Create: `test/components/review-mode.spec.js`

**Interfaces:**
- Reference (do not copy blindly): `~/.claude/skills/html-explainer/scripts/review-mode.js` (read it first to preserve the export/notes feature set and the `?edit` / `data-review-toggle` activation contract).
- Produces: a launcher button `[data-te-review-launch]`; opening shows a dialog `role="dialog" aria-modal="true"` with the three modes; `window.TEReview.open()` / `.close()` for tests.

- [ ] **Step 1: Read the upstream overlay** to capture its feature set and activation contract.

Run: `cat "$HOME/.claude/skills/html-explainer/scripts/review-mode.js" | head -120`
Expected: see how it injects UI, exports notes, and reads `?edit` / `data-review-toggle`. (If the file is absent, build from the contract in this task and note the soft dependency in README.)

- [ ] **Step 2: Write the failing spec first**

`test/components/review-mode.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { runAxe } from '../helpers/axe.js';

const fixture = 'file://' + path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '../fixtures/review-mode.html');

test('launcher opens an aria-modal dialog; Esc closes and restores focus', async ({ page }) => {
  await page.goto(fixture);
  const launch = page.locator('[data-te-review-launch]');
  await launch.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(launch).toBeFocused();
});

test('focus is trapped inside the dialog while open', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('[data-te-review-launch]').click();
  const focusedInDialog = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d.contains(document.activeElement);
  });
  expect(focusedInDialog).toBe(true);
});

test('no axe violations with dialog open', async ({ page }) => {
  await page.goto(fixture);
  await page.locator('[data-te-review-launch]').click();
  expect((await runAxe(page, 'body')).violations).toEqual([]);
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- review-mode`
Expected: FAIL (no `review-mode.js` yet / `[data-te-review-launch]` not found).

- [ ] **Step 4: Implement `teaching-explainer/assets/review-mode.js`**

```javascript
// a11y-hardened review overlay. Activate via ?edit or <body data-review-toggle>.
(function () {
  const active = new URLSearchParams(location.search).has('edit')
    || document.body.hasAttribute('data-review-toggle');
  if (!active) return;

  let lastFocus = null;
  const launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'te-btn';
  launch.setAttribute('data-te-review-launch', '');
  launch.textContent = 'Review & edit';
  launch.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:9999;';

  const dialog = document.createElement('div');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Review and edit');
  dialog.hidden = true;
  dialog.style.cssText =
    'position:fixed;inset:10% 10% auto auto;max-width:420px;background:#fff;color:#1a1a1a;' +
    'border:2px solid #1d4ed8;border-radius:8px;padding:20px;z-index:10000;';
  dialog.innerHTML =
    '<h2 style="margin-top:0">Review &amp; edit</h2>' +
    '<p>Edit text in place, or add a note, then copy a revision brief.</p>' +
    '<button type="button" class="te-btn" data-te-review-copy>Copy notes for LLM</button> ' +
    '<button type="button" class="te-btn" data-te-review-close>Close</button>';

  function focusables() {
    return [...dialog.querySelectorAll('button,[href],input,textarea,[tabindex]:not([tabindex="-1"])')];
  }
  function open() {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    (focusables()[0] || dialog).focus();
  }
  function close() {
    dialog.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  launch.addEventListener('click', open);
  dialog.querySelector('[data-te-review-close]').addEventListener('click', close);

  document.body.appendChild(launch);
  document.body.appendChild(dialog);
  window.TEReview = { open, close };
})();
```

- [ ] **Step 5: Create `test/fixtures/review-mode.html`** — `_template.html` but add `data-review-toggle` to `<body>` and load `review-mode.js` after `components.js`.

- [ ] **Step 6: Run**

Run: `npm test -- review-mode`
Expected: 3 passed.

- [ ] **Step 7: Commit**

```bash
git add teaching-explainer/assets/review-mode.js test/fixtures/review-mode.html test/components/review-mode.spec.js
git commit -m "feat: a11y-hardened review-mode overlay (focus trap, Esc, restore)"
```

---

## Task 8: `references/pedagogy.md`

Distill the evidence base into enforceable rules the SKILL.md can point to.

**Files:**
- Create: `teaching-explainer/references/pedagogy.md`
- Source: `research/pedagogy-evidence-base.md` (already in repo)

**Interfaces:** Consumed by SKILL.md Phases 1 and 5.

- [ ] **Step 1: Write `pedagogy.md`** with these required sections (no placeholders — real content drawn from the research file):
  - **The spine** — the 7 enforced rules from the spec §4, each with its one-line evidence basis and a concrete "how to apply in an explainer."
  - **Yield-ranked multimedia principles** — the table from research §3 (coherence g≈1.0 down to negligible), stated as "prioritize / skip."
  - **ICAP quick reference** — Passive < Active < Constructive < Interactive, with an example interaction per mode mapping to the component kit.
  - **Retrieval practice rules** — spaced not one-shot; ≥2; why-feedback; retry. Cite the testing-effect basis.
  - **The learning-styles guardrail** — verbatim from research §7a: never adapt to diagnosed styles; use UDL multi-representation. Include the Pashler 2008 basis.
  - **Honesty notes** — where evidence is thin (the exact artifact; CALI efficacy; UDL efficacy).

- [ ] **Step 2: Verify coverage** — confirm every spec §4 spine item and the §5 UDL caveat appears.

Run: `grep -ci "learning styles\|retrieval\|coherence\|ICAP\|UDL" teaching-explainer/references/pedagogy.md`
Expected: ≥5.

- [ ] **Step 3: Commit**

```bash
git add teaching-explainer/references/pedagogy.md
git commit -m "docs: pedagogy.md — evidence base as enforceable rules"
```

---

## Task 9: `references/accessibility.md`

**Files:**
- Create: `teaching-explainer/references/accessibility.md`

**Interfaces:** Consumed by SKILL.md Phase 5 QA gate and the component kit's documentation.

- [ ] **Step 1: Write `accessibility.md`** with: the WCAG 2.2 AA criteria list from spec §5 (each with criterion number, name, and a one-line "what to check in an explainer"); a copy-paste **Phase-5 a11y checklist**; a note that the component kit satisfies these by construction and `npm test` verifies them via axe; and the manual checks axe can't catch (logical reading order, meaningful alt text, focus-order sanity).

- [ ] **Step 2: Verify the named criteria are present**

Run: `grep -c "2.1.1\|2.4.7\|1.1.1\|2.5.8\|2.5.7" teaching-explainer/references/accessibility.md`
Expected: ≥1 (all five numbers present in the file).

- [ ] **Step 3: Commit**

```bash
git add teaching-explainer/references/accessibility.md
git commit -m "docs: accessibility.md — WCAG 2.2 AA checklist for explainers"
```

---

## Task 10: `references/instructor-framework.md`

**Files:**
- Create: `teaching-explainer/references/instructor-framework.md`

**Interfaces:** Consumed by SKILL.md Phase 0 (organizing-structure intake) and Phase 1.

- [ ] **Step 1: Write the doc** covering: the three organizing-structure kinds (process framework / conceptual mental model / logical sequence); how to elicit one in the interview; **how to decide which fits** (decision guidance, incl. doctrinal topics that have none); the rule to **never force** a framework; how the chosen structure maps to section order; and how to co-develop one when the instructor has none. Include 2 worked mini-examples (a process-framework topic like legal research; a no-framework doctrinal topic that uses a mental model instead).

- [ ] **Step 2: Commit**

```bash
git add teaching-explainer/references/instructor-framework.md
git commit -m "docs: instructor-framework.md — organizing-structure intake"
```

---

## Task 11: `SKILL.md` — the process

The skill's front door: YAML frontmatter (name + triggering description) and Phases 0–6.

**Files:**
- Create: `teaching-explainer/SKILL.md`
- Reference: `~/.claude/skills/html-explainer/SKILL.md` (for Phase 2/4 pointers and script paths)

**Interfaces:** Points to all three `references/*.md`, the `assets/*`, and html-explainer's scripts.

- [ ] **Step 1: Write the frontmatter** — `name: teaching-explainer` and a `description` that triggers on requests like "make a lesson/explainer for my class," "interactive teaching page," "class activity," covering law and other subjects. (Mirror the style of html-explainer's description.)

- [ ] **Step 2: Write the process body**, encoding (no placeholders — real prose):
  - **Opening principles** + the soft-dependency note (reuse html-explainer; degrade if absent).
  - **Phase 0 — Scope, ground, research:** the pedagogy-first interview (grounding / organizing structure / audience & depth / mode / spine elements default-on / AI-chat open yes-no) + the settled-vs-dynamic research gate (cap 2–3 fetches, cite). Explicitly "built on html-explainer Phase 0."
  - **Phase 1 — Learning architecture:** choose organizing structure (never forced; → `instructor-framework.md`), order sections, place ≥1 constructive interaction per concept + ≥2 spaced retrieval checks (→ `pedagogy.md`).
  - **Phases 2–4 — Build & quality:** "follow html-explainer Phases 2–4"; assemble with our `assets/components.{css,js}` + `review-mode.js`; reuse its `assemble.mjs`/`shoot.mjs`. List the component kit with the `data-te` contracts (or point to a kit reference).
  - **Phase 5 — Pedagogy + a11y QA gate:** the combined checklist (spine satisfied; WCAG via `npm test` + manual checks from `accessibility.md`; feedback teaches; no learning-styles; sources cited). Overrides explicit + logged.
  - **Phase 6 — Revise:** via the review overlay; re-run the gate.
  - **Modes:** async default (self-contained feedback) vs. in-class (hold reveals, projection type).

- [ ] **Step 3: Verify structure**

Run: `grep -c "^## Phase" teaching-explainer/SKILL.md`
Expected: 7 (Phase 0–6).

- [ ] **Step 4: Commit**

```bash
git add teaching-explainer/SKILL.md
git commit -m "feat: SKILL.md — pedagogy-first explainer process"
```

---

## Task 12: `README.md` + sync notes

**Files:**
- Create: `teaching-explainer/README.md`

- [ ] **Step 1: Write the README** covering: what the skill does; **install** (copy/symlink `teaching-explainer/` into `~/.claude/skills/`); the **soft dependency** on html-explainer and graceful-degrade behavior; the **"referenced vs owned" sync table** (referenced: Phase 2/4, `assemble.mjs`, `shoot.mjs`; owned: spine, kit, a11y, overlay) with the one-line maintenance rule ("sync burden ≈ copied surface; we copied ~none"); how to run the kit tests (`npm install && npx playwright install chromium && npm test`); and the component `data-te` contracts as a quick reference.

- [ ] **Step 2: Commit**

```bash
git add teaching-explainer/README.md
git commit -m "docs: README with install + sync notes"
```

---

## Task 13: Full-suite green + dogfood gate

**Files:** none (verification task).

- [ ] **Step 1: Run the whole suite**

Run: `npm test`
Expected: all specs pass (predict-reveal, retrieval-mc, self-explain, classify, step-through, review-mode, smoke) with zero axe violations.

- [ ] **Step 2: Manual kit check** — open each `test/fixtures/*.html` in a browser; tab through every control with the keyboard only; confirm visible focus, that reveals/feedback are reachable, and the review overlay traps focus and restores on `Esc`. Fix any gap, re-run `npm test`.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "test: full kit suite green + manual keyboard pass"
```

---

## Phase 7 (GATED) — AI-prompting exemplar

> **Blocked until the author provides:** (a) their AI-prompting framework (organizing structure) or agreement to co-develop one, and (b) any grounding materials. Also requires **live research** for currency. Run this as a separate effort using the finished skill on itself; treat the steps below as its outline, to be expanded into a child plan at that time.

**Files (when unblocked):**
- Create: `teaching-explainer/examples/ai-prompting.html`
- Create: `teaching-explainer/examples/ai-prompting-sources.md`

**Outline:**
- [ ] Run SKILL.md Phase 0 on "AI prompting" — grounding = author's materials; organizing structure = author's framework; topic flagged **dynamic** → research current prompting guidance + legal-platform specifics (Lexis+ AI/Protégé, Westlaw CoCounsel & AI-Assisted Research, vLex/Vincent), cite + date-stamp every claim in `ai-prompting-sources.md`.
- [ ] Build per Phases 1–4 using the component kit: predict-then-reveal (fix a weak prompt), classify (tag prompt parts / good-vs-bad practices), self-explain (why grounded beat open), ≥2 spaced retrieval-mc checks.
- [ ] UI separates durable principles (settled) from platform features (visible "as of <date> — verify vs. vendor docs" marker).
- [ ] Pass the Phase-5 QA gate; deliver as a single `.html` with the review overlay inlined.

---

## Self-Review (completed during planning)

- **Spec coverage:** §3 decisions → Tasks 1–12 + Global Constraints; §4 spine → pedagogy.md (Task 8) + enforced in SKILL.md Phase 5 (Task 11) + embodied in components (Tasks 2–6); §5 a11y → harness + per-component axe tests (Tasks 1–7) + accessibility.md (Task 9); §6 layout → Task 1 file structure; §7 kit → Tasks 2–6; §8 flow → SKILL.md (Task 11); §9 exemplar → Phase 7 (gated). No uncovered spec sections.
- **Placeholder scan:** no TBD/TODO; doc-authoring tasks (8–12) specify exact required sections + a grep/verification check rather than vague "write docs."
- **Type consistency:** `window.TE.init`, `window.TE._registry`, `announce()`, `bumpTally()`, `window.TEReview.open/close`, and all `data-te*` / `.te-*` names are used consistently across tasks.

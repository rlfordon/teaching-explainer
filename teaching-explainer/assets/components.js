// teaching-explainer interaction kit. Data-attribute driven; no dependencies.
// Public API: window.TE.init(root). Auto-runs on DOMContentLoaded.
(function () {
  const registry = {}; // name -> init(el)

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

  const counted = new WeakSet();
  function bumpTally(isCorrect, el) {
    const tally = document.querySelector('[data-te-tally]');
    if (!tally) return;
    const alreadyCounted = el && counted.has(el);
    if (el && !alreadyCounted) counted.add(el);
    const c = +(tally.dataset.correct || 0) + (isCorrect ? 1 : 0);
    const t = +(tally.dataset.total || 0) + (alreadyCounted ? 0 : 1);
    tally.dataset.correct = c; tally.dataset.total = t;
    tally.textContent = `Score: ${c} / ${t}`;
  }

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
        if (!solved) { solved = true; bumpTally(true, el); }
        fb.className = 'te-mc-feedback te-correct';
        fb.textContent = 'Correct — ' + why;
      } else {
        if (!solved) bumpTally(false, el);
        fb.className = 'te-mc-feedback te-incorrect';
        fb.textContent = 'Not quite — try again.';
      }
    });
  };

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

  window.TE = { init, _registry: registry };
  document.addEventListener('DOMContentLoaded', () => init(document));
})();

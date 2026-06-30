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

  window.TE = { init, _registry: registry };
  document.addEventListener('DOMContentLoaded', () => init(document));
})();

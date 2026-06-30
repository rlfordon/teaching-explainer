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

  window.TE = { init, _registry: registry };
  document.addEventListener('DOMContentLoaded', () => init(document));
})();

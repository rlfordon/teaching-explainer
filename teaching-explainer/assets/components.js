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

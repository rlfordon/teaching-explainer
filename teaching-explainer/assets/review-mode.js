// a11y-hardened review overlay. Activate via ?edit or <body data-review-toggle>.
// Upstream contract: ?edit / data-review-toggle activation, export notes, Copy notes for LLM.
// This is a clean WCAG 2.2 AA reimplementation; see upstream at
// ~/.claude/skills/html-explainer/scripts/review-mode.js for the full feature set.
(function () {
  var active = new URLSearchParams(location.search).has('edit')
    || document.body.hasAttribute('data-review-toggle');
  if (!active) return;

  var lastFocus = null;

  // ---- launcher button (≥24px, keyboard-operable) ----
  var launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'te-btn';
  launch.setAttribute('data-te-review-launch', '');
  launch.setAttribute('aria-label', 'Review and edit this page');
  launch.textContent = 'Review & edit';
  launch.style.cssText =
    'position:fixed;bottom:16px;right:16px;z-index:9999;' +
    'min-width:44px;min-height:44px;padding:10px 18px;' +
    'background:#1d4ed8;color:#fff;border:none;border-radius:8px;' +
    'font-family:var(--sans,system-ui,sans-serif);font-size:14px;font-weight:600;' +
    'cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25);';

  // ---- dialog ----
  var dialog = document.createElement('div');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'te-review-title');
  dialog.hidden = true;
  dialog.style.cssText =
    'position:fixed;top:10%;left:50%;transform:translateX(-50%);' +
    'max-width:480px;width:90%;background:#fff;color:#1a1a1a;' +
    'border:2px solid #1d4ed8;border-radius:8px;padding:24px;z-index:10000;' +
    'box-shadow:0 8px 32px rgba(0,0,0,.2);';

  // Notes array persisted in memory (localStorage-backed on supported origins)
  var notes = [];
  try { notes = JSON.parse(localStorage.getItem('te-review-notes') || '[]'); } catch (e) {}

  function saveNotes() {
    try { localStorage.setItem('te-review-notes', JSON.stringify(notes)); } catch (e) {}
  }

  function buildBrief() {
    if (!notes.length) return '(no notes yet)';
    var out = '# Revision requests\n(' + notes.length + ' annotation' + (notes.length === 1 ? '' : 's') + ')\n\n';
    notes.forEach(function (n, i) {
      out += (i + 1) + '. ' + (n.loc || 'Page') + '\n   Note: ' + n.note + '\n\n';
    });
    out += 'Please apply these to the source HTML.';
    return out;
  }

  function copyNotes() {
    var text = buildBrief();
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      // fallback: select a textarea
      var ta = dialog.querySelector('#te-review-fb');
      if (ta) { ta.value = text; ta.select(); }
    }
  }

  function downloadEdits() {
    var html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    if (notes.length) {
      var safe = buildBrief().replace(/<!--/g, '<!-').replace(/-->/g, '->').replace(/--/g, '—');
      html += '\n\n<!-- REVIEWER NOTES\n\n' + safe + '\n\n-->\n';
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = (document.title || 'page').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-edited.html';
    a.click();
  }

  // Modes: preview | edit | note
  var currentMode = 'preview';

  function setMode(m) {
    currentMode = m;
    dialog.querySelectorAll('[data-te-mode]').forEach(function (b) {
      var on = b.dataset.teMode === m;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.fontWeight = on ? '700' : '400';
      b.style.background = on ? '#1d4ed8' : '#f1f5f9';
      b.style.color = on ? '#fff' : '#1a1a1a';
    });
    // Toggle contenteditable on prose elements
    document.querySelectorAll('[data-te-edit]').forEach(function (el) {
      el.contentEditable = (m === 'edit') ? 'true' : 'false';
    });
  }

  // Mark editable prose (p, h*, li, blockquote, figcaption) — skip overlay UI
  function markEditable() {
    var skip = '[role="dialog"],[data-te-review-launch],[contenteditable],[data-te-edit]';
    var sel = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,td,th';
    document.querySelectorAll(sel).forEach(function (el) {
      if (!el.closest(skip)) el.setAttribute('data-te-edit', '');
    });
  }

  // Build dialog HTML
  dialog.innerHTML =
    '<h2 id="te-review-title" style="margin:0 0 12px;font-size:18px;">Review &amp; edit</h2>' +
    '<div role="group" aria-label="Mode" style="display:flex;gap:8px;margin-bottom:16px;">' +
      '<button type="button" data-te-mode="preview" aria-pressed="true"' +
        ' style="min-height:36px;min-width:80px;padding:6px 14px;border:1px solid #1d4ed8;border-radius:6px;cursor:pointer;background:#1d4ed8;color:#fff;font-weight:700;">Preview</button>' +
      '<button type="button" data-te-mode="edit" aria-pressed="false"' +
        ' style="min-height:36px;min-width:80px;padding:6px 14px;border:1px solid #1d4ed8;border-radius:6px;cursor:pointer;background:#f1f5f9;color:#1a1a1a;">Edit text</button>' +
      '<button type="button" data-te-mode="note" aria-pressed="false"' +
        ' style="min-height:36px;min-width:80px;padding:6px 14px;border:1px solid #1d4ed8;border-radius:6px;cursor:pointer;background:#f1f5f9;color:#1a1a1a;">Add note</button>' +
    '</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      '<button type="button" data-te-review-copy' +
        ' style="min-height:36px;padding:6px 14px;border:1px solid #6b7280;border-radius:6px;cursor:pointer;background:#f9fafb;color:#1a1a1a;">Copy notes for LLM</button>' +
      '<button type="button" data-te-review-download' +
        ' style="min-height:36px;padding:6px 14px;border:1px solid #6b7280;border-radius:6px;cursor:pointer;background:#f9fafb;color:#1a1a1a;">Download edits</button>' +
      '<button type="button" data-te-review-close' +
        ' style="min-height:36px;padding:6px 14px;border:1px solid #6b7280;border-radius:6px;cursor:pointer;background:#f9fafb;color:#1a1a1a;margin-left:auto;">Close</button>' +
    '</div>';

  function focusables() {
    return Array.prototype.slice.call(
      dialog.querySelectorAll(
        'button:not([disabled]),[href]:not([disabled]),input:not([disabled]),' +
        'textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function openDialog() {
    lastFocus = document.activeElement;
    markEditable();
    dialog.hidden = false;
    var first = focusables()[0];
    if (first) first.focus();
    else dialog.focus();
  }

  function closeDialog() {
    dialog.hidden = true;
    // Restore mode to preview, turn off contenteditable
    setMode('preview');
    if (lastFocus) { lastFocus.focus(); }
  }

  // Focus trap
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog();
      return;
    }
    if (e.key === 'Tab') {
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });

  // Wire mode buttons
  dialog.querySelectorAll('[data-te-mode]').forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.dataset.teMode); });
  });

  // Wire action buttons
  dialog.querySelector('[data-te-review-copy]').addEventListener('click', copyNotes);
  dialog.querySelector('[data-te-review-download]').addEventListener('click', downloadEdits);
  dialog.querySelector('[data-te-review-close]').addEventListener('click', closeDialog);

  // Wire launcher
  launch.addEventListener('click', openDialog);

  // Append to DOM
  document.body.appendChild(launch);
  document.body.appendChild(dialog);

  // Auto-open on ?edit (no toggle button needed)
  if (new URLSearchParams(location.search).has('edit') && !document.body.hasAttribute('data-review-toggle')) {
    openDialog();
  }

  // Expose programmatic API for tests
  window.TEReview = { open: openDialog, close: closeDialog };
})();

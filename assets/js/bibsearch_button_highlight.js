/* Highlight Abs/Bib buttons when a search hit is inside a hidden block
 * – works on any al-folio page that uses bibsearch.js & mark.js
 * ------------------------------------------------------------------ */
(function () {
  const HIT = 'search-hit';

  /* add CSS once --------------------------------------------------- */
  const css = `
    .btn.${HIT}{
      background:#ffe66d!important;
      color:#000!important;
      border-color:#ffde3d!important;
    }`;
  document.head.appendChild(Object.assign(document.createElement('style'),
                                          {textContent: css}));

  /* add / remove the class ---------------------------------------- */
  function flagButtons() {
    /* clear previous */
    document.querySelectorAll(`.btn.${HIT}`).forEach(b => b.classList.remove(HIT));

    /* mark buttons whose hidden block contains a <mark> */
    document.querySelectorAll('.abstract mark, .bibtex mark')
            .forEach(m => {
              const block = m.closest('.abstract, .bibtex');
              if (!block) return;
              const entry = block.closest('.entry-body');
              if (!entry) return;
              const btn = block.classList.contains('bibtex') ?
                          entry.querySelector('.links .bibtex') :
                          entry.querySelector('.links .abstract');
              if (btn) btn.classList.add(HIT);
            });
  }

  /* patch Mark.prototype.mark so we always run after *any* highlight */
  function installPatch() {
    if (!window.Mark || !Mark.prototype.mark || Mark.prototype.__patched__) return;

    const orig = Mark.prototype.mark;
    Mark.prototype.mark = function (keyword, opts = {}) {
      const userDone = opts.done;
      opts.done = function () {
        if (typeof userDone === 'function') userDone.apply(this, arguments);
        flagButtons();
      };
      return orig.call(this, keyword, opts);
    };
    Mark.prototype.__patched__ = true;         // don’t patch twice
  }

  document.addEventListener('DOMContentLoaded', installPatch);
})();

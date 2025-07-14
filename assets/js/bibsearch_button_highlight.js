/* Highlight Abs/Bib buttons when a search match is inside hidden blocks.
 * Works with the default al-folio bibsearch implementation (mark.js)
 * --------------------------------------------------------------- */

(function () {

  /* CSS class we’ll toggle on the buttons */
  const HIT_CLASS = 'search-hit';

  /* background colour mark.js uses (pulled from al-folio’s CSS) */
  const HIGHLIGHT_STYLE = `
    .btn.${HIT_CLASS}{
      background: #ffe66d !important;
      color: #000 !important;
    }`;

  /* inject style once */
  const styleTag = document.createElement('style');
  styleTag.textContent = HIGHLIGHT_STYLE;
  document.head.appendChild(styleTag);

  /* core: run after every (re-)highlight */
  function buttonHighlight() {

    /* 1. clear previous hits */
    document
      .querySelectorAll(`.btn.${HIT_CLASS}`)
      .forEach(b => b.classList.remove(HIT_CLASS));

    /* 2. for every mark inside hidden abstract/bibtex, mark its button */
    document
      .querySelectorAll('.abstract mark, .bibtex mark')
      .forEach(mark => {
        const hiddenBlock = mark.closest('.abstract, .bibtex');
        if (!hiddenBlock) return;

        const entry = hiddenBlock.closest('.entry-body');
        if (!entry) return;

        const btnSelector = hiddenBlock.classList.contains('bibtex')
          ? '.links .bibtex'
          : '.links .abstract';

        const btn = entry.querySelector(btnSelector);
        if (btn) btn.classList.add(HIT_CLASS);
      });
  }

  /* ---- glue it into al-folio’s existing search ----
     The theme puts its Mark() instance & options on window.bibMarkOptions.
     We just patch its `done` callback so our code runs after every search. */
  document.addEventListener('DOMContentLoaded', () => {
    if (window.bibMarkOptions) {
      const oldDone = window.bibMarkOptions.done || function () {};
      window.bibMarkOptions.done = function () {
        oldDone.apply(this, arguments);
        buttonHighlight();
      };
    }
  });
})();

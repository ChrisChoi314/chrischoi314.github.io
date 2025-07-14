/* bibsearch-button-highlight.js
   highlights Abs/Bib buttons when the query matches hidden text */
document.addEventListener('DOMContentLoaded', () => {

  const searchBox =
        document.querySelector('#bib-search, #searchbar, input[type=search]');
  if (!searchBox) return;

  const sample = document.createElement('mark');
  sample.style.display = 'none';
  document.body.appendChild(sample);
  const hlColor = getComputedStyle(sample).backgroundColor || '#ffff66';
  sample.remove();

  const style = document.createElement('style');
  style.textContent = `
    .links .search-hit{
      background-color:${hlColor} !important;
      color:#000 !important;
      border-color:${hlColor} !important;
    }`;
  document.head.appendChild(style);

  function clearHits() {
    document.querySelectorAll('.links .search-hit')
            .forEach(btn => btn.classList.remove('search-hit'));
  }

  function refreshHits() {
    clearHits();
    const q = searchBox.value.trim().toLowerCase();
    if (!q) return;

    document.querySelectorAll('.entry-body').forEach(entry => {
      const absBtn = entry.querySelector('.links .abstract');
      const bibBtn = entry.querySelector('.links .bibtex');
      const absBlk = entry.querySelector('div.abstract');
      const bibBlk = entry.querySelector('div.bibtex');

      if (absBlk && absBlk.textContent.toLowerCase().includes(q))
        absBtn?.classList.add('search-hit');
      if (bibBlk && bibBlk.textContent.toLowerCase().includes(q))
        bibBtn?.classList.add('search-hit');
    });
  }

  ['input','keyup','search'].forEach(ev =>
    searchBox.addEventListener(ev, refreshHits)
  );
});

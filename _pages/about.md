---
layout: about
title: about
permalink: /
subtitle: Researcher · Theoretical Cosmology · PTA · Massive Gravity
profile:
  align: right
  image: prof_pic.png
  image_circular: false # crops the image to make it circular
  address: <p>Pittsburgh, Pennsylvania</p>
  more_info: >
    <p>Wean Hall 8402</p>
    <p>Hamerschlag Dr</p>
    <p>Pittsburgh, PA 15213</p>
news: true  # includes a list of news items
latest_posts: true  # includes a list of the newest posts
selected_papers: true # includes a list of papers marked as "selected={true}"
social: true  # includes social icons at the bottom of the page
---

I am a 2nd Year Ph.D. student in Physics at Carnegie Mellon University, working in theoretical cosmology under the supervision of Prof. [Tina Kahniashvili](https://www.cmu.edu/physics/people/faculty/kahniashvili.html). My research focuses on how gravitational waves can probe extensions of general relativity, such as massive gravity theories, and the early universe. I use pulsar timing array data to explore aspects of the stochastic gravitational wave background and the implications for Lorentz and parity violation.

## Background

I received my B.S. in Physics from Carnegie Mellon University in 2024, where I developed an early interest in theoretical cosmology and gravity. I am originally from Seoul, South Korea, and grew up in New York City.

## Outside Academia

Outside of research, I enjoy reading hard science fiction, drawing, climbing, weightlifting, and competitive speedcubing. I also have a deep interest in linguistics, in particular, the study of language families.


{% raw %}
<!-- ——— enable Abs / Bib toggle on this page ——— -->
<script>
document.addEventListener('DOMContentLoaded', () => {

  /* Abs button */
  document.querySelectorAll('.links .abstract').forEach(btn =>
    btn.addEventListener('click', () => {
      const blk = btn.closest('.entry-body').querySelector('div.abstract');  // <-- NB: div!
      blk.classList.toggle('open');
      blk.classList.toggle('hidden');
    })
  );

  /* Bib button */
  document.querySelectorAll('.links .bibtex').forEach(btn =>
    btn.addEventListener('click', () => {
      const blk = btn.closest('.entry-body').querySelector('div.bibtex');    // <-- NB: div!
      blk.classList.toggle('open');
      blk.classList.toggle('hidden');
    })
  );

});
</script>
{% endraw %}

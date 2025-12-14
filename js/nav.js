(function () {
  const nav = document.querySelector('.navbar-modern');
  if (!nav) return;

  const hero = document.querySelector('.hero-banner, .about-hero, .contact-hero, .team-hero, .season-hero');

  const update = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop || 0;
    // Compact when scrolled more than 8px
    if (scrolled > 8) nav.classList.add('nav-compact');
    else nav.classList.remove('nav-compact');

    // Transparent while overlapping a hero section
    if (hero) {
      const navH = nav.offsetHeight || 0;
      const heroH = hero.offsetHeight || 0;
      const overlaps = scrolled < Math.max(0, heroH - navH);
      nav.classList.toggle('nav-transparent', overlaps);
    } else {
      nav.classList.remove('nav-transparent');
    }
  };

  let ticking = false;
  const onScrollOrResize = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  document.addEventListener('DOMContentLoaded', update);
  // Initial run in case script loads after DOM
  update();
})();


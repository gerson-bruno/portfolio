document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentYearSpan = document.getElementById('current-year');
  const revealElements = document.querySelectorAll('.reveal');

  if (mobileMenuBtn && nav) {
    const openMenu = () => {
      nav.classList.add('show');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      nav.classList.remove('show');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    };

    mobileMenuBtn.addEventListener('click', openMenu);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('show')) closeMenu();
      });
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
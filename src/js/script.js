document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentYearSpan = document.getElementById('current-year');
  const revealElements = document.querySelectorAll('.reveal');

  if (mobileMenuBtn && nav) {
    const toggleMenu = () => {
      nav.classList.toggle('show');
      const icon = mobileMenuBtn.querySelector('i');
      if (nav.classList.contains('show')) {
        icon.classList.replace('fa-bars', 'fa-times');
      } else {
        icon.classList.replace('fa-times', 'fa-bars');
      }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('show')) toggleMenu();
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
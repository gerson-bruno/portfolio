document.addEventListener('DOMContentLoaded', () => {
    // --- Main Selectors ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentYearSpan = document.getElementById('current-year');
    const revealElements = document.querySelectorAll('.reveal');

    // --- Mobile Menu Logic ---
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

        // Automatically close the mobile menu when a link is clicked (UX improvement)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('show')) toggleMenu();
            });
        });
    }

    // --- Dark Mode Logic ---
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on initial load
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark' && toggleSwitch) {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme, false);
    }

    // --- Intersection Observer (Scroll Animations) ---
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once the animation has triggered
                // revealObserver.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Dynamic Footer Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
const initNavbar = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const sections = Array.from(document.querySelectorAll('[data-navbar-theme]'));

    const NAV_OFFSET = 80;
    let currentTheme = null;

    const path = window.location.pathname.replace(/\\/g, '/');
    const isHomepage =
        path.endsWith('index.html') ||
        path.endsWith('/') ||
        path.endsWith('/Frontend') ||
        path.endsWith('/Frontend/');

    function updateNavbarTheme(theme) {
        if (!theme || currentTheme === theme) return;
        currentTheme = theme;

        navbar.classList.remove('theme-dark', 'theme-light');
        navbar.classList.add('theme-' + theme);

        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('theme-dark', 'theme-light');
            mobileMenuOverlay.classList.add('theme-' + theme);
        }
    }

    function getActiveSection() {
        if (!sections.length) return null;

        let active = sections[0];
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= NAV_OFFSET) {
                active = section;
            }
        }
        return active;
    }

    function updateNavbarState() {
        const active = getActiveSection();
        if (active) {
            updateNavbarTheme(active.getAttribute('data-navbar-theme'));
        } else if (!currentTheme) {
            updateNavbarTheme('dark');
        }

        if (isHomepage) {
            const atHeroTop = window.scrollY < 24;
            navbar.classList.toggle('navbar-at-top', atHeroTop);
        }
    }

    let ticking = false;
    function scheduleNavbarUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateNavbarState();
            ticking = false;
        });
    }

    window.addEventListener('scroll', scheduleNavbarUpdate, { passive: true });
    window.addEventListener('resize', scheduleNavbarUpdate, { passive: true });

    const sectionObserver = new IntersectionObserver(
        () => scheduleNavbarUpdate(),
        {
            root: null,
            rootMargin: `-${NAV_OFFSET}px 0px -55% 0px`,
            threshold: [0, 0.05, 0.15, 0.35]
        }
    );
    sections.forEach((section) => sectionObserver.observe(section));

    if (!navbar.classList.contains('theme-dark') && !navbar.classList.contains('theme-light')) {
        navbar.classList.add('theme-dark');
    }
    updateNavbarState();

    let isMenuOpen = false;

    function setMenuState(open) {
        if (!mobileMenuBtn || !mobileMenuOverlay || !mobileMenuIcon) return;

        isMenuOpen = open;
        mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');

        if (open) {
            mobileMenuOverlay.classList.remove('translate-x-full');
            mobileMenuIcon.innerHTML =
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            document.body.style.overflow = 'hidden';
            navbar.classList.add('mobile-menu-open');
        } else {
            mobileMenuOverlay.classList.add('translate-x-full');
            mobileMenuIcon.innerHTML =
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
            document.body.style.overflow = '';
            navbar.classList.remove('mobile-menu-open');
        }
    }

    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            setMenuState(!isMenuOpen);
        });

        mobileMenuOverlay.addEventListener('click', (event) => {
            if (event.target === mobileMenuOverlay) {
                setMenuState(false);
            }
        });
    }

    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            setMenuState(false);
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}

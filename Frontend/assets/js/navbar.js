document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    let currentTheme = null;

    function updateNavbarTheme(theme) {
        if (currentTheme === theme) return;
        currentTheme = theme;

        navbar.classList.remove('theme-dark', 'theme-light');
        navbar.classList.add('theme-' + theme);

        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('theme-dark', 'theme-light');
            mobileMenuOverlay.classList.add('theme-' + theme);
        }
    }

    const observerOptions = {
        root: null,
        // The transition must happen BEFORE the text becomes unreadable.
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        let activeTheme = null;
        
        // Find the most recently intersecting section in the viewport
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeTheme = entry.target.getAttribute('data-navbar-theme');
            }
        });

        if (activeTheme) {
            updateNavbarTheme(activeTheme);
        }
    }, observerOptions);

    const sections = document.querySelectorAll('[data-navbar-theme]');
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Default to dark on load, or the first section's theme if available
    if (sections.length > 0) {
        updateNavbarTheme(sections[0].getAttribute('data-navbar-theme'));
    } else {
        updateNavbarTheme('dark');
    }
});

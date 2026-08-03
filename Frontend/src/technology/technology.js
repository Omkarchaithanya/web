document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // Modals
    const modals = ['privacy', 'terms', 'disclaimer', 'cookie', 'ip'];
    
    function closeAllModals() {
        modals.forEach(id => {
            const m = document.getElementById(id + '-modal');
            if (m) m.style.display = 'none';
        });
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const hrefBtn = e.target.closest('[data-href]');
        if (hrefBtn) {
            window.location.href = hrefBtn.dataset.href;
            return;
        }

        const bg = e.target.closest('[data-modal-bg]');
        if (bg && e.target === bg) {
            bg.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        const closeBtn = e.target.closest('[data-modal-close]');
        if (closeBtn) {
            const modalId = closeBtn.dataset.modalClose;
            const m = document.getElementById(modalId);
            if (m) m.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        const openBtn = e.target.closest('[data-modal-open]');
        if (openBtn) {
            e.preventDefault();
            const modalId = openBtn.dataset.modalOpen;
            const m = document.getElementById(modalId);
            if (m) {
                m.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenuOverlay.classList.remove('translate-x-full');
                if(mobileMenuIcon) mobileMenuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenuOverlay.classList.add('translate-x-full');
                if(mobileMenuIcon) mobileMenuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
                document.body.style.overflow = '';
            }
        });

        mobileMenuOverlay.addEventListener('click', (e) => {
            if(e.target === mobileMenuOverlay && isMenuOpen) {
                mobileMenuBtn.click();
            }
        });
    }
    
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) mobileMenuBtn.click();
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
        const hrefBtn = e.target.closest('[data-href]');
        if (hrefBtn) {
            window.location.href = hrefBtn.dataset.href;
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Category filtering
    const tabs = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.blog-card');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.filter;
            cards.forEach(card => {
                if (target === 'all' || card.dataset.category === target) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Modal Functions
    const modals = ['terms', 'privacy', 'disclaimer', 'cookie', 'ip', 'enquiry', 'zone-modal'];

    function closeAllModals() {
        modals.forEach(id => {
            const m = document.getElementById(id); // wait, for enquiry it's enquiry-modal, zone-modal etc.
            if (m) m.style.display = 'none';
            const m2 = document.getElementById(id + '-modal');
            if (m2) m2.style.display = 'none';
        });
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAllModals();
    });

    document.addEventListener('click', e => {
        // Modal background clicks
        const bg = e.target.closest('[data-modal-bg]');
        if (bg && e.target === bg) {
            bg.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Close buttons
        const closeBtn = e.target.closest('[data-modal-close]');
        if (closeBtn) {
            const modalId = closeBtn.dataset.modalClose;
            const m = document.getElementById(modalId);
            if (m) m.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Open buttons
        const openBtn = e.target.closest('[data-modal-open]');
        if (openBtn) {
            e.preventDefault();
            const modalId = openBtn.dataset.modalOpen;
            const m = document.getElementById(modalId);
            if (m) {
                m.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                if (modalId === 'enquiry-modal') {
                    const firstInput = m.querySelector('input[name="name"]');
                    setTimeout(() => firstInput && firstInput.focus(), 50);
                }
            }
        }

        // Hero video now autoplays after typing — no click required
        // (kept for safety if prompt is still visible)
    });

    // Enquiry specific
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', submitEnquiry);
    }

    document.querySelectorAll('a[href$="#enquiry"], a[href$="#enquiry-form"]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const m = document.getElementById('enquiry-modal');
            if (m) {
                m.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (window.location.hash === '#enquiry' || window.location.hash === '#enquiry-form') {
        setTimeout(() => {
            const m = document.getElementById('enquiry-modal');
            if (m) {
                m.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }, 100);
    }

    function submitEnquiry(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const name = (data.get('name') || '').trim();
        const email = (data.get('email') || '').trim();
        const phone = (data.get('phone') || '').trim();
        const company = (data.get('company') || '').trim();
        const requirements = (data.get('requirements') || '').trim();
        const subject = `UrbanTree enquiry - ${company || name || 'Website visitor'}`;
        const body = [
            'New UrbanTree enquiry', '',
            `Name: ${name}`, `Email: ${email}`, `Phone: ${phone || 'Not provided'}`,
            `Company / Organization: ${company || 'Not provided'}`, '',
            'Requirements:', requirements
        ].join('\n');
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        const m = document.getElementById('enquiry-modal');
        if (m) m.style.display = 'none';
        document.body.style.overflow = '';
    }
});

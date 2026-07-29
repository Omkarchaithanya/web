import { submitEnquiry } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const modals = ['terms', 'privacy', 'disclaimer', 'cookie', 'ip', 'enquiry', 'zone-modal'];

    function closeAllModals() {
        modals.forEach((id) => {
            const m = document.getElementById(id);
            if (m) m.style.display = 'none';
            const m2 = document.getElementById(`${id}-modal`);
            if (m2) m2.style.display = 'none';
        });
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    document.addEventListener('click', (e) => {
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
                if (modalId === 'enquiry-modal') {
                    const firstInput = m.querySelector('input[name="name"]');
                    setTimeout(() => firstInput && firstInput.focus(), 50);
                }
            }
        }
    });

    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', handleEnquirySubmit);
    }

    document.querySelectorAll('a[href$="#enquiry"], a[href$="#enquiry-form"]').forEach((link) => {
        link.addEventListener('click', (event) => {
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

    async function handleEnquirySubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const submitBtn = form.querySelector('button[type="submit"]');
        const statusEl = form.querySelector('.js-enquiry-status');
        const data = new FormData(form);
        const name = (data.get('name') || '').trim();
        const email = (data.get('email') || '').trim();
        const phone = (data.get('phone') || '').trim();
        const company = (data.get('company') || '').trim();
        const requirements = (data.get('requirements') || '').trim();

        const previousLabel = submitBtn?.textContent;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
        }
        if (statusEl) {
            statusEl.textContent = '';
            statusEl.style.color = '';
        }

        try {
            const payload = {
                name,
                email,
                purpose: company || 'Website enquiry / Request Demo',
                description: requirements,
            };
            if (phone) payload.mobile = phone;

            await submitEnquiry(payload);
            form.reset();
            if (statusEl) {
                statusEl.style.color = '#059669';
                statusEl.textContent = 'Enquiry submitted successfully. Our team will contact you soon.';
            }

            setTimeout(() => {
                const m = document.getElementById('enquiry-modal');
                if (m) m.style.display = 'none';
                document.body.style.overflow = '';
                if (statusEl) statusEl.textContent = '';
            }, 1600);
        } catch (err) {
            if (statusEl) {
                statusEl.style.color = '#dc2626';
                statusEl.textContent = err.message || 'Could not submit enquiry. Please try again.';
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = previousLabel || 'Submit Enquiry';
            }
        }
    }
});

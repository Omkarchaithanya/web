import { subscribeNewsletter } from '../../shared/js/api.js';
import { config } from '../../shared/js/config.js';

function setStatus(form, message, isError = false) {
    const status = form.querySelector('.js-newsletter-status');
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? '#f87171' : '#4ade80';
}

function wireNewsletterForms() {
    document.querySelectorAll('.js-newsletter-form').forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const emailInput = form.querySelector('input[name="email"], input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"], button:not([type])');
            const email = (emailInput?.value || '').trim();
            const source = form.dataset.newsletterSource || 'website';

            if (!email) {
                setStatus(form, 'Please enter a valid email address.', true);
                return;
            }

            const previousLabel = submitBtn?.textContent;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Subscribing...';
            }

            try {
                await subscribeNewsletter(email, source);
                setStatus(form, 'Subscribed successfully. Thank you!');
                form.reset();
            } catch (err) {
                setStatus(form, err.message || 'Subscription failed. Please try again.', true);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = previousLabel || 'Subscribe';
                }
            }
        });
    });
}

function applyConfigDrivenLinks() {
    document.querySelectorAll('[data-config-email="privacy"]').forEach((el) => {
        if (!config.privacyEmail) return;
        if (el.tagName === 'A') {
            el.href = `mailto:${config.privacyEmail}`;
            el.textContent = config.privacyEmail;
        } else {
            el.textContent = config.privacyEmail;
        }
    });

    document.querySelectorAll('[data-config-email="contact"]').forEach((el) => {
        if (!config.contactEmail) return;
        if (el.tagName === 'A') {
            el.href = `mailto:${config.contactEmail}`;
            el.textContent = config.contactEmail;
        } else {
            el.textContent = config.contactEmail;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    wireNewsletterForms();
    applyConfigDrivenLinks();
});

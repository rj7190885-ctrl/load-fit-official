/* ══════════════════════════════════════════
   LOAD. — Scroll Animations & Interactions
   ══════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Theme Toggle ───
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Restore saved preference
    const savedTheme = localStorage.getItem('load-theme');
    if (savedTheme === 'light') {
        root.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = root.getAttribute('data-theme') === 'light';
            if (isLight) {
                root.removeAttribute('data-theme');
                localStorage.setItem('load-theme', 'dark');
            } else {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem('load-theme', 'light');
            }
        });
    }

    // ─── Intersection Observer: Fade-up on scroll ───
    const fadeEls = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    fadeEls.forEach((el) => observer.observe(el));

    // ─── Parallax on hero content ───
    const parallaxEl = document.querySelector('[data-parallax]');

    if (parallaxEl) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const speed = 0.3;
                    parallaxEl.style.transform = `translateY(${scrollY * speed}px)`;
                    parallaxEl.style.opacity = Math.max(1 - scrollY / 700, 0);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ─── Waitlist form ───
    const form = document.getElementById('waitlist-form');
    const msg = document.getElementById('form-msg');
    const submitBtn = document.getElementById('waitlist-submit');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!data.name || !data.email || !data.willingToPay) {
                showMsg('Please fill out all required fields.', 'error');
                return;
            }

            // Set loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            msg.classList.remove('show', 'success', 'error', 'hidden');

            try {
                // Change URL when deployed
                const response = await fetch('http://localhost:3000/api/waitlist/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    showMsg('Secure spot claimed! We will be in touch.', 'success');
                    form.reset();
                } else {
                    showMsg(result.message || 'Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                showMsg('Unable to connect to server. Please try again later.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    function showMsg(text, type) {
        msg.textContent = text;
        msg.className = `form-msg ${type} show`;
        
        setTimeout(() => {
            msg.className = `form-msg hidden`;
        }, 5000);
    }

    // ─── Smooth scroll for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
})();

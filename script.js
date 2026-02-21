/**
 * INTERSECTION OBSERVERS FOR SCROLL ANIMATIONS
 * Adds dynamic '.appear' class when elements enter the viewport.
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Setup options for the observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before it hits the bottom
        threshold: 0.1 // 10% of the item must be visible
    };

    // 2. Observer Callback
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add appearance class
                entry.target.classList.add('appear');
                // Unobserve after showing (run once)
                observer.unobserve(entry.target);
            }
        });
    };

    // 3. Initialize Observer
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // 4. Target elements
    const animatableElements = document.querySelectorAll('.fade-in, .slide-up, .hero-lumos-char');

    // Add small delay to stagger initial hero load based on class
    animatableElements.forEach(el => {
        // If it's already in viewport on load (like hero), we manually trigger it quickly
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setTimeout(() => {
                el.classList.add('appear');
            }, 100);
        } else {
            scrollObserver.observe(el);
        }
    });

    /**
     * FORMSPREE SUBMISSION HANDLING
     */
    const bookingForm = document.getElementById('bookingForm');
    const formStatus = document.getElementById('form-status');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerText;
            const isEnglish = document.documentElement.lang === 'en';

            // Loading State
            submitBtn.innerText = isEnglish ? 'PROCESSING...' : 'VERWERKEN...';
            submitBtn.style.opacity = '0.5';
            submitBtn.disabled = true;
            if (formStatus) formStatus.style.display = 'none';

            try {
                const response = await fetch(bookingForm.action, {
                    method: 'POST',
                    body: new FormData(bookingForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success State
                    submitBtn.innerText = isEnglish ? 'REQUEST SENT ✓' : 'AANVRAAG VERZONDEN ✓';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '#4CAF50'; /* Green accent for success */
                    submitBtn.style.color = '#fff';
                    if (formStatus) {
                        formStatus.innerText = isEnglish ? "Thanks for reaching out. I'll be in touch as soon as possible." : "Bedankt voor je bericht! Ik neem zo snel mogelijk contact op.";
                        formStatus.style.color = "#4CAF50";
                        formStatus.style.display = 'block';
                    }

                    // Reset form
                    bookingForm.reset();

                    // Revert button after 5 seconds
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.background = 'var(--accent)';
                        submitBtn.style.color = '#fff';
                        submitBtn.disabled = false;
                    }, 5000);
                } else {
                    throw new Error("Formspree response error");
                }
            } catch (error) {
                // Error State
                submitBtn.innerText = isEnglish ? 'SEND ERROR' : 'FOUT BIJ VERZENDEN';
                submitBtn.style.opacity = '1';

                if (formStatus) {
                    formStatus.innerText = isEnglish ? "Something went wrong. Please try again or send a direct email." : "Oeps! Er ging iets mis. Probeer het opnieuw of stuur direct een mail.";
                    formStatus.style.color = "var(--accent)";
                    formStatus.style.display = 'block';
                }

                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = 'var(--accent)';
                    submitBtn.style.color = '#fff';
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    }

    /**
     * PARALLAX EFFECT FOR GALLERY IMAGES ON SCROLL (Extra premium touch)
     */
    const parallaxImages = document.querySelectorAll('.parallax-img');

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;

        parallaxImages.forEach(img => {
            // Apply slight vertical shift based on scroll
            const speed = 0.05;
            const yPos = -(scrollY * speed);
            // We use transform directly, but be careful not to override existing hover scales 
            // In a robust implementation, you wrap the img in a container and move the img.
            // For simple demo, this basic transform works on the container.

            // Note: Since CSS has hover effects on img, we apply parallax via margin or top if position is absolute.
            // But since object-fit is used, a slight CSS transform translate Y is best.
            // We'll skip complex JS parallax to maintain CSS hover states, relying on CSS background-attachment for Hero.
        });
    });

    /**
     * LENIS SMOOTH SCROLL (Valiente Aesthetic)
     */
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /**
     * CUSTOM RED DOT CURSOR (Magnetic & Expand on hover)
     */
    const cursorDot = document.querySelector('.cursor-dot');

    window.addEventListener('mousemove', (e) => {
        if (cursorDot) {
            // Wait, we use translate(-50%, -50%) in css, so just x,y is center
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        }
    });

    // Expand cursor over interactive elements
    const interactables = document.querySelectorAll('a, button, input, textarea, select, .project-row, .gallery-item');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorDot) cursorDot.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorDot) cursorDot.classList.remove('hovered');
        });
    });

});

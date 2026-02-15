// Navigation script for smooth scrolling and active section highlighting
// This script integrates with Lenis smooth scroll and GSAP ScrollTrigger

let lenisInstance = null;

// Wait for Lenis to be initialized from init.js
function waitForLenis() {
    return new Promise((resolve) => {
        const checkLenis = setInterval(() => {
            // Check if Lenis is available globally or via init.js
            if (window.lenis) {
                lenisInstance = window.lenis;
                clearInterval(checkLenis);
                resolve(lenisInstance);
            }
        }, 100);

        // Timeout after 3 seconds
        setTimeout(() => {
            clearInterval(checkLenis);
            resolve(null);
        }, 3000);
    });
}

// Initialize navigation
async function initNavigation() {
    await waitForLenis();

    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinksContainer = document.getElementById('navLinks');

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu if open
                if (navLinksContainer.classList.contains('open')) {
                    navLinksContainer.classList.remove('open');
                }

                // Use Lenis for smooth scrolling if available
                if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
                    lenisInstance.scrollTo(targetSection, {
                        offset: -80, // Account for sticky navbar
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    // Fallback to native smooth scroll
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Mobile menu toggle
    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinksContainer.classList.remove('open');
            }
        });
    }

    // Active section highlighting with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            gsap.ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => setActiveLink(section.id),
                onEnterBack: () => setActiveLink(section.id),
            });
        });
    }
}

// Set active navigation link
function setActiveLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkSection = link.getAttribute('data-section');
        if (linkSection === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

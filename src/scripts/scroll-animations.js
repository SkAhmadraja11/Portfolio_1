// Cinematic scroll-based animations
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Wait for DOM and Three.js to be ready
window.addEventListener('load', () => {
    initScrollAnimations()
})

function initScrollAnimations() {
    // Section transition effects
    const sections = gsap.utils.toArray('.section')

    sections.forEach((section, index) => {
        // Subtle scale and fade on scroll
        gsap.fromTo(section,
            {
                scale: 0.98,
                opacity: 0.8
            },
            {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 30%',
                    scrub: 1,
                    toggleActions: 'play none none reverse'
                }
            }
        )
    })

    // Atmospheric brightness shifts between sections
    const atmosphericOverlay = document.querySelector('.atmospheric-overlay')
    if (atmosphericOverlay) {
        ScrollTrigger.create({
            trigger: '#about',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => gsap.to(atmosphericOverlay, { opacity: 0.3, duration: 1.5 }),
            onLeaveBack: () => gsap.to(atmosphericOverlay, { opacity: 0.2, duration: 1.5 })
        })

        ScrollTrigger.create({
            trigger: '#skills',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => gsap.to(atmosphericOverlay, { opacity: 0.4, duration: 1.5 }),
            onLeaveBack: () => gsap.to(atmosphericOverlay, { opacity: 0.3, duration: 1.5 })
        })

        ScrollTrigger.create({
            trigger: '#projects',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => gsap.to(atmosphericOverlay, { opacity: 0.35, duration: 1.5 }),
            onLeaveBack: () => gsap.to(atmosphericOverlay, { opacity: 0.4, duration: 1.5 })
        })
    }

    // Parallax effect on glass cards
    gsap.utils.toArray('.glass').forEach((card) => {
        gsap.to(card, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        })
    })

    // Stagger animations for skill tags
    gsap.utils.toArray('.skill-category').forEach((category) => {
        const tags = category.querySelectorAll('.skill-tag')
        gsap.from(tags, {
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: category,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        })
    })

    // Project cards entrance
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        })
    })

    // Timeline items animation
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        })
    })

    // Contact form entrance
    const contactForm = document.querySelector('.contact-form')
    if (contactForm) {
        gsap.from(contactForm, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: contactForm,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        })
    }

    // Refresh ScrollTrigger after all animations are set
    ScrollTrigger.refresh()
}

// Export for potential use
export { initScrollAnimations }

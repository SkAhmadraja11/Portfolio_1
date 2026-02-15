// Premium text animations
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Wait for fonts to load
document.fonts.ready.then(() => {
    initTextAnimations()
})

function initTextAnimations() {
    // Hero title animation
    const heroTitle = document.querySelector('.hero h1')
    if (heroTitle) {
        gsap.from(heroTitle, {
            opacity: 0,
            y: 60,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.4
        })
    }

    // Hero subtitle
    const heroSubtitle = document.querySelectorAll('.hero p')
    if (heroSubtitle.length > 0) {
        gsap.from(heroSubtitle, {
            opacity: 0,
            y: 30,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power2.out',
            delay: 0.8
        })
    }

    // Section headings reveal
    gsap.utils.toArray('h2').forEach((heading) => {
        gsap.from(heading, {
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        })
    })

    // Paragraph reveals
    gsap.utils.toArray('.section p').forEach((paragraph) => {
        gsap.from(paragraph, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: paragraph,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        })
    })

    // Subtle blur reveal for headings
    gsap.utils.toArray('h3, h4').forEach((heading) => {
        gsap.from(heading, {
            opacity: 0,
            filter: 'blur(8px)',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: heading,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            }
        })
    })
}

// Export for potential use
export { initTextAnimations }

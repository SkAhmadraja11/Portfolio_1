import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Advanced Scroll Animations
 * Premium scroll-based reveals and parallax effects
 */

class AdvancedScrollAnimations {
    constructor() {
        this.init()
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations())
        } else {
            this.setupAnimations()
        }
    }

    setupAnimations() {
        this.animateCards()
        this.animateSkills()
        this.animateTimeline()
        this.parallaxElements()
        this.revealSections()
    }

    animateCards() {
        const cards = document.querySelectorAll('.project-card, .coding-profile-card, .glass')

        cards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 100,
                    scale: 0.9,
                    rotationX: -15
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotationX: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 60%',
                        toggleActions: 'play none none none'
                    }
                }
            )

            // Hover 3D effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const centerX = rect.width / 2
                const centerY = rect.height / 2

                const rotateX = (y - centerY) / 20
                const rotateY = (centerX - x) / 20

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.5,
                    ease: 'power2.out'
                })
            })

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                })
            })
        })
    }

    animateSkills() {
        const skillTags = document.querySelectorAll('.skill-tag, .tech-tag')

        skillTags.forEach((tag, index) => {
            gsap.fromTo(tag,
                {
                    opacity: 0,
                    scale: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: tag,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            )
        })
    }

    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item, [class*="timeline"]')

        timelineItems.forEach((item, index) => {
            const isEven = index % 2 === 0

            gsap.fromTo(item,
                {
                    opacity: 0,
                    x: isEven ? -100 : 100,
                    rotationY: isEven ? -15 : 15
                },
                {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            )
        })
    }

    parallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]')

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5

            gsap.to(element, {
                yPercent: -50 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            })
        })
    }

    revealSections() {
        const sections = document.querySelectorAll('.section')

        sections.forEach(section => {
            // Section fade in
            gsap.fromTo(section,
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            )

            // Section heading underline reveal
            const heading = section.querySelector('h2')
            if (heading) {
                const underline = document.createElement('div')
                underline.style.cssText = `
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, #9d7ff5, #60a5fa);
          margin: 1rem auto 0;
          border-radius: 2px;
        `
                heading.parentNode.insertBefore(underline, heading.nextSibling)

                gsap.to(underline, {
                    width: '80px',
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                })
            }
        })
    }
}

// Initialize
new AdvancedScrollAnimations()

export default AdvancedScrollAnimations

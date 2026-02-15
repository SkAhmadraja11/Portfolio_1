import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Advanced Text Reveal Animation System
 * Mont-Fort style character-by-character reveals
 */

class TextReveal {
    constructor() {
        this.init()
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations())
        } else {
            this.setupAnimations()
        }
    }

    setupAnimations() {
        // Animate headings with character split
        this.animateHeadings()

        // Animate paragraphs with word split
        this.animateParagraphs()

        // Animate section labels
        this.animateLabels()
    }

    splitTextIntoChars(element) {
        const text = element.textContent
        element.innerHTML = ''

        const chars = text.split('')
        chars.forEach((char, index) => {
            const span = document.createElement('span')
            span.textContent = char === ' ' ? '\u00A0' : char
            span.style.display = 'inline-block'
            span.style.opacity = '0'
            span.classList.add('char')
            element.appendChild(span)
        })

        return element.querySelectorAll('.char')
    }

    splitTextIntoWords(element) {
        const text = element.textContent
        element.innerHTML = ''

        const words = text.split(' ')
        words.forEach((word, index) => {
            const span = document.createElement('span')
            span.textContent = word
            span.style.display = 'inline-block'
            span.style.opacity = '0'
            span.classList.add('word')
            element.appendChild(span)

            if (index < words.length - 1) {
                element.appendChild(document.createTextNode(' '))
            }
        })

        return element.querySelectorAll('.word')
    }

    animateHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3')

        headings.forEach(heading => {
            // Skip if already animated
            if (heading.classList.contains('text-reveal-animated')) return

            const chars = this.splitTextIntoChars(heading)
            heading.classList.add('text-reveal-animated')

            gsap.fromTo(chars,
                {
                    opacity: 0,
                    y: 100,
                    rotationX: -90,
                    transformOrigin: '50% 50%'
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.8,
                    stagger: {
                        amount: 0.5,
                        from: 'start'
                    },
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            )
        })
    }

    animateParagraphs() {
        const paragraphs = document.querySelectorAll('p')

        paragraphs.forEach(paragraph => {
            // Skip if already animated or too short
            if (paragraph.classList.contains('text-reveal-animated') || paragraph.textContent.length < 20) return

            const words = this.splitTextIntoWords(paragraph)
            paragraph.classList.add('text-reveal-animated')

            gsap.fromTo(words,
                {
                    opacity: 0,
                    y: 20,
                    filter: 'blur(10px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    stagger: {
                        amount: 0.8,
                        from: 'start'
                    },
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: paragraph,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            )
        })
    }

    animateLabels() {
        const labels = document.querySelectorAll('.section-label, .badge')

        labels.forEach(label => {
            if (label.classList.contains('text-reveal-animated')) return

            label.classList.add('text-reveal-animated')

            gsap.fromTo(label,
                {
                    opacity: 0,
                    scale: 0.8,
                    y: 20
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: label,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            )
        })
    }
}

// Initialize
new TextReveal()

export default TextReveal

import { gsap } from 'gsap'

/**
 * Magnetic Cursor Effect
 * Premium cursor that follows mouse with smooth lerp and magnetic attraction
 */

class MagneticCursor {
    constructor() {
        this.cursor = null
        this.cursorInner = null
        this.mouse = { x: 0, y: 0 }
        this.pos = { x: 0, y: 0 }
        this.speed = 0.15
        this.isHovering = false

        this.init()
    }

    init() {
        this.createCursor()
        this.bindEvents()
        this.render()
    }

    createCursor() {
        // Create custom cursor elements
        this.cursor = document.createElement('div')
        this.cursor.className = 'magnetic-cursor'
        this.cursor.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(157, 127, 245, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
    `

        this.cursorInner = document.createElement('div')
        this.cursorInner.className = 'magnetic-cursor-inner'
        this.cursorInner.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: rgba(157, 127, 245, 0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.15s ease;
    `

        document.body.appendChild(this.cursor)
        document.body.appendChild(this.cursorInner)

        // Hide default cursor
        document.body.style.cursor = 'none'
    }

    bindEvents() {
        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX
            this.mouse.y = e.clientY
        })

        // Magnetic effect on interactive elements
        const magneticElements = document.querySelectorAll('a, button, .btn, .project-card, .coding-profile-card, .skill-tag')

        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true
                gsap.to(this.cursor, {
                    width: 60,
                    height: 60,
                    borderColor: 'rgba(157, 127, 245, 0.8)',
                    duration: 0.3,
                    ease: 'power2.out'
                })
            })

            el.addEventListener('mouseleave', () => {
                this.isHovering = false
                gsap.to(this.cursor, {
                    width: 40,
                    height: 40,
                    borderColor: 'rgba(157, 127, 245, 0.5)',
                    duration: 0.3,
                    ease: 'power2.out'
                })
            })

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect()
                const x = e.clientX - rect.left - rect.width / 2
                const y = e.clientY - rect.top - rect.height / 2

                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.5,
                    ease: 'power2.out'
                })
            })

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                })
            })
        })
    }

    render() {
        // Smooth lerp movement
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed

        // Update cursor position
        this.cursor.style.transform = `translate(${this.pos.x - 20}px, ${this.pos.y - 20}px)`
        this.cursorInner.style.transform = `translate(${this.mouse.x - 4}px, ${this.mouse.y - 4}px)`

        requestAnimationFrame(() => this.render())
    }
}

// Initialize only on desktop
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    new MagneticCursor()
}

export default MagneticCursor

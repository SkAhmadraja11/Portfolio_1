import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Horizontal Scroll System
 * Mont-Fort style horizontal scrolling sections
 */

class HorizontalScroll {
    constructor() {
        this.sections = []
        this.init()
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup())
        } else {
            this.setup()
        }
    }

    setup() {
        // Find all horizontal scroll sections
        const horizontalSections = document.querySelectorAll('.horizontal-section')

        horizontalSections.forEach(section => {
            this.createHorizontalScroll(section)
        })
    }

    createHorizontalScroll(section) {
        const container = section.querySelector('.container')
        const scrollContent = section.querySelector('[style*="grid"]') || section.querySelector('.horizontal-content')

        if (!scrollContent) return

        // Wrap content in horizontal container
        const wrapper = document.createElement('div')
        wrapper.className = 'horizontal-wrapper'
        wrapper.style.cssText = 'display: flex; gap: 2.5rem; width: max-content;'

        // Move grid items to horizontal layout
        const items = Array.from(scrollContent.children)
        items.forEach(item => {
            item.style.minWidth = '450px'
            item.style.flex = '0 0 auto'
            wrapper.appendChild(item)
        })

        scrollContent.replaceWith(wrapper)

        // Create horizontal scroll animation
        const scrollWidth = wrapper.scrollWidth - window.innerWidth

        gsap.to(wrapper, {
            x: () => -scrollWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 1,
                end: () => `+=${scrollWidth}`,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        })

        // Add progress indicator
        this.addProgressIndicator(section)
    }

    addProgressIndicator(section) {
        const indicator = document.createElement('div')
        indicator.className = 'scroll-progress'
        indicator.style.cssText = `
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      z-index: 10;
    `

        const bar = document.createElement('div')
        bar.style.cssText = `
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, #9d7ff5, #60a5fa);
      border-radius: 2px;
      transition: width 0.1s ease-out;
    `

        indicator.appendChild(bar)
        section.appendChild(indicator)

        // Update progress on scroll
        ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                bar.style.width = `${self.progress * 100}%`
            }
        })
    }
}

// Initialize
new HorizontalScroll()

export default HorizontalScroll

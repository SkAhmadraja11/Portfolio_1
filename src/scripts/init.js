import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// Configure GSAP for slow, cinematic animations
gsap.config({
  force3D: true,
  nullTargetWarn: false
})

gsap.defaults({
  ease: 'power1.inOut',
  duration: 1.2
})

//— Lenis smooth scroll setup —
let lenis = null
  ; (async () => {
    try {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration: 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false
      })

      window.lenis = lenis

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      if (typeof lenis.on === 'function') {
        lenis.on('scroll', ScrollTrigger.update)
      }
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) { return arguments.length ? lenis.scrollTo(value) : lenis.scroll }
      })
    } catch (err) {
      console.warn('Lenis not available; falling back to native scroll.', err && err.message)
    }
  })()

/**
 * Enhanced Cinematic 3D Background
 * High-quality atmospheric depth with refined motion
 */

class EnhancedCinematicBackground {
  constructor(canvas) {
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })

    this.time = 0
    this.scrollProgress = 0
    this.mouse = { x: 0, y: 0 }
    this.targetMouse = { x: 0, y: 0 }

    this.init()
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.camera.position.set(0, 50, 200)
    this.camera.lookAt(0, 0, 0)

    // Fluid Water Plane
    const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128)
    this.material = new THREE.MeshPhongMaterial({
      color: 0x1e3a8a, // Deep blue
      emissive: 0x1d4ed8, // Brighter blue
      specular: 0x60a5fa,
      shininess: 100,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
      flatShading: false,
      side: THREE.DoubleSide
    })

    this.water = new THREE.Mesh(geometry, this.material)
    this.water.rotation.x = -Math.PI / 2
    this.water.position.y = -50
    this.scene.add(this.water)

    // Lighting for water reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(ambientLight)

    this.pointLight = new THREE.PointLight(0x60a5fa, 2, 1000)
    this.pointLight.position.set(0, 100, 100)
    this.scene.add(this.pointLight)

    const spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(0, 500, 100)
    this.scene.add(spotLight)

    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true })

    if (window.lenis) {
      window.lenis.on('scroll', ({ scroll, limit }) => {
        this.scrollProgress = limit > 0 ? scroll / limit : 0
      })
    } else {
      window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      }, { passive: true })
    }

    window.addEventListener('resize', () => this.onResize())
    this.animate()
  }

  onMouseMove(event) {
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    this.time += 0.015

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05

    // Animate water waves
    const positions = this.water.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]

      // Multi-layered sine waves for watery flow
      const wave1 = Math.sin(x * 0.02 + this.time) * 5
      const wave2 = Math.cos(y * 0.02 + this.time * 0.8) * 5
      const wave3 = Math.sin((x + y) * 0.01 + this.time * 1.2) * 3

      // Mouse interaction ripples
      const dx = x - (this.mouse.x * 300)
      const dy = y - (this.mouse.y * 200)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const ripple = Math.sin(dist * 0.05 - this.time * 2) * (1000 / (dist + 50))

      positions[i + 2] = wave1 + wave2 + wave3 + ripple
    }
    this.water.geometry.attributes.position.needsUpdate = true

    // Parallax and scroll effects
    this.camera.position.x = this.mouse.x * 30
    this.camera.position.z = 200 + this.scrollProgress * 100
    this.camera.lookAt(0, 0, 0)

    this.pointLight.position.x = this.mouse.x * 500
    this.pointLight.position.z = 100 + Math.sin(this.time) * 50

    this.renderer.render(this.scene, this.camera)
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// Initialize background
function initBackground() {
  const canvas = document.getElementById('hero3d') || document.getElementById('hero3d-bg')
  if (canvas) {
    new EnhancedCinematicBackground(canvas)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackground)
} else {
  initBackground()
}

/**
 * Refined Entrance Animations
 */

// Hero entrance
gsap.from('.profile-card', {
  y: 20,
  opacity: 0,
  duration: 1.6,
  ease: 'power1.out',
  delay: 0.4
})

// Section reveals
gsap.utils.toArray('.section').forEach((section) => {
  gsap.from(section, {
    y: 30,
    opacity: 0,
    duration: 1.4,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      end: 'top 70%',
      scrub: 1,
      toggleActions: 'play none none reverse'
    }
  })
})

// Heading reveals
gsap.utils.toArray('h1, h2, h3').forEach((heading, index) => {
  gsap.from(heading, {
    y: 15,
    opacity: 0,
    duration: 1.2,
    ease: 'power1.out',
    delay: index * 0.1,
    scrollTrigger: {
      trigger: heading,
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  })
})

// Paragraph reveals
gsap.utils.toArray('p').forEach((p) => {
  gsap.from(p, {
    y: 10,
    opacity: 0,
    duration: 1,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: p,
      start: 'top 92%',
      toggleActions: 'play none none none'
    }
  })
})

// Card reveals
gsap.utils.toArray('.glass, .project-card, .coding-profile-card').forEach((card) => {
  gsap.from(card, {
    y: 25,
    opacity: 0,
    duration: 1.3,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: card,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  })
})

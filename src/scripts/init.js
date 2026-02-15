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
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000)
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })

    this.particleLayers = []
    this.nebulaClouds = []
    this.time = 0
    this.scrollProgress = 0
    this.mouse = { x: 0, y: 0 }
    this.targetMouse = { x: 0, y: 0 }

    this.init()
  }

  init() {
    // High-quality rendering
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1

    this.camera.position.set(0, 0, 300)

    // Atmospheric fog
    this.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.0012)

    // Create layered atmosphere
    this.createParticleLayers()
    this.createNebulaClouds()
    this.createAmbientLighting()

    // Mouse tracking for subtle parallax
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true })

    // Scroll tracking
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

  createParticleLayers() {
    // Multiple depth layers - HIGHLY VISIBLE
    const layers = [
      { count: 1500, size: 3, color: 0x9dabc8, spread: 1200, depth: -300, speed: 0.02, opacity: 0.7 },
      { count: 1200, size: 3.5, color: 0xadbbd8, spread: 1000, depth: -150, speed: 0.03, opacity: 0.8 },
      { count: 900, size: 4, color: 0xbdcbe8, spread: 800, depth: 0, speed: 0.04, opacity: 0.9 },
      { count: 600, size: 4.5, color: 0xcddcf8, spread: 600, depth: 150, speed: 0.05, opacity: 1.0 }
    ]

    layers.forEach((config, index) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(config.count * 3)
      const sizes = new Float32Array(config.count)

      for (let i = 0; i < config.count; i++) {
        const i3 = i * 3

        // Spherical distribution for depth
        const radius = Math.random() * config.spread
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i3 + 2] = radius * Math.cos(phi) + config.depth

        // Size variation
        sizes[i] = config.size * (0.7 + Math.random() * 0.6)
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: config.size,
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })

      const particles = new THREE.Points(geometry, material)
      particles.userData = {
        speed: config.speed,
        baseOpacity: config.opacity,
        layer: index
      }

      this.scene.add(particles)
      this.particleLayers.push(particles)
    })
  }

  createNebulaClouds() {
    // Volumetric atmospheric clouds
    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.SphereGeometry(100, 32, 32)
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x4a5a7a : 0x5a6a8a,
        transparent: true,
        opacity: 0.04,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      })

      const cloud = new THREE.Mesh(geometry, material)
      cloud.position.set(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      )
      cloud.userData = {
        rotationSpeed: 0.00015 + Math.random() * 0.0001,
        floatSpeed: 0.15 + Math.random() * 0.15,
        floatOffset: Math.random() * Math.PI * 2
      }

      this.scene.add(cloud)
      this.nebulaClouds.push(cloud)
    }
  }

  createAmbientLighting() {
    // Subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x3a4a6a, 0.5)
    this.scene.add(ambientLight)

    // Directional lights for depth
    const light1 = new THREE.DirectionalLight(0x6a7a9a, 0.3)
    light1.position.set(200, 200, 200)
    this.scene.add(light1)

    const light2 = new THREE.DirectionalLight(0x5a6a8a, 0.2)
    light2.position.set(-200, -100, -200)
    this.scene.add(light2)
  }

  onMouseMove(event) {
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  animate() {
    requestAnimationFrame(() => this.animate())

    this.time += 0.0008

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.03
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.03

    // Animate particle layers with parallax
    this.particleLayers.forEach((layer, index) => {
      // Slow rotation
      layer.rotation.y = this.time * layer.userData.speed
      layer.rotation.x = Math.sin(this.time * 0.5) * 0.05

      // Gentle floating
      layer.position.y = Math.sin(this.time * 0.8 + index) * 8

      // Scroll-based depth shift
      layer.position.z = layer.userData.layer * 50 - this.scrollProgress * 100

      // Opacity fade on scroll
      const opacityShift = 1 - (this.scrollProgress * 0.2)
      layer.material.opacity = layer.userData.baseOpacity * opacityShift
    })

    // Animate nebula clouds
    this.nebulaClouds.forEach(cloud => {
      cloud.rotation.y += cloud.userData.rotationSpeed
      cloud.rotation.x += cloud.userData.rotationSpeed * 0.5
      cloud.position.y += Math.sin(this.time * cloud.userData.floatSpeed + cloud.userData.floatOffset) * 0.08
    })

    // Subtle camera parallax
    this.camera.position.x = this.mouse.x * 15
    this.camera.position.y = this.mouse.y * 15
    this.camera.lookAt(0, 0, 0)

    // Brightness shift on scroll
    const brightness = 0.5 + (this.scrollProgress * 0.15)
    this.scene.children.forEach(child => {
      if (child.type === 'AmbientLight') {
        child.intensity = brightness
      }
    })

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

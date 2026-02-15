import * as THREE from 'three'

/**
 * WebGL Image Effects
 * Liquid distortion and RGB shift effects for images
 */

class WebGLImageEffect {
    constructor(imageElement) {
        this.imageElement = imageElement
        this.container = null
        this.scene = null
        this.camera = null
        this.renderer = null
        this.mesh = null
        this.mouse = { x: 0, y: 0 }
        this.targetMouse = { x: 0, y: 0 }

        this.init()
    }

    init() {
        // Create container
        this.container = document.createElement('div')
        this.container.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `

        // Replace image with canvas container
        this.imageElement.parentNode.insertBefore(this.container, this.imageElement)
        this.imageElement.style.display = 'none'

        // Setup Three.js
        this.setupScene()
        this.createMesh()
        this.bindEvents()
        this.animate()
    }

    setupScene() {
        const rect = this.container.getBoundingClientRect()

        this.scene = new THREE.Scene()
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        this.renderer.setSize(rect.width, rect.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.container.appendChild(this.renderer.domElement)
    }

    createMesh() {
        // Load texture from image
        const texture = new THREE.TextureLoader().load(this.imageElement.src)

        // Custom shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uTime: { value: 0 },
                uHover: { value: 0 }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uMouse;
        uniform float uTime;
        uniform float uHover;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          
          // Liquid distortion effect
          float dist = distance(uv, uMouse);
          float strength = smoothstep(0.5, 0.0, dist) * uHover;
          
          vec2 distortion = vec2(
            sin(uv.y * 10.0 + uTime * 2.0) * strength * 0.03,
            cos(uv.x * 10.0 + uTime * 2.0) * strength * 0.03
          );
          
          uv += distortion;
          
          // RGB shift
          float r = texture2D(uTexture, uv + vec2(strength * 0.01, 0.0)).r;
          float g = texture2D(uTexture, uv).g;
          float b = texture2D(uTexture, uv - vec2(strength * 0.01, 0.0)).b;
          
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `
        })

        const geometry = new THREE.PlaneGeometry(2, 2)
        this.mesh = new THREE.Mesh(geometry, material)
        this.scene.add(this.mesh)
    }

    bindEvents() {
        this.container.addEventListener('mouseenter', () => {
            this.animateHover(1)
        })

        this.container.addEventListener('mouseleave', () => {
            this.animateHover(0)
        })

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect()
            this.targetMouse.x = (e.clientX - rect.left) / rect.width
            this.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height
        })
    }

    animateHover(target) {
        const start = this.mesh.material.uniforms.uHover.value
        const duration = 600
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = this.easeOutCubic(progress)

            this.mesh.material.uniforms.uHover.value = start + (target - start) * eased

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3)
    }

    animate() {
        requestAnimationFrame(() => this.animate())

        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1

        // Update uniforms
        this.mesh.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y)
        this.mesh.material.uniforms.uTime.value += 0.01

        this.renderer.render(this.scene, this.camera)
    }
}

// Auto-apply to images with class 'webgl-effect'
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img.webgl-effect')
    images.forEach(img => {
        if (img.complete) {
            new WebGLImageEffect(img)
        } else {
            img.addEventListener('load', () => new WebGLImageEffect(img))
        }
    })
})

export default WebGLImageEffect

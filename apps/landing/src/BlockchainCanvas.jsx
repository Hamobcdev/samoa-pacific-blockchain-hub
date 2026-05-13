import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const NODE_LIST = [
  { name: 'CBS',       color: 0xC9A227, size: 0.8  },
  { name: 'MCIT',      color: 0x003087, size: 0.45 },
  { name: 'MOF',       color: 0x00A651, size: 0.45 },
  { name: 'EDUCATION', color: 0x00C4B4, size: 0.45 },
  { name: 'MCIL',      color: 0xCE1126, size: 0.45 },
  { name: 'CUSTOMS',   color: 0xF59E0B, size: 0.45 },
  { name: 'SBS',       color: 0x9C6BDA, size: 0.45 },
  { name: 'NDIDS',     color: 0xA8B8D8, size: 0.45 },
]

const CSS_COLORS = [
  '#C9A227','#003087','#00A651','#00C4B4',
  '#CE1126','#F59E0B','#9C6BDA','#A8B8D8',
]

function MobileNodes() {
  return (
    <>
      <style>{`@keyframes sdpi-node-pulse{0%,100%{opacity:0.35}50%{opacity:0.65}}`}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, background: '#0A1628',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'center', justifyItems: 'center',
        padding: '40px 20px', pointerEvents: 'none',
      }}>
        {NODE_LIST.map((node, i) => (
          <div key={node.name} style={{
            width:  node.size > 0.5 ? '48px' : '32px',
            height: node.size > 0.5 ? '48px' : '32px',
            borderRadius: '50%',
            background: CSS_COLORS[i],
            animation: `sdpi-node-pulse ${2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </>
  )
}

export default function BlockchainCanvas({ blockNumber }) {
  const canvasRef = useRef(null)
  const stateRef  = useRef({ pulseStart: null, prevBlock: null })

  // Update pulse trigger when blockNumber prop changes
  useEffect(() => {
    if (blockNumber !== null && blockNumber !== stateRef.current.prevBlock) {
      stateRef.current.prevBlock  = blockNumber
      stateRef.current.pulseStart = Date.now()
    }
  }, [blockNumber])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    if (isMobile) return
    const canvas = canvasRef.current
    if (!canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0A1628)

    // Scene & camera
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 28

    // Lighting
    const ambient = new THREE.AmbientLight(0x112244, 0.6)
    scene.add(ambient)
    const goldLight = new THREE.PointLight(0xC9A227, 1.2)
    goldLight.position.set(0, 8, 12)
    scene.add(goldLight)
    const blueLight = new THREE.PointLight(0x003087, 0.8)
    blueLight.position.set(-10, -5, 8)
    scene.add(blueLight)

    // Group holding all nodes and lines
    const group = new THREE.Group()
    scene.add(group)

    // Build nodes
    const RADIUS   = 9
    const MINISTRY_COUNT = 7
    const meshes   = []
    const geometries = []
    const materials  = []

    NODE_LIST.forEach((def, i) => {
      const geo = i === 0
        ? new THREE.BoxGeometry(1.1, 1.1, 1.1)
        : new THREE.BoxGeometry(0.65, 0.65, 0.65)
      const mat = new THREE.MeshPhongMaterial({ color: def.color, emissive: def.color, emissiveIntensity: 0.1 })
      geometries.push(geo)
      materials.push(mat)

      const mesh = new THREE.Mesh(geo, mat)

      if (i === 0) {
        // CBS at center
        mesh.position.set(0, 0, 0)
      } else {
        const angle = ((i - 1) / MINISTRY_COUNT) * Math.PI * 2
        mesh.position.set(
          RADIUS * Math.cos(angle),
          RADIUS * Math.sin(angle),
          0,
        )
      }
      meshes.push(mesh)
      group.add(mesh)
    })

    const cbsMesh = meshes[0]

    // Connection lines from CBS to each ministry node
    const linePositions = []
    for (let i = 1; i < meshes.length; i++) {
      linePositions.push(0, 0, 0)
      linePositions.push(meshes[i].position.x, meshes[i].position.y, meshes[i].position.z)
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    const lineMat = new THREE.LineBasicMaterial({ color: 0x2A3F6B, transparent: true, opacity: 0.4 })
    const lines   = new THREE.LineSegments(lineGeo, lineMat)
    group.add(lines)

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const now = Date.now()

      // Gentle group rotation
      group.rotation.y += 0.0008

      // Per-node scale pulse
      meshes.forEach((mesh, i) => {
        const base = 1 + Math.sin(now * 0.001 + i * 0.7) * 0.08

        if (i === 0 && stateRef.current.pulseStart !== null) {
          // CBS block-arrival pulse
          const t = (now - stateRef.current.pulseStart) / 500
          if (t < 1) {
            mesh.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.4)
          } else {
            stateRef.current.pulseStart = null
            mesh.scale.setScalar(base)
          }
        } else {
          mesh.scale.setScalar(base)
        }

        if (i === 0) {
          mesh.rotation.x += 0.001
          mesh.rotation.y += 0.002
          mesh.rotation.z += 0.0008
        } else {
          mesh.rotation.x += 0.003 + (i * 0.0004)
          mesh.rotation.y += 0.005 + (i * 0.0003)
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      geometries.forEach(g => g.dispose())
      materials.forEach(m => m.dispose())
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
    }
  }, [isMobile])

  if (isMobile) return <MobileNodes />

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        width: '100vw', height: '100vh',
        display: 'block', pointerEvents: 'none',
      }}
    />
  )
}

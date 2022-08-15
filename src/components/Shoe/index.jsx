import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, ContactShadows } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import gsap from 'gsap'

import modelSrc from '../../assets/models/shoe-draco.glb'

import { points } from './points'

import ShoePart from './components/ShoePart'

const Shoe = ({ state }) => {
  const { camera } = useThree()

  const [isReady, setReady] = useState(false)

  const shoe = useRef()
  const plane = useRef()
  const selected = useRef()

  const snap = useSnapshot(state)

  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const { nodes, materials } = useGLTF(modelSrc)

  // Animate model
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Update model rotation and position
    shoe.current.rotation.z = -0.2 - (1 + Math.sin(time / 1.5)) / 20
    shoe.current.rotation.x = Math.cos(time / 4) / 8
    shoe.current.position.y = (1 + Math.sin(time / 3)) / 10

    // Update plane direction
    const shouldUpdatePlane =
      plane?.current && selected?.current && camera?.position
    if (shouldUpdatePlane) {
      plane.current.rotation.y = camera.rotation.y
    }
  })

  // Cursor showing current color
  const [hovered, set] = useState(null)

  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`

    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
        cursor
      )}'), auto`
      return () =>
        (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          auto
        )}'), auto`)
    }
  }, [hovered])

  useEffect(() => {
    if (!state.loading && !isReady) {
      gsap.to(shoe.current.rotation, {
        duration: 1.4,
        y: Math.PI * 6,
        ease: 'power3.out',
        delay: 0.5,
      })
      const tl = gsap.timeline()
      tl.to(shoe.current.scale, {
        duration: 1.5,
        x: 1.25,
        y: 1.25,
        z: 1.25,
        delay: 0.5,
        ease: 'power3.out',
      })
      tl.to(shoe.current.scale, {
        duration: 1,
        x: 1,
        y: 1,
        z: 1,
        ease: 'power3.out',
        onComplete: () => {
          setReady(true)
        },
      })
    }
  }, [state.loading, isReady])

  const Panel = () => {
    selected.current = shoe?.current?.children?.find(
      (c) => c?.name === snap?.current
    )

    if (selected?.current) {
      const start = points[snap.current].start

      // const start = new THREE.Vector3()
      // start.fromArray(selected.current.geometry.attributes.position.array)
      // start.z = 0
      // start.x += 0.25

      const name = points[snap.current].name
      const end = points[snap.current].end

      const vertices = useMemo(
        () => [start, end].map((v) => new THREE.Vector3(...v)),
        [start, end]
      )

      const onUpdateGeometry = (geometry) => geometry.setFromPoints(vertices)

      return <ShoePart {...{ onUpdateGeometry, plane, end, name, isReady }} />
    }

    return null
  }

  // Using the GLTFJSX output here to wire in app-state and hook up events
  return (
    <>
      <Panel />

      <group
        ref={shoe}
        dispose={null}
        onPointerOver={(e) => (
          e.stopPropagation(), set(e.object.material.name)
        )}
        onPointerOut={(e) => e.intersections.length === 0 && set(null)}
        onPointerMissed={() => (state.current = null)}
        onClick={(e) => (
          e.stopPropagation(), (state.current = e.object.material.name)
        )}
        scale={0}
      >
        <mesh
          name='laces'
          receiveShadow
          castShadow
          geometry={nodes.shoe.geometry}
          material={materials.laces}
          material-color={snap.items.laces}
        />
        <mesh
          name='mesh'
          receiveShadow
          castShadow
          geometry={nodes.shoe_1.geometry}
          material={materials.mesh}
          material-color={snap.items.mesh}
        />
        <mesh
          name='caps'
          receiveShadow
          castShadow
          geometry={nodes.shoe_2.geometry}
          material={materials.caps}
          material-color={snap.items.caps}
        />
        <mesh
          name='inner'
          receiveShadow
          castShadow
          geometry={nodes.shoe_3.geometry}
          material={materials.inner}
          material-color={snap.items.inner}
        />
        <mesh
          name='sole'
          receiveShadow
          castShadow
          geometry={nodes.shoe_4.geometry}
          material={materials.sole}
          material-color={snap.items.sole}
        />
        <mesh
          name='stripes'
          receiveShadow
          castShadow
          geometry={nodes.shoe_5.geometry}
          material={materials.stripes}
          material-color={snap.items.stripes}
        />
        <mesh
          name='band'
          receiveShadow
          castShadow
          geometry={nodes.shoe_6.geometry}
          material={materials.band}
          material-color={snap.items.band}
        />
        <mesh
          name='patch'
          receiveShadow
          castShadow
          geometry={nodes.shoe_7.geometry}
          material={materials.patch}
          material-color={snap.items.patch}
        />
      </group>
    </>
  )
}

export default Shoe

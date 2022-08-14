import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import gsap from 'gsap'

import modelSrc from '../../assets/models/shoe-draco.glb'

const Shoe = ({ state }) => {
  const ref = useRef()
  const isReady = useRef(false)
  const snap = useSnapshot(state)

  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const { nodes, materials } = useGLTF(modelSrc)

  // Animate model
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    ref.current.rotation.z = -0.2 - (1 + Math.sin(time / 1.5)) / 12
    ref.current.rotation.x = Math.cos(time / 4) / 6
    ref.current.position.y = (1 + Math.sin(time / 1.5)) / 6
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
    if (!state.loading) {
      gsap.to(ref.current.rotation, {
        y: Math.PI * 4,
        ease: 'power3.out',
      })
      const tl = gsap.timeline()
      tl.to(ref.current.scale, {
        duration: 1.5,
        x: 1.25,
        y: 1.25,
        z: 1.25,
        ease: 'power3.out',
      })
      tl.to(ref.current.scale, {
        duration: 1,
        x: 1,
        y: 1,
        z: 1,
        ease: 'power3.out',
        onComplete: () => {
          isReady.current = true
        },
      })
    }
  }, [state.loading])

  // Using the GLTFJSX output here to wire in app-state and hook up events
  return (
    <>
      <group
        ref={ref}
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
          receiveShadow
          castShadow
          geometry={nodes.shoe.geometry}
          material={materials.laces}
          material-color={snap.items.laces}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.shoe_1.geometry}
          material={materials.mesh}
          material-color={snap.items.mesh}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.shoe_2.geometry}
          material={materials.caps}
          material-color={snap.items.caps}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.shoe_3.geometry}
          material={materials.inner}
          material-color={snap.items.inner}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.shoe_4.geometry}
          material={materials.sole}
          material-color={snap.items.sole}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.shoe_5.geometry}
          material={materials.stripes}
          material-color={snap.items.stripes}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.shoe_6.geometry}
          material={materials.band}
          material-color={snap.items.band}
        />
        <mesh
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

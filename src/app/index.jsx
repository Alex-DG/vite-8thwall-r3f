import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'

import use8thWall from '../hooks/use8thWall'

import Wrapper from './Wrapper'

export default function App() {
  const canvas = useRef(null)

  const ready = use8thWall(canvas)

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 60 }} ref={canvas}>
      {ready && <Wrapper />}
    </Canvas>
  )
}

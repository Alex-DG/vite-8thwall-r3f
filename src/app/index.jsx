import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'

import use8thWall from '../hooks/use8thWall'

import WrapperAR from './WrapperAR'

export default function App() {
  const canvas = useRef(null)
  const XR8Data = use8thWall(canvas)

  return (
    <Canvas ref={canvas}>
      <WrapperAR {...{ XR8Data }} />
    </Canvas>
  )
}

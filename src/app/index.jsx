import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'

import Picker from '../components/Picker'

import use8thWall from '../hooks/use8thWall'

import { state } from '../config/state'

import Scene from './Scene'

export default function App() {
  const canvas = useRef(null)
  const XR8Data = use8thWall({ canvas })

  return (
    <>
      <Canvas ref={canvas}>
        {XR8Data && <Scene {...{ XR8Data, state }} />}
      </Canvas>

      <Picker {...{ state }} />
    </>
  )
}

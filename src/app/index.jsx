import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { proxy } from 'valtio'

import Picker from '../components/Picker'

import use8thWall from '../hooks/use8thWall'

import WrapperAR from './WrapperAR'

const state = proxy({
  current: 'mesh',
  items: {
    laces: '#ffffff',
    mesh: '#ffffff',
    caps: '#ffffff',
    inner: '#ffffff',
    sole: '#ffffff',
    stripes: '#ffffff',
    band: '#ffffff',
    patch: '#ffffff',
  },
  loading: true,
})

export default function App() {
  const canvas = useRef(null)
  const XR8Data = use8thWall({ canvas })

  return (
    <>
      <Canvas ref={canvas} shadows>
        {XR8Data && <WrapperAR {...{ XR8Data, state }} />}
      </Canvas>

      <Picker {...{ state }} />
    </>
  )
}

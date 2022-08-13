import React from 'react'
import { useThree } from '@react-three/fiber'
import useWrapperAR from '../hooks/useWrapperAR'
import Box from '../components/Box'

/**
 * Hook XR8 with R3f
 *
 * @param { scene, renderer, camera } - XR8Data
 * @returns
 */
const WrapperAR = ({ XR8Data }) => {
  const set = useThree(({ set }) => set)
  const { wrapper } = useWrapperAR({ ...XR8Data, set })

  return (
    <group ref={wrapper} position={[0, 0, -3]}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Box position={[0, -0.2, 0]} color={'skyblue'} wireframe />
    </group>
  )
}

export default WrapperAR

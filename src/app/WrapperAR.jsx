import { Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import useWrapperAR from '../hooks/useWrapperAR'

import Shoe from '../components/Shoe'
import Loader from '../components/Loader'

/**
 * Hook XR8 with R3f
 *
 * @param { scene, renderer, camera } - XR8Data
 * @returns
 */
const WrapperAR = ({ XR8Data, state }) => {
  const set = useThree(({ set }) => set)
  const { wrapper } = useWrapperAR({ ...XR8Data, set })

  return (
    <group ref={wrapper} position={[0, 0, -1]}>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.6} angle={0.1} position={[0, 12, 10]} />

      <Suspense fallback={<Loader {...{ state }} />}>
        <Shoe {...{ state }} />
      </Suspense>

      <Sparkles count={50} scale={5} size={6} speed={0.3} />
    </group>
  )
}

export default WrapperAR

import { Suspense } from 'react'
import { useThree } from '@react-three/fiber'

import Shoe from '../components/Shoe'
import Loader from '../components/Loader'
import Effects from '../components/Effects'
import Lights from '../components/Lights'

import useWrapperAR from '../hooks/useWrapperAR'

/**
 * Hook XR8 with R3f
 *
 * @param { scene, renderer, camera } - XR8Data
 * @returns
 */
const Scene = ({ XR8Data, state }) => {
  const set = useThree(({ set }) => set)
  const { wrapper } = useWrapperAR({ ...XR8Data, set })

  return (
    <group ref={wrapper} position={[0, 0, -1]}>
      <Lights />

      <Suspense fallback={<Loader {...{ state }} />}>
        <Shoe {...{ state }} />
        <Effects />
      </Suspense>
    </group>
  )
}

export default Scene

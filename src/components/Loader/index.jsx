import { Html } from '@react-three/drei'
import { useEffect } from 'react'

import Box from '../Box'

const Loader = ({ state }) => {
  useEffect(() => {
    return () => {
      state.loading = false
    }
  }, [])

  return (
    <>
      <Html className='loading' center>
        Loading...
      </Html>

      <Box position={[0, -0.2, 0]} color={'skyblue'} wireframe />
    </>
  )
}

export default Loader

import { Html } from '@react-three/drei'
import { useEffect } from 'react'

const Loader = ({ state }) => {
  useEffect(() => {
    return () => {
      state.loading = false
    }
  }, [])

  return (
    <Html className='loading' center>
      Loading...
    </Html>
  )
}

export default Loader

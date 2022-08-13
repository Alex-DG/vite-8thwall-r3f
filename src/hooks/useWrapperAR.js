import { useEffect, useRef } from 'react'

const useWrapperAR = ({ set, scene, camera, ...props }) => {
  const wrapper = useRef()

  // add our app to 8thWall's ThreeJS scene
  useEffect(() => {
    if (scene && wrapper?.current) {
      scene.add(wrapper.current)
    }
  }, [scene, wrapper])

  // set 8thWall's ThreeJS camera as default camera of
  useEffect(() => {
    if (camera) {
      set({ camera: camera })
    }
  }, [camera])

  return { wrapper }
}

export default useWrapperAR

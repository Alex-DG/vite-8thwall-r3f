import { useThree, useFrame } from '@react-three/fiber'
import { useEffect } from 'react'

/**
 *
 * XR8 Wrapper
 *
 */
const Wrapper = () => {
  const { scene, gl, camera } = useThree()

  useFrame(({ gl, scene, camera }) => {
    gl.clearDepth()
    gl.render(scene, camera)
  }, 1)

  const { XR8 } = window

  useEffect(() => {
    XR8.addCameraPipelineModule({
      name: 'xrthree',
      onStart,
      onUpdate,
      onCanvasSizeChange,
      xrScene: xrScene,
    })
  })

  const onCanvasSizeChange = ({ canvasWidth, canvasHeight }) => {
    gl.setSize(canvasWidth, canvasHeight)
    camera.aspect = canvasWidth / canvasHeight
    camera.updateProjectionMatrix()
  }

  const onStart = ({ canvasWidth, canvasHeight }) => {
    gl.autoClear = false
    gl.setSize(canvasWidth, canvasHeight)
    gl.antialias = true

    //Update context?

    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  }

  const onUpdate = ({ processCpuResult }) => {
    const realitySource =
      processCpuResult.reality || processCpuResult.facecontroller

    if (!realitySource) return

    const { rotation, position, intrinsics } = realitySource

    for (let i = 0; i < 16; i++) {
      camera.projectionMatrix.elements[i] = intrinsics[i]
    }

    // Fix for broken raycasting in r103 and higher. Related to:
    //   https://github.com/mrdoob/three.js/pull/15996
    // Note: camera.projectionMatrixInverse wasn't introduced until r96 so check before setting
    // the inverse
    if (camera.projectionMatrixInverse) {
      if (camera.projectionMatrixInverse.invert) {
        // THREE 123 preferred version
        camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
      } else {
        // Backwards compatible version
        camera.projectionMatrixInverse.invert(camera.projectionMatrix)
      }
    }

    if (rotation) camera.setRotationFromQuaternion(rotation)

    if (position) camera.position.set(position.x, position.y, position.z)
  }

  const xrScene = () => {
    return { scene, camera, renderer: gl }
  }

  /**
   * AR Scene
   */
  return (
    <>
      <mesh name='box1' position={[0, 1, -5]}>
        <boxBufferGeometry args={[2, 2, 2]} />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

export default Wrapper

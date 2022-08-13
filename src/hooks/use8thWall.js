import { useEffect, useState } from 'react'
import * as THREE from 'three'

const use8thWall = (canvas) => {
  const [ready, setReady] = useState(false)
  const [XR8Data, setXR8Data] = useState({ ready: false })

  const initScenePipelineModule = () => {
    let engaged = false

    const initXrScene = ({ scene, camera, renderer }) => {
      // Set the initial camera position relative to the scene we just laid out. This must be at a
      // height greater than y=0.
      camera.position.set(0, 2, 2)

      engaged = true

      setXR8Data({ scene, camera, renderer, ready: true })
    }

    // This is a workaround for https://bugs.webkit.org/show_bug.cgi?id=237230
    // Once the fix is released, we can add `&& parseFloat(device.osVersion) < 15.x`
    const device = XR8.XrDevice.deviceEstimate()
    const needsPrerenderFinish =
      device.os === 'iOS' && parseFloat(device.osVersion) >= 15.4

    // Return a camera pipeline module that adds scene elements on start.
    return {
      // Camera pipeline modules need a name. It can be whatever you want but must be unique within
      // your app.
      name: 'threejs-init-scene',
      // onStart is called once when the camera feed begins. In this case, we need to wait for the
      // XR8.Threejs scene to be ready before we can access it to add content. It was created in
      // XR8.Threejs.pipelineModule()'s onStart method.
      onStart: ({ canvas }) => {
        const { scene, camera, renderer } = XR8.Threejs.xrScene() // Get the 3js scene from XR8.Threejs

        console.log('onStart', { scene, camera, renderer })

        initXrScene({ scene, camera, renderer }) // Add objects set the starting camera position.
        // prevent scroll/pinch gestures on canvas
        canvas.addEventListener('touchmove', (event) => {
          event.preventDefault()
        })

        // Sync the xr controller's 6DoF position and camera paremeters with our scene.
        XR8.XrController.updateCameraProjectionMatrix({
          origin: camera.position,
          facing: camera.quaternion,
        })

        // Recenter content when the canvas is tapped.
        canvas.addEventListener(
          'touchstart',
          (e) => {
            e.touches.length === 1 && XR8.XrController.recenter()
          },
          true
        )
      },
      onDetach: () => {
        engaged = false
      },
      onUpdate: ({ processCpuResult }) => {
        if (!engaged) return

        const realitySource =
          processCpuResult.reality || processCpuResult.facecontroller

        if (!realitySource) return

        const { camera } = XR8.Threejs.xrScene()

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
            camera.projectionMatrixInverse
              .copy(camera.projectionMatrix)
              .invert()
          } else {
            // Backwards compatible version
            camera.projectionMatrixInverse.getInverse(camera.projectionMatrix)
          }
        }

        if (rotation) camera.setRotationFromQuaternion(rotation)

        if (position) camera.position.set(position.x, position.y, position.z)
      },
    }
  }

  useEffect(() => {
    const onxrloaded = () => {
      window.THREE = THREE

      XR8.addCameraPipelineModules([
        // Add camera pipeline modules.
        // Existing pipeline modules.
        XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
        XR8.XrController.pipelineModule(), // Enables SLAM tracking.
        XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.

        // XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
        XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
        XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.

        initScenePipelineModule(), // init scene and set the starting camera position.
      ])

      // Open the camera and start running the camera run loop.
      XR8.run({ canvas: canvas.current })

      // setReady(true)
    }

    if (canvas && !ready) {
      window.XR8
        ? onxrloaded()
        : window.addEventListener('xrloaded', onxrloaded)
    }
  }, [canvas])

  return XR8Data
}

export default use8thWall

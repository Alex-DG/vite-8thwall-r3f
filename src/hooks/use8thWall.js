import { useEffect, useState } from 'react'
import * as THREE from 'three'

const use8thWall = ({ canvas }) => {
  const [XR8Data, setXR8Data] = useState(null)

  const initScenePipelineModule = () => {
    const initXrScene = ({ scene, camera, renderer }) => {
      // Set the initial camera position relative to the scene we just laid out. This must be at a
      // height greater than y=0.
      camera.position.set(0, 2, 3)

      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      setXR8Data({ scene, camera, renderer, ready: true })
    }

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
    }

    if (canvas && !XR8Data) {
      window.XR8
        ? onxrloaded()
        : window.addEventListener('xrloaded', onxrloaded)
    }
  }, [canvas])

  return XR8Data
}

export default use8thWall

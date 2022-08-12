import { useEffect, useState } from 'react'
import * as THREE from 'three'

const use8thWall = (canvas) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const onxrloaded = () => {
      window.THREE = THREE

      XR8.addCameraPipelineModules([
        // Add camera pipeline modules.
        // Existing pipeline modules.
        XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
        XR8.XrController.pipelineModule(), // Enables SLAM tracking.

        XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
        XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
        XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
      ])
      // Open the camera and start running the camera run loop.
      XR8.run({ canvas: canvas.current })

      setReady(true)
    }

    if (canvas && !ready) {
      window.XR8
        ? onxrloaded()
        : window.addEventListener('xrloaded', onxrloaded)
    }
  }, [canvas])

  return ready
}

export default use8thWall

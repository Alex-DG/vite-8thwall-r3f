import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  const color = props.color || 'orange'
  const size = props.size || 1
  const wireframe = props.wireframe || false
  const amount = props.amount || 100

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
    ref.current.position.y = Math.sin(Date.now() * 0.001) * 0.25
  })

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[size, size, size, 10, 10, 10]} />
      <meshStandardMaterial
        color={hovered ? 'hotpink' : color}
        wireframe={wireframe}
      />
    </mesh>
  )
}

export default Box

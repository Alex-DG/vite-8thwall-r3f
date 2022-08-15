import { useEffect, useRef } from 'react'
import { DoubleSide } from 'three'
import { Text3D } from '@react-three/drei'
import gsap from 'gsap'

import fontSrc from '../../../../assets/fonts/helvetiker_regular.typeface.json'

const ShoePart = ({ onUpdateGeometry, plane, end, name, isReady }) => {
  const textSize = 0.2
  const planeWidth = (textSize / 1.8) * name.length

  const planeMat = useRef()
  const lineMat = useRef()
  const textMat = useRef()

  useEffect(() => {
    if (isReady) {
      const options = {
        duration: 1.25,
        opacity: 1,
        ease: 'power3.out',
      }
      gsap.to(textMat.current, options)
      gsap.to(lineMat.current, options)
      gsap.to(planeMat.current, options)
    }
  }, [isReady])

  return (
    <>
      <line>
        <bufferGeometry attach='geometry' onUpdate={onUpdateGeometry} />
        <lineBasicMaterial
          ref={lineMat}
          attach='material'
          color='white'
          linewidth={2}
          transparent
          opacity={0}
        />
      </line>

      <group ref={plane}>
        <mesh position={end}>
          <planeBufferGeometry
            attach='geometry'
            args={[planeWidth, 0.4, 15, 15]}
          />
          <meshBasicMaterial
            ref={planeMat}
            attach='material'
            color='white'
            wireframe
            side={DoubleSide}
            transparent
            opacity={0}
          />
        </mesh>

        <Text3D
          position={[end[0] - 0.25, end[1] - 0.05, end[2]]}
          {...{
            font: fontSrc,
            size: textSize,
            height: 0.08,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.008,
            bevelOffset: 0,
            bevelSegments: 5,
          }}
        >
          {name} <meshNormalMaterial ref={textMat} transparent opacity={0} />
        </Text3D>
      </group>
    </>
  )
}

export default ShoePart

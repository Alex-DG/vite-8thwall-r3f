import * as THREE from 'three'
import { Text3D } from '@react-three/drei'

import fontSrc from '../../../../assets/fonts/helvetiker_regular.typeface.json'

const ShoePart = ({ onUpdateGeometry, plane, end, name }) => {
  const textSize = 0.2
  const planeWidth = (textSize / 1.8) * name.length

  return (
    <>
      <line>
        <bufferGeometry attach='geometry' onUpdate={onUpdateGeometry} />
        <lineBasicMaterial attach='material' color='white' linewidth={2} />
      </line>

      <group ref={plane}>
        <mesh position={end}>
          <planeBufferGeometry
            attach='geometry'
            args={[planeWidth, 0.4, 15, 15]}
          />
          <meshBasicMaterial
            attach='material'
            color='white'
            wireframe
            side={THREE.DoubleSide}
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
          {name} <meshNormalMaterial />
        </Text3D>
      </group>
    </>
  )
}

export default ShoePart

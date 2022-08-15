import { Stars, Cloud, Backdrop } from '@react-three/drei'

const Effects = () => {
  return (
    <>
      <Backdrop
        receiveShadow
        scale={[3, 1.8, 2]}
        floor={0.9}
        rotation={[0, -Math.PI / 10, 0]}
        position={[-0.25, -1, -1.6]}
      >
        <meshPhysicalMaterial
          roughness={1}
          color={'skyblue'}
          emissive={'pink'}
          emissiveIntensity={0.46}
        />
      </Backdrop>

      <Stars
        radius={55}
        depth={1}
        count={2000}
        factor={8}
        saturation={0}
        fade
        speed={5}
      />

      <Cloud
        opacity={0.7}
        speed={0.5}
        width={12}
        depth={-8}
        segments={22}
        depthTest={false}
      />
    </>
  )
}

export default Effects

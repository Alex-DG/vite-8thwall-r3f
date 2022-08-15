const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, 10]}
        castShadow
      />
      <directionalLight
        intensity={0.2}
        color={'white'}
        position={[-5, 6, 5]}
        rotateX={Math.PI / 4}
      />
    </>
  )
}

export default Lights

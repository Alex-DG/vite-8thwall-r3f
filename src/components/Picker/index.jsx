import { HexColorPicker } from 'react-colorful'
import { useSnapshot } from 'valtio'

const Picker = ({ state }) => {
  const snap = useSnapshot(state)

  return (
    <div
      className='picker-container'
      style={{ display: snap.current ? 'block' : 'none' }}
    >
      <HexColorPicker
        className='picker'
        color={snap.items[snap.current]}
        onChange={(color) => (state.items[snap.current] = color)}
      />
      <h1>{snap.current}</h1>
    </div>
  )
}

export default Picker

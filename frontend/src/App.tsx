import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Selector from './Selector.tsx'
import Header from './Header.tsx'
import Image from './Image.tsx'
import "./App.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Selector />

    </>
  )
}

export default App

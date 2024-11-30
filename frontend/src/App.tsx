import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Selector from './Selector.tsx'
import Header from './Header.tsx'
import Image from './Image.tsx'
import "./App.css"
import { Routes, Route } from "react-router-dom";
import Stats from "./Stats.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Selector />} />
        <Route path="/results" element={<Stats />} />
      </Routes>
    </>
  )
}

export default App

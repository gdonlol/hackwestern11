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
  const [genImage, setGenImage] = useState(null)
  const [upImage, setUpImage] = useState("")



  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Selector genImage={genImage} setGenImage={setGenImage} setUpImage={setUpImage} />} />
        <Route path="/results" element={<Stats upImage={upImage} genImage={genImage}/>}/>
      </Routes>
    </>
  )
}

export default App

import React from "react";
import { useState } from "react";
import "./App.css"
import Image from "./Image";
import apiService from "./services/apiService";

type Props = {
  setGenImage: any;
  setUpImage: any;
}

function Selector({setGenImage, setUpImage}: Props) {
  const [category, setCategory] = useState(0)
  const [style, setStyle] = useState(0)
  const [showStyle, setShowStyle] = useState(false)
  const [showGen, setShowGen] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [loading, setLoading] = useState(false)

  const handleScrollToSection = (id: string) => {
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  
  const handleCategoryClick = (e:any, x:number) => {
    setCategory(x)
    setShowStyle(true)
    handleScrollToSection('section2')
  }

  const handleStyleClick = (e:any, x:number) => {
    setStyle(x)
    setShowGen(true)
  }

  const handleFetchImage = async () => {
    setLoading(true)
    const rawJson = await apiService.getImage(category === 3 ? "still" : `${category === 2 ? "body" : "face"}${category === 1 ? "real" : "anime"}`)
    setImgSrc(rawJson.balls.original)
    setGenImage(rawJson.balls)
    setShowImage(true)
  }

  return (
    <div>
      <div className="bottom-gradient" style={{pointerEvents:"none"}}></div>
      <div className="section">
        
        <h1>Choose a category</h1>
        <div className="options">
          <button className={"btn " + (category===1 ? "selected":"")} onClick={e => handleCategoryClick(e, 1)}>Face</button>
          <button className={"btn " + (category===2 ? "selected":"")} onClick={e => handleCategoryClick(e, 2)}>Body</button>
          <button className={"btn " + (category===3 ? "selected":"")} onClick={e => handleCategoryClick(e, 3)}>Still Life</button>
        </div>
      </div> 
      
      {showStyle &&
        <div className={`style-container ${showStyle ? "fade-in":""}`}>
          <h1 id="section2" style={{marginTop:64}}>Choose a style</h1>
          <div className="options">
            <button className={"btn " + (style===1 ? "selected":"")} onClick={e => handleStyleClick(e, 1)}>Normal</button>
            <button className={"btn " + (style===2 ? "selected":"")} onClick={e => handleStyleClick(e, 2)}>Cartoon</button>
          </div>
          
          {showGen && !showImage &&
            <button style={{marginTop:100, marginBottom:100}} className="generate-btn" onClick={() => handleFetchImage()}>{!loading ? "Generate" : "..."}</button>
          }

          {showImage &&
            <Image base64src={imgSrc} setUpImage={setUpImage} category={category} style={style} setImgSrc={setImgSrc}/>
          }

          
          
        </div>
      }
    </div>
  )
}

export default Selector
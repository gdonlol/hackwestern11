import React from "react";
import { useState } from "react";
import "./App.css"
import Image from "./Image";
import apiService from "./services/apiService";
import Background from "./Background";

type Props = {}

function Selector({}: Props) {
  const [category, setCategory] = useState(0)
  const [style, setStyle] = useState(0)
  const [showStyle, setShowStyle] = useState(false)
  const [showGen, setShowGen] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [imgSrc, setImcSrc] = useState<any>(null);

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
    const imgsrc = await apiService.getImage();
    setImcSrc(imgsrc)
    setShowImage(true)
  }

  return (
    <div>
      <div className="bottom-gradient"></div>
      <div className="section">
        
        <h1>Choose a category</h1>
        <div className="options">
          <button className={"btn " + (category===1 ? "selected":"")} onClick={e => handleCategoryClick(e, 1)}>Figure</button>
          <button className={"btn " + (category===2 ? "selected":"")} onClick={e => handleCategoryClick(e, 2)}>Face</button>
          <button className={"btn " + (category===3 ? "selected":"")} onClick={e => handleCategoryClick(e, 3)}>Still life</button>
        </div>
      </div> 
      
      {showStyle &&
        <div className={`style-container ${showStyle ? "fade-in":""}`}>
          <h1 id="section2" style={{marginTop:64}}>Choose a style</h1>
          <div className="options">
            <button className={"btn " + (style===1 ? "selected":"")} onClick={e => handleStyleClick(e, 1)}>Realistic</button>
            <button className={"btn " + (style===2 ? "selected":"")} onClick={e => handleStyleClick(e, 2)}>Anime</button>
          </div>

          {showGen && !showImage &&
            <button style={{marginTop:100, marginBottom:100}} className="generate-btn" onClick={() => handleFetchImage()}>Generate</button>
          }

          {showImage &&
            <Image src={imgSrc}/>
          }
          
        </div>
      }

      
    </div>
  )
}

export default Selector
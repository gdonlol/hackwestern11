import React from "react";
import { useState } from "react";
import "./App.css"

type Props = {}

function Selector({}: Props) {
  const [category, setCategory] = useState(0)
  const [style, setStyle] = useState(0)
  const [showStyle, setShowStyle] = useState(false)
  const [showGen, setShowGen] = useState(false)

  const handleCategoryClick = (e:any, x:number) => {
    setCategory(x)
    setShowStyle(true)
  }

  const handleStyleClick = (e:any, x:number) => {
    setStyle(x)
    setShowGen(true)
  }

  return (
    <div>
      <div className="section">
        <h1>Choose a category</h1>
        <div className="options">
          <button className={"btn " + (category===1 ? "selected":"")} onClick={e => handleCategoryClick(e, 1)}>Figure</button>
          <button className={"btn " + (category===2 ? "selected":"")} onClick={e => handleCategoryClick(e, 2)}>Face</button>
          <button className={"btn " + (category===3 ? "selected":"")} onClick={e => handleCategoryClick(e, 3)}>Still life</button>
        </div>
      </div> 

      {showStyle &&
          <div className={showStyle ? "fade-in":""}>
            <h1>Choose a style</h1>
            <div className="options">
              <button className={"btn " + (style===1 ? "selected":"")} onClick={e => handleStyleClick(e, 1)}>Realistic</button>
              <button className={"btn " + (style===2 ? "selected":"")} onClick={e => handleStyleClick(e, 2)}>Anime</button>
            </div>
          </div>
        }

      {showGen &&
        <button style={{marginTop:64, marginBottom:100}} className="generate-btn">Generate</button>

      }
    </div>
  )
}

export default Selector
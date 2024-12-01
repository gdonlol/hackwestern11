import React from "react";
import { useState } from "react";
import "./App.css";


type Props = {
  genImage: any; 
  upImage: string;  
};


const Stats: React.FC<Props> = ({genImage, upImage}) => {
  return (
    <div className="statistics-container">
      <div className="art-and-info">
        <div className="art-section">
          {upImage ? (
            <img src={upImage} style={{width:"80%"}} alt="Uploaded"/>
          ) : (
            <p>No image uploaded</p>
          )}
          {genImage ? (
            <img src={`data:image/png;base64, ${genImage.original}`} style={{width:"80%"}} alt="Generated"/>
          ) : (
            <p>No generated image</p>
          )}
        </div>
        <div className="info-section">
          <div className="grade-circle">
            <h1>A+</h1>
            <p>accuracy: 98%</p>
          </div>
          <div className="additional-text">
            <p>Placeholder text for analysis details</p>
            <p>Additional space for future content.</p>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar">
              <div className="xp-progress"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn">Retry Picture</button>
        <button className="btn">Retry Category</button>
        <button className="btn">Next</button>
      </div>
    </div>
  );
};

export default Stats;

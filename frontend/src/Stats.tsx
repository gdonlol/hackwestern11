import React from "react";
import { useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";


type Props = {
  genImage: any; 
  upImage: string;  
  score: number;
};


const Stats: React.FC<Props> = ({genImage, upImage, score}) => {
  const highscore = localStorage.getItem("highscore");
  if (!highscore || parseInt(highscore, 10) <= score) {
    localStorage.setItem("highscore", score.toString());
  }
  return (
    <div className="statistics-container">
      <div className="art-and-info">
        <div className="art-section">
          {upImage ? (
            <img src={`data:image/png;base64, ${upImage}`} style={{width:"80%"}} alt="Uploaded"/>
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
          <div className="grade-circle" style={{borderColor: score >= 0.5 ? (score >= 0.6 ? (score >= 0.80 ? (score >= 0.90? (score >= 0.97? "red" : "orange") : "yellow") : "green") : "blue") : "grey"}}>
            <h1>{score >= 0.5 ? (score >= 0.6 ? (score >= 0.70 ? (score >= 0.90? (score >= 0.97? "S" : "A") : "B") : "C") : "D") : "F"}</h1>
            <p>Accuracy: {(score*100).toFixed(0)}%</p>
          </div>
          <div className="additional-text">
            <p>Daily Streak: 0</p>
            <p>Highscore: {localStorage.getItem("highscore") || 0}</p>
            <div className="action-buttons">
              <Link to='/' className="action-buttons-btn">Exit</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;

import React from "react";
import { useState } from "react";
import "./App.css";

type Props = {}


function Stats({}: Props) {
  return (
    <div className="statistics-container">
      <div className="art-and-info">
        <div className="art-section">
          <div className="art-box"></div>
          <div className="art-box"></div>
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
        <button>Retry Picture</button>
        <button>Retry Category</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default Stats;

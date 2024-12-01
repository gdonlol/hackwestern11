import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "./services/apiService";

type Props = {
  base64src: string;
  setUpImage: any;
  category: number;
  style: number;
  setImgSrc: any;
  genImage: any;
  setGenImage: any;
  setScore: any;
};

const Image: React.FC<Props> = ({setScore, genImage, setGenImage, base64src, setUpImage, category, style, setImgSrc}: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const toggleGrid = () => setShowGrid(prev => !prev);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          const result = reader.result as string
          const base64String = result.split(',')[1]
          setUpImage(base64String)
          const scoreData = await apiService.getScore({lineart: genImage.lineart, drawing: base64String})
          setScore(scoreData.balls.score)
          navigate('/results')
        }
      }
      reader.readAsDataURL(file)
    }
  };
  

  const regenerateImage = async () => {
    setLoading(true)
    const rawJson = await apiService.getImage((category === 3 ? "still" : category === 2 ? "body" : "face") + (style === 1 ? "real" : "anime"))
    setImgSrc(rawJson.balls.original)
    setGenImage(rawJson.balls)
    setLoading(false)
  };

  return (
    <>
      
      <div style={{display: 'flex', position:'relative', flexDirection: 'column', alignItems: 'center', marginBottom: 64}}>
        <h1 className="title" style={{marginTop:64}}>Generated reference image</h1>
        <p style={{marginBottom: '48px'}}>Create a black-and-white line art sketch of the image below (2:3)</p>
        
          <div className="image-container">
          {showGrid && 
            <div className="grid">
              <div className="grid-item" style={{ top: '0', left: '0' }}></div>
              <div className="grid-item" style={{ top: '0', left: '33.33%' }}></div>
              <div className="grid-item" style={{ top: '0', left: '66.66%' }}></div>
              <div className="grid-item" style={{ top: '33.33%', left: '0' }}></div>
              <div className="grid-item" style={{ top: '33.33%', left: '33.33%' }}></div>
              <div className="grid-item" style={{ top: '33.33%', left: '66.66%' }}></div>
              <div className="grid-item" style={{ top: '66.66%', left: '0' }}></div>
              <div className="grid-item" style={{ top: '66.66%', left: '33.33%' }}></div>
              <div className="grid-item" style={{ top: '66.66%', left: '66.66%' }}></div>
            </div>
          }
          <img onClick={() => window.open(`data:image/png;base64, ${base64src}`, '_blank')} src={`data:image/png;base64, ${base64src}`} style={{width: '100%', cursor:'pointer'}}/>
          
        </div>
        <button onClick={toggleGrid} className="regenerate-button" style={{width: 100}}>
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>

        <div className="upload-container">
          <label htmlFor="imageUpload" className="file-label">
            Rate your sketch: 
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageUpload(e)}
            className="file-input"
          />
          <button onClick={loading ? () => {}: () => regenerateImage()} className="regenerate-button" style={{cursor: loading ? 'wait':'pointer'}}>
            {loading ? "Loading..." : "Regenerate"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Image;

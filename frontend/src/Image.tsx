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
};

const Image: React.FC<Props> = ({genImage, base64src, setUpImage, category, style, setImgSrc}: Props) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          const result = reader.result as string
          const base64String = result.split(',')[1]
          setUpImage(base64String)
          await apiService.getScore({lineart: genImage.lineart, drawing: base64String})
          navigate('/results')
        }
      }
      reader.readAsDataURL(file)
    }
  };
  

  const regenerateImage = async () => {
    setLoading(true)
    const rawJson = await apiService.getImage(category === 3 ? "still" : `${category === 2 ? "body" : "face"}${category === 1 ? "real" : "anime"}`)
    setImgSrc(rawJson.balls.original)
    setLoading(false)
  };

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 64}}>
        <h1 className="title" style={{marginTop:64}}>Generated reference image</h1>

        <img src={`data:image/png;base64, ${base64src}`} style={{width: '512px'}}/>

        
        <div className="upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageUpload(e)}
            className="file-input"
          />
          <button onClick={loading ? () => {}: () => regenerateImage()} className="regenerate-button">
            {loading ? "Loading..." : "Regenerate"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Image;

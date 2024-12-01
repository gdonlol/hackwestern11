import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  base64src: string;
  setUpImage: any;
};

const Image: React.FC<Props> = ({base64src, setUpImage}: Props) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUpImage(URL.createObjectURL(file));
      navigate('/results');
    }
  };

  const regenerateImage = () => {
    console.log("Regenerate image");
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
            onChange={handleImageUpload}
            className="file-input"
          />
          <button onClick={regenerateImage} className="regenerate-button">
            Regenerate
          </button>
        </div>
      </div>
    </>
  );
};

export default Image;

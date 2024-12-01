import React from "react";
import { useState } from "react";

type Props = {
  src: any;
  setUpImage: any;
};

const Image: React.FC<Props> = ({src, setUpImage}: Props) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUpImage(file);
    }
  };

  const regenerateImage = () => {
    console.log("Regenerate image");
  };

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 64}}>
        <h1 className="title" style={{marginTop:64}}>Generated reference image</h1>

        {src && <img src={src} style={{width: '512px'}}/>}


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

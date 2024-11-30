import React from "react";
import { useState } from "react";

type Props = {};

const Image: React.FC<Props> = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const regenerateImage = () => {
    console.log("Regenerate image");
  };

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 64}}>
        <h1 className="title" style={{marginTop:64}}>Generated reference image</h1>

        <div className="image-container" />

        {uploadedImage && (
          <div>
            <h2>Uploaded Image</h2>
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

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

import React, { useState } from "react";
import egat from "../assets/default_device.png";
import './UploadImg.css';

const UploadImg = (props) => {
  const { register, label, validate, disabled, error, id, onChangeInput, defaultValue = null, defaultImg, isViewMode = false, ...inputProps } = props;
  const [base64, setBase64] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const input = event.target;
    const file = input.files[0];
    
    if (file) {
      // Check if the file type is an image
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
      
      if (!validImageTypes.includes(file.type)) {
        // Display an error message if the file is not an image
        setErrorMessage("Invalid file type. Please upload an image file (png, jpg, jpeg, svg).");
        return;
      }

      // Clear any previous error messages
      setErrorMessage('');

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        const fileContent = base64Data.slice(base64Data.indexOf(',') + 1);
        const fileName = file.name;
        const fileType = file.type;

        setBase64(fileContent);

        // Update the image preview
        const output = document.getElementById("preview_img");
        output.src = base64Data;

        // Callback to handle the base64 string, filename, and file type
        onChangeInput && onChangeInput({ fileContent, fileName, fileType });
        inputProps.onChange && inputProps.onChange({ fileContent, fileName, fileType });
      };
      reader.readAsDataURL(file);
    }
  };

  const imageSrc = defaultImg || egat; // Fallback to egat if defaultImg is not provided

  return (
    <>
      <label className={`${isViewMode ? 'none' : 'cursor-pointer'}`}>
        {!isViewMode && (
          <>
            <input 
              type="file" 
              className="w-full hidden" 
              accept=".png, .jpg, .jpeg, .svg" 
              onChange={handleChange} 
              aria-label="Upload Image"
            />
          </>
        )}
        <div className={`${isViewMode ? 'image-container-view-only' : 'image-container'}`}>
          <img 
            src={imageSrc} 
            alt="Preview_Img" 
            id="preview_img" 
            className="h-44 w-44 object-cover rounded-full flex items-center justify-center"
          />
        </div>
      </label>
      
      {/* Display error message below the image */}
      {errorMessage && <p className="error-message text-red-500 mt-2">{errorMessage}</p>}
    </>
  );
};

export default UploadImg;

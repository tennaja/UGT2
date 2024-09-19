import React, { useState, useEffect } from "react";
import egat from "../assets/default_device.png"; // Local fallback image
import './UploadImg.css';
import ModelFail from "../Control/Modal/ModalFail";
const UploadImg = (props) => {
  const { onChangeInput, defaultImg, isViewMode = false, ...inputProps } = props;
  const [base64, setBase64] = useState(''); // Store base64 of the new or initial file
  const [errorMessage, setErrorMessage] = useState('');
  const [isShowFailModal, setIsShowFailModal] = useState(false);
  const [messageFailModal, setMessageFailModal] = useState("");
  useEffect(() => {
    // Convert to base64 if it's not the fallback egat image
    const convertToBase64 = (img) => {
      if (!img) return;

      // If defaultImg is the egat fallback, don't send any value, treat it as null
      if (img === egat) {
        inputProps.onChange && inputProps.onChange(null); // Send null when it's the fallback image
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        const fileContent = base64Data.slice(base64Data.indexOf(',') + 1);

        inputProps.onChange && inputProps.onChange({
          fileContent,
          fileName: img.name || 'default_image',
          fileType: img.type || 'image/png', // Assuming PNG as default
        });

        setBase64(base64Data); // Set base64 of the provided image
      };

      // If img is a URL or file-like object
      if (typeof img === 'string') {
        fetch(img)
          .then(response => response.blob())
          .then(blob => reader.readAsDataURL(blob));
      } else {
        reader.readAsDataURL(img); // Handle file-like objects
      }
    };

    // Handle defaultImg or fallback to egat
    const initialImg = defaultImg || egat;
    convertToBase64(initialImg);
  }, [defaultImg, inputProps]);

  // Handle file input changes from user uploads
  const handleChange = (event) => {
    const input = event.target;
    const file = input.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (file) {
      const validImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
      if (file.size > maxSizeInBytes) {
        setErrorMessage("File size exceeds the 20MB limit. Please upload a smaller file.");
        // setIsShowFailModal(true);
        return;
      }
      if (!validImageTypes.includes(file.type)) {
        setErrorMessage("Invalid file type. Please upload an image file (png, jpg, jpeg, svg).");
        input.value = '';  // Reset the file input
        return;
      }

      setErrorMessage(''); // Clear any error messages

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        const fileContent = base64Data.slice(base64Data.indexOf(',') + 1);
        const fileName = file.name;
        const fileType = file.type;

        setBase64(base64Data); // Update base64 state with new image data

        // Call onChange handlers with the new file data
        onChangeInput && onChangeInput({ fileContent, fileName, fileType });
        inputProps.onChange && inputProps.onChange({ fileContent, fileName, fileType });
      };
      reader.readAsDataURL(file);
    }
  };

  const imageSrc = base64 || defaultImg || egat; // Use base64, defaultImg, or egat as image source

  return (
    <div className="flex flex-col items-end justify-end">
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
      {errorMessage && (
      <p className="error-message text-red-500 mt-2">
        {errorMessage}
      </p>
    )}
      {isShowFailModal && (
        <ModelFail
          onClickOk={() => {
            setIsShowFailModal(false);
          }}
          content={messageFailModal}
        />
      )}
    </div>
  );
};

export default UploadImg;

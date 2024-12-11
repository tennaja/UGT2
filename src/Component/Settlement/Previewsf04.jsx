import React, { useState, useEffect } from "react";


function PreviewPdfSF04(data) {
  
  console.log(data.data)
  const [fileUrl, setFileUrl] = useState(null);


  const handlePreview = () => {
    if (data.data) {
      window.open(data.data, '_blank');  // Open the PDF in a new tab
    } 
  };

  return (
    <div>
      {data.data && <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handlePreview}>Preview SF-02</button>}
    </div>
  );
}

export default PreviewPdfSF04;

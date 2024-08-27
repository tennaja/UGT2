import React, { useState, useEffect } from "react";

function TestConnect() {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    fetch('https://ugt-thai-api.egat.co.th/DEV2/api/ugt/v1/device-management/sf02download/3')
      .then((response) => response.blob())  // Handle the response as a blob
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        console.log(url);  // This is the URL you can use to display or preview the PDF
        setFileUrl(url);  // Store the URL in the state
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handlePreview = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');  // Open the PDF in a new tab
    }
  };

  return (
    <div>
      <h1>TestConnect</h1>
      {fileUrl && <button onClick={handlePreview}>Preview PDF</button>}
    </div>
  );
}

export default TestConnect;

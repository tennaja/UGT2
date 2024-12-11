import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Overview from "./Overview";
import MonthlySettlement from "./MonthlySettlement";
import { useLocation } from "react-router-dom";
import PreviewPdfSF04 from "./Previewsf04";
import PdfFormPreviewSF04 from "./TemplatePdfSF04";
import { hideLoading, showLoading } from "../../Utils/Utils";

export default function Settlement() {
  const { state } = useLocation();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const settlementYear = useSelector((state) => state.settlement?.selectedYear);
  const portfolioId = state.id;
  const portfolioName = state.name;
  const [hasSettlementData, setHasSettlementData] = useState(false);
  const tempData = {
    id: 4,
    organisationId: "Registrant Org 7BC63",
    organisationName: "Electricity Generating Authority of Thailand",
    contactPerson: "Mrs.Porntip Eiamsai",
    businessAddress: "53 Moo 2 Charan Santiwong Road, Bang Kruai, Nonthaburi, 11130",
    country: "Thailand",
    email: "pornploy.b@egat.co.th",
    telephone: "024360840",
    capacity:0.0010
}

const [isGenerate,setIsGenarate] = useState(false)
const handlepdf=()=>{
  <PreviewPdfSF04
  data = {tempData}/>
}

const showbase = async ()=>{
  
  setIsGenarate(true)
  const base = await handleGeneratePDF()
  setIsGenarate(false)
  openPDFInNewTab(base,"application/pdf","test.pdf")
  
  console.log(base)
}

const openPDFInNewTab = (base64String,type,name) => {
  const extension = name.split(".").pop();
    const pdfWindow = window.open("");
    console.log("PDF",pdfWindow)
    console.log(type)
    if(extension === "pdf"){
      if (pdfWindow) {
        // Set the title of the new tab to the filename
        pdfWindow.document.title = name;
    
        // Convert Base64 to raw binary data held in a string
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
    
        // Create a Blob from the byte array and set the MIME type
        const blob = new Blob([byteArray], { type: type});
        console.log("Blob",blob)
    
        // Create a URL for the Blob and set it as the iframe source
        const blobURL = URL.createObjectURL(blob);
        console.log("Blob url :" ,blobURL)
        let names = name
    
        const iframe = pdfWindow.document.createElement("iframe");
        
        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.bottom = "0";
        iframe.style.right = "0";
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        
        // Use Blob URL as the iframe source
        iframe.src = blobURL;
    
        // Remove any margin and scrollbars
        pdfWindow.document.body.style.margin = "0";
        pdfWindow.document.body.style.overflow = "hidden";
    
        // Append the iframe to the new window's body
        pdfWindow.document.body.appendChild(iframe);

        // Optionally, automatically trigger file download with correct name
      
      } else {
          alert('Unable to open new tab. Please allow popups for this website.');
      }
    }
    else if(extension === "jpeg" || extension === "jpg" || extension === "png" || extension === "svg"){
      if (pdfWindow) {
        pdfWindow.document.write(`<html><body style="margin:0; display:flex; align-items:center; justify-content:center;">
            <img src="data:image/jpeg;base64,${base64String}" style="max-width:100%; height:auto;"/>
        </body></html>`);
        pdfWindow.document.title = "Image Preview";
        pdfWindow.document.close();
    }
    }
};

const handleGeneratePDF = async () => {
  try {
    
    const base64String = await PdfFormPreviewSF04.generatePdf();
    
    //setPdfBase64(base64String);
    //console.log("Generated Base64 PDF:", base64String);
    return base64String
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
};

  return (
    currentUGTGroup?.id && (
      <div>
        <div className="min-h-screen p-6 items-center justify-center">
          <div className="container max-w-screen-lg mx-auto">
            <div className="text-left flex flex-col">
              <h2 className="font-semibold text-xl text-black">
              {portfolioName}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm mb-6 font-normal`}>
                {currentUGTGroup?.name} / Settlement Management / Settlement Info / {portfolioName}
              </p>
            </div>
            <div>
              {/*<button onClick={showbase}>File</button>*/}
              <PdfFormPreviewSF04 data={tempData} aftersign={tempData}/>
            </div>
            {/* Overview */}
            <Overview
              ugtGroupId={currentUGTGroup?.id}
              portfolioId={portfolioId}
              portfolioName={portfolioName}
              hasSettlementData={hasSettlementData}
            />

            {/* Monthly Settlement */}
            {settlementYear && (
              <MonthlySettlement
                ugtGroupId={currentUGTGroup?.id}
                portfolioId={portfolioId}
                portfolioName={portfolioName}
                setHasSettlementData={setHasSettlementData}
                isShowDetail = {false}
              />
            )}
          </div>
        </div>
        
      </div>
    )
  );
}

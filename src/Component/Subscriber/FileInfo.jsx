import jpgIcon from "../assets/jpg.png";
import pngIcon from "../assets/png.png";
import csvIcon from "../assets/csv.png";
import docxIcon from "../assets/docx.png";
import xlsIcon from "../assets/xls.png";
import txtIcon from "../assets/txt.png";
import pdfIcon from "../assets/pdf.png";
import pptxIcon from "../assets/pptx.png";
import svgIcon from "../assets/svg.png";

import { RiEyeLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";


const FileInfo = (props) =>{
    const {items} = props
    console.log(items)

    const getIcon = (name) => {
        const extension = name?.split(".").pop();
        if (extension === "jpeg" || extension === "jpg") {
          return jpgIcon;
        } else if (extension === "png") {
          return pngIcon;
        } else if (extension === "svg") {
          return svgIcon;
        } else if (extension === "pdf") {
          return pdfIcon;
        } else if (extension === "doc" || extension === "docx") {
          return docxIcon;
        } else if (extension === "xls" || extension === "xlsx") {
          return xlsIcon;
        } else if (extension === "csv") {
          return csvIcon;
        } else if (extension === "pptx" || extension === "ppt") {
          return pptxIcon;
        } else if (extension === "txt") {
          return txtIcon;
        } else {
          return jpgIcon;
        }
      };
      const handleFileChange = (items) => {
        openPDFInNewTab(items.binary,items.type,items.name)
        /*if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Remove metadata
                openPDFInNewTab(base64String);
            };
            reader.readAsDataURL(file);
        }*/
    };
    
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
    const downloadFile =(items)=>{
        const base64Content = items.binary//.split(",")[1];
        const binaryString = atob(base64Content);
        const binaryLength = binaryString.length;
        const bytes = new Uint8Array(binaryLength);

        for (let i = 0; i < binaryLength; i++) {
         bytes[i] = binaryString.charCodeAt(i);
         }

        const blob = new Blob([bytes], { type: items.type });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = items.name;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    return(
        <div className="border-gray-300 border-2 rounded-[10px] mt-2 ">
            <div className="flex items-center p-2">
                <div className="mr-4">
                    <img
                        src={getIcon(items.name)}
                        width={40}
                        height={40}
                    ></img>
                </div>
                <div className="mr-1 flex-1">
                    {items.name}
                </div>
                <div className="flex justify-center mr-3 items-center">
                {items.name?.split(".").pop() === "pdf" ||  items.name?.split(".").pop() === "png" || items.name?.split(".").pop() === "jpg" || items.name?.split(".").pop() === "jpeg" || items.name?.split(".").pop() === "svg"   ?<div>
                        <button type="button"  onClick={()=>handleFileChange(items)}>
                            <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
                        </button>
                    </div>:undefined}
                    <div className="ml-3">
                        <button type="button" onClick={()=>downloadFile(items)}>
                            <LiaDownloadSolid className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FileInfo;
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
        openPDFInNewTab(items.binary,items.type)
        /*if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Remove metadata
                openPDFInNewTab(base64String);
            };
            reader.readAsDataURL(file);
        }*/
    };
    
    const openPDFInNewTab = (base64String,type) => {
        const pdfWindow = window.open("");
        console.log("PDF",pdfWindow)
        console.log(type)
        if (pdfWindow) {
          pdfWindow.document.write(
              `<iframe width="100%" height="100%" src="data:${type};base64,${base64String}" style="border:none; position:fixed; top:0; left:0; bottom:0; right:0; width:100vw; height:100vh;"></iframe>`
          );
          pdfWindow.document.body.style.margin = "0"; // Remove any default margin
                pdfWindow.document.body.style.overflow = "hidden"; // Hide any scrollbars
      } else {
          alert('Unable to open new tab. Please allow popups for this website.');
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
                    {items.name.split(".").pop() === "pdf"&&<div>
                        <button type="button"  onClick={()=>handleFileChange(items)}>
                            <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
                        </button>
                    </div>}
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
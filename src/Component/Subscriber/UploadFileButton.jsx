import React, { useState, useRef } from "react";
import FileInfo from "./FileInfo";
import { message } from "antd";
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
import { LuTrash2 } from "react-icons/lu";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModelFail from "../Control/Modal/ModalFail";

const FileUpload = (props) => {
  const {
    register,
    filesData,
    setFilesData,
    setError,
    clearErrors,
    error,
    disabled,
    onChngeInput,
    onClickFile,
    onDeleteFile,
    id,
    label,
    validate,
    defaultValue = null,
    ...inputProps
  } = props;
  console.log("InputProps", inputProps);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [myFile, setMyFile] = useState(null);
  const inputRef = useRef(null);
  console.log("Error", error);
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // แปลง FileList เป็น Array
    console.log("File", files);
    // กำหนดประเภทไฟล์ที่อนุญาต
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 20 * 1024 * 1024; // 20MB

    let isValid = true;

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        message.error("ไฟล์ประเภทนี้ไม่อนุญาต");
        setError("file", { type: "manual", message: "ไฟล์ประเภทนี้ไม่อนุญาต" });
        isValid = false;
      }

      if (file.size > maxSize) {
        message.error("ขนาดไฟล์เกินขีดจำกัด 20MB");
        setError("file", {
          type: "manual",
          message: "ขนาดไฟล์เกินขีดจำกัด 2MB",
        });
        isValid = false;
      }
    });

    if (!isValid) return;

    //clearErrors('file'); // เคลียร์ข้อความผิดพลาด

    const newFilesData = [];
    //inputProps.onChange(files)
    files.forEach((file) => {
      
      //inputProps.onChange([{file}])
      onChngeInput && onChngeInput(0, file);
    });
  };

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
  const handlePreview = (items) => {
    openPDFInNewTab(items.binary, items.type);
    /*if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Remove metadata
            openPDFInNewTab(base64String);
        };
        reader.readAsDataURL(file);
    }*/
  };

  const openPDFInNewTab = (base64String, type) => {
    const pdfWindow = window.open("");
    console.log("PDF", pdfWindow);
    console.log(type);
    if (pdfWindow) {
      pdfWindow.document.write(
        `<iframe width="100%" height="100%" src="data:${type};base64,${base64String}" style="border:none; position:fixed; top:0; left:0; bottom:0; right:0; width:100vw; height:100vh;"></iframe>`
      );
      pdfWindow.document.body.style.margin = "0"; // Remove any default margin
      pdfWindow.document.body.style.overflow = "hidden"; // Hide any scrollbars
    } else {
      alert("Unable to open new tab. Please allow popups for this website.");
    }
  };
  const downloadFile = (items) => {
    const base64Content = items.binary; //.split(",")[1];
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
  };
  const deleteFile = () => {
    console.log(myFile);
    let fileName = myFile?.name;
    console.log(fileName);
    inputRef.current.value = null;
    setShowModalConfirm(false);
    onDeleteFile(fileName, fileName, fileName);
  };
  const handleDelete = (items) => {
    setShowModalConfirm(true);
    console.log("---Delete---", items);
    setMyFile(items);
  };
  const handleCloseDelete = () => {
    setShowModalConfirm(false);
  };

  return (
    <div
      className={` ${
        error &&
        "border-1 border-rose-500 rounded block w-full  outline-none py-2 px-3"
      }`}
    >
      <div className="flex justify-between">
        <div>
          {label && (
            <label className="mb-1">
              <b>
                {label} <font className="text-[#f94a4a]">{validate}</font>
              </b>
            </label>
          )}
        </div>
        <div>
          <input
            {...inputProps}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleFileChange}
            disabled={disabled ? true : false}
            style={{ display: "none" }} // ซ่อน input file
            id={id}
            multiple={false} // อนุญาตให้อัปโหลดหลายไฟล์
            ref={inputRef}
          />
          <label
            htmlFor={id}
            className="inline-block cursor-pointer border-2 border-[#87BE33] p-[10px] rounded-[5px] text-[#87BE33] font-bold"
          >
            Upload File
          </label>
        </div>
      </div>

      <div>
        {filesData.map((items) => (
          <div className="border-gray-300 border-2 rounded-[10px] mt-2 ">
            <div className="flex items-center p-2">
              <div className="mr-4">
                <img src={getIcon(items.name)} width={40} height={40}></img>
              </div>
              <div className="mr-1 flex-1">{items.name}</div>
              <div className="flex justify-center mr-3 items-center">
                {items.name.split(".").pop() === "pdf" && (
                  <div>
                    <button type="button" onClick={() => handlePreview(items)}>
                      <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT" />
                    </button>
                  </div>
                )}
                <div className="ml-3">
                  <button type="button" onClick={() => downloadFile(items)}>
                    <LiaDownloadSolid className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT" />
                  </button>
                </div>
                <div className="ml-3">
                  <button type="button" onClick={() => handleDelete(items)}>
                    <LuTrash2 className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && error?.message && (
        <p className=" mt-1 mb-1 text-red-500 text-xs text-left ">
          {error.message}
        </p>
      )}
      {showModalConfirm && (
        <ModalConfirm
          onClickConfirmBtn={deleteFile}
          onCloseModal={handleCloseDelete}
          title={"Confirm delete?"}
          content={"Are you sure you would like to Delete this File?"}
          buttonTypeColor="danger"
        />
      )}
    </div>
  );
};

export default FileUpload;

import React, { useEffect, useState } from "react";
import { Card, Button, Divider } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getGenerateDataDetailRevision,
  getGenerateDataDetailRevisionFile,
  GenerateDataSave,
  clearSettlementFailRequest,
} from "../../Redux/Settlement/Action";
import numeral from "numeral";
import ModalFail from "../Control/Modal/ModalFail";
import { FaRegTrashAlt } from "react-icons/fa";
import jpgIcon from "../assets/jpg.png";
import pngIcon from "../assets/png.png";
import csvIcon from "../assets/csv.png";
import docxIcon from "../assets/docx.png";
import xlsIcon from "../assets/xls.png";
import txtIcon from "../assets/txt.png";
import pdfIcon from "../assets/pdf.png";
import pptxIcon from "../assets/pptx.png";
import svgIcon from "../assets/svg.png";
import { RiDownloadLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Checkbox, message, Upload } from "antd";
import { RiEyeLine } from "react-icons/ri";
import { showLoading, hideLoading } from "../../Utils/Utils";
import { LiaDownloadSolid } from "react-icons/lia";
import JSZip from "jszip";
import { BiErrorCircle } from "react-icons/bi";
import "../Control/Css/customDragger.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ModalConfirmNew from "../Control/Modal/ModalConfirmNew";
import { USER_GROUP_ID } from "../../Constants/Constants";
import noContent from "../assets/no-content.png";

import {
  setSettlementSelectedYear,
  setSettlementSelectedMonth,
} from "../../Redux/Menu/Action";

const { Dragger } = Upload;

const beforeUpload = (file) => {
  const isValidFile =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/svg+xml" ||
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.type === "text/plain" ||
    file.type === "text/csv";
  if (!isValidFile) {
    message.error(
      "You can only upload jpeg, jpg, png, svg, pdf, doc, xls, docx, xlsx, pptx, txt and csv file!"
    );
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error("File must smaller than 20MB!");
  }
  return isValidFile && isLt2M;
};

const getIcon = (type) => {
  //console.log(type)
  //const extension = name?.split(".").pop();
  //console.log(extension)
  if (type == "image/jpeg") {
    return jpgIcon;
  } else if (type === "image/png") {
    return pngIcon;
  } else if (type === "image/svg+xml") {
    return svgIcon;
  } else if (type === "application/pdf") {
    return pdfIcon;
  } else if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return docxIcon;
  } else if (
    type === "application/vnd.ms-excel" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return xlsIcon;
  } else if (type === "text/csv") {
    return csvIcon;
  } else if (
    type ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return pptxIcon;
  } else if (type === "text/plain") {
    return txtIcon;
  } else {
    return jpgIcon;
  }
};

const GenerateDataRevision = ({
  revision,
  portfolioId,
  year,
  month,
  deviceId,
  ugtGroupId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();
  console.log(revision, portfolioId, year, month, deviceId, ugtGroupId);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const generateDataRevision = useSelector(
    (state) => state.settlement.generateDetaDetailRevision
  );
  const generateFileList = useSelector(
    (state) => state.settlement.generateDataFileList
  );
  const isError = useSelector((state) => state.settlement.isFailRequest);

  const [fileMetering, setFileMetering] = useState([]);
  const [fileContractInvoice, setFileContractInvoice] = useState([]);
  const [fileOther, setFileOther] = useState([]);

  const [isMandatoryError, setIsMandatoryError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [popupConfirm, setPopupConfirm] = useState(false);

  console.log(fileMetering);

  let canUpload = false;

  if (
    userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
    userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
    userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
    userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
    userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
    userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG
  ) {
    if (generateDataRevision) {
      if (
        generateDataRevision?.issueRequestDetailStatus == "" ||
        generateDataRevision?.issueRequestDetailStatus == null ||
        generateDataRevision?.issueRequestDetailStatus
          .toLowerCase()
          .replace(" ", "") == "pending" ||
        generateDataRevision?.issueRequestDetailStatus
          .toLowerCase()
          .replace(" ", "") == "rejected" ||
        generateDataRevision?.issueRequestDetailStatus
          .toLowerCase()
          .replace(" ", "") == "return"
      ) {
        canUpload = true;
      } else {
        canUpload = false;
      }
    } else {
      canUpload = false;
    }
    //canUpload = true
  } else {
    canUpload = false;
  }

  function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  const getTypeFilename = (type, name) => {
    if (type == "image/jpeg") {
      return name + ".jpeg";
    } else if (type === "image/png") {
      return name + ".png";
    } else if (type === "image/svg+xml") {
      return name + ".svg";
    } else if (type === "application/pdf") {
      return name + ".pdf";
    } else {
      return name + ".jpg";
    }
  };

  const checkShowPreview = (type) => {
    console.log(type);
    if (type == "image/jpeg") {
      return true;
    } else if (type === "image/png") {
      return true;
    } else if (type === "image/svg+xml") {
      return true;
    } else if (type === "application/pdf") {
      return true;
    } else if (type == "image/jpg") {
      return true;
    } else {
      return false;
    }
  };

  const previewFileUpload = (base64String, type, name) => {
    const extension = name.split(".").pop();
    const pdfWindow = window.open("");
    console.log("PDF", pdfWindow);
    console.log(type);
    if (type === "application/pdf") {
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
        const blob = new Blob([byteArray], { type: type });
        console.log("Blob", blob);

        // Create a URL for the Blob and set it as the iframe source
        const blobURL = URL.createObjectURL(blob);
        console.log("Blob url :", blobURL);
        let names = name;

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
        alert("Unable to open new tab. Please allow popups for this website.");
      }
    } else if (
      type == "image/jpeg" ||
      type == "image/jpg" ||
      type == "image/png" ||
      type === "image/svg+xml"
    ) {
      if (pdfWindow) {
        pdfWindow.document
          .write(`<html><body style="margin:0; display:flex; align-items:center; justify-content:center;">
              <img src="data:image/jpeg;base64,${base64String}" style="max-width:100%; height:auto;"/>
          </body></html>`);
        pdfWindow.document.title = "Image Preview";
        pdfWindow.document.close();
      }
    }
  };

  //Metering File
  const props = {
    multiple: true,
    // listType: "picture",
    beforeUpload: beforeUpload,
    customRequest: uploadToEvident,
    onDownload: onPreviewFile,
    onPreview: previewFile,
    onRemove: removeFile,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(status, info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        message.success(`${info.file.name} remove successfully.`);
        // const arrayWithoutRemoveFile = fileUploaded.filter(
        //   (item) => item.uid != info.file.uid
        // );
        // setFileUploaded(arrayWithoutRemoveFile);
      }
      if (status !== undefined) {
      } //setFileMetering(info.fileList);
    },
    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
    itemRender: (originNode, file, fileList, actions) => {
      console.log(file);
      return (
        <div
          className="flex justify-between items-center p-2 border border-gray-300 rounded mb-2 mt-2 h-[60px]"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="flex items-center">
            {/* Icon ของไฟล์ (สามารถเปลี่ยนเป็น URL ไอคอนได้) */}
            <img
              src={getIcon(file.type)} // เปลี่ยนเป็นไอคอนไฟล์ PDF หรือประเภทอื่น ๆ
              alt="File Icon"
              style={{ marginRight: "10px" }}
              width={40}
              height={40}
            />
            <span>{file.name}</span>
          </div>
          <div>
            {/* ปุ่ม Download */}
            <button
              style={{
                marginRight: "10px",
                background: "transparent",
                border: "none",
                color: "#BFD39F",
                cursor: "pointer",
              }}
              onClick={() => actions.download(file)}
            >
              <RiDownloadLine className="w-[20px] h-[20px]" />{" "}
              {/* ไอคอนดาวน์โหลด */}
            </button>
            {checkShowPreview(file.type) ? (
              <button
                style={{
                  marginRight: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#BFD39F",
                  cursor: "pointer",
                }}
                onClick={() => props.onPreview(file)}
              >
                <RiEyeLine className="w-[20px] h-[20px]" />
              </button>
            ) : undefined}
            {/* ปุ่ม Remove */}

            {canUpload && (
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#BFD39F",
                  cursor: "pointer",
                }}
                onClick={() => actions.remove(file)}
              >
                <FaRegTrashAlt className="w-[20px] h-[20px]" /> {/* ไอคอนลบ */}
              </button>
            )}
          </div>
        </div>
      );
    },
  };

  async function uploadToEvident(options) {
    const { file, onSuccess, onError } = options;
    console.log(file);

    const reader = new FileReader();

    // เมื่ออ่านไฟล์เสร็จสมบูรณ์
    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // แยกส่วนข้อมูล Base64 ออก
      console.log(base64String);
      setFileMetering((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          {
            id: 0,
            guid: generateGUID(),
            name: file?.name,
            size: file?.size,
            type: file?.type,
            binary: base64String,
          },
        ];
        return newFileList;
      });
    };
    setIsMandatoryError(false);
    // อ่านไฟล์เป็น Data URL
    reader.readAsDataURL(file);
  }

  async function onPreviewFile(file) {
    console.log(file);
    const base64Content = file.binary; //.split(",")[1];
    const binaryString = atob(base64Content);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: file.type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function previewFile(file) {
    try {
      showLoading();

      const name = getTypeFilename(file.type, file.name);

      previewFileUpload(file.binary, file.type, name);
      hideLoading();
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  }

  async function removeFile(file) {
    console.log(file);
    setFileMetering((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter((item) => item.guid !== file.guid);

      return newFileList;
    });
  }

  //Contract Sales Invoice File
  const propsContractInvoice = {
    multiple: true,
    // listType: "picture",
    beforeUpload: beforeUpload,
    customRequest: uploadContractInvoice,
    onDownload: onPreviewFileContractInvoice,
    onPreview: previewFileContractInvoice,
    onRemove: removeFileContractInvoice,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(status, info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        message.success(`${info.file.name} remove successfully.`);
        // const arrayWithoutRemoveFile = fileUploaded.filter(
        //   (item) => item.uid != info.file.uid
        // );
        // setFileUploaded(arrayWithoutRemoveFile);
      }
      if (status !== undefined) {
      } //setFileMetering(info.fileList);
    },
    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
    itemRender: (originNode, file, fileList, actions) => {
      console.log(file);
      return (
        <div
          className="flex justify-between items-center p-2 border border-gray-300 rounded mb-2 mt-2 h-[60px]"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="flex items-center">
            {/* Icon ของไฟล์ (สามารถเปลี่ยนเป็น URL ไอคอนได้) */}
            <img
              src={getIcon(file.type)} // เปลี่ยนเป็นไอคอนไฟล์ PDF หรือประเภทอื่น ๆ
              alt="File Icon"
              style={{ marginRight: "10px" }}
              width={40}
              height={40}
            />
            <span>{file.name}</span>
          </div>
          <div>
            {/* ปุ่ม Download */}
            <button
              style={{
                marginRight: "10px",
                background: "transparent",
                border: "none",
                color: "#BFD39F",
                cursor: "pointer",
              }}
              onClick={() => actions.download(file)}
            >
              <RiDownloadLine className="w-[20px] h-[20px]" />{" "}
              {/* ไอคอนดาวน์โหลด */}
            </button>
            {checkShowPreview(file.type) ? (
              <button
                style={{
                  marginRight: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#BFD39F",
                  cursor: "pointer",
                }}
                onClick={() => props.onPreview(file)}
              >
                <RiEyeLine className="w-[20px] h-[20px]" />
              </button>
            ) : undefined}
            {/* ปุ่ม Remove */}

            {canUpload && (
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#BFD39F",
                  cursor: "pointer",
                }}
                onClick={() => actions.remove(file)}
              >
                <FaRegTrashAlt className="w-[20px] h-[20px]" /> {/* ไอคอนลบ */}
              </button>
            )}
          </div>
        </div>
      );
    },
  };

  async function uploadContractInvoice(options) {
    const { file, onSuccess, onError } = options;
    console.log(file);

    const reader = new FileReader();

    // เมื่ออ่านไฟล์เสร็จสมบูรณ์
    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // แยกส่วนข้อมูล Base64 ออก
      console.log(base64String);
      setFileContractInvoice((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          {
            id: 0,
            guid: generateGUID(),
            name: file?.name,
            size: file?.size,
            type: file?.type,
            binary: base64String,
          },
        ];
        return newFileList;
      });
    };
    setIsMandatoryError(false);
    // อ่านไฟล์เป็น Data URL
    reader.readAsDataURL(file);
  }

  async function onPreviewFileContractInvoice(file) {
    console.log(file);
    const base64Content = file.binary; //.split(",")[1];
    const binaryString = atob(base64Content);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: file.type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function previewFileContractInvoice(file) {
    try {
      showLoading();

      const name = getTypeFilename(file.type, file.name);

      previewFileUpload(file.binary, file.type, name);
      hideLoading();
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  }

  async function removeFileContractInvoice(file) {
    console.log(file);
    setFileContractInvoice((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter((item) => item.guid !== file.guid);

      return newFileList;
    });
  }

  //Other File
  const propsOther = {
    multiple: true,
    // listType: "picture",
    beforeUpload: beforeUpload,
    customRequest: uploadOther,
    onDownload: onPreviewFileOther,
    onPreview: previewFileOther,
    onRemove: removeFileOther,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(status, info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        message.success(`${info.file.name} remove successfully.`);
        // const arrayWithoutRemoveFile = fileUploaded.filter(
        //   (item) => item.uid != info.file.uid
        // );
        // setFileUploaded(arrayWithoutRemoveFile);
      }
      if (status !== undefined) {
      } //setFileMetering(info.fileList);
    },
    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
    itemRender: (originNode, file, fileList, actions) => {
      console.log(file);
      return (
        <div
          className="flex justify-between items-center p-2 border border-gray-300 rounded mb-2 mt-2 h-[60px]"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="flex items-center">
            {/* Icon ของไฟล์ (สามารถเปลี่ยนเป็น URL ไอคอนได้) */}
            <img
              src={getIcon(file.type)} // เปลี่ยนเป็นไอคอนไฟล์ PDF หรือประเภทอื่น ๆ
              alt="File Icon"
              style={{ marginRight: "10px" }}
              width={40}
              height={40}
            />
            <span>{file.name}</span>
          </div>
          <div>
            {/* ปุ่ม Download */}
            <button
              style={{
                marginRight: "10px",
                background: "transparent",
                border: "none",
                color: "#BFD39F",
                cursor: "pointer",
              }}
              onClick={() => actions.download(file)}
            >
              <RiDownloadLine className="w-[20px] h-[20px]" />{" "}
              {/* ไอคอนดาวน์โหลด */}
            </button>
            {checkShowPreview(file.type) ? (
              <button
                style={{
                  marginRight: "10px",
                  background: "transparent",
                  border: "none",
                  color: "#BFD39F",
                  cursor: "pointer",
                }}
                onClick={() => props.onPreview(file)}
              >
                <RiEyeLine className="w-[20px] h-[20px]" />
              </button>
            ) : undefined}
            {/* ปุ่ม Remove */}

            {canUpload && (
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#BFD39F",
                  cursor: "pointer",
                }}
                onClick={() => actions.remove(file)}
              >
                <FaRegTrashAlt className="w-[20px] h-[20px]" /> {/* ไอคอนลบ */}
              </button>
            )}
          </div>
        </div>
      );
    },
  };

  async function uploadOther(options) {
    const { file, onSuccess, onError } = options;
    console.log(file);

    const reader = new FileReader();

    // เมื่ออ่านไฟล์เสร็จสมบูรณ์
    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // แยกส่วนข้อมูล Base64 ออก
      console.log(base64String);
      setFileOther((prevFileList) => {
        console.log("prevFileList", prevFileList);
        let newFileList = [
          ...prevFileList,
          {
            id: 0,
            guid: generateGUID(),
            name: file?.name,
            size: file?.size,
            type: file?.type,
            binary: base64String,
          },
        ];
        return newFileList;
      });
    };

    // อ่านไฟล์เป็น Data URL
    reader.readAsDataURL(file);
  }

  async function onPreviewFileOther(file) {
    console.log(file);
    const base64Content = file.binary; //.split(",")[1];
    const binaryString = atob(base64Content);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: file.type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function previewFileOther(file) {
    try {
      showLoading();

      const name = getTypeFilename(file.type, file.name);

      previewFileUpload(file.binary, file.type, name);
      hideLoading();
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  }

  async function removeFileOther(file) {
    console.log(file);
    setFileOther((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = prevFileList.filter((item) => item.guid !== file.guid);

      return newFileList;
    });
  }

  function downloadAllFile() {
    const zip = new JSZip();
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}_${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}_${now.getFullYear()}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}_${now.getMinutes().toString().padStart(2, "0")}_${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    const zipfilename = "Download_All_" + formattedDateTime;
    const MeteringFile = fileMetering;
    const ContractInvoiceFile = fileContractInvoice;
    const OtherFile = fileOther;
    const FileBinary = [];
    for (let i = 0; i < MeteringFile.length; i++) {
      FileBinary.push(MeteringFile[i]);
    }
    for (let j = 0; j < ContractInvoiceFile.length; j++) {
      FileBinary.push(ContractInvoiceFile[j]);
    }
    for (let k = 0; k < OtherFile.length; k++) {
      FileBinary.push(OtherFile[k]);
    }
    //FileBinary.push(MeteringFile[0]);
    //FileBinary.push(ContractInvoiceFile[0])
    //FileBinary.push(OtherFile[0])
    console.log(FileBinary);
    // Add each file to the ZIP
    FileBinary.forEach((file) => {
      const { name, binary } = file;

      // Decode the Base64 string and convert it to binary data
      const binaryData = atob(binary);
      const arrayBuffer = new Uint8Array(binaryData.length);

      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }

      // Add the binary data as a file to the ZIP
      zip.file(name, arrayBuffer);
      console.log("Zip", zip);
    });

    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, zipfilename);
    });
  }

  useEffect(() => {
    if (ugtGroupId && portfolioId && year && month && deviceId && revision) {
      console.log("Get Data");
      dispatch(
        getGenerateDataDetailRevision(
          ugtGroupId,
          portfolioId,
          year,
          month,
          deviceId,
          revision
        )
      );
      dispatch(
        getGenerateDataDetailRevisionFile(
          portfolioId,
          year,
          month,
          deviceId,
          revision
        )
      );
    }
  }, []);

  useEffect(() => {
    if (ugtGroupId && portfolioId && year && month && deviceId && revision) {
      showLoading();
      console.log("Get Data 2");
      dispatch(
        getGenerateDataDetailRevision(
          ugtGroupId,
          portfolioId,
          year,
          month,
          deviceId,
          revision
        )
      );
      dispatch(
        getGenerateDataDetailRevisionFile(
          portfolioId,
          year,
          month,
          deviceId,
          revision
        )
      );
    }
  }, [revision, portfolioId, year, month, deviceId, ugtGroupId]);

  useEffect(() => {
    setFileMetering(generateFileList?.fileMeteringData);
    setFileContractInvoice(generateFileList?.fileContractSalesInvoice);
    setFileOther(generateFileList?.fileOther);
  }, [generateFileList]);
  console.log(generateDataRevision);

  const renderData = (value) => {
    if (value) {
      return value;
    } else {
      return "-";
    }
  };

  const renderNumeric = (value) => {
    return numeral(value).format("0,0.000");
  };

  const getDate = (datetime, isGetDate) => {
    if (datetime) {
      const [date, time] = datetime.split("T");
      const [year, month, day] = date.split("-");
      if (isGetDate) {
        return `${day}-${month}-${year}`;
      } else {
        if (time.includes(".")) {
          const timeFull = time.split(".");
          console.log("Have .");
          return timeFull[0];
        } else {
          console.log("dont have .");
          return time;
        }
      }
    }
  };

  const getFullDate = (datetime) => {
    if (datetime) {
      const [date, time] = datetime.split("T");
      const [year, month, day] = date.split("-");

      return `${day} ${getNameMonth(month)} ${year}`;
    }
  };

  const getNameMonth = (month) => {
    const NumMonth = Number(month);
    switch (NumMonth) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "August";
      case 9:
        return "September";
      case 10:
        return "October";
      case 11:
        return "November";
      case 12:
        return "December";
    }
  };

  const saveGenerateData = () => {
    console.log("Save");
    ClosePopupupConfirm();
    if (fileMetering.length !== 0 && fileContractInvoice.length !== 0) {
      showLoading();
      let tempMeteringFile = [];
      let tempContractFile = [];
      let tempOther = [];
      fileMetering.map((item) => {
        tempMeteringFile.push({
          id: item.id,
          guid: item.id == 0 ? "" : item.guid,
          binary: item.binary,
          name: item.name,
          type: item.type,
        });
      });
      fileContractInvoice.map((item) => {
        tempContractFile.push({
          id: item.id,
          guid: item.id == 0 ? "" : item.guid,
          binary: item.binary,
          name: item.name,
          type: item.type,
        });
      });
      fileOther.map((item) => {
        tempOther.push({
          id: item.id,
          guid: item.id == 0 ? "" : item.guid,
          binary: item.binary,
          name: item.name,
          type: item.type,
        });
      });
      //console.log(tempMeteringFile,tempContractFile,tempOther)
      const param = {
        portfolioId: portfolioId,
        year: year,
        month: month,
        revision: revision,
        parentId: deviceId,
        fileMeteringData: tempMeteringFile,
        fileContractSalesInvoice: tempContractFile,
        fileOthers: tempOther,
      };
      dispatch(GenerateDataSave(param, () => {}));
      console.log(param);
    } else {
      setIsMandatoryError(true);
    }
  };

  const OpenPopupConfirm = () => {
    setPopupConfirm(true);
  };

  const ClosePopupupConfirm = () => {
    setPopupConfirm(false);
  };

  console.log(generateDataRevision);
  console.log(Object.keys(generateDataRevision).length);

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            {generateDataRevision && Object.keys(generateDataRevision).length !== 0 ? (
              <div>
                <div className="md:col-span-6">
                  <div className="grid grid-cols-12 gap-1">
                    <div className="row-span-3 col-span-12 lg:col-span-3">
                      <div className="shrink-0">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Device Information</b>
                        </h6>
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-9">
                      {/*Row 1 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                        {/*Subscriber Name */}
                        <div>
                          <label className="text-[#6B7280] text-xs">
                            Device Name
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.deviceName)}
                          </div>
                        </div>
                        {/*Status */}
                        <div>
                          <label className="text-[#6B7280] text-xs ">
                            Device Code
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.deviceCode)}
                          </div>
                        </div>
                      </div>
                      {/*Row 2 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                        {/*Assign Utility */}
                        <div>
                          <label className="text-[#6B7280] text-xs ">
                            Utility
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.utility)}
                          </div>
                        </div>
                        {/*Subscriber Code */}
                        <div>
                          <label className="text-[#6B7280] text-xs">
                            UGT Type
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.ugtType)}
                          </div>
                        </div>
                      </div>
                      {/*Row 3 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                        {/*Trade Accout Name */}
                        <div>
                          <label className="text-[#6B7280] text-xs">
                            Settlement Month
                          </label>
                          <div className="break-words	font-bold">
                            {getNameMonth(
                              generateDataRevision?.settlementMonth
                            )}
                          </div>
                        </div>
                        {/*Trade Account Code */}
                        <div>
                          <label className="text-[#6B7280] text-xs ">
                            Settlement Year
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.settlementYear)}
                          </div>
                        </div>
                      </div>
                      {/*Row 4 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                        {/*Trade Accout Name */}
                        <div>
                          <label className="text-[#6B7280] text-xs">
                            Portfolio Code
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.portfolioCode)}
                          </div>
                        </div>
                        {/*Trade Account Code */}
                        <div>
                          <label className="text-[#6B7280] text-xs ">
                            Approved Date
                          </label>
                          <div className="break-words	font-bold">
                            {getFullDate(generateDataRevision?.approvedDate)}
                          </div>
                        </div>
                      </div>
                      {/*Row 5 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                        {/*Assign Utility */}
                        <div>
                          <label className="text-[#6B7280] text-xs ">
                            Data Start Date
                          </label>
                          <div className="break-words	font-bold">
                            {getFullDate(generateDataRevision?.dataStartDate)}
                          </div>
                        </div>
                        {/*Subscriber Code */}
                        <div>
                          <label className="text-[#6B7280] text-xs">
                            Data End Date
                          </label>
                          <div className="break-words	font-bold">
                            {getFullDate(generateDataRevision?.dataEndDate)}
                          </div>
                        </div>
                      </div>
                      {/*Row 6 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                        {/*Assign Utility */}
                        <div>
                          <label className="text-[#6B7280] text-xs ">
                            Total Gen (kWh)
                          </label>
                          <div className="break-words	font-bold">
                            {renderNumeric(generateDataRevision?.totalGen)}
                          </div>
                        </div>
                        {/*Subscriber Code */}
                        <div>
                          <label className="text-[#6B7280] text-xs">
                            Settlement Revision
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(
                              "Revision " +
                                generateDataRevision?.settlementRevision
                            )}
                          </div>
                        </div>
                      </div>
                      {/*Row 7 */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                        {/*Assign Utility */}
                        <div>
                          <label className="text-[#6B7280] text-xs ">
                            Peak (kWh)
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.peak)}
                          </div>
                        </div>
                        {/*Subscriber Code */}
                        <div>
                          <label className="text-[#6B7280] text-xs">
                            Off-Peak (kWh)
                          </label>
                          <div className="break-words	font-bold">
                            {renderData(generateDataRevision?.offPeak)}
                          </div>
                        </div>
                      </div>
                      
                    </div>

                    <Divider
                      className="mt-3 col-span-12 lg:col-span-9"
                      orientation="horizontal"
                      size={"xs"}
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                  <div className="row-span-3 col-span-12 lg:col-span-3">
                      <div className="shrink-0">
                        
                      </div>
                    </div>
                  <div className="col-span-12 lg:col-span-9">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                      {/*Assign Utility */}
                      <div>
                        <div className="text-left text-[#6B7280] text-sm">
                          Data Source:{" "}
                          {renderData(generateDataRevision?.dataSource)}
                        </div>
                      </div>
                      {/*Subscriber Code */}
                      <div className="text-right text-[#6B7280] text-sm">
                        {"Date: " +
                          getDate(generateDataRevision?.datetime, true) +
                          " | Time: " +
                          getDate(generateDataRevision?.datetime, false)}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="mt-2">
                  <div>
                    <label className="text-PRIMARY_TEXT text-lg font-semibold">
                      <b>Documents Information Attachments</b>
                    </label>
                  </div>
                  <div className="flex flex-col w-1/2  ">
                    <div className="text-left text-[#6B7280] text-xs mt-1">
                      File upload
                    </div>
                    <div className="text-left text-PRIMARY_TEXT text-sm mt-2 font-semibold mb-2">
                      Metering Data <label className="text-red-600">*</label>
                    </div>
                    <Dragger
                      {...props}
                      fileList={fileMetering}
                      className="custom-dragger"
                      disabled={!canUpload}
                    >
                      <p className="ant-upload-drag-icon">
                        <AiOutlineCloudUpload className="w-[50px] h-[50px] text-[#87be33]"></AiOutlineCloudUpload>
                      </p>
                      <p className="ant-upload-text text-[#fff]]">
                        Drop files here or click to upload.
                      </p>
                      <p className="ant-upload-hint">
                        Acceptable formats : jpeg, jpg, png, svg, pdf, doc,
                        .xls, .docx, .xlsx, .pptx, .txt, .csv Each file can be a
                        maximum of 20MB.
                      </p>
                    </Dragger>
                  </div>
                  <div className="flex flex-col w-1/2 mt-2 ">
                    <div className="text-left text-PRIMARY_TEXT text-sm mt-2 font-semibold mb-2">
                      Contract Sales Invoice{" "}
                      <label className="text-red-600">*</label>
                    </div>
                    <Dragger
                      {...propsContractInvoice}
                      fileList={fileContractInvoice}
                      className="custom-dragger"
                      disabled={!canUpload}
                    >
                      <p className="ant-upload-drag-icon">
                        <AiOutlineCloudUpload className="w-[50px] h-[50px] text-[#87be33]"></AiOutlineCloudUpload>
                      </p>
                      <p className="ant-upload-text">
                        Drop files here or click to upload.
                      </p>
                      <p className="ant-upload-hint">
                        Acceptable formats : jpeg, jpg, png, svg, pdf, doc,
                        .xls, .docx, .xlsx, .pptx, .txt, .csv Each file can be a
                        maximum of 20MB.
                      </p>
                    </Dragger>
                  </div>
                  <div className="flex flex-col w-1/2 mt-2 ">
                    <div className="text-left text-PRIMARY_TEXT text-sm mt-2 font-semibold mb-2">
                      Others
                    </div>
                    <Dragger
                      {...propsOther}
                      fileList={fileOther}
                      className="custom-dragger"
                      disabled={!canUpload}
                    >
                      <p className="ant-upload-drag-icon">
                        <AiOutlineCloudUpload className="w-[50px] h-[50px] text-[#87be33]"></AiOutlineCloudUpload>
                      </p>
                      <p className="ant-upload-text">
                        Drop files here or click to upload.
                      </p>
                      <p className="ant-upload-hint">
                        Acceptable formats : jpeg, jpg, png, svg, pdf, doc,
                        .xls, .docx, .xlsx, .pptx, .txt, .csv Each file can be a
                        maximum of 20MB.
                      </p>
                    </Dragger>
                  </div>
                  <div className="flex flex-col w-1/2 mt-3">
                    <button
                      className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center"
                      onClick={() => downloadAllFile()}
                    >
                      <div className="flex items-center justify-center cursor-pointer">
                        <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT" />
                        <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer">
                          Download All file in (.zip)
                        </label>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mt-5 text-right">
                  {canUpload == true && (
                    <Button
                      className="bg-lime-500 w-[150px] hover:bg-[#4D6A00] text-[#fff]"
                      size="lg"
                      onClick={OpenPopupConfirm}
                    >
                      Save
                    </Button>
                  )}
                  {isMandatoryError && (
                    <div className="justify-items-end">
                      <div className="font-medium text-base flex items-center w-auto justify-center border-solid bg-[#fdeeee] border-red-300 border-3 rounded-[5px]  my-2 px-4 py-2 text-red-400 ">
                        <div className="mr-2">
                          <BiErrorCircle className="w-[25px] h-[25px] text-red-600" />
                        </div>
                        <div className="">Please Upload File</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-sm font-normal gap-2 mt-4 h-[400px]">
                <img src={noContent} alt="React Logo" width={50} height={50} />
                <div>No Data Found.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isError && (
        <ModalFail
          onClickOk={() => {
            dispatch(clearSettlementFailRequest());
          }}
          content={"Something went wrong. Please go back and try again."}
        />
      )}

      {popupConfirm && (
        <ModalConfirmNew
          onClickConfirmBtn={saveGenerateData}
          onCloseModal={ClosePopupupConfirm}
          title={"Save this Device?"}
          content={"Would you like to save this device?"}
          textBtn={"Confirm"}
        />
      )}
    </div>
  );

  // function prePage() {
  //   if (currentPage !== 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // }
  // function chageCPage(id) {
  //   alert(id);
  //   // setCurrentPage(id)
  // }
  // function nextPage() {
  //   if (currentPage !== npage) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // }
};

export default GenerateDataRevision;

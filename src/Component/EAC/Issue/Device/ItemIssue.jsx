import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Card, Input, ScrollArea, Table, Modal,Textarea } from "@mantine/core";
import numeral from "numeral";
//import AlmostDone from "../../../assets/done.png";
import Warning from "../../../assets/warning.png";
import ModalFail from "../../../../Component/Control/Modal/ModalFail";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import classNames from "classnames";
import { Checkbox, message, Upload } from "antd";
import {
  EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL,
  EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL_FILE,
  EAC_ISSUE_REQUEST_DELETE_FILE,
  EAC_ISSUE_REQUEST_DOWNLOAD_FILE,
  EAC_ISSUE_REQUEST_CREATE_ISSUE_SF04_DETAIL_FILE
} from "../../../../Constants/ServiceURL";
import { USER_GROUP_ID } from "../../../../Constants/Constants";
import axios from "axios";
import { saveAs } from "file-saver";
import { showLoading, hideLoading } from "../../../../Utils/Utils";
import StatusLabel from "../../../Control/StatusLabel";
import { useSelector,useDispatch } from "react-redux";
import { FaRegTrashAlt } from "react-icons/fa";
import jpgIcon from "../../../assets/jpg.png";
import pngIcon from "../../../assets/png.png";
import csvIcon from "../../../assets/csv.png";
import docxIcon from "../../../assets/docx.png";
import xlsIcon from "../../../assets/xls.png";
import txtIcon from "../../../assets/txt.png";
import pdfIcon from "../../../assets/pdf.png";
import pptxIcon from "../../../assets/pptx.png";
import svgIcon from "../../../assets/svg.png";
import { RiDownloadLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import PdfFormPreviewSF04 from "../../../Settlement/TemplatePdfSF04";
import {getDataSettlement} from "../../../../Redux/Settlement/Action";

import AlmostDone from "../../../assets/almostdone.png";
import { useDisclosure } from "@mantine/hooks";
import ModalConfirmCheckBoxEAC from "./ModalConfirmCheckBoxEAC";


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
  console.log(type)
  const extension = name?.split(".").pop();
  console.log(extension)
  if (type == "image/jpeg") {
    return jpgIcon;
  } else if (type === "image/png") {
    return pngIcon;
  } else if (type === "image/svg+xml") {
    return svgIcon;
  } else if (type === "application/pdf") {
    return pdfIcon;
  } else if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ) {
    return docxIcon;
  } else if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return xlsIcon;
  } else if (type === "text/csv") {
    return csvIcon;
  } else if (type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
    return pptxIcon;
  } else if (type === "text/plain") {
    return txtIcon;
  } else {
    return jpgIcon;
  }
};

const ItemIssue = ({ issueTransactionData, getIssueTransaction,device }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.login.userobj);
  const issueRequest = issueTransactionData?.issueRequest;
  const dataPDF = useSelector((state) => state.settlement?.dataSF04PDF)

  console.log(issueTransactionData)

  const issueRequestId = issueRequest?.issueRequestId;
  const issueRequestDetailId = issueRequest?.issueRequestDetailId;

  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [showModalFail, setShowModalFail] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);

  const [showModalConfirm,setShowModalConfirm] = useState(false)
  const [showModalSignAndSubmit,setShowModalSignAndSubmit] = useState(false)
  const [showSignAndSubmitSuccess,modalSignAndSubmitSuccess] = useDisclosure()
  const [isSign,setIsSign] = useState(false)
  const [actual,setActual] = useState("Actual")


  const [note, setNote] = useState(issueRequest?.note ?? "");
  const [totalProduction, setTotalProduction] = useState(0);
  const [isConfirmChecked, setIsConfirmChecked] = useState(false);

  // status
  let issueRequestStatus = issueRequest?.status ?? "";

  if (issueRequestStatus === "") {
    issueRequestStatus = "Pending";
  } else if (issueRequestStatus.toLowerCase() === "draft") {
    issueRequestStatus = "Draft";
  } else if (
    issueRequestStatus.toLowerCase() === "in progress" ||
    issueRequestStatus.toLowerCase() === "submitted"
  ) {
    issueRequestStatus = "In Progress";
  } else if (issueRequestStatus.toLowerCase() === "completed") {
    issueRequestStatus = "Issued";
  } else if (issueRequestStatus.toLowerCase() === "rejected") {
    issueRequestStatus = "Rejected";
  }

  // control action status
  let canSendIssue = false;
  let canUpload = false;

  // check if user is Contractor , can view only.
  if (
    userData?.userGroup?.id == USER_GROUP_ID.MEA_CONTRACTOR_MNG ||
    userData?.userGroup?.id == USER_GROUP_ID.PEA_CONTRACTOR_MNG
  ) {
    canSendIssue = false;
    canUpload = false;
  } else {
    if (
      issueRequestStatus?.toLowerCase() === "in progress" ||
      issueRequestStatus?.toLowerCase() === "withdraw" ||
      issueRequestStatus?.toLowerCase() === "withdrawn" ||
      issueRequestStatus?.toLowerCase() === "completed" ||
      issueRequestStatus?.toLowerCase() === "issued"
    ) {
      canSendIssue = false;
      canUpload = false;
    } else {
      canSendIssue = true;
      canUpload = true;
    }
  }

  const props = {
    multiple: true,
    // listType: "picture",
    beforeUpload: beforeUpload,
    customRequest: uploadToEvident,
    onDownload: (file) => {
      console.log("file", file);
    },
    onPreview: previewFile,
    onRemove: removeFile,

    /* iconRender(file, listType) {
      console.log("listType", listType);
      return (
        <>
          <span>{file.name}</span>
        </>
      );
    }, */
    // itemRender: (originNode, file, fileList, { download, preview, remove }) => {
    //   return (
    //     <div className="flex justify-between">
    //       <div className="">{file.name}</div>
    //       <Trash2 color="#F1533B" />
    //     </div>
    //   );
    // },
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
      if (status !== undefined) setFileUploaded(info.fileList);
    },
    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
    itemRender: (originNode, file, fileList, actions) => {
      console.log(file)
      return (
        <div
          className="flex justify-between items-center p-2 border border-gray-300 rounded mb-2 mt-2"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div className="flex items-center">
            {/* Icon ของไฟล์ (สามารถเปลี่ยนเป็น URL ไอคอนได้) */}
            <img
              src={getIcon(file.type)} // เปลี่ยนเป็นไอคอนไฟล์ PDF หรือประเภทอื่น ๆ
              alt="File Icon"
              style={{  marginRight: "10px" }}
              width={35}
              height={35}
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
              onClick={() => props.onPreview(file)}
            >
              <RiDownloadLine /> {/* ไอคอนดาวน์โหลด */}
            </button>
            {/* ปุ่ม Remove */}
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#BFD39F",
                cursor: "pointer",
              }}
              onClick={() => actions.remove(file)}
            >
              <FaRegTrashAlt /> {/* ไอคอนลบ */}
            </button>
          </div>
        </div>
      );
    },
  };

  async function uploadToEvident(options) {
    const { file, onSuccess, onError } = options;
    const params = new FormData();
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    let fileName = file.name?.replace(/\.[^/.]+$/, "");
    params.append("issueRequestDetailId", issueRequestDetailId);
    params.append("file", file);
    params.append("name", fileName);
    params.append("notes", "");
    try {
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL_FILE}`,
        params,
        config
      );
      onSuccess("Ok");
      // เรียกข้อมูล issue ใหม่ เพื่อให้มี File List
      getIssueTransaction();
    } catch (err) {
      console.log("Error: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  }

  async function previewFile(file) {
    try {
      showLoading();
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_DOWNLOAD_FILE}?fileUid=${file.uid}`,
        {},
        { responseType: "blob" } // Important: indicate that the response type is a Blob
      );

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      saveAs(blob, file.name);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  }

  async function removeFile(file) {
    try {
      showLoading();
      const res = await axios.delete(
        `${EAC_ISSUE_REQUEST_DELETE_FILE}?fileUid=${file.uid}`
      );
      console.log("res", res);
      getIssueTransaction();
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  }

  const handleConfirmSubmitRequest = async () => {
    setIsConfirmChecked(false); // กลับสถานะให้ confirm checkbox เป็นค่าเริ่มต้น
    setOpenModalConfirm(!openModalConfirm);

    // To do.
    // 1. call api issue request

    console.log("fileUploaded", fileUploaded);
    // get file uid from array of object fileUploaded
    const fileUidArray = issueRequest.fileUploaded.map(
      (item) => `/files/${item.uid}`
    );

    const paramsDraft = {
      issueRequestId: issueRequestId,
      deviceCode: issueTransactionData.deviceCode,
      issueRequestDetailId: issueRequestDetailId,
      issueUid: `/issues/${issueTransactionData.issueRequestUid}`,
      startDate: dayjs(issueRequest.startDate).format(
        "YYYY-MM-DDTHH:mm:ss[+00:00]"
      ),
      endDate: dayjs(issueRequest.endDate).format(
        "YYYY-MM-DDTHH:mm:ss[+00:00]"
      ),
      productionVolume: numeral(totalProduction).format("0.000000"),
      fuel: `/fuels/${issueTransactionData.fuelCode}`,
      recipientAccount: `/accounts/${issueRequest.tradeAccountCode}`,
      status:
        issueRequestStatus?.toLowerCase() == "rejected" ? `Submitted` : `Draft`,
      notes: note,
      issuerNotes: note,
      files: fileUidArray,
    };

    console.log("paramsDraft", paramsDraft);
    // showSwal();
    showLoading();
    const responseDraft = await createIssueDetail(paramsDraft);

    if (responseDraft?.status === 200) {
      // เรียก createIssueDetail อีกครั้งแต่ส่ง status: `Submitted`

      hideLoading();
      setShowModalComplete(true);

      setTimeout(() => {
        // To do.
        // 1.call api fetch data again which status will be changed to Completed
        getIssueTransaction();
        // 2.close modal automatically
        setShowModalComplete(false);

        console.log("close modal complete");
      }, 2000);
    } else {
      console.log("responseDraft", responseDraft);
      setShowModalFail(true);
      hideLoading();
    }
  };

  const handleCloseFailModal = () => {
    setShowModalFail(false);
  };

  const handleCheckboxChange = (e) => {
    setIsConfirmChecked(e.target.checked);
  };

  useEffect(() => {
    if (issueRequest?.settlementDetail) {
      sumTotalProduction();
    }
  }, [issueRequest]);

  useLayoutEffect(() => {
    if (issueRequest?.settlementDetail) prepareFileUploadData();
  }, [issueRequest]);

  async function sumTotalProduction() {
    let sumProduction = 0;
    for (const item of issueRequest.settlementDetail) {
      sumProduction += item.production;
    }

    setTotalProduction(sumProduction / 1000);
  }

  async function prepareFileUploadData() {
    const fileUploadedArray = [];
    for (const item of issueRequest.fileUploaded) {
      const fileObject = {
        uid: item.uid,
        name: item.fileName,
        status: "done",
        type: item.mimeType,
        // url: `https://api.sandbox.evident.dev/files/${item.uid}/download`, // รอเปลี่ยนเป็น API ของ Backend ที่ใช้สำหรับโหลดไฟล์
        url: `${EAC_ISSUE_REQUEST_DOWNLOAD_FILE}`,
      };
      fileUploadedArray.push(fileObject);
    }
    setFileUploaded(fileUploadedArray);
  }

  async function createIssueDetail(params) {
    try {
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL}`,
        params
      );
      // return response result
      return res;
    } catch (error) {
      return error;
    }
  }

  const showbase = async ()=>{
  
    //setIsGenarate(true)
    const fetchData = new Promise((resolve, reject) => {
      dispatch(getDataSettlement(device))
        .then(resolve)
        .catch(reject);
    });
    await fetchData;
    const base = await handleGeneratePDF()
    //const form = await handleGeneratePDFFileForm()
    console.log(base)
    //setIsGenarate(false)
    openPDFInNewTab(base.binaryBase,"application/pdf","test.pdf")
    
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
      //const fileForm = await PdfFormPreviewSF04.generatePdfFileForm()
      //console.log(fileForm)
      
      //setPdfBase64(base64String);
      //console.log("Generated Base64 PDF:", base64String);
      return base64String
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const handleGeneratePDFFileForm = async () => {
    try {
      
      //const base64String = await PdfFormPreviewSF04.generatePdf();
      const fileForm = await PdfFormPreviewSF04.generatePdfFileForm()
      console.log(fileForm)
      
      //setPdfBase64(base64String);
      //console.log("Generated Base64 PDF:", base64String);
      return fileForm
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const handleModalSignAndSubmit =()=>{
    setShowModalSignAndSubmit(true)
  }

  const handleCloseModalSignAndSubmit=()=>{
    setShowModalSignAndSubmit(false)
  }

  const handleModalConfirm=()=>{
    setShowModalConfirm(true)
  }
  const handleCLodeModalConfirm=()=>{
    setShowModalConfirm(false)
  }

  const actionSignAndSubmit=()=>{
    console.log("Action Sign And Submit")
    modalSignAndSubmitSuccess.open()
    setShowModalConfirm(false)
    setShowModalSignAndSubmit(false)
    setIsSign(true)
    handleTakeActionSignAndSubmit()

  }

  const handleTakeActionSignAndSubmit = async ()=>{
    
    const fetchData = new Promise((resolve, reject) => {
      dispatch(getDataSettlement(device))
        .then(resolve)
        .catch(reject);
    });
    await fetchData;
    const base = await handleGeneratePDF()
    //const form = await handleGeneratePDFFileForm()
    console.log(base)
    //setIsGenarate(false)
    //openPDFInNewTab(base.binaryBase,"application/pdf","test.pdf")
    const params = new FormData();
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    //let fileName = file.name?.replace(/\.[^/.]+$/, "");
    params.append("issueRequestDetailId", issueRequestDetailId);
    params.append("file", base.file);
    params.append("name", base.file.name);
    params.append("notes", "SF04");
    try {
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_CREATE_ISSUE_SF04_DETAIL_FILE}`,
        params,
        config
      );
      //onSuccess("Ok");
      // เรียกข้อมูล issue ใหม่ เพื่อให้มี File List
      console.log(res)
      getIssueTransaction();
    } catch (err) {
      console.log("Error: ", err);
      const error = new Error("Some error");
      //onError({ err });
    }
    
    console.log(base)
  }

  return (
    <>
      <div className="grid grid-cols-2  gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">Device Name</div>
          <div className="text-sm font-semibold">
            {issueTransactionData?.deviceName}
          </div>
          <div className="text-xs font-base">
            <label className="text-[#2e8d8d] bg-[#f0f8ff] rounded w-max px-2 py-1 text-xs font-normal">
              {issueTransactionData?.deviceCode}
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">Fuel</div>
          <div className="text-sm font-semibold">
            {issueTransactionData?.fuelCode} {issueTransactionData?.fuelName}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Assigned Utility
          </div>
          <div className="text-sm font-semibold">
            {issueTransactionData?.assignedUtility}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Settlement Period
          </div>
          <div className="text-sm font-semibold">
            {dayjs(issueTransactionData?.settlementPeriod).format("MMMM YYYY")}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Total Generation
          </div>
          <div className="text-sm font-semibold">
            {numeral(issueTransactionData?.totalGeneration).format("0,0.000")}{" "}
            kWh (
            {numeral(
              numeral(issueTransactionData?.totalGeneration).value() / 1000
            ).format("0,0.000000")}{" "}
            MWh)
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Matched Generation
          </div>
          <div className="text-sm font-semibold">
            {numeral(issueTransactionData?.matchedGeneration).format("0,0.000")}{" "}
            kWh (
            {numeral(
              numeral(issueTransactionData?.matchedGeneration).value() / 1000
            ).format("0,0.000000")}{" "}
            MWh)
          </div>
        </div>
      </div>
      <div className="text-right">
            <Button
              className="border-2 border-[#4D6A00] bg-[#fff] text-[#4D6A00]"
              onClick={showbase}
            >
              <IoDocumentTextOutline className="mr-1"/> Preview SF-04
            </Button>
            
      </div>
      <Table stickyHeader verticalSpacing="sm" className="mt-10">
        <Table.Thead className="bg-[#F4F6F9]">
          <Table.Tr className="text-[#071437]">
            <Table.Th className="text-center w-48">Period</Table.Th>
            <Table.Th className="text-center w-64 ">
              Recipient Account (Trade Account)
            </Table.Th>
            <Table.Th className="text-center w-64 ">
              Allocation Account
            </Table.Th>
            <Table.Th className="text-right min-w-64 max-w-full">
              Production (MWh)
            </Table.Th>
            <Table.Th className="text-center w-32 ">Start Date</Table.Th>
            <Table.Th className="text-center w-32 ">End Date</Table.Th>
            <Table.Th className="text-center w-32 ">Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {issueRequest?.settlementDetail?.map((row, index) => (
            <Table.Tr key={index} className="text-[#071437] font-semibold">
              {index == 0 && (
                <Table.Td
                  rowSpan={issueRequest?.settlementDetail.length}
                  className="text-center align-top w-48"
                >
                  {dayjs(`${issueRequest.year}-${issueRequest.month}`).format(
                    "MMMM YYYY"
                  )}
                </Table.Td>
              )}

              <Table.Td className="text-center w-64 ">
                {issueRequest?.tradeAccountName}
              </Table.Td>
              <Table.Td className="text-center w-64 ">
                {row.allocationAccount}
              </Table.Td>
              <Table.Td className="text-right min-w-64 max-w-full">
                {numeral(numeral(row?.production).value() / 1000).format(
                  "0,000.000000"
                )}
              </Table.Td>
              <Table.Td className="text-center w-32 capitalize">
                {dayjs(row.startDate).format("DD/MM/YYYY")}
              </Table.Td>
              <Table.Td className="text-center w-32 capitalize">
                {dayjs(row.endDate).format("DD/MM/YYYY")}
              </Table.Td>
              <Table.Td className="text-center w-32 ">
                <StatusLabel
                  status={issueRequestStatus ?? "Pending"}
                  type="xs"
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr className="bg-[#F4F6F9]">
            <Table.Th className="text-center w-48">Total</Table.Th>
            <Table.Th className="text-center w-64"></Table.Th>
            <Table.Th className="text-center w-64"></Table.Th>
            <Table.Th className="text-right min-w-64 max-w-full">
              {numeral(numeral(totalProduction).value()).format("0,0.000000")}
            </Table.Th>
            <Table.Th className="text-center w-32"></Table.Th>
            <Table.Th className="text-center w-32"></Table.Th>
            <Table.Th className="text-center w-32"></Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
      <div className="grid grid-col-3 gap-5 pt-3 ">
        <div className="flex gap-2">
          {canUpload && (
            <Button
              className={classNames({
                "bg-[#F5F4E9] text-[#4D6A00] px-8": canUpload,
              })}
              onClick={() => setOpenModalUpload(!openModalUpload)}
            >
              Upload Files
            </Button>
          )}
          {fileUploaded.length > 0 && (
            <Button
              className="text-[#4D6A00] underline px-8"
              onClick={() => setOpenModalUpload(!openModalUpload)}
            >
              {fileUploaded.length == 1
                ? `${fileUploaded.length} File Uploaded`
                : `${fileUploaded.length} Files Uploaded`}
            </Button>
          )}
        </div>
        <div className="gap-2 col-start-3 h-auto">
          <div>
            <div className="text-sm font-normal mb-2 text-[#91918A]">Note</div>
            {canSendIssue ? (
              <div className="text-sm">
                <Textarea
                  size="md"
                  value={note}
                  onChange={(event) => setNote(event.currentTarget.value)}
                  //minRows={4}  // กำหนดจำนวนแถวเริ่มต้น
                  //sx={{ height: 100 }}
                  rows={4}
                />
              </div>
            ) : (
              <div className="w-52 lg:w-96 lg:break-words text-sm font-normal">
                {note || "-"}
              </div>
            )}
          </div>
          {/*canSendIssue && (
            <Button
              className="bg-[#87BE33] text-white px-8"
              onClick={() => setOpenModalConfirm(!openModalConfirm)}
            >
              Send
            </Button>
          )*/}
        </div>
      </div>
      <div className="mt-4 text-right">
            <Button
              className="bg-[#87BE33] text-white px-8"
              onClick={() => handleModalConfirm()}
            >
              Sign & Submit
            </Button>
      </div>

      <Modal
        opened={openModalConfirm}
        onClose={() => setOpenModalConfirm(!openModalConfirm)}
        withCloseButton={false}
        centered
        size={"lg"}
        closeOnClickOutside={false}
      >
        <div className="flex flex-col items-center justify-center px-10 pt-5 pb-3">
          {fileUploaded.length > 0 ? (
            <>
              <div className="text-2xl font-bold">Submit Issue Request</div>
            </>
          ) : (
            <>
              <img
                className="w-16 object-cover rounded-full flex items-center justify-center mb-3"
                src={Warning}
                alt="Current profile photo"
              />
              <div className="text-2xl text-center font-bold">
                This issue request has no active files attached to it.
              </div>
            </>
          )}
          <div className="text-sm font-normal my-8">
            Are you sure you wish to submit issue request?
          </div>
          <Checkbox checked={isConfirmChecked} onChange={handleCheckboxChange}>
            I confirm all the required information is completed and the
            necessary supporting information and file are attached{" "}
            <span className="text-red-400">*</span>
          </Checkbox>
          <div className="flex gap-4">
            <Button
              className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
              onClick={() => setOpenModalConfirm(!openModalConfirm)}
            >
              Close
            </Button>
            {isConfirmChecked ? (
              <Button
                className="text-white bg-PRIMARY_BUTTON mt-12 px-10"
                onClick={() => handleConfirmSubmitRequest()}
              >
                Yes, Submit Request
              </Button>
            ) : (
              <Button
                className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10 "
                disabled
              >
                Yes, Submit Request
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        opened={showModalComplete}
        onClose={() => setShowModalComplete(!showModalComplete)}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <div className="flex flex-col items-center justify-center px-10 pt-4 pb-3">
          <img
            className="w-32 object-cover rounded-full flex items-center justify-center"
            src={AlmostDone}
            alt="Current profile photo"
          />

          <div className="text-3xl font-bold text-center pt-2">
            Issue Request Submitted!
          </div>
          <div className="flex gap-4">
            <Button
              className="text-white bg-PRIMARY_BUTTON mt-12 px-10"
              onClick={() => setShowModalComplete(!showModalComplete)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        opened={openModalUpload}
        onClose={() => setOpenModalUpload(!openModalUpload)}
        withCloseButton={false}
        centered
        size={"lg"}
        closeOnClickOutside={false}
      >
        <div className="flex flex-col   px-10 py-3">
          <div className="text-2xl mb-3 font-bold text-left text-BREAD_CRUMB">
            Documents Upload
          </div>

          <Dragger {...props} fileList={fileUploaded} disabled={!canUpload}>
            <p className="ant-upload-drag-icon"></p>
            <p className="ant-upload-text">
              Drop files here or click to upload.
            </p>
            <p className="ant-upload-hint">
              Acceptable formats : jpeg, jpg, png, svg, pdf, doc, .xls, .docx,
              .xlsx, .pptx, .txt, .csv Each file can be a maximum of 20MB.
            </p>
          </Dragger>

          <div className="flex justify-center">
            <Button
              className="text-white w-64 text-center bg-PRIMARY_BUTTON mt-12 px-10"
              onClick={() => setOpenModalUpload(!openModalUpload)}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={showSignAndSubmitSuccess}
        onClose={modalSignAndSubmitSuccess.close}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <div className="flex flex-col items-center justify-center px-10 pt-4 pb-3">
          <img
            className="w-32 object-cover rounded-full flex items-center justify-center"
            src={AlmostDone}
            alt="Current profile photo"
          />

          <div className="text-2xl font-bold text-center pt-2">
          Successfully
          </div>
          <div className="flex gap-4">
            <Button
              className="text-white bg-[#4197FD] mt-12 px-10 mr-2"
              onClick={() => showbase()}
            >
              Preview SF-04
            </Button>
            <Button
              className="text-white bg-PRIMARY_BUTTON mt-12 px-10"
              onClick={() => modalSignAndSubmitSuccess.close()}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      
      {showModalConfirm && (
        <ModalConfirmCheckBoxEAC
        onCloseModal={handleCLodeModalConfirm}
        onClickConfirmBtn={handleModalSignAndSubmit}
        title={"Submit Issue Request"}
        content={"Are you sure you wish to submit this issue request?"}
        textCheckBox={"I confirm all the required information is completed and the necessary supporting information and files are attached."}
        sizeModal={"lg"}
        textButton={"Yes, submit request"}
        isHaveFile={issueTransactionData?.issueRequestDetail?.fileUploaded.length !== 0?true:false}
        />
      )}

      {showModalSignAndSubmit && (
        <ModalConfirmCheckBoxEAC
        onCloseModal={handleCloseModalSignAndSubmit}
        onClickConfirmBtn={actionSignAndSubmit}
        title={"Sign & Submit?"}
        content={"In signing, the Registrant warrants that the energy for which I-REC certificates are being applied has not and will not be submitted for any other energy attribute tracking methodology."}
        content2={"The Registrant also warrants that, to the best of their knowledge, the consumption attributes contained within any I-REC certificate Issued in association with this request (including all rights to the specific electricity and/or emissions for the reporting of any indirect carbon account purposes) are not delivered to any other body either directly or in-directly without the component I-REC certificate."}
        content3={"This includes but is not limited to electricity supply companies or the national governments."}
        textCheckBox={"I have read and agree to the terms as described above."}
        sizeModal={"lg"}
        textButton={"Yes, submit request"}
        isShowInfo={true}
        textAlign={"left"}
        isHaveFile={true}
        />
      )}
      <PdfFormPreviewSF04 data={dataPDF} isSign={isSign} Sign={userData.firstName+" "+userData.lastName} period={actual} />
      {showModalFail && <ModalFail onClickOk={handleCloseFailModal} />}
    </>
  );
};

export default ItemIssue;

import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  Input,
  ScrollArea,
  Table,
  Modal,
  Textarea,
} from "@mantine/core";
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
  EAC_ISSUE_REQUEST_CREATE_ISSUE_SF04_DETAIL_FILE,
  EAC_ISSUE_REQUEST_VERIFY,
  EAC_ISSUE_REQUEST_RETURN,
  EAC_ISSUE_REQUEST_UPLOAD_GEN_EVIDENT,
} from "../../../../Constants/ServiceURL";
import { USER_GROUP_ID } from "../../../../Constants/Constants";
import axios from "axios";
import { saveAs } from "file-saver";
import { showLoading, hideLoading } from "../../../../Utils/Utils";
import StatusLabel from "../../../Control/StatusLabel";
import { useSelector, useDispatch } from "react-redux";
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
import { getDataSettlement } from "../../../../Redux/EAC/Action";

import AlmostDone from "../../../assets/almostdone.png";
import { useDisclosure } from "@mantine/hooks";
import ModalConfirmCheckBoxEAC from "./ModalConfirmCheckBoxEAC";
import { RiEyeLine } from "react-icons/ri";
import ModalConfirmRemarkEAC from "../../ModalConfirmRemarkEAC";
import { FaFileExcel } from "react-icons/fa6";
import { toast } from "react-toastify";

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
  console.log(type);
  const extension = name?.split(".").pop();
  console.log(extension);
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

const ItemIssue = ({
  issueTransactionData,
  getIssueTransaction,
  device,
  year,
  month,
  UgtGroup,
  portfolio,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.login.userobj);
  const issueRequest = issueTransactionData?.issueRequest;
  const dataPDF = useSelector((state) => state.eac?.dataSF04PDF);

  console.log(issueRequest);

  const issueRequestId = issueRequest?.issueRequestId;
  const issueRequestDetailId = issueRequest?.issueRequestDetailId;

  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [showModalFail, setShowModalFail] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [fileGeneration, setFileGeneration] = useState([]);

  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [showModalSignAndSubmit, setShowModalSignAndSubmit] = useState(false);
  const [showSignAndSubmitSuccess, modalSignAndSubmitSuccess] = useDisclosure();
  const [showVerifySuccess, modalVerifySuccess] = useDisclosure();
  const [showReturnSuccess, modalReturnSuccess] = useDisclosure();
  const [showModalConfirmVerify, setShowModalConfirmVerify] = useState(false);
  const [showModalConfirmReturn, setShowModalConfirmReturn] = useState(false);
  const remarkReturn = useRef("");
  const [isSign, setIsSign] = useState(true);
  const [actual, setActual] = useState("Actual");

  const [note, setNote] = useState(issueRequest?.note ?? "");
  const [totalProduction, setTotalProduction] = useState(0);
  const [isConfirmChecked, setIsConfirmChecked] = useState(false);
  const [fileSF04Preview, setFileSF04Preview] = useState({});
  const setSign = useRef(true);
  const pdfRef = useRef();
  const [dataSF04, setDataSF04] = useState([]);
  // status
  let issueRequestStatus = issueRequest?.status ?? "";

  if (issueRequestStatus === "") {
    issueRequestStatus = "Pending";
  } else if (issueRequestStatus.toLowerCase() === "draft") {
    issueRequestStatus = "Draft";
  } else if (
    issueRequestStatus.toLowerCase() === "in progress"
  ) {
    issueRequestStatus = "In Progress";
  } else if (issueRequestStatus.toLowerCase() === "completed") {
    issueRequestStatus = "Issued";
  } else if (issueRequestStatus.toLowerCase() === "rejected") {
    issueRequestStatus = "Rejected";
  } else if (issueRequestStatus.toLowerCase() === "verified") {
    issueRequestStatus = "Verified";
  } else if(issueRequestStatus.toLowerCase() === "submitted"){
    issueRequestStatus = "Submitted"
  }

  // control action status
  let canSendIssue = false;
  let canUpload = false;
  let canVerify = false;

  // check if user is Contractor , can view only.
  if (
    userData?.userGroup?.id == USER_GROUP_ID.MEA_CONTRACTOR_MNG ||
    userData?.userGroup?.id == USER_GROUP_ID.PEA_CONTRACTOR_MNG
  ) {
    canSendIssue = false;
    canUpload = false;
    canVerify = false;
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
      canVerify = false;
    } else {
      if (userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY) {
        canSendIssue = true;
        canUpload = true;
        canVerify = false;
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER
      ) {
        canSendIssue = false;
        canUpload = true;
        canVerify = true;
      } else {
        canSendIssue = false;
        canUpload = false;
      }
    }
  }

  const props = {
    multiple: true,
    // listType: "picture",
    beforeUpload: beforeUpload,
    customRequest: uploadToEvident,
    onDownload: onPreviewFile,
    onPreview: previewFile,
    onRemove: removeFile,
    showUploadList: false, // ❌ ซ่อนรายการไฟล์ที่ Dragger แสดง
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
  };

  const checkShowPreview = (type) => {
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

  async function onPreviewFile(file) {
    console.log(file);
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

  async function uploadToEvident(options) {
    const { file, onSuccess, onError } = options;
    console.log(file);
    showLoading();
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
      hideLoading();
      onSuccess("Ok");
      // เรียกข้อมูล issue ใหม่ เพื่อให้มี File List
      getIssueTransaction();
    } catch (err) {
      console.log("Error: ", err);
      hideLoading();
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
      const name = getTypeFilename(file.type, file.name);

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      blobToBase64(blob).then((base64String) => {
        console.log(base64String); // เป็นสตริง Base64
        previewFileUpload(base64String, file.type, name);
        hideLoading();
      });
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
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
    if (issueRequest?.settlementDetail) {
      prepareFileUploadData();
      setFileGeneration(issueRequest.generationFileList);
    }
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

  async function verifyIssueDetail(params) {
    try {
      const res = await axios.post(`${EAC_ISSUE_REQUEST_VERIFY}`, params);
      return res;
    } catch (error) {
      return error;
    }
  }

  const showbase = async () => {
    console.log("Preview PDF");

    if (issueRequest.fileSF04 == null) {
      //setSign.current = false
      //setIsGenarate(true)
      await fetchSettlementData(
        device,
        portfolio,
        year,
        month,
        UgtGroup,
        false
      );
      setDataSF04(dataPDF);
      const base = await handleGeneratePDF();
      //const form = await handleGeneratePDFFileForm()
      console.log(base);
      //setIsGenarate(false)
      openPDFInNewTab(base.binaryBase, "application/pdf", base.file.name);

      console.log(base);
    } else if (issueRequest.fileSF04) {
      showLoading();
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_DOWNLOAD_FILE}?fileUid=${issueRequest.fileSF04.uid}`,
        {},
        { responseType: "blob" } // Important: indicate that the response type is a Blob
      );

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      blobToBase64(blob)
        .then((base64String) => {
          console.log(base64String); // เป็นสตริง Base64
          openPDFInNewTab(
            base64String,
            "application/pdf",
            issueRequest.fileSF04.fileName + ".pdf"
          );
          hideLoading();
        })
        .catch((error) => {
          console.error("Error converting blob to base64:", error);
          hideLoading();
        });
      //
    }
  };

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        // แปลงข้อมูลที่ได้จาก reader.result เป็น base64
        resolve(reader.result.split(",")[1]); // เอาส่วนที่เป็น base64 ออก
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(blob); // เริ่มการอ่าน Blob เป็น data URL
    });
  }

  const openPDFInNewTab = (base64String, type, name) => {
    const extension = name.split(".").pop();
    const pdfWindow = window.open("");
    console.log("PDF", pdfWindow);
    console.log(type);
    if (extension === "pdf") {
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
      extension === "jpeg" ||
      extension === "jpg" ||
      extension === "png" ||
      extension === "svg"
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

  const handleGeneratePDF = async () => {
    try {
      const base64String = await PdfFormPreviewSF04.generatePdf();

      //const fileForm = await PdfFormPreviewSF04.generatePdfFileForm()
      //console.log(fileForm)

      //setPdfBase64(base64String);
      //console.log("Generated Base64 PDF:", base64String);
      return base64String;
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const handleModalSignAndSubmit = () => {
    setShowModalSignAndSubmit(true);
  };

  const handleCloseModalSignAndSubmit = () => {
    setShowModalSignAndSubmit(false);
  };

  const handleModalConfirm = () => {
    setShowModalConfirm(true);
    console.log(issueTransactionData);
  };

  const handleCLodeModalConfirm = () => {
    setShowModalConfirm(false);
  };

  const actionSignAndSubmit = () => {
    console.log("Action Sign And Submit");
    setShowModalConfirm(false);
    setShowModalSignAndSubmit(false);
    handleTakeActionSignAndSubmit();
  };

  const previewSF04AfterSign = () => {
    openPDFInNewTab(
      fileSF04Preview.binaryBase,
      fileSF04Preview.file.type,
      fileSF04Preview.file.name
    );
  };

  console.log(userData.firstName + " " + userData.lastName);

  const issueRequestDetailVerify = async () => {
    handleCloseModalVerify();
    showLoading();
    const param = {
      issueRequestId: issueRequestId,
      issueRequestDetailId: issueRequestDetailId,
      createBy: userData.firstName + " " + userData.lastName,
    };

    const responseDraft = await verifyIssueDetail(param);

    if (responseDraft?.status === 200) {
      // เรียก createIssueDetail อีกครั้งแต่ส่ง status: `Submitted`

      modalVerifySuccess.open();
      getIssueTransaction();
      hideLoading();
    } else {
      getIssueTransaction();
      console.log("responseDraft", responseDraft);
      setShowModalFail(true);
      hideLoading();
    }
  };
  //console.log(issueRequest.issueRequestHistory.filter((item)=>item.action === "Rejected"))
  const issueRequestDetailCreate = async (data,dataGen) => {
    console.log(data);
    let fileUidArray = [];
    console.log(issueTransactionData);
    issueRequest.fileUploaded.map((item) =>
      fileUidArray.push(`/files/${item.uid}`)
    );
    if (data.uid != "") {
      fileUidArray.push(`/files/${data.uid}`);
    }
    dataGen.map((item)=>{
      if(item.uid !== ""){
        fileUidArray.push(`/files/${item.uid}`)
      }
    }
    )
    console.log(fileUidArray);
    const checkStatus = issueRequest.issueRequestHistory.filter((item)=>item.action === "Rejected")
    const paramsDraft = {
      issueRequestId: issueRequestId,
      deviceCode: issueTransactionData.deviceCode,
      issueRequestDetailId: issueRequestDetailId,
      issueUid: `/issues/${issueTransactionData.issueRequest.issueRequestUid}`,
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
      checkStatus.length != 0 ? `Submitted` : `Draft`,
      notes: note,
      issuerNotes: note,
      files: fileUidArray,
      createBy: userData.firstName + " " + userData.lastName,
    };

    console.log("paramsDraft", paramsDraft);
    // showSwal();
    showLoading();
    const responseDraft = await createIssueDetail(paramsDraft);

    if (responseDraft?.status === 200) {
      // เรียก createIssueDetail อีกครั้งแต่ส่ง status: `Submitted`

      modalSignAndSubmitSuccess.open();
      getIssueTransaction();
      hideLoading();
    } else {
      try {
        const res = await axios.delete(
          `${EAC_ISSUE_REQUEST_DELETE_FILE}?fileUid=${data.uid}`
        );
        console.log("res", res);
        getIssueTransaction();
        console.log("responseDraft", responseDraft);
        setShowModalFail(true);
        hideLoading();
      } catch (err) {
        setShowModalFail(true);
        hideLoading();
        console.log("Error: ", err);
      }
    }
  };

  const fetchSettlementData = (
    device,
    portfolio,
    year,
    month,
    UgtGroup,
    isSignSubmit
  ) => {
    return new Promise((resolve, reject) => {
      dispatch(
        getDataSettlement(
          device,
          portfolio,
          year,
          month,
          UgtGroup,
          true,
          isSignSubmit,
          0,
          0
        )
      )
        .then(resolve)
        .catch(reject);
    });
  };
  //console.log(issueTransactionData);

  const handleTakeActionSignAndSubmit = async () => {
    try {
      // ดึงข้อมูลที่จำเป็น
      await fetchSettlementData(device, portfolio, year, month, UgtGroup, true);
      setDataSF04(dataPDF);
      setSign.current = true;
      // สร้าง PDF ครั้งเดียว
      const pdfResult = await handleGeneratePDFSign();
      if (!pdfResult) {
        console.error("Failed to generate PDF");
        return;
      }

      setFileSF04Preview(pdfResult);
      showLoading();
      // อัปโหลด PDF
      const uploadResult = await uploadPdf(pdfResult);
      if (uploadResult.success) {
        const uploadGenResult = await uploadFileGenToEvident(fileGeneration)
        if(uploadGenResult.success){
          issueRequestDetailCreate(uploadResult.data,uploadGenResult.data);
        }
        else{
          console.error("Upload failed", uploadGenResult.error);
          setShowModalFail(true);
        }
        
      } else {
        console.error("Upload failed", uploadResult.error);
        setShowModalFail(true);
      }
    } catch (error) {
      console.error("Error during sign and submit", error);
      setShowModalFail(true);
    } finally {
      hideLoading();
    }
  };

  // ฟังก์ชันสร้าง PDF
  const handleGeneratePDFSign = async () => {
    try {
      // เรียกใช้ฟังก์ชัน generatePdf ของ TemplatePdfSF04
      return await PdfFormPreviewSF04.generatePdf();
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  // ฟังก์ชันอัปโหลด PDF
  const uploadPdf = async (pdfResult) => {
    const params = new FormData();
    params.append("issueRequestDetailId", issueRequestDetailId);
    params.append("file", pdfResult.file);
    params.append("name", pdfResult.file.name.replace(/\.[^/.]+$/, ""));
    params.append("notes", "SF04");

    try {
      const response = await axios.post(
        `${EAC_ISSUE_REQUEST_CREATE_ISSUE_SF04_DETAIL_FILE}`,
        params,
        { headers: { "content-type": "multipart/form-data" } }
      );
      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return { success: false, error };
    }
  };

  const uploadFileGenToEvident = async (fileUpload)=>{
    /*let file = []

    fileUpload.forEach((item,index)=>{
      console.log(item)
      const blobFile = base64ToBlob(item.binary,item.type)
      const fileGen = new File(
        [blobFile],
        item.name,
        { type: item.type }
      );
      console.log(fileGen)
      console.log(issueRequestDetailId)
      const params = new FormData();
      params.append("issueRequestDetailId", issueRequestDetailId);
      params.append("file", fileGen);
      params.append("name", item.name);
      params.append("notes", "");
      const newParam ={
        issueRequestDetailId: issueRequestDetailId,
        file: fileGen,
        name: item.name,
        notes: ""
      }
      console.log(newParam)
      file.push(newParam)
    })*/

    const param = {
      issueRequestDetailId: issueRequestDetailId,
      generationFileList: fileUpload
    }

    try {
      const response = await axios.post(
        `${EAC_ISSUE_REQUEST_UPLOAD_GEN_EVIDENT}`,
        param
      );
      if (response.status === 200 || response.status === 201) {
        console.log(response.data)
        return { success: true, data: response.data };
      }
      return { success: false, error: response };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return { success: false, error };
    }
  }

  function base64ToBlob(base64, mimeType = '') {
    // แยก header ออกจากข้อมูล base64 (ถ้ามี)
    const byteCharacters = atob(base64);
    
    // แปลงเป็นอาร์เรย์ของ byte
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    // สร้าง Uint8Array
    const byteArray = new Uint8Array(byteNumbers);

    // สร้าง Blob
    return new Blob([byteArray], { type: mimeType });
}

  const handleOpenModalVerify = () => {
    setShowModalConfirmVerify(true);
  };

  const handleActionVerify = () => {
    console.log("Verify");

    issueRequestDetailVerify();
  };

  const handleCloseModalVerify = () => {
    setShowModalConfirmVerify(false);
  };

  const downloadfileGen = (file) => {
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
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const previewfileGen = (file) => {
    try {
      showLoading();

      const name = getTypeFilename(file.type, file.name);

      previewFileUpload(file.binary, file.type, file.name);
      hideLoading();
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  };

  const handleOpenModalReturn = () => {
    setShowModalConfirmReturn(true);
  };

  const handleCloseModalReturn = () => {
    setShowModalConfirmReturn(false);
  };

  async function returnIssueDetail(params) {
    try {
      const res = await axios.post(`${EAC_ISSUE_REQUEST_RETURN}`, params);
      return res;
    } catch (error) {
      return error;
    }
  }

  const issueRequestDetailReturn = async () => {
    handleCloseModalReturn();
    showLoading();
    const param = {
      issueRequestId: issueRequestId,
      issueRequestDetailId: issueRequestDetailId,
      createBy: userData.firstName + " " + userData.lastName,
      remark: remarkReturn.current,
    };

    const responseReturn = await returnIssueDetail(param);

    if (responseReturn?.status === 200) {
      // เรียก createIssueDetail อีกครั้งแต่ส่ง status: `Submitted`

      toast.success("Return Device Complete!", {
        position: "top-right",
        autoClose: 5000,
        style: {
          border: "1px solid #a3d744", // Green border similar to the one in your image
          color: "#6aa84f", // Green text color
          fontSize: "16px", // Adjust font size as needed
          backgroundColor: "##FFFFFF", // Light green background
        }, // 3 seconds
      });
      getIssueTransaction();
      hideLoading();
    } else {
      getIssueTransaction();
      console.log("responseReturn", responseReturn);
      setShowModalFail(true);
      hideLoading();
    }
  };

  const ActionRequestReturn = () => {
    issueRequestDetailReturn();
  };

  const ExportExcel = () => {};

  const splitDateTimeLog = (DateTime) => {
    const [date, time] = DateTime.split("T");
    const [year, month, day] = date.split("-");
    const [fulltime, ms] = time.split(".");

    return day + "/" + month + "/" + year + " " + fulltime;
  };

  const getLogType=(action)=>{
    console.log(action)
    if(action == "Verified"){
      return "Verified By "
    }
    else if(action == "Submitted"){
      return "Submitted By "
    }
    else if(action == "Returned"){
      return "Returned By "
    }
    else if(action == "Rejected"){
      return "Rejected By "
    }
  }
  console.log(fileUploaded);
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
          <div className="text-sm font-normal text-[#91918A]">Device Fuel</div>
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
            Actual Generation Matched
          </div>
          <div className="text-sm font-semibold">
            {numeral(issueTransactionData?.actualGenerationMatched).format(
              "0,0.000"
            )}{" "}
            kWh (
            {numeral(
              numeral(issueTransactionData?.actualGenerationMatched).value() /
                1000
            ).format("0,0.000000")}{" "}
            MWh)
          </div>
        </div>
        <div className="flex flex-col gap-2"></div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Inventory Matched
          </div>
          <div className="text-sm font-semibold">
            {numeral(issueTransactionData?.inventoryMatched).format("0,0.000")}{" "}
            kWh (
            {numeral(
              numeral(issueTransactionData?.inventoryMatched).value() / 1000
            ).format("0,0.000000")}{" "}
            MWh)
          </div>
        </div>
      </div>
      <div className="text-right mt-4">
        {/*<Button
          className={"border-2 border-[#4D6A00] bg-[#fff] text-[#4D6A00] mr-2"}
          onClick={ExportExcel}
        >
          <FaFileExcel className="mr-1" /> Export Excel
        </Button>*/}
        <Button
          className="border-2 border-[#4D6A00] bg-[#fff] text-[#4D6A00]"
          onClick={showbase}
        >
          <IoDocumentTextOutline className="mr-1" /> Preview SF-04
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
          {fileUploaded.length > 0 || fileGeneration.length > 0 ? (
            <Button
              className="text-[#4D6A00] underline px-8"
              onClick={() => setOpenModalUpload(!openModalUpload)}
            >
              {fileUploaded.length + fileGeneration.length == 1
                ? `${fileUploaded.length + fileGeneration.length} File Uploaded`
                : `${
                    fileUploaded.length + fileGeneration.length
                  } Files Uploaded`}
            </Button>
          ) : undefined}
        </div>
        <div className="gap-2 col-start-3 h-auto">
          <div>
            <div className="text-sm font-normal mb-2 text-[#91918A]">Note</div>
            {canSendIssue || canVerify ? (
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
      {/*Sign and Submit Button */}
      {canSendIssue &&
      issueRequestStatus.toLowerCase().replace(" ", "") == "verified" ? (
        <div className="flex justify-between mt-4">
          <div>
            <Button
              className="bg-[#EF4835] text-white px-8 w-[150px]"
              onClick={() => handleOpenModalReturn()}
            >
              Return
            </Button>
          </div>
          <div>
            <Button
              className="bg-[#87BE33] text-white px-8"
              onClick={() => handleModalConfirm()}
            >
              Sign & Submit
            </Button>
          </div>
        </div>
      ) : undefined}

      {/*Verify Button */}
      {(issueRequestStatus.toLowerCase().replace(" ", "") == "pending" ||
        issueRequestStatus.toLowerCase().replace(" ", "") == "rejected" ||
        issueRequestStatus.toLowerCase().replace(" ", "") == "returned") &&
      canVerify ? (
        <div className="mt-4 text-right">
          <Button
            className="bg-[#87BE33] text-white px-8"
            onClick={() => handleOpenModalVerify()}
          >
            Verify
          </Button>
        </div>
      ) : undefined}

      {issueRequest !== null && issueRequest.issueRequestHistory.length !== 0 ? (
        <div className="border-3 border-dotted px-[20px] py-[10px] mt-4">
          {issueRequest.issueRequestHistory.map((item, index) => {
            return (
              <div className="text-right w-full text-sm" key={index}>
                <label>
                  {getLogType(item.action)}{" "}
                </label>
                <label className="font-bold ml-1">
                  {item.createBy + " " + splitDateTimeLog(item.createDateTime)}
                </label>
              </div>
            );
          })}
        </div>
      ):undefined}

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

      {/*Modal Upload File */}
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

          {/* Section สำหรับไฟล์ที่อัปโหลดแล้ว */}
          <div className="mt-4">
            <p className="mt-2 text-[#224422] text-sm">
              Add new upload (if any) :
            </p>

            {/* รายการไฟล์ที่อัปโหลดแล้ว */}
            <div>
              {fileUploaded.map((file) => (
                <div
                  key={file.uid}
                  className="flex justify-between items-center p-2 border border-gray-300 rounded mb-2"
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
                      width={35}
                      height={35}
                    />
                    <span className="text-sm font-normal">{file.name}</span>
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
                      onClick={() => props.onDownload(file)}
                    >
                      <RiDownloadLine /> {/* ไอคอนดาวน์โหลด */}
                    </button>
                    {checkShowPreview(file.type) && file.status == "done" ? (
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
                        <RiEyeLine />
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
                        onClick={() => props.onRemove(file)}
                      >
                        <FaRegTrashAlt /> {/* ไอคอนลบ */}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p
              style={{ marginBottom: "6px", color: "#224422" }}
              className="text-sm underline decoration-[2px]"
            >
              Generation Data Input
            </p>
            <p
              style={{ marginBottom: "10px", color: "#444" }}
              className="text-sm"
            >
              Previously uploaded files:
            </p>
            <div>
              {fileGeneration.map((file) => (
                <div
                  key={file.uid}
                  className="flex justify-between items-center p-2 border border-gray-300 rounded mb-2"
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
                      width={35}
                      height={35}
                    />
                    <span className="text-sm font-normal">{file.name}</span>
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
                      onClick={() => downloadfileGen(file)}
                    >
                      <RiDownloadLine /> {/* ไอคอนดาวน์โหลด */}
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
                        onClick={() => previewfileGen(file)}
                      >
                        <RiEyeLine />
                      </button>
                    ) : undefined}
                  </div>
                </div>
              ))}
            </div>
          </div>

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

      {/*Modal Success Sign and Submit */}
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
              onClick={() => previewSF04AfterSign()}
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

      {/*Modal Success Verify */}
      <Modal
        opened={showVerifySuccess}
        onClose={modalVerifySuccess.close}
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
            Verification Complete!
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
              onClick={() => modalVerifySuccess.close()}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      {/*Confirm Sign and Submit 1 */}
      {showModalConfirm && (
        <ModalConfirmCheckBoxEAC
          onCloseModal={handleCLodeModalConfirm}
          onClickConfirmBtn={handleModalSignAndSubmit}
          title={"Submit Issue Request"}
          content={"Are you sure you wish to submit this issue request?"}
          textCheckBox={
            "I confirm all the required information is completed and the necessary supporting information and files are attached."
          }
          sizeModal={"lg"}
          textButton={"Yes, submit request"}
          isHaveFile={
            issueTransactionData?.issueRequest?.fileUploaded.length == 0 && fileGeneration.length == 0
              ? false
              : true
          }
        />
      )}

      {/*Confirm Verify */}
      {showModalConfirmVerify && (
        <ModalConfirmCheckBoxEAC
          onCloseModal={handleCloseModalVerify}
          onClickConfirmBtn={handleActionVerify}
          title={"Verify this Issue Request?"}
          content={"Would you like to verify this Issue Request?"}
          content2={
            "Verified Issue Request will be sent to sign and unable to recall."
          }
          showCheckBox={false}
          sizeModal={"lg"}
          textButton={"Verify & Send to Sign"}
          isHaveFile={
            issueTransactionData?.issueRequest?.fileUploaded.length == 0 &&
            issueTransactionData?.issueRequest?.generationFileList.length == 0
              ? false
              : true
          }
        />
      )}

      {/*Confirm Sign and Submit 2 */}
      {showModalSignAndSubmit && (
        <ModalConfirmCheckBoxEAC
          onCloseModal={handleCloseModalSignAndSubmit}
          onClickConfirmBtn={actionSignAndSubmit}
          title={"Sign & Submit?"}
          content={
            "In signing, the Registrant warrants that the energy for which I-REC certificates are being applied has not and will not be submitted for any other energy attribute tracking methodology."
          }
          content2={
            "The Registrant also warrants that, to the best of their knowledge, the consumption attributes contained within any I-REC certificate Issued in association with this request (including all rights to the specific electricity and/or emissions for the reporting of any indirect carbon account purposes) are not delivered to any other body either directly or in-directly without the component I-REC certificate."
          }
          content3={
            "This includes but is not limited to electricity supply companies or the national governments."
          }
          textCheckBox={
            "I have read and agree to the terms as described above."
          }
          sizeModal={"lg"}
          textButton={"Yes, submit request"}
          isShowInfo={true}
          textAlign={"left"}
          isHaveFile={true}
        />
      )}

      {/*Confirm Return */}
      {showModalConfirmReturn && (
        <ModalConfirmRemarkEAC
          onClickConfirmBtn={ActionRequestReturn}
          onCloseModal={handleCloseModalReturn}
          title={"Return this Issue Request?"}
          content={
            "Issue Request requires to be edited. Would you like to return to Device Owner?"
          }
          openCheckBox={false}
          setRemark={remarkReturn}
          sizeModal={"md"}
          buttonTypeColor="danger"
          textButton="Return"
        />
      )}

      <PdfFormPreviewSF04
        data={dataPDF}
        isSign={setSign.current}
        Sign={userData.firstName + " " + userData.lastName}
      />
      {showModalFail && <ModalFail content={"Something went wrong. Please go back and try again."} onClickOk={handleCloseFailModal} />}
    </>
  );
};

export default ItemIssue;

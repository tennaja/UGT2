"use client";

import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import AlmostDone from "../assets/done.png";
import { Button, Card, Divider, Modal } from "@mantine/core";
import { Form, Select } from "antd";
import SettlementInfo from "./SettlementInfo";
import { useLocation, useNavigate } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import ModalConfirmNew from "../Control/Modal/ModalConfirmNew";
import {
  USER_GROUP_ID,
  MONTH_LIST,
  CONVERT_UNIT,
  UTILITY_GROUP_ID,
} from "../../Constants/Constants";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  getPortfolioYearList,
  getPortfolioMonthList,
  settlementApproval,
  getSettlementApproval,
  setSelectedYear,
  setSelectedMonth,
  clearSettlementFailRequest,
  settlementReject,
  getFileExcelSettlement,
  getFileExcelConvertToPDF,
  //clearSettlementSuccessRequest,
  getSettlementDetail,
  getExcelData,
  getFileExcelScreenSettlement,
  getSettlementStatus,
  settlementVerify,
  settlementRequestEdit,
} from "../../Redux/Settlement/Action";
import { FetchUtilityContractList } from "../../Redux/Dropdrow/Action";
import { AiOutlineExport } from "react-icons/ai";
//import { useLocation } from "react-router-dom";

// icon import
import { FaCheck } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import SettlementMenu from "./SettlementMenu";
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegFileExcel } from "react-icons/fa";
import ModalConfirmRemarkSettlement from "./ModalConfirmRemarkSettlement";
import { hideLoading, showLoading } from "../../Utils/Utils";
import ModalFail from "../Control/Modal/ModalFail";
import SearchBox from "../Control/SearchBox";
import { RiPencilFill } from "react-icons/ri";
import { LuSearch } from "react-icons/lu";
import TemplatePDFExcel from "./TemplatePDFExcel";
import HistoryLogSettlement from "./HistoryLogSettlement";
import SettlementInfoFinal from "./SettlementInfoFinal";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";
import TemplatePDFExcelUGT2 from "./TemplatePDFExcelUGT2";
import { MdOutlineFileDownload } from "react-icons/md";
export default function SettlementApproval() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();

  const {
    ugtGroupId,
    portfolioId,
    portfolioName,
    prevSelectedYear,
    prevSelectedMonth,
  } = location.state;
  //console.log(location.state);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  //console.log(ugtGroupId);
  const settlementApprovalResponse = useSelector(
    (state) => state.settlement.settlementApproval
  );
  const getSettlementApproveData = useSelector(
    (state) => state.settlement.getSettlementApproval
  );

  const userData = useSelector((state) => state.login.userobj);

  const utilityContractListData = useSelector(
    (state) => state.dropdrow.utilityCOntractList
  );
  //console.log(utilityContractListData)

  const yearListData = useSelector((state) => state.settlement.yearList);
  const monthListData = useSelector((state) => state.settlement.monthList);
  const tmpSelectedYear = useSelector(
    (state) => state.settlement?.selectedYear
  );
  const settlementDetailData = useSelector(
    (state) => state.settlement.settlementDetail
  );
  const isShowModalFail = useSelector(
    (state) => state.settlement.isFailRequest
  );
  const isShowModalSuccess = useSelector(
    (state) => state.settlement.isSuccessRequest
  );

  const settlementDetailStatus = useSelector(
    (state) => state.settlement.settlementStatus
  );

  //console.log(settlementDetailStatus);

  const excelData = useSelector((state) => state.settlement.dataExcel);
  const [settlementYear, setSettlementYear] = useState(prevSelectedYear);
  const [settlementMonth, setSettlementMonth] = useState(prevSelectedMonth);
  //console.log(prevSelectedMonth);
  const [prevMonth, setPrevMonth] = useState(prevSelectedMonth);
  const [latestYearHasData, setLatestYearHasData] = useState(
    yearListData.latestYearHasData
  );
  const [latestMonthHasData, setLatestMonthHasData] = useState(
    monthListData.defaultMonth
  );

  const [unit, setUnit] = useState(CONVERT_UNIT[1].unit);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [approveStatus, setApproveStatus] = useState(false);
  const [approveDate, setApproveDate] = useState(null);
  const [showModalComplete, setShowModalComplete] = useState(false);

  const [overviewDataUnit, setOverviewDataUnit] = useState(
    CONVERT_UNIT[0].unit
  );

  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[0].convertValue);
  const [canViewSettlementDetail, setCanViewSettlementDetail] = useState(false);
  const [listOptionUtility, setListOptionUtility] = useState([
    { id: 0, abbr: "All", name: "All" },
  ]);
  const [selectOptionUtility, setSelectOptionUtility] = useState(
    listOptionUtility[0].abbr
  );
  const [selectOptionUtilityID, setSelectOptionSelectID] = useState(
    listOptionUtility[0].id
  );
  const [approveDetail, setApproveDetail] = useState([]);
  const [isClickApprove, setIsClickApprove] = useState(false);
  const [userGroupUtilityID, setUserGroupUtilityID] = useState("");
  const [isShowPopupReject, setIsShowPopupReject] = useState(false);
  const [selectTab, setSelectTab] = useState("initial");
  const [searchHistory, setSearchHistory] = useState("");
  const [popupConfirmVerify, setPopupConfirmVerify] = useState(false);
  const [popupConfirmRequestEdit, setPopupConfirmRequestEdit] = useState(false);
  const [isGen, setIsGen] = useState(false);
  const [isGenPDF, setIsGenPDF] = useState(false);
  const [dataPDF, setDataPDF] = useState({
    dataDetailSheet1: {},
    dataListDetailSheet2: [],
  });

  const [isCanVerify, setIsCanVerify] = useState(false);

  const RemarkReject = useRef("");
  const RemarkRequestEdit = useRef("");
  const contentRef = useRef();
  const [hideBtn,setHideBtn] = useState(false)
  const [hideBtnInitial,setHideBtnInitial] = useState(false)

  let isDeviceOwner = false;
  if(userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG || userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG || userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ){
    isDeviceOwner = true
  }
  else{
    isDeviceOwner = false;
  }

  const mockExcel = {
    totalContract: 100,
    totalLoad: 100,
    totalREC: 100,
    UGT1InvenREC: 100,
  };

  useEffect(() => {
    // Re-Load ใหม่ กรณีที่ refresh
    dispatch(getPortfolioYearList(ugtGroupId, portfolioId));
    dispatch(FetchUtilityContractList());
    dispatch(
      getSettlementStatus(
        portfolioId,
        settlementYear,
        settlementMonth,
        ugtGroupId
      )
    );
  }, []);

  useEffect(() => {
    const userGroupID = userData?.userGroup?.id;
    let user_utilityID = "";
    if (userGroupID == USER_GROUP_ID.WHOLE_SALEER_ADMIN) {
      console.log("Egat");
      user_utilityID = UTILITY_GROUP_ID.EGAT; // EGAT 1
    } else if (userGroupID == USER_GROUP_ID.PEA_SUBSCRIBER_MNG) {
      console.log("PEA");
      user_utilityID = UTILITY_GROUP_ID.PEA; // PEA 2
    } else if (userGroupID == USER_GROUP_ID.MEA_SUBSCRIBER_MNG) {
      console.log("MEA");
      user_utilityID = UTILITY_GROUP_ID.MEA; // MEA 3
    }

    setUserGroupUtilityID(user_utilityID);
  }, [userData]);

  useEffect(() => {
    if (settlementYear != null && settlementMonth != null) {
      console.log(selectOptionUtilityID);
      dispatch(
        getSettlementDetail(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          selectOptionUtilityID
        )
      );
      dispatch(
        getSettlementStatus(
          portfolioId,
          settlementYear,
          settlementMonth,
          ugtGroupId
        )
      );
    }
  }, [settlementMonth, settlementYear]);

  console.log(settlementDetailData);

  useEffect(() => {
    console.log(utilityContractListData);
    console.log(selectOptionUtility);
    if (utilityContractListData.length > 0) {
      console.log("Come to Set");
      let tmpUtility = [];
      tmpUtility.push({ id: 0, abbr: "All", name: "All" });
      utilityContractListData?.map((items) => tmpUtility.push(items));
      setListOptionUtility(tmpUtility);
    }
  }, [utilityContractListData]);

  //console.log(listOptionUtility)

  useEffect(() => {
    // Re-Load ใหม่ กรณีที่ refresh และมีเปลี่ยนปี
    if (!tmpSelectedYear) {
      setSettlementYear(prevSelectedYear);
    } else {
      setSettlementYear(tmpSelectedYear);
    }
  }, [tmpSelectedYear]);

  useEffect(() => {
    // Re-Load ใหม่ กรณีที่ refresh
    dispatch(getPortfolioMonthList(ugtGroupId, portfolioId, settlementYear));
  }, [settlementYear]);

  // Fetch approve status
  useEffect(() => {
    if (settlementMonth) {
      dispatch(
        getSettlementApproval(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
    }
  }, [settlementMonth]);
  // approve status
  useEffect(() => {
    if (getSettlementApproveData) {
      const approveData = getSettlementApproveData?.utilityList?.filter(
        // const approveData = sample_SettlementApproveData?.filter(
        (item) => item.approveStatus !== null
      );
      setApproveDetail(approveData);
    } /*else {
      setApproveStatus(false);
      setApproveDate(null);
    }*/
  }, [getSettlementApproveData]);

  // หลังกด approve แล้ว Fetch approve status ล่าสุดอีกรอบ
  useEffect(() => {
    if (isClickApprove && settlementApprovalResponse?.status) {
      //setShowModalComplete(true);
      // get status อีกรอบ
      dispatch(
        getSettlementApproval(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
    }
  }, [settlementApprovalResponse]);

  const isUserCanApprove = (item) => {
    console.log(userGroupUtilityID);
    if (userGroupUtilityID == item.utilityId && item.approveStatus == "W") {
      return true;
    }
    return false;
  };

  // approve status
  /*useEffect(() => {
    if (getSettlementApproveData) {
      const approveData = getSettlementApproveData?.utilityList?.filter(
        // const approveData = sample_SettlementApproveData?.filter(
        (item) => item.approveStatus !== null
      );
      setApproveDetail(approveData);
    }
  }, [getSettlementApproveData]);*/

  useEffect(() => {
    // set default month
    if (monthListData?.monthList?.length > 0) {
      if (!prevMonth) {
        // กรณีกดจากปุ่ม Pending Approval
        setSettlementMonth(monthListData.defaultMonth);
        dispatch(setSelectedMonth(monthListData.defaultMonth));
      } else {
        // กรณีกดจากปุ่ม Awaiting for Approval
        setSettlementMonth(prevMonth);
        dispatch(setSelectedMonth(prevMonth));
      }
    }
  }, [monthListData]);

  // เอาไว้เช็ค dropdown และ set disable ไว้
  useEffect(() => {
    setLatestYearHasData(yearListData.latestYearHasData);
  }, [yearListData.latestYearHasData]);

  // เอาไว้เช็ค dropdown และ set disable ไว้
  useEffect(() => {
    setLatestMonthHasData(monthListData.defaultMonth);
  }, [monthListData]);

  useEffect(() => {
    if (settlementDetailStatus) {
      if (settlementDetailStatus.status == "N") {
        if (userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG) {
          setIsCanVerify(true);
        } else {
          setIsCanVerify(false);
        }
      } else {
        setIsCanVerify(false);
      }
    }
  }, [settlementDetailStatus]);

  const handleChangeSettlementYear = (year) => {
    Swal.fire({
      title: "Please Wait...",
      html: `กำลังโหลด...`,
      allowOutsideClick: false,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }); // ปิด swal อยู่ที่ api

    setPrevMonth(); // ล้างค่าที่พักจากหน้าก่อน
    dispatch(setSelectedYear(year));
    dispatch(getPortfolioMonthList(ugtGroupId, portfolioId, year));
  };

  const handleChangeSettlementMonth = (month) => {
    Swal.fire({
      title: "Please Wait...",
      html: `กำลังโหลด...`,
      allowOutsideClick: false,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }); // ปิด swal อยู่ที่ api

    dispatch(setSelectedMonth(month));
    setSettlementMonth(month);
  };
  console.log(isShowModalFail);
  const handleApprove = () => {
    dispatch(
      settlementApproval(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        userGroupUtilityID,
        userData.firstName + " " + userData.lastName
      )
    );
    /*dispatch(
      settlementApproval(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        userGroupUtilityID
      )
    );*/
    setIsClickApprove(true);
  };

  const onClickApprove = () => {
    Swal.fire({
      title:
        "<span class='text-2xl font-semibold text-[#666666]'>Confirm this Settlement?</span>",
      html: "<span class='text-sm text-[#666666]'>Would you like to confirm this Settlement Details?</span>",
      //icon: "warning",
      iconColor: "#87BE33",
      showCancelButton: true,
      reverseButtons: true, // สลับตำแหน่งปุ่ม
      customClass: {
        popup: "min-h-[225px] h-auto", // ปรับความสูง popup
        confirmButton:
          "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-[150px]", // ปุ่ม Confirm
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded w-[150px]", // ปุ่ม Cancel
      },
      cancelButtonColor: "#F3F6F9",
      cancelButtonText: `<span class="text-[#666666]">Back</span>`,
      confirmButtonColor: "#87BE33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        handleApprove();
      }
    });
  };

  const onClickReject = () => {
    setIsShowPopupReject(true);
  };

  const onCloseRejectPopup = () => {
    setIsShowPopupReject(false);
  };

  const handleReject = () => {
    console.log(RemarkReject);
    showLoading();
    setTimeout(() => {
      dispatch(
        settlementReject(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          userGroupUtilityID,
          RemarkReject.current,
          userData.firstName + " " + userData.lastName,
          () => {
            hideLoading();
            setIsShowPopupReject(false);
            dispatch(
              getSettlementDetail(
                ugtGroupId,
                portfolioId,
                settlementYear,
                settlementMonth,
                selectOptionUtilityID
              )
            );
            dispatch(
              getSettlementApproval(
                ugtGroupId,
                portfolioId,
                settlementYear,
                settlementMonth
              )
            );
          }
        )
      );
    }, 1000);
  };

  /*useEffect(() => {
    if (settlementApprovalResponse.status) {
      setApproveStatus(true);
      setApproveDate(settlementApprovalResponse.approveDate);
      setOpenModalConfirm(false);
      setShowModalComplete(true);
    } else {
      console.log("approved failed");
    }
  }, [settlementApprovalResponse]);*/

  const handleCloseModalConfirm = () => {
    setOpenModalConfirm(false);
  };

  const handleChangeOverviewUnit = (unit) => {
    console.log("Handle unit", unit);
    const unitObj = CONVERT_UNIT.filter((obj) => {
      return obj.unit == unit;
    });
    setOverviewDataUnit(unit);
    setConvertUnit(unitObj[0].convertValue);
    /*setTmpOverviewChartData(
      convertChartData(settlementOverviewData, unitObj[0].convertValue)
    );*/
  };

  const handleChangeUtility = (value) => {
    console.log(value);

    const findIDUtility = listOptionUtility.filter((obj) => {
      return obj.id == value;
    });
    console.log(findIDUtility);
    console.log(findIDUtility[0].id);
    setSelectOptionUtility(findIDUtility[0].abbr);
    setSelectOptionSelectID(value);
    console.log(selectOptionUtilityID);
  };

  const exportTablePDf = () => {
    showLoading();
    showbase();
  };
  const fetchExcelData = (portfolio, year, month, UgtGroup, IsInitial) => {
    return new Promise((resolve, reject) => {
      dispatch(
        getExcelData(
          portfolio,
          year,
          month,
          UgtGroup,
          selectOptionUtilityID,
          IsInitial
        )
      )
        .then(resolve)
        .catch(reject);
    });
  };
  const showbase = async (IsInitial) => {
    console.log("Preview PDF");
    setIsGen(true);
    //setSign.current = false
    //setIsGenarate(true)
    await fetchExcelData(
      portfolioId,
      settlementYear,
      settlementMonth,
      settlementDetailStatus.portfolioUgtId,
      true
    );
    let base = "";
    //setDataPDF(excelData)
    if (settlementDetailStatus.portfolioUgtId == 1) {
      base = await handleGeneratePDF();
    } else if (settlementDetailStatus.portfolioUgtId == 2) {
      base = await handleGeneratePDFUGT2();
    }
    //const form = await handleGeneratePDFFileForm()
    console.log(base);
    //setIsGenarate(false)
    openPDFInNewTab(base.binaryBase, "application/pdf", base.file.name);

    console.log(base);
    setIsGen(false);
    /*else if(issueRequest.fileSF04){
      showLoading();
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_DOWNLOAD_FILE}?fileUid=${issueRequest.fileSF04.uid}`,
        {},
        { responseType: "blob" } // Important: indicate that the response type is a Blob
      );

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      blobToBase64(blob)
      .then(base64String => {
        console.log(base64String); // เป็นสตริง Base64
        openPDFInNewTab(base64String,"application/pdf",issueRequest.fileSF04.fileName+".pdf")
        hideLoading()
      })
      .catch(error => {
        console.error('Error converting blob to base64:', error);
        hideLoading()
      });
      //
    }*/
  };

  const exportTablePDfFinal = () => {
    showLoading();
    showbaseFinal();
  };

  const showbaseFinal = async (IsInitial) => {
    console.log("Preview PDF");
    setIsGen(true);
    //setSign.current = false
    //setIsGenarate(true)
    await fetchExcelData(
      portfolioId,
      settlementYear,
      settlementMonth,
      settlementDetailStatus.portfolioUgtId,
      false
    );
    let base = "";
    //setDataPDF(excelData)
    if (settlementDetailStatus.portfolioUgtId == 1) {
      base = await handleGeneratePDF();
    } else if (settlementDetailStatus.portfolioUgtId == 2) {
      base = await handleGeneratePDFUGT2();
    }

    //const form = await handleGeneratePDFFileForm()
    console.log(base);
    //setIsGenarate(false)
    openPDFInNewTab(base.binaryBase, "application/pdf", base.file.name);

    console.log(base);
    setIsGen(false);
    /*else if(issueRequest.fileSF04){
      showLoading();
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_DOWNLOAD_FILE}?fileUid=${issueRequest.fileSF04.uid}`,
        {},
        { responseType: "blob" } // Important: indicate that the response type is a Blob
      );

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      blobToBase64(blob)
      .then(base64String => {
        console.log(base64String); // เป็นสตริง Base64
        openPDFInNewTab(base64String,"application/pdf",issueRequest.fileSF04.fileName+".pdf")
        hideLoading()
      })
      .catch(error => {
        console.error('Error converting blob to base64:', error);
        hideLoading()
      });
      //
    }*/
  };

  const handleGeneratePDF = async () => {
    try {
      const base64String = await TemplatePDFExcel.generatePdf();

      //const fileForm = await PdfFormPreviewSF04.generatePdfFileForm()
      //console.log(fileForm)

      //setPdfBase64(base64String);
      //console.log("Generated Base64 PDF:", base64String);
      return base64String;
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const handleGeneratePDFUGT2 = async () => {
    try {
      const base64String = await TemplatePDFExcelUGT2.generatePdf();

      //const fileForm = await PdfFormPreviewSF04.generatePdfFileForm()
      //console.log(fileForm)

      //setPdfBase64(base64String);
      //console.log("Generated Base64 PDF:", base64String);
      return base64String;
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const openPDFInNewTab = (base64String, type, name) => {
    const extension = name.split(".").pop();
    const pdfWindow = window.open("");
    console.log("PDF", pdfWindow);
    console.log(type);
    if (extension === "pdf") {
      if (pdfWindow) {
        // Set the title of the new tab to the filename
        //pdfWindow.document.title = name;
        setTimeout(() => {
          pdfWindow.document.title = name;
        }, 100);

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

  const exportTableExcelInitial = () => {
    dispatch(
      getFileExcelSettlement(
        portfolioId,
        settlementYear,
        settlementMonth,
        settlementDetailStatus.portfolioUgtId,
        true,
        selectOptionUtilityID,
        portfolioName
      )
    );
  };

  const exportTableExcelFinal = () => {
    dispatch(
      getFileExcelSettlement(
        portfolioId,
        settlementYear,
        settlementMonth,
        settlementDetailStatus.portfolioUgtId,
        false,
        selectOptionUtilityID,
        portfolioName
      )
    );
  };

  const exportScreenPDF = () => {
    generatePDFScreen();
  };

  const exportScreenExcelInitial = () => {
    showLoading();
    dispatch(
      getFileExcelScreenSettlement(
        portfolioId,
        settlementYear,
        settlementMonth,
        ugtGroupId,
        true
      )
    );
    hideLoading();
  };

  const exportScreenExcelFinal = () => {
    showLoading();
    dispatch(
      getFileExcelScreenSettlement(
        portfolioId,
        settlementYear,
        settlementMonth,
        ugtGroupId,
        false
      )
    );
    hideLoading();
  };

  const checkMonth = (month) => {
    //console.log(month);
    if (
      userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
      userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
    ) {
      return month > latestMonthHasData;
    } else {
      if (latestMonthHasData == 12) {
        return false;
      } else {
        return month >= latestMonthHasData;
      }
    }
  };

  const selectTabSettlement = (Tab) => {
    setSelectTab(Tab);
  };
  //Request Edit Action
  const requestEditAction = () => {
    setPopupConfirmRequestEdit(true);
  };

  const handleClosePopupConfirmRequestEdit = () => {
    setPopupConfirmRequestEdit(false);
  };

  const handleConfirmPopupRequestEdit = () => {
    showLoading();
    setPopupConfirmRequestEdit(false);
    dispatch(
      settlementRequestEdit(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        RemarkRequestEdit.current,
        userData.firstName + " " + userData.lastName,
        () => {
          hideLoading();
        }
      )
    );
  };

  //Verify Action
  const verifyAction = () => {
    setPopupConfirmVerify(true);
  };
  console.log(userData);
  const hadleClosePopupConfirmVerify = () => {
    setPopupConfirmVerify(false);
  };

  const handleConfirmPopupVerify = () => {
    showLoading();
    dispatch(
      settlementVerify(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        userData.firstName + " " + userData.lastName,
        () => {
          hideLoading();
        }
      )
    );

    setPopupConfirmVerify(false);
  };

  const generatePDFScreen = () => {
    //let oldSelect = selectTab
    //setSelectTab("final")
    setIsGenPDF(true);
    setTimeout(() => {
      // เลือก DOM element ที่ต้องการแปลงเป็น PDF
      const element = contentRef.current; //document.getElementById('pdf-content');

      // กำหนดตัวเลือกสำหรับ html2pdf
      const options = {
        margin: 0,
        filename: "webscreen.pdf",
        image: { type: "jpeg", quality: 50 },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        html2canvas: { scale: 2 }, // เพิ่ม scale เพื่อเพิ่มความละเอียด
        jsPDF: { unit: "cm", format: "a3", orientation: "portrait" },
      };

      // สร้าง PDF ด้วย html2pdf และดึง base64 string
      html2pdf()
        .from(element)
        .set(options)
        .outputPdf("datauristring") // ดึงข้อมูลออกมาเป็น Base64 string
        .then((pdfBase64) => {
          console.log(pdfBase64); // แสดง base64 string ใน console
          const base64Content = pdfBase64.split(",")[1];
          const now = new Date();
          const formattedDateTime = `${now
            .getDate()
            .toString()
            .padStart(2, "0")}_${(now.getMonth() + 1)
            .toString()
            .padStart(2, "0")}_${now.getFullYear()}_${now
            .getHours()
            .toString()
            .padStart(2, "0")}_${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}_${now.getSeconds().toString().padStart(2, "0")}`;
          const fileName = formattedDateTime + ".pdf";
          openPDFInNewTab(
            base64Content,
            "application/pdf",
            "ReportScreen_Settlement.pdf"
          );
          setIsGenPDF(false);
        });
    }, 1200);
  };

  console.log(settlementDetailStatus);

  return (
    <div
      ref={contentRef}
      style={{ width: "100%", padding: "20px", background: "#f5f5f5" }}
    >
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col">
            <h2 className="font-semibold text-xl text-black">
              {portfolioName}
            </h2>
            <p className={`text-BREAD_CRUMB text-sm mb-6 font-normal`}>
              {currentUGTGroup?.name} / Settlement Management / Settlement
              Confirmation /{portfolioName}
            </p>
          </div>

          <Card shadow="md" radius="lg" className="flex" padding="xl">
            <div className="flex justify-between">
              <div className="content-center">
                <div className="text-left flex gap-3 items-center">
                  <FaChevronCircleLeft
                    className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                    size="30"
                    onClick={() =>
                      navigate(WEB_URL.SETTLEMENT, {
                        state: {
                          id: state?.portfolioId,
                          name: state?.portfolioName,
                        },
                      })
                    }
                  />

                  <div>
                    <div className="text-xl font-bold ">
                      Settlement Confirmation
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-center">
                {/*<div className="flex items-center justify-content-end gap-4">
                  <div className="flex items-center text-sm">
                    <span>
                      Status :{" "}
                      <b>{approveStatus ? "Approved" : "Not Approved"}</b>
                    </span>
                  </div>
                </div>

                {approveStatus && (
                  <div className="mt-1 text-right">
                    <div className="text-xs text-slate-500 italic">
                      Approved{" "}
                      {dayjs(approveDate).format(
                        "dddd, D MMMM YYYY h:mm A [(GMT+7)]"
                      )}
                    </div>
                  </div>
                )}

                <div
                  className="flex items-center justify-content-end text-sm text-[#4D6A00] underline cursor-pointer"
                  onClick={() =>
                    navigate(WEB_URL.SETTLEMENT, {
                      state: {
                        id: portfolioId,
                        name: portfolioName,
                      },
                    })
                  }
                >
                  Go to Summary
                </div>*/}
                <Form layout="horizontal" size="large">
                  <div className="grid grid-cols-6 gap-4 items-center pt-2">
                    <div className="col-span-2 text-sm font-bold">
                      Settlement Period
                    </div>

                    <Form.Item className="col-span-2 pt-3">
                      <Select
                        size="large"
                        value={settlementYear}
                        onChange={(value) => handleChangeSettlementYear(value)}
                        showSearch
                      >
                        {yearListData?.yearList?.map((item, index) => (
                          <Select.Option
                            key={index}
                            value={item}
                            disabled={item > latestYearHasData}
                          >
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item className="col-span-2 pt-3">
                      <Select
                        size="large"
                        value={settlementMonth}
                        onChange={(value) => handleChangeSettlementMonth(value)}
                        showSearch
                        filterOption={(input, option) =>
                          (option.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {monthListData?.monthList?.map((item, index) => {
                          return (
                            <Select.Option
                              key={index}
                              value={MONTH_LIST[item - 1].month}
                              disabled={checkMonth(item)}
                            >
                              {MONTH_LIST[item - 1].name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
            <Divider className="mt-3" orientation="horizontal" size={"xs"} />

            <div className="mt-5  flex border-b-2 border-[#87BE334D]">
              <div
                className={
                  selectTab === "initial"
                    ? " w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center "
                    : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px] text-center border-none"
                }
              >
                <button
                  className={
                    selectTab === "initial"
                      ? "font-bold text-base"
                      : "text-[#949292] font-thin text-base"
                  }
                  onClick={() => selectTabSettlement("initial")}
                >
                  Initial
                </button>
              </div>
              <div
                className={
                  selectTab === "final"
                    ? "w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center ml-2 "
                    : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px]  text-center ml-2 border-none "
                }
              >
                <button
                  className={
                    selectTab === "final"
                      ? "font-bold text-base"
                      : "text-[#949292] font-thin text-base"
                  }
                  onClick={() => selectTabSettlement("final")}
                >
                  Final
                </button>
              </div>
              <div
                className={
                  selectTab === "history"
                    ? "w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center ml-2 "
                    : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px]  text-center ml-2 border-none "
                }
              >
                <button
                  className={
                    selectTab === "history"
                      ? "font-bold text-base"
                      : "text-[#949292] font-thin text-base"
                  }
                  onClick={() => selectTabSettlement("history")}
                >
                  History
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center my-2">
              {selectTab == "initial" ? (
                <>
                  {/*Initial Tabs*/}
                  <div className={
                        hideBtnInitial
                          ? `text-xl font-semibold text-[#4D6A00] mt-[30px]`
                          : `text-xl font-semibold text-[#4D6A00]`
                      }>
                    Monthly Settlement
                  </div>
                  {hideBtnInitial == false?<Form layout="horizontal" size="large">
                    <div className={`grid gap-4 pt-4 grid-cols-3`}>
                      {/*<Form.Item className="col-span-1"></Form.Item>*/}
                      {/*Select Year filter */}
                      <Form.Item className="col-span-1 col-start-1">
                        <Select
                          size="large"
                          value={selectOptionUtilityID}
                          onChange={(value) => handleChangeUtility(value)}
                        >
                          {listOptionUtility.map((item, index) => (
                            <Select.Option
                              key={index}
                              value={item.id}
                              //disabled={item > latestYearHasData}
                            >
                              {item.abbr}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {/*Select Unit Filter convert */}
                      <Form.Item className="col-span-1 col-start-2">
                        <Select
                          size="large"
                          value={overviewDataUnit}
                          variant="borderless"
                          onChange={(value) => handleChangeOverviewUnit(value)}
                          className={
                            /*`${!canViewSettlementDetail && "opacity-20"}`*/ ""
                          }
                        >
                          {CONVERT_UNIT?.map((item, index) => (
                            <Select.Option key={index} value={item.unit}>
                              {item.unit}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <SettlementMenu
                        labelBtn={"Export"}
                        actionList={[
                          {
                            icon: (
                              <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]" />
                            ),
                            label: "Contract Table",
                            onClick: exportTablePDf,
                            rightTxt: "(.pdf)",
                            hide: isDeviceOwner
                          },
                          {
                            icon: (
                              <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]" />
                            ),
                            label: "Screen",
                            onClick: exportScreenPDF,
                            rightTxt: "(.pdf)",
                            hide: false
                          },
                          {
                            icon: (
                              <FaRegFileExcel className="text-green-600 w-[20px] h-[20px]" />
                            ),
                            label: "Contract Table",
                            onClick: exportTableExcelInitial,
                            rightTxt: "(.xls)",
                            hide: isDeviceOwner
                          },
                          {
                            icon: (
                              <FaRegFileExcel className="text-green-600 w-[20px] h-[20px]" />
                            ),
                            label: "Screen Table",
                            onClick: exportScreenExcelInitial,
                            rightTxt: "(.xls)",
                            hide: false
                          },
                        ]}
                      />
                    </div>
                  </Form>:undefined}
                </>
              ) : selectTab == "final" ? (
                <>
                  {/*Final Tabs */}
                  <div className={
                        hideBtn
                          ? `text-xl font-semibold text-[#4D6A00] mt-[30px]`
                          : `text-xl font-semibold text-[#4D6A00]`
                      }>
                    Monthly Settlement
                  </div>
                  {hideBtn == false?<Form layout="horizontal" size="large">
                    <div
                      className={
                        isCanVerify
                          ? `grid gap-4 pt-4 grid-cols-4`
                          : `grid gap-4 pt-4 grid-cols-3`
                      }
                    >
                      {/*<Form.Item className="col-span-1"></Form.Item>*/}
                      {/*Select Year filter */}
                      <Form.Item className="col-span-1 col-start-1">
                        <Select
                          size="large"
                          value={selectOptionUtilityID}
                          onChange={(value) => handleChangeUtility(value)}
                        >
                          {listOptionUtility.map((item, index) => (
                            <Select.Option
                              key={index}
                              value={item.id}
                              //disabled={item > latestYearHasData}
                            >
                              {item.abbr}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {/*Select Unit Filter convert */}
                      <Form.Item className="col-span-1 col-start-2">
                        <Select
                          size="large"
                          value={overviewDataUnit}
                          variant="borderless"
                          onChange={(value) => handleChangeOverviewUnit(value)}
                          className={
                            /*`${!canViewSettlementDetail && "opacity-20"}`*/ ""
                          }
                        >
                          {CONVERT_UNIT?.map((item, index) => (
                            <Select.Option key={index} value={item.unit}>
                              {item.unit}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <SettlementMenu
                        labelBtn={"Export"}
                        actionList={[
                          {
                            icon: (
                              <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]" />
                            ),
                            label: "Contract Table",
                            onClick: exportTablePDfFinal,
                            rightTxt: "(.pdf)",
                            hide: isDeviceOwner
                          },
                          {
                            icon: (
                              <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]" />
                            ),
                            label: "Screen",
                            onClick: exportScreenPDF,
                            rightTxt: "(.pdf)",
                            hide: false
                          },
                          {
                            icon: (
                              <FaRegFileExcel className="text-green-600 w-[20px] h-[20px]" />
                            ),
                            label: "Contract Table",
                            onClick: exportTableExcelFinal,
                            rightTxt: "(.xls)",
                            hide: isDeviceOwner
                          },
                          {
                            icon: (
                              <FaRegFileExcel className="text-green-600 w-[20px] h-[20px]" />
                            ),
                            label: "Screen Table",
                            onClick: exportScreenExcelFinal,
                            rightTxt: "(.xls)",
                            hide: false
                          },
                        ]}
                      />

                      {isCanVerify && (
                        <SettlementMenu
                          labelBtn={"Manage"}
                          actionList={[
                            {
                              icon: (
                                <RiPencilFill className="w-[20px] h-[20px]" />
                              ),
                              label: "Request Edit",
                              onClick: requestEditAction,
                              hide: false
                            },
                            {
                              icon: <LuSearch className="w-[20px] h-[20px]" />,
                              label: "Verify",
                              onClick: verifyAction,
                              hide: false
                            },
                          ]}
                        />
                      )}
                    </div>
                  </Form>:undefined}
                </>
              ) : (
                <>
                  {/*History Log Tabs */}
                  <div className="text-xl font-semibold text-[#4D6A00]">
                    History Log
                  </div>
                  <Form layout="horizontal" size="large">
                    <div className={`grid gap-4 pt-4 grid-cols-3`}>
                      {/*<Form.Item className="col-span-1"></Form.Item>*/}
                      {/*Select Year filter */}
                      <Form.Item className="col-span-2 col-start-2">
                        <SearchBox
                          placeholder="Search"
                          onChange={(e) => {
                            setSearchHistory(e.target.value);
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </>
              )}
            </div>

            {selectTab == "initial" ? (
              <SettlementInfo
                ugtGroupId={ugtGroupId}
                portfolioId={portfolioId}
                portfolioName={portfolioName}
                unit={overviewDataUnit}
                convertUnit={convertUnit}
                showSeeDetailButton={true}
                showWaitApprove={false}
                settlementYear={settlementYear}
                settlementMonth={settlementMonth}
                utilityId={selectOptionUtilityID}
                selectTab={selectTab}
                isGenPDF={isGenPDF}
                status={settlementDetailStatus.status}
                hideBtn={setHideBtnInitial}
              />
            ) : selectTab == "final" ? (
              <SettlementInfoFinal
                ugtGroupId={ugtGroupId}
                portfolioId={portfolioId}
                portfolioName={portfolioName}
                unit={overviewDataUnit}
                convertUnit={convertUnit}
                showSeeDetailButton={true}
                showWaitApprove={false}
                settlementYear={settlementYear}
                settlementMonth={settlementMonth}
                utilityId={selectOptionUtilityID}
                selectTab={selectTab}
                isGenPDF={isGenPDF}
                status={settlementDetailStatus.status}
                hideBtn={setHideBtn}
              />
            ) : (
              <HistoryLogSettlement
                portfolioId={portfolioId}
                settlementYear={settlementYear}
                settlementMonth={settlementMonth}
                searchLog={searchHistory}
              />
            )}
          </Card>

          {/*<div className="flex flex-col items-center mt-5">
            <div className="flex items-center gap-5">
              <Button
                size="xl"
                className={`${
                  approveStatus ? "bg-[#CCD1D9]" : "bg-[#87BE33]"
                } text-white px-8`}
                onClick={() => setOpenModalConfirm(true)}
                disabled={approveStatus}
              >
                {approveStatus && <FaCheck />}
                <span className="pl-2">Approve{approveStatus && "d"}</span>
              </Button>
            </div>

            {approveStatus && (
              <div className="mt-4 text-right">
                <div className="text-xs text-slate-500 italic">
                  Approved{" "}
                  {dayjs(approveDate).format(
                    "dddd, D MMMM YYYY h:mm A [(GMT+7)]"
                  )}
                </div>
              </div>
            )}
          </div>*/}

          {hideBtn == false && selectTab == "final" && isGenPDF == false ? (
            settlementDetailStatus.status == "N" && isCanVerify == true ? (
              <div className="flex justify-between px-4 mt-4">
                <div>
                  <Button
                    size="md"
                    className="bg-[#EF4835] text-lg text-white px-3 mr-2 w-[200px]"
                    onClick={() => requestEditAction()}
                  >
                    Request Edit
                  </Button>
                </div>
                <div>
                  <Button
                    size="md"
                    className="bg-[#87BE33] text-lg text-white px-3 w-[200px]"
                    onClick={() => verifyAction()}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            ) : settlementDetailStatus.status == "E" ? undefined : (
              <Card
                id="approveInformation"
                shadow="md"
                radius="lg"
                className="flex w-full h-full mb-10 mt-4"
                padding="lg"
              >
                <div className="pt-2 flex items-center gap-4">
                  <div className="text-xl font-semibold text-[#4D6A00] ">
                    Confirmation Details
                  </div>
                  {approveDetail?.length == 0 && (
                    <div className="text-xl font-normal text-center text-secondary">
                      -- Awaiting for Confirmation --
                    </div>
                  )}
                </div>

                {approveDetail?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                    {approveDetail?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded shadow-md ${
                            item.approveStatus == "Y"
                              ? "bg-[#87BE3333]"
                              : item.approveStatus == "R"
                              ? "bg-[#EF483533]"
                              : "bg-[#FF8B0E33]"
                          }`}
                        >
                          <div>
                            <div className="flex flex-col gap-1 w-full">
                              <div className="text-left text-sm">
                                <b
                                  className={`${
                                    item.approveStatus === "Y"
                                      ? "text-[#2BA228]"
                                      : item.approveStatus === "R"
                                      ? "text-[#EF4835]"
                                      : "text-[#FF8B0E]"
                                  }`}
                                >
                                  {item.approveStatus === "Y"
                                    ? "Confirmed"
                                    : item.approveStatus === "R"
                                    ? "Rejected"
                                    : "Waiting for Confirmation"}
                                </b>
                              </div>
                              <div className="text-xs text-slate-700 italic text-left">
                                By <b>{item.approvedBy}</b>
                              </div>
                              <div className="text-xs text-slate-700 italic text-left">
                                {item.approveStatus == "Y" ||
                                item.approveStatus == "R" ? (
                                  <span>
                                    At{" "}
                                    {dayjs(item.approveDate).format(
                                      "dddd, D MMMM YYYY h:mm A [(GMT+7)]"
                                    )}
                                  </span>
                                ) : undefined}
                              </div>
                            </div>
                            {settlementDetailData.rejectStatus == false ||
                            settlementDetailData.rejectStatus == null
                              ? isUserCanApprove(item) && (
                                  <div className="w-full text-right">
                                    <Button
                                      size="sm"
                                      className="bg-[#EF4835] text-white px-3 mr-2"
                                      onClick={() => onClickReject()}
                                    >
                                      Reject
                                    </Button>

                                    <Button
                                      size="sm"
                                      className="bg-[#87BE33] text-white px-3"
                                      onClick={() => onClickApprove()}
                                    >
                                      Confirm
                                    </Button>
                                  </div>
                                )
                              : undefined}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {openModalConfirm && (
                  <ModalConfirm
                    onClickConfirmBtn={handleApprove}
                    onCloseModal={handleCloseModalConfirm}
                    title={"Are you sure?"}
                    content={"Do you confirm this approval ?"}
                  />
                )}

                {isShowPopupReject && (
                  <ModalConfirmRemarkSettlement
                    onClickConfirmBtn={handleReject}
                    onCloseModal={onCloseRejectPopup}
                    title={"Reject this Settlement?"}
                    content={
                      "Verified Settlement Details requires to be edited."
                    }
                    openCheckBox={false}
                    setRemark={RemarkReject}
                    sizeModal={"md"}
                    textButton="Reject"
                    buttonTypeColor={"danger"}
                  />
                )}

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

                    <div className="text-2xl font-bold text-center pt-2">
                      Settlement Approval Completed
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
                        onClick={() => {
                          setShowModalComplete(!showModalComplete);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </Modal>
              </Card>
            )
          ) : undefined}
        </div>
        {isShowModalSuccess && (
          <Modal
            opened={isShowModalSuccess}
            onClose={() => dispatch(clearSettlementFailRequest())}
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
                Settlement Approval Completed
              </div>
              <div className="flex gap-4">
                <Button
                  className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
                  onClick={() => {
                    dispatch(clearSettlementFailRequest());
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
        {isShowModalFail && (
          <ModalFail
            onClickOk={() => {
              dispatch(clearSettlementFailRequest());
            }}
            content={"Something went wrong. Please go back and try again."}
          />
        )}

        {popupConfirmRequestEdit && (
          <ModalConfirmRemarkSettlement
            onClickConfirmBtn={handleConfirmPopupRequestEdit}
            onCloseModal={handleClosePopupConfirmRequestEdit}
            title={"Request Edit this Settlement Details?"}
            content={"Settlement Details requires to be edited."}
            openCheckBox={false}
            setRemark={RemarkRequestEdit}
            sizeModal={"md"}
            buttonTypeColor="danger"
            textButton="Reject"
          />
        )}

        {popupConfirmVerify && (
          <ModalConfirmNew
            onClickConfirmBtn={handleConfirmPopupVerify}
            onCloseModal={hadleClosePopupConfirmVerify}
            title={"Verify this Settlement?"}
            content={"Would you like to verify this Settlement Details?"}
            textBtn={"Verify"}
          />
        )}
        {/*  {openModalConfirm && (
          <ModalConfirm
            onClickConfirmBtn={handleApprove}
            onCloseModal={handleCloseModalConfirm}
            title={"Are you sure?"}
            content={"Do you confirm this approval ?"}
          />
        )}

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

            <div className="text-2xl font-bold text-center pt-2">
              Settlement Approval Completed
            </div>
            <div className="flex gap-4">
              <Button
                className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
                onClick={() => setShowModalComplete(!showModalComplete)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>*/}
        <TemplatePDFExcel data={excelData} />
        <TemplatePDFExcelUGT2 data={excelData} />
      </div>
    </div>
  );
}

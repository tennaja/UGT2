import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Card, LoadingOverlay, Menu } from "@mantine/core";
import { PiHandWithdrawFill } from "react-icons/pi";
import Skeleton from "@mui/material/Skeleton";
import PdfTablePreview from '../Control/TemplatePdf';
import MySelect from "../Control/Select";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  FetchDeviceDropdrowList,
  FetchCountryList,
} from "../../Redux/Dropdrow/Action";
import egat from "../assets/default_device.png";
import Map from "../Map/Map";
import {
  FetchGetDeviceByID,
  WithdrawDevice,
  ReturnDevice,
  SubmitDevice,
  VerifingDevice,
  VerifiedDevice,
  clearModal,
  FetchDownloadFile,
  FetchDeleteFile,
  FetchSF02ByID,
  sendEmail,
  sendEmailByUserGroup
} from "../../Redux/Device/Action";
import StatusLabel from "../../Component/Control/StatusLabel";
import LoadPage from "../Control/LoadPage";
import { convertDateTimeToDisplayDate } from "../../Utils/DateTimeUtils";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModalReturnConfirm from "../Control/Modal/ModalReturn";
import { useForm, Controller } from "react-hook-form";
import { DEVICE_STATUS } from "../../Constants/Constants";
import * as WEB_URL from "../../Constants/WebURL";
import ModelFail from "../Control/Modal/ModalFail";
import UploadImg from "../Control/UploadImg";
import axios from "axios";
import UploadFile from "../Control/UploadFile";
import classNames from "classnames";
import { FaChevronCircleLeft, FaRegEdit } from "react-icons/fa";
import { LuChevronDown, LuSend } from "react-icons/lu";
import numeral from "numeral";
import ManageBtn from "../Control/ManageBtn";
import { end } from "@popperjs/core";
import { USER_GROUP_ID } from "../../Constants/Constants";
import { hideLoading, showLoading } from "../../Utils/Utils";
import ModalVerifyDone from "../Control/Modal/ModalDoneVerrify";
import PdfFormPreview from "../Control/TemplatePdf"
import ModalSignStep1 from "../Control/Modal/ModalSignstep1";
import ModalSignStep2 from "../Control/Modal/ModalSignstep2";
import ModalSignStep3 from "../Control/Modal/ModalSignstep3";
import ModalSubmitDone from "../Control/Modal/ModalDoneSubmit";
import PreviewPdf from "../Control/Previewsf02";
import ModalConfirmVerified from "../Control/Modal/ModalConfirmVerified";
import ModalConfirmSubmit from "../Control/Modal/ModalConfirmSubmit";



const InfoDevice = () => {
  //default location on map Thailand
  const defaultLocation = [13.736717, 100.523186];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const code = state?.code;
  const [assignPort, setAssignPort] = useState(""); // For Next Sprint
  const dropDrowList = useSelector((state) => state.dropdrow.dropDrowList);
  const [lat, setLat] = useState(defaultLocation[0]);
  const [lon, setLon] = useState(defaultLocation[1]);
  const [status, setStatus] = useState(null);
  const [displayCountry, setDisplayCountry] = useState("");
 
  const [isOpenConfirmReturnModal, setOpenConfirmReturnModal] = useState(false);
  const [modalConfirmReturnProps, setModalConfirmReturnProps] = useState(null);

  const [isOpenConfirmSubmitModal, setOpenConfirmSubmitModal] = useState(false);
  const [modalConfirmSubmitProps, setModalConfirmSubmitProps] = useState(null);
  const [isOpenConfirmVerifiedModal, setOpenConfirmVerifiedModal] = useState(false);
  const [modalConfirmVerifiedProps, setModalConfirmVerifiedProps] = useState(null);
  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false);
  const [opensubmitstep1,setOpenSubmitstep1] =useState(false);
  const [opensubmitstep2,setOpenSubmitstep2] =useState(false);
  const [opensubmitstep3,setOpenSubmitstep3] =useState(false);
  // const [test,setTest]= useState() 
  const test = useRef(null)
  const [modalConfirmProps, setModalConfirmProps] = useState(null);
  const deviceobj = useSelector((state) => state.device.deviceobj);
  const sf02obj = useSelector((state) => state.device.sf02obj);
  const filesf02 = useSelector((state)=> state.device.filesf02) 
  const userData = useSelector((state) => state.login?.userobj);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const isOpenDoneModal = useSelector((state) => state.device.isOpenDoneModal);
  const isOpenFailModal = useSelector((state) => state.device.isOpenFailModal);
  const countryList = useSelector((state) => state.dropdrow.countryList);
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [remarktext,setRemarktext] = useState("")
  
  const handleClickBackToHome = () => {
    dispatch(clearModal());
    navigate(WEB_URL.DEVICE_LIST);
  };
  const Datenow = new Date();
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  console.log(sf02obj)
  console.log(userData)
  console.log("Dispatching PDF File...",filesf02)
  console.log(deviceobj)
  const base64String = deviceobj?.imagePath;
  useEffect(() => {
    // This effect will run whenever filesf02 changes
    if (filesf02) {
      test.current = filesf02
      // setTest(filesf02)
      console.log('filesf02 has changed:', test.current);
      // Perform any side effect here, like an API call or state update
    }
  }, [filesf02]); 
  // filesf02 is the dependency for this useEffect
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const today = Date.now();
  console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(today));
  // ModelController;
  const fileMock = [
    {
      fileName: "test-file-1.png",
      fileExtension: "png",
    },
    {
      fileName: "test-file-2.jpg",
      fileExtension: "jpg",
    },
  ];
  useEffect(() => {
    setIsOpenLoading(true);
    showLoading();
    dispatch(FetchDeviceDropdrowList());
    dispatch(FetchCountryList());
    dispatch(
      FetchGetDeviceByID(code, (res, err) => {
        setIsOpenLoading(false);
        hideLoading();
      })
    );

    autoScroll();
  }, []);

 useEffect(() =>{
  dispatch(
    FetchSF02ByID(code, (res, err) => {
    })
  );
 },[]) 

  useEffect(() => {
    if (deviceobj) {
      setLat(deviceobj?.latitude);
      setLon(deviceobj?.longitude);
      setStatus(deviceobj?.statusName);
    }
  }, [deviceobj]);

  useEffect(() => {
    const country = countryList.filter(
      (item) => item?.alpha2 == deviceobj?.countryCode
    );
    if (country?.length > 0) {
      setDisplayCountry(country[0]?.name);
    }
  }, [countryList, deviceobj]);

  const autoScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Use smooth scrolling behavior if supported
    });
  };

  const renderAddress = (detail) => {
    const address = detail?.address;
    const subdistrictName = detail?.subdistrictName;
    const districtName = detail?.districtName;
    const proviceName = detail?.provinceName;
    const postcode = detail?.postcode;
    let _address = "";

    if (
      !address &&
      !subdistrictName &&
      !districtName &&
      !proviceName &&
      !postcode
    ) {
      _address = "";
    } else {
      _address =
        address +
        " , " +
        subdistrictName +
        " , " +
        districtName +
        " , " +
        proviceName +
        " , " +
        postcode;
    }
    return renderData(_address);
  };

  const onClickEdit = () => {
    navigate(`${WEB_URL.DEVICE_EDIT}`, { state: { code: deviceobj?.id } });
  };

  // ------------------Submit & Withdraw Function------------------------------ //

  const onclickclosesubmitstep1 =()=>{
    setOpenSubmitstep1(false)
  }
  const onclickclosesubmitstep2 =()=>{
    setOpenSubmitstep1(true)
    setOpenSubmitstep2(false)
  }
  const onclickclosesubmitstep3 =()=>{
    setOpenSubmitstep2(true)
    setOpenSubmitstep3(false)
  }
  const onclicksubmitstep1 =() => {
    setOpenSubmitstep1(true)
  }
  const onclicksubmitstep2 =() => {
    setOpenSubmitstep2(true)
    setOpenSubmitstep1(false)
    setOpenSubmitstep3(false)
  }
  const onclicksubmitstep3 =() => {
    setOpenSubmitstep3(true)
    setOpenSubmitstep2(false)
    setOpenSubmitstep1(false)
  }

  const onClickSubmitBtn = () => {
    setOpenConfirmSubmitModal(true);
    setModalConfirmSubmitProps({
      onCloseModal: handleCloseModalConfirm,
      onClickConfirmBtn: handleClickConfirmSubmit,
      title: "Are you sure?",
      content:
        "If you confirm , this device will be submitted to review by EVIDENT, you will no longer be able to modify it.",
      buttonTypeColor: "primary",
      data : deviceobj,
      UserSign : userData
    });
  };

  
  const onClickReturnBtn = () => {
    setOpenConfirmReturnModal(true);
    setModalConfirmReturnProps({
      onCloseModal: handleCloseModalConfirm,
      onClickConfirmBtn: handleClickConfirmReturn,
      title: "Return to Device Owner?",
      content:
        "Device Registration requires to be edited.Would you like to return to Device Owner?",
      buttonTypeColor: "primary",
      
    });
  };
//---------------------------------------------------------------------
  const onClickSendtoVerifyBtn = () => {
    setOpenConfirmModal(true);
    setModalConfirmProps({
      onCloseModal: handleCloseModalConfirm,
      onClickConfirmBtn: handleClickConfirmVerifying,
      title: "Send to Verify?",
      content:
        "Would you like to send this device to verify?",
      buttonTypeColor: "primary",
    });
  };

  const onClickVerifiedBtn = () => {
    setOpenConfirmVerifiedModal(true);
    setModalConfirmVerifiedProps({
      onCloseModal: handleCloseModalConfirm,
      onClickConfirmBtn: handleClickConfirmVerified,
      title: "Verify this Device?",
      content:
        "Would you like to verify this device? Verified device will be sent to sign and unable to recall.",
      buttonTypeColor: "primary",
      data : deviceobj,
      UserSign : userData   
    });
  };

  const emailBodytoOwner = `
  <html>
    <body>
      <p>Dear UGT Registrant (Verifier),</p>
      
      <p>
      Device registration is
        <b><span style="color: red;"> has been edited.</span></b>
      </p>
      
      <p>Device Details:</p>
       
      <p>
      <b>Name:</b> ${deviceobj?.name}
      </p>
      <p>
        <b>Submission Date:</b> ${formatDate(Datenow)} 
      </p>
      
      <p>Please sign via this link: <a href="${`https://ugt-2.vercel.app/`}">Sign Here</a>.</p>
      
      <p>UGT Platform</p>
    </body>
  </html>
`;
  const emailBodytoVerifier = `
  <html>
    <body>
      <p>Dear UGT Registrant (Verifier),</p>
      
      <p>
      Device registration is
        <b><span style="color: red;"> Send to Verify.</span></b>
      </p>
      
      <p>Device Details:</p>
       
      <p>
      <b>Name:</b> ${deviceobj?.name}
      </p>
      <p>
        <b>Submission Date:</b> ${formatDate(Datenow)} 
      </p>
      
      <p>Please sign via this link: <a href="${`https://ugt-2.vercel.app/`}">Sign Here</a>.</p>
      
      <p>UGT Platform</p>
    </body>
  </html>
`;

  const emailBodytoSignatory = `
  <html>
    <body>
      <p>Dear UGT Registrant (Signatory),</p>
      
      <p>
      Device registration is
        <b><span style="color: red;"> waiting for signature and submission.</span></b>
      </p>
      
      <p><b>Device Details:</b></p>
      
      <p>
      <b>Name:</b> ${deviceobj?.name}
      </p>
      <p>
        <b>Submission Date:</b> ${formatDate(Datenow)} 
      </p>
      
      <p>Please sign via this link: <a href="${`https://ugt-2.vercel.app/`}">Sign Here</a>.</p>
      
      <p>UGT Platform</p>
    </body>
  </html>
`;







const handleClickDownloadFile = async (item) => {
    console.log(item)
    try {
      // setIsOpenLoading(true);
      showLoading();
      const fileID = item?.evidentFileID;
      const fileName = item?.name;
      const requestParameter = {
        fileID: fileID,
        fileName: fileName,
      };
      const response = await FetchDownloadFile(requestParameter);
      console.log(response)
      const blob = new Blob([response.res.data], {
        type: response.res.headers["content-type"],
      });
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
    // setIsOpenLoading(false);
    hideLoading();
  };


  const handleClickPreviewFile = async (item) => {
    console.log(item)
    try {
      // setIsOpenLoading(true);
      showLoading();
      const fileID = item?.evidentFileID;
      const fileName = item?.name;
      const requestParameter = {
        fileID: fileID,
        fileName: fileName,
      };
      const response = await FetchDownloadFile(requestParameter);
      console.log(response)
      const blob = new Blob([response.res.data], {
        type: response.res.headers["content-type"],
      });
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error Preview file:", error);
    }
    // setIsOpenLoading(false);
    hideLoading();
  };

  

  const handleClickDeleteFile = async (id, evidentFileID, fileName) => {
    console.log("----DELETE FILE---");

    console.log("test id====>", id);
    console.log("evidentFileID====>", evidentFileID);
    console.log("fileName", fileName);
    const requestParameter = {
      fileId: evidentFileID,
      name: fileName,
    };
    const result = await FetchDeleteFile(requestParameter);
    console.log("result", result);
  };


  const onClickWithdrawBtn = () => {
    setOpenConfirmModal(true);
    setModalConfirmProps({
      onCloseModal: handleCloseModalConfirm,
      onClickConfirmBtn: handleClickConfirmWithdraw,
      title: "Withdraw this Device?",
      content: " Would you like to withdraw this device? Device will be permanently deleted.",
      buttonTypeColor: "danger",
    });
  };

  const handleCloseModalConfirm = () => {
    setOpenConfirmSubmitModal(false)
    setOpenConfirmVerifiedModal(false)
    setOpenConfirmModal(false);
    setOpenConfirmReturnModal(false);
  };

  //Call Api Submit
  const handleClickConfirmSubmit = () => {
    showLoading();
    const deviceID = deviceobj?.id;
    const username = userData?.firstName;
    const SignatureDateTime = Date();
    const organisationId = "1";
    const organisationName = "OrgName101";
    const contactPerson = "Contact101";
    const businessAddress = "Addr101";
    const country = "Thai";
    const email = userData?.email;
    const telephone = "0999999999";
    dispatch(
      SubmitDevice(deviceID,username,SignatureDateTime,organisationId,
        organisationName,contactPerson,businessAddress,country,email,telephone,test.current,
        (error) => {
        if (error) {
          setOpenConfirmSubmitModal(false);
        } else {
          dispatch(clearModal());
          navigate(WEB_URL.DEVICE_LIST);
        }
        hideLoading();
        setOpenConfirmSubmitModal(false);
      })
    );
  };

  //Call Api Withdraw
  const handleClickConfirmWithdraw = () => {
    showLoading();
    const deviceID = deviceobj?.id;
    dispatch(
      WithdrawDevice(deviceID, () => {
        hideLoading();
        dispatch(clearModal());
        navigate(WEB_URL.DEVICE_LIST);
      })
    );
  };

  //Call Api Verifying
  const handleClickConfirmVerifying = () => {
    showLoading();
    const deviceID = deviceobj?.id;
    dispatch(
      VerifingDevice(deviceID, () => {
        hideLoading();
        dispatch(clearModal());
        navigate(WEB_URL.DEVICE_LIST);
      })
    );
    dispatch (
      sendEmailByUserGroup(21,emailBodytoVerifier,() => {
        hideLoading();
        // dispatch(clearModal());
      })
    )
  };

  //Call Api Verified
  const handleClickConfirmVerified = () => {
    showLoading();
    const deviceID = deviceobj?.id;
    // console.log("FILE CURRENT-------",test.current)
    dispatch(
      VerifiedDevice(deviceID, test.current,() => {
        hideLoading();
        // dispatch(clearModal());
      })
    )
    dispatch (
      sendEmailByUserGroup(22,emailBodytoSignatory,() => {
        hideLoading();
        // dispatch(clearModal());
      })
    )
  };


  //Call Api Return
  const handleClickConfirmReturn = (rem) => {
    showLoading();
    const deviceID = deviceobj?.id;
    const remark = rem;
    const username = userData.firstName +" "+userData.lastName;
    dispatch(
      ReturnDevice(deviceID,remark,username,() => {
        hideLoading();
        dispatch(clearModal());
        navigate(WEB_URL.DEVICE_LIST);
      })
    );
  };
  


  const renderData = (value) => {
    let data = "-";
    if (value) {
      data = value;
    }

    return isOpenLoading ? <Skeleton animation="wave" width={200} /> : data;
  };

  const checkCanEdit = () => {
    let isEdit = false;
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (
      userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
    ) {
      // other role can only view
      if (
        status !== DEVICE_STATUS.SUBMITTED.toLowerCase() &&
        status !== DEVICE_STATUS.IN_PROGRESS.toLowerCase() &&
        status !== DEVICE_STATUS.WITHDRAWN.toLowerCase() &&
        status !== DEVICE_STATUS.APPROVED.toLowerCase() && 
        status !== DEVICE_STATUS.VERIFYING.toLowerCase() && 
        status !== DEVICE_STATUS.VERIFIED.toLowerCase()
      ) {
        isEdit = true;
      }   
    }

    return isEdit;
  };

  const checkCanSubmit = () => {
    let isSubmit = false;
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
    ) {
      if (
        status == DEVICE_STATUS.VERIFIED.toLowerCase()
      ) {
        isSubmit = true;
      } else {
        isSubmit = false;
      }
    }

    return isSubmit;
  };

  

  const checkCanWithdrawn = () => {
    let isWithdraw = false;
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (
      userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
    ) {
      if (
        status == DEVICE_STATUS.DRAFT.toLowerCase() ||
        status == DEVICE_STATUS.REJECTED.toLowerCase() ||
        status == DEVICE_STATUS.VERIFYING.toLowerCase() ||
        status == DEVICE_STATUS.VERIFIED.toLowerCase()
      ) {
        isWithdraw = true;
      } else {
        isWithdraw = false;
      }
    }

    return isWithdraw;
  };
  const checkCanVerifying = () => {
    let isVerifying = false;
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (
      userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER 
    ) {
      if (
        status == DEVICE_STATUS.DRAFT.toLowerCase() 
      ) {
        isVerifying = true;
      } else {
        isVerifying = false;
      }
    }

    return isVerifying;
  };
  const checkCanVerified = () => {
    let isVerified = false;
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
    ) {
      if (
        status == DEVICE_STATUS.VERIFYING.toLowerCase() 
      ) {
        isVerified = true;
      } else {
        isVerified = false;
      }
    }

    return isVerified;
  };

  const checkCanReturn = () => {
    let isReturn = false;
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
    ) {
      if (
        status == DEVICE_STATUS.VERIFYING.toLowerCase() ||
        status == DEVICE_STATUS.VERIFIED.toLowerCase()
      ) {
        isReturn = true;
      } else {
        isReturn = false;
      }
    }

    return isReturn;
  };


  const checkCanSeeSF02 = () => {
    let isSeeSF02 = false;
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
    ) {
      if (
        status == DEVICE_STATUS.SUBMITTED.toLowerCase() ||
        status == DEVICE_STATUS.VERIFIED.toLowerCase()
      ) {
        isSeeSF02 = true;
      } else {
        isSeeSF02 = false;
      }
    }

    return isSeeSF02;
  };
  const checkShowManageBtn = () => {
    if (canEdit || canSubmit || canWithdrawn) {
      return true;
    } else {
      return false;
    }
  };
  const infoMessage = () => {
    let message = "";
    const status = (deviceobj?.statusName ?? "").toLowerCase();

    if (status === DEVICE_STATUS.APPROVED.toLowerCase()) {
      message = `The device is already approved.
      To make any changes, please contact Issuer.`;
    } else if (
      status === DEVICE_STATUS.SUBMITTED.toLowerCase() ||
      status === DEVICE_STATUS.IN_PROGRESS.toLowerCase()
    ) {
      message = "The device is now in the review process (in progress).";
    }
    return message;
  };

  const canEdit = checkCanEdit();
  const canSubmit = checkCanSubmit();
  const canWithdrawn = checkCanWithdrawn();
  const canVerifying = checkCanVerifying();
  const canVerified = checkCanVerified()
  const canReturn = checkCanReturn();
  const canSeeSF02 = checkCanSeeSF02();
  const isShowManageBtn = checkShowManageBtn();

  // console.log("canEdit", canEdit);
  // console.log("canSubmit", canSubmit);
  // console.log("canWithdrawn", canWithdrawn);
  return (
    <div className="relative">
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto ">
          <div className="text-left flex flex-col gap-3">
            <div className="grid gap-4 gap-y-2 grid-cols-1 md:grid-cols-6 ">
              <div className="md:col-span-3">
                <h2 className="font-semibold text-xl text-black truncate">
                  {deviceobj?.name}
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / Device Management / Device Info /{" "}
                  <span className="truncate">{deviceobj?.name}</span>
                </p>
              </div>

              {/*   {isEdit && (
                <div className="flex justify-end items-center md:col-span-3">
                  <div className="mr-2">
                    <span className="text-[#0b0b0b] mb-11">
                      Assign to Portfolio (Optional)
                    </span>
                  </div>
                  <div className="w-2/4">
                    <form className="w-full">
                      <Controller
                        name="assignPort"
                        control={control}
                        render={({ field }) => (
                          <MySelect
                            {...field}
                            options={dropDrowList.assignedUtility}
                            displayProp={"name"}
                            valueProp={"abbr"}
                            onChangeInput={(val) => setAssignPort(val)}
                          />
                        )}
                      />
                    </form>
                  </div>
                </div>
              )} */}
            </div>

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="0"
            >
              <div className="p-4">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                    <div
                      id="top-div"
                      className="md:col-span-3  lg:col-span-4 flex items-center gap-3"
                    >
                      <FaChevronCircleLeft
                        className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                        size="30"
                        onClick={() => navigate(WEB_URL.DEVICE_LIST)}
                      />
                      <span className="text-xl mr-14 leading-tight">
                        <b> Device Info</b>
                      </span>
                      {/* <span>
                        {StatusLabel(deviceobj?.statusName)}
                      </span> */}
                    </div>

                    {/* Button Section */}

                    <div className="md:col-span-6 lg:col-span-2 text-right grid items-end">
                      <div className="flex justify-end gap-3">
                        
                         {/* <PdfTablePreview data={deviceobj}/> */}
                         {canSeeSF02 ? <PreviewPdf data={sf02obj}/> : null}
                         
                        {isShowManageBtn && (
                          <ManageBtn
                            actionList={[
                              {
                                // icon: <LuSend />,
                                label: "Submit",
                                onClick: onClickSubmitBtn,
                                disabled: !canSubmit,
                                endSection: true,
                              },
                              {
                                // icon: <FaRegEdit />,
                                label: "Edit",
                                onClick: onClickEdit,
                                disabled: !canEdit,
                                endSection: true,
                              },
                              {
                                // icon: <PiHandWithdrawFill />,
                                label: "Withdraw",
                                onClick: onClickWithdrawBtn,
                                disabled: !canWithdrawn,
                                endSection: true,
                              },
                              {
                                // icon: <PiHandWithdrawFill />,
                                label: "Return",
                                onClick: onClickReturnBtn,
                                disabled: !canReturn,
                                endSection: true,
                              },
                              {
                                label : "Send to Verify",
                                onClick : onClickSendtoVerifyBtn,
                                disabled : !canVerifying,
                                endSection: true,
                              },
                              {
                                label : "Verify",
                                onClick : onClickVerifiedBtn,
                                disabled : !canVerified,
                                
                              }
                            ]}
                          />
                        )}
                        {infoMessage() && (
                          <div className="text-xs text-gray-500 ">
                            {infoMessage()}
                          </div>
                        )}
                        
                        
                      </div>
                    </div>

                    {/* Button Section */}
                  </div>
                </div>
              </div>

              <div className="p-0 px-0 md:p-0 mb-0 border-1 align-top" />

              <div className="p-6 px-8 md:p-8 mb-6 ">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    {/* Device Detail */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Production Device Details</b>
                            </h6>
                          </div>
                          {}
                          <img src={base64String} alt="Preview_Img" id="preview_img" className="h-44 w-44 object-cover rounded-full flex items-center justify-center rounded-[20px] mt-4"/>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Device Name
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(deviceobj?.name)}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                Status
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  <StatusLabel
                                    status={deviceobj?.statusName}
                                    type="xs" 
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Assigned Utility
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(deviceobj?.assignedUtilityName)}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                Issuer Organization
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(deviceobj?.issuerName)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Default account code
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(deviceobj?.defaultAccountCode)}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                PPA No.
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(deviceobj?.ppaNo)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                {"Device" + "'" + "s owner / shareholder"}
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(deviceobj?.deviceOwner)}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Device Code
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(deviceobj?.deviceEvidentCode)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Device name by SO
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.deviceNameBySO)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Detail */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Technical Information</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                {"Device Fuel"}
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.deviceFuelName)}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                {"Device Technology"}
                              </label>

                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.deviceTechnologyName)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                {"Capacity (MW)"}
                              </label>

                              <div className="break-words	font-bold	">
                                {renderData(
                                  numeral(deviceobj?.capacity).format(
                                    "0,0.000000"
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                {"Commissioning Date"}
                              </label>

                              <div className="font-bold">
                                {renderData(
                                  deviceobj?.commissioningDate
                                    ? convertDateTimeToDisplayDate(
                                        deviceobj?.commissioningDate,
                                        "d MMMM yyyy"
                                      )
                                    : "-"
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                {"Requested Effective Registration Date"}
                              </label>

                              <div className="font-bold">
                                {renderData(
                                  deviceobj?.registrationDate
                                    ? convertDateTimeToDisplayDate(
                                        deviceobj?.registrationDate,
                                        "d MMMM yyyy"
                                      )
                                    : "-"
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                {"Other Labelling Scheme"}
                              </label>
                              <div className="font-bold">
                                {renderData(
                                  deviceobj?.otherLabellingSchemeName
                                    ? deviceobj?.otherLabellingSchemeName
                                    : "-"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Location Information</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Address
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(renderAddress(deviceobj))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                District
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.districtName)}
                              </div>
                            </div>
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subdistrict
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.subdistrictName)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                State/Province
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.provinceName)}
                              </div>
                            </div>
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Country
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(displayCountry)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Postcode
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.postcode)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Latitude
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.latitude)}
                              </div>
                            </div>
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Longitude
                              </label>
                              <div className="break-words	font-bold	">
                                {renderData(deviceobj?.longitude)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 mb-3">
                            <div className="flex justify-center w-full h-[450px] justify-items-center">
                              <Map
                                zoom={17}
                                locationList={[
                                  {
                                    lat: lat ? parseFloat(lat) : 0,
                                    lng: lon ? parseFloat(lon) : 0,
                                  },
                                ]}
                                className={
                                  "w-full h-[450px] justify-items-center"
                                }
                                isGotoLatLon
                              ></Map>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/*Documents Information Attachments */}
                    <div className="md:col-span-6 ">
                      <h6 className="text-PRIMARY_TEXT">
                        <b>Documents Information Attachments</b>
                      </h6>
                    </div>

                    {/* <div className="md:col-span-6 lg:col-span-3">
                      {deviceobj?.fileUploads?.length > 0
                        ? deviceobj?.fileUploads?.map((item) => {
                            return (
                              <div>
                                <div className="flex items-center justify-center p-2 ">
                                  <div className="mr-4">
                                    <img
                                      src={getIcon(item?.name)}
                                      width={50}
                                      height={50}
                                    ></img>
                                  </div>
                                  <div className="">
                                    <div className="flex justify-between w-full">
                                      <div>
                                        <label onClick={()=>{
                                          handleClickDownloadFile(item)
                                        }} className="text-sm text-[#6b6b6c] font-semibold">
                                          {item?.name}
                                        </label>
                                      </div>
                                      <div className="mr-8"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        : "-"}
                    </div> */}

                    <div className="md:col-span-3">
                      <Controller
                        name="uploadFile"
                        control={control}
                        rules={{
                          required: "This field is required",
                        }}
                        render={({ field }) => (
                          <UploadFile
                            {...field}
                            id={"uploadFile"}
                            type={"file"}
                            multiple
                            label={"File upload"}
                            isViewMode
                            onClickFile={(item) => {
                              handleClickDownloadFile(item);
                            }}
                            onDeleteFile={(id, evidentFileID, fileName) => {
                                handleClickDeleteFile(
                                  id,
                                  evidentFileID,
                                  fileName
                                );
                              }}
                              onPreview ={(item)=>{
                                handleClickPreviewFile(item)
                              }}
                            error={errors.uploadFile}
                            defaultValue={deviceobj?.fileUploads}

                            
                            // ... other props
                          />
                        )}
                      />
                      
                    </div>

                    <div className="md:col-span-2">
                      <div>
                        <label className="mt-3 text-[#6B7280] text-xs ">
                          {"Note"}
                        </label>
                      </div>
                      <div>
                        <span>
                          <b>{renderData(deviceobj?.notes)}</b>
                        </span>
                      </div>
                    </div>
                    
                  </div>
                </div>
                 {deviceobj?.deviceReturnLogs?.length === 0 ? null : 
                 <div className="pt-2 pb-2 mt-4 border-l-0 border-r-0 border-t-2 border-b-2 border-x-gray-50 border-y-gray-200">
                 {deviceobj?.deviceReturnLogs?.map ((item) => 
                 
                 <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4 mb-4 border border-gray-500">
                 <div className="flex justify-between items-center mb-2 border-b-2 border-x-gray-50 border-y-gray-200">
                   <h2 className="font-semibold text-lg ">Remark - {item.order}</h2>
                   <div className="text-sm text-gray-500">
                     Date: {item.createDate}
                   </div>
                 </div>
                 <p className="text-gray-700 mb-4  pt-2 pb-2">{item.remark}</p>
                 <div className="text-right text-sm text-gray-600">
                   <em>By {item.createBy}</em>
                 </div>
               </div>)}
               </div>
                 }
                
              
             <div className="flex justify-between">
             <div className="flex flex-col">
                    {canReturn ? <button onClick={onClickReturnBtn} className="w-64 mt-5 rounded h-12 px-6 text-white transition-colors duration-150 bg-red-600 rounded-lg focus:shadow-outline hover:bg-indigo-[#4ed813d1]" >
                            <b></b>Return
                    </button> : null}
                    </div>
                    <div className="flex flex-col gap-2 pb-2 mt-5">
                    
                    {canSubmit ? <button onClick={onclicksubmitstep1} className="w-64 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-indigo-[#4ed813d1]" >
                            <b></b>Sign & Submit
                    </button> : null }
                    
                    {canVerifying ? <button onClick={onClickSendtoVerifyBtn} className="w-64 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-indigo-[#4ed813d1]" >
                            <b></b>Send to Verify
                    </button> : null }
                    
                    {canVerified ? <button onClick={onClickVerifiedBtn} className="w-64 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-indigo-[#4ed813d1]" >
                            <b></b> Verify
                    </button>
                     : null}
                  
              </div></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {opensubmitstep1 && <ModalSignStep1
      onCloseModal={onclickclosesubmitstep1}
      onClickConfirmBtn={onclicksubmitstep2}
      />}
      
      {opensubmitstep2 && <ModalSignStep2
      onCloseModal={onclickclosesubmitstep2}
      onClickConfirmBtn={onclicksubmitstep3}
      />}
      
      {opensubmitstep3 && <ModalSignStep3
      onCloseModal={onclickclosesubmitstep3}
      onClickConfirmBtn={onClickSubmitBtn}
      />}
      {/* <ModalSubmitDone/> */}
      {isOpenDoneModal && (
        <ModalVerifyDone
          File={sf02obj}
          onChangeModalDone={handleClickBackToHome}
        />
      )}
      {isOpenConfirmModal && <ModalConfirm {...modalConfirmProps} />}
      {isOpenConfirmSubmitModal && <ModalConfirmSubmit {...modalConfirmSubmitProps} />}
      {isOpenConfirmVerifiedModal && <ModalConfirmVerified {...modalConfirmVerifiedProps} />}
      {isOpenConfirmReturnModal && <ModalReturnConfirm {...modalConfirmReturnProps} />}
      
      
      {isOpenFailModal && (
        <ModelFail
          onClickOk={() => {
            dispatch(clearModal());
          }}
        />
      )}

      {/* {isOpenLoading && <LoadPage></LoadPage>} */}
    </div>
  );
};

export default InfoDevice;

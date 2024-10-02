import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { convertDateTimeToDisplayDate } from "../../Utils/DateTimeUtils";
import { useForm, Controller } from "react-hook-form";
import { Button, Card, Menu } from "@mantine/core";
import * as WEB_URL from "../../Constants/WebURL";
import { USER_GROUP_ID } from "../../Constants/Constants";
import StatusLabel from "../../Component/Control/StatusLabel";
import { SubscriberInfo,FunctionwithDrawSubscriber,clearModal,SubscriberRenewInfo } from "../../Redux/Subscriber/Action";
import LoadPage from "../Control/LoadPage";
import Skeleton from "@mui/material/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Row from "./components/TableRow";
import { FaChevronCircleLeft, FaRegEdit } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
import numeral from "numeral";
import ManageBtn from "../Control/ManageBtn";
import { hideLoading, showLoading } from "../../Utils/Utils";
import CollapsInfo from "./CollapsInfo";

import { RiEyeLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";

import FileInfo from "./FileInfo";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { MdOutlineHistory } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModalConfirmCheckBox from "./ModalConfirmCheckBox";
import ModalCompleteSubscriber from "./ModalCompleteSubscriber";
import ModalFail from "../Control/Modal/ModalFail";
import { message } from "antd";
import ModalConfirmWithdrawn from "./ModalConfirmWithDrawn";
import ModalCompleteSubscriberButton from "./ModalCompleteSubscriberButton";
import { ImLoop } from "react-icons/im";
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";

const InfoSubscriber = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const [isEdit, setIsEdit] = useState(false);
  const details = useSelector((state) => state.subscriber.detailInfoList);
  const detailsRenew = useSelector((state) => state.subscriber.renewDetailInfo)
  const [sumAllocateEnergy, setSumAllocateEnergy] = useState(0);
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [isOpenConfirmDel,setIsOpenConfirmDel] = useState(false)
  const isError = useSelector((state)=>state.subscriber.isOpenFailModal)
  const errorMessage = useSelector((state)=>state.subscriber.errmessage)
  const isOpen = useSelector((state)=>state.subscriber.isOpen)
  const [showRenew,setShowRenew] = useState(false)
  const [tabSelect,setTabSelect] = useState("contract")

  
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN
      ) {
        setIsEdit(true);
      }
    }
  }, [currentUGTGroup, userData]);

  useEffect(() => {
    setIsOpenLoading(true);
    setShowRenew(false)
    showLoading();
    dispatch(
      SubscriberInfo(state?.id,0, () => {
        setIsOpenLoading(false);
        hideLoading();
      })
    );
  }, []);

  useEffect(() => {
    if (details) {
      let tempSum = 0;
      for (let i = 0; i < details?.allocateEnergyAmount?.length; i++) {
        tempSum += details?.allocateEnergyAmount[i]?.totalAmount;
      }
      setSumAllocateEnergy(tempSum);
      if(details?.subscriberDetail?.hadRenew === true){
        //console.log("Show Renew")
        showLoading()
        dispatch(SubscriberRenewInfo(state?.id,()=>{
          hideLoading()
        }))
        setShowRenew(true)
      }
      else{
        setShowRenew(false)
      }
    }
  }, [details]);

  useEffect(() => {
    autoScroll();
  }, []);

  const autoScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const onClickEdit = () => {
    console.log(state)
    navigate(`${WEB_URL.SUBSCRIBER_EDIT}`, { state: { code: state?.id ,contract: state?.contract } });
  };
  const onClickRenew = () => {
    console.log(state)
    navigate(`${WEB_URL.SUBSCRIBER_RENEW}`, { state: { code: state?.id ,contract: state?.contract } });
  };

  const onClickHistory = () => {
    console.log(state)
    navigate(`${WEB_URL.SUBSCRIBER_HISTORY}`, { state: { code: state?.id ,contract: state?.contract } });
  };

  const renderData = (value) => {
    let data = "-";
    if (value) {
      data = value;
    }

    return isOpenLoading ? <Skeleton animation="wave" width={200} /> : data;
  };

  const renderAddress = (detail) => {
    const address = detail?.address;
    const subdistrictName = detail?.subdistrictName;
    const districtName = detail?.districtName;
    const proviceName = detail?.provinceName;
    const postcode = detail?.postCode;
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

  const getDate =(Date)=>{
    
    const dateToText = Date.toString()
    const date = dateToText.split("T")[0]
    const dateSplit = date.split("-")
    const year = dateSplit[0]
    const month = dateSplit[1]
    const day = dateSplit[2]
     
    return day+"-"+month+"-"+year
    
  }

  const getTime=(Date)=>{
    
   // console.log(Date)
    const dateToText = Date.toString()
    const time = dateToText.split("T")[1]
    const timeFull = time.split(".")[0]
    return timeFull
  }

  function downloadZip(filesData, outputZipFilename) {
    const zip = new JSZip();
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
    const zipfilename = "Download_All_"+formattedDateTime
  
    // Add each file to the ZIP
    filesData.forEach(file => {
      const { name, binary } = file;
      
      // Decode the Base64 string and convert it to binary data
      const binaryData = atob(binary);
      const arrayBuffer = new Uint8Array(binaryData.length);
      
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
  
      // Add the binary data as a file to the ZIP
      zip.file(name, arrayBuffer);
    });
  
    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, zipfilename);
    });
  }

  function downloadAllFileAggregate(outputZipFilename) {
    const zip = new JSZip();
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
    const zipfilename = "Download_All_"+formattedDateTime
    const PDFFile = details?.subscribersFilePdf
    const ExcelFile = details?.subscribersFileXls
    const FileBinary = []
    FileBinary.push(PDFFile[0]);
    FileBinary.push(ExcelFile[0])
    console.log(FileBinary)
     // Add each file to the ZIP
     FileBinary.forEach(file => {
      const { name, binary } = file;
      
      // Decode the Base64 string and convert it to binary data
      const binaryData = atob(binary);
      const arrayBuffer = new Uint8Array(binaryData.length);
      
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
  
      // Add the binary data as a file to the ZIP
      zip.file(name, arrayBuffer);
      console.log("Zip",zip)
    });
  
    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, zipfilename);
    });
    //PDF File
    /*const binaryDataPDF = atob(PDFFile[0].binary);
    const arrayBufferPDF = new Uint8Array(binaryDataPDF.length);
      
      for (let i = 0; i < binaryDataPDF.length; i++) {
        arrayBufferPDF[i] = binaryDataPDF.charCodeAt(i);
      }
  
      // Add the binary data as a file to the ZIP
      zip.file(PDFFile.name, arrayBufferPDF);
      console.log("Zip PDF",zip)

    //Excel File
    const binaryDataExcel = atob(PDFFile[0].binary);
    const arrayBufferExcel = new Uint8Array(binaryDataExcel.length);
      
      for (let i = 0; i < binaryDataExcel.length; i++) {
        arrayBufferExcel[i] = binaryDataExcel.charCodeAt(i);
      }
  
      // Add the binary data as a file to the ZIP
      zip.file(ExcelFile.name, arrayBufferExcel);

      console.log("Zip Excel",zip)

      zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, zipfilename);
      });*/
  }
  function downloadAllFileAggregateRenew(outputZipFilename) {
    const zip = new JSZip();
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
    const zipfilename = "Download_All_"+formattedDateTime
    const PDFFile = detailsRenew?.subscribersFilePdf
    const ExcelFile = detailsRenew?.subscribersFileXls
    //PDF File
    const binaryDataPDF = atob(PDFFile[0].binary);
    const arrayBufferPDF = new Uint8Array(binaryDataPDF.length);
      
      for (let i = 0; i < binaryDataPDF.length; i++) {
        arrayBufferPDF[i] = binaryDataPDF.charCodeAt(i);
      }
  
      // Add the binary data as a file to the ZIP
      zip.file(PDFFile.name, arrayBufferPDF);

    //Excel File
    const binaryDataExcel = atob(PDFFile[0].binary);
    const arrayBufferExcel = new Uint8Array(binaryDataExcel.length);
      
      for (let i = 0; i < binaryDataExcel.length; i++) {
        arrayBufferExcel[i] = binaryDataExcel.charCodeAt(i);
      }
  
      // Add the binary data as a file to the ZIP
      zip.file(ExcelFile.name, arrayBufferExcel);

      zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, zipfilename);
      });
  }

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

const deleteSubscriber =()=>{
  setIsOpenConfirmDel(true);
}

const closeDeleteSubscriber=()=>{
  setIsOpenConfirmDel(false)
}

const confirmDeleteSubscriber=()=>{
  setIsOpenConfirmDel(false)
  //showLoading()
  dispatch(FunctionwithDrawSubscriber(state.id))
  setTimeout(()=>{
    dispatch(SubscriberInfo(state.id,0))
  },500)
  //message.success(`Withdraw Subscriber Complete!`);
  //setIsOpenConfirmDel(false)
}

const onCLickComplete=()=>{
  showLoading()
  dispatch(clearModal())
  dispatch(
    SubscriberInfo(state?.id,0, () => {
      setIsOpenLoading(false);
      hideLoading();
    })
  );
}
const onClickReport =()=>{
 console.log("Test")
}

function CheckActionManageButton(){
  let showAction = []
  if (currentUGTGroup?.id !== undefined) {
    if (
      userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
    ) {
      if(details?.subscriberDetail?.subscriberStatusId === 1){
        if(details?.subscriberDetail?.renewStatus === "N"){
          showAction = [{
            icon: <FaRegEdit />,
            label: "Edit",
            onClick: onClickEdit,
          },
          {
            icon: <MdOutlineHistory />,
            label: "History",
            onClick: onClickHistory,
          },
          {
            icon: <LuTrash2 />,
            label: "Withdraw",
            onClick: deleteSubscriber,
          }]
          return showAction
        }
        else{
          showAction = [
          {
            icon: <HiOutlineArrowPathRoundedSquare  />,
            label: "Renew",
            onClick: onClickRenew,
          },  
          {
            icon: <FaRegEdit />,
            label: "Edit",
            onClick: onClickEdit,
          },
          {
            icon: <MdOutlineHistory />,
            label: "History",
            onClick: onClickHistory,
          },
          {
            icon: <LuTrash2 />,
            label: "Withdraw",
            onClick: deleteSubscriber,
          }]
          return showAction
        }
        
      }
      else if(details?.subscriberDetail?.subscriberStatusId === 2){
        if(details?.subscriberDetail?.renewStatus === "N"){
          showAction = [
            {
              icon: <FaRegEdit />,
              label: "Edit",
              onClick: onClickEdit,
            },
            {
              icon: <MdOutlineHistory />,
              label: "History",
              onClick: onClickHistory,
            }
          ]
          return showAction
        }
        else{
          showAction = [
          {
            icon: <HiOutlineArrowPathRoundedSquare  />,
            label: "Renew",
            onClick: onClickRenew,
          },  
          {
            icon: <FaRegEdit />,
            label: "Edit",
            onClick: onClickEdit,
          },
          {
            icon: <MdOutlineHistory />,
            label: "History",
            onClick: onClickHistory,
          },]
          return showAction
        }
      }
      else if(details?.subscriberDetail?.subscriberStatusId === 3){
        showAction = [
          {
            icon: <MdOutlineHistory />,
            label: "History",
            onClick: onClickHistory,
          }
        ]
        return showAction
        
      }
      else if(details?.subscriberDetail?.subscriberStatusId === 4){
        showAction = [
          {
            icon: <MdOutlineHistory />,
            label: "History",
            onClick: onClickHistory,
          },
          {
            icon: <LuTrash2 />,
            label: "Withdraw",
            onClick: deleteSubscriber,
          }
        ]
        return showAction
      }
      else if(!details?.subscriberDetail?.subscriberStatusId){
        return []
      }
    }
    else if(userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN){
      if(details?.subscriberDetail?.subscriberStatusId){
        showAction = [/*{
          icon: <FaRegEdit />,
          label: "Report",
          onClick: onClickReport,
        }*/,
        {
          icon: <MdOutlineHistory />,
          label: "History",
          onClick: onClickHistory,
        },
        ]
        return showAction
      }
      else{
        return []
      }
    }
  }
  
  
}
const action = CheckActionManageButton()
console.log("Action",action)

const SelectorTab =(tab)=>{
  //console.log("Take Action")
  setTabSelect(tab)
}

const EditContract =()=>{
  console.log("Edit Contract")
  navigate(`${WEB_URL.SUBSCRIBER_EDIT}`, { state: { code: state?.id ,contract: details?.subscriberDetail?.subscribersContractInformationId } });
}
const EditRenew =()=>{
  console.log("Edit Renew")
  navigate(`${WEB_URL.SUBSCRIBER_RENEW_EDIT}`, { state: { code: state?.id ,contract: detailsRenew?.subscriberDetail?.subscribersContractInformationId } });
}



  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                {details?.subscriberDetail?.organizationName !== ""
                  ? details?.subscriberDetail?.organizationName
                  : details?.subscriberDetail?.name}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Subscriber Management / Subscriber
                Info /{" "}
                <span className="truncate">
                  {details?.subscriberDetail?.organizationName !== ""
                    ? details?.subscriberDetail?.organizationName
                    : details?.subscriberDetail?.name}
                </span>
              </p>
            </div>

            {showRenew?
            <Card
            shadow="md"
            radius="lg"
            className="flex w-full h-full"
            padding="0"
          >
            <div className="p-4">
              <div className=" lg:col-span-2 ">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                  <div
                    id="top-div"
                    className="md:col-span-3  lg:col-span-4 flex  m-0 items-center gap-3"
                  >
                    <FaChevronCircleLeft
                      className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                      size="30"
                      onClick={() => navigate(WEB_URL.SUBSCRIBER_LIST)}
                    />
                    <span className="text-xl	mr-14 	leading-tight">
                      <b> Subscriber Info</b>
                    </span>
                    {/* <span>
                      {StatusLabel(
                        details?.subscriberDetail?.statusSubscriberName
                      )}
                    </span> */}
                  </div>

                  {/* Button Section */}
                  {isEdit && (
                    /*     <div className="md:col-span-6 lg:col-span-2 text-right">
                      <button
                        onClick={onClickEdit}
                        className="h-[40px] w-[25%]  text-PRIMARY_TEXT font-semibold bg-[#f4f4e9] rounded mx-2"
                      >
                        Edit
                      </button>
                    </div> */
                    <div className="md:col-span-6 lg:col-span-2 text-right">
                      {/*   <Menu
                        trigger="hover"
                        openDelay={100}
                        closeDelay={400}
                        offset={5}
                        width={180}
                        position="bottom-end"
                      >
                        <Menu.Target>
                          <Button
                            rightSection={<LuChevronDown />}
                            className="bg-PRIMARY_BUTTON hover:bg-BREAD_CRUMB text-white w-30"
                          >
                            Manage
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<FaRegEdit />}
                            component="button"
                            onClick={onClickEdit}
                            className="hover:bg-gray-100"
                          >
                            Edit
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu> */}
                      {details?.subscriberDetail?.subscriberStatusId !== 3 &&<ManageBtn
                        actionList={[
                          {
                            icon: <MdOutlineHistory />,
                            label: "History",
                            onClick: onClickHistory,
                          },
                          {
                            icon: <LuTrash2 />,
                            label: "Delete",
                            onClick: deleteSubscriber,
                          }
                        ]}
                      />}
                    </div>
                  )}
                  {/* Button Section */}
                </div>
              </div>
            </div>
            <div className="mt-4 pl-5 ml-5 flex">
              <div className={tabSelect === "contract"?"border-b-4 border-solid w-36 pl-1 pt-2 rounded-t-[10px] bg-[#87BE334D] text-center border-[#87BE33]":"w-36 pl-1 pt-2 rounded-t-[10px] text-center border-none"} >
                  <button className={tabSelect === "contract" ?"font-bold":"text-[#949292] font-thin"} onClick={()=>SelectorTab("contract")}>Active Contract</button>
              </div>
              <div className={tabSelect === "renew"?"border-b-4 border-solid w-36 pl-1 pt-2 rounded-t-[10px] bg-[#87BE334D] text-center ml-2 border-[#87BE33] ":"w-36 pl-1 pt-2 rounded-t-[10px]  text-center ml-2 border-none "} >
                  <button className={tabSelect === "renew" ?"font-bold":"text-[#949292] font-thin"} onClick={()=>SelectorTab("renew")}>Renew Contract</button>
              </div>
            </div>
            <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top" />
            
            {tabSelect === "contract"?
            <div className="p-6 px-8 md:p-8 mb-6 ">
              <div className=" lg:col-span-2 ">
              {isEdit && (<div className="mb-5 text-right">
                  {details?.subscriberDetail?.subscriberStatusId !== 3 &&<ManageBtn
                        actionList={[
                          {
                            icon: <FaRegEdit />,
                            label: "Edit",
                            onClick: EditContract,
                          }
                        ]}
                      />}
                </div>)}
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                  {/* Subscriber Detail */}
                  <div className="md:col-span-6">
                    <div className="grid grid-cols-12 gap-1">
                      <div className="row-span-3 col-span-12 lg:col-span-3">
                        <div className="shrink-0">
                          <h6 className="text-PRIMARY_TEXT">
                            <b>Subscriber Details</b>
                          </h6>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-9">
                        {/*Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {/*Subscriber Name */}
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Subscriber Name
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail
                                  ?.organizationName !== ""
                                  ? details?.subscriberDetail
                                      ?.organizationName
                                  : details?.subscriberDetail?.name
                              )}
                            </div>
                          </div>
                          {/*Status */}
                          <div>
                            <label className="text-[#6B7280] text-xs ">
                              Status
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                <StatusLabel
                                  status={
                                    details?.subscriberDetail
                                      ?.statusSubscriberName
                                  }
                                  type="xs"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        {/*Row 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {/*Assign Utility */}
                          <div>
                            <label className="text-[#6B7280] text-xs ">
                              Assigned Utility
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail
                                  ?.assignedUtilityId === 1
                                  ? "Electricity Generating Authority of Thailand"
                                  : details?.subscriberDetail
                                      ?.assignedUtilityId === 2
                                  ? "Provincial Electricity Authority"
                                  : details?.subscriberDetail
                                      ?.assignedUtilityId === 3
                                  ? "Metropolitan Electricity Authority"
                                  : "-"
                              )}
                            </div>
                          </div>
                          {/*Subscriber Code */}
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Subscriber Code
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail?.subscribercode
                              )}
                            </div>
                          </div>

                          {/*<div>
                            <label className="text-[#6B7280] text-xs">
                              Trade Account
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail?.tradeAccount
                              )}
                            </div>
                          </div>*/}

                          {/**Subscriber Type */}
                          {/*
                          {details?.subscriberDetail?.statusSubscriberType ==
                          1 ? (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Redemption Account
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.redemptionAccount || "-"
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subscriber Type
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.statusSubscriberType == 1
                                    ? "Subscriber"
                                    : "Aggregate Subscriber" || "-"
                                )}
                              </div>
                            </div>
                          )}*/}
                        </div>
                        {/*Row 3 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {/*Trade Accout Name */}
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Trade Account Name
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail?.tradeAccount
                              )}
                            </div>
                          </div>
                          {/*Trade Account Code */}
                          <div>
                            <label className="text-[#6B7280] text-xs ">
                              Trade Account Code
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail?.tradeAccountCode
                              )}
                            </div>
                          </div>
                        </div>

                        {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {details?.subscriberDetail?.statusSubscriberType ==
                          1 ? (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subscriber Type
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.statusSubscriberType == 1
                                    ? "Subscriber"
                                    : "Aggregate Subscriber" || "-"
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Aggregate Allocated Energy (kWh)
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  numeral(
                                    details?.subscriberDetail?.aggregateAllocatedEnergy
                                  ).format("0,0.00")
                                )}
                              </div>
                            </div>
                          )}
                        </div>*/}
                        {/*Row 4 */}
                        {details?.subscriberDetail?.subscriberTypeId ==
                          1 && (
                          <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Redemption Account Name */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Redemption Account Name
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.redemptionAccount || "-"
                                  )}
                                </div>
                              </div>
                              {/*Redemption Account Code */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Redemption Account Code
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.redemptionAccountCode || "-"
                                  )}
                                </div>
                              </div>
                            </div>

                            {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs ">
                                  Retail ESA Contract Start Date
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.retailESAContractStartDate
                                      ? convertDateTimeToDisplayDate(
                                          details?.subscriberDetail
                                            ?.retailESAContractStartDate,
                                          "d MMMM yyyy"
                                        )
                                      : "-"
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA Contract End Date
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.retailESAContractEndDate
                                      ? convertDateTimeToDisplayDate(
                                          details?.subscriberDetail
                                            ?.retailESAContractEndDate,
                                          "d MMMM yyyy"
                                        )
                                      : "-"
                                  )}
                                </div>
                              </div>
                            </div>*/}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organization Information */}
                  {details?.subscriberDetail?.subscriberTypeId == 1 && (
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Organization Infomation</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Business Registration No.
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.businessRegistrationNo || "-"
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Address
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  renderAddress(details?.subscriberDetail)
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                State/Province
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.provinceName
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                District
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.districtName
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subdistrict
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.subdistrictName
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Country
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.countryName
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Postcode
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.postCode
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Information */}
                  {details?.subscriberDetail?.subscriberTypeId == 1 && (
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Personal Information</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Contact Name
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.title +
                                    " " +
                                    details?.subscriberDetail?.name +
                                    " " +
                                    details?.subscriberDetail?.lastname || "-"
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Email
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(details?.subscriberDetail?.email)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Telephone (Mobile)
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.mobilePhone
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Telephone (Office)
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.officePhone
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Attorney / Attorney-in-fact
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.attorney
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Contract Information */}
                  <div className="md:col-span-6">
                    <div className="grid grid-cols-12 gap-1">
                      <div className="row-span-3 col-span-12 lg:col-span-3">
                        <div className="shrink-0">
                          <h6 className="text-PRIMARY_TEXT">
                            <b>Contract Infomation</b>
                          </h6>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-9">
                        {/*Row 1*/}
                        {details?.subscriberDetail?.subscriberTypeId ==
                          1 ?(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail ESA No. */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA No.
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.retailESANo || "-"
                                  )}
                                </div>
                              </div>
                              {/*Retail Start Date */}
                              <div>
                                <label className="text-[#6B7280] text-xs ">
                                  Retail ESA Contract Start Date
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.retailESAContractStartDate
                                      ? convertDateTimeToDisplayDate(
                                          details?.subscriberDetail
                                            ?.retailESAContractStartDate,
                                          "d MMMM yyyy"
                                        )
                                      : "-"
                                  )}
                                </div>
                              </div>
                            </div>
                          ) :(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail Start Date */}
                              <div>
                                    <label className="text-[#6B7280] text-xs ">
                                      Retail ESA Contract Start Date
                                    </label>
                                    <div className="break-words	font-bold">
                                      {renderData(
                                        details?.subscriberDetail
                                          ?.retailESAContractStartDate
                                          ? convertDateTimeToDisplayDate(
                                              details?.subscriberDetail
                                                ?.retailESAContractStartDate,
                                              "d MMMM yyyy"
                                            )
                                          : "-"
                                      )}
                                    </div>
                                  </div>
                              {/*Retail End Date */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract End Date
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractEndDate
                                        ? convertDateTimeToDisplayDate(
                                            details?.subscriberDetail
                                              ?.retailESAContractEndDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>
                            </div>
                          )}
                        {/*Row 2 */}
                        {details?.subscriberDetail?.subscriberTypeId ==
                          1 ?(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail End Date */}
                              <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract End Date
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractEndDate
                                        ? convertDateTimeToDisplayDate(
                                            details?.subscriberDetail
                                              ?.retailESAContractEndDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>
                              {/*Retail Duration */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA Contract Duration
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.retailESAContractDuration || "-"
                                  )}
                                </div>
                              </div>
                            </div>
                          ):(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail Duration */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA Contract Duration
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.retailESAContractDuration || "-"
                                  )}
                                </div>
                              </div>
                              {/*Portfolio Assignment */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Portfolio Assignment
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.portfolioAssignment || "-"
                                  )}
                                </div>
                              </div>                                
                            </div>
                          )
                        }
                        

                       {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Retail ESA Contract End Date
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail
                                  ?.retailESAContractEndDate
                                  ? convertDateTimeToDisplayDate(
                                      details?.subscriberDetail
                                        ?.retailESAContractEndDate,
                                      "d MMMM yyyy"
                                    )
                                  : "-"
                              )}
                            </div>
                          </div>                            
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Retail ESA Contract Duration
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail
                                  ?.retailESAContractDuration || "-"
                              )}
                            </div>
                          </div>
                        </div>*/}
                        {/*Row 3 */}
                        {details?.subscriberDetail?.subscriberTypeId ==
                          1 && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            {/*Feeder Name */}
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Feeder Name
                              </label>

                              <div>
                                {details?.feeder?.length > 0 &&
                                  details?.feeder.map((item) => {
                                    return (
                                      <div
                                        className="break-words font-bold mb-1"
                                        key={item.id}
                                      >
                                        {item?.feederName || "-"}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                            {/*Portfolio Assignment */}
                            <div>
                            <label className="text-[#6B7280] text-xs">
                              Portfolio Assignment
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail
                                  ?.portfolioAssignment || "-"
                              )}
                            </div>
                            </div>
                          </div>
                        )}

                        {/*<div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Total Allocated Energy (kWh)
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                numeral(sumAllocateEnergy).format("0,0.00")
                              )}
                            </div>
                          </div>
                        </div>*/}
                        {/*Row 4 */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Additional Contract Condition
                            </label>
                            {details?.subscriberDetail?.optForUp === "Inactive" && details?.subscriberDetail?.optForExcess === "Inactive"?
                              <div className="break-words	font-bold">
                              {renderData(
                                "-"
                              )}
                            </div>
                            :undefined}

                            {details?.subscriberDetail?.optForUp === "Active"&&
                            <div className="break-words	font-bold mt-2">
                              {renderData(
                                "Opt for up to 15% green electricity from UGT1"
                              )}
                            </div>}

                            {details?.subscriberDetail?.optForExcess === "Active"&&
                            <div className="break-words	font-bold mt-2">
                              {renderData(
                                "Opt for excess UGT beyond contract"
                              )}
                            </div>}
                          </div>
                        </div>
                        {/*List Contract Energy Amount */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3 mt-2">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Contracted Energy Amount
                            </label>

                            <div className="w-2/3">
                              <TableContainer>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Year</TableCell>
                                      <TableCell align="right">
                                        Total Allocated Energy Amount (kWh)
                                      </TableCell>
                                      <TableCell />
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {details?.allocateEnergyAmount
                                      ?.length > 0 &&
                                      details?.allocateEnergyAmount
                                      ?.map(
                                        (row, index) => (
                                          <Row
                                            key={index}
                                            rowindex={index}
                                            row={row}
                                          />
                                        )
                                      )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              {details?.fileUploadContract &&
                              <div className="grow bg-lime-200 mt-2 w-full p-2">
                                <div className="flex justify-content items-center">
                                    <div className="mr-8">
                                    </div>
                                      <label className="text-sm font-normal">
                                        Download Import File : 
                                      </label>
                                      <div>
                                      <label style={{ cursor: 'pointer', color: 'blue' }} className="text-sm font-normal ml-1" onClick={()=>downloadFile(details?.fileUploadContract[0])}>
                                      {details?.fileUploadContract[0]?.name}
                                      </label>
                                    </div>
                                </div>
                              </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Beneficiary Information */}
                  {details?.subscriberDetail?.subscriberTypeId == 1 && (
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Beneficiary Information</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                        <div className="w-2/3">
                              {details?.beneficiaryInfo.map((items,index)=>(
                                  <CollapsInfo
                                    title={items.beneficiaryName}
                                    total={items.status}
                                    key={index}
                                  >
                                    <div className="col-span-12 lg:col-span-9">
                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Beneficiary Name
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.beneficiaryName
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Status
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(items.status)}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Address
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.address
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            State / Province
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.proviceName
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            District
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.districtName
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Subdistrict
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.subdistrictName
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Country
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.countryName
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Postcode
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.postcode
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsInfo>  
                              ))}
                              
                            </div>
                          {/*details?.beneficiaryInfo.length !== 0 &&
                            details?.beneficiaryInfo.map((items,index)=>(
                            <div key={index} className="w-2/3">
                              <CollapsInfo
                                title={items?.beneficiaryName}
                                total={items?.status}
                              >
                                <div className="col-span-12 lg:col-span-9">
                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Beneficiary Name
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.beneficiaryName
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Status
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(items?.status)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Address
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.address
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        State / Province
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.proviceName
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        District
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.districtName
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Subdistrict
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.subdistrictName
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Country
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.countryName
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Postcode
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.postcode
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CollapsInfo>
                            </div>
                            ))
                          */}
                          
                        </div>
                        </div>
                      </div>
                  )}

                  {/*Documents Information Attachments */}
                  {details?.subscriberDetail?.subscriberTypeId ==1?
                    (<div className="md:col-span-6">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Documents Information Attachments</b>
                            </h6>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="col-5 mt-3">
                            <div>
                              <label className="ml-2 text-sm font-semibold">File Upload</label>
                              {details?.fileUpload &&
                              details?.fileUpload.map((items,index)=>(
                                <FileInfo key={index} items={items}/>
                              ))}
                            </div>

                            <div className="mt-3">
                              <button className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center " onClick={()=>downloadZip(details?.fileUpload,"TestDownloadFileZip")}>
                                <div className="flex items-center justify-center " >
                                  <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT cursor-pointer"/>
                                  <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer">Download All file in (.zip)</label>
                                </div>
                                  
                                </button>
                            </div>
                          </div>
                          <div className="col-5 mt-3 ml-5">
                            <div>
                              <label className="ml-2 text-sm font-semibold">Note</label>                                
                            </div>
                            <div>
                                <label className="mt-2 ml-2 text-sm font-normal">{renderData(details?.subscriberDetail?.note || "-")}</label>
                            </div>
                          </div>  
                        </div>
                        
                    </div>)
                  :<div className="md:col-span-6">
                  <div className="row-span-3 col-span-12 lg:col-span-3">
                    <div className="shrink-0">
                      <h6 className="text-PRIMARY_TEXT">
                        <b>Documents Information Attachments</b>
                      </h6>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="col-5 mt-3">
                      <div>
                        <label className="ml-2 text-sm font-semibold">File Upload</label>
                          <div>
                              <label className="ml-2 mt-3 text-sm font-semibold">หนังสือยืนยันหน่วย (.pdf)</label>
                                {details?.subscribersFilePdf && <FileInfo items={details?.subscribersFilePdf[0]}/>}
                              <label className="ml-2 mt-3 text-sm font-semibold">ข้อมูลหน่วยแยกผู้รับ (blinded) in detail (.xls) </label>
                              {details?.subscribersFileXls &&<FileInfo items={details?.subscribersFileXls[0]}/>}
                          </div>
                        </div>

                      <div className="mt-3">
                        <button className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center" onClick={()=>downloadAllFileAggregate("TestDownloadAggregateFileZip")}>
                          <div className="flex items-center justify-center cursor-pointer">
                            <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT" />
                            <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer" >Download All file in (.zip)</label>
                          </div>
                            
                          </button>
                      </div>
                    </div>
                    <div className="col-5 mt-3 ml-5">
                      <div>
                        <label className="ml-2 text-sm font-semibold">Note</label>                                
                      </div>
                      <div>
                          <label className="mt-2 ml-2 text-sm font-normal">{renderData(details?.subscriberDetail?.note || "-")}</label>
                      </div>
                    </div>  
                  </div>
                  
                  </div>}

                  {/*Remark */}
                  <div className="md:col-span-6">
                        
                           <hr className="mt-3 mb-3"/>
                           {details?.subscriberRemark &&
                           details?.subscriberRemark.map((items,index)=>(
                            <div key={items.id} className="bg-[#F5F5F5] px-5 py-4 mb-3 rounded-[10px]">
                              <div className="flex justify-between items-center">
                                <div>
                                  <label className="text-black font-bold text-lg">{items.remarkName}</label>
                                </div>
                                <div>
                                  <label className="text-sm">{"Date: "+getDate(items.createdDateTime)+" | Time: "+getTime(items.createdDateTime)}</label>
                                </div>
                              </div>
                              <hr className="mt-0"/>
                              <div>
                                <label className="mt-2 font-medium text-base">{items.remarkDetail}</label>
                              </div>
                              <div className="mt-3 text-right">
                                <label className="text-sm">{"By "+items.createdBy}</label>
                              </div>
                            </div>
                           ))}
                  </div>

                </div>
              </div>
            </div>:
            <div className="p-6 px-8 md:p-8 mb-6 ">
              <div className=" lg:col-span-2 ">
              {isEdit && (<div className="mb-5 text-right">
                {details?.subscriberDetail?.subscriberStatusId !== 3 &&<ManageBtn
                        actionList={[
                          {
                            icon: <FaRegEdit />,
                            label: "Edit",
                            onClick: EditRenew,
                          }
                        ]}
                      />}
                </div>)}
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                  {/* Subscriber Detail */}
                  <div className="md:col-span-6">
                    <div className="grid grid-cols-12 gap-1">
                      <div className="row-span-3 col-span-12 lg:col-span-3">
                        <div className="shrink-0">
                          <h6 className="text-PRIMARY_TEXT">
                            <b>Subscriber Details</b>
                          </h6>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-9">
                        {/*Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {/*Subscriber Name */}
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Subscriber Name
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                detailsRenew?.subscriberDetail
                                  ?.organizationName !== ""
                                  ? detailsRenew?.subscriberDetail
                                      ?.organizationName
                                  : detailsRenew?.subscriberDetail?.name
                              )}
                            </div>
                          </div>
                          {/*Status */}
                          <div>
                            <label className="text-[#6B7280] text-xs ">
                              Status
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                <StatusLabel
                                  status={
                                    detailsRenew?.subscriberDetail
                                      ?.statusSubscriberName
                                  }
                                  type="xs"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        {/*Row 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {/*Assign Utility */}
                          <div>
                            <label className="text-[#6B7280] text-xs ">
                              Assigned Utility
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                detailsRenew?.subscriberDetail
                                  ?.assignedUtilityId === 1
                                  ? "Electricity Generating Authority of Thailand"
                                  : detailsRenew?.subscriberDetail
                                      ?.assignedUtilityId === 2
                                  ? "Provincial Electricity Authority"
                                  : detailsRenew?.subscriberDetail
                                      ?.assignedUtilityId === 3
                                  ? "Metropolitan Electricity Authority"
                                  : "-"
                              )}
                            </div>
                          </div>
                          {/*Subscriber Code */}
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Subscriber Code
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                detailsRenew?.subscriberDetail?.subscribercode
                              )}
                            </div>
                          </div>

                          {/*<div>
                            <label className="text-[#6B7280] text-xs">
                              Trade Account
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail?.tradeAccount
                              )}
                            </div>
                          </div>*/}

                          {/**Subscriber Type */}
                          {/*
                          {details?.subscriberDetail?.statusSubscriberType ==
                          1 ? (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Redemption Account
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.redemptionAccount || "-"
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subscriber Type
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.statusSubscriberType == 1
                                    ? "Subscriber"
                                    : "Aggregate Subscriber" || "-"
                                )}
                              </div>
                            </div>
                          )}*/}
                        </div>
                        {/*Row 3 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {/*Trade Accout Name */}
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Trade Account Name
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                detailsRenew?.subscriberDetail?.tradeAccount
                              )}
                            </div>
                          </div>
                          {/*Trade Account Code */}
                          <div>
                            <label className="text-[#6B7280] text-xs ">
                              Trade Account Code
                            </label>
                            <div className="break-words	font-bold">
                              {renderData(
                                detailsRenew?.subscriberDetail?.tradeAccountCode
                              )}
                            </div>
                          </div>
                        </div>

                        {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          {details?.subscriberDetail?.statusSubscriberType ==
                          1 ? (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subscriber Type
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.statusSubscriberType == 1
                                    ? "Subscriber"
                                    : "Aggregate Subscriber" || "-"
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Aggregate Allocated Energy (kWh)
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  numeral(
                                    details?.subscriberDetail?.aggregateAllocatedEnergy
                                  ).format("0,0.00")
                                )}
                              </div>
                            </div>
                          )}
                        </div>*/}
                        {/*Row 4 */}
                        {detailsRenew?.subscriberDetail?.subscriberTypeId ==
                          1 && (
                          <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Redemption Account Name */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Redemption Account Name
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    detailsRenew?.subscriberDetail
                                      ?.redemptionAccount || "-"
                                  )}
                                </div>
                              </div>
                              {/*Redemption Account Code */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Redemption Account Code
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    detailsRenew?.subscriberDetail
                                      ?.redemptionAccountCode || "-"
                                  )}
                                </div>
                              </div>
                            </div>

                            {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs ">
                                  Retail ESA Contract Start Date
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.retailESAContractStartDate
                                      ? convertDateTimeToDisplayDate(
                                          details?.subscriberDetail
                                            ?.retailESAContractStartDate,
                                          "d MMMM yyyy"
                                        )
                                      : "-"
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA Contract End Date
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.retailESAContractEndDate
                                      ? convertDateTimeToDisplayDate(
                                          details?.subscriberDetail
                                            ?.retailESAContractEndDate,
                                          "d MMMM yyyy"
                                        )
                                      : "-"
                                  )}
                                </div>
                              </div>
                            </div>*/}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organization Information */}
                  {detailsRenew?.subscriberDetail?.subscriberTypeId == 1 && (
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Organization Infomation</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Business Registration No.
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail
                                    ?.businessRegistrationNo || "-"
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Address
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  renderAddress(detailsRenew?.subscriberDetail)
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                State/Province
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.provinceName
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                District
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.districtName
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subdistrict
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.subdistrictName
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Country
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.countryName
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Postcode
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.postCode
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personal Information */}
                  {detailsRenew?.subscriberDetail?.subscriberTypeId == 1 && (
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Personal Information</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Contact Name
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.title +
                                    " " +
                                    detailsRenew?.subscriberDetail?.name +
                                    " " +
                                    detailsRenew?.subscriberDetail?.lastname || "-"
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Email
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(detailsRenew?.subscriberDetail?.email)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Telephone (Mobile)
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.mobilePhone
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Telephone (Office)
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.officePhone
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Attorney / Attorney-in-fact
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  detailsRenew?.subscriberDetail?.attorney
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Contract Information */}
                  <div className="md:col-span-6">
                    <div className="grid grid-cols-12 gap-1">
                      <div className="row-span-3 col-span-12 lg:col-span-3">
                        <div className="shrink-0">
                          <h6 className="text-PRIMARY_TEXT">
                            <b>Contract Infomation</b>
                          </h6>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-9">
                        {/*Row 1*/}
                        {detailsRenew?.subscriberDetail?.subscriberTypeId ==
                          1 ?(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail ESA No. */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA No.
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    detailsRenew?.subscriberDetail?.retailESANo || "-"
                                  )}
                                </div>
                              </div>
                              {/*Retail Start Date */}
                              <div>
                                <label className="text-[#6B7280] text-xs ">
                                  Retail ESA Contract Start Date
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    detailsRenew?.subscriberDetail
                                      ?.retailESAContractStartDate
                                      ? convertDateTimeToDisplayDate(
                                        detailsRenew?.subscriberDetail
                                            ?.retailESAContractStartDate,
                                          "d MMMM yyyy"
                                        )
                                      : "-"
                                  )}
                                </div>
                              </div>
                            </div>
                          ) :(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail Start Date */}
                              <div>
                                    <label className="text-[#6B7280] text-xs ">
                                      Retail ESA Contract Start Date
                                    </label>
                                    <div className="break-words	font-bold">
                                      {renderData(
                                        detailsRenew?.subscriberDetail
                                          ?.retailESAContractStartDate
                                          ? convertDateTimeToDisplayDate(
                                            detailsRenew?.subscriberDetail
                                                ?.retailESAContractStartDate,
                                              "d MMMM yyyy"
                                            )
                                          : "-"
                                      )}
                                    </div>
                                  </div>
                              {/*Retail End Date */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract End Date
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      detailsRenew?.subscriberDetail
                                        ?.retailESAContractEndDate
                                        ? convertDateTimeToDisplayDate(
                                          detailsRenew?.subscriberDetail
                                              ?.retailESAContractEndDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>
                            </div>
                          )}
                        {/*Row 2 */}
                        {detailsRenew?.subscriberDetail?.subscriberTypeId ==
                          1 ?(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail End Date */}
                              <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract End Date
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      detailsRenew?.subscriberDetail
                                        ?.retailESAContractEndDate
                                        ? convertDateTimeToDisplayDate(
                                          detailsRenew?.subscriberDetail
                                              ?.retailESAContractEndDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>
                              {/*Retail Duration */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA Contract Duration
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    detailsRenew?.subscriberDetail
                                      ?.retailESAContractDuration || "-"
                                  )}
                                </div>
                              </div>
                            </div>
                          ):(
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Retail Duration */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Retail ESA Contract Duration
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    detailsRenew?.subscriberDetail
                                      ?.retailESAContractDuration || "-"
                                  )}
                                </div>
                              </div>
                              {/*Portfolio Assignment */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Portfolio Assignment
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    detailsRenew?.subscriberDetail
                                      ?.portfolioAssignment || "-"
                                  )}
                                </div>
                              </div>                                
                            </div>
                          )
                        }
                        

                      {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Retail ESA Contract End Date
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail
                                  ?.retailESAContractEndDate
                                  ? convertDateTimeToDisplayDate(
                                      details?.subscriberDetail
                                        ?.retailESAContractEndDate,
                                      "d MMMM yyyy"
                                    )
                                  : "-"
                              )}
                            </div>
                          </div>                            
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Retail ESA Contract Duration
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                details?.subscriberDetail
                                  ?.retailESAContractDuration || "-"
                              )}
                            </div>
                          </div>
                        </div>*/}
                        {/*Row 3 */}
                        {detailsRenew?.subscriberDetail?.subscriberTypeId ==
                          1 && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            {/*Feeder Name */}
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Feeder Name
                              </label>

                              <div>
                                {detailsRenew?.feeder?.length > 0 &&
                                  detailsRenew?.feeder.map((item) => {
                                    return (
                                      <div
                                        className="break-words font-bold mb-1"
                                        key={item.id}
                                      >
                                        {item?.feederName || "-"}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                            {/*Portfolio Assignment */}
                            <div>
                            <label className="text-[#6B7280] text-xs">
                              Portfolio Assignment
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                detailsRenew?.subscriberDetail
                                  ?.portfolioAssignment || "-"
                              )}
                            </div>
                            </div>
                          </div>
                        )}

                        {/*<div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Total Allocated Energy (kWh)
                            </label>

                            <div className="break-words	font-bold">
                              {renderData(
                                numeral(sumAllocateEnergy).format("0,0.00")
                              )}
                            </div>
                          </div>
                        </div>*/}
                        {/*Row 4 */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Additional Contract Condition
                            </label>
                            {detailsRenew?.subscriberDetail?.optForUp === "Inactive" && detailsRenew?.subscriberDetail?.optForExcess === "Inactive"?
                              <div className="break-words	font-bold">
                              {renderData(
                                "-"
                              )}
                            </div>
                            :undefined}

                            {detailsRenew?.subscriberDetail?.optForUp === "Active"&&
                            <div className="break-words	font-bold mt-2">
                              {renderData(
                                "Opt for up to 15% green electricity from UGT1"
                              )}
                            </div>}

                            {detailsRenew?.subscriberDetail?.optForExcess === "Active"&&
                            <div className="break-words	font-bold mt-2">
                              {renderData(
                                "Opt for excess UGT beyond contract"
                              )}
                            </div>}
                          </div>
                        </div>
                        {/*List Contract Energy Amount */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3 mt-2">
                          <div>
                            <label className="text-[#6B7280] text-xs">
                              Contracted Energy Amount
                            </label>

                            <div className="w-2/3">
                              <TableContainer>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Year</TableCell>
                                      <TableCell align="right">
                                        Total Allocated Energy Amount (kWh)
                                      </TableCell>
                                      <TableCell />
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {detailsRenew?.allocateEnergyAmount
                                      ?.length > 0 &&
                                      detailsRenew?.allocateEnergyAmount
                                      ?.map(
                                        (row, index) => (
                                          <Row
                                            key={index}
                                            rowindex={index}
                                            row={row}
                                          />
                                        )
                                      )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              {detailsRenew?.fileUploadContract &&
                              <div className="grow bg-lime-200 mt-2 w-full p-2">
                                <div className="flex justify-content items-center">
                                    <div className="mr-8">
                                    </div>
                                      <label className="text-sm font-normal">
                                        Download Import File : 
                                      </label>
                                      <div>
                                      <label style={{ cursor: 'pointer', color: 'blue' }} className="text-sm font-normal ml-1" onClick={()=>downloadFile(detailsRenew?.fileUploadContract[0])}>
                                      {detailsRenew?.fileUploadContract[0]?.name}
                                      </label>
                                    </div>
                                </div>
                              </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Beneficiary Information */}
                  {detailsRenew?.subscriberDetail?.subscriberTypeId == 1 && (
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Beneficiary Information</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                        <div className="w-2/3">
                              {detailsRenew?.beneficiaryInfo.map((items,index)=>(
                                  <CollapsInfo
                                    title={items.beneficiaryName}
                                    total={items.status}
                                    key={index}
                                  >
                                    <div className="col-span-12 lg:col-span-9">
                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Beneficiary Name
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.beneficiaryName
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Status
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(items.status)}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Address
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.address
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            State / Province
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.proviceName
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            District
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.districtName
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Subdistrict
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.subdistrictName
                                            )}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Country
                                          </label>
                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.countryName
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                        <div>
                                          <label className="text-[#6B7280] text-xs">
                                            Postcode
                                          </label>

                                          <div className="break-words	font-bold">
                                            {renderData(
                                              items.postcode
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsInfo>  
                              ))}
                              
                            </div>
                          {/*details?.beneficiaryInfo.length !== 0 &&
                            details?.beneficiaryInfo.map((items,index)=>(
                            <div key={index} className="w-2/3">
                              <CollapsInfo
                                title={items?.beneficiaryName}
                                total={items?.status}
                              >
                                <div className="col-span-12 lg:col-span-9">
                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Beneficiary Name
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.beneficiaryName
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Status
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(items?.status)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Address
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.address
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        State / Province
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.proviceName
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        District
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.districtName
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Subdistrict
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.subdistrictName
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Country
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.countryName
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label className="text-[#6B7280] text-xs">
                                        Postcode
                                      </label>

                                      <div className="break-words	font-bold">
                                        {renderData(
                                          items?.postcode
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CollapsInfo>
                            </div>
                            ))
                          */}
                          
                        </div>
                        </div>
                      </div>
                  )}

                  {/*Documents Information Attachments */}
                  {detailsRenew?.subscriberDetail?.subscriberTypeId ==1?
                    (<div className="md:col-span-6">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Documents Information Attachments</b>
                            </h6>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="col-5 mt-3">
                            <div>
                              <label className="ml-2 text-sm font-semibold">File Upload</label>
                              {detailsRenew?.fileUpload &&
                              detailsRenew?.fileUpload.map((items,index)=>(
                                <FileInfo key={index} items={items}/>
                              ))}
                            </div>

                            <div className="mt-3">
                              <button className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center " onClick={()=>downloadZip(detailsRenew?.fileUpload,"TestDownloadFileZip")}>
                                <div className="flex items-center justify-center " >
                                  <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT cursor-pointer"/>
                                  <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer">Download All file in (.zip)</label>
                                </div>
                                  
                                </button>
                            </div>
                          </div>
                          <div className="col-5 mt-3 ml-5">
                            <div>
                              <label className="ml-2 text-sm font-semibold">Note</label>                                
                            </div>
                            <div>
                                <label className="mt-2 ml-2 text-sm font-normal">{renderData(detailsRenew?.subscriberDetail?.note || "-")}</label>
                            </div>
                          </div>  
                        </div>
                        
                    </div>)
                  :<div className="md:col-span-6">
                  <div className="row-span-3 col-span-12 lg:col-span-3">
                    <div className="shrink-0">
                      <h6 className="text-PRIMARY_TEXT">
                        <b>Documents Information Attachments</b>
                      </h6>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="col-5 mt-3">
                      <div>
                        <label className="ml-2 text-sm font-semibold">File Upload</label>
                          <div>
                              <label className="ml-2 mt-3 text-sm font-semibold">หนังสือยืนยันหน่วย (.pdf)</label>
                                {detailsRenew?.subscribersFilePdf && <FileInfo items={detailsRenew?.subscribersFilePdf[0]}/>}
                              <label className="ml-2 mt-3 text-sm font-semibold">ข้อมูลหน่วยแยกผู้รับ (blinded) in detail (.xls) </label>
                              {detailsRenew?.subscribersFileXls &&<FileInfo items={detailsRenew?.subscribersFileXls[0]}/>}
                          </div>
                        </div>

                      <div className="mt-3">
                        <button className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center" onClick={()=>downloadAllFileAggregateRenew("TestDownloadAggregateFileZip")}>
                          <div className="flex items-center justify-center cursor-pointer">
                            <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT" />
                            <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer" >Download All file in (.zip)</label>
                          </div>
                            
                          </button>
                      </div>
                    </div>
                    <div className="col-5 mt-3 ml-5">
                      <div>
                        <label className="ml-2 text-sm font-semibold">Note</label>                                
                      </div>
                      <div>
                          <label className="mt-2 ml-2 text-sm font-normal">{renderData(detailsRenew?.subscriberDetail?.note || "-")}</label>
                      </div>
                    </div>  
                  </div>
                  
                  </div>}

                  {/*Remark */}
                  <div className="md:col-span-6">
                        
                          <hr className="mt-3 mb-3"/>
                          {detailsRenew?.subscriberRemark &&
                          detailsRenew?.subscriberRemark.map((items,index)=>(
                            <div key={items.id} className="bg-[#F5F5F5] px-5 py-4 mb-3 rounded-[10px]">
                              <div className="flex justify-between items-center">
                                <div>
                                  <label className="text-black font-bold text-lg">{items.remarkName}</label>
                                </div>
                                <div>
                                  <label className="text-sm">{"Date: "+getDate(items.createdDateTime)+" | Time: "+getTime(items.createdDateTime)}</label>
                                </div>
                              </div>
                              <hr className="mt-0"/>
                              <div>
                                <label className="mt-2 font-medium text-base">{items.remarkDetail}</label>
                              </div>
                              <div className="mt-3 text-right">
                                <label className="text-sm">{"By "+items.createdBy}</label>
                              </div>
                            </div>
                          ))}
                  </div>

                </div>
              </div>
            </div>}

          </Card>:
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="0"
            >
              <div className="p-4">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    <div
                      id="top-div"
                      className="md:col-span-3  lg:col-span-4 flex  m-0 items-center gap-3"
                    >
                      <FaChevronCircleLeft
                        className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                        size="30"
                        onClick={() => navigate(WEB_URL.SUBSCRIBER_LIST)}
                      />
                      <span className="text-xl	mr-14 	leading-tight">
                        <b> Subscriber Info</b>
                      </span>
                      {/* <span>
                        {StatusLabel(
                          details?.subscriberDetail?.statusSubscriberName
                        )}
                      </span> */}
                    </div>

                    {/* Button Section */}
                    {isEdit && (
                      /*     <div className="md:col-span-6 lg:col-span-2 text-right">
                        <button
                          onClick={onClickEdit}
                          className="h-[40px] w-[25%]  text-PRIMARY_TEXT font-semibold bg-[#f4f4e9] rounded mx-2"
                        >
                          Edit
                        </button>
                      </div> */
                      <div className="md:col-span-6 lg:col-span-2 text-right">
                        {/*   <Menu
                          trigger="hover"
                          openDelay={100}
                          closeDelay={400}
                          offset={5}
                          width={180}
                          position="bottom-end"
                        >
                          <Menu.Target>
                            <Button
                              rightSection={<LuChevronDown />}
                              className="bg-PRIMARY_BUTTON hover:bg-BREAD_CRUMB text-white w-30"
                            >
                              Manage
                            </Button>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<FaRegEdit />}
                              component="button"
                              onClick={onClickEdit}
                              className="hover:bg-gray-100"
                            >
                              Edit
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu> */}
                        {details?.subscriberDetail?.subscriberStatusId !== 3 &&<ManageBtn
                          actionList={action}
                        />}
                      </div>
                    )}
                    {/* Button Section */}
                  </div>
                </div>
              </div>

              <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top" />

              <div className="p-6 px-8 md:p-8 mb-6 ">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    {/* Subscriber Detail */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Subscriber Details</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          {/*Row 1 */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            {/*Subscriber Name */}
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subscriber Name
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.organizationName !== ""
                                    ? details?.subscriberDetail
                                        ?.organizationName
                                    : details?.subscriberDetail?.name
                                )}
                              </div>
                            </div>
                            {/*Status */}
                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                Status
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  <StatusLabel
                                    status={
                                      details?.subscriberDetail
                                        ?.statusSubscriberName
                                    }
                                    type="xs"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          {/*Row 2 */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            {/*Assign Utility */}
                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                Assigned Utility
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.assignedUtilityId === 1
                                    ? "Electricity Generating Authority of Thailand"
                                    : details?.subscriberDetail
                                        ?.assignedUtilityId === 2
                                    ? "Provincial Electricity Authority"
                                    : details?.subscriberDetail
                                        ?.assignedUtilityId === 3
                                    ? "Metropolitan Electricity Authority"
                                    : "-"
                                )}
                              </div>
                            </div>
                            {/*Subscriber Code */}
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subscriber Code
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.subscribercode
                                )}
                              </div>
                            </div>

                            {/*<div>
                              <label className="text-[#6B7280] text-xs">
                                Trade Account
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.tradeAccount
                                )}
                              </div>
                            </div>*/}

                            {/**Subscriber Type */}
                            {/*
                            {details?.subscriberDetail?.statusSubscriberType ==
                            1 ? (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Redemption Account
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.redemptionAccount || "-"
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Subscriber Type
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.statusSubscriberType == 1
                                      ? "Subscriber"
                                      : "Aggregate Subscriber" || "-"
                                  )}
                                </div>
                              </div>
                            )}*/}
                          </div>
                          {/*Row 3 */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            {/*Trade Accout Name */}
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Trade Account Name
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.tradeAccount
                                )}
                              </div>
                            </div>
                            {/*Trade Account Code */}
                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                Trade Account Code
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.tradeAccountCode
                                )}
                              </div>
                            </div>
                          </div>

                          {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            {details?.subscriberDetail?.statusSubscriberType ==
                            1 ? (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Subscriber Type
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.statusSubscriberType == 1
                                      ? "Subscriber"
                                      : "Aggregate Subscriber" || "-"
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Aggregate Allocated Energy (kWh)
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    numeral(
                                      details?.subscriberDetail?.aggregateAllocatedEnergy
                                    ).format("0,0.00")
                                  )}
                                </div>
                              </div>
                            )}
                          </div>*/}
                          {/*Row 4 */}
                          {details?.subscriberDetail?.subscriberTypeId ==
                            1 && (
                            <>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                {/*Redemption Account Name */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Redemption Account Name
                                  </label>
                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.redemptionAccount || "-"
                                    )}
                                  </div>
                                </div>
                                {/*Redemption Account Code */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Redemption Account Code
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.redemptionAccountCode || "-"
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                <div>
                                  <label className="text-[#6B7280] text-xs ">
                                    Retail ESA Contract Start Date
                                  </label>
                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractStartDate
                                        ? convertDateTimeToDisplayDate(
                                            details?.subscriberDetail
                                              ?.retailESAContractStartDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract End Date
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractEndDate
                                        ? convertDateTimeToDisplayDate(
                                            details?.subscriberDetail
                                              ?.retailESAContractEndDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>
                              </div>*/}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Organization Information */}
                    {details?.subscriberDetail?.subscriberTypeId == 1 && (
                      <div className="md:col-span-6">
                        <div className="grid grid-cols-12 gap-1">
                          <div className="row-span-3 col-span-12 lg:col-span-3">
                            <div className="shrink-0">
                              <h6 className="text-PRIMARY_TEXT">
                                <b>Organization Infomation</b>
                              </h6>
                            </div>
                          </div>

                          <div className="col-span-12 lg:col-span-9">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Business Registration No.
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.businessRegistrationNo || "-"
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Address
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    renderAddress(details?.subscriberDetail)
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  State/Province
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.provinceName
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  District
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.districtName
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Subdistrict
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.subdistrictName
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Country
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.countryName
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Postcode
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.postCode
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Personal Information */}
                    {details?.subscriberDetail?.subscriberTypeId == 1 && (
                      <div className="md:col-span-6">
                        <div className="grid grid-cols-12 gap-1">
                          <div className="row-span-3 col-span-12 lg:col-span-3">
                            <div className="shrink-0">
                              <h6 className="text-PRIMARY_TEXT">
                                <b>Personal Information</b>
                              </h6>
                            </div>
                          </div>

                          <div className="col-span-12 lg:col-span-9">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Contact Name
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.title +
                                      " " +
                                      details?.subscriberDetail?.name +
                                      " " +
                                      details?.subscriberDetail?.lastname || "-"
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Email
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(details?.subscriberDetail?.email)}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Telephone (Mobile)
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.mobilePhone
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Telephone (Office)
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.officePhone
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Attorney / Attorney-in-fact
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.attorney
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Contract Information */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Contract Infomation</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          {/*Row 1*/}
                          {details?.subscriberDetail?.subscriberTypeId ==
                            1 ?(
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                {/*Retail ESA No. */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA No.
                                  </label>
                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail?.retailESANo || "-"
                                    )}
                                  </div>
                                </div>
                                {/*Retail Start Date */}
                                <div>
                                  <label className="text-[#6B7280] text-xs ">
                                    Retail ESA Contract Start Date
                                  </label>
                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractStartDate
                                        ? convertDateTimeToDisplayDate(
                                            details?.subscriberDetail
                                              ?.retailESAContractStartDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) :(
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                {/*Retail Start Date */}
                                <div>
                                      <label className="text-[#6B7280] text-xs ">
                                        Retail ESA Contract Start Date
                                      </label>
                                      <div className="break-words	font-bold">
                                        {renderData(
                                          details?.subscriberDetail
                                            ?.retailESAContractStartDate
                                            ? convertDateTimeToDisplayDate(
                                                details?.subscriberDetail
                                                  ?.retailESAContractStartDate,
                                                "d MMMM yyyy"
                                              )
                                            : "-"
                                        )}
                                      </div>
                                    </div>
                                {/*Retail End Date */}
                                  <div>
                                    <label className="text-[#6B7280] text-xs">
                                      Retail ESA Contract End Date
                                    </label>

                                    <div className="break-words	font-bold">
                                      {renderData(
                                        details?.subscriberDetail
                                          ?.retailESAContractEndDate
                                          ? convertDateTimeToDisplayDate(
                                              details?.subscriberDetail
                                                ?.retailESAContractEndDate,
                                              "d MMMM yyyy"
                                            )
                                          : "-"
                                      )}
                                    </div>
                                  </div>
                              </div>
                            )}
                          {/*Row 2 */}
                          {details?.subscriberDetail?.subscriberTypeId ==
                            1 ?(
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                {/*Retail End Date */}
                                <div>
                                    <label className="text-[#6B7280] text-xs">
                                      Retail ESA Contract End Date
                                    </label>

                                    <div className="break-words	font-bold">
                                      {renderData(
                                        details?.subscriberDetail
                                          ?.retailESAContractEndDate
                                          ? convertDateTimeToDisplayDate(
                                              details?.subscriberDetail
                                                ?.retailESAContractEndDate,
                                              "d MMMM yyyy"
                                            )
                                          : "-"
                                      )}
                                    </div>
                                  </div>
                                {/*Retail Duration */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract Duration
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractDuration || "-"
                                    )}
                                  </div>
                                </div>
                              </div>
                            ):(
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                {/*Retail Duration */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract Duration
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractDuration || "-"
                                    )}
                                  </div>
                                </div>
                                {/*Portfolio Assignment */}
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Portfolio Assignment
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.portfolioAssignment || "-"
                                    )}
                                  </div>
                                </div>                                
                              </div>
                            )
                          }
                          

                         {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Retail ESA Contract End Date
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.retailESAContractEndDate
                                    ? convertDateTimeToDisplayDate(
                                        details?.subscriberDetail
                                          ?.retailESAContractEndDate,
                                        "d MMMM yyyy"
                                      )
                                    : "-"
                                )}
                              </div>
                            </div>                            
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Retail ESA Contract Duration
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.retailESAContractDuration || "-"
                                )}
                              </div>
                            </div>
                          </div>*/}
                          {/*Row 3 */}
                          {details?.subscriberDetail?.subscriberTypeId ==
                            1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              {/*Feeder Name */}
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Feeder Name
                                </label>

                                <div>
                                  {details?.feeder?.length > 0 &&
                                    details?.feeder.map((item) => {
                                      return (
                                        <div
                                          className="break-words font-bold mb-1"
                                          key={item.id}
                                        >
                                          {item?.feederName || "-"}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                              {/*Portfolio Assignment */}
                              <div>
                              <label className="text-[#6B7280] text-xs">
                                Portfolio Assignment
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.portfolioAssignment || "-"
                                )}
                              </div>
                              </div>
                            </div>
                          )}

                          {/*<div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Total Allocated Energy (kWh)
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  numeral(sumAllocateEnergy).format("0,0.00")
                                )}
                              </div>
                            </div>
                          </div>*/}
                          {/*Row 4 */}
                          <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Additional Contract Condition
                              </label>
                              {details?.subscriberDetail?.optForUp === "Inactive" && details?.subscriberDetail?.optForExcess === "Inactive"?
                                <div className="break-words	font-bold">
                                {renderData(
                                  "-"
                                )}
                              </div>
                              :undefined}

                              {details?.subscriberDetail?.optForUp === "Active"&&
                              <div className="break-words	font-bold mt-2">
                                {renderData(
                                  "Opt for up to 15% green electricity from UGT1"
                                )}
                              </div>}

                              {details?.subscriberDetail?.optForExcess === "Active"&&
                              <div className="break-words	font-bold mt-2">
                                {renderData(
                                  "Opt for excess UGT beyond contract"
                                )}
                              </div>}
                            </div>
                          </div>
                          {/*List Contract Energy Amount */}
                          <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3 mt-2">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Contracted Energy Amount
                              </label>

                              <div className="w-2/3">
                                <TableContainer>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Year</TableCell>
                                        <TableCell align="right">
                                          Total Allocated Energy Amount (kWh)
                                        </TableCell>
                                        <TableCell />
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {details?.allocateEnergyAmount
                                        ?.length > 0 &&
                                        details?.allocateEnergyAmount
                                        ?.map(
                                          (row, index) => (
                                            <Row
                                              key={index}
                                              rowindex={index}
                                              row={row}
                                            />
                                          )
                                        )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                                {details?.fileUploadContract &&
                                <div className="grow bg-lime-200 mt-2 w-full p-2">
                                  <div className="flex justify-content items-center">
                                      <div className="mr-8">
                                      </div>
                                        <label className="text-sm font-normal">
                                          Download Import File : 
                                        </label>
                                        <div>
                                        <label style={{ cursor: 'pointer', color: 'blue' }} className="text-sm font-normal ml-1" onClick={()=>downloadFile(details?.fileUploadContract[0])}>
                                        {details?.fileUploadContract[0]?.name}
                                        </label>
                                      </div>
                                  </div>
                                </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Beneficiary Information */}
                    {details?.subscriberDetail?.subscriberTypeId == 1 && (
                      <div className="md:col-span-6">
                        <div className="grid grid-cols-12 gap-1">
                          <div className="row-span-3 col-span-12 lg:col-span-3">
                            <div className="shrink-0">
                              <h6 className="text-PRIMARY_TEXT">
                                <b>Beneficiary Information</b>
                              </h6>
                            </div>
                          </div>

                          <div className="col-span-12 lg:col-span-9">
                          <div className="w-2/3">
                                {details?.beneficiaryInfo.map((items,index)=>(
                                    <CollapsInfo
                                      title={items.beneficiaryName}
                                      total={items.status}
                                      key={index}
                                    >
                                      <div className="col-span-12 lg:col-span-9">
                                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              Beneficiary Name
                                            </label>
                                            <div className="break-words	font-bold">
                                              {renderData(
                                                items.beneficiaryName
                                              )}
                                            </div>
                                          </div>

                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              Status
                                            </label>
                                            <div className="break-words	font-bold">
                                              {renderData(items.status)}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mb-3">
                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              Address
                                            </label>

                                            <div className="break-words	font-bold">
                                              {renderData(
                                                items.address
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              State / Province
                                            </label>

                                            <div className="break-words	font-bold">
                                              {renderData(
                                                items.proviceName
                                              )}
                                            </div>
                                          </div>

                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              District
                                            </label>

                                            <div className="break-words	font-bold">
                                              {renderData(
                                                items.districtName
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              Subdistrict
                                            </label>
                                            <div className="break-words	font-bold">
                                              {renderData(
                                                items.subdistrictName
                                              )}
                                            </div>
                                          </div>

                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              Country
                                            </label>
                                            <div className="break-words	font-bold">
                                              {renderData(
                                                items.countryName
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                          <div>
                                            <label className="text-[#6B7280] text-xs">
                                              Postcode
                                            </label>

                                            <div className="break-words	font-bold">
                                              {renderData(
                                                items.postcode
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CollapsInfo>  
                                ))}
                                
                              </div>
                            {/*details?.beneficiaryInfo.length !== 0 &&
                              details?.beneficiaryInfo.map((items,index)=>(
                              <div key={index} className="w-2/3">
                                <CollapsInfo
                                  title={items?.beneficiaryName}
                                  total={items?.status}
                                >
                                  <div className="col-span-12 lg:col-span-9">
                                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          Beneficiary Name
                                        </label>
                                        <div className="break-words	font-bold">
                                          {renderData(
                                            items?.beneficiaryName
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          Status
                                        </label>
                                        <div className="break-words	font-bold">
                                          {renderData(items?.status)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mb-3">
                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          Address
                                        </label>

                                        <div className="break-words	font-bold">
                                          {renderData(
                                            items?.address
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          State / Province
                                        </label>

                                        <div className="break-words	font-bold">
                                          {renderData(
                                            items?.proviceName
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          District
                                        </label>

                                        <div className="break-words	font-bold">
                                          {renderData(
                                            items?.districtName
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          Subdistrict
                                        </label>
                                        <div className="break-words	font-bold">
                                          {renderData(
                                            items?.subdistrictName
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          Country
                                        </label>
                                        <div className="break-words	font-bold">
                                          {renderData(
                                            items?.countryName
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-3">
                                      <div>
                                        <label className="text-[#6B7280] text-xs">
                                          Postcode
                                        </label>

                                        <div className="break-words	font-bold">
                                          {renderData(
                                            items?.postcode
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CollapsInfo>
                              </div>
                              ))
                            */}
                            
                          </div>
                          </div>
                        </div>
                    )}

                    {/*Documents Information Attachments */}
                    {details?.subscriberDetail?.subscriberTypeId ==1?
                      (<div className="md:col-span-6">
                          <div className="row-span-3 col-span-12 lg:col-span-3">
                            <div className="shrink-0">
                              <h6 className="text-PRIMARY_TEXT">
                                <b>Documents Information Attachments</b>
                              </h6>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="col-5 mt-3">
                              <div>
                                <label className="ml-2 text-sm font-semibold">File Upload</label>
                                {details?.fileUpload &&
                                details?.fileUpload.map((items,index)=>(
                                  <FileInfo key={index} items={items}/>
                                ))}
                              </div>

                              {details?.fileUpload.length !== 0 &&<div className="mt-3">
                                <button className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center " onClick={()=>downloadZip(details?.fileUpload,"TestDownloadFileZip")}>
                                  <div className="flex items-center justify-center " >
                                    <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT cursor-pointer"/>
                                    <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer">Download All file in (.zip)</label>
                                  </div>
                                    
                                  </button>
                              </div>}
                            </div>
                            <div className="col-5 mt-3 ml-5">
                              <div>
                                <label className="ml-2 text-sm font-semibold">Note</label>                                
                              </div>
                              <div>
                                  <label className="mt-2 ml-2 break-all text-sm font-normal">{renderData(details?.subscriberDetail?.note || "-")}</label>
                              </div>
                            </div>  
                          </div>
                          
                      </div>)
                    :<div className="md:col-span-6">
                    <div className="row-span-3 col-span-12 lg:col-span-3">
                      <div className="shrink-0">
                        <h6 className="text-PRIMARY_TEXT">
                          <b>Documents Information Attachments</b>
                        </h6>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="col-5 mt-3">
                        <div>
                          <label className="ml-2 text-sm font-semibold">File Upload</label>
                            <div>
                                <label className="ml-2 mt-3 text-sm font-semibold">หนังสือยืนยันหน่วย (.pdf)</label>
                                  {details?.subscribersFilePdf && <FileInfo items={details?.subscribersFilePdf[0]}/>}
                                <label className="ml-2 mt-3 text-sm font-semibold">ข้อมูลหน่วยแยกผู้รับ (blinded) in detail (.xls) </label>
                                {details?.subscribersFileXls &&<FileInfo items={details?.subscribersFileXls[0]}/>}
                            </div>
                          </div>

                        <div className="mt-3">
                          <button className="items-center px-2 py-2 border-[#4D6A00] border-2 w-full rounded-[5px] text-center" onClick={()=>downloadAllFileAggregate("TestDownloadAggregateFileZip")}>
                            <div className="flex items-center justify-center cursor-pointer">
                              <LiaDownloadSolid className=" w-5 h-5 text-PRIMARY_TEXT" />
                              <label className="text-PRIMARY_TEXT ml-2 font-semibold cursor-pointer" >Download All file in (.zip)</label>
                            </div>
                              
                            </button>
                        </div>
                      </div>
                      <div className="col-5 mt-3 ml-5">
                        <div>
                          <label className="ml-2 text-sm font-semibold">Note</label>                                
                        </div>
                        <div>
                            <label className="mt-2 ml-2 break-all text-sm font-normal">{renderData(details?.subscriberDetail?.note || "-")}</label>
                        </div>
                      </div>  
                    </div>
                    
                    </div>}

                    {/*Remark */}
                    <div className="md:col-span-6">
                          
                             <hr className="mt-3 mb-3"/>
                             {details?.subscriberRemark &&
                             details?.subscriberRemark.map((items,index)=>(
                              <div key={items.id} className="bg-[#F5F5F5] px-5 py-4 mb-3 rounded-[10px]">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <label className="text-black font-bold text-lg">{items.remarkName}</label>
                                  </div>
                                  <div>
                                    <label className="text-sm">{"Date: "+getDate(items.createdDateTime)+" | Time: "+getTime(items.createdDateTime)}</label>
                                  </div>
                                </div>
                                <hr className="mt-0"/>
                                <div>
                                  <label className="mt-2 font-medium text-base">{items.remarkDetail}</label>
                                </div>
                                <div className="mt-3 text-right">
                                  <label className="text-sm">{"By "+items.createdBy}</label>
                                </div>
                              </div>
                             ))}
                    </div>

                  </div>
                </div>
              </div>
            </Card>}
          </div>
        </div>
      </div>

      {/* {isOpenLoading && <LoadPage></LoadPage>} */}
      {isOpenConfirmDel && (
        <ModalConfirmWithdrawn
          onClickConfirmBtn={confirmDeleteSubscriber}
          onCloseModal={closeDeleteSubscriber}
          title={"Withdraw this Subscriber ?"}
          content={"Would you like to delete this subscriber? Subscriber will be permanently deleted."}
          buttonTypeColor={"danger"}
          showCheckBox={false}
          sizeModal={"md"}
          contentButton={"Confirm Withdraw"}
        />
      )}
      {/*Madal Fail Save */}
      {isError && (
        <ModalFail
          onClickOk={() => {
            dispatch(clearModal())
          }}
          content={errorMessage}
        />
      )}
      {/*Modal Create Complete */}
      {/*isOpen && (
        <ModalCompleteSubscriberButton
          title="Done!"
          context="Withdraw Subscriber Complete!"
          onclick={onCLickComplete}
        />
      )*/}
    </div>
  );
};

export default InfoSubscriber;

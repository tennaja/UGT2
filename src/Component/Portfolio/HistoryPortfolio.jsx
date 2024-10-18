import React, { useEffect, useState } from "react";
import { Card, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import deviceLogo from "../assets/device.svg";
import SubscriberLOGO01 from "../assets/3-user.svg";
import submenuPortfolioLogoInfoSelectedwhite from "../assets/graphInfo_selected_white.svg";
import submenuPortfolioLogoAddSelectedwhite from "../assets/pieplus_selected_white.svg";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBox from "../Control/SearchBox";
import DataTable from "../Control/Table/DataTable";
import Multiselect from "../Control/Multiselect";
import {
  PortfolioManagementDashboard,
  PortfolioManagementDashboardList,
  PortfolioHistory,
  PortfolioHistoryFile
} from "../../Redux/Portfolio/Action";
import { setSelectedYear } from "../../Redux/Settlement/Action";
import { setCookie } from "../../Utils/FuncUtils";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import { USER_GROUP_ID, UTILITY_GROUP_ID } from "../../Constants/Constants";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import { PortfolioInfo, PortfolioDelete } from "../../Redux/Portfolio/Action";
import { FaChevronCircleLeft, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { utils, writeFile } from 'xlsx';
import { RiEyeLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";
import DataTablePortfolio from "./component/DataTablePortfolio";
import SearchBoxPortfolio from "./SearchBoxPortfolio";
import { MdDataObject } from "react-icons/md";
import { hideLoading, showLoading } from "../../Utils/Utils";

const itemsPerPage = 5;
const HistoryPortfolio = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const { state } = useLocation();
  const historyPort = useSelector((state) => state.portfolio.historyPort);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const details = useSelector((state) => state.portfolio.detailInfoList);
  const historyFile = useSelector((state)=> state.portfolio.historyFile)
  
  const [isPortManager, setIsPortManager] = useState(false);
  const userData = useSelector((state) => state.login.userobj);
  //console.log("detail History",historyPort)
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      if (userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG) {
        setIsPortManager(true);
      }
    }
  }, [currentUGTGroup, userData]);

  /*const dashboardData = useSelector(
    (state) => state.portfolio.portfolioDashboard
  );*/
  /*const dashboardDataList = useSelector(
    (state) => state.portfolio.portfolioDashboardList
  );*/
 
  const [dashboardList, setDashboardList] = useState([]);
  const [portfolioAction,setPortfolioAction] = useState([]);
  const [devicesCurrent,setDevicesCurrent] = useState([]);
  const [devicePast,setDevicePast] = useState([]);
  const [subscriberCurrent,setSubscriberCurrent] = useState([]);
  const [subscriberPast,setSubscriberPast] = useState([]);
  const [tabDevice, setTabDevice] = useState("current");
  const [tabSubscriber, setTabSubscriber] = useState("current");

  useEffect(() => {
    if (currentUGTGroup?.id) {
      dispatch(PortfolioManagementDashboard(currentUGTGroup?.id));
      dispatch(PortfolioManagementDashboardList(currentUGTGroup?.id));
    }
    
  }, [currentUGTGroup?.id]);

  useEffect(()=>{
    console.log("State",state?.code)
    dispatch(PortfolioInfo(state?.code));
    dispatch(PortfolioHistory(state?.code))
  },[])

  /*useEffect(() => {
    if (dashboardDataList?.length > 0) {
      const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const formattedDataArray = dashboardDataList.map((item) => ({
        ...item,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
      }));
      setDashboardList(formattedDataArray);
    }
  }, [dashboardDataList]);*/

  //useEffect(() => {}, [dashboardData]);
  useEffect(()=>{
    console.log("History Change",historyPort?.portfoliosList)
    let sampleData = []
    const formatDate = (timestamp) => {
      const dateObject = new Date(timestamp);
      //console.log("Date Obj",dateObject)
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObject.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const formatTime=(timeStamp)=>{
      const dateObject = new Date(timeStamp);
      //console.log("Date Obj",dateObject)
      const hour = dateObject.getHours().toString().padStart(2, "0");
      const min = dateObject.getMinutes().toString().padStart(2, "0");
      const sec = dateObject.getSeconds().toString().padStart(2, "0")
      return `${hour}:${min}:${sec}`;
    }
    const formatDateTime=(timestamp)=>{
      const dateObject = new Date(timestamp);
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObject.getFullYear();
      const hour = dateObject.getHours();
      const min = dateObject.getMinutes();
      const sec = dateObject.getSeconds().toString().padStart(2, "0")
      return `${day}-${month}-${year} ${hour}:${min}:${sec}`;
    }
    if(historyPort?.portfoliosList !== undefined){
      const formattedDataArray = historyPort?.portfoliosList.map((item) => ({
        ...item,
        createDate: formatDate(item.createDateTime),
        createTime: formatTime(item.createDateTime)
      }));
        setPortfolioAction(formattedDataArray)
    }
    if(historyPort?.devicesHistoryActive !== undefined){
      const formattedDataArray = historyPort?.devicesHistoryActive.map((item) => ({
        ...item,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        expireDate:formatDate(item.expireDate),
        latestUpdate: formatDateTime(item.latestUpdate)
      }));
        setDevicesCurrent(formattedDataArray)
    }
    if(historyPort?.devicesHistoryInActive !== undefined){
      const formattedDataArray = historyPort?.devicesHistoryInActive.map((item) => ({
        ...item,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        expireDate:formatDate(item.expireDate),
        latestUpdate: formatDateTime(item.latestUpdate)
      }));
        setDevicePast(formattedDataArray)
    }
    if(historyPort?.subscribersHistoryActive !== undefined){
      const formattedDataArray = historyPort?.subscribersHistoryActive.map((item) => ({
        ...item,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        retailEsaEndDate:formatDate(item.retailEsaEndDate),
        latestUpdate: formatDateTime(item.latestUpdate)
      }));
        setSubscriberCurrent(formattedDataArray)
    }
    if(historyPort?.subscribersHistoryInActive !== undefined){
      const formattedDataArray = historyPort?.subscribersHistoryInActive.map((item) => ({
        ...item,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        retailEsaEndDate:formatDate(item.retailEsaEndDate),
        latestUpdate: formatDateTime(item.latestUpdate)
      }));
        setSubscriberPast(formattedDataArray)
    }
    console.log("Sample Data",sampleData)
  },[historyPort])

  const statusList = [
    {
      id: 1,
      statusName: "Active",
    },
    {
      id: 2,
      statusName: "InActive",
    },
  ];

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsAction = [
    {
      id: "action",
      label: "Action",
      align: "left",
      width: "200px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <style>{`
    .highlight {
      background-color: yellow;
      font-weight: bold;
    }
  `}</style>
          <div
            className="font-semibold	break-words"
            style={{
              // whiteSpace: "nowrap",
              // overflow: "hidden",
              // textOverflow: "ellipsis",
              maxWidth: "300px",
            }}
          >
            <Highlighter
              highlightTag={Highlight}
              searchWords={[searchQuery]}
              autoEscape={true}
              textToHighlight={row.action}
            />
          </div>
        </div>
      ),
    },
    {
      id: "createBy",
      label: "Create By",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.createBy}
        />
      ),
    },

    {
      id: "date",
      label: "Date",
      width: "100px",
      render: (row) => (
        <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQuery]}
            autoEscape={true}
            textToHighlight={row.createDate}
          />
      ),
    },
    {
      id: "time",
      label: "Time",
      render: (row) => (
        <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQuery]}
            autoEscape={true}
            textToHighlight={row.createTime}
          />
      ),
    },
    {
      id: "document",
      label: "Document",
      render: (row) => (
        <div className="flex justify-center mr-3 items-center" >
          <div>
          <button type="button" style={{ display: row.guid !== null ? '' : 'none' }} onClick={()=>handleFilePreview(row.guid)}>
            <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
          </button>
          </div>
          <div className="ml-3">
            <button type="button" style={{ display: row.guid !== null ? '' : 'none' }} onClick={()=>handleDownloadFileHistory(row.guid)}>
              <LiaDownloadSolid className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
            </button>
          </div>
        </div>
      ),
    },
    // Add more columns as needed
  ];

  const columnActiveDevice = [
    {
      id: "name",
      label: "Name",
      width: "200px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDeviceCurrent]}
          autoEscape={true}
          textToHighlight={row.name}
        />
      ),
    },
    {
      id: "expireDate",
      label: "Expire Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDeviceCurrent]}
          autoEscape={true}
          textToHighlight={row.expireDate}
        />
      ),
    },
    {
      id: "action",
      label: "Action",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDeviceCurrent]}
          autoEscape={true}
          textToHighlight={row.action}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDeviceCurrent]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDeviceCurrent]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
    {
      id: "lastDate",
      label: "Lastes Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDeviceCurrent]}
          autoEscape={true}
          textToHighlight={row.latestUpdate}
        />
      ),
    },
  ];

  const columnInactiveDevice = [
    {
      id: "name",
      label: "Name",
      width: "200px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDevicePast]}
          autoEscape={true}
          textToHighlight={row.name}
        />
      ),
    },
    {
      id: "expireDate",
      label: "Expire Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDevicePast]}
          autoEscape={true}
          textToHighlight={row.expireDate}
        />
      ),
    },
    {
      id: "action",
      label: "Action",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDevicePast]}
          autoEscape={true}
          textToHighlight={row.action}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDevicePast]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDevicePast]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
    {
      id: "lastDate",
      label: "Lastes Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryDevicePast]}
          autoEscape={true}
          textToHighlight={row.latestUpdate}
        />
      ),
    },
  ];

  const columnActiveSubscriber = [
    {
      id: "name",
      label: "Name",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberCurrent]}
          autoEscape={true}
          textToHighlight={row.name}
        />
      ),
    },
    {
      id: "retailEndDate",
      label: "Retail ESA End Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberCurrent]}
          autoEscape={true}
          textToHighlight={row.retailEsaEndDate}
        />
      ),
    },
    {
      id: "action",
      label: "Action",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberCurrent]}
          autoEscape={true}
          textToHighlight={row.action}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberCurrent]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberCurrent]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
    {
      id: "lastDate",
      label: "Lastes Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberCurrent]}
          autoEscape={true}
          textToHighlight={row.latestUpdate}
        />
      ),
    },
  ];

  const columnInactiveSubscriber = [
    {
      id: "name",
      label: "Name",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberPast]}
          autoEscape={true}
          textToHighlight={row.name}
        />
      ),
    },
    {
      id: "retailEndDate",
      label: "Retail ESA End Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberPast]}
          autoEscape={true}
          textToHighlight={row.retailEsaEndDate}
        />
      ),
    },
    {
      id: "action",
      label: "Action",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberPast]}
          autoEscape={true}
          textToHighlight={row.action}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberPast]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberPast]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
    {
      id: "lastDate",
      label: "Lastes Date",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuerySubscriberPast]}
          autoEscape={true}
          textToHighlight={row.latestUpdate}
        />
      ),
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDeviceCurrent, setSearchQueryDeviceCurrent] = useState("");
  const [searchQueryDevicePast, setSearchQueryDevicePast] = useState("");
  const [searchQuerySubscriberCurrent, setSearchQuerySubscriberCurrent] = useState("");
  const [searchQuerySubscriberPast, setSearchQuerySubscriberPast] = useState("");
  const portfolioEdit = (data) => {
    console.log("Manage == ", data);
    navigate(WEB_URL.SUBSCRIBER_INFO);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChangeDeviceCurrent = (e) => {
    setSearchQueryDeviceCurrent(e.target.value);
  };
  const handleSearchChangeDevicePast = (e) => {
    setSearchQueryDevicePast(e.target.value);
  };
  const handleSearchChangeSubscriberCurrent = (e) => {
    setSearchQuerySubscriberCurrent(e.target.value);
  };
  const handleSearchChangeSubscriberPast = (e) => {
    setSearchQuerySubscriberPast(e.target.value);
  };

  const handleFilePreview =(guid)=>{
    console.log("Preview File")
    showLoading();
    dispatch(PortfolioHistoryFile(guid, (res)=>{
      //console.log("Res call back",res)
      openPDFInNewTab(res.data?.binary,res.data?.type,res.data?.name)
      hideLoading();
    }))
    //isPreview.current = true
  }

  const openPDFInNewTab = (base64String,type,filename) => {
    const pdfWindow = window.open("");
    console.log("PDF",pdfWindow)
    console.log(base64String)
    console.log(type)
    if (pdfWindow) {
      // Set the title of the new tab to the filename
      pdfWindow.document.title = filename;
  
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
      let name = filename
  
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
  };
  const handleDownloadFileHistory=(guid)=>{
    console.log("Download File")
    showLoading();
    dispatch(PortfolioHistoryFile(guid,(res)=>{
      console.log("res back",res.data)
      downloadFile(res.data)
      hideLoading();
    }))
    //isDownload.current = true
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

  function convertToDate(dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  /*const handleChangeStatus = (value) => {
    if (value?.length == 1) {
      if (value[0]?.id == 1) {
        const now = new Date();
        const _now = now.setHours(0, 0, 0, 0);
        const filtered = dashboardList.filter((item) => {
          const [day, month, year] = item.endDate.split("/");
          const endDate = new Date(`${year}-${month}-${day}`);
          const _endDate = endDate.setHours(0, 0, 0, 0);
          return _endDate >= _now;
        });
        setDashboardList(filtered);
      } else {
        const now = new Date();
        const _now = now.setHours(0, 0, 0, 0);
        const filtered = dashboardList.filter((item) => {
          const [day, month, year] = item.endDate.split("/");
          const endDate = new Date(`${year}-${month}-${day}`);
          const _endDate = endDate.setHours(0, 0, 0, 0);
          return _endDate < _now;
        });
        setDashboardList(filtered);
      }
    } else {
      const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const formattedDataArray = dashboardDataList.map((item) => ({
        ...item,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
      }));
      setDashboardList(formattedDataArray);
    }
  };*/

  const handleClickAddPortfolio = () => {
    dispatch(setSelectedSubMenu(2));
    setCookie("currentSubmenu", 2);
    navigate(WEB_URL.PORTFOLIO_ADD);
  };
  const SelectorDeviceTab = (tab) => {
    //console.log("Take Action")
    setTabDevice(tab);
  };
  const SelectorSubscriberTab = (tab) => {
    //console.log("Take Action")
    setTabSubscriber(tab);
  };
  const splitDate=(date)=>{
    //console.log(date)
    if(date !== undefined){
    const dateToText = date.toString()
    const dates = dateToText.split("T")[0]
    const dateSplit = dates.split("-")
    const year = dateSplit[0]
    const month = dateSplit[1]
    const day = dateSplit[2]
     
    return day+"-"+month+"-"+year
    }
  }
  const splitTime=(date)=>{
    if(date !== undefined){
    const dateToText = date.toString()
    const time = dateToText.split("T")[1]
    const timeFull = time.split(".")[0]
    return timeFull
    }
  }
  const splitTimeNoMilsec=(date)=>{
    const dateToText = date.toString()
    const time = dateToText.split("T")[1]
    return time
  }
  const handleFileChange =(guid)=>{
    /*showLoading();
    dispatch(GetBinaryFileHistory(guid, (res)=>{
      console.log("Res call back",res)
      openPDFInNewTab(res.data?.binary,res.data?.type,res.data?.name)
      hideLoading();
    }))*/
    //isPreview.current = true
  }
  const handleDownloadFile=(guid)=>{
    //showLoading();
    /*dispatch(GetBinaryFileHistory(guid,(res)=>{
      downloadFile(res.data)
      hideLoading();
    }))*/
    //isDownload.current = true
  }
  const exportexcelDeviceCurrent=(data,query,issub,name)=>{
    // ฟังก์ชันสำหรับคำนวณความกว้างสูงสุดของคอลัมน์
    const getMaxWidth = (data, key) => {
      // หาความยาวสูงสุดของข้อมูลในคอลัมน์นั้น ๆ รวมถึงความยาวของ header
      return Math.max(...data.map(item => (item[key] || '').toString().length), key.length);
    };
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
    const filename = details?.portfolioInfo?.portfolioName+"_"+name+"_"+formattedDateTime+".xlsx"
    if(issub === true){
        const filteredData = data?.filter((obj) => {
          for (let key in obj) {
            if (key === "id") continue;
            if (key == "subscriberTypeId") {
              if (String(obj[key]) == 1) {
                return "Subscriber".toLowerCase().includes(query?.toLowerCase());
              } else if (String(obj[key]) == 2) {
                return "Aggregate Subscriber"
                  .toLowerCase()
                  .includes(query?.toLowerCase());
              }
            } else if (key == "contractedEnergy") {
              let contractedEnergy = obj[key];
              if (contractedEnergy != null) {
                if (
                  numeral(String(obj[key]).toLowerCase())
                    .value()
                    .toString()
                    .includes(numeral(query).value())
                ) {
                  return true;
                }
              }
            } else if (key == "capacity") {
              let capacity = obj[key];
              if (capacity != null) {
                if (
                  numeral(String(obj[key]).toLowerCase())
                    .value()
                    .toString()
                    .includes(numeral(query).value())
                ) {
                  return true;
                }
              }
            } else if (key == "allocateEnergyAmount") {
              let allocateEnergyAmount = obj[key];
              if (allocateEnergyAmount != null) {
                if (
                  numeral(String(obj[key]).toLowerCase())
                    .value()
                    .toString()
                    .includes(numeral(query).value())
                ) {
                  return true;
                }
              }
            } else {
              /*  else if (key == "currentSettlement") {
              if (
                dayjs(obj[key], "YYYY-M")
                  .format("MMMM YYYY")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return true;
              }
            }  */
              if (
                String(obj[key]).toLowerCase().includes(query?.toLowerCase())
              ) {
                return true;
              }
              // Object?.values(obj)?.some((value) =>
              //   value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
              // );
            }
          }
        });
        console.log("Data export",filteredData)
        if(filteredData.length !== 0){
          const tempDataSub = filteredData.map(({ name, retailEsaEndDate,action,startDate,endDate,latestUpdate }) => ({ name, retailEsaEndDate,action,startDate,endDate,latestUpdate }));
          console.log("Temp Data",tempDataSub)
          // แปลงข้อมูลเป็นรูปแบบ worksheet
          const worksheet = utils.json_to_sheet(tempDataSub);
          //const worksheet = utils.json_to_sheet(tempDataSub);
          utils.sheet_add_aoa(worksheet, [['Name', 'Retail ESA End Date', 'Action','Start Date','End Date','Lastest Update']], { origin: 'A1' });
          console.log('Worksheet:', worksheet); 
          worksheet['!cols'] = [
            { wch: getMaxWidth(tempDataSub, 'name') },
            { wch: getMaxWidth(tempDataSub, 'retailEsaEndDate') },
            { wch: getMaxWidth(tempDataSub, 'action') },
            { wch: getMaxWidth(tempDataSub, 'startDate') },
            { wch: getMaxWidth(tempDataSub, 'endDate') },
            { wch: getMaxWidth(tempDataSub, 'latestUpdate') },
          ];
          // สร้าง workbook
          const workbook = utils.book_new();
          // เพิ่ม worksheet ไปยัง workbook
          utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          // สร้างและดาวน์โหลดไฟล์ Excel
          writeFile(workbook, filename);
        }
        else{
          const tempdataSub = [{
            name: "",
            retailEsaEndDate: "",
            action: "",
            startDate: "",
            endDate: "",
            latestUpdate: ""
          }]
          // แปลงข้อมูลเป็นรูปแบบ worksheet
          const worksheet = utils.json_to_sheet(tempdataSub);
          //const worksheet = utils.json_to_sheet(tempDataSub);
          utils.sheet_add_aoa(worksheet, [['Name', 'Retail ESA End Date', 'Action','Start Date','End Date','Lastest Update']], { origin: 'A1' });
          worksheet['!cols'] = [
            { wch: getMaxWidth(tempdataSub, 'name') },
            { wch: getMaxWidth(tempdataSub, 'retailEsaEndDate') },
            { wch: getMaxWidth(tempdataSub, 'action') },
            { wch: getMaxWidth(tempdataSub, 'startDate') },
            { wch: getMaxWidth(tempdataSub, 'endDate') },
            { wch: getMaxWidth(tempdataSub, 'latestUpdate') },
          ];
          // สร้าง workbook
          const workbook = utils.book_new();
          // เพิ่ม worksheet ไปยัง workbook
          utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          // สร้างและดาวน์โหลดไฟล์ Excel
          writeFile(workbook, filename);
        }
        
    }
    else{
      const filteredData = data?.filter((obj) => {
        for (let key in obj) {
          if (key === "id") continue;
          if (key == "subscriberTypeId") {
            if (String(obj[key]) == 1) {
              return "Subscriber".toLowerCase().includes(query?.toLowerCase());
            } else if (String(obj[key]) == 2) {
              return "Aggregate Subscriber"
                .toLowerCase()
                .includes(query?.toLowerCase());
            }
          } else if (key == "contractedEnergy") {
            let contractedEnergy = obj[key];
            if (contractedEnergy != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(query).value())
              ) {
                return true;
              }
            }
          } else if (key == "capacity") {
            let capacity = obj[key];
            if (capacity != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(query).value())
              ) {
                return true;
              }
            }
          } else if (key == "allocateEnergyAmount") {
            let allocateEnergyAmount = obj[key];
            if (allocateEnergyAmount != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(query).value())
              ) {
                return true;
              }
            }
          } else {
            /*  else if (key == "currentSettlement") {
            if (
              dayjs(obj[key], "YYYY-M")
                .format("MMMM YYYY")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return true;
            }
          }  */
            if (
              String(obj[key]).toLowerCase().includes(query?.toLowerCase())
            ) {
              return true;
            }
            // Object?.values(obj)?.some((value) =>
            //   value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            // );
          }
        }
      });
      console.log("Data export",filteredData)
      if(filteredData.length !== 0){
        const tempDataDevice = filteredData.map(({ name, expireDate,action,startDate,endDate,latestUpdate }) => ({ name, expireDate,action,startDate,endDate,latestUpdate }));
        
        // แปลงข้อมูลเป็นรูปแบบ worksheet
        const worksheet = utils.json_to_sheet(tempDataDevice);
        utils.sheet_add_aoa(worksheet, [['Name', 'Expire Date', 'Action','Start Date','End Date','Lastest Update']], { origin: 'A1' });
        worksheet['!cols'] = [
          { wch: getMaxWidth(tempDataDevice, 'name') },
          { wch: getMaxWidth(tempDataDevice, 'expireDate') },
          { wch: getMaxWidth(tempDataDevice, 'action') },
          { wch: getMaxWidth(tempDataDevice, 'startDate') },
          { wch: getMaxWidth(tempDataDevice, 'endDate') },
          { wch: getMaxWidth(tempDataDevice, 'latestUpdate') },
        ];
        // สร้าง workbook
        const workbook = utils.book_new();
        // เพิ่ม worksheet ไปยัง workbook
        utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        // สร้างและดาวน์โหลดไฟล์ Excel
        writeFile(workbook, filename);
      }
      else{
        const tempdataSDevice = [{
          name: "",
          expireDate: "",
          action: "",
          startDate: "",
          endDate: "",
          latestUpdate: ""
        }]
        // แปลงข้อมูลเป็นรูปแบบ worksheet
        const worksheet = utils.json_to_sheet(tempdataSDevice);
        utils.sheet_add_aoa(worksheet, [['Name', 'Expire Date', 'Action','Start Date','End Date','Lastest Update']], { origin: 'A1' });
        worksheet['!cols'] = [
          { wch: getMaxWidth(tempdataSDevice, 'name') },
          { wch: getMaxWidth(tempdataSDevice, 'expireDate') },
          { wch: getMaxWidth(tempdataSDevice, 'action') },
          { wch: getMaxWidth(tempdataSDevice, 'startDate') },
          { wch: getMaxWidth(tempdataSDevice, 'endDate') },
          { wch: getMaxWidth(tempdataSDevice, 'latestUpdate') },
        ];
        // สร้าง workbook
        const workbook = utils.book_new();
        // เพิ่ม worksheet ไปยัง workbook
        utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        // สร้างและดาวน์โหลดไฟล์ Excel
        writeFile(workbook, filename);
      }
      
    }
    
    
  }
  const exportexcelDevicePast=(data)=>{
    const filteredData = data?.filter((obj) => {
        for (let key in obj) {
          if (key === "id") continue;
          if (key == "subscriberTypeId") {
            if (String(obj[key]) == 1) {
              return "Subscriber".toLowerCase().includes(searchQuery?.toLowerCase());
            } else if (String(obj[key]) == 2) {
              return "Aggregate Subscriber"
                .toLowerCase()
                .includes(searchQuery?.toLowerCase());
            }
          } else if (key == "contractedEnergy") {
            let contractedEnergy = obj[key];
            if (contractedEnergy != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchQuery).value())
              ) {
                return true;
              }
            }
          } else if (key == "capacity") {
            let capacity = obj[key];
            if (capacity != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchTerm).value())
              ) {
                return true;
              }
            }
          } else if (key == "allocateEnergyAmount") {
            let allocateEnergyAmount = obj[key];
            if (allocateEnergyAmount != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchQuery).value())
              ) {
                return true;
              }
            }
          } else {
            /*  else if (key == "currentSettlement") {
            if (
              dayjs(obj[key], "YYYY-M")
                .format("MMMM YYYY")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return true;
            }
          }  */
            if (
              String(obj[key]).toLowerCase().includes(searchQuery?.toLowerCase())
            ) {
              return true;
            }
            // Object?.values(obj)?.some((value) =>
            //   value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            // );
          }
        }
      });
    console.log("Data export",filteredData)
    // แปลงข้อมูลเป็นรูปแบบ worksheet
    const worksheet = utils.json_to_sheet(filteredData);
    // สร้าง workbook
    const workbook = utils.book_new();
    // เพิ่ม worksheet ไปยัง workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // สร้างและดาวน์โหลดไฟล์ Excel
    writeFile(workbook, 'data.xlsx');
  }
  const exportexcelSubscriberCurrent=(data)=>{
    const filteredData = data?.filter((obj) => {
        for (let key in obj) {
          if (key === "id") continue;
          if (key == "subscriberTypeId") {
            if (String(obj[key]) == 1) {
              return "Subscriber".toLowerCase().includes(searchQuery?.toLowerCase());
            } else if (String(obj[key]) == 2) {
              return "Aggregate Subscriber"
                .toLowerCase()
                .includes(searchQuery?.toLowerCase());
            }
          } else if (key == "contractedEnergy") {
            let contractedEnergy = obj[key];
            if (contractedEnergy != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchQuery).value())
              ) {
                return true;
              }
            }
          } else if (key == "capacity") {
            let capacity = obj[key];
            if (capacity != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchTerm).value())
              ) {
                return true;
              }
            }
          } else if (key == "allocateEnergyAmount") {
            let allocateEnergyAmount = obj[key];
            if (allocateEnergyAmount != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchQuery).value())
              ) {
                return true;
              }
            }
          } else {
            /*  else if (key == "currentSettlement") {
            if (
              dayjs(obj[key], "YYYY-M")
                .format("MMMM YYYY")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return true;
            }
          }  */
            if (
              String(obj[key]).toLowerCase().includes(searchQuery?.toLowerCase())
            ) {
              return true;
            }
            // Object?.values(obj)?.some((value) =>
            //   value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            // );
          }
        }
      });
    console.log("Data export",filteredData)
    // แปลงข้อมูลเป็นรูปแบบ worksheet
    const worksheet = utils.json_to_sheet(filteredData);
    // สร้าง workbook
    const workbook = utils.book_new();
    // เพิ่ม worksheet ไปยัง workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // สร้างและดาวน์โหลดไฟล์ Excel
    writeFile(workbook, 'data.xlsx');
  }
  const exportexcelSubscriberPast=(data)=>{
    const filteredData = data?.filter((obj) => {
        for (let key in obj) {
          if (key === "id") continue;
          if (key == "subscriberTypeId") {
            if (String(obj[key]) == 1) {
              return "Subscriber".toLowerCase().includes(searchQuery?.toLowerCase());
            } else if (String(obj[key]) == 2) {
              return "Aggregate Subscriber"
                .toLowerCase()
                .includes(searchQuery?.toLowerCase());
            }
          } else if (key == "contractedEnergy") {
            let contractedEnergy = obj[key];
            if (contractedEnergy != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchQuery).value())
              ) {
                return true;
              }
            }
          } else if (key == "capacity") {
            let capacity = obj[key];
            if (capacity != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchTerm).value())
              ) {
                return true;
              }
            }
          } else if (key == "allocateEnergyAmount") {
            let allocateEnergyAmount = obj[key];
            if (allocateEnergyAmount != null) {
              if (
                numeral(String(obj[key]).toLowerCase())
                  .value()
                  .toString()
                  .includes(numeral(searchQuery).value())
              ) {
                return true;
              }
            }
          } else {
            /*  else if (key == "currentSettlement") {
            if (
              dayjs(obj[key], "YYYY-M")
                .format("MMMM YYYY")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return true;
            }
          }  */
            if (
              String(obj[key]).toLowerCase().includes(searchQuery?.toLowerCase())
            ) {
              return true;
            }
            // Object?.values(obj)?.some((value) =>
            //   value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            // );
          }
        }
      });
    console.log("Data export",filteredData)
    // แปลงข้อมูลเป็นรูปแบบ worksheet
    const worksheet = utils.json_to_sheet(filteredData);
    // สร้าง workbook
    const workbook = utils.book_new();
    // เพิ่ม worksheet ไปยัง workbook
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // สร้างและดาวน์โหลดไฟล์ Excel
    writeFile(workbook, 'data.xlsx');
  }
  //console.log("Port Action",portfolioAction)
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                {details?.detailInfoList?.portfolioInfo?.portfolioName}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Portfolio Management / Portfolio Info
                / {details?.detailInfoList?.portfolioInfo?.portfolioName} /
                History Log
              </p>
            </div>

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="0"
            >
              <div className="p-4 flex w-full h-full">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    <div
                      id="top-div"
                      className="md:col-span-4  lg:col-span-4 flex  m-0 items-center gap-3"
                    >
                      <FaChevronCircleLeft
                        className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                        size="30"
                        onClick={() =>
                          navigate(WEB_URL.PORTFOLIO_INFO, {
                            state: { id: state?.code },
                          })
                        }
                      />
                      <span className=" mr-14	leading-tight w-70">
                        <b className="text-xl"> Portfolio Info </b>
                        <b className="text-base text-[#A3B587]">
                          {" "}
                          | History Log{" "}
                        </b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top" />
            </Card>

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              {/* {Portfolio Table Content} */}
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="col-span-2 mb-4">
                    <span className="font-bold text-lg">
                      Portfolio
                      <br />
                    </span>
                  </div>

                  <div className="grid col-span-4 grid-cols-12">
                    <form className="grid col-span-12 grid-cols-12 gap-2 ">
                      {/* <div className="col-span-3 px-2"></div> */}
                      {!isPortManager && <div className="col-span-4"></div>}
                      <div className="col-span-4"></div>
                      <div className="col-span-4">
                        <Controller
                          name="SearchText"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <SearchBox
                              placeholder="Search"
                              onChange={handleSearchChange}
                            />
                          )}
                        />
                      </div>
                      <div className="col-span-4"></div>
                    </form>
                  </div>
                </div>

                <DataTable
                  data={portfolioAction}
                  columns={columnsAction}
                  searchData={searchQuery}
                  checkbox={false}
                />
              </div>

              {/* {Devices in Portfolio Table Content} */}
              <div className="text-sm mt-5">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="col-span-2 mb-4">
                    <span className="font-bold text-lg">
                      Devices in Portfolio
                      <br />
                    </span>
                  </div>

                  <div className="grid col-span-4 grid-cols-12"></div>
                </div>
                <div className="mt-4 pl-1 flex">
                  <div
                    className={
                      tabDevice === "current"
                        ? " w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center "
                        : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px] text-center border-none"
                    }
                  >
                    <button
                      className={
                        tabDevice === "current"
                          ? "font-bold"
                          : "text-[#949292] font-thin"
                      }
                      onClick={() => SelectorDeviceTab("current")}
                    >
                      Current Devices
                    </button>
                  </div>
                  <div
                    className={
                      tabDevice === "past"
                        ? "w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#f1b1ab] text-center ml-2 "
                        : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px]  text-center ml-2 border-none "
                    }
                  >
                    <button
                      className={
                        tabDevice === "past"
                          ? "font-bold"
                          : "text-[#949292] font-thin"
                      }
                      onClick={() => SelectorDeviceTab("past")}
                    >
                      Past Devices
                    </button>
                  </div>
                </div>
                {tabDevice === "current" ? (
                  <div className="border-t-4 border-solid border-t-[#87BE33] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                    <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6 mt-2">
                      <div className="col-span-2 mb-4">
                        <span className="font-bold text-lg">
                            
                          <br />
                        </span>
                      </div>

                      <div className="grid col-span-4 grid-cols-12">
                        <form className="grid col-span-12 grid-cols-12 gap-2 ">
                          {/* <div className="col-span-3 px-2"></div> */}
                          {/*!isPortManager && <div className="col-span-4"></div>*/}
                          <div className="col-span-4"></div>
                          <div className="col-span-4">
                            <Controller
                              name="SearchTextDeviceCurr"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <SearchBoxPortfolio
                                  placeholder="Search"
                                  onChange={handleSearchChangeDeviceCurrent}
                                  value={searchQueryDeviceCurrent}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-4">
                            <button
                                onClick={(e) => {e.preventDefault(); exportexcelDeviceCurrent(devicesCurrent,searchQueryDeviceCurrent,false,"CurrentDevice");}}
                              className={
                                " rounded w-full shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
                              }
                            >
                              <FaFileExcel className="inline-block mr-2" />
                              Export Excel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <DataTable
                      data={devicesCurrent}
                      columns={columnActiveDevice}
                      searchData={searchQueryDeviceCurrent}
                      checkbox={false}
                    />
                  </div>
                ) : (
                  <div className="border-t-4 border-solid border-t-[#f1b1ab] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                    <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6 mt-2">
                      <div className="col-span-2 mb-4">
                        <span className="font-bold text-lg">
                            
                          <br />
                        </span>
                      </div>

                      <div className="grid col-span-4 grid-cols-12">
                        <form className="grid col-span-12 grid-cols-12 gap-2 ">
                          {/* <div className="col-span-3 px-2"></div> */}
                          {/*!isPortManager && <div className="col-span-4"></div>*/}
                          <div className="col-span-4"></div>
                          <div className="col-span-4">
                            <Controller
                              name="SearchTextDevicePast"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <SearchBoxPortfolio
                                  placeholder="Search"
                                  onChange={handleSearchChangeDevicePast}
                                  value={searchQueryDevicePast}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-4">
                            <button
                                onClick={(e) => {e.preventDefault(); exportexcelDeviceCurrent(devicePast,searchQueryDevicePast,false,"PastDevice");}}
                              className={
                                " rounded w-full shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
                              }
                            >
                              <FaFileExcel className="inline-block mr-2" />
                              Export Excel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <DataTable
                      data={devicePast}
                      columns={columnInactiveDevice}
                      searchData={searchQueryDevicePast}
                      checkbox={false}
                    />
                  </div>
                )}
              </div>

              {/* {Subscribers in Portfolio Table Content} */}
              <div className="text-sm mt-5">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="col-span-2 mb-4">
                    <span className="font-bold text-lg">
                      Subscribers in Portfolio
                      <br />
                    </span>
                  </div>

                  <div className="grid col-span-4 grid-cols-12"></div>
                </div>
                <div className="mt-4 pl-1 flex">
                  <div
                    className={
                      tabSubscriber === "current"
                        ? " w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center "
                        : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px] text-center border-none"
                    }
                  >
                    <button
                      className={
                        tabSubscriber === "current"
                          ? "font-bold"
                          : "text-[#949292] font-thin"
                      }
                      onClick={() => SelectorSubscriberTab("current")}
                    >
                      Current Subscriber
                    </button>
                  </div>
                  <div
                    className={
                      tabSubscriber === "past"
                        ? "w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#f1b1ab] text-center ml-2 "
                        : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px]  text-center ml-2 border-none "
                    }
                  >
                    <button
                      className={
                        tabSubscriber === "past"
                          ? "font-bold"
                          : "text-[#949292] font-thin"
                      }
                      onClick={() => SelectorSubscriberTab("past")}
                    >
                      Past Subscriber
                    </button>
                  </div>
                </div>
                {tabSubscriber === "current" ? (
                  <div className="border-t-4 border-solid border-t-[#87BE33] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                    <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6 mt-2">
                      <div className="col-span-2 mb-4">
                        <span className="font-bold text-lg">
                          <br />
                        </span>
                      </div>

                      <div className="grid col-span-4 grid-cols-12">
                        <form className="grid col-span-12 grid-cols-12 gap-2 ">
                          {/* <div className="col-span-3 px-2"></div> */}
                          {!isPortManager && <div className="col-span-4"></div>}
                          <div className="col-span-4"></div>
                          <div className="col-span-4">
                            <Controller
                              name="SearchTextSubCurr"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <SearchBoxPortfolio
                                  placeholder="Search"
                                  onChange={handleSearchChangeSubscriberCurrent}
                                  value={searchQuerySubscriberCurrent}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-4">
                            <button
                            onClick={(e) => {e.preventDefault(); exportexcelDeviceCurrent(subscriberCurrent,searchQuerySubscriberCurrent,true,"CurrentSubscriber");}}
                              className={
                                " rounded w-full shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
                              }
                            >
                              <FaFileExcel className="inline-block mr-2" />
                              Export Excel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <DataTable
                      data={subscriberCurrent}
                      columns={columnActiveSubscriber}
                      searchData={searchQuerySubscriberCurrent}
                      checkbox={false}
                    />
                  </div>
                ) : (
                  <div className="border-t-4 border-solid border-t-[#f1b1ab] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                    <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6 mt-2">
                      <div className="col-span-2 mb-4">
                        <span className="font-bold text-lg">
                          <br />
                        </span>
                      </div>

                      <div className="grid col-span-4 grid-cols-12">
                        <form className="grid col-span-12 grid-cols-12 gap-2 ">
                          {/* <div className="col-span-3 px-2"></div> */}
                          {!isPortManager && <div className="col-span-4"></div>}
                          <div className="col-span-4"></div>
                          <div className="col-span-4">
                            <Controller
                              name="SearchTextSubPast"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <SearchBoxPortfolio
                                  placeholder="Search"
                                  onChange={handleSearchChangeSubscriberPast}
                                  value={searchQuerySubscriberPast}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-4">
                            <button
                            onClick={(e) => {e.preventDefault(); exportexcelDeviceCurrent(subscriberPast,searchQuerySubscriberPast,true,"PastSubscriber");}}
                              className={
                                " rounded w-full shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
                              }
                            >
                              <FaFileExcel className="inline-block mr-2" />
                              Export Excel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <DataTable
                      data={subscriberPast}
                      columns={columnInactiveSubscriber}
                      searchData={searchQuerySubscriberPast}
                      checkbox={false}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
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

export default HistoryPortfolio;

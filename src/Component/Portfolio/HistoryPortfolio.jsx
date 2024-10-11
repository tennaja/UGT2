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
  PortfolioHistory
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

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const details = useSelector((state) => state.portfolio.detailInfoList);
  
  const [isPortManager, setIsPortManager] = useState(false);
  const userData = useSelector((state) => state.login.userobj);
  const historyPort = useSelector((state) => state.portfolio.historyPort);
  console.log("detail History",historyPort)
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
    /*setPortfolioAction([{
        action:"Create",
        createBy:"test",
        createDateTime:"2024-10-10T14:00:00.000",
        portfolioId:11
    }])*/
    setPortfolioAction(historyPort?.portfoliosList)
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
          highlightTag={Highlight}
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={splitDate(row.createDateTime)}
        />
      ),
    },
    {
      id: "time",
      label: "Time",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={splitTime(row.createDateTime)}
        />
      ),
    },
    {
      id: "document",
      label: "Document",
      render: (row) => (
        <div className="flex justify-center mr-3 items-center">
          <div>
          <button type="button">
            <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
          </button>
          </div>
          <div className="ml-3">
            <button type="button">
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
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
        />
      ),
    },
  ];

  const columnInactiveDevice = [
    {
      id: "name",
      label: "Name",
      width: "150px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
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
          searchWords={[searchQuery]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
        />
      ),
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const portfolioEdit = (data) => {
    console.log("Manage == ", data);
    navigate(WEB_URL.SUBSCRIBER_INFO);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
    const [dates,times] = date.split("T")
    const [year, month,day] = dates.split("-")
    return day+"-"+month+"-"+year
  }
  const splitTime=(date)=>{
    const [dates,time] = date.split("T")
    const times = time.split(".")
    return times
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
  const exportexcelDeviceCurrent=(data)=>{
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

                <DataTablePortfolio
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
                          <div className="col-span-4">
                            <button
                                onClick={(e) => {e.preventDefault(); exportexcelDeviceCurrent(dashboardList);}}
                              className={
                                " rounded shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
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
                      data={dashboardList}
                      columns={columnActiveDevice}
                      searchData={searchQuery}
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
                          <div className="col-span-4">
                            <button
                                onClick={(e) => {e.preventDefault(); exportexcelDevicePast(dashboardList);}}
                              className={
                                " rounded shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
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
                      data={dashboardList}
                      columns={columnInactiveDevice}
                      searchData={searchQuery}
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
                          <div className="col-span-4">
                            <button
                            onClick={(e) => {e.preventDefault(); exportexcelSubscriberCurrent(dashboardList);}}
                              className={
                                " rounded shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
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
                      data={dashboardList}
                      columns={columnActiveSubscriber}
                      searchData={searchQuery}
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
                          <div className="col-span-4">
                            <button
                            onClick={(e) => {e.preventDefault(); exportexcelSubscriberPast(dashboardList);}}
                              className={
                                " rounded shadow-sm px-4 py-[6px] font-semibold hover:text-white sm:text-sm hover:bg-[#4D6A00] border-3 border-solid border-[#4D6A00] text-[#4D6A00]"
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
                      data={dashboardList}
                      columns={columnInactiveSubscriber}
                      searchData={searchQuery}
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

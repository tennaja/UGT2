import React, { useEffect, useRef, useState } from "react";
import { Card } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import SubscriberLOGO01 from "../assets/3-User.svg";
import SubscriberLOGO02 from "../assets/contractenergy.svg";
import SubscriberLOGO03 from "../assets/accumconsum.svg";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PaginatedItems from "../Control/Table/Pagination";
import * as WEB_URL from "../../Constants/WebURL";
import addLogoWhite from "../assets/Add-User.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Multiselect from "../Control/Multiselect";
import MySelect from "../Control/Select"
import { setCookie } from "../../Utils/FuncUtils";
import {
  SUB_MENU_ID,
  USER_GROUP_ID,
  UTILITY_GROUP_ID,
} from "../../Constants/Constants";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import {
  SubscriberManagementdashboard,
  SubscriberManagementAssign,
  SubscriberManagementUnassign,
  SubscriberFilterList,
  GetBinaryFileHistory,
  FetchHistoryLogInactive,
  FetchHistoryLogActive,
  SubscriberInfo
} from "../../Redux/Subscriber/Action";
import LoadPage from "../Control/LoadPage";
import DataTable from "../Control/Table/DataTable";
import SearchBox from "../Control/SearchBox";
import StatusLabel from "../../Component/Control/StatusLabel";
import { CloseButton, Input } from "@mantine/core";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import MySelectSubscriber from "./SelectSubscriber";
import { hideLoading, showLoading } from "../../Utils/Utils";

import { FaChevronCircleLeft } from "react-icons/fa";
import { RiEyeLine } from "react-icons/ri";
import { LiaDownloadSolid } from "react-icons/lia";
import { FileImage } from "lucide-react";


const itemsPerPage = 200;

const HistorySubscriber = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [isOpenLoading, setIsOpenLoading] = useState(false);

  const [isSubscriberGroup, setIsSubscriberGroup] = useState(true);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const dashboardOBJ = useSelector((state) => state.subscriber?.subdashboard);
  const getAssignOBJ = useSelector((state) => state.subscriber?.assign);
  const getUnassignOBJ = useSelector((state) => state.subscriber?.unassign);
  const totalUnAssigned = useSelector(
    (state) => state.subscriber?.totalUnAssigned
  );
  const subscriberInfo = useSelector((state) => state.subscriber.detailInfoList)
  const historyActiveList = useSelector((state) => state.subscriber?.historyActiveList)
  const historyInactiveList = useSelector((state)=>state.subscriber?.historyInactiveList)
  const fileHistory = useSelector((state)=> state.subscriber.binaryFileHistory)
  const isPreview = useRef(false)
  const isDownload = useRef(false)

  const totalAssigned = useSelector((state) => state.subscriber?.totalAssigned);
  const filterList = useSelector((state) => state.subscriber?.filterList);
  const userData = useSelector((state) => state.login.userobj);
  const [isAssignedUtilityId, setIsAssignedUtilityId] = useState({
    utility: null,
  });
  const [isAssignedStatusId, setIsAssignedStatusId] = useState({
    status: null,
  });
  const [isUnassignedUtilityId, setIsUnassignedUtilityId] = useState({
    utility: null,
  });
  const [isUnassignedStatusId, setIsUnassignedStatusId] = useState({
    status: null,
  });
  const [isAssignedPortfolioId, setIsAssignedPortfolioId] = useState({
    portfolio: null,
  });
  const [isUnassignedPortfolioId, setIsUnassignedPortfolioId] = useState({
    portfolio: null,
  });
  const statusList = filterList?.findStatus;
  const portfolioList = filterList?.findPortfolio;
  const utilityList = filterList?.findUtility;

  const [searchQueryAssigned, setSearchQueryAssigned] = useState("");
  const [searchQueryUnAssigned, setSearchQueryUnAssigned] = useState("");

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsAssigned = [
    {
      id: "contractname",
      label: "Contracrt Name",
      align: "left",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold	break-words"
            style={{
              //  whiteSpace: "nowrap",
              // overflow: "hidden",
              // textOverflow: "ellipsis",
              maxWidth: "300px",
            }}
          >
            <Link
              state={{ id: row.subscriberId , contract:row.subscribersContractInformationId }}
              to={WEB_URL.SUBSCRIBER_HISTORY_INFO}
              
            >
              <label className="cursor-pointer text-[#87BE33] font-semibold hover:text-[#4D6A00]">
              <Highlighter
                highlightClassName="highlight"
                highlightTag={Highlight}
                searchWords={[searchQueryAssigned]}
                autoEscape={true}
                textToHighlight={row.contractName}
              />
              </label>
            </Link>
          </div>
          <style>{`
    .highlight {
      background-color: yellow;
      font-weight: bold;
    }
  `}</style>
        </div>
      ),
    },
    {
      id: "action",
      label: "Action",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.action}
          />
        </span>
      ),
    },
    {
      id: "createBy",
      label: "Create By",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.createBy}
          />
        </span>
      ),
    },
    {
      id: "date",
      label: "Date",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={getDate(row.createDateTime)}
          />
        </span>
      ),
    },
    {
      id: "time",
      label: "Time",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={getTime(row.createDateTime)}
          />
        </span>
      ),
    },
    {
      id: "document",
      label: "Document",
      render: (row) => (
        
        <div className="flex justify-center mr-3 items-center">
          <div>
          <button type="button" style={{ display: row.guid !== null ? '' : 'none' }}  onClick={()=>handleFileChange(row.guid)}>
            <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
          </button>
          </div>
          <div className="ml-3">
            <button type="button" style={{ display: row.guid !== null ? '' : 'none' }} onClick={()=>handleDownloadFile(row.guid)}>
              <LiaDownloadSolid className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
            </button>
          </div>
        </div>
        
      ),
    },
    // Add more columns as needed
  ];

  const columnsUnAssigned = [
    {
      id: "contractname",
      label: "Contracrt Name",
      align: "left",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold	break-words"
            style={{
              //  whiteSpace: "nowrap",
              // overflow: "hidden",
              // textOverflow: "ellipsis",
              maxWidth: "300px",
            }}
          >
            <Link
              state={{ id: row.subscriberId , contract:row.subscribersContractInformationId }}
              to={WEB_URL.SUBSCRIBER_HISTORY_INFO}
              
            >
              <label className="cursor-pointer text-[#87BE33] font-semibold hover:text-[#4D6A00]">
              <Highlighter
                highlightClassName="highlight"
                highlightTag={Highlight}
                searchWords={[searchQueryUnAssigned]}
                autoEscape={true}
                textToHighlight={row.contractName}
              />
              </label>
            </Link>
          </div>
          <style>{`
    .highlight {
      background-color: yellow;
      font-weight: bold;
    }
  `}</style>
        </div>
      ),
    },
    {
      id: "action",
      label: "Action",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={row.action}
          />
        </span>
      ),
    },
    {
      id: "createBy",
      label: "Create By",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={row.createBy}
          />
        </span>
      ),
    },
    {
      id: "date",
      label: "Date",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={getDate(row.createDateTime)}
          />
        </span>
      ),
    },
    {
      id: "time",
      label: "Time",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={getTime(row.createDateTime)}
          />
        </span>
      ),
    },
    {
      id: "document",
      label: "Document",
      render: (row) => (
        <div className="flex justify-center mr-3 items-center">
          <div>
          <button type="button" style={{ display: row.guid !== null ? '' : 'none' }} onClick={()=>handleFileChange(row.guid)}>
            <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
          </button>
          </div>
          <div className="ml-3">
            <button type="button" style={{ display: row.guid !== null ? '' : 'none' }} onClick={()=>handleDownloadFile(row.guid)}>
              <LiaDownloadSolid className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
            </button>
          </div>
        </div>
        
      ),
    },
    // Add more columns as needed
  ];

  const showDocument =(data)=>{
    let doc = ""
    if(data.guid !== null){
      doc = <div className="flex justify-center mr-3 items-center">
      <div>
      <button type="button"  onClick={()=>handleFileChange(data.guid)}>
        <RiEyeLine className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
      </button>
      </div>
      <div className="ml-3">
        <button type="button" onClick={()=>handleDownloadFile(data.guid)}>
          <LiaDownloadSolid className="inline-block w-5 h-5 mt-1 text-PRIMARY_TEXT"/>
        </button>
      </div>
    </div>
    }
    else{
      doc = <></>
    }

    return doc
  }

  useEffect(() => {
    const { hash, pathname, search } = location;
   
    if (WEB_URL.SUBSCRIBER_HISTORY == pathname) {
      dispatch(setSelectedSubMenu(SUB_MENU_ID.SUBSCRIBER_LIST_INFO));
      setCookie("currentSubmenu", SUB_MENU_ID.SUBSCRIBER_LIST_INFO);
      dispatch(
        SubscriberInfo(state?.code,state?.contract, () => {
          setIsOpenLoading(false);
          
        })
      );
    }
  }, []);

  useEffect(()=>{
    showLoading();
    dispatch(FetchHistoryLogActive(state.code))
    dispatch(FetchHistoryLogInactive(state.code))
    hideLoading();
  },[subscriberInfo])

  

  /*useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG
      ) {
        let permissFindUntilyty = { utility: [UTILITY_GROUP_ID.EGAT] };
        const paramDashboard = {
          findUtilityId: permissFindUntilyty,
          UgtGroupId: currentUGTGroup?.id,
        };
        dispatch(SubscriberManagementdashboard(paramDashboard));
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG
      ) {
        let permissFindUntilyty = { utility: [UTILITY_GROUP_ID.MEA] };
        const paramDashboard = {
          findUtilityId: permissFindUntilyty,
          UgtGroupId: currentUGTGroup?.id,
        };
        dispatch(SubscriberManagementdashboard(paramDashboard));
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG
      ) {
        let permissFindUntilyty = { utility: [UTILITY_GROUP_ID.PEA] };
        const paramDashboard = {
          findUtilityId: permissFindUntilyty,
          UgtGroupId: currentUGTGroup?.id,
        };
        dispatch(SubscriberManagementdashboard(paramDashboard));
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.ALL_MODULE_VIEWER
      ) {
        let permissFindUntilyty = { utility: [UTILITY_GROUP_ID.ALL] };
        const paramDashboard = {
          findUtilityId: permissFindUntilyty,
          UgtGroupId: currentUGTGroup?.id,
        };
        dispatch(SubscriberManagementdashboard(paramDashboard));
      }
    }
  }, [currentUGTGroup]);*/

  // assign table
  /*useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      console.log("Fetch assign")
      fetchTableAssign();
    }
  }, [currentUGTGroup, isAssignedStatusId, userData, isAssignedPortfolioId]);*/

  // unAssign table
  /*useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      console.log("Fetch Unassign")
      fetchTableUnassign();
    }
  }, [
    currentUGTGroup,
    isUnassignedStatusId,
    userData,
    isAssignedPortfolioId,
  ]);*/

  /*const fetchTableAssign = () => {
    if (currentUGTGroup?.id !== null) {
      let permissFindUntilyty = null;
      if (
        userData?.userGroup?.id === USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.PEA_DEVICE_MNG
      ) {
        if (userData?.userGroup?.id !== USER_GROUP_ID.PEA_SUBSCRIBER_MNG) {
          setIsSubscriberGroup(false);
        }
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.PEA] };
        const paramSubscriberAssign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.MEA_DEVICE_MNG
      ) {
        if (userData?.userGroup?.id !== USER_GROUP_ID.MEA_SUBSCRIBER_MNG) {
          setIsSubscriberGroup(false);
        }
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.MEA] };
        const paramSubscriberAssign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_DEVICE_MNG
      ) {
        if (userData?.userGroup?.id !== USER_GROUP_ID.EGAT_SUBSCRIBER_MNG) {
          setIsSubscriberGroup(false);
        }
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.EGAT] };
        const paramSubscriberAssign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        console.log("Param Filter",paramSubscriberAssign)
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.ALL_MODULE_VIEWER
      ) {
        setIsSubscriberGroup(false);
        permissFindUntilyty = { utility: [] };
        const paramSubscriberAssign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      }
    }
  };*/
  /*const fetchTableUnassign = () => {
    setIsOpenLoading(true);

    if (currentUGTGroup?.id !== null) {
      let permissFindUntilyty = null;
      if (
        userData?.userGroup?.id === USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.PEA_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.PEA] };
        const paramSubscriberUnassign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
            setIsOpenLoading(false);
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.MEA_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.MEA] };
        const paramSubscriberUnassign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
            setIsOpenLoading(false);
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.EGAT] };
        const paramSubscriberUnassign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
            setIsOpenLoading(false);
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.ALL_MODULE_VIEWER
      ) {
        permissFindUntilyty = { utility: [] };
        const paramSubscriberUnassign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          findPortfolioId: isAssignedPortfolioId,
          PageNumber: 1,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
            setIsOpenLoading(false);
          })
        );
      }
    }
  };*/
  /*const handleChangeAssignUtility = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = { ...isAssignedUtilityId, utility: currentFilter };
    setIsAssignedUtilityId(newCurrentFilter);
  };*/
  /*const handleChangeAssignPortfolio = (data) => {
    console.log("Data input",data)
    const currentFilter = data === null?null:data.id 
    console.log(currentFilter)
    const newCurrentFilter = {
      ...isAssignedPortfolioId,
      portfolio: [currentFilter],
    };
    const newNullFilter = {
      ...isAssignedPortfolioId,
      portfolio: null,
    }
    console.log("New Data",data === null?newNullFilter:newCurrentFilter)
    setIsAssignedPortfolioId(data === null?newNullFilter:newCurrentFilter);
  };*/
  /*const handleChangeAssignStatus = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = { ...isAssignedStatusId, status: currentFilter };
    setIsAssignedStatusId(newCurrentFilter);
  };*/
  /*const handleChangeUnassignUtility = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = {
      ...isUnassignedUtilityId,
      utility: currentFilter,
    };
    setIsUnassignedUtilityId(newCurrentFilter);
  };*/
  /*const handleChangeUnassignPortfolio = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = {
      ...isUnassignedPortfolioId,
      utility: currentFilter,
    };
    setIsUnassignedPortfolioId(newCurrentFilter);
  };*/
  /*const handleChangeUnassignStatus = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = { ...isUnassignedStatusId, status: currentFilter };
    setIsUnassignedStatusId(newCurrentFilter);
  };*/
  /*const handleClickSubscribRegistration = () => {
    dispatch(setSelectedSubMenu(2));
    setCookie("currentSubmenu", 2);
    navigate(WEB_URL.SUBSCRIBER_ADD);
  };*/
  /*const handleAssignedPageClick = (page) => {
    const ugtGroupId = currentUGTGroup?.id ? currentUGTGroup?.id : "";
    const pageNumber = page.selected + 1;
    if (currentUGTGroup?.id !== null) {
      let permissFindUntilyty = null;
      if (
        userData?.userGroup?.id === USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.PEA_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.PEA] };
        const paramSubscriberAssign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
              "res ==", res;
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.MEA_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.MEA] };
        const paramSubscriberAssign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.EGAT] };
        const paramSubscriberAssign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.ALL_MODULE_VIEWER
      ) {
        permissFindUntilyty = { utility: [] };
        const paramSubscriberAssign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementAssign(paramSubscriberAssign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      }
    }
  };*/
 /* const handleUnAssignedPageClick = (page) => {
    const ugtGroupId = currentUGTGroup?.id ? currentUGTGroup?.id : "";
    const pageNumber = page.selected + 1;
    if (currentUGTGroup?.id !== null) {
      let permissFindUntilyty = null;
      if (
        userData?.userGroup?.id === USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.PEA_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.PEA] };
        const paramSubscriberUnassign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.MEA_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.MEA] };
        const paramSubscriberUnassign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.EGAT_DEVICE_MNG
      ) {
        permissFindUntilyty = { utility: [UTILITY_GROUP_ID.EGAT] };
        const paramSubscriberUnassign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      } else if (
        userData?.userGroup?.id === USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.ALL_MODULE_VIEWER
      ) {
        permissFindUntilyty = { utility: [] };
        const paramSubscriberUnassign = {
          findUgtGroupId: ugtGroupId,
          findUtilityId: permissFindUntilyty,
          findStatusId: isUnassignedStatusId,
          PageNumber: pageNumber,
          PageSize: itemsPerPage,
        };
        dispatch(SubscriberFilterList());
        dispatch(
          SubscriberManagementUnassign(paramSubscriberUnassign, (res) => {
            if (res >= 400) {
            } else {
            }
          })
        );
      }
    }
  };*/

  const handleAssignedSearchChange = (e) => {
    setSearchQueryAssigned(e.target.value);
  };

  const handleUnAssignedSearchChange = (e) => {
    setSearchQueryUnAssigned(e.target.value);
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
    
    //console.log(Date)
    const dateToText = Date.toString()
    const time = dateToText.split("T")[1]
    const timeFull = time.split(".")[0]
    return timeFull
  }

  const handleFileChange =(guid)=>{
    showLoading();
    dispatch(GetBinaryFileHistory(guid, (res)=>{
      console.log("Res call back",res)
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

const handleDownloadFile=(guid)=>{
  showLoading();
  dispatch(GetBinaryFileHistory(guid,(res)=>{
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

  const styleTable = "px-6 py-4 font-semibold text-black text-center";
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold text-xl text-black">
                {subscriberInfo?.subscriberDetail?.organizationName}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Subscriber Management / Subscriber / {subscriberInfo?.subscriberDetail?.organizationName} / History Log
                Info
              </p>
              </div>
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
                        onClick={() =>  navigate(WEB_URL.SUBSCRIBER_INFO, {
                          state: { id: state?.code,contract: state?.contract },
                        })}
                      />
                      <span className=" mr-14	leading-tight w-70">
                        <b className="text-xl"> Subscriber Info </b>
                        <b className="text-base text-[#A3B587]"> | History Log </b>
                      </span>
                      
                    </div>
                  </div>
                </div>
              </div>      
            <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top" />
            </Card>

            {/* {Active Contract Table Content} */}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
                <div className="text-sm">
                  <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                    <div className="lg:col-span-2 2xl:col-span-3 mb-4">
                      <span className="font-bold text-lg">
                        Active Contract
                      </span>
                    </div>

                    <div className="grid lg:col-span-4 2xl:col-span-3 grid-cols-6">
                      <form className="grid col-span-6 grid-cols-6">
                        {/* เอา utility ออก ต้องใส่ col-span-2 ไว้ */}
                        <div className="col-span-2 px-2" />
                        <div className="col-span-2 px-2" />
                        <div className="col-span-2 px-2">
                          <Controller
                            name="SearchText"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <SearchBox
                                placeholder="Search"
                                onChange={handleAssignedSearchChange}
                              />
                            )}
                          />
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="relative overflow-x-auto sm:rounded-lg">
                    <DataTable
                      data={historyActiveList}
                      columns={columnsAssigned}
                      searchData={searchQueryAssigned}
                      checkbox={false}
                    />
                  </div>
                </div>
            </Card>

            {/* {Inactive Contract Table Content} */}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="lg:col-span-2 2xl:col-span-3 mb-4">
                    <span className="font-bold text-lg">
                      Inactive Contract
                    </span>
                  </div>

                  <div className="grid lg:col-span-4 2xl:col-span-3 grid-cols-6">
                    <form className="grid col-span-6 grid-cols-6">
                      {/* เอา utility ออก ต้องใส่ col-span-2 ไว้ */}
                      <div className="col-span-2 px-2" />
                      <div className="col-span-2 px-2" />
                      <div className="col-span-2 px-2">
                        <Controller
                          name="SearchText"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <SearchBox
                              placeholder="Search"
                              onChange={handleUnAssignedSearchChange}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="relative overflow-x-auto sm:rounded-lg">
                  <DataTable
                    data={historyInactiveList}
                    columns={columnsUnAssigned}
                    searchData={searchQueryUnAssigned}
                    checkbox={false}
                  />

                  {/* <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-left"
                        >
                          Subscriber Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-center"
                        >
                          Utility Contract
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-center"
                        >
                          Allocated <br /> Energy Amount <br /> (MWh)
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-center"
                        >
                          Portfolio
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-center"
                        >
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {getUnassignOBJ?.length > 0 &&
                        getUnassignOBJ?.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                            >
                              <th
                                scope="row"
                                className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap "
                              >
                                <div className="flex w-80">
                                  <div
                                    className="inline-flex items-center justify-center h-[2.575rem] w-[2.575rem] bg-INFO_BUTTON text-lg font-semibold text-white leading-none"
                                    style={{ borderRadius: "50%" }}
                                  ></div>
                                  <div className="flex flex-col ml-2 w-5/6 justify-center">
                                    <div
                                      className="font-semibold	"
                                      style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "400px",
                                      }}
                                    >
                                      {item.subcriberName}
                                    </div>
                                  </div>
                                </div>
                              </th>
                              <td className={`${styleTable}`}>
                                {item?.utilityContractAbbr}
                              </td>
                              <td className={`${styleTable}`}>
                                {item?.contractedEnergy
                                  ? item?.contractedEnergy?.toLocaleString(
                                      undefined,
                                      { minimumFractionDigits: 2 }
                                    )
                                  : "-"}
                              </td>
                              <td className={`${styleTable}`}>
                                {item.portfolio}
                              </td>
                              <td className={`${styleTable}`}>
                                <div
                                  className={`text-white rounded-large font-semibold text-xs py-1.5 px-2 bg-${
                                    item.subscriberStatusId == 1
                                      ? "PRIMARY_BUTTON"
                                      : "SUCCESS_BUTTON"
                                  }`}
                                >
                                  {item.subscriberStatusId == 1
                                    ? "Inactive"
                                    : "Active"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Link
                                  type="button"
                                  state={{ id: item.id }}
                                  to={WEB_URL.SUBSCRIBER_INFO}
                                  className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#e2e2ac] bg-[#f5f4e9]`}
                                >
                                  <label className="m-auto cursor-pointer text-[#4d6a00] font-semibold">
                                    {"Manage"}
                                  </label>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      {getUnassignOBJ?.length <= 0 && (
                        <div className="mt-4 text-center">
                          No data Unassigned Subscriber
                        </div>
                      )}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-2">
                    <PaginatedItems
                      itemsPerPage={itemsPerPage}
                      handlePageClick={handleUnAssignedPageClick}
                      totalData={totalUnAssigned}
                    />
                    {isOpenLoading && <LoadPage></LoadPage>}
                  </div> */}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySubscriber;

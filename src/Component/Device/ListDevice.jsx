import React, { useEffect, useState } from "react";
addLogoWhite;
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card } from "@mantine/core";
import classNames from "classnames";
import {
  setCurrentAssignedFilter,
  setCurrentUnAssignedFilter,
  FetchFilterList,
  FetchDeviceManagementDashboard,
  FetchDeviceManagementAssigned,
  FetchDeviceManagementUnAssigned,
} from "../../Redux/Device/Action";
import Map from "../Map/Map";
import egat from "../assets/egat.jpg";
// import PaginatedItems from "../Control/Table/Pagination";

import addLogoWhite from "../assets/add-white.svg";
import deviceLogo from "../assets/device.svg";
import AboutToExpire from "../assets/AboutToExpire.svg";
import ActiveDevice from "../assets/ActiveDevice.svg";
import InactiveDevice from "../assets/InactiveDevice.svg";
import ActiveCapcity from "../assets/ActiveCapcity.svg";
import RegistrationTracking from "../assets/RegistrationTracking.svg";
import { MdOutlineRemoveRedEye } from "react-icons/md";


import LoadPage from "../Control/LoadPage";
// import MySelect from "../Control/Select";
import DataTable from "../Control/Table/DataTable";
import SearchBox from "../Control/SearchBox";

import {
  DEVICE_STATUS,
  USER_GROUP_ID,
  UTILITY_GROUP_ID,
  SUB_MENU_ID,
} from "../../Constants/Constants";
import { useForm, Controller } from "react-hook-form";
import * as WEB_URL from "../../Constants/WebURL";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import { setCookie } from "../../Utils/FuncUtils";
import StatusLabel from "../../Component/Control/StatusLabel";
import Multiselect from "../Control/Multiselect";
import numeral from "numeral";

import Highlighter from "react-highlight-words";

const itemsPerPage = 200;

const ListDevice = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [isFirstLoadPage, setIsFirstLoadPage] = useState(true);
  const [isDeviceGroup, setIsDeviceGroup] = useState(true);
  const [currentAssignedFilterObj, setCurrentAssignedFilterObj] = useState({
    status: null,
    utility: null,
    type: null,
  });
  const [currentUnAssignedFilterObj, setCurrentUnAssignedFilterObj] = useState({
    status: null,
    utility: null,
    type: null,
  });

  const [disableUtility, setDisableUtility] = useState(false);
  const deviceRdc = useSelector((state) => state.device);
  const currentUGTGroup = useSelector((state) => state.menu.currentUGTGroup);
  console.log(currentUGTGroup)
  const userData = useSelector((state) => state.login.userobj);
  const totalDevice = deviceRdc?.totalDevice;
  const totalExpire = deviceRdc?.totalExpire;
  const totalDeviceInactive = deviceRdc?.totalDeviceInactive;
  const totalRegistration = deviceRdc?.totalRegistration;
  const totalCapacity = deviceRdc?.totalCapacity?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  const topCapacityCardList = deviceRdc?.topCapacity;
  const locationList = deviceRdc?.topCapacity?.map((item) => ({
    lat: item.latitude ? parseFloat(item.latitude) : 0,
    lng: item.longitude ? parseFloat(item.longitude) : 0,
  }));
  const assignedList = deviceRdc?.assignedList;
  const unAssignedList = deviceRdc?.unAssignedList;
  const totalAssigned = deviceRdc?.totalAssigned;
  const totalUnAssigned = deviceRdc?.totalUnAssigned;
  const typeList = deviceRdc?.filterList?.findType;
  const utilityList = deviceRdc?.filterList?.findUtility;
  const statusList = deviceRdc?.filterList?.findStatus;
  // unAssignedList.map((itm) => {console.log(itm)})
  console.log(userData)
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [searchQueryAssigned, setSearchQueryAssigned] = useState("");
  const [searchQueryUnAssigned, setSearchQueryUnAssigned] = React.useState('');
  
  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsAssigned = [
    {
      id: "name",
      label: "Device Name",
      align: "left",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold break-words"
            style={{
              width: "250px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
            <Highlighter
              highlightTag={Highlight}
              searchWords={searchQueryAssigned.split(" ")}
              autoEscape={true}
              textToHighlight={row.name?.length > 100 ? row.name?.substring(0, 100) + "..." : row.name}
            />
          </div>
          <div
            className="font-semibold break-words"
            style={{
              width: "250px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
          <label className="text-[#2e8d8d] bg-[#f0f8ff] rounded w-max px-2 py-1 mt-1 text-xs font-normal">
            <Highlighter
              highlightTag={Highlight}
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={row?.typeName ?? ""}
            />
          </label></div>
        </div>
      ),
    },
    {
      id: "utilityContractAbbr",
      label: "Utility Contract",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "100px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryAssigned]}
          autoEscape={true}
          textToHighlight={row.utilityContractAbbr}
        /></div>
      ),
    },
    {
      id: "capacity",
      label: "Capacity (MW)",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "100px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryAssigned]}
          autoEscape={true}
          textToHighlight={numeral(row.capacity).format("0,0.00")}
        /></div>
      ),
    },
    {
      id: "portfolio",
      label: "Portfolio",
      align: "center",
      render: (row) => (
        <div className="break-words" style={{
          width: "100px",
          wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
        }}>
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.portfolio}
          />
        </div>
      ),
    },
    {
      id: "statusName",
      label: "Status",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "200px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
        <StatusLabel status={row.statusName} searchQuery={searchQueryAssigned} />
        {row.isApproved === "True" && (
            <StatusLabel
              key={row.id} // Assuming each item has a unique id
              status="Approved"
              searchQuery={searchQueryUnAssigned}
            />
          )}
        </div>
      ),
    },
    {
      id: "manage",
      label: "",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "100px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
        <Link
          type="button"
          state={{ code: row.id }}
          to={WEB_URL.DEVICE_INFO}
          className="flex no-underline rounded text-center p-2 cursor-pointer text-sm items-center justify-center hover:bg-[#4D6A00] bg-[#87BE33] w-24"
        >
          <label className="cursor-pointer text-white font-semibold">Manage</label>
        </Link></div>
      ),
    },
  ];
  
  const columnsUnAssigned = [
    {
      id: "name",
      label: "Device Name",
      align: "left",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold break-words"
            style={{
              width: "250px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
            <Highlighter
              highlightTag={Highlight}
              searchWords={[searchQueryUnAssigned]}
              autoEscape={true}
              textToHighlight={row.name?.length > 100 ? row.name?.substring(0, 100) + "..." : row.name}
            />
          </div>
          <div
            className="font-semibold break-words"
            style={{
              width: "250px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
          <label className="text-[#2e8d8d] bg-[#f0f8ff] rounded w-max px-2 py-1 mt-1 text-xs font-normal">
            <Highlighter
              highlightTag={Highlight}
              searchWords={[searchQueryUnAssigned]}
              autoEscape={true}
              textToHighlight={row?.typeName ?? ""}
            />
          </label></div>
        </div>
      ),
    },
    {
      id: "utilityContractAbbr",
      label: "Utility Contract",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "100px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryUnAssigned]}
          autoEscape={true}
          textToHighlight={row.utilityContractAbbr}
        /></div>
      ),
    },
    {
      id: "capacity",
      label: "Capacity (MW)",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "100px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={numeral(row.capacity).format("0,0.00")}
          />
        </div>
      ),
    },
    {
      id: "portfolio",
      label: "Portfolio",
      align: "center",
      render: (row) => (
        <div className="break-words" style={{
          width: "100px",
          wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
        }}>
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={row.portfolio ?? ""}
          />
        </div>
      ),
    },
    {
      id: "statusName",
      label: "Status",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "200px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
          <StatusLabel
            status={row.statusName}
            searchQuery={searchQueryUnAssigned}
          />
          {row.isApproved === "True" && (
            <StatusLabel
              key={row.id} // Assuming each item has a unique id
              status="Approved"
              searchQuery={searchQueryUnAssigned}
            />
          )}
        </div>
      ),
    },
    {
      id: "manage",
      label: "",
      align: "center",
      render: (row) => (
        <div
            className="break-words"
            style={{
              width: "100px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
        <Link
          type="button"
          state={{ code: row.id }}
          to={WEB_URL.DEVICE_INFO}
          className="flex no-underline rounded text-center p-2 cursor-pointer text-sm items-center justify-center hover:bg-[#4D6A00] bg-[#87BE33] w-24"
        >
          <label className="cursor-pointer text-white font-semibold">Manage</label>
        </Link></div>
      ),
    },
  ];
  

//   {
//     id: "manage",
//     label: "",
//     render: (row) => (
//       <div className="flex gap-2">
//       <Link
//         type="button"
//         state={{ code: row.id }}
//         to={WEB_URL.DEVICE_INFO}
//         // hover:bg-[#4D6A00] bg-[#87BE33]
//         className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center justify-center hover:bg-[#4D6A00] bg-[#87BE33]`}
//       >
//         <label className="flex items-center m-auto cursor-pointer text-white font-semibold gap-1">
//   {
//   userData?.userGroup?.id === USER_GROUP_ID.EGAT_DEVICE_MNG || 
//   userData?.userGroup?.id === USER_GROUP_ID.MEA_DEVICE_MNG ||
//   userData?.userGroup?.id === USER_GROUP_ID.PEA_DEVICE_MNG || 
//   userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_VERIFIER || 
//   userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
//   ? (
//     "Manage"
//   ) : (
//     <>
//       {"View"} <MdOutlineRemoveRedEye className="text-white" />
//     </>
    
//   )}
// </label>
// </Link>
//       </div>
//     ),
//   },
  

  useEffect(() => {
    const { hash, pathname, search } = location;

    if (WEB_URL.DEVICE_LIST == pathname) {
      dispatch(setSelectedSubMenu(SUB_MENU_ID.DEVICE_LIST_INFO));
      setCookie("currentSubmenu", SUB_MENU_ID.DEVICE_LIST_INFO);
    }
    if (isFirstLoadPage) {
      // dispatch(FetchDeviceManagementDashboard());
      dispatch(FetchFilterList());
      setIsFirstLoadPage(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [utilityList?.length, userData]);

  const getDeviceData = (utilityID = null) => {
    // console.log(utilityID, "utilityID");
    const ugtGroupId = currentUGTGroup?.id ? currentUGTGroup?.id : "1";

    const fetchParameterForDashboard = {
      findUgtGroupId: ugtGroupId,
      findUtilityId: utilityID ? [utilityID] : [],
    };
    const fetchParameterForAssignedList = {
      findTypeId: null,
      findUtilityId: utilityID ? [utilityID] : [],
      findStatusId: null,
      pageNumber: 1,
      pageSize: itemsPerPage,
      findUgtGroupId: ugtGroupId,
    };
    const fetchParameterForUnAssignedList = {
      findTypeId: null,
      findUtilityId: utilityID ? [utilityID] : [],
      findStatusId: null,
      pageNumber: 1,
      pageSize: itemsPerPage,
      findUgtGroupId: ugtGroupId,
    };

    setIsOpenLoading(true);
    console.log("fetchParameterForDashboard", fetchParameterForDashboard);
    dispatch(FetchDeviceManagementDashboard(fetchParameterForDashboard));
    dispatch(
      FetchDeviceManagementAssigned(fetchParameterForAssignedList, () => {
        setIsOpenLoading(false);
      })
    );
    dispatch(
      FetchDeviceManagementUnAssigned(fetchParameterForUnAssignedList, () => {
        setIsOpenLoading(false);
      })
    );
  };

  // const getStatusColor = (statusValue) => {
  //   let color = "bg-GRAY_BUTTON";
  //   if (statusValue) {
  //     const status = statusValue?.toLowerCase();
  //     if (status === DEVICE_STATUS.DRAFT.toLowerCase()) {
  //       color = "bg-PRIMARY_BUTTON";
  //     } else if (status === DEVICE_STATUS.SUBMITTED.toLowerCase()) {
  //       color = "bg-INFO_BUTTON";
  //     } else if (status === DEVICE_STATUS.VERIFIED.toLowerCase()) {
  //       color = "bg-SECONDARY_BUTTON";
  //     } else if (status === DEVICE_STATUS.APPROVED.toLowerCase()) {
  //       color = "bg-SUCCESS_BUTTON";
  //     } else if (status === DEVICE_STATUS.REJECTED.toLowerCase()) {
  //       color = "bg-DANGER_BUTTON";
  //     }
  //   } else {
  //     color = null;
  //   }
  //   return color;
  // };

  const handleAssignedPageClick = (page) => {
    const ugtGroupId = currentUGTGroup?.id ? currentUGTGroup?.id : "";
    const pageNumber = page.selected + 1;
    const fetchParameterForAssignedList = {
      findTypeId: currentAssignedFilterObj?.type
        ? currentAssignedFilterObj?.type
        : "",
      findUtilityId: currentAssignedFilterObj?.utility
        ? currentAssignedFilterObj?.utility
        : "",
      findStatusId: currentAssignedFilterObj?.status
        ? currentAssignedFilterObj?.status
        : "",
      pageNumber: pageNumber,
      pageSize: itemsPerPage,
      findUgtGroupId: ugtGroupId,
    };
    dispatch(FetchDeviceManagementAssigned(fetchParameterForAssignedList));
  };

  const handleUnAssignedPageClick = (page) => {
    const ugtGroupId = currentUGTGroup?.id ? currentUGTGroup?.id : "";
    const pageNumber = page.selected + 1;
    const fetchParameterForUnAssignedList = {
      findTypeId: currentUnAssignedFilterObj?.type
        ? currentUnAssignedFilterObj?.type
        : "",
      findUtilityId: currentUnAssignedFilterObj?.utility
        ? currentUnAssignedFilterObj?.utility
        : "",
      findStatusId: currentUnAssignedFilterObj?.status
        ? currentUnAssignedFilterObj?.status
        : "",
      pageNumber: pageNumber,
      pageSize: itemsPerPage,
      findUgtGroupId: ugtGroupId,
    };

    dispatch(FetchDeviceManagementUnAssigned(fetchParameterForUnAssignedList));
  };

  const handleChangeAssignFilter = (value, filterType) => {
    const ugtGroupId = currentUGTGroup?.id || ""; // Fallback for ugtGroupId
    const selectedFilterIds = value.map(item => item.id); // Extract selected IDs

    // Update the current filter based on the type
    const newCurrentAssignedFilter = {
        ...currentAssignedFilterObj,
        [filterType.toLowerCase()]: selectedFilterIds
    };
    
    // Update state and dispatch the filter
    setCurrentAssignedFilterObj(newCurrentAssignedFilter);
    dispatch(setCurrentAssignedFilter(newCurrentAssignedFilter));

    // Prepare fetch parameters with the latest filter values
    const fetchParameterForAssignedList = {
        findTypeId: newCurrentAssignedFilter.type || [],
        findUtilityId: newCurrentAssignedFilter.utility || [],
        findStatusId: newCurrentAssignedFilter.status || [],
        pageNumber: 1,
        pageSize: itemsPerPage,
        findUgtGroupId: ugtGroupId
    };

    // Dispatch the fetch action
    dispatch(FetchDeviceManagementAssigned(fetchParameterForAssignedList));
};


const handleChangeUnAssignFilter = (value, filterType) => {
  let fetchParameterForUnAssignedList = null;
  const ugtGroupId = currentUGTGroup?.id ? currentUGTGroup?.id : "";

  const currentFilterList = value.map((item) => item.id);
  const newCurrentUnAssignedFilter = { ...currentUnAssignedFilterObj };

  if (filterType === "TYPE") {
      newCurrentUnAssignedFilter.type = currentFilterList;
  } else if (filterType === "UTILITY") {
      newCurrentUnAssignedFilter.utility = currentFilterList;
  } else if (filterType === "STATUS") {
      newCurrentUnAssignedFilter.status = currentFilterList;
  }

  setCurrentUnAssignedFilterObj(newCurrentUnAssignedFilter);
  dispatch(setCurrentUnAssignedFilter(newCurrentUnAssignedFilter));

  fetchParameterForUnAssignedList = {
      findTypeId: newCurrentUnAssignedFilter.type || [],
      findUtilityId: newCurrentUnAssignedFilter.utility || [],
      findStatusId: newCurrentUnAssignedFilter.status || [],
      pageNumber: 1,
      pageSize: itemsPerPage,
      findUgtGroupId: ugtGroupId,
  };

  dispatch(FetchDeviceManagementUnAssigned(fetchParameterForUnAssignedList));
};






  const handleClickDeviceRegistration = () => {
    dispatch(setSelectedSubMenu(SUB_MENU_ID.DEVICE_REGISTRATION));
    setCookie("currentSubmenu", SUB_MENU_ID.DEVICE_REGISTRATION);

    navigate(WEB_URL.DEVICE_ADD);
  };

  const checkPermission = () => {
    const userGroupID = userData?.userGroup?.id;
    if (
      userGroupID == USER_GROUP_ID.MEA_DEVICE_MNG ||
      userGroupID == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
    ) {
      const utilityID = UTILITY_GROUP_ID.MEA; //MEA
      if (userGroupID !== USER_GROUP_ID.MEA_DEVICE_MNG) {
        setIsDeviceGroup(false);
      }
      const initAssignedFilterValue = {
        ...currentAssignedFilterObj,
        utility: [utilityID],
      };
      const initUnAssignedFilterValue = {
        ...currentUnAssignedFilterObj,
        utility: [utilityID],
      };

      setCurrentAssignedFilterObj(initAssignedFilterValue);
      dispatch(setCurrentAssignedFilter(initAssignedFilterValue));

      setCurrentUnAssignedFilterObj(initUnAssignedFilterValue);
      dispatch(setCurrentUnAssignedFilter(initUnAssignedFilterValue));

      getDeviceData(utilityID);
      setDisableUtility(true);
    } else if (
      userGroupID == USER_GROUP_ID.PEA_DEVICE_MNG ||
      userGroupID == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
    ) {
      const utilityID = UTILITY_GROUP_ID.PEA; //PEA
      if (userGroupID !== USER_GROUP_ID.PEA_DEVICE_MNG) {
        setIsDeviceGroup(false);
      }
      const initAssignedFilterValue = {
        ...currentAssignedFilterObj,
        utility: [utilityID],
      };
      const initUnAssignedFilterValue = {
        ...currentUnAssignedFilterObj,
        utility: [utilityID],
      };

      setCurrentAssignedFilterObj(initAssignedFilterValue);
      dispatch(setCurrentAssignedFilter(initAssignedFilterValue));

      setCurrentUnAssignedFilterObj(initUnAssignedFilterValue);
      dispatch(setCurrentUnAssignedFilter(initUnAssignedFilterValue));

      getDeviceData(utilityID);
      setDisableUtility(true);
    } else if (
      userGroupID == USER_GROUP_ID.EGAT_DEVICE_MNG ||
      userGroupID == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
    ) {
      const utilityID = UTILITY_GROUP_ID.EGAT; //EGAT
      if (userGroupID !== USER_GROUP_ID.EGAT_DEVICE_MNG) {
        setIsDeviceGroup(false);
      }
      const initAssignedFilterValue = {
        ...currentAssignedFilterObj,
        utility: [utilityID],
      };
      const initUnAssignedFilterValue = {
        ...currentUnAssignedFilterObj,
        utility: [utilityID],
      };

      setCurrentAssignedFilterObj(initAssignedFilterValue);
      dispatch(setCurrentAssignedFilter(initAssignedFilterValue));

      setCurrentUnAssignedFilterObj(initUnAssignedFilterValue);
      dispatch(setCurrentUnAssignedFilter(initUnAssignedFilterValue));

      getDeviceData(utilityID);
      setDisableUtility(true);
    } else if (
      userGroupID == USER_GROUP_ID.UGT_REGISTANT_VERIFIER 
    ) {
      const utilityID = UTILITY_GROUP_ID.VER; //EGAT
      if (userGroupID !== USER_GROUP_ID.UGT_REGISTANT_VERIFIER) {
        setIsDeviceGroup(false);
      }
      const initAssignedFilterValue = {
        ...currentAssignedFilterObj,
        utility: [],
      };
      const initUnAssignedFilterValue = {
        ...currentUnAssignedFilterObj,
        utility: [],
      };

      setCurrentAssignedFilterObj(initAssignedFilterValue);
      dispatch(setCurrentAssignedFilter(initAssignedFilterValue));

      setCurrentUnAssignedFilterObj(initUnAssignedFilterValue);
      dispatch(setCurrentUnAssignedFilter(initUnAssignedFilterValue));

      getDeviceData();
      setDisableUtility(true);
    }
    else if (
      userGroupID == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY 
    ) {
      const utilityID = UTILITY_GROUP_ID.SIG; //EGAT
      if (userGroupID !== USER_GROUP_ID.UGT_REGISTANT_SIGNATORY) {
        setIsDeviceGroup(false);
      }
      const initAssignedFilterValue = {
        ...currentAssignedFilterObj,
        utility: [],
      };
      const initUnAssignedFilterValue = {
        ...currentUnAssignedFilterObj,
        utility: [],
      };

      setCurrentAssignedFilterObj(initAssignedFilterValue);
      dispatch(setCurrentAssignedFilter(initAssignedFilterValue));

      setCurrentUnAssignedFilterObj(initUnAssignedFilterValue);
      dispatch(setCurrentUnAssignedFilter(initUnAssignedFilterValue));

      getDeviceData();
      setDisableUtility(true);
    }
    else if (
      userGroupID == USER_GROUP_ID.PORTFOLIO_MNG ||
      userGroupID == USER_GROUP_ID.ALL_MODULE_VIEWER || 
      userGroupID == USER_GROUP_ID.WHOLE_SALEER_ADMIN
    ) {
      const utilityID = UTILITY_GROUP_ID.ALL; //EGAT

      setIsDeviceGroup(false);

      const initAssignedFilterValue = {
        ...currentAssignedFilterObj,
        utility: [],
      };
      const initUnAssignedFilterValue = {
        ...currentUnAssignedFilterObj,
        utility: [],
      };

      setCurrentAssignedFilterObj(initAssignedFilterValue);
      dispatch(setCurrentAssignedFilter(initAssignedFilterValue));

      setCurrentUnAssignedFilterObj(initUnAssignedFilterValue);
      dispatch(setCurrentUnAssignedFilter(initUnAssignedFilterValue));

       console.log("run check permission", utilityID);
      getDeviceData();
      setDisableUtility(true);
    }
  };

  const handleAssignedSearchChange = (e) => {
    const value = e.target.value;
    setSearchQueryAssigned(value);
  };
  const handleUnAssignedSearchChange = (e) => {
    const value = e.target.value; // Get the input value
    setSearchQueryUnAssigned(value); // Update the search query
};

// Filtering logic to get the search results
let filteredSearchResults = unAssignedList.filter(item => {
    // ตรวจสอบการค้นหาชื่อและสถานะ
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQueryUnAssigned.toLowerCase()) ||
        item.statusName.toLowerCase().includes(searchQueryUnAssigned.toLowerCase());

    // ตรวจสอบสถานะ โดยเฉพาะรายการ Withdrawn
    const matchesStatusFilter = currentUnAssignedFilterObj.status?.length
        ? currentUnAssignedFilterObj.status.includes(item.statusName) || item.statusName === "Withdrawn" || item.statusName === "Submitted" || item.statusName === "Approved" || item.statusName === "Draft" || item.statusName === "Verifying" || item.statusName === "Verified" || item.statusName === "Return" || item.statusName === "Rejected" || item.statusName === "In Progress"
        : item.statusName !== "Withdrawn"; // ถ้าไม่มีสถานะที่เลือก ให้ตัดรายการ Withdrawn ออก

    // คืนค่าผลลัพธ์โดยใช้ตัวแปรที่สร้างขึ้น
    return matchesSearchQuery && matchesStatusFilter;
});

/// หากมีการค้นหาโดยพิมพ์ตัวอักษรเดียวหรือมากกว่า
if (searchQueryUnAssigned.trim().length >= 1) {
  const withdrawnItems = unAssignedList.filter(item => 
      item.statusName === "Withdrawn" || 
      item.name.toLowerCase().includes(searchQueryUnAssigned.toLowerCase())
  );

  // กรองเพื่อไม่ให้รายการ Withdrawn ซ้ำซ้อนกับผลลัพธ์ก่อนหน้า
  const uniqueWithdrawnItems = withdrawnItems.filter(withdrawnItem =>
      !filteredSearchResults.some(result => result.id === withdrawnItem.id)
  );

  // เพิ่มรายการ Withdrawn ที่ไม่ซ้ำลงใน filteredSearchResults
  filteredSearchResults = [...filteredSearchResults, ...uniqueWithdrawnItems];
}

// แสดงผลลัพธ์สุดท้าย
console.log(filteredSearchResults);



  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">Device Info</h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Device Management / Device Info
              </p>
            </div>

            <div className="flex sm:flex-col lg:flex-row w-full h-auto gap-3">
              {/* {'left content'} */}
              <div className="flex flex-col w-full h-auto gap-3">
                {/* Total Active Devices Card */}
                <div className="w-full h-56 flex justify-start items-start">
                  <Card
                    shadow="md"
                    radius="lg"
                    className="flex w-full h-full"
                    padding="lg"
                  >
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div
                          style={{ borderRadius: "50%" }}
                          className={`flex justify-center w-[75px] h-[75px] bg-[#87BE3326] mb-2 `}
                        >
                          {/* <CgCircleci className="text-green-500 w-[50px] h-[50px] mb-2"></CgCircleci> */}
                          <img
                            alt={"ig"}
                            src={ActiveDevice}
                            width={50}
                            height={50}
                          ></img>
                        </div>
                        <div>
                          <p className="text-3xl font-semibold m-0 text-end">
                            {numeral(totalDevice).format("0,0")}
                          </p>
                          <span> </span>
                          <p className="text-lg font-medium text-slate-500 text-end	">
                            {totalDevice > 1 ? "Devices" : "Device"}
                          </p>
                        </div>
                      </div>

                      <div className="font-bold mt-2">Total Active Devices</div>
                      <div className="text-gray-500 text-xs">
                        Keep track of all your devices at a glance.
                      </div>
                    </div>
                  </Card>
              </div>
                {/* Total Inactive Devices Card */}
              <div className="w-full h-56 flex justify-start items-end ">
                  <Card
                    shadow="md"
                    radius="lg"
                    className="flex w-full h-full"
                    padding="lg"
                  >
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div
                          style={{ borderRadius: "50%" }}
                          className="flex justify-center w-[60px] h-[60px] bg-[#f1f1f1]  "
                        >
                          <img
                            alt={"ig"}
                            src={InactiveDevice}
                            width={40}
                            height={40}
                          ></img>
                        </div>
                        <div>
                          <p className="text-3xl font-semibold m-0 text-end">
                            {totalDeviceInactive}
                          </p>
                          <span> </span>
                          <p className="text-lg font-medium text-slate-500 text-end">
                          {totalDeviceInactive > 1 ? "Devices" : "Device"}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold">
                      Total Inactive Devices
                      </div>
                      <div className="text-gray-500 text-xs">
                      Monitor devices awaiting both approval and operation.
                      </div>
                    </div>
                  </Card>
                </div> 
                
</div>
         
              
              {/*Right Content*/}
              <div className="flex flex-col w-full h-auto gap-3">
                {/* Registration Tracking Card */}
                <div className="w-full h-56 flex justify-start items-end ">
                  <Card
                    shadow="md"
                    radius="lg"
                    className="flex w-full h-full"
                    padding="lg"
                  >
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div
                          style={{ borderRadius: "50%" }}
                          className="flex justify-center w-[75px] h-[75px] bg-[#F9974126] mb-2 "
                        >
                          <img
                            alt={"ig"}
                            src={RegistrationTracking}
                            width={50}
                            height={50}
                          ></img>
                        </div>
                        <div>
                          <p className="text-3xl font-semibold m-0 text-end">
                           {totalRegistration}
                          </p>
                          <span> </span>
                          <p className="text-lg font-medium text-slate-500 text-end">
                          {totalRegistration > 1 ? "Devices" : "Device"}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold mt-2">
                      Registration Tracking
                      </div>
                      <div className="text-gray-500 text-xs">
                      Track all in-process device registration.
                      </div>
                    </div>
                  </Card>
                </div>
                {/* About to Expire Card */}
                <div className="w-full h-56 flex justify-start items-end">
                  <Card
                    shadow="md"
                    radius="lg"
                    className="flex w-full h-full"
                    padding="lg"
                  >
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div
                          style={{ borderRadius: "50%" }}
                          className="flex justify-center w-[60px] h-[60px] bg-[#ffe1e0] mb-2 "
                        >
                          <img
                            alt={"ig"}
                            src={AboutToExpire}
                            width={40}
                            height={40}
                          ></img>
                        </div>
                        <div>
                          <p className="text-3xl font-semibold m-0 text-end">
                            {totalExpire}
                          </p>
                          <span> </span>
                          <p className="text-lg font-medium text-slate-500 text-end">
                          {totalExpire > 1 ? "Devices" : "Device"}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold ">
                      About to Expire
                      </div>
                      <div className="text-gray-500 text-xs">
                      Track device expiry for its registration renewal.
                      </div>
                    </div>
                  </Card>
                </div>
</div>{/* Total Active Capacity Card */}
                <div className="w-auto h-auto flex justify-start items-start ">
                  <Card
                    shadow="md"
                    radius="lg"
                    className="flex w-full h-full"
                    padding="lg"
                  >
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div
                          style={{ borderRadius: "50%" }}
                          className="flex justify-center w-[75px] h-[75px] bg-[#3583CD26] mb-2 "
                        >
                          <img
                            alt={"ig"}
                            src={ActiveCapcity}
                            width={50}
                            height={50}
                          ></img>
                        </div>
                        <div>
                          <p className="text-3xl font-semibold m-0 text-end">
                            {numeral(totalCapacity).format("0,0.00")}
                          </p>
                          <span> </span>
                          <p className="text-lg font-medium text-slate-500 text-end">
                            MW
                          </p>
                        </div>
                      </div>
                      <div className="font-bold mt-2">
                        Total Active Capacity
                      </div>
                      <div className="text-gray-500 text-xs">
                      Monitor your entire power production capacity in real-time.
                      </div>
                    </div>
                  </Card>
                </div>
              {/* {'End Right Content'} */}
              
            </div>
            {isDeviceGroup && (
              <div className="grid col-span-4 grid-cols-12 mr-2 mt-3">
                <div className="col-span-9"></div>
                <div className="text-sm col-span-3">
                  <div
                    type="button"
                    onClick={handleClickDeviceRegistration}
                    className={`w-full h-[40px] bg-[#87be33] rounded no-underline	`}
                  >
                    <div className="flex justify-center items-center md:px-2">
                      <img
                        src={addLogoWhite}
                        alt="React Logo"
                        width={20}
                        height={20}
                        className={"text-white mr-2"}
                      />

                      <button className="h-[40px] text-white bg-[#87be33] rounded md:text-start	">
                        Device Registration
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* {Assigned Table Content} */}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full overflow-visible"
              padding="xl"
            >
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6  ">
                  <div className="lg:col-span-2 2xl:col-span-3 mb-4">
                    <span className="font-bold text-lg">
                      Active Devices
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      >
                        {totalAssigned}{" "}
                        {totalAssigned > 1 ? "Devices" : "Device"}
                      </label>
                    </span>
                  </div>

                  <div className="grid lg:col-span-4 2xl:col-span-3 grid-cols-6">
                    <form className="grid col-span-6 grid-cols-6">
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
                      <div className="col-span-2 px-2">
                        <Controller
                          name="assignType"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"assignType"}
                              placeholder={"Find Type"}
                              typeSelect={2}
                              options={typeList}
                              valueProp={"id"}
                              displayProp={"name"}
                              onChangeInput={(value) => {
                                handleChangeAssignFilter(value, "TYPE");
                              }}
                              wrapText={true}
                              isSearchable={true}
                              size="large"
                            />
                          )}
                        />
                      </div>
                      {/* <div className="col-span-2 px-2">
                        <Controller
                          name="assignUtility"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"assignUtility"}
                              placeholder={"Find Utility"}
                              typeSelect={2}
                              options={utilityList}
                              valueProp={"id"}
                              displayProp={"abbr"}
                              disable={disableUtility}
                              onChangeInput={(value) => {
                                handleChangeAssignFilter(value, "UTILITY");
                              }}
                            />
                          )}
                        />
                      </div> */}
                      <div className="col-span-2 px-2">
                        <Controller
                          name="assignStatus"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"assignStatus"}
                              typeSelect={2}
                              options={statusList}
                              valueProp={"id"}
                              displayProp={"statusName"}
                              placeholder={"Find Status"}
                              onChangeInput={(value) => {
                                handleChangeAssignFilter(value, "STATUS");
                              }}
                              wrapText={true}
                            />
                          )}
                        />
                      </div>
                      {/* {isDeviceGroup && (
                        <div className="col-span-3">
                          <div
                            type="button"
                            onClick={handleClickDeviceRegistration}
                            className={`w-full h-[40px] bg-[#87be33] rounded no-underline	`}
                          >
                            <div className="flex justify-center items-center md:px-2">
                              <img
                                src={addLogoWhite}
                                alt="React Logo"
                                width={20}
                                height={20}
                                className={"text-white mr-2"}
                              />

                              <button className="h-[40px] text-white bg-[#87be33] rounded md:text-start	">
                                Device Registration
                              </button>
                            </div>
                          </div>
                        </div>
                      )} */}
                    </form>
                  </div>
                </div>
                <div className="relative overflow-x-auto  sm:rounded-lg">
                  <DataTable
                    data={assignedList}
                    columns={columnsAssigned}
                    searchData={searchQueryAssigned}
                    checkbox={false}
                  />

                  {/* <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-left"
                        >
                          Device Name
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
                          Capacity
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
                      {assignedList?.map((item) => {
                        let statusColor = getStatusColor(item.statusName);
                        return (
                          <>
                            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                              <th
                                scope="row"
                                className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap "
                              >
                                <div className="flex  w-80">
                                  <div className="w-1/6">
                                    <img
                                      src={egat}
                                      className="w-[40px] h-[40px]"
                                      style={{ borderRadius: "50%" }}
                                    ></img>
                                  </div>
                                  <div className="flex flex-col ml-2 w-5/6">
                                    <div
                                      className="font-semibold	"
                                      style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "400px",
                                      }}
                                    >
                                      {" "}
                                      {item.name}{" "}
                                    </div>
                                    <label className="text-[#33bfbf] bg-[#f0f8ff] rounded w-max px-2 py-1 text-xs	font-semibold">
                                      {item?.typeName}
                                    </label>
                                  </div>
                                </div>
                              </th>
                              <td className="px-6 py-3 font-semibold text-black w-48 text-center">
                                {item.utilityContractAbbr}
                              </td>
                              <td className="px-6 py-3 font-semibold text-black w-48 text-center">
                                {item.capacity}
                              </td>
                              <td className="px-6 py-3 font-semibold text-black w-60 text-center">
                                {item.portfolio}
                              </td>
                              <td className="px-6 py-3 font-semibold w-48 text-black text-center">
                                <div
                                  className={`rounded-large ${statusColor} text-center py-1.5 px-2 text-white font-semibold text-xs`}
                                >
                                  {item?.statusName ? item?.statusName : "-"}
                                </div>
                              </td>
                              <td className="px-6 py-3 w-48">
                                <Link
                                  type="button"
                                  state={{ code: item.id }}
                                  to={WEB_URL.DEVICE_INFO}
                                  className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#e2e2ac] bg-[#f5f4e9]`}
                                >
                                  <label className="m-auto cursor-pointer text-[#4d6a00] font-semibold">
                                    {"Manage"}
                                  </label>
                                </Link>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                      {totalAssigned == 0 && (
                        <td
                          class="px-6 py-4 font-semibold text-black"
                          colspan="6"
                          align="center"
                        >
                          No Data Found!
                        </td>
                      )}
                    </tbody>
                  </table> 

                  <div className="flex justify-end mt-4">
                    <PaginatedItems
                      itemsPerPage={itemsPerPage}
                      handlePageClick={handleAssignedPageClick}
                      totalData={totalAssigned}
                      changepage={currentAssignedFilterObj}
                    />
                  </div> */}
                </div>
              </div>
            </Card>

            {/* {UnAssigned Table Content} */}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full overflow-visible"
              padding="xl"
            >
              <div className="  text-sm  ">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="lg:col-span-2 2xl:col-span-3 mb-4">
                    <span className="font-bold text-lg">
                      Inactive Devices
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      >
                        {totalUnAssigned}{" "}
                        {totalUnAssigned > 1 ? "Devices" : "Device"}
                      </label>
                    </span>
                  </div>

                  <div className="grid lg:col-span-4 2xl:col-span-3 grid-cols-6">
                    <form className="grid col-span-6 grid-cols-6">
                    <div className="col-span-2 px-2">
                <Controller
                    name="SearchText"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <SearchBox
                            placeholder="Search"
                            onChange={handleUnAssignedSearchChange} // Use the updated function
                            value={searchQueryUnAssigned} // Bind the input value to the state
                             
                        />
                    )}
                />
            </div>
                      <div className="col-span-2 px-2">
                        <Controller
                          name="unAssignType"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"unAssignType"}
                              placeholder={"Find Type"}
                              typeSelect={2}
                              options={typeList}
                              valueProp={"id"}
                              displayProp={"name"}
                              onChangeInput={(value) => {
                                handleChangeUnAssignFilter(value, "TYPE");
                              }}
                              wrapText={true}
                              isSearchable={true}
                              size="large"
                            />
                          )}
                        />
                      </div>
                      {/* <div className="col-span-2 px-2">
                        <Controller
                          name="unAssignUtility"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"unAssignUtility"}
                              placeholder={"Find Utility"}
                              options={utilityList}
                              valueProp={"id"}
                              displayProp={"abbr"}
                              typeSelect={2}
                              disable={disableUtility}
                              onChangeInput={(value) => {
                                handleChangeUnAssignFilter(value, "UTILITY");
                              }}
                            />
                          )}
                        />
                      </div> */}
                      <div className="col-span-2 px-2">
                        <Controller
                          name="unAssignStatus"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"unAssignStatus"}
                              typeSelect={2}
                              options={statusList? statusList.filter(status => status.statusName !== "Renewed") : []}
                              valueProp={"id"}
                              displayProp={"statusName"}
                              placeholder={"Find Status"}
                              onChangeInput={(value) => {
                                handleChangeUnAssignFilter(value, "STATUS");
                              }}
                              wrapText={true}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="relative overflow-x-auto  sm:rounded-lg">
                  <DataTable
                    data= {filteredSearchResults}
                    columns={columnsUnAssigned}
                    searchData={searchQueryUnAssigned}
                    checkbox={false}
                  />

                  {/* <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-left"
                        >
                          Device Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-left"
                        >
                          Utility Contract
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-left"
                        >
                          Capacity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-left"
                        >
                          Portfolio
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 capitalize text-left"
                        >
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {unAssignedList?.map((item) => {
                        let statusColor = getStatusColor(item.statusName);
                        return (
                          <>
                            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                              <th
                                scope="row"
                                className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap "
                              >
                                <div className="flex w-80	">
                                  <div className="w-1/6">
                                    <img
                                      title="egat-img"
                                      src={egat}
                                      className="w-[40px] h-[40px]"
                                      style={{ borderRadius: "50%" }}
                                    ></img>
                                  </div>
                                  <div className="flex flex-col ml-2 w-5/6">
                                    <div
                                      className="font-semibold	"
                                      style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "400px",
                                      }}
                                    >
                                      {item.name}{" "}
                                    </div>
                                    <label className="text-[#33bfbf] bg-[#f0f8ff] rounded w-max px-2 py-1 text-xs	font-semibold">
                                      {item?.typeName}
                                    </label>
                                  </div>
                                </div>
                              </th>
                              <td className="px-6 py-3 font-semibold text-black w-48	">
                                {item.utilityContractAbbr}
                              </td>
                              <td className="px-6 py-3 font-semibold text-black w-48">
                                {item.capacity}
                              </td>
                              <td className="px-6 py-3 font-semibold text-black w-60">
                                {item.portfolio}
                              </td>
                              <td className="px-6 py-3 font-semibold text-black w-48">
                                <div
                                  className={`rounded-large ${statusColor} w-24	text-center	py-1.5 px-2 ${
                                    statusColor ? "text-white" : "text-black"
                                  } font-semibold text-xs`}
                                >
                                  {item?.statusName ? item?.statusName : "-"}
                                </div>
                              </td>
                              <td className="px-6 py-3 w-48">
                                <Link
                                  type="button"
                                  state={{ code: item.id }}
                                  to={WEB_URL.DEVICE_INFO}
                                  className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#e2e2ac] bg-[#f5f4e9]`}
                                >
                                  <label className="m-auto cursor-pointer text-[#4d6a00] font-semibold">
                                    {"Manage"}
                                  </label>
                                </Link>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                      {totalUnAssigned == 0 && (
                        <td
                          class="px-6 py-4 font-semibold text-black"
                          colspan="6"
                          align="center"
                        >
                          No Data Found!
                        </td>
                      )}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-4">
                    <PaginatedItems
                      itemsPerPage={itemsPerPage}
                      handlePageClick={handleUnAssignedPageClick}
                      totalData={totalUnAssigned}
                      changepage={currentUnAssignedFilterObj}
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

export default ListDevice;

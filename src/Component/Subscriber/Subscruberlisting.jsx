import React, { useEffect, useState } from "react";
import { Card } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import SubscriberLOGO01 from "../assets/3-user.svg";
import SubscriberLOGO02 from "../assets/contractenergy.svg";
import SubscriberLOGO03 from "../assets/accumconsum.svg";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import PaginatedItems from "../Control/Table/Pagination";
import * as WEB_URL from "../../Constants/WebURL";
import addLogoWhite from "../assets/Add-User.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Multiselect from "../Control/Multiselect";
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
} from "../../Redux/Subscriber/Action";
import LoadPage from "../Control/LoadPage";
import DataTable from "../Control/Table/DataTable";
import SearchBox from "../Control/SearchBox";
import StatusLabel from "../../Component/Control/StatusLabel";
import { CloseButton, Input } from "@mantine/core";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Highlighter from "react-highlight-words";
import numeral from "numeral";

const itemsPerPage = 200;

const Subscriberlisting = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const statusList = filterList?.findStatus;
  const utilityList = filterList?.findUtility;

  const [searchQueryAssigned, setSearchQueryAssigned] = useState("");
  const [searchQueryUnAssigned, setSearchQueryUnAssigned] = useState("");

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsAssigned = [
    {
      id: "subcriberName",
      label: "Subscriber Name",
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
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={row.subcriberName}
            />
          </div>
          <style>{`
    .highlight {
      background-color: yellow;
      font-weight: bold;
    }
  `}</style>
          <label
            className={`${
              row?.subscriberTypeId == 1
                ? "bg-[#E8E2F6] text-[#4c3486]"
                : "bg-[#D6EEF1] text-[#32686f]"
            } rounded w-max px-2 py-1 mt-1 text-xs font-normal`}
          >
            {row?.subscriberTypeId == 1 ? "Subscriber" : "Aggregate Subscriber"}
          </label>
        </div>
      ),
    },
    {
      id: "utilityContractAbbr",
      label: "Utility Contract",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.utilityContractAbbr}
          />
        </span>
      ),
    },
    {
      id: "contractedEnergy",
      label: "Allocated Energy Amount (kWh)",
      align: "right",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={
              row?.contractedEnergy
                ? row?.contractedEnergy?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                : "-"
            }
          />
        </span>
      ),
    },
    {
      id: "portfolio",
      label: "Portfolio",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.portfolio}
          />
        </span>
      ),
    },
    {
      id: "subscriberStatusId",
      label: "Status",
      render: (row) => (
        // StatusLabel(row?.subscriberStatusId == 1 ? "Inactive" : "Active"),
        <StatusLabel
          status={row?.subscriberStatusId == 1 ? "Inactive" : "Active"}
          searchQuery={searchQueryAssigned}
        />
      ),
    },
    {
      id: "manage",
      label: "",
      render: (row) => (
        <Link
          type="button"
          state={{ id: row.id }}
          to={WEB_URL.SUBSCRIBER_INFO}
          className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#4D6A00] bg-[#87BE33]`}
        >
          <label className="m-auto cursor-pointer text-white font-semibold">
            {"Manage"}
          </label>
        </Link>
      ),
    },
    // Add more columns as needed
  ];

  const columnsUnAssigned = [
    {
      id: "subcriberName",
      label: "Subscriber Name",
      align: "left",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold break-words"
            style={{
              // whiteSpace: "nowrap",
              // overflow: "hidden",
              // textOverflow: "ellipsis",
              maxWidth: "350px",
            }}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryUnAssigned]}
              autoEscape={true}
              textToHighlight={row.subcriberName}
            />
          </div>
          <label
            className={`${
              row?.subscriberTypeId == 1
                ? "bg-[#E8E2F6] text-[#4c3486]"
                : "bg-[#D6EEF1] text-[#32686f]"
            } rounded w-max px-3 py-1 mt-1 text-xs font-normal`}
          >
            {row?.subscriberTypeId == 1 ? "Subscriber" : "Aggregate Subscriber"}
          </label>
        </div>
      ),
    },
    {
      id: "utilityContractAbbr",
      label: "Utility Contract",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={row.utilityContractAbbr}
          />
        </span>
      ),
    },
    {
      id: "contractedEnergy",
      label: "Allocated Energy Amount (kWh)",
      align: "right",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryUnAssigned]}
            autoEscape={true}
            textToHighlight={
              row?.contractedEnergy
                ? row?.contractedEnergy?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                : "-"
            }
          />
        </span>
      ),
    },
    // { id: "portfolio", label: "Portfolio" },
    {
      id: "portfolio",
      label: "Portfolio",
      render: (row) => (
        <Highlighter
          highlightClassName="highlight"
          highlightTag={Highlight}
          searchWords={[searchQueryUnAssigned]}
          autoEscape={true}
          textToHighlight={row.portfolio}
        />
      ),
    },
    {
      id: "subscriberStatusId",
      label: "Status",
      render: (row) => (
        // StatusLabel(row?.subscriberStatusId == 1 ? "Inactive" : "Active"),
        <StatusLabel
          status={row?.subscriberStatusId == 1 ? "Inactive" : "Active"}
          searchQuery={searchQueryUnAssigned}
        />
      ),
      // render: (row) => (
      //   <div
      //     className={`text-white rounded-large font-semibold text-xs py-1.5 px-2
      //     bg-${
      //       row.subscriberStatusId == 1 ? "PRIMARY_BUTTON" : "SUCCESS_BUTTON"
      //     }`}
      //   >
      //     {row.subscriberStatusId == 1 ? "Inactive" : "Active"}
      //   </div>
      // ),
    },
    {
      id: "manage",
      label: "",
      render: (row) => (
        <Link
          type="button"
          state={{ id: row.id }}
          to={WEB_URL.SUBSCRIBER_INFO}
          className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#4D6A00] bg-[#87BE33]`}
        >
          <label className="m-auto cursor-pointer text-white font-semibold">
            {"Manage"}
          </label>
        </Link>
      ),
    },
    // Add more columns as needed
  ];

  useEffect(() => {
    const { hash, pathname, search } = location;

    if (WEB_URL.SUBSCRIBER_LIST == pathname) {
      dispatch(setSelectedSubMenu(SUB_MENU_ID.SUBSCRIBER_LIST_INFO));
      setCookie("currentSubmenu", SUB_MENU_ID.SUBSCRIBER_LIST_INFO);
    }
  }, []);

  useEffect(() => {
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
  }, [currentUGTGroup]);

  // assign table
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      fetchTableAssign();
    }
  }, [currentUGTGroup, isAssignedStatusId, userData]);

  // unAssign table
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      fetchTableUnassign();
    }
  }, [currentUGTGroup, isUnassignedStatusId, userData]);

  const fetchTableAssign = () => {
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
        userData?.userGroup?.id === USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id === USER_GROUP_ID.ALL_MODULE_VIEWER
      ) {
        setIsSubscriberGroup(false);
        permissFindUntilyty = { utility: [] };
        const paramSubscriberAssign = {
          findUgtGroupId: currentUGTGroup?.id,
          findUtilityId: permissFindUntilyty,
          findStatusId: isAssignedStatusId,
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
  };
  const fetchTableUnassign = () => {
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
  };
  const handleChangeAssignUtility = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = { ...isAssignedUtilityId, utility: currentFilter };
    setIsAssignedUtilityId(newCurrentFilter);
  };
  const handleChangeAssignStatus = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = { ...isAssignedStatusId, status: currentFilter };
    setIsAssignedStatusId(newCurrentFilter);
  };
  const handleChangeUnassignUtility = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = {
      ...isUnassignedUtilityId,
      utility: currentFilter,
    };
    setIsUnassignedUtilityId(newCurrentFilter);
  };
  const handleChangeUnassignStatus = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = { ...isUnassignedStatusId, status: currentFilter };
    setIsUnassignedStatusId(newCurrentFilter);
  };
  const handleClickSubscribRegistration = () => {
    dispatch(setSelectedSubMenu(2));
    setCookie("currentSubmenu", 2);
    navigate(WEB_URL.SUBSCRIBER_ADD);
  };
  const handleAssignedPageClick = (page) => {
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
  };
  const handleUnAssignedPageClick = (page) => {
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
  };

  const handleAssignedSearchChange = (e) => {
    setSearchQueryAssigned(e.target.value);
  };

  const handleUnAssignedSearchChange = (e) => {
    setSearchQueryUnAssigned(e.target.value);
  };

  const styleTable = "px-6 py-4 font-semibold text-black text-center";
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                Subscriber Info
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Subscriber Management / Subscriber
                Info
              </p>
            </div>

            <div className="flex sm:flex-col lg:flex-row justify-start items-start gap-3">
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
                      className={`flex justify-center w-[75px] h-[75px] mb-2 bg-PRIMARY_BUTTON`}
                    >
                      <img
                        alt={"subscriber"}
                        src={SubscriberLOGO01}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-3xl font-semibold flex justify-end">
                        {numeral(dashboardOBJ?.totalSucriber).format("0,0")}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        {dashboardOBJ?.totalSucriber > 1
                          ? "Subscribers"
                          : "Subscriber"}
                      </label>
                    </div>
                  </div>
                  <div className="font-bold mt-2">
                    Total Active Contracted Subscribers
                  </div>
                  <div className="text-gray-500 text-xs">
                    Keep track of all your subscribers at a glance.
                  </div>
                </div>
              </Card>

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
                      className={`flex justify-center w-[75px] h-[75px] mb-2 bg-SUCCESS_BUTTON`}
                    >
                      <img
                        alt={"ig"}
                        src={SubscriberLOGO02}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-2xl font-semibold flex justify-end">
                        {numeral(dashboardOBJ?.contractedEnergy * 0.001).format(
                          "0,0.000000"
                        )}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        MWh
                      </label>
                    </div>
                  </div>
                  <div className="font-bold  mt-2">
                    Active Contracted Energy
                  </div>
                  <div className="text-gray-500 text-xs">
                    Monitor your entire power at a glance.
                  </div>
                </div>
              </Card>

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
                      className={`flex justify-center w-[75px] h-[75px] bg-SECONDARY_BUTTON mb-2 `}
                    >
                      <img
                        alt={"ig"}
                        src={SubscriberLOGO03}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-2xl font-semibold flex justify-end">
                        {numeral(
                          dashboardOBJ?.accumulateConsumption * 0.001
                        ).format("0,0.000000")}
                      </label>
                      <label className="text-lg font-medium text-slate-500">
                        MWh
                      </label>
                    </div>
                  </div>

                  <div className="font-bold mt-2">Accumulated Consumption</div>
                  <div className="text-gray-500 text-xs">
                    Monitor your energy consumption real-time.
                  </div>
                </div>
              </Card>
            </div>

            {isSubscriberGroup && (
              <div className="grid gap-4 gap-y-2 text-sm lg:grid-cols-8 mt-3">
                <div className="col-span-6"></div>
                <div className="col-span-2">
                  <div
                    type="button"
                    onClick={handleClickSubscribRegistration}
                    className={`w-full h-[40px] bg-[#87be33] rounded no-underline	`}
                  >
                    <div className="flex justify-center items-center">
                      <img
                        src={addLogoWhite}
                        alt="React Logo"
                        width={20}
                        height={20}
                        className={"text-white mr-2"}
                      />

                      <button className="h-[40px] text-white bg-[#87be33] rounded ">
                        Subscriber Registration
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
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="lg:col-span-2 2xl:col-span-3 mb-4">
                    <span className="font-bold text-lg">
                      Assigned Subscriber
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      >
                        {numeral(totalAssigned).format("0,0")}{" "}
                        {totalAssigned > 1 ? "Subscribers" : "Subscriber"}
                      </label>
                    </span>
                  </div>

                  <div className="grid lg:col-span-4 2xl:col-span-3 grid-cols-6">
                    <form className="grid col-span-6 grid-cols-6">
                      {/* เอา utility ออก ต้องใส่ col-span-2 ไว้ */}
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

                      {/* <div className="col-span-2 px-2">
                        <Controller
                          name="assignUtility"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"assignUtility"}
                              typeSelect={2}
                              options={utilityList}
                              valueProp={"id"}
                              displayProp={"name"}
                              disable={true}
                              placeholder={"Find Utility"}
                              onChangeInput={(value) => {
                                handleChangeAssignUtility(value);
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
                                handleChangeAssignStatus(value);
                              }}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>

                <div className="relative overflow-x-auto sm:rounded-lg">
                  <DataTable
                    data={getAssignOBJ}
                    columns={columnsAssigned}
                    searchData={searchQueryAssigned}
                    checkbox={false}
                  />
                </div>
              </div>
            </Card>

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
                      Unassigned Subscriber
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      >
                        {totalUnAssigned?.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                        })}{" "}
                        Subscribers
                      </label>
                    </span>
                  </div>

                  <div className="grid lg:col-span-4 2xl:col-span-3 grid-cols-6">
                    <form className="grid col-span-6 grid-cols-6">
                      {/* เอา utility ออก ต้องใส่ col-span-2 ไว้ */}
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

                      {/* <div className="col-span-2 px-2">
                        <Controller
                          name="unassignUtility"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"unassignUtility"}
                              typeSelect={2}
                              options={utilityList}
                              valueProp={"id"}
                              displayProp={"name"}
                              disable={true}
                              placeholder={"Find Utility"}
                              onChangeInput={(value) => {
                                handleChangeUnassignUtility(value);
                                handleChangeUnassignStatus;
                              }}
                            />
                          )}
                        />
                      </div> */}
                      <div className="col-span-2 px-2">
                        <Controller
                          name="unassignStatus"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"unassignStatus"}
                              typeSelect={2}
                              options={statusList}
                              valueProp={"id"}
                              displayProp={"statusName"}
                              placeholder={"Find Status"}
                              onChangeInput={(value) => {
                                handleChangeUnassignStatus(value);
                              }}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="relative overflow-x-auto sm:rounded-lg">
                  <DataTable
                    data={getUnassignOBJ}
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

export default Subscriberlisting;

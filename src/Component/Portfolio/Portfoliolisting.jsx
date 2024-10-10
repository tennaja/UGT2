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
} from "../../Redux/Portfolio/Action";
import { setSelectedYear } from "../../Redux/Settlement/Action";
import { setCookie } from "../../Utils/FuncUtils";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import { USER_GROUP_ID, UTILITY_GROUP_ID } from "../../Constants/Constants";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import { message } from "antd";
import { MdOutlineContentCopy } from "react-icons/md";
const itemsPerPage = 5;
const Portfoliolisting = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const [isPortManager, setIsPortManager] = useState(false);
  const userData = useSelector((state) => state.login.userobj);

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      if (userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG) {
        setIsPortManager(true);
      }
    }
  }, [currentUGTGroup, userData]);

  const dashboardData = useSelector(
    (state) => state.portfolio.portfolioDashboard
  );
  const dashboardDataList = useSelector(
    (state) => state.portfolio.portfolioDashboardList
  );
  const [dashboardList, setDashboardList] = useState([]);
  const [activeList, setActiveList] = useState([]);
  const [inactiveList, setInactiveList] = useState([]);
  
  useEffect(() => {
    if (currentUGTGroup?.id) {
      dispatch(PortfolioManagementDashboard(currentUGTGroup?.id));
      dispatch(PortfolioManagementDashboardList(currentUGTGroup?.id));
    }
  }, [currentUGTGroup?.id]);

  useEffect(() => {
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
      console.log(formattedDataArray)
    }
  }, [dashboardDataList]);

  useEffect(() => {
    const now = new Date();
    const _now = now.setHours(0, 0, 0, 0);

    const filtered = dashboardList.filter((item) => {
        const [endDay, endMonth, endYear] = item.endDate.split("/");
        const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);
        const _endDate = endDate.setHours(0, 0, 0, 0);

        const [startDay, startMonth, startYear] = item.startDate.split("/");
        const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
        const _startDate = startDate.setHours(0, 0, 0, 0);

        return _startDate <= _now && _endDate >= _now;
    });

    setActiveList(filtered);
}, [dashboardList]);


useEffect(() => {
  const now = new Date();
  const _now = now.setHours(0, 0, 0, 0);

  const filtered = dashboardList.filter((item) => {
    const [startDay, startMonth, startYear] = item.startDate.split("/");
    const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
    const _startDate = startDate.setHours(0, 0, 0, 0);

    const [endDay, endMonth, endYear] = item.endDate.split("/");
    const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);
    const _endDate = endDate.setHours(0, 0, 0, 0);

    return _startDate > _now 
    // || _endDate <= _now;
  });

  setInactiveList(filtered);
}, [dashboardList]);


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success("copy to clipboard")
      },
      (err) => {
        message.error('Failed to copy!');
      }
    );
  };
 console.log(dashboardDataList)
  useEffect(() => {}, [dashboardData]);
  const statusList = [
    {
      id: 1,
      statusName: "InActive",
    },
    {
      id: 2,
      statusName: "Expired",
    },
  ];

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsActive = [
    {
      id: "portfolio",
      label: "Portfolio",
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
              searchWords={[searchQueryActive]}
              autoEscape={true}
              textToHighlight={row.portfolioName}
            />
          </div>
          
          <div>
          <label
            className={`${"bg-[#FFDAE1] text-[#FE3C90]"} rounded w-max px-3 py-1 mt-1 text-xs font-bold`}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryActive]}
              autoEscape={true}
              textToHighlight={row.portfolioCode}
            />
            
            
          </label>
          <button>
              <MdOutlineContentCopy className="inline-block ml-2" onClick={()=>copyToClipboard(row.portfolioCode)}/>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "numberOfDevices",
      label: "Number of Devices",
      width: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
        />
      ),
    },

    {
      id: "numberOfSubscribers",
      label: "Number of Subscribers",
      width: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.numberOfSubscribers.toString()}
        />
      ),
    },
    {
      id: "mechanismName",
      label: "Mechanism",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.mechanismName}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
    {
      id: "manage",
      label: "",
      render: (row) => (
        <div className="flex gap-2">
          <div
            className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#e38809] bg-[#EFAE1E]`}
            onClick={() => {
              // ล้างค่า settlementYear ก่อนทุกครั้ง
              dispatch(setSelectedYear(null));

              navigate(WEB_URL.SETTLEMENT, {
                state: {
                  id: row?.id,
                  name: row?.portfolioName,
                },
              });
            }}
          >
            <label className="m-auto cursor-pointer text-white font-semibold">
              {"Settlement"}
            </label>
          </div>

          <Link
            type="button"
            state={{ id: row?.id }}
            to={WEB_URL.PORTFOLIO_INFO}
            className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#4D6A00] bg-[#87BE33]`}
          >
            <label className="m-auto cursor-pointer text-white font-semibold">
              {"Manage"}
            </label>
          </Link>
        </div>
      ),
    },

    // Add more columns as needed
  ];
  const columnsInactive = [
    {
      id: "portfolio",
      label: "Portfolio",
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
              searchWords={[searchQueryInactive]}
              autoEscape={true}
              textToHighlight={row.portfolioName}
            />
          </div>
          
          <div>
          <label
            className={`${"bg-[#FFDAE1] text-[#FE3C90]"} rounded w-max px-3 py-1 mt-1 text-xs font-bold`}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryInactive]}
              autoEscape={true}
              textToHighlight={row.portfolioCode}
            />
            
            
          </label>
          <button>
              <MdOutlineContentCopy className="inline-block ml-2" onClick={()=>copyToClipboard(row.portfolioCode)}/>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "numberOfDevices",
      label: "Number of Devices",
      width: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryInactive]}
          autoEscape={true}
          textToHighlight={row.numberOfDevices.toString()}
        />
      ),
    },

    {
      id: "numberOfSubscribers",
      label: "Number of Subscribers",
      width: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryInactive]}
          autoEscape={true}
          textToHighlight={row.numberOfSubscribers.toString()}
        />
      ),
    },
    {
      id: "mechanismName",
      label: "Mechanism",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryInactive]}
          autoEscape={true}
          textToHighlight={row.mechanismName}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryInactive]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryInactive]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
    {
      id: "manage",
      label: "",
      render: (row) => (
        <div className="flex gap-2">
          <div
            className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#e38809] bg-[#EFAE1E]`}
            onClick={() => {
              // ล้างค่า settlementYear ก่อนทุกครั้ง
              dispatch(setSelectedYear(null));

              navigate(WEB_URL.SETTLEMENT, {
                state: {
                  id: row?.id,
                  name: row?.portfolioName,
                },
              });
            }}
          >
            <label className="m-auto cursor-pointer text-white font-semibold">
              {"Settlement"}
            </label>
          </div>

          <Link
            type="button"
            state={{ id: row?.id }}
            to={WEB_URL.PORTFOLIO_INFO}
            className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#4D6A00] bg-[#87BE33]`}
          >
            <label className="m-auto cursor-pointer text-white font-semibold">
              {"Manage"}
            </label>
          </Link>
        </div>
      ),
    },

    // Add more columns as needed
  ];
  const [searchQueryActive, setSearchQueryActive] = useState("");
  const [searchQueryInactive, setSearchQueryInactive] = useState("");
  
  const portfolioEdit = (data) => {
    console.log("Manage == ", data);
    navigate(WEB_URL.SUBSCRIBER_INFO);
  };
  
  const handleSearchChangeActive = (e) => {
    setSearchQueryActive(e.target.value);
  };
  const handleSearchChangeInactive = (e) => {
    setSearchQueryInactive(e.target.value);
  };

  function convertToDate(dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const handleChangeStatus = (value) => {
    if (value?.length == 1) {
      if (value[0]?.id == 1) {
        const now = new Date();
        const _now = now.setHours(0, 0, 0, 0);
        const filtered = dashboardList.filter((item) => {
          const [startDay, startMonth, startYear] = item.startDate.split("/");
          const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
          const _startDate = startDate.setHours(0, 0, 0, 0);
          return _startDate > _now 
        });
        setInactiveList(filtered);
      } else {
        const now = new Date();
        const _now = now.setHours(0, 0, 0, 0);
        const filtered = dashboardList.filter((item) => {
          const [endDay, endMonth, endYear] = item.endDate.split("/");
          const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);
          const _endDate = endDate.setHours(0, 0, 0, 0);
          return _endDate <= _now;
        });
        setInactiveList(filtered);
      }
    } else {
      const now = new Date();
  const _now = now.setHours(0, 0, 0, 0);
      const filtered = dashboardList.filter((item) => {
        const [startDay, startMonth, startYear] = item.startDate.split("/");
        const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
        const _startDate = startDate.setHours(0, 0, 0, 0);
        return _startDate > _now 
      });
    
      setInactiveList(filtered);
    }
  };
  const handleClickAddPortfolio = () => {
    dispatch(setSelectedSubMenu(2));
    setCookie("currentSubmenu", 2);
    navigate(WEB_URL.PORTFOLIO_ADD);
  };
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                Portfolio Info
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Portfolio & Settlement Management /
                Portfolio Info
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
                      {/* <CgCircleci className="text-green-500 w-[50px] h-[50px] mb-2"></CgCircleci> */}
                      <img
                        alt={"subscriber"}
                        src={submenuPortfolioLogoInfoSelectedwhite}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-4xl font-semibold flex justify-end">
                        {numeral(dashboardData?.totalPortfoilo).format("0,0")}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        {dashboardData?.totalPortfoilo > 1
                          ? "Portfolios"
                          : "Portfolio"}
                      </label>
                    </div>
                  </div>
                  <div className="font-bold mt-2">Total Active Portfolios</div>
                  <div className="text-gray-500 text-xs">
                    Keep track of all your portfolios
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
                        src={deviceLogo}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-4xl font-semibold flex justify-end">
                        {numeral(dashboardData?.totalDevice).format("0,0")}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        {dashboardData?.totalDevice > 1 ? "Devices" : "Device"}
                      </label>
                    </div>
                  </div>
                  <div className="font-bold mt-2">Total Active Devices</div>
                  <div className="text-gray-500 text-xs">
                    Monitor your entire devices at a glance.
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
                        src={SubscriberLOGO01}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-4xl font-semibold flex justify-end">
                        {numeral(dashboardData?.totalSubscriber).format("0,0")}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        {dashboardData?.totalSubscriber > 1
                          ? "Subscribers"
                          : "Subscriber"}
                      </label>
                    </div>
                  </div>

                  <div className="font-bold mt-2">Total Active Subscribers</div>
                  <div className="text-gray-500 text-xs">
                    Monitor your subscribers at a glance.
                  </div>
                </div>
              </Card>
            </div>
            {isPortManager && (
                        <div className="grid col-span-4 grid-cols-12 mr-2 mt-3">
                          <div className="col-span-9"></div>
                          <div className="text-sm col-span-3">
                          <div
                            type="button"
                            onClick={handleClickAddPortfolio}
                            className={`w-full h-[40px] hover:bg-[#4D6A00] bg-[#87BE33]  rounded no-underline	`}
                          >
                            <div className="flex justify-center items-center">
                              <img
                                src={submenuPortfolioLogoAddSelectedwhite}
                                alt="React Logo"
                                width={20}
                                height={20}
                                className={"text-white mr-2"}
                              />

                              <button
                                className="h-[40px] text-white  cursor-pointer items-center rounded font-semibold"
                                type="button"
                              >
                                Add New Portfolio
                              </button>
                            </div>
                          </div>
                        </div>
                        </div>
                      )}
            {/* Active */}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="col-span-2 mb-4">
                    <span className="font-bold text-lg">
                      Active Portfolio
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      >
                        {activeList?.length}{" "}
                        {activeList?.length > 1 ? "Portfolios" : "Portfolio"}
                      </label>
                    </span>
                  </div>

                  <div className="grid col-span-4 grid-cols-12">
                    <form className="grid col-span-12 grid-cols-12 gap-2 ">
                      {/* <div className="col-span-3 px-2"></div> */}
                      {!isPortManager && <div className="col-span-4"></div>}
                      <div className="col-span-4"></div>
                      <div className="col-span-4"></div>
                      <div className="col-span-4">
                        <Controller
                          name="SearchText"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <SearchBox
                              placeholder="Search"
                              onChange={handleSearchChangeActive}
                            />
                          )}
                        />
                      </div>

                      {/* <div className="col-span-4">
                        <Controller
                          name="status"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"status"}
                              typeSelect={2}
                              options={statusList}
                              valueProp={"id"}
                              displayProp={"statusName"}
                              placeholder={"Find Status"}
                              onChangeInput={(value) => {
                                handleChangeStatus(value);
                              }}
                            />
                          )}
                        />
                      </div> */}

                      
                    </form>
                  </div>
                </div>

                <DataTable
                  data={activeList}
                  columns={columnsActive}
                  searchData={searchQueryActive}
                  checkbox={false}
                />
              </div>
            </Card>
            {/* Inactive*/}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="col-span-2 mb-4">
                    <span className="font-bold text-lg">
                      Inactive Portfolio
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      >
                        {inactiveList?.length}{" "}
                        {inactiveList?.length > 1 ? "Portfolios" : "Portfolio"}
                      </label>
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
                              onChange={handleSearchChangeInactive}
                            />
                          )}
                        />
                      </div>

                      <div className="col-span-4">
                        <Controller
                          name="status"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"status"}
                              typeSelect={2}
                              options={statusList}
                              valueProp={"id"}
                              displayProp={"statusName"}
                              placeholder={"Find Status"}
                              onChangeInput={(value) => {
                                handleChangeStatus(value);
                              }}
                            />
                          )}
                        />
                      </div>

                      
                    </form>
                  </div>
                </div>

                <DataTable
                  data={inactiveList}
                  columns={columnsInactive}
                  searchData={searchQueryInactive}
                  checkbox={false}
                />
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

export default Portfoliolisting;

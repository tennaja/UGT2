import React, { useEffect, useState } from "react";
import { Card } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import SubscriberLOGO01 from "../assets/3-user.svg";
import Calendar from "../assets/calendars.svg";
import User from "../assets/3 user.svg";
import Clock from "../assets/Clock.svg";
import Graph from "../assets/graphNew.svg";
import SubscriberLOGO02 from "../assets/contractenergy.svg";
import SubscriberLOGO03 from "../assets/accumconsum.svg";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import PaginatedItems from "../Control/Table/Pagination";
import * as WEB_URL from "../../Constants/WebURL";
import addLogoWhite from "../assets/Add-User.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import Multiselect from "../Control/Multiselect";
import MySelect from "../Control/Select";
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
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import MySelectSubscriber from "./SelectSubscriber";
import { message } from "antd";
import { MdOutlineContentCopy } from "react-icons/md";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ["EGAT", "MEA", "PEA"],
  datasets: [
    {
      data: [35, 35, 30],
      backgroundColor: [
        "#FFC72C",
        "#FD812E",
        "#B64BEB",
        /*
        'rgba(255, 206, 86, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',*/
      ],
      borderColor: ["#FFC72C", "#FD812E", "#B64BEB"],
      borderWidth: 1,
      hoverOffset: 4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      /*position: 'bottom', // Legend at the bottom
      labels: {
        boxWidth: 20,
        padding: 20,
      },*/
    },
    datalabels: {
      color: "#fff",
      formatter: (value) => {
        return `${value}%`; // Display percentage value
      },
      anchor: "center",
      align: "center",
      font: {
        weight: "bold",
        size: 16,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color of the tooltip
      titleFont: {
        size: 0,
      },
      bodyFont: {
        size: 14,
      },
      callbacks: {
        label: function (tooltipItem) {
          // Customize the label content
          const dataLabel = data.labels[tooltipItem.dataIndex];
          const value = tooltipItem.raw;
          return `${dataLabel}: ${value}%`;
        },
      },
    },
    title: {
      display: true,
      text: "Custom Pie Chart with Labels Inside",
    },
  },
};

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
  const [isAssignedPortfolioId, setIsAssignedPortfolioId] = useState({
    portfolio: null,
  });
  const [isUnassignedPortfolioId, setIsUnassignedPortfolioId] = useState({
    portfolio: null,
  });
  const statusListActive = filterList?.findStatusActive;
  const statusListInactive = filterList?.findStatusInactive;
  const portfolioList = filterList?.findPortfolio;
  const utilityList = filterList?.findUtility;

  const [searchQueryAssigned, setSearchQueryAssigned] = useState("");
  const [searchQueryUnAssigned, setSearchQueryUnAssigned] = useState("");
  const [labelPie, setLabelPie] = useState([]);
  const [dataOnPie, setOnDataPie] = useState([]);

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const [dataPie, setDataPie] = useState({
    labels: ["EGAT", "MEA", "PEA"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          "#FFC72C",
          "#FD812E",
          "#B64BEB",
          /*
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',*/
        ],
        borderColor: ["#FFC72C", "#FD812E", "#B64BEB"],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  });

  useEffect(() => {
    setDataPieChart();
  }, [dashboardOBJ]);

  const setDataPieChart = () => {
    const egat =
      dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.filter(
        (item) => item.utilityName === "EGAT"
      );
    const mea = dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.filter(
      (item) => item.utilityName === "MEA"
    );
    const pea = dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.filter(
      (item) => item.utilityName === "PEA"
    );
    const egatNum = egat?.length === 0 ? 0 : egat?.[0].totalUtility;
    const meaNum = mea?.length === 0 ? 0 : mea?.[0].totalUtility;
    const peaNum = pea?.length === 0 ? 0 : pea?.[0].totalUtility;
    let labelname = [];
    let datanum = [];
    for (
      let i = 0;
      i < dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.length;
      i++
    ) {
      labelname.push(
        dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.[i].utilityName
      );
      datanum.push(
        dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.[i]
          .totalUtility
      );
      /*if(i === 0){
        console.log("I",dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.[i].utilityName)
        setLabelPie(dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.[i].utilityName)
        setOnDataPie(dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.[i].totalUtility)
      }
      else{
        setLabelPie([...labelPie,dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.[i].utilityName])
        setOnDataPie([...dataOnPie,dashboardOBJ?.utilitySubscription?.utilitySubscriptions?.[i].totalUtility])
      }*/
    }
    console.log("Label Name", labelname);
    console.log("DATA", egat, meaNum, mea, pea);

    const dataObj = {
      labels: labelname,
      datasets: [
        {
          data: datanum,
          backgroundColor: [
            "#FFC72C",
            "#FD812E",
            "#B64BEB",
            /*
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',*/
          ],
          borderColor: ["#FFC72C", "#FD812E", "#B64BEB"],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
    setDataPie(dataObj);

    /*if(egat !== 0 && meaNum !== 0 && peaNum !== 0){
      const dataObj = {
        labels: ["EGAT", "MEA", "PEA"],
        datasets: [
          {
            data: [egatNum, meaNum, peaNum],
            backgroundColor: [
              "#FFC72C",
              "#FD812E",
              "#B64BEB",
            ],
            borderColor: ["#FFC72C", "#FD812E", "#B64BEB"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      }
      setDataPie(dataObj)
    }
    else if(egat !== 0 && meaNum === 0 && peaNum === 0){
      const dataObj = {
        labels: ["EGAT"],
        datasets: [
          {
            data: [egatNum],
            backgroundColor: [
              "#FFC72C",
              
              
            ],
            borderColor: ["#FFC72C",],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      }
      setDataPie(dataObj)
    }
    else if(egat === 0 && meaNum !== 0 && peaNum === 0){
      const dataObj = {
        labels: ["MEA"],
        datasets: [
          {
            data: [meaNum],
            backgroundColor: [
              
              "#FD812E",
              
             
            ],
            borderColor: ["#FD812E"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      }
      setDataPie(dataObj)
    }
    else if(egat === 0 && meaNum === 0 && peaNum !== 0){
      const dataObj = {
        labels: ["PEA"],
        datasets: [
          {
            data: [peaNum],
            backgroundColor: [
              
              "#B64BEB",
              
             
            ],
            borderColor: ["#B64BEB"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      }
      setDataPie(dataObj)
    }
    else if(egat !== 0 && meaNum !== 0 && peaNum === 0){
      const dataObj = {
        labels: ["EGAT","MEA"],
        datasets: [
          {
            data: [egatNum,meaNum],
            backgroundColor: [
              "#FFC72C",
              "#FD812E",
              
             
            ],
            borderColor: ["#FFC72C","#FD812E"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      }
      setDataPie(dataObj)
    }
    else if(egat !== 0 && meaNum === 0 && peaNum !== 0){
      const dataObj = {
        labels: ["EGAT","PEA"],
        datasets: [
          {
            data: [egatNum,peaNum],
            backgroundColor: [
              "#FFC72C",
              "#B64BEB",
              
             
            ],
            borderColor: ["#FFC72C","#B64BEB"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      }
      setDataPie(dataObj)
    }
    else if(egat === 0 && meaNum !== 0 && peaNum !== 0){
      const dataObj = {
        labels: ["MEA","PEA"],
        datasets: [
          {
            data: [meaNum,peaNum],
            backgroundColor: [
              "#FD812E",
              "#B64BEB",
              
              
            ],
            borderColor: ["#FD812E","#B64BEB"],
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      }
      setDataPie(dataObj)
    }*/
  };

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
            } rounded w-max px-3 py-1 mt-1 text-xs font-normal`}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={
                row?.subscriberTypeId == 1
                  ? "Subscriber"
                  : "Aggregate Subscriber"
              }
            />
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
      label: "Contracted Energy Amount (kWh)",
      align: "left",
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
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={row.portfolio}
            />
          </div>
          
          <div>
          <label
            className={`${"bg-[#FFDAE1] text-[#FE3C90]"} rounded w-max px-3 py-1 mt-1 text-xs font-bold`}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={/*row?.portfolioCode ||*/ "xxx"}
            />
            
            
          </label>
          <button>
              <MdOutlineContentCopy className="inline-block ml-2" onClick={()=>copyToClipboard("xxx"/*row?.portfolioCode == null?"xxx":row?.portfolioCode*/)}/>
            </button>
          </div>
        </div>
      ),
    },
    /*{
      id: "portfolioCode",
      label: "Portfolio Code",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.portfolioCode || ""}
          />
        </span>
      ),
    },*/
    {
      id: "subscriberStatusId",
      label: "Status",
      render: (row) => (
        // StatusLabel(row?.subscriberStatusId == 1 ? "Inactive" : "Active"),
        <StatusLabel
          status={
            row?.subscriberStatusId == 1
              ? "Inactive"
              : row?.subscriberStatusId == 2
              ? "Active"
              : row?.subscriberStatusId == 3
              ? "Withdrawn"
              : "Expired"
          }
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
          state={{ id: row.id, contract: 0 }}
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
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryUnAssigned]}
              autoEscape={true}
              textToHighlight={
                row?.subscriberTypeId == 1
                  ? "Subscriber"
                  : "Aggregate Subscriber"
              }
            />
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
      label: "Contracted Energy Amount (kWh)",
      align: "left",
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
              textToHighlight={row.portfolio}
            />
          </div>
          {row?.portfolioCode !== null && 
          <div>
            <label
              className={`${"bg-[#FFDAE1] text-[#FE3C90]"} rounded w-max px-3 py-1 mt-1 text-xs font-bold`}
            >
              <Highlighter
                highlightClassName="highlight"
                highlightTag={Highlight}
                searchWords={[searchQueryUnAssigned]}
                autoEscape={true}
                textToHighlight={row?.portfolioCode || ""}
              />
              
            </label>
            <button>
              <MdOutlineContentCopy className="inline-block ml-2" onClick={()=>copyToClipboard(row?.portfolioCode == null?"":row?.portfolioCode)}/>
            </button>
          </div>}
        </div>
      ),
    },
   /* {
      id: "portfolioCode",
      label: "Portfolio Code",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.portfolioCode || ""}
          />
        </span>
      ),
    },*/
    {
      id: "subscriberStatusId",
      label: "Status",
      render: (row) => (
        // StatusLabel(row?.subscriberStatusId == 1 ? "Inactive" : "Active"),
        <StatusLabel
          status={
            row?.subscriberStatusId == 1
              ? "Inactive"
              : row?.subscriberStatusId == 2
              ? "Active"
              : row?.subscriberStatusId == 3
              ? "Withdrawn"
              : "Expired"
          }
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
          state={{ id: row.id, contract: 0 }}
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

  const columnsAssignedNoMng = [
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
            } rounded w-max px-3 py-1 mt-1 text-xs font-normal`}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={
                row?.subscriberTypeId == 1
                  ? "Subscriber"
                  : "Aggregate Subscriber"
              }
            />
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
      label: "Contracted Energy Amount (kWh)",
      align: "left",
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
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={row.portfolio}
            />
          </div>
          
          <div>
          <label
            className={`${"bg-[#FFDAE1] text-[#FE3C90]"} rounded w-max px-3 py-1 mt-1 text-xs font-bold`}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryAssigned]}
              autoEscape={true}
              textToHighlight={/*row?.portfolioCode ||*/ "xxx"}
            />
            
            
          </label>
          <button>
              <MdOutlineContentCopy className="inline-block ml-2" onClick={()=>copyToClipboard("xxx"/*row?.portfolioCode == null?"xxx":row?.portfolioCode*/)}/>
            </button>
          </div>
        </div>
      ),
    },
    /*{
      id: "portfolioCode",
      label: "Portfolio Code",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.portfolioCode || ""}
          />
        </span>
      ),
    },*/
    {
      id: "subscriberStatusId",
      label: "Status",
      render: (row) => (
        // StatusLabel(row?.subscriberStatusId == 1 ? "Inactive" : "Active"),
        <StatusLabel
          status={
            row?.subscriberStatusId == 1
              ? "Inactive"
              : row?.subscriberStatusId == 2
              ? "Active"
              : row?.subscriberStatusId == 3
              ? "Withdrawn"
              : "Expired"
          }
          searchQuery={searchQueryAssigned}
        />
      ),
    },
    {
      id: "manage",
      label: "",
      render: (row) => (
        undefined
      ),
    },
    // Add more columns as needed
  ];

  const columnsUnAssignedNoMng = [
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
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryUnAssigned]}
              autoEscape={true}
              textToHighlight={
                row?.subscriberTypeId == 1
                  ? "Subscriber"
                  : "Aggregate Subscriber"
              }
            />
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
      label: "Contracted Energy Amount (kWh)",
      align: "left",
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
              textToHighlight={row.portfolio}
            />
          </div>
          {row?.portfolioCode !== null && 
          <div>
            <label
              className={`${"bg-[#FFDAE1] text-[#FE3C90]"} rounded w-max px-3 py-1 mt-1 text-xs font-bold`}
            >
              <Highlighter
                highlightClassName="highlight"
                highlightTag={Highlight}
                searchWords={[searchQueryUnAssigned]}
                autoEscape={true}
                textToHighlight={row?.portfolioCode || ""}
              />
              
            </label>
            <button>
              <MdOutlineContentCopy className="inline-block ml-2" onClick={()=>copyToClipboard(row?.portfolioCode == null?"":row?.portfolioCode)}/>
            </button>
          </div>}
        </div>
      ),
    },
   /* {
      id: "portfolioCode",
      label: "Portfolio Code",
      render: (row) => (
        <span>
          <Highlighter
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[searchQueryAssigned]}
            autoEscape={true}
            textToHighlight={row.portfolioCode || ""}
          />
        </span>
      ),
    },*/
    {
      id: "subscriberStatusId",
      label: "Status",
      render: (row) => (
        // StatusLabel(row?.subscriberStatusId == 1 ? "Inactive" : "Active"),
        <StatusLabel
          status={
            row?.subscriberStatusId == 1
              ? "Inactive"
              : row?.subscriberStatusId == 2
              ? "Active"
              : row?.subscriberStatusId == 3
              ? "Withdrawn"
              : "Expired"
          }
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
        undefined
      ),
    },
    // Add more columns as needed
  ];

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

  useEffect(() => {
    const { hash, pathname, search } = location;

    if (WEB_URL.SUBSCRIBER_LIST == pathname) {
      dispatch(setSelectedSubMenu(SUB_MENU_ID.SUBSCRIBER_LIST_INFO));
      setCookie("currentSubmenu", SUB_MENU_ID.SUBSCRIBER_LIST_INFO);
    }
  }, []);

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      console.log("Fetch DATA")
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG
      ) {
        let permissFindUntilyty = { utility: [UTILITY_GROUP_ID.EGAT] };
        const paramDashboard = {
          findUtilityId: permissFindUntilyty,
          UgtGroupId: currentUGTGroup?.id,
          findPortfolioId: isAssignedPortfolioId,
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
          findPortfolioId: isAssignedPortfolioId,
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
          findPortfolioId: isAssignedPortfolioId,
        };
        dispatch(SubscriberManagementdashboard(paramDashboard));
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.ALL_MODULE_VIEWER ||
        userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
        userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
        userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
      ) {
        let permissFindUntilyty = { utility: [UTILITY_GROUP_ID.ALL] };
        const paramDashboard = {
          findUtilityId: permissFindUntilyty,
          UgtGroupId: currentUGTGroup?.id,
          findPortfolioId: isAssignedPortfolioId,
        };
        dispatch(SubscriberManagementdashboard(paramDashboard));
      }
    }
    else{
      console.log("Not Fetch Data")
    }
  }, [currentUGTGroup, isAssignedPortfolioId]);

  // assign table
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      console.log("Fetch assign");
      fetchTableAssign();
    }
  }, [currentUGTGroup, isAssignedStatusId, userData, isAssignedPortfolioId]);

  // unAssign table
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      console.log("Fetch Unassign");
      fetchTableUnassign();
    }
  }, [currentUGTGroup, isUnassignedStatusId, userData, isAssignedPortfolioId]);

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
        console.log("Param Filter", paramSubscriberAssign);
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
        userData?.userGroup?.id === USER_GROUP_ID.ALL_MODULE_VIEWER ||
        userData?.userGroup?.id === USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
        userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
        userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
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
        userData?.userGroup?.id === USER_GROUP_ID.ALL_MODULE_VIEWER ||
        userData?.userGroup?.id === USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
        userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
        userData?.userGroup?.id === USER_GROUP_ID.UGT_REGISTANT_SIGNATORY
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
  };
  const handleChangeAssignUtility = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = { ...isAssignedUtilityId, utility: currentFilter };
    setIsAssignedUtilityId(newCurrentFilter);
  };
  const handleChangeAssignPortfolio = (data) => {
    console.log("Data input", data);
    const currentFilter = data === null ? null : data.id; /*data.map((item) => {
      return item.id;
    });*/
    console.log(currentFilter);
    const newCurrentFilter = {
      ...isAssignedPortfolioId,
      portfolio: [currentFilter],
    };
    const newNullFilter = {
      ...isAssignedPortfolioId,
      portfolio: null,
    };
    console.log("New Data", data === null ? newNullFilter : newCurrentFilter);
    setIsAssignedPortfolioId(data === null ? newNullFilter : newCurrentFilter);
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
  const handleChangeUnassignPortfolio = (data) => {
    const currentFilter = data.map((item) => {
      return item.id;
    });
    const newCurrentFilter = {
      ...isUnassignedPortfolioId,
      utility: currentFilter,
    };
    setIsUnassignedPortfolioId(newCurrentFilter);
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
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold text-xl text-black">
                  Subscriber Info
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / Subscriber Management / Subscriber
                  Info
                </p>
              </div>

              <div>
                <div className="w-96 px-2">
                  <Controller
                    name="assignPortfolio"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <MySelectSubscriber
                        {...field}
                        id={"assignPortfolio"}
                        typeSelect={1}
                        options={portfolioList}
                        valueProp={"id"}
                        displayProp={"portfolioName"}
                        disable={false}
                        placeholder={"All Portfolio"}
                        onChangeInput={(value) => {
                          handleChangeAssignPortfolio(value);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col lg:flex-row justify-start items-start gap-3">
              <div className="grid grid-flow-col grid-rows-2 gap-3 w-full">
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
                        className={`flex justify-center w-[75px] h-[75px] mb-2 bg-[#87BE3326]`}
                      >
                        <img
                          alt={"subscriber"}
                          src={User}
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
                    <div className="font-bold mt-2">Total Active Subscriber</div>
                    <div className="text-gray-500 text-xs">
                      Keep track of all your devices at a glance.
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
                        className={`flex justify-center w-[75px] h-[75px] mb-2 bg-[#3583CD26]`}
                      >
                        <img
                          alt={"ig"}
                          src={Clock}
                          width={50}
                          height={50}
                        ></img>
                      </div>
                      <div className="text-end">
                        <label className="text-2xl font-semibold flex justify-end">
                          {numeral(
                            dashboardOBJ?.totalContractedEnergy /** 0.001*/
                          ).format("0,0.00")}
                        </label>
                        <span> </span>
                        <label className="text-lg font-medium text-slate-500">
                          kWh
                        </label>
                      </div>
                    </div>
                    <div className="font-bold  mt-2">
                      Total Contracted Energy
                    </div>
                    <div className="text-gray-500 text-xs">
                      Monitor your entire contracted energy.
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
                        className={`flex justify-center w-[75px] h-[75px] bg-[#33BFBF26] mb-2 `}
                      >
                        <img
                          alt={"ig"}
                          src={Calendar}
                          width={50}
                          height={50}
                        ></img>
                      </div>
                      <div className="text-end">
                        <label className="text-2xl font-semibold flex justify-end">
                          {numeral(
                            dashboardOBJ?.annualContractedEnergy /** 0.001*/
                          ).format("0,0.00")}
                        </label>
                        <label className="text-lg font-medium text-slate-500">
                          kWh
                        </label>
                      </div>
                    </div>
                    <div className="w-60">
                      <div className="font-bold mt-2">
                        Annual Contracted Energy
                      </div>
                      <div className="text-gray-500 text-xs">
                        Monitor your contracted energy for the current year.
                      </div>
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
                        className={`flex justify-center w-[75px] h-[75px] bg-[#F9974126] mb-2 `}
                      >
                        <img
                          alt={"ig"}
                          src={Graph}
                          width={50}
                          height={50}
                        ></img>
                      </div>
                      <div className="text-end">
                        <label className="text-2xl font-semibold flex justify-end">
                          {numeral(
                            dashboardOBJ?.netDeliverables
                              ?.netDeliverables /* * 0.001*/
                          ).format("0,0.00")}
                        </label>
                        <label className="text-lg font-medium text-slate-500">
                          %
                        </label>
                      </div>
                    </div>

                    <div className="w-60">
                      <div className="font-bold mt-2">Net Deliverables</div>
                      <div className="text-gray-500 text-xs">
                        Track the proportion of Total Contracted Energy
                        delivered in real-time.
                      </div>
                    </div>
                    <div></div>

                    <div
                      className={`text-gray-500 text-right text-[0.6rem] font-light mt-3`}
                    >
                      Last Updated on
                    </div>
                    <div
                      className={`text-gray-500 text-right text-[0.8rem] font-medium`}
                    >
                      {dashboardOBJ?.netDeliverables?.lastUpdated}
                    </div>
                  </div>
                </Card>
              </div>

              <div className={`col-start-4 row-span-2 `}>
                <Card
                  shadow="md"
                  radius="lg"
                  className="flex w-full h-full"
                  padding="lg"
                >
                  <div className="w-full">
                    <div className="flex justify-between">
                      {/*
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
                      */}
                    </div>

                    <div className="font-bold mt-2 text-xl">
                      Utility Subscription
                    </div>
                    <div className="text-gray-500 text-sm font-medium">
                      Observe the overall subscription ratio of all utilities’
                      subscribers.
                    </div>
                    <div
                      style={{ width: "250px", height: "250px" }}
                      className="mt-4 ml-2"
                    >
                      <Pie data={dataPie} options={options} />
                    </div>
                    <div className="flex justify-between mt-4">
                      <div>
                        <div className="flex ml-1">
                          <div
                            className={`bg-[#FFC72C] w-[15px] h-[15px] mt-1`}
                          />
                          <label className="ml-1">EGAT</label>
                        </div>
                        <div className="flex ml-1">
                          <div
                            className={`bg-[#FD812E] w-[15px] h-[15px] mt-1`}
                          />
                          <label className="ml-1">MEA</label>
                        </div>
                        <div className="flex ml-1">
                          <div
                            className={`bg-[#B64BEB] w-[15px] h-[15px] mt-1`}
                          />
                          <label className="ml-1">PEA</label>
                        </div>
                      </div>

                      <div>
                        <div
                          className={`text-gray-500 text-right text-[0.6rem] font-light mt-[40px]`}
                        >
                          Last Updated on
                        </div>
                        <div
                          className={`text-gray-500 text-right text-[0.8rem] font-medium`}
                        >
                          {dashboardOBJ?.utilitySubscription?.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
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
                    Active Subscriber
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

                      {/*<div className="col-span-2 px-2">
                        <Controller
                          name="assignPortfolio"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"assignPortfolio"}
                              typeSelect={2}
                              options={portfolioList}
                              valueProp={"id"}
                              displayProp={"name"}
                              disable={false}
                              placeholder={"Find Portfolio"}
                              onChangeInput={(value) => {
                                handleChangeAssignPortfolio(value);
                              }}
                            />
                          )}
                        />
                      </div>*/}

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
                              options={statusListActive}
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
                    columns={userData?.userGroup?.id === USER_GROUP_ID.EGAT_DEVICE_MNG || userData?.userGroup?.id === USER_GROUP_ID.MEA_DEVICE_MNG || userData?.userGroup?.id === USER_GROUP_ID.PEA_DEVICE_MNG?columnsAssignedNoMng:columnsAssigned}
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
                    Inactive Subscriber
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

                      {/*<div className="col-span-2 px-2">
                        <Controller
                          name="unassignPortfolio"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Multiselect
                              {...field}
                              id={"unassignPortfolio"}
                              typeSelect={2}
                              options={portfolioList}
                              valueProp={"id"}
                              displayProp={"name"}
                              disable={false}
                              placeholder={"Find Portfolio"}
                              onChangeInput={(value) => {
                                handleChangeUnassignPortfolio(value);
                              }}
                            />
                          )}
                        />
                      </div>*/}

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
                              options={statusListInactive}
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
                    columns={userData?.userGroup?.id === USER_GROUP_ID.EGAT_DEVICE_MNG || userData?.userGroup?.id === USER_GROUP_ID.MEA_DEVICE_MNG || userData?.userGroup?.id === USER_GROUP_ID.PEA_DEVICE_MNG?columnsUnAssignedNoMng:columnsUnAssigned}
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

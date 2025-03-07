"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, Divider, Table, ScrollArea, Card } from "@mantine/core";
import { Form, Select } from "antd";
import {
  getSettlementMonthlySummaryFinal,
  getSettlementMonthlyGeneration,
  getSettlementMonthlyConsumtion,
  getInventorySupplyUsage,
  getRemainingEnergyttribute,
  getSettlementMonthlyDetailSubscriberFinal,
  getSettlementDeviceTableFinal,
  getSettlementSubscriberTableFinal,
} from "../../Redux/Settlement/Action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";
import * as WEB_URL from "../../Constants/WebURL";
import { USER_GROUP_ID } from "../../Constants/Constants";
import SettlementProgress from "../assets/SettlementProgress.svg";
import InfoWarning from "../assets/InfoWarning.svg";
import Tooltips from "@mui/material/Tooltip";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DataTableSettlement from "./DataTableSettlement";
import Highlighter from "react-highlight-words";
import CollapsDataTable from "./CollapsDataTable";
import { getSettlementMonthlyDetailFinal } from "../../Redux/Settlement/Action";
import DonutChart from "./DonutChart";
import noContent from "../assets/no-content.png";
ChartJS.register(ArcElement, Tooltip, Legend);

// Chart import
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Cell,
  Label,
  Tooltip as ChartTooltips,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  //Legend ,
} from "recharts";

// Icon import
import { LuTable } from "react-icons/lu";
import { MdBarChart } from "react-icons/md";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import { RxCaretDown } from "react-icons/rx";
import SettlementDetail from "./SettlementDetail";
import ModalInventorySupplyUsage from "./ModalInventorySupplyUsage";
import ModalRemainingEnergyAttribute from "./ModalRemainingEnergyAttribute";
import WaitApprove from "../assets/WaitApprove.png";
import { AiOutlineConsoleSql } from "react-icons/ai";

const COLORS = [
  "#FF8042",
  "#87BE33",
  "#4D6A00",
  "#EF4835",
  "#33BFBF",
  "#005AC2",
  "#AD16F7",
];

const SettlementInfoFinal = ({
  ugtGroupId,
  portfolioId,
  portfolioName,
  unit,
  convertUnit,
  showSeeDetailButton,
  showWaitApprove,
  settlementYear,
  settlementMonth,
  isShowDetail = true,
  utilityId = 0,
  selectTab = "final",
  isGenPDF = false,
  status,
  hideBtn,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.login.userobj);
  //console.log("Year",settlementYear)
  //console.log("Month",settlementMonth)
  let isShowSettlementProgress = false;
  let isShowGotiVerify = false;
  let isShowAwaitConfirm = false;
  let isShowGotoConfirm = false;
  let isShowMainDetail = false;

  if (status == "N" || status == "R" || status == "E") {
    if (
      /*userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||*/
      userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG
    ) {
      if (isShowDetail) {
        isShowGotiVerify = false;
        isShowSettlementProgress = false;
        isShowAwaitConfirm = false;
        isShowGotoConfirm = false;
        isShowMainDetail = true;
      } else {
        isShowGotiVerify = true;
        isShowSettlementProgress = false;
        isShowAwaitConfirm = false;
        isShowGotoConfirm = false;
        isShowMainDetail = true;
      }
    } else if(userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ){
        if (isShowDetail) {
          isShowGotiVerify = false;
          isShowSettlementProgress = false;
          isShowAwaitConfirm = false;
          isShowGotoConfirm = false;
          isShowMainDetail = true;
        } else {
          isShowGotiVerify = false;
          isShowSettlementProgress = true;
          isShowAwaitConfirm = false;
          isShowGotoConfirm = false;
          isShowMainDetail = false;
          hideBtn(true);
        }
    }else {
      isShowGotiVerify = false;
      isShowSettlementProgress = true;
      isShowAwaitConfirm = false;
      isShowGotoConfirm = false;
      isShowMainDetail = false;
      hideBtn(true);
    }
  } else if (status == "V") {
    if (
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG
    ) {
      if (isShowDetail) {
        isShowGotiVerify = false;
        isShowSettlementProgress = false;
        isShowAwaitConfirm = false;
        isShowGotoConfirm = false;
        isShowMainDetail = true;
      } else {
        isShowGotiVerify = false;
      isShowSettlementProgress = false;
      isShowAwaitConfirm = true;
      isShowGotoConfirm = false;
      isShowMainDetail = false;
      }
    } else if (
      userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
      userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
    ) {
      if (isShowDetail) {
        isShowGotiVerify = false;
        isShowSettlementProgress = false;
        isShowAwaitConfirm = false;
        isShowGotoConfirm = false;
        isShowMainDetail = true;
      } else {
        isShowGotiVerify = false;
        isShowSettlementProgress = false;
        isShowAwaitConfirm = false;
        isShowGotoConfirm = true;
        isShowMainDetail = true;
      }
    } else {
      isShowGotiVerify = false;
      isShowSettlementProgress = false;
      isShowAwaitConfirm = true;
      isShowGotoConfirm = false;
      isShowMainDetail = false;
      hideBtn(true);
    }
  } else if (status == "Y") {
    isShowGotiVerify = false;
    isShowSettlementProgress = false;
    isShowAwaitConfirm = false;
    isShowGotoConfirm = false;
    isShowMainDetail = true;
  }

  const settlementMonthlySummaryData = useSelector(
    (state) => state.settlement.settlementDetailFinal
  );
  const settlementMonthlyGenerationData = useSelector(
    (state) => state.settlement.settlementMonthlyGeneration
  );
  const settlementMonthlyConsumptionData = useSelector(
    (state) => state.settlement.settlementMonthlyConsumption
  );
  const inventorySupplyUsageData = useSelector(
    (state) => state.settlement.inventorySupplyUsage
  );

  const remainingEnergyAttributeData = useSelector(
    (state) => state.settlement.remainEnergyAttribute
  );

  const settlementDetailMonthlyDevice = useSelector(
    (state) => state.settlement.settlementDeviceTabFinal
  );

  const settlementDetailMonthlySubscriber = useSelector(
    (state) => state.settlement.settlememtSubscriberTabFinal
  );

  const settlementDeviceDataFinal = useSelector(
    (state) => state.settlement.settlementDeviceTableFinal
  );
  const settlementSubscriberDataFinal = useSelector(
    (state) => state.settlement.settlementSubscriberTableFinal
  );

  console.log(settlementDeviceDataFinal, settlementSubscriberDataFinal);

  const ref = useRef(null);

  const chartRef = useRef(null);
  const [isModuleViewerUser, setIsModuleViewerUser] = useState(false);
  const [matchedEnergyData, setMatchedEnergyData] = useState({});
  const [tmpMatchedEnergyData, setTmpMatchedEnergyData] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  // generation
  const [monthlyGenData, setMonthlyGenData] = useState([]);
  const [tmpMonthlyGenData, setTmpMonthlyGenData] = useState([]);
  const [generationViewMode, setGenerationViewMode] = useState("chart");
  const [generationSortBy, setGenerationSortBy] = useState("deviceName");
  const [generationSortDirection, setGenerationSortDirection] = useState("asc");
  // consumption
  const [monthlyConsumpData, setMonthlyConsumpData] = useState([]);
  const [tmpMonthlyConsumpData, setTmpMonthlyConsumpData] = useState([]);
  const [consumptionViewMode, setConsumptionViewMode] = useState("chart");
  const [consumptionSortBy, setConsumptionSortBy] = useState("subscriberName");
  const [consumptionSortDirection, setConsumptionSortDirection] =
    useState("asc");
  const [openModalSupplyUsage, setOpenModalSupplyUsage] = useState(false);
  const [
    openModalRemainingEnergyAttribute,
    setOpenModalRemainingEnergyAttribute,
  ] = useState(false);

  const [showSettlementTableDetail, setShowSettlementTableDetail] =
    useState(true);

  const [showSettlementProgress, SetsettlementProgress] = useState(true);
  const [searchSubscriber, SetSearchSubscriber] = useState();
  const [searchDevice, setSearchDevice] = useState();
  const [selectTabSettlementDetail, setSelectTabSettlementDetail] =
    useState("device");
  const [settlemtDetailDevice, setSettlementDetailDevice] = useState([]);
  const [settlementDetailSubscriber, setSettlementDetailSubscriber] = useState(
    []
  );
  const [isApprove, setIsApprove] = useState(false);
  const [isShowDetailMonthly, setIsShowDetailMonthly] = useState(true);

  console.log(settlemtDetailDevice, settlementDetailSubscriber);

  //console.log(settlemtDetailDevice)
  const [legendData, setlegendData] = useState([
    { label: "Actual Solar", value: 0, color: "#4D6A00" },
    { label: "Actual Wind", value: 0, color: "#87BE33" }, // ค่า 0 จะไม่ถูก plot
    { label: "Actual Hydro", value: 0, color: "#33BFBF" },
    { label: "UGT2 Inventory", value: 0, color: "#FA6B6E" }, // ค่า 0 จะไม่ถูก plot
    { label: "UGT1 Inventory", value: 0, color: "#61ABFF" },
    { label: "Unmatched Energy", value: 0, color: "#B0BAC9" },
  ]);

  const [data, setData] = useState({
    labels: [
      "Actual Solar",
      "Actual Wind",
      "Actual Hydro",
      "UGT2 Inventory",
      "UGT1 Inventory",
      "Unmatched Energy",
    ],
    datasets: [
      {
        data: [16, 25, 13, 16, 12, 18],
        backgroundColor: [
          "#4D6A00",
          "#87BE33",
          "#33BFBF",
          "#FA6B6E",
          "#70B2FF",
          "#B0BAC9",
        ],
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%", // ทำให้เป็น Donut Chart
    plugins: {
      legend: {
        position: "bottom",
        marginTop: "10px",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          generateLabels: (chart) => {
            return legendData.map((item, index) => ({
              text: item.label,
              fillStyle: item.color,
              hidden: chart.data.datasets[0].data[index],
            }));
          },
        },
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
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  /*const centerTextPlugin= {
    id: "centerText",
    beforeDraw: (chart) => {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
        width,
        height,
      } = chart;

      //console.log("Data chart",left,right,top,bottom)

      ctx.save();
      //const text = sumTotalPercent();
      const subtext = "of Total Load";

      // คำนวณตำแหน่งกลาง
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      // ข้อความหลัก
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      //ctx.fillText(text, centerX, centerY - 10);
      ctx.fillText(`${totalLoadPercentage}%`, centerX, centerY - 10);

      // ข้อความรอง
      ctx.font = "16px Arial";
      ctx.fillStyle = "#666";
      ctx.fillText(subtext, centerX, centerY + 15);

      ctx.restore();
    },
  };*/

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
      } = chart;
      ctx.save();

      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      // ใช้ค่า React State ล่าสุด
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${totalLoadPercentage}%`, centerX, centerY - 10);

      ctx.font = "16px Arial";
      ctx.fillStyle = "#666";
      ctx.fillText("of Total Load", centerX, centerY + 15);

      ctx.restore();
    },
  };

  const plugins = [
    {
      id: "centerText",
      beforeDraw: (chart) => {
        const {
          ctx,
          chartArea: { left, right, top, bottom },
        } = chart;

        ctx.save();
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        // ใช้ค่า React State ล่าสุด
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${totalLoadPercentage}%`, centerX, centerY - 10);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText("of Total Load", centerX, centerY + 15);

        ctx.restore();
      },
    },
  ];

  //console.log(centerTextPlugin)

  const [totalLoadPercentage, setTotalLoadPercentage] = useState(0);
  const [additionalData, setAdditionalData] = useState([]);

  const sumTotalPercent = () => {
    let actualSolar =
      settlementMonthlySummaryData.actualGenerationMatchedPercentage
        ? settlementMonthlySummaryData.actualGenerationMatchedPercentage
        : 0;
    //let actualWind = settlementMonthlySummaryData.actualWindPercentage?settlementMonthlySummaryData.actualWindPercentage:0
    //let actualHydro = settlementMonthlySummaryData.actualHydroPercentage?settlementMonthlySummaryData.actualHydroPercentage:0
    let UGT2Inventory =
      settlementMonthlySummaryData.ugt2InventoryMatchedPercentage
        ? settlementMonthlySummaryData.ugt2InventoryMatchedPercentage
        : 0;
    let UGT1Inventory =
      settlementMonthlySummaryData.ugt1InventoryMatchedPercentage
        ? settlementMonthlySummaryData.ugt1InventoryMatchedPercentage
        : 0;

    let total = actualSolar + UGT2Inventory + UGT1Inventory;

    return total;
  };

  const columnsDevice = [
    {
      id: "deviceName",
      label: "Device Name",
      align: "left",
      render: (row) => (
        <div className="w-36">
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchDevice]}
            autoEscape={true}
            textToHighlight={row.deviceName}
          />
        </div>
      ),
    },
    {
      id: "totalGeneration",
      label: `Total Generation (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={renderValues(row?.totalGeneration)}
        />
      ),
    },
    {
      id: "actualGeneration",
      label: `Actual Generation Matched (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={renderValues(row?.actualGeneration)}
        />
      ),
    },
    {
      id: "inventoryMatch",
      label: `Inventory Matched (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={renderValues(row?.inventoryMatched)}
        />
      ),
    },
    {
      id: "netGreenDeliverables",
      label: `Net Green Deliverables (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={renderValues(row?.netGreenDeliverables)}
        />
      ),
    },
    {
      id: "percentageActualGeneration",
      label: "% Actual Generation Matched",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={
            numeral(row?.percentageActualGeneration).format("0,0.000") + "%"
          }
        />
      ),
    },
  ];
  const columnsSubscriber = [
    {
      id: "subscriberName",
      label: "Subscriber Name",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={row.subscriberName}
        />
      ),
    },
    {
      id: "totalLoad",
      label: `Total Load (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={renderValues(row?.totalLoad)}
        />
      ),
    },
    {
      id: "actualLoadMatched",
      label: `Actual Load Matched (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={renderValues(row?.actualLoadMatched)}
        />
      ),
    },
    {
      id: "inventoryMatched",
      label: `Inventory Matched (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={renderValues(row?.inventoryMatched)}
        />
      ),
    },
    {
      id: "netGreenDeliverables",
      label: `Net Green Deliverables (${unit})`,
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={renderValues(row?.netGreenDeliverables)}
        />
      ),
    },
    {
      id: "percentageActualLoadMatched",
      label: "% Actual Load Matched",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={
            numeral(row?.percentageActualLoadMatched).format("0,0.000") + "%"
          }
        />
      ),
    },
    {
      id: "percentageNetGreenDeliverables",
      label: "% Net Green Deliverables",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={
            numeral(row?.percentageNetGreenDeliverables).format("0,0.000") + "%"
          }
        />
      ),
    },
  ];

  const sampleDataDevice = [
    {
      deviceName: "Power Plant A",
      totalGeneration: 100,
      actualGenerationMatch: 100,
      inventoryMatch: 30,
      netGreenDeliverables: 30,
      perActualGenerationMatch: 100,
    },
    {
      deviceName: "Power Plant B",
      totalGeneration: 800,
      actualGenerationMatch: 100,
      inventoryMatch: 0,
      netGreenDeliverables: 130,
      perActualGenerationMatch: 100,
    },
    {
      deviceName: "Power Plant C",
      totalGeneration: 100,
      actualGenerationMatch: 100,
      inventoryMatch: 30,
      netGreenDeliverables: 30,
      perActualGenerationMatch: 100,
    },
    {
      deviceName: "Power Plant D",
      totalGeneration: 100,
      actualGenerationMatch: 100,
      inventoryMatch: 30,
      netGreenDeliverables: 30,
      perActualGenerationMatch: 100,
    },
  ];

  const sampleDataSubscriber = [
    {
      subcriberName: "EGAT1",
      totalLoad: 100,
      actualLoadMatch: 100,
      inventorymatch: 30,
      netGreenDeliverables: 30,
      perActualLoadMatch: 100,
      perNetGreenDeliverables: 100,
    },
    {
      subcriberName: "EGAT2",
      totalLoad: 800,
      actualLoadMatch: 100,
      inventorymatch: 0,
      netGreenDeliverables: 130,
      perActualLoadMatch: 100,
      perNetGreenDeliverables: 100,
    },
    {
      subcriberName: "MEA",
      totalLoad: 100,
      actualLoadMatch: 100,
      inventorymatch: 0,
      netGreenDeliverables: 10,
      perActualLoadMatch: 100,
      perNetGreenDeliverables: 100,
    },
    {
      subcriberName: "PEA",
      totalLoad: 100,
      actualLoadMatch: 100,
      inventorymatch: 0,
      netGreenDeliverables: 10,
      perActualLoadMatch: 100,
      perNetGreenDeliverables: 100,
    },
  ];

  const sampleCollapsDevice = [
    {
      deviceName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      deviceName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      deviceName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      deviceName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      deviceName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      deviceName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
  ];

  const sampleCollapsSubscriber = [
    {
      subscriberName: "EGAT Subscriber",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      subscriberName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      subscriberName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      subscriberName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      subscriberName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
    {
      subscriberName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
      totalAmount: 300000,
      data: [
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15",
          settlementType: "Actual",
          matchedSupply: 100000,
        },
        {
          name: "Lorem Ipsum",
          utility: "Lorem Ipsum",
          periodOfProduct: "2024/01/01 - 2024/01/15 ",
          settlementType: "Inventory",
          matchedSupply: 100000,
        },
      ],
    },
  ];

  useEffect(() => {
    const autoScroll = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Use smooth scrolling behavior if supported
      });
    };
    autoScroll();
  }, []);

  useEffect(() => {
    if (ugtGroupId !== undefined) {
      if (
        userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
      ) {
        setIsModuleViewerUser(true);
      }
    }
  }, [ugtGroupId, userData]);

  useEffect(() => {
    if (settlementMonth && settlementYear) {
      console.log(utilityId);
      dispatch(
        getSettlementMonthlySummaryFinal(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          utilityId
        )
      );
      dispatch(
        getSettlementMonthlyGeneration(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          generationSortBy,
          generationSortDirection
        )
      );
      dispatch(
        getSettlementDeviceTableFinal(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          generationSortBy,
          generationSortDirection
        )
      );
      dispatch(
        getSettlementSubscriberTableFinal(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          generationSortBy,
          generationSortDirection
        )
      );
      dispatch(
        getSettlementMonthlyConsumtion(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          consumptionSortBy,
          consumptionSortDirection
        )
      );
      dispatch(
        getInventorySupplyUsage(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
      dispatch(
        getRemainingEnergyttribute(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
      dispatch(
        getSettlementMonthlyDetailFinal(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
      dispatch(
        getSettlementMonthlyDetailSubscriberFinal(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
    }
  }, [settlementMonth, settlementYear, utilityId]);

  useEffect(() => {
    //console.log(settlementDetailMonthlyDevice)
    if (settlementDetailMonthlyDevice) {
      setSettlementDetailDevice(settlementDetailMonthlyDevice?.deviceList);
    }
  }, [settlementDetailMonthlyDevice]);

  useEffect(() => {
    if (settlementDetailMonthlySubscriber) {
      setSettlementDetailSubscriber(
        settlementDetailMonthlySubscriber?.subscriberList
      );
    }
  }, [settlementDetailMonthlySubscriber]);
  console.log(settlementDetailMonthlySubscriber);

  // match summary
  useEffect(() => {
    if (settlementMonthlySummaryData) {
      // console.log("settlementMonthlySummaryData", settlementMonthlySummaryData);
      setMatchedEnergyData(settlementMonthlySummaryData?.matchedEnergyData);
      setTmpMatchedEnergyData(
        convertMatchedEnergyData(
          settlementMonthlySummaryData?.matchedEnergyData
        )
      );
      setData(convertToDonut());
      //console.log(sumTotalPercent())
      setTotalLoadPercentage(sumTotalPercent());
      if (chartRef.current) {
        chartRef.current.update(); // Update chart instance
      }
      //console.log("Status",settlementMonthlySummaryData?.approveStatus)
      if (settlementMonthlySummaryData?.approveStatus == false) {
        SetsettlementProgress(true);
        setIsApprove(false);
      } else {
        SetsettlementProgress(false);
        setIsApprove(true);
      }

      if (isModuleViewerUser == false) {
        if (settlementMonthlySummaryData?.approveStatus == true) {
          setIsShowDetailMonthly(true);
        } else {
          if (showWaitApprove == true) {
            setIsShowDetailMonthly(false);
          } else {
            setIsShowDetailMonthly(true);
          }
        }
      } else if (isModuleViewerUser == true) {
        setIsShowDetailMonthly(true);
      }
    }
    
    if (
      settlementMonthlySummaryData &&
      Object.keys(settlementMonthlySummaryData).length !== 0
    ) {
      hideBtn(false);
    } else {
      hideBtn(true);
    }
  }, [settlementMonthlySummaryData]);

  const sethideButton=()=>{
    if (
      settlementMonthlySummaryData &&
      Object.keys(settlementMonthlySummaryData).length !== 0
    ) {
      hideBtn(false);
    } else if(isShowAwaitConfirm == true || 
      isShowAwaitConfirm == true
    ){
      hideBtn(true);
    }
    else {
      hideBtn(true);
    }
  }

  const getNewCenter = () => {
    let text = {
      id: "centerText",
      beforeDraw: (chart) => {
        const {
          ctx,
          chartArea: { left, right, top, bottom },
          width,
          height,
        } = chart;

        //console.log("Data chart",left,right,top,bottom)

        ctx.save();
        const text = sumTotalPercent();
        const subtext = "of Total Load";

        // คำนวณตำแหน่งกลาง
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        // ข้อความหลัก
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, centerX, centerY - 10);

        // ข้อความรอง
        ctx.font = "16px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText(subtext, centerX, centerY + 15);

        ctx.restore();
      },
    };

    return text;
  };

  const convertToDonut = () => {
    console.log(settlementMonthlySummaryData);
    let actualSolar = settlementMonthlySummaryData.actualSolarPercentage
      ? settlementMonthlySummaryData.actualSolarPercentage
      : 0;
    let actualWind = settlementMonthlySummaryData.actualWindPercentage
      ? settlementMonthlySummaryData.actualWindPercentage
      : 0;
    let actualHydro = settlementMonthlySummaryData.actualHydroPercentage
      ? settlementMonthlySummaryData.actualHydroPercentage
      : 0;
    let UGT2Inventory =
      settlementMonthlySummaryData.ugt2InventoryMatchedPercentage
        ? settlementMonthlySummaryData.ugt2InventoryMatchedPercentage
        : 0;
    let UGT1Inventory =
      settlementMonthlySummaryData.ugt1InventoryMatchedPercentage
        ? settlementMonthlySummaryData.ugt1InventoryMatchedPercentage
        : 0;
    let unmatched = settlementMonthlySummaryData.unmatchedEnergyPercentage
      ? settlementMonthlySummaryData.unmatchedEnergyPercentage
      : 0;

    let actualSolarData = settlementMonthlySummaryData.actualSolar
      ? settlementMonthlySummaryData.actualSolar
      : 0;
    let actualWindData = settlementMonthlySummaryData.actualWind
      ? settlementMonthlySummaryData.actualWind
      : 0;
    let actualHydroData = settlementMonthlySummaryData.actualHydro
      ? settlementMonthlySummaryData.actualHydro
      : 0;
    let UGT2InventoryData = settlementMonthlySummaryData.ugt2InventoryMatched
      ? settlementMonthlySummaryData.ugt2InventoryMatched
      : 0;
    let UGT1InventoryData = settlementMonthlySummaryData.ugt1InventoryMatched
      ? settlementMonthlySummaryData.ugt1InventoryMatched
      : 0;
    let unmatchedData = settlementMonthlySummaryData.unmatchedEnergy
      ? settlementMonthlySummaryData.unmatchedEnergy
      : 0;
    //console.log(actualSolar,actualWind,actualHydro,UGT2Inventory,UGT1Inventory,unmatched)
    let label = [];
    let datalabel = [];
    let colorLabel = [];
    let additionalData = [];

    if (actualSolar !== 0) {
      label.push("Actual Solar");
      datalabel.push(actualSolar);
      colorLabel.push("#4D6A00");
      additionalData.push({ label: "Actual Solar", value: actualSolarData });
    }
    if (actualWind !== 0) {
      label.push("Actual Wind");
      datalabel.push(actualWind);
      colorLabel.push("#87BE33");
      additionalData.push({ label: "Actual Wind", value: actualWindData });
    }
    if (actualHydro !== 0) {
      label.push("Actual Hydro");
      datalabel.push(actualHydro);
      colorLabel.push("#33BFBF");
      additionalData.push({ label: "Actual Hydro", value: actualHydroData });
    }
    if (UGT2Inventory !== 0) {
      label.push("UGT2 Inventory");
      datalabel.push(UGT2Inventory);
      colorLabel.push("#FA6B6E");
      additionalData.push({
        label: "UGT2 Inventory",
        value: UGT2InventoryData,
      });
    }
    if (UGT1Inventory !== 0) {
      label.push("UGT1 Inventory");
      datalabel.push(UGT1Inventory);
      colorLabel.push("#70B2FF");
      additionalData.push({
        label: "UGT1 Inventory",
        value: UGT1InventoryData,
      });
    }
    if (unmatched !== 0) {
      label.push("Unmatched Energy");
      datalabel.push(unmatched);
      colorLabel.push("#B0BAC9");
      additionalData.push({ label: "Unmatched Energy", value: unmatchedData });
    }
    setAdditionalData(additionalData);
    console.log("addition", additionalData);
    let dataChart = {
      labels: label,
      datasets: [
        {
          data: datalabel,
          backgroundColor: colorLabel,
          borderWidth: 1,
        },
      ],
    };
    return dataChart;
  };
  const additionalDataPie = () => {
    console.log(settlementMonthlySummaryData);
    let actualSolar = settlementMonthlySummaryData.actualSolarPercentage
      ? settlementMonthlySummaryData.actualSolarPercentage
      : 0;
    let actualWind = settlementMonthlySummaryData.actualWindPercentage
      ? settlementMonthlySummaryData.actualWindPercentage
      : 0;
    let actualHydro = settlementMonthlySummaryData.actualHydroPercentage
      ? settlementMonthlySummaryData.actualHydroPercentage
      : 0;
    let UGT2Inventory =
      settlementMonthlySummaryData.ugt2InventoryMatchedPercentage
        ? settlementMonthlySummaryData.ugt2InventoryMatchedPercentage
        : 0;
    let UGT1Inventory =
      settlementMonthlySummaryData.ugt1InventoryMatchedPercentage
        ? settlementMonthlySummaryData.ugt1InventoryMatchedPercentage
        : 0;
    let unmatched = settlementMonthlySummaryData.unmatchedEnergyPercentage
      ? settlementMonthlySummaryData.unmatchedEnergyPercentage
      : 0;

    let actualSolarData = settlementMonthlySummaryData.actualSolar
      ? settlementMonthlySummaryData.actualSolar
      : 0;
    let actualWindData = settlementMonthlySummaryData.actualWind
      ? settlementMonthlySummaryData.actualWind
      : 0;
    let actualHydroData = settlementMonthlySummaryData.actualHydro
      ? settlementMonthlySummaryData.actualHydro
      : 0;
    let UGT2InventoryData = settlementMonthlySummaryData.ugt2InventoryMatched
      ? settlementMonthlySummaryData.ugt2InventoryMatched
      : 0;
    let UGT1InventoryData = settlementMonthlySummaryData.ugt1InventoryMatched
      ? settlementMonthlySummaryData.ugt1InventoryMatched
      : 0;
    let unmatchedData = settlementMonthlySummaryData.unmatchedEnergy
      ? settlementMonthlySummaryData.unmatchedEnergy
      : 0;
    //console.log(actualSolar,actualWind,actualHydro,UGT2Inventory,UGT1Inventory,unmatched)
    let label = [];
    let datalabel = [];
    let colorLabel = [];
    let additionalData = [];

    if (actualSolar !== 0) {
      label.push("Actual Solar");
      datalabel.push(actualSolar);
      colorLabel.push("#4D6A00");
      additionalData.push({ label: "Actual Solar", value: actualSolarData });
    }
    if (actualWind !== 0) {
      label.push("Actual Wind");
      datalabel.push(actualWind);
      colorLabel.push("#87BE33");
      additionalData.push({ label: "Actual Wind", value: actualWindData });
    }
    if (actualHydro !== 0) {
      label.push("Actual Hydro");
      datalabel.push(actualHydro);
      colorLabel.push("#33BFBF");
      additionalData.push({ label: "Actual Hydro", value: actualHydroData });
    }
    if (UGT2Inventory !== 0) {
      label.push("UGT2 Inventory");
      datalabel.push(UGT2Inventory);
      colorLabel.push("#FA6B6E");
      additionalData.push({
        label: "UGT2 Inventory",
        value: UGT2InventoryData,
      });
    }
    if (UGT1Inventory !== 0) {
      label.push("UGT1 Inventory");
      datalabel.push(UGT1Inventory);
      colorLabel.push("#70B2FF");
      additionalData.push({
        label: "UGT1 Inventory",
        value: UGT1InventoryData,
      });
    }
    if (unmatched !== 0) {
      label.push("Unmatched Energy");
      datalabel.push(unmatched);
      colorLabel.push("#B0BAC9");
      additionalData.push({ label: "Unmatched Energy", value: unmatchedData });
    }
    setAdditionalData(additionalData);
    console.log("addition", additionalData);
    let dataChart = {
      labels: label,
      datasets: [
        {
          data: datalabel,
          backgroundColor: colorLabel,
          borderWidth: 1,
        },
      ],
    };
    return dataChart;
  };

  // generation
  useEffect(() => {
    if (settlementMonthlyGenerationData?.actualGenerationItems) {
      setMonthlyGenData(settlementMonthlyGenerationData?.actualGenerationItems);
      setTmpMonthlyGenData(
        convertMonthlyGenData(
          settlementMonthlyGenerationData?.actualGenerationItems
        )
      );
    }
  }, [settlementMonthlyGenerationData]);

  // consumption
  useEffect(() => {
    if (settlementMonthlyConsumptionData?.actualConsumptionItems) {
      setMonthlyConsumpData(
        settlementMonthlyConsumptionData?.actualConsumptionItems
      );
      setTmpMonthlyConsumpData(
        convertMonthlyConsumpData(
          settlementMonthlyConsumptionData?.actualConsumptionItems
        )
      );
    }
  }, [settlementMonthlyConsumptionData]);

  useEffect(() => {
    setTmpMatchedEnergyData(convertMatchedEnergyData(matchedEnergyData));
    setTmpMonthlyGenData(convertMonthlyGenData(monthlyGenData));
    setTmpMonthlyConsumpData(convertMonthlyConsumpData(monthlyConsumpData));
  }, [unit, settlementMonth]);

  useEffect(() => {}, [isModuleViewerUser, settlementMonth, settlementYear]);

  const convertMatchedEnergyData = (matchedEnergyData) => {
    const new_match = matchedEnergyData?.data?.map((item) => {
      const new_item = {
        deviceName: item.deviceName,
        utilityContract: item.utilityContract,
        matchedSupply: item.matchedSupply * convertUnit,
        supplyWeightedAverage: item.supplyWeightedAverage,
      };
      return new_item;
    });

    const tmpMatchedEnergyData = {
      netDeliverables: matchedEnergyData?.netDeliverables * convertUnit,
      data: new_match,
    };

    return tmpMatchedEnergyData;
  };

  const convertMonthlyGenData = (monthlyGenData) => {
    const new_gen = monthlyGenData?.map((item) => {
      const new_item = {
        ...item,
        actualGeneration: item.actualGeneration * convertUnit,
        matched: item.matched * convertUnit,
      };
      return new_item;
    });
    return new_gen;
  };

  const convertMonthlyConsumpData = (monthlyConsumpData) => {
    const new_consump = monthlyConsumpData?.map((item) => {
      const new_item = {
        ...item,
        actualConsumption: item.actualConsumption * convertUnit,
        allocatedEnergy: item.allocatedEnergy * convertUnit,
        matched: item.matched * convertUnit,
      };
      return new_item;
    });
    return new_consump;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${convertDecimalPlace(value)}`} {unit}
        </text>
        {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                  {`(Rate ${(percent * 100).toFixed(2)}%)`}
              </text> */}
      </g>
    );
  };

  const TotalPieLabel = ({ viewBox, value }) => {
    const { cx, cy } = viewBox;
    return (
      <>
        <text x={cx} y={cy - 25} fill="rgba(0, 0, 0, 0.87)" textAnchor="middle">
          <tspan alignmentBaseline="middle" fontSize="14px">
            Net Deliverables
          </tspan>
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle">
          <tspan alignmentBaseline="middle" fontSize="22px" fontWeight="bold">
            {convertDecimalPlace(value)}
          </tspan>
        </text>
        <text x={cx} y={cy + 50} fill="rgba(0, 0, 0, 0.54)" textAnchor="middle">
          <tspan alignmentBaseline="middle" fontSize="16px">
            {unit}
          </tspan>
        </text>
      </>
    );
  };

  const TotalCustomTooltip = ({ payload }) => {
    const _deviceName = payload?.[0]?.payload?.deviceName;
    const _utilityContract = payload?.[0]?.payload?.utilityContract;
    const _matchedSupply =
      payload?.[0]?.payload?.matchedSupply > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.matchedSupply)
        : "-";
    const _supplyWeightedAverage = payload?.[0]?.payload?.supplyWeightedAverage;

    return (
      <div className="bg-[#F5F4E9] rounded-lg p-4">
        <div className="pb-2">
          <div className="text-sm font-bold">{_deviceName}</div>
        </div>
        <Divider orientation="horizontal" size={"xs"} />
        <div className="pt-2">
          <div className="text-xs">{`Utility: ${_utilityContract}`}</div>
          <div className="text-xs">{`Matched Supply: ${
            _matchedSupply + " " + unit
          }`}</div>
          <div className="text-xs">{`Supply Weighted Average: ${
            _supplyWeightedAverage ? _supplyWeightedAverage : "-"
          }`}</div>
        </div>
      </div>
    );
  };

  const GenerationCustomTooltip = ({ payload }) => {
    console.log(payload);
    const _deviceName = payload?.[0]?.payload?.deviceName;
    const _utilityContract = payload?.[0]?.payload?.utilityContract;
    const _actualGeneration =
      payload?.[0]?.payload?.actualGeneration > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.actualGeneration)
        : "-";
    const _generationRatio = payload?.[0]?.payload?.generationRatio;
    const _matched =
      payload?.[0]?.payload?.matched > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.matched)
        : "-";

    return (
      <div className="bg-[#F5F4E9] rounded-lg p-4">
        <div className="pb-2">
          <div className="text-sm font-bold">{_deviceName}</div>
        </div>
        <Divider orientation="horizontal" size={"xs"} />
        <div className="pt-2">
          <div className="text-xs">{`Utility: ${_utilityContract}`}</div>
          <div className="text-xs">{`Actual Generation: ${
            _actualGeneration + " " + unit
          }`}</div>
          <div className="text-xs">{`Matched Actual Generation: ${
            _matched + " " + unit
          }`}</div>
          <div className="text-xs">{`Generation Ratio: ${
            _generationRatio ? _generationRatio : "-"
          }`}</div>
        </div>
      </div>
    );
  };

  const ConsumptionCustomTooltip = ({ payload }) => {
    const _subscriberName = payload?.[0]?.payload?.subscriberName;
    const _utilityContract = payload?.[0]?.payload?.utilityContract;
    const _actualConsumption =
      payload?.[0]?.payload?.actualConsumption > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.actualConsumption)
        : "-";
    const _allocatedEnergy =
      payload?.[0]?.payload?.allocatedEnergy > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.allocatedEnergy)
        : "-";
    const _consumptionRatio = payload?.[0]?.payload?.consumptionRatio;
    const _matched =
      payload?.[0]?.payload?.matched > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.matched)
        : "-";

    return (
      <div className="bg-[#F5F4E9] rounded-lg p-4">
        <div className="pb-2">
          <div className="text-sm font-bold">{_subscriberName}</div>
        </div>
        <Divider orientation="horizontal" size={"xs"} />
        <div className="pt-2">
          <div className="text-xs">{`Utility: ${_utilityContract}`}</div>
          <div className="text-xs">{`Net Actual Load: ${
            _actualConsumption + " " + unit
          }`}</div>
          <div className="text-xs">{`Matched Load: ${
            _matched + " " + unit
          }`}</div>
          <div className="text-xs">{`Allocated Energy: ${
            _allocatedEnergy + " " + unit
          }`}</div>
          <div className="text-xs">{`Load Ratio: ${
            _consumptionRatio ? _consumptionRatio : "-"
          }`}</div>
        </div>
      </div>
    );
  };

  const handleClickInventorySupplyUsage = () => {
    // show modal
    if (inventorySupplyUsageData) {
      setOpenModalSupplyUsage(true);
    }
  };

  const handleClickRemainingEnergyAttribute = () => {
    // show modal
    if (remainingEnergyAttributeData) {
      setOpenModalRemainingEnergyAttribute(true);
    }
  };

  const handleChangeGenerationSort = (sortBy, sortDi) => {
    setGenerationSortBy(sortBy);
    setGenerationSortDirection(sortDi);
    // call api
    dispatch(
      getSettlementMonthlyGeneration(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        sortBy,
        sortDi
      )
    );
  };

  const handleChangeConsumptionSort = (sortBy, sortDi) => {
    setConsumptionSortBy(sortBy);
    setConsumptionSortDirection(sortDi);
    // call api
    dispatch(
      getSettlementMonthlyConsumtion(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        sortBy,
        sortDi
      )
    );
  };

  const convertDecimalPlace = (value) => {
    let decFixed = 2;
    if (unit == "kWh") {
      decFixed = 2;
    } else if (unit == "MWh") {
      decFixed = 6;
    } else if (unit == "GWh") {
      decFixed = 6;
    }

    if (value) {
      if (decFixed == 2) {
        return numeral(value).format("0,0.000");
      }
      if (decFixed == 6) {
        return numeral(value).format("0,0.000000");
      }
    } else {
      return "-";
    }
  };

  const handleChangeTab = (tab) => {
    setSelectTabSettlementDetail(tab);
  };

  const convertData = (value) => {
    let decFixed = 3;
    if (unit == "kWh") {
      decFixed = 3;
    } else if (unit == "MWh") {
      decFixed = 6;
    } else if (unit == "GWh") {
      decFixed = 6;
    }

    if (value) {
      if (decFixed == 3) {
        return numeral(value).format("0,0.000");
      }
      if (decFixed == 6) {
        return numeral(value).format("0,0.000000");
      }
    } else {
      if (decFixed == 3) {
        return numeral(0).format("0,0.000");
      }
      if (decFixed == 6) {
        return numeral(0).format("0,0.000000");
      }
    }
  };

  const renderValue = (value) => {
    if (value) {
      return convertData(value * convertUnit);
    } else {
      return convertData(0 * convertUnit);
    }
  };

  const renderValues = (value) => {
    console.log(value);
    console.log();
    if (value) {
      return convertData(value * convertUnit);
    } else {
      return convertData(0 * convertUnit);
    }
  };

  const hideData = false;
  console.log(settlemtDetailDevice);
  //console.log(settlementDetailMonthlyDevice.settlementPeriod )
  console.log(settlementMonthlySummaryData);
  return (
    <>
      {
        /*!settlementMonthlySummaryData?.approveStatus && isModuleViewerUser && showWaitApprove*/ hideData && (
          <div className="flex justify-center z-1">
            <Card
              radius="lg"
              className="absolute items-center shadow-2xl"
              style={{
                width: "50%",
                marginTop: "20%",
              }}
            >
              <div className="grid gap-5 py-20">
                <div className="text-xl font-semibold">
                  Awaiting for Confirmation
                </div>

                {isModuleViewerUser && (
                  <Button
                    className="bg-[#87BE33] text-white px-8 h-10 hover:bg-[#4D6A00]"
                    onClick={() =>
                      navigate(WEB_URL.SETTLEMENT_APPROVAL, {
                        state: {
                          ugtGroupId: ugtGroupId,
                          portfolioId: portfolioId,
                          portfolioName: portfolioName,
                          prevSelectedYear: settlementYear,
                          prevSelectedMonth: settlementMonth,
                        },
                      })
                    }
                  >
                    <span className="pl-2 text-lg font-bold">
                      Go to Confirm
                    </span>
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )
      }

      {settlementMonthlySummaryData &&
      Object.keys(settlementMonthlySummaryData).length !== 0
        ? isShowGotiVerify && (
            <div className="flex justify-center z-1">
              <Card
                radius="lg"
                className="absolute items-center shadow-2xl"
                style={{
                  width: "50%",
                  marginTop: "20%",
                }}
              >
                <div className="grid gap-5 py-20">
                  <div className="text-xl font-semibold">
                    Awaiting for Verification
                  </div>

                  {userData?.userGroup?.id ==
                    USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
                  userData?.userGroup?.id ==
                    USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
                  userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ? (
                    <Button
                      className="bg-[#87BE33] text-white px-8 h-10 hover:bg-[#4D6A00]"
                      onClick={() =>
                        navigate(WEB_URL.SETTLEMENT_APPROVAL, {
                          state: {
                            ugtGroupId: ugtGroupId,
                            portfolioId: portfolioId,
                            portfolioName: portfolioName,
                            prevSelectedYear: settlementYear,
                            prevSelectedMonth: settlementMonth,
                          },
                        })
                      }
                    >
                      <span className="pl-2 text-lg font-bold">
                        Go to Verify
                      </span>
                    </Button>
                  ) : undefined}
                </div>
              </Card>
            </div>
          )
        : undefined}

      {settlementMonthlySummaryData &&
      Object.keys(settlementMonthlySummaryData).length !== 0
        ? isShowGotoConfirm && (
            <div className="flex justify-center z-1">
              <Card
                radius="lg"
                className="absolute items-center shadow-2xl"
                style={{
                  width: "50%",
                  marginTop: "20%",
                }}
              >
                <div className="grid gap-5 py-20">
                  <div className="text-xl font-semibold">
                    Awaiting for Confirmation
                  </div>

                  {isModuleViewerUser && (
                    <Button
                      className="bg-[#87BE33] text-white px-8 h-10 hover:bg-[#4D6A00]"
                      onClick={() =>
                        navigate(WEB_URL.SETTLEMENT_APPROVAL, {
                          state: {
                            ugtGroupId: ugtGroupId,
                            portfolioId: portfolioId,
                            portfolioName: portfolioName,
                            prevSelectedYear: settlementYear,
                            prevSelectedMonth: settlementMonth,
                          },
                        })
                      }
                    >
                      <span className="pl-2 text-lg font-bold">
                        Go to Confirm
                      </span>
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )
        : undefined}

      {settlementMonthlySummaryData &&
      Object.keys(settlementMonthlySummaryData).length !== 0 ? (
        isShowMainDetail && (
          <div
            className={`
        ${isShowGotiVerify || isShowGotoConfirm ? "opacity-10" : ""} `}
          >
            {/*Card Dashboard */}
            <div>
              <div className="grid grid-cols-4 container mx-auto px-0 gap-2 mt-3 text-left">
                <div className="bg-[#EF483526] px-4 py-3 rounded-[5px]">
                  final
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Total Contracted Load
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.totalContractedLoad
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
                <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Total Generation
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(settlementMonthlySummaryData?.totalGeneration)}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
                <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Beginning UGT2 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.beginningUgt2Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
                <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Beginning UGT1 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.beginningUgt1Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 container mx-auto px-0 gap-2 mt-3 text-left">
                <div className="bg-[#EF483526] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Total Load
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(settlementMonthlySummaryData?.totalLoad)}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>

                <div className="col-span-3 container mx-auto px-0 gap-2 text-left">
                  <div className=" grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="text-sm text-[#5B5C5C] break-words">
                              Actual Generation Matched
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.actualGenerationMatched
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.actualGenerationMatchedPercentage
                                ? settlementMonthlySummaryData?.actualGenerationMatchedPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#87BE3326] mt-2 px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="text-sm text-[#5B5C5C] break-words">
                              UGT2 Inventory Matched
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.ugt2InventoryMatched
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.ugt2InventoryMatchedPercentage
                                ? settlementMonthlySummaryData?.ugt2InventoryMatchedPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#87BE3326] mt-2 px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="text-sm text-[#5B5C5C] break-words">
                              UGT1 Inventory Matched
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.ugt1InventoryMatched
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.ugt1InventoryMatchedPercentage
                                ? settlementMonthlySummaryData?.ugt1InventoryMatchedPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#E9E9E9] mt-2 px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="grid grid-col-2">
                              <label className="col-start-1 text-sm text-[#5B5C5C] break-words">
                                Unmatched Energy
                              </label>{" "}
                              <div className="col-start-2 ml-1 inline-block content-center">
                                <Tooltips
                                  title="Load Energy that can not be delivered bundle with REC"
                                  placement="top"
                                  arrow
                                >
                                  <img
                                    src={InfoWarning}
                                    alt="Info"
                                    width={15}
                                    height={15}
                                  />
                                </Tooltips>
                              </div>
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.unmatchedEnergy
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.unmatchedEnergyPercentage
                                ? settlementMonthlySummaryData?.unmatchedEnergyPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*Donut Chart */}
                    <div className="col-start-3 col-span-2 px-4 py-4 rounded-[5px] border-2 border-solid border-[#CDCDCD]">
                      <div className="grid grid-cols-[200px_50px]">
                        <label className="col-start-1 text-lg font-bold text-[#5B5C5C] break-words">
                          Net Green Deliverables
                        </label>{" "}
                        <div className="col-start-2 ml-1 inline-block content-center">
                          <Tooltips
                            title="Load Energy that can be delivered bundle with REC (exclude Unmatched Energy)"
                            placement="top"
                            arrow
                          >
                            <img
                              src={InfoWarning}
                              alt="Info"
                              width={15}
                              height={15}
                            />
                          </Tooltips>
                        </div>
                      </div>
                      <div className="text-2xl font-bold break-words">
                        {renderValue(
                          settlementMonthlySummaryData?.netGreenDeliverables
                        )}
                      </div>
                      <div className="text-base text-[#5B5C5C] break-words">
                        {unit}
                      </div>
                      <div>
                        <div
                          style={{
                            width: "100%",
                            height: "275px",
                            margin: "auto",
                          }}
                        >
                          <DonutChart
                            data={data}
                            totalPercent={totalLoadPercentage}
                            unit={unit}
                            convertUnit={convertUnit}
                            additional={additionalData}
                            //options={options}
                            //plugins={[centerTextPlugin]}
                            //ref={(chartInstance) => (chartRef.current = chartInstance?.chartInstance)} // เชื่อมต่อ ref
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 container mx-auto px-0 gap-2 mt-3 text-left">
                <div className="bg-[#FFF2C9] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Remaining Actual Generation
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.remainingActualGeneration
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>

                <div className="bg-[#FFF2C9] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Ending UGT2 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.endingUgt2Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>

                <div className="bg-[#FFF2C9] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Ending UGT1 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.endingUgt1Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
              </div>

              {tmpMatchedEnergyData ? (
                <div className="col-span-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={850} height={900}>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={tmpMatchedEnergyData.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={95}
                        outerRadius={120}
                        dataKey="matchedSupply"
                        onMouseEnter={onPieEnter}
                      >
                        {tmpMatchedEnergyData.data?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}

                        <Label
                          content={
                            <TotalPieLabel
                              value={tmpMatchedEnergyData.netDeliverables}
                            />
                          }
                        />
                      </Pie>
                      <Tooltip content={<TotalCustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="col-span-2 flex justify-center items-center">
                  <div className="text-[#848789]">No Data</div>
                </div>
              )}
            </div>

            {/*Settlement */}
            {isShowDetail && isGenPDF == false ? (
              <div>
                {/*Table Device */}
                <div className="w-full mt-5">
                  <DataTableSettlement
                    data={settlementDeviceDataFinal}
                    columns={columnsDevice}
                    searchData={searchDevice}
                    checkbox={false}
                    isTotal={"Total"}
                    isSubTotal={"Device"}
                    unit={unit}
                    convertUnit={convertUnit}
                  />
                </div>
                {/*Table Subscriber */}
                <div className="w-full mt-4">
                  <DataTableSettlement
                    data={settlementSubscriberDataFinal}
                    columns={columnsSubscriber}
                    searchData={searchSubscriber}
                    checkbox={false}
                    isTotal={"Total"}
                    isSubTotal={"Subscriber"}
                    unit={unit}
                    convertUnit={convertUnit}
                  />
                </div>
                {/*<div className="grid grid-cols-2 container mx-auto px-0 gap-8 mt-10 text-left">
                <div className="border-r-2">
                  <div className="text-lg font-bold">Generation</div>

                  <div className="grid grid-cols-2 mx-auto gap-8 mt-3">
                    <div>
                      <div className="text-sm font-normal">Actual Generation</div>
                      <div className="text-xl font-bold">
                        {renderValue(
                          settlementMonthlyGenerationData.actualGeneration
                        )}
                      </div>

                      <div className="text-sm font-normal text-[#848789]">
                        {unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-normal">
                        Actual Supply Weighted Average
                      </div>
                      <div className="text-xl font-bold">
                        {settlementMonthlyGenerationData.supplyWeightedAverage} %
                      </div>
                    </div>
                  </div>

                  {tmpMonthlyGenData.length > 0 && (
                    <div className="pr-10">
                      <div className="flex justify-between items-center py-5">
                        <div className="flex items-center">
                          <div className="text-xs font-semibold pr-3">Sort By</div>

                          <Select
                            size="small"
                            defaultValue="Device Name"
                            onChange={(value) =>
                              handleChangeGenerationSort(
                                value,
                                generationSortDirection
                              )
                            }
                            style={{ width: 200 }}
                            showSearch
                          >
                            <Select.Option value="deviceName">
                              Device Name
                            </Select.Option>
                            <Select.Option value="generation">
                              Actual Generation
                            </Select.Option>
                            <Select.Option value="matched">
                              Matched Actual Generation
                            </Select.Option>
                          </Select>

                          <Button.Group className="ml-2">
                            <Button
                              style={{
                                backgroundColor:
                                  generationSortDirection == "asc" ? "#87BE33" : "",
                              }}
                              variant={
                                generationSortDirection == "asc"
                                  ? "filled"
                                  : "default"
                              }
                              size="compact-sm"
                              onClick={() =>
                                handleChangeGenerationSort(generationSortBy, "asc")
                              }
                            >
                              <BiSortUp size={14} />
                            </Button>

                            <Button
                              variant={
                                generationSortDirection == "desc"
                                  ? "filled"
                                  : "default"
                              }
                              style={{
                                backgroundColor:
                                  generationSortDirection == "desc"
                                    ? "#87BE33"
                                    : "",
                              }}
                              size="compact-sm"
                              onClick={() =>
                                handleChangeGenerationSort(generationSortBy, "desc")
                              }
                            >
                              <BiSortDown size={14} />
                            </Button>
                          </Button.Group>
                        </div>

                        <Button.Group>
                          <Button
                            variant={
                              generationViewMode == "chart" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                generationViewMode == "chart" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setGenerationViewMode("chart")}
                          >
                            <MdBarChart size={14} />
                          </Button>
                          <Button
                            variant={
                              generationViewMode == "table" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                generationViewMode == "table" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setGenerationViewMode("table")}
                          >
                            <LuTable size={14} />
                          </Button>
                        </Button.Group>
                      </div>

                      {generationViewMode == "chart" ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart
                            key={unit}
                            data={tmpMonthlyGenData}
                            margin={{
                              top: 30,
                              right: 0,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis
                              type="category"
                              tick={{ fontSize: 10 }}
                              tickFormatter={(tick) => {
                                return numeral(tick + 1).format("0,0.[00]");
                              }}
                            />
                            <YAxis
                              width={80}
                              tick={{ fontSize: 10 }}
                              tickFormatter={(tick) => {
                                return numeral(tick).format("0,0.[00]");
                              }}
                              label={{
                                fontSize: 10,
                                value: unit,
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <ChartTooltips content={<GenerationCustomTooltip />} />
                            <Bar
                              dataKey="actualGeneration"
                              barSize={15}
                              fill="#4D6A00"
                              radius={[5, 5, 0, 0]}
                              layout="vertical"
                            >
                              <LabelList
                                dataKey="deviceName"
                                position="top"
                                style={{ fontSize: "10px", width: "50px" }}
                              />
                            </Bar>
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <ScrollArea w="100%" h={300}>
                          <Table stickyHeader>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th className="text-center">No.</Table.Th>
                                <Table.Th>Device Name</Table.Th>
                                <Table.Th className="text-center">
                                  Actual Generation
                                  <div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-center">
                                  Matched Actual Generation
                                  <div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-right">%</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {tmpMonthlyGenData?.map((row, index) => (
                                <Table.Tr key={index}>
                                  <Table.Td className="text-center">
                                    {index + 1}
                                  </Table.Td>
                                  <Table.Td width="50%">{row.deviceName}</Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.actualGeneration)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.matched)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {row.generationRatio}
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                            <Table.Tfoot>
                              <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                                <Table.Th colSpan={2} className="text-center">
                                  Total Capacity
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {convertDecimalPlace(
                                    settlementMonthlyGenerationData.totalCapGeneration *
                                      convertUnit
                                  )}
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {convertDecimalPlace(
                                    settlementMonthlyGenerationData.totalCapMatched *
                                      convertUnit
                                  )}
                                </Table.Th>
                                <Table.Th />
                              </Table.Tr>
                            </Table.Tfoot>
                          </Table>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-lg font-bold">Load</div>

                  <div className="grid grid-cols-2 container mx-auto gap-8 mt-3">
                    <div>
                      <div className="text-sm font-normal">
                        Net Actual Load
                      </div>
                      <div className="text-xl font-bold">
                        {renderValue(
                          settlementMonthlyConsumptionData.actualConsumption
                        )}
                      </div>

                      <div className="text-sm font-normal text-[#848789]">
                        {unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-normal">
                        Actual Load Weighted Average
                      </div>
                      <div className="text-xl font-bold">
                        {settlementMonthlyConsumptionData.loadWeightedAverage} %
                      </div>
                    </div>
                  </div>

                  {settlementMonthlyConsumptionData?.actualConsumptionItems && (
                    <div className="pr-10">
                      <div className="flex justify-between items-center py-5">
                        <Form>
                          <div className="flex items-center">
                            <div className="text-xs font-semibold pr-3">
                              Sort By
                            </div>
                            <Select
                              size="small"
                              defaultValue="Subscriber Name"
                              onChange={(value) =>
                                handleChangeConsumptionSort(
                                  value,
                                  consumptionSortDirection
                                )
                              }
                              style={{ width: 200 }}
                              showSearch
                            >
                              <Select.Option value="subscriberName">
                                Subscriber Name
                              </Select.Option>
                              <Select.Option value="consumption">
                                Net Actual Load
                              </Select.Option>
                              <Select.Option value="matched">
                                Matched Load
                              </Select.Option>
                            </Select>
                            <Button.Group className="ml-2">
                              <Button
                                variant={
                                  consumptionSortDirection == "asc"
                                    ? "filled"
                                    : "default"
                                }
                                style={{
                                  backgroundColor:
                                    consumptionSortDirection == "asc"
                                      ? "#87BE33"
                                      : "",
                                }}
                                size="compact-sm"
                                onClick={() =>
                                  handleChangeConsumptionSort(
                                    consumptionSortBy,
                                    "asc"
                                  )
                                }
                              >
                                <BiSortUp size={14} />
                              </Button>
                              <Button
                                variant={
                                  consumptionSortDirection == "desc"
                                    ? "filled"
                                    : "default"
                                }
                                style={{
                                  backgroundColor:
                                    consumptionSortDirection == "desc"
                                      ? "#87BE33"
                                      : "",
                                }}
                                size="compact-sm"
                                onClick={() =>
                                  handleChangeConsumptionSort(
                                    consumptionSortBy,
                                    "desc"
                                  )
                                }
                              >
                                <BiSortDown size={14} />
                              </Button>
                            </Button.Group>
                          </div>
                        </Form>

                        <Button.Group>
                          <Button
                            variant={
                              consumptionViewMode == "chart" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                consumptionViewMode == "chart" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setConsumptionViewMode("chart")}
                          >
                            <MdBarChart size={14} />
                          </Button>
                          <Button
                            variant={
                              consumptionViewMode == "table" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                consumptionViewMode == "table" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setConsumptionViewMode("table")}
                          >
                            <LuTable size={14} />
                          </Button>
                        </Button.Group>
                      </div>

                      {consumptionViewMode == "chart" ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart
                            data={tmpMonthlyConsumpData}
                            margin={{
                              top: 30,
                              right: 0,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis
                              tick={{ fontSize: 12 }}
                              tickFormatter={(tick) => {
                                return numeral(tick + 1).format("0,0.[00]");
                              }}
                            />
                            <YAxis
                              width={80}
                              label={{
                                fontSize: 10,
                                value: unit,
                                angle: -90,
                                position: "insideLeft",
                              }}
                              tick={{ fontSize: 10 }}
                              tickFormatter={(tick) => {
                                return numeral(tick).format("0,0.[00]");
                              }}
                            />
                            <ChartTooltips content={<ConsumptionCustomTooltip />} />
                            <Bar
                              dataKey="actualConsumption"
                              barSize={15}
                              fill="#87BE33"
                              radius={[5, 5, 0, 0]}
                            >
                              <LabelList
                                dataKey="subscriberName"
                                position="top"
                                style={{ fontSize: "10px" }}
                              />
                            </Bar>
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <ScrollArea w="100%" h={300}>
                          <Table stickyHeader>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th className="text-center">No.</Table.Th>
                                <Table.Th>Subscriber Name</Table.Th>
                                <Table.Th className="text-center">
                                  Net Actual Load<div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-center">
                                  Matched Actual Load<div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-right">%</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {tmpMonthlyConsumpData.map((row, index) => (
                                <Table.Tr key={index}>
                                  <Table.Td className="text-center">
                                    {index + 1}
                                  </Table.Td>
                                  <Table.Td width="50%">
                                    {row.subscriberName}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.actualConsumption)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.matched)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {row.consumptionRatio}
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                            <Table.Tfoot>
                              <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                                <Table.Th colSpan={2} className="text-center">
                                  Total Load
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {settlementMonthlyConsumptionData.totalCapConsumption
                                    ? convertDecimalPlace(
                                        settlementMonthlyConsumptionData.totalCapConsumption *
                                          convertUnit
                                      )
                                    : "-"}
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {settlementMonthlyConsumptionData.totalCapMatched
                                    ? convertDecimalPlace(
                                        settlementMonthlyConsumptionData.totalCapMatched *
                                          convertUnit
                                      )
                                    : "-"}
                                </Table.Th>
                                <Table.Th></Table.Th>
                              </Table.Tr>
                            </Table.Tfoot>
                          </Table>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </div>
              </div>*/}
                <div className="w-full mt-5">
                  <div className="grid grid-cols-2">
                    <div className="text-left font-bold text-base">
                      Settlement Detail
                    </div>
                    <div className="text-=left">
                      <div className="grid grid-cols-4">
                        <div className="col-start-1">
                          <label className="font-bold text-sm">
                            Settlement Period
                          </label>
                        </div>
                        <div className="col-start-2">
                          <label className="text-sm">
                            {selectTabSettlementDetail == "device"
                              ? settlementDetailMonthlyDevice.settlementPeriod
                              : settlementDetailMonthlySubscriber.settlementPeriod}
                          </label>
                        </div>
                        <div className="col-start-3">
                          <label className="font-bold text-sm">Matched</label>
                        </div>
                        <div className="col-start-4 text-left">
                          <label className="text-sm">
                            {selectTabSettlementDetail == "device"
                              ? renderValues(
                                  settlementDetailMonthlyDevice.matched
                                ) +
                                " " +
                                unit
                              : renderValues(
                                  settlementDetailMonthlySubscriber.matched
                                ) +
                                " " +
                                unit}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-sm mt-5">
                      <div className="mt-4 pl-1 flex">
                        <div
                          className={
                            selectTabSettlementDetail === "device"
                              ? " w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center "
                              : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px] text-center border-none"
                          }
                        >
                          <button
                            className={
                              selectTabSettlementDetail === "device"
                                ? "font-bold text-base"
                                : "text-[#949292] font-thin text-base"
                            }
                            onClick={() =>
                              setSelectTabSettlementDetail("device")
                            }
                          >
                            Devices
                          </button>
                        </div>
                        <div
                          className={
                            selectTabSettlementDetail === "subscriber"
                              ? "w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center ml-2 "
                              : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px]  text-center ml-2 border-none "
                          }
                        >
                          <button
                            className={
                              selectTabSettlementDetail === "subscriber"
                                ? "font-bold text-base"
                                : "text-[#949292] font-thin text-base"
                            }
                            onClick={() =>
                              setSelectTabSettlementDetail("subscriber")
                            }
                          >
                            Subscriber
                          </button>
                        </div>
                      </div>
                      {selectTabSettlementDetail === "device" ? (
                        <div className="border-t-4 border-solid border-t-[#87BE33] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                          <div className="mt-2 p-2">
                            {settlemtDetailDevice ? (
                              <CollapsDataTable
                                data={settlemtDetailDevice}
                                rowPerPage={25}
                                unit={unit}
                                convertUnit={convertUnit}
                              />
                            ) : (
                              <CollapsDataTable data={[]} rowPerPage={25} />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border-t-4 border-solid border-t-[#87BE33] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                          <div className="mt-2 p-2">
                            {settlementDetailSubscriber ? (
                              <CollapsDataTable
                                data={settlementDetailSubscriber}
                                rowPerPage={25}
                                isDevice={false}
                                unit={unit}
                                convertUnit={convertUnit}
                              />
                            ) : (
                              <CollapsDataTable data={[]} rowPerPage={25} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : undefined}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-sm font-normal gap-2 mt-4 h-[400px]">
          <img src={noContent} alt="React Logo" width={50} height={50} />
          <div>No Data Found.</div>
        </div>
      )}

      {settlementMonthlySummaryData &&
      Object.keys(settlementMonthlySummaryData).length !== 0
        ? isShowAwaitConfirm && (
            <div className="w-full h-[400px] items-center content-center">
              <div className="flex justify-center items-center">
                <img
                  src={WaitApprove}
                  alt="WaitApprove"
                  width={100}
                  height={100}
                  className="content-center"
                />
              </div>
              <label className="text-[#000000CC] font-semibold">
                Awaiting For Confirmation
              </label>
            </div>
          )
        : undefined}

      {settlementMonthlySummaryData &&
      Object.keys(settlementMonthlySummaryData).length !== 0
        ? isShowSettlementProgress && (
            <div className="w-full h-[400px] items-center content-center">
              <div className="flex justify-center items-center">
                <img
                  src={WaitApprove}
                  alt="WaitApprove"
                  width={100}
                  height={100}
                  className="content-center"
                />
              </div>
              <label className="text-[#000000CC] font-semibold">
                Settlement in progress
              </label>
            </div>
          )
        : undefined}
      {
        /*isShowDetailMonthly*/ hideData && (
          <div
            className={`
        ${
          !settlementMonthlySummaryData?.approveStatus && showWaitApprove
            ? "opacity-10"
            : ""
        } `}
          >
            {/*Card Dashboard */}
            <div>
              <div className="grid grid-cols-4 container mx-auto px-0 gap-2 mt-3 text-left">
                <div className="bg-[#EF483526] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Total Contracted Load
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.totalContractedLoad
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
                <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Total Generation
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(settlementMonthlySummaryData?.totalGeneration)}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
                <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Beginning UGT2 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.beginningUgt2Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
                <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Beginning UGT1 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.beginningUgt1Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 container mx-auto px-0 gap-2 mt-3 text-left">
                <div className="bg-[#EF483526] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Total Load
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(settlementMonthlySummaryData?.totalLoad)}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>

                <div className="col-span-3 container mx-auto px-0 gap-2 text-left">
                  <div className=" grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <div className="bg-[#87BE3326] px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="text-sm text-[#5B5C5C] break-words">
                              Actual Generation Matched
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.actualGenerationMatched
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.actualGenerationMatchedPercentage
                                ? settlementMonthlySummaryData?.actualGenerationMatchedPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#87BE3326] mt-2 px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="text-sm text-[#5B5C5C] break-words">
                              UGT2 Inventory Matched
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.ugt2InventoryMatched
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.ugt2InventoryMatchedPercentage
                                ? settlementMonthlySummaryData?.ugt2InventoryMatchedPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#87BE3326] mt-2 px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="text-sm text-[#5B5C5C] break-words">
                              UGT1 Inventory Matched
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.ugt1InventoryMatched
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.ugt1InventoryMatchedPercentage
                                ? settlementMonthlySummaryData?.ugt1InventoryMatchedPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#E9E9E9] mt-2 px-4 py-3 rounded-[5px] w-full">
                        <div className="flex justify-between break-all">
                          <div>
                            <div className="grid grid-col-2">
                              <label className="col-start-1 text-sm text-[#5B5C5C] break-words">
                                Unmatched Energy
                              </label>{" "}
                              <div className="col-start-2 ml-1 inline-block content-center">
                                <Tooltips
                                  title="Load Energy that can not be delivered bundle with REC"
                                  placement="top"
                                  arrow
                                >
                                  <img
                                    src={InfoWarning}
                                    alt="Info"
                                    width={15}
                                    height={15}
                                  />
                                </Tooltips>
                              </div>
                            </div>
                            <div className="text-lg font-bold break-words">
                              {renderValue(
                                settlementMonthlySummaryData?.unmatchedEnergy
                              )}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              {unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold break-words mt-3">
                              {settlementMonthlySummaryData?.unmatchedEnergyPercentage
                                ? settlementMonthlySummaryData?.unmatchedEnergyPercentage +
                                  "%"
                                : 0 + "%"}
                            </div>
                            <div className="text-xs text-[#5B5C5C] break-words">
                              of Total Load
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*Donut Chart */}
                    <div className="col-start-3 col-span-2 px-4 py-4 rounded-[5px] border-2 border-solid border-[#CDCDCD]">
                      <div className="grid grid-cols-[200px_50px]">
                        <label className="col-start-1 text-lg font-bold text-[#5B5C5C] break-words">
                          Net Green Deliverables
                        </label>{" "}
                        <div className="col-start-2 ml-1 inline-block content-center">
                          <Tooltips
                            title="Load Energy that can be delivered bundle with REC (exclude Unmatched Energy)"
                            placement="top"
                            arrow
                          >
                            <img
                              src={InfoWarning}
                              alt="Info"
                              width={15}
                              height={15}
                            />
                          </Tooltips>
                        </div>
                      </div>
                      <div className="text-2xl font-bold break-words">
                        {renderValue(
                          settlementMonthlySummaryData?.netGreenDeliverables
                        )}
                      </div>
                      <div className="text-base text-[#5B5C5C] break-words">
                        {unit}
                      </div>
                      <div>
                        <div
                          style={{
                            width: "100%",
                            height: "275px",
                            margin: "auto",
                          }}
                        >
                          <DonutChart
                            data={data}
                            totalPercent={totalLoadPercentage}
                            unit={unit}
                            convertUnit={convertUnit}
                            additional={additionalData}
                            //options={options}
                            //plugins={[centerTextPlugin]}
                            //ref={(chartInstance) => (chartRef.current = chartInstance?.chartInstance)} // เชื่อมต่อ ref
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 container mx-auto px-0 gap-2 mt-3 text-left">
                <div className="bg-[#FFF2C9] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Remaining Actual Generation
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.remainingActualGeneration
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>

                <div className="bg-[#FFF2C9] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Ending UGT2 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.endingUgt2Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>

                <div className="bg-[#FFF2C9] px-4 py-3 rounded-[5px]">
                  <div className="text-sm text-[#5B5C5C] break-words">
                    Ending UGT1 Inventory
                  </div>
                  <div className="text-lg font-bold break-words">
                    {renderValue(
                      settlementMonthlySummaryData?.endingUgt1Inventory
                    )}
                  </div>
                  <div className="text-xs text-[#5B5C5C] break-words">
                    {unit}
                  </div>
                </div>
              </div>

              {tmpMatchedEnergyData ? (
                <div className="col-span-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={850} height={900}>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={tmpMatchedEnergyData.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={95}
                        outerRadius={120}
                        dataKey="matchedSupply"
                        onMouseEnter={onPieEnter}
                      >
                        {tmpMatchedEnergyData.data?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}

                        <Label
                          content={
                            <TotalPieLabel
                              value={tmpMatchedEnergyData.netDeliverables}
                            />
                          }
                        />
                      </Pie>
                      <Tooltip content={<TotalCustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="col-span-2 flex justify-center items-center">
                  <div className="text-[#848789]">No Data</div>
                </div>
              )}
            </div>

            {/*Settlement */}
            {isShowDetail && isGenPDF == false ? (
              <div>
                {/*Table Device */}
                <div className="w-full mt-5">
                  {/* <DataTableSettlement
              data={settlementDeviceDataFinal}
              columns={columnsDevice}
              searchData={searchDevice}
              checkbox={false}
              isTotal={"Total"}
              isSubTotal={"Device"}
            />*/}
                </div>
                {/*Table Subscriber */}
                <div className="w-full mt-4">
                  {/*<DataTableSettlement
              data={settlementSubscriberDataFinal}
              columns={columnsSubscriber}
              searchData={searchSubscriber}
              checkbox={false}
              isTotal={"Total"}
              isSubTotal={"Subscriber"}
            />*/}
                </div>
                {/*<div className="grid grid-cols-2 container mx-auto px-0 gap-8 mt-10 text-left">
                <div className="border-r-2">
                  <div className="text-lg font-bold">Generation</div>

                  <div className="grid grid-cols-2 mx-auto gap-8 mt-3">
                    <div>
                      <div className="text-sm font-normal">Actual Generation</div>
                      <div className="text-xl font-bold">
                        {renderValue(
                          settlementMonthlyGenerationData.actualGeneration
                        )}
                      </div>

                      <div className="text-sm font-normal text-[#848789]">
                        {unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-normal">
                        Actual Supply Weighted Average
                      </div>
                      <div className="text-xl font-bold">
                        {settlementMonthlyGenerationData.supplyWeightedAverage} %
                      </div>
                    </div>
                  </div>

                  {tmpMonthlyGenData.length > 0 && (
                    <div className="pr-10">
                      <div className="flex justify-between items-center py-5">
                        <div className="flex items-center">
                          <div className="text-xs font-semibold pr-3">Sort By</div>

                          <Select
                            size="small"
                            defaultValue="Device Name"
                            onChange={(value) =>
                              handleChangeGenerationSort(
                                value,
                                generationSortDirection
                              )
                            }
                            style={{ width: 200 }}
                            showSearch
                          >
                            <Select.Option value="deviceName">
                              Device Name
                            </Select.Option>
                            <Select.Option value="generation">
                              Actual Generation
                            </Select.Option>
                            <Select.Option value="matched">
                              Matched Actual Generation
                            </Select.Option>
                          </Select>

                          <Button.Group className="ml-2">
                            <Button
                              style={{
                                backgroundColor:
                                  generationSortDirection == "asc" ? "#87BE33" : "",
                              }}
                              variant={
                                generationSortDirection == "asc"
                                  ? "filled"
                                  : "default"
                              }
                              size="compact-sm"
                              onClick={() =>
                                handleChangeGenerationSort(generationSortBy, "asc")
                              }
                            >
                              <BiSortUp size={14} />
                            </Button>

                            <Button
                              variant={
                                generationSortDirection == "desc"
                                  ? "filled"
                                  : "default"
                              }
                              style={{
                                backgroundColor:
                                  generationSortDirection == "desc"
                                    ? "#87BE33"
                                    : "",
                              }}
                              size="compact-sm"
                              onClick={() =>
                                handleChangeGenerationSort(generationSortBy, "desc")
                              }
                            >
                              <BiSortDown size={14} />
                            </Button>
                          </Button.Group>
                        </div>

                        <Button.Group>
                          <Button
                            variant={
                              generationViewMode == "chart" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                generationViewMode == "chart" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setGenerationViewMode("chart")}
                          >
                            <MdBarChart size={14} />
                          </Button>
                          <Button
                            variant={
                              generationViewMode == "table" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                generationViewMode == "table" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setGenerationViewMode("table")}
                          >
                            <LuTable size={14} />
                          </Button>
                        </Button.Group>
                      </div>

                      {generationViewMode == "chart" ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart
                            key={unit}
                            data={tmpMonthlyGenData}
                            margin={{
                              top: 30,
                              right: 0,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis
                              type="category"
                              tick={{ fontSize: 10 }}
                              tickFormatter={(tick) => {
                                return numeral(tick + 1).format("0,0.[00]");
                              }}
                            />
                            <YAxis
                              width={80}
                              tick={{ fontSize: 10 }}
                              tickFormatter={(tick) => {
                                return numeral(tick).format("0,0.[00]");
                              }}
                              label={{
                                fontSize: 10,
                                value: unit,
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <ChartTooltips content={<GenerationCustomTooltip />} />
                            <Bar
                              dataKey="actualGeneration"
                              barSize={15}
                              fill="#4D6A00"
                              radius={[5, 5, 0, 0]}
                              layout="vertical"
                            >
                              <LabelList
                                dataKey="deviceName"
                                position="top"
                                style={{ fontSize: "10px", width: "50px" }}
                              />
                            </Bar>
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <ScrollArea w="100%" h={300}>
                          <Table stickyHeader>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th className="text-center">No.</Table.Th>
                                <Table.Th>Device Name</Table.Th>
                                <Table.Th className="text-center">
                                  Actual Generation
                                  <div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-center">
                                  Matched Actual Generation
                                  <div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-right">%</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {tmpMonthlyGenData?.map((row, index) => (
                                <Table.Tr key={index}>
                                  <Table.Td className="text-center">
                                    {index + 1}
                                  </Table.Td>
                                  <Table.Td width="50%">{row.deviceName}</Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.actualGeneration)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.matched)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {row.generationRatio}
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                            <Table.Tfoot>
                              <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                                <Table.Th colSpan={2} className="text-center">
                                  Total Capacity
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {convertDecimalPlace(
                                    settlementMonthlyGenerationData.totalCapGeneration *
                                      convertUnit
                                  )}
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {convertDecimalPlace(
                                    settlementMonthlyGenerationData.totalCapMatched *
                                      convertUnit
                                  )}
                                </Table.Th>
                                <Table.Th />
                              </Table.Tr>
                            </Table.Tfoot>
                          </Table>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-lg font-bold">Load</div>

                  <div className="grid grid-cols-2 container mx-auto gap-8 mt-3">
                    <div>
                      <div className="text-sm font-normal">
                        Net Actual Load
                      </div>
                      <div className="text-xl font-bold">
                        {renderValue(
                          settlementMonthlyConsumptionData.actualConsumption
                        )}
                      </div>

                      <div className="text-sm font-normal text-[#848789]">
                        {unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-normal">
                        Actual Load Weighted Average
                      </div>
                      <div className="text-xl font-bold">
                        {settlementMonthlyConsumptionData.loadWeightedAverage} %
                      </div>
                    </div>
                  </div>

                  {settlementMonthlyConsumptionData?.actualConsumptionItems && (
                    <div className="pr-10">
                      <div className="flex justify-between items-center py-5">
                        <Form>
                          <div className="flex items-center">
                            <div className="text-xs font-semibold pr-3">
                              Sort By
                            </div>
                            <Select
                              size="small"
                              defaultValue="Subscriber Name"
                              onChange={(value) =>
                                handleChangeConsumptionSort(
                                  value,
                                  consumptionSortDirection
                                )
                              }
                              style={{ width: 200 }}
                              showSearch
                            >
                              <Select.Option value="subscriberName">
                                Subscriber Name
                              </Select.Option>
                              <Select.Option value="consumption">
                                Net Actual Load
                              </Select.Option>
                              <Select.Option value="matched">
                                Matched Load
                              </Select.Option>
                            </Select>
                            <Button.Group className="ml-2">
                              <Button
                                variant={
                                  consumptionSortDirection == "asc"
                                    ? "filled"
                                    : "default"
                                }
                                style={{
                                  backgroundColor:
                                    consumptionSortDirection == "asc"
                                      ? "#87BE33"
                                      : "",
                                }}
                                size="compact-sm"
                                onClick={() =>
                                  handleChangeConsumptionSort(
                                    consumptionSortBy,
                                    "asc"
                                  )
                                }
                              >
                                <BiSortUp size={14} />
                              </Button>
                              <Button
                                variant={
                                  consumptionSortDirection == "desc"
                                    ? "filled"
                                    : "default"
                                }
                                style={{
                                  backgroundColor:
                                    consumptionSortDirection == "desc"
                                      ? "#87BE33"
                                      : "",
                                }}
                                size="compact-sm"
                                onClick={() =>
                                  handleChangeConsumptionSort(
                                    consumptionSortBy,
                                    "desc"
                                  )
                                }
                              >
                                <BiSortDown size={14} />
                              </Button>
                            </Button.Group>
                          </div>
                        </Form>

                        <Button.Group>
                          <Button
                            variant={
                              consumptionViewMode == "chart" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                consumptionViewMode == "chart" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setConsumptionViewMode("chart")}
                          >
                            <MdBarChart size={14} />
                          </Button>
                          <Button
                            variant={
                              consumptionViewMode == "table" ? "filled" : "default"
                            }
                            style={{
                              backgroundColor:
                                consumptionViewMode == "table" ? "#87BE33" : "",
                            }}
                            size="compact-sm"
                            onClick={() => setConsumptionViewMode("table")}
                          >
                            <LuTable size={14} />
                          </Button>
                        </Button.Group>
                      </div>

                      {consumptionViewMode == "chart" ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart
                            data={tmpMonthlyConsumpData}
                            margin={{
                              top: 30,
                              right: 0,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis
                              tick={{ fontSize: 12 }}
                              tickFormatter={(tick) => {
                                return numeral(tick + 1).format("0,0.[00]");
                              }}
                            />
                            <YAxis
                              width={80}
                              label={{
                                fontSize: 10,
                                value: unit,
                                angle: -90,
                                position: "insideLeft",
                              }}
                              tick={{ fontSize: 10 }}
                              tickFormatter={(tick) => {
                                return numeral(tick).format("0,0.[00]");
                              }}
                            />
                            <ChartTooltips content={<ConsumptionCustomTooltip />} />
                            <Bar
                              dataKey="actualConsumption"
                              barSize={15}
                              fill="#87BE33"
                              radius={[5, 5, 0, 0]}
                            >
                              <LabelList
                                dataKey="subscriberName"
                                position="top"
                                style={{ fontSize: "10px" }}
                              />
                            </Bar>
                          </ComposedChart>
                        </ResponsiveContainer>
                      ) : (
                        <ScrollArea w="100%" h={300}>
                          <Table stickyHeader>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th className="text-center">No.</Table.Th>
                                <Table.Th>Subscriber Name</Table.Th>
                                <Table.Th className="text-center">
                                  Net Actual Load<div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-center">
                                  Matched Actual Load<div>({unit})</div>
                                </Table.Th>
                                <Table.Th className="text-right">%</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {tmpMonthlyConsumpData.map((row, index) => (
                                <Table.Tr key={index}>
                                  <Table.Td className="text-center">
                                    {index + 1}
                                  </Table.Td>
                                  <Table.Td width="50%">
                                    {row.subscriberName}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.actualConsumption)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {convertDecimalPlace(row.matched)}
                                  </Table.Td>
                                  <Table.Td className="text-right">
                                    {row.consumptionRatio}
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                            <Table.Tfoot>
                              <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                                <Table.Th colSpan={2} className="text-center">
                                  Total Load
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {settlementMonthlyConsumptionData.totalCapConsumption
                                    ? convertDecimalPlace(
                                        settlementMonthlyConsumptionData.totalCapConsumption *
                                          convertUnit
                                      )
                                    : "-"}
                                </Table.Th>
                                <Table.Th className="text-right">
                                  {settlementMonthlyConsumptionData.totalCapMatched
                                    ? convertDecimalPlace(
                                        settlementMonthlyConsumptionData.totalCapMatched *
                                          convertUnit
                                      )
                                    : "-"}
                                </Table.Th>
                                <Table.Th></Table.Th>
                              </Table.Tr>
                            </Table.Tfoot>
                          </Table>
                        </ScrollArea>
                      )}
                    </div>
                  )}
                </div>
              </div>*/}
                <div className="w-full mt-5">
                  <div className="grid grid-cols-2">
                    <div className="text-left font-bold text-base">
                      Settlement Detail
                    </div>
                    <div className="text-=left">
                      <div className="grid grid-cols-4">
                        <div className="col-start-1">
                          <label className="font-bold text-sm">
                            Settlement Period
                          </label>
                        </div>
                        <div className="col-start-2">
                          <label className="text-sm">
                            {selectTabSettlementDetail == "device"
                              ? settlementDetailMonthlyDevice.settlementPeriod
                              : settlementDetailMonthlySubscriber.settlementPeriod}
                          </label>
                        </div>
                        <div className="col-start-3">
                          <label className="font-bold text-sm">Matched</label>
                        </div>
                        <div className="col-start-4 text-left">
                          <label className="text-sm">
                            {selectTabSettlementDetail == "device"
                              ? renderValues(
                                  settlementDetailMonthlyDevice.matched
                                ) +
                                " " +
                                unit
                              : renderValues(
                                  settlementDetailMonthlySubscriber.matched
                                ) +
                                " " +
                                unit}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-sm mt-5">
                      <div className="mt-4 pl-1 flex">
                        <div
                          className={
                            selectTabSettlementDetail === "device"
                              ? " w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center "
                              : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px] text-center border-none"
                          }
                        >
                          <button
                            className={
                              selectTabSettlementDetail === "device"
                                ? "font-bold text-base"
                                : "text-[#949292] font-thin text-base"
                            }
                            onClick={() =>
                              setSelectTabSettlementDetail("device")
                            }
                          >
                            Devices
                          </button>
                        </div>
                        <div
                          className={
                            selectTabSettlementDetail === "subscriber"
                              ? "w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center ml-2 "
                              : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px]  text-center ml-2 border-none "
                          }
                        >
                          <button
                            className={
                              selectTabSettlementDetail === "subscriber"
                                ? "font-bold text-base"
                                : "text-[#949292] font-thin text-base"
                            }
                            onClick={() =>
                              setSelectTabSettlementDetail("subscriber")
                            }
                          >
                            Subscriber
                          </button>
                        </div>
                      </div>
                      {selectTabSettlementDetail === "device" ? (
                        <div className="border-t-4 border-solid border-t-[#87BE33] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                          <div className="mt-2 p-2">
                            {settlemtDetailDevice ? (
                              <CollapsDataTable
                                data={settlemtDetailDevice}
                                rowPerPage={25}
                                unit={unit}
                                convertUnit={convertUnit}
                              />
                            ) : (
                              <CollapsDataTable data={[]} rowPerPage={25} />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border-t-4 border-solid border-t-[#87BE33] border-r-4 border-l-4 border-b-4 border-r-gray border-r-gray border-r-gray p-3 grid gap-4 gap-y-2 rounded-[5px]">
                          <div className="mt-2 p-2">
                            {settlementDetailSubscriber ? (
                              <CollapsDataTable
                                data={settlementDetailSubscriber}
                                rowPerPage={25}
                                isDevice={false}
                                unit={unit}
                                convertUnit={convertUnit}
                              />
                            ) : (
                              <CollapsDataTable data={[]} rowPerPage={25} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : undefined}
          </div>
        )
      }

      {
        /*!isApprove && !isModuleViewerUser && showWaitApprove*/ hideData && (
          <div className="w-full h-[400px] items-center content-center">
            <div className="flex justify-center items-center">
              <img
                src={WaitApprove}
                alt="WaitApprove"
                width={100}
                height={100}
                className="content-center"
              />
            </div>
            <label className="text-[#000000CC] font-semibold">
              Awaiting For Confirmation
            </label>
          </div>
        )
      }
    </>
  );
};

export default SettlementInfoFinal;

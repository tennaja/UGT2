import React, { useEffect, useState,useRef } from "react";
import { Card, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBox from "../Control/SearchBox";
import DataTable from "../Control/Table/DataTable";
import StatusLabel from "../../Component/Control/StatusLabel";
import { MdOutlineContentCopy } from "react-icons/md";
import MonthPicker from "./components/MonthPicker";
import dayjs from "dayjs";
import { Form, Select } from "antd";
import { setCookie } from "../../Utils/FuncUtils";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import {
  CONVERT_UNIT,
  USER_GROUP_ID,
  MONTH_LIST,
} from "../../Constants/Constants";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import { message } from "antd";
import SubMenuAction from "../Control/SubMenuAction";
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegFileExcel } from "react-icons/fa";
import ExpireInven from "../assets/ExpireInventory.svg";
import InvenUsage from "../assets/InventoryUsage.svg";
import RemainInven from "../assets/RemaingInventory.svg";
import TotalInven from "../assets/TotalInventory.svg";
import Multiselect from "../Control/Multiselect";
import MultiselectInvenDetail from "./components/MultiselectInvenDetail";

import {
  getInventoryList,
  getInventoryDropdownList,
  getInventoryInfoFilter,
  downloadExcelInventoryInfo,
  getInventoryInfoCard,
  getInventoryInfoGraph
} from "../../Redux/Inventory/InventoryAction";

// Chart import
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

import { Stack } from "@mui/material";
import html2pdf from "html2pdf.js";
import Swal from 'sweetalert2'

const customLegendLine = [
  { name: "Remaining Inventory", color: "#4D6A00", style: "solid" },
  { name: "Total Inventory", color: "#3370BF", style: null },
  { name: "Expired Inventory", color: "#979797", style: null },
  { name: "Inventory Usage", color: "#F7A042", style: null },
];

const itemsPerPage = 5;
const InventoryList = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const inventoryList = useSelector((state) => state.inventory?.inventoryList);
  const inventoryDropdownList = useSelector(
    (state) => state.inventory.inventoryDropdownList
  );
  const inventoryInfoFilter = useSelector(
    (state) => state.inventory.inventoryInfoFilter
  );
  const inventoryInfoCard = useSelector((state)=>state.inventory.inventoryInfoCard)
  const inventoryInfoGraph = useSelector((state)=>state.inventory.inventoryInfoGraph)

  //console.log(inventoryInfoGraph);
  const [serchQuery, setSerchQuery] = useState("");
  const [selectedStart, setSelectedStart] = useState(dayjs());
  const [selectedEnd, setSelectedEnd] = useState(dayjs());

  const [fileterUGT, setSelectUGT] = useState(0);
  const [filterPort, setFilterPort] = useState([]);
  const [overviewDataUnit, setOverviewDataUnit] = useState(
    CONVERT_UNIT[0].unit
  );
  const [filterPortList, setFilterPortList] = useState([]);
  //console.log(fileterUGT);
  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[0].convertValue);

  const [tempChart, setTempChart] = useState([]);

  const [zoomDomain, setZoomDomain] = useState([0, tempChart.length - 1]);
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
    const contentRef = useRef();

  useEffect(() => {
    //console.log(!inventoryInfoFilter)
    if (inventoryInfoFilter) {
      //console.log("ComeFetch")
      dispatch(getInventoryInfoFilter());
    }
  }, []);

  useEffect(() => {
    if (inventoryInfoFilter && Object.keys(inventoryInfoFilter).length !== 0) {
      const [monthMax, yearMax] = inventoryInfoFilter.defaultEnd.split("/");
      const [monthMin, yearMin] = inventoryInfoFilter.defaultStart.split("/");
      const startMaxday = new Date(yearMax, monthMax, 0).getDate();
      const DefaultminDateTemp = yearMin + "/" + monthMin + "/1";
      const DefaultmaxDateTemp = yearMax + "/" + monthMax + "/" + startMaxday;
      const minDate =
        inventoryInfoFilter.minYear +
        "/" +
        inventoryInfoFilter.minMonth +
        "/" +
        new Date(
          inventoryInfoFilter.minYear,
          inventoryInfoFilter.minMonth,
          0
        ).getDate();
      const maxDate =
        inventoryInfoFilter.maxYear + "/" + inventoryInfoFilter.maxMonth + "/1";

      setMaxDate(dayjs(maxDate));
      setMinDate(dayjs(minDate));
      setSelectedStart(dayjs(DefaultminDateTemp));
      setSelectedEnd(dayjs(DefaultmaxDateTemp));
    }
  }, [inventoryInfoFilter]);

  useEffect(() => {
    setTempChart(convertChartData(inventoryInfoGraph, convertUnit));
  }, [overviewDataUnit]);

  useEffect(() => {
    if (selectedStart && selectedEnd) {
        //console.log("Change start end UGT")
      const startDate =
        String(selectedStart.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedStart.$y;
      const endDate =
        String(selectedEnd.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedEnd.$y;
      let port = [];
      for (let i = 0; i > filterPort.length; i++) {
        port.push(filterPort[i].id);
      }
      //console.log(port);
      const param = {
        startDate: startDate,
        endDate: endDate,
        ugtGroupId: fileterUGT,
        portfolioId: port,
      };
      
      dispatch(getInventoryList(param));
      dispatch(getInventoryDropdownList(param));
      
      const paramCard = {
        startDate: startDate,
        endDate: endDate,
        ugtGroupId: fileterUGT,
        portfolioId: port,
        unitPrefix: overviewDataUnit,
        unit: convertUnit,
      };
      dispatch(getInventoryInfoGraph(paramCard))
      dispatch(getInventoryInfoCard(paramCard))
    }
  }, [selectedStart, selectedEnd, fileterUGT]);

  useEffect(() => {
    handleChangeAssignFilter([], "TYPE");
    setFilterPortList(inventoryDropdownList);
  }, [inventoryDropdownList]);

  useEffect(() => {
    if (filterPort) {
      //console.log("Fetch");
      const startDate =
        String(selectedStart.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedStart.$y;
      const endDate =
        String(selectedEnd.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedEnd.$y;
      let port = [];
      //console.log(filterPort);
      for (let i = 0; i < filterPort.length; i++) {
        port.push(filterPort[i].id);
      }
      //console.log(port);
      const param = {
        startDate: startDate,
        endDate: endDate,
        ugtGroupId: fileterUGT,
        portfolioId: port,
      };
      dispatch(getInventoryList(param));
      
      const paramCard = {
        startDate: startDate,
        endDate: endDate,
        ugtGroupId: fileterUGT,
        portfolioId: port,
        unitPrefix: overviewDataUnit,
        unit: convertUnit,
      };
      dispatch(getInventoryInfoGraph(param))
      dispatch(getInventoryInfoCard(paramCard))
    }
  }, [filterPort]);

  useEffect(()=>{
    if(inventoryInfoGraph){
        setTempChart(convertChartData(inventoryInfoGraph, convertUnit));
    }
  },[inventoryInfoGraph])
  //console.log(filterPort);
  //console.log(tempChart);

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsAssigned = [
    {
      id: "portfolioName",
      label: "Portfolio Name",
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
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[serchQuery]}
              autoEscape={true}
              textToHighlight={row.portfolioName}
            />
          </div>
          <div>
            <label
              className={`${"bg-[#F7A04233] text-[#F7A042]"} rounded w-max px-3 py-1 mt-1 text-xs font-normal`}
            >
              <Highlighter
                highlightClassName="highlight"
                highlightTag={Highlight}
                searchWords={[serchQuery]}
                autoEscape={true}
                textToHighlight={row?.portfolioCode}
              />
            </label>
            <button>
              <MdOutlineContentCopy
                className="inline-block ml-2"
                onClick={() => copyToClipboard(row.portfolioCode)}
              />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "UGT",
      label: "UGT",
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
            highlightClassName="highlight"
            highlightTag={Highlight}
            searchWords={[serchQuery]}
            autoEscape={true}
            textToHighlight={row.ugtGroup}
          />
        </div>
      ),
    },
    {
      id: "numberOfDevice",
      label: "Number of Device",
      align: "center",

      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold break-words"
            style={{
              width: "100px",
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[serchQuery]}
              autoEscape={true}
              textToHighlight={row.numberOfDevices.toString()}
            />
          </div>
        </div>
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      align: "center",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold break-words"
            style={{
              width: "100px",
              wordWrap: "break-word",
            }}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[serchQuery]}
              autoEscape={true}
              textToHighlight={row.startDate}
            />
          </div>
        </div>
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      align: "center",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className="font-semibold break-words"
            style={{
              width: "100px",
              wordWrap: "break-word",
            }}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[serchQuery]}
              autoEscape={true}
              textToHighlight={row.endDate}
            />
          </div>
        </div>
      ),
    },
    {
      id: "manage",
      label: "",

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
            state={{
              portfolioId: row.id,
              portfolioName: row.portfolioName,
              ugtName: row.ugtGroup,
            }}
            to={WEB_URL.INVENTORY_DETAIL}
            className={`flex no-underline rounded p-2 cursor-pointer text-sm items-center  hover:bg-[#4D6A00] bg-[#87BE33]`}
          >
            <label className="m-auto cursor-pointer text-white font-semibold">
              {"View"}
            </label>
          </Link>
        </div>
      ),
    },
    // Add more columns as needed
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success("copy to clipboard");
      },
      (err) => {
        message.error("Failed to copy!");
      }
    );
  };

  //console.log(selectedStart.$d.getMonth());

  const mockUGTDropdown = [
    { id: 0, name: "All" },
    { id: 1, name: "UGT-1" },
    { id: 2, name: "UGT-2" },
  ];
  const mockPortData = [{ id: 0, name: "All" }];

  const handleSelectUGT = (value) => {
    setSelectUGT(value);
  };
  const handleSelectPort = (value) => {
    setFilterPort(value);
  };
  const handleChangeOverviewUnit = (unit) => {
    //console.log("Handle unit", unit);
    const unitObj = CONVERT_UNIT.filter((obj) => {
      return obj.unit == unit;
    });
    setOverviewDataUnit(unit);
    setConvertUnit(unitObj[0].convertValue);
    /*setTmpOverviewChartData(
        convertChartData(settlementOverviewData, unitObj[0].convertValue)
      );*/
  };

  const handleExportPDF = () => {
    generatePDFScreenFinal()
  };

  const handleExportExcel = () => {
    if (selectedStart && selectedEnd) {
      const startDate =
        String(selectedStart.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedStart.$y;
      const endDate =
        String(selectedEnd.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedEnd.$y;
      let port = [];
      for (let i = 0; i > filterPort.length; i++) {
        port.push(filterPort[i].id);
      }
      //console.log(port);
      const param = {
        startDate: startDate,
        endDate: endDate,
        unitPrefix: overviewDataUnit,
        unit: convertUnit,
        ugtGroupId: fileterUGT,
        portfolioId: port,
      };
      dispatch(downloadExcelInventoryInfo(param));
    }
  };
  const styleTable = "px-6 py-4 font-semibold text-black text-center";

  const mockChart = [
    {
      period: "1/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "2/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "3/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "4/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "5/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "6/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "7/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "8/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "9/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "10/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "11/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "12/2024",
      RemainInven: 1000,
      TotalInven: 500,
      expireInven: 100,
      inventoryUsage: 300,
    },
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //3
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //4
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //5
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //6
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //7
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //8
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //9
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    //10
    {
      period: "1/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "2/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "3/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "4/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "5/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "6/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "7/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "8/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "9/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "10/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "11/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
    {
      period: "12/2025",
      RemainInven: 0,
      TotalInven: 0,
      expireInven: 0,
      inventoryUsage: 0,
    },
  ];

  const mockDataTable = [
    {
      id: 107,
      portfolioName: "Test Port 1",
      UGT: "UGT-1",
      numberOfDevice: 2,
      startDate: "1/01/2024",
      endDate: "31/01/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
    {
      id: 102,
      portfolioName: "Test Port 2",
      UGT: "UGT-2",
      numberOfDevice: 4,
      startDate: "1/02/2024",
      endDate: "31/02/2024",
    },
  ];

  const convertChartData = (chartData, convertUnit) => {
    //console.log(chartData);
    const new_overviewChartData = chartData.map((item) => {
      const new_item = {
        period: item.period,
        remainingInventory: item.remainingInventory * convertUnit,
        totalInventory: item.totalInventory * convertUnit,
        expiredInventory: item.expiredInventory * convertUnit,
        inventoryUsage: item.inventoryUsage * convertUnit,
      };
      return new_item;
    });
    return new_overviewChartData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    //console.log("Payload",payload)
    if (active && payload && payload.length) {
      //console.log(payload);
      const _period = payload?.[0]?.payload?.period;
      const _remainInven =
        payload?.[0]?.payload?.remainingInventory > 0
          ? convertData(payload?.[0]?.payload?.remainingInventory)
          : "-";
      const _totalInven =
        payload?.[0]?.payload?.totalInventory > 0
          ? convertData(payload?.[0]?.payload?.totalInventory)
          : "-";
      const _expireInven =
        payload?.[0]?.payload?.expiredInventory > 0
          ? convertData(payload?.[0]?.payload?.expiredInventory)
          : "-";
      const _inventoryUsage =
        payload?.[0]?.payload?.inventoryUsage > 0
          ? convertData(payload?.[0]?.payload?.inventoryUsage)
          : "-";

      return (
        <div className="bg-[#F5F4E9] rounded p-3 text-left">
          <div className="pb-2">
            <div className="text-sm font-bold">{_period}</div>
            <div className="text-xs">
              Period:{" "}
              <label className="text-[#4D6A00] font-semibold">{` ${_period}`}</label>
            </div>
            <div className="text-xs">
              Remaining Inventory:{" "}
              <label className="text-[#4D6A00] font-semibold">{` ${
                _remainInven + " " + overviewDataUnit
              }`}</label>
            </div>
            <div className="text-xs">
              Total Inventory:{" "}
              <label className="text-[#4D6A00] font-semibold">{` ${
                _totalInven + " " + overviewDataUnit
              }`}</label>
            </div>
            <div className="text-xs">
              Expired Inventory:{" "}
              <label className="text-[#4D6A00] font-semibold">{` ${
                _expireInven + " " + overviewDataUnit
              }`}</label>
            </div>
            <div className="text-xs">
              Inventory Usage:{" "}
              <label className="text-[#4D6A00] font-semibold">{` ${
                _inventoryUsage + " " + overviewDataUnit
              }`}</label>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const convertData = (value) => {
        //console.log("Value Convert",value)
        let decFixed = 3;
        if (overviewDataUnit == "kWh") {
          decFixed = 3;
        } else if (overviewDataUnit == "MWh") {
          decFixed = 6;
        } else if (overviewDataUnit == "GWh") {
          decFixed = 6;
        }
    
        if (value) {
          //console.log("Set Value")
          if (decFixed == 3) {
            return numeral(value).format("0,0.000");
          }
          if (decFixed == 6) {
            return numeral(value).format("0,0.000000");
          }
        } else {
          //console.log("Set Zero")
          return numeral(0).format("0,0.000");
        }
      };
  const handleAssignedSearchChange = (e) => {
    setSerchQuery(e.target.value);
  };
  const handleChangeAssignFilter = (value) => {
    setFilterPort(value);
  };

  const calTopercent=(value,total)=>{
    return numeral((Number(value)/Number(total))*100).format("0,0.00")
  }

  const generatePDFScreenFinal = () => {
      //let oldSelect = selectTab
      //setSelectTab("final")
      Swal.fire({
              title: 'Please Wait...',
              html: `กำลังโหลด...`,
              allowOutsideClick: false,
              showConfirmButton: false,
              timerProgressBar: true,
              didOpen: () => {
                  Swal.showLoading();
              },
          })
      
      setTimeout(() => {
          //console.log("GEN PDF")
        // เลือก DOM element ที่ต้องการแปลงเป็น PDF
        const element = contentRef.current; //document.getElementById('pdf-content');
  
        // กำหนดตัวเลือกสำหรับ html2pdf
        const options = {
          margin: 0,
          filename: "webscreen.pdf",
          image: { type: "jpeg", quality: 50 },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          html2canvas: { scale: 2 }, // เพิ่ม scale เพื่อเพิ่มความละเอียด
          jsPDF: { unit: "cm", format: "a3", orientation: "portrait" },
        };
  
        // สร้าง PDF ด้วย html2pdf และดึง base64 string
        html2pdf()
          .from(element)
          .set(options)
          .outputPdf("datauristring") // ดึงข้อมูลออกมาเป็น Base64 string
          .then((pdfBase64) => {
            console.log(pdfBase64); // แสดง base64 string ใน console
            const base64Content = pdfBase64.split(",")[1];
            const now = new Date();
            const formattedDateTime = `${now
              .getDate()
              .toString()
              .padStart(2, "0")}_${(now.getMonth() + 1)
              .toString()
              .padStart(2, "0")}_${now.getFullYear()}_${now
              .getHours()
              .toString()
              .padStart(2, "0")}_${now
              .getMinutes()
              .toString()
              .padStart(2, "0")}_${now.getSeconds().toString().padStart(2, "0")}`;
            const fileName = formattedDateTime + ".pdf";
            const fileNameNew = "Export_PDF" + formattedDateTime + ".pdf";
            openPDFInNewTab(base64Content, "application/pdf", fileNameNew);
            setIsGenerate(false);
          }).catch((error) => {
                  consol.log(error)
              }).finally(() => {
                  setTimeout(() => {
                      Swal.close()
                  }, 300);
              });
      }, 1200);
    };
    const openPDFInNewTab = (base64String, type, name) => {
      const extension = name.split(".").pop();
      const pdfWindow = window.open("");
      //console.log("PDF", pdfWindow);
      //console.log(type);
      if (type === "application/pdf") {
        if (pdfWindow) {
          // Set the title of the new tab to the filename
          //pdfWindow.document.title = name;
          setTimeout(() => {
            pdfWindow.document.title = name;
          }, 100);
  
          // Convert Base64 to raw binary data held in a string
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
  
          // Create a Blob from the byte array and set the MIME type
          const blob = new Blob([byteArray], { type: type });
          //console.log("Blob", blob);
  
          // Create a URL for the Blob and set it as the iframe source
          const blobURL = URL.createObjectURL(blob);
          //console.log("Blob url :", blobURL);
          let names = name;
  
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
          alert("Unable to open new tab. Please allow popups for this website.");
        }
      } else if (
        extension === "jpeg" ||
        extension === "jpg" ||
        extension === "png" ||
        extension === "svg"
      ) {
        if (pdfWindow) {
          pdfWindow.document
            .write(`<html><body style="margin:0; display:flex; align-items:center; justify-content:center;">
                    <img src="data:image/jpeg;base64,${base64String}" style="max-width:100%; height:auto;"/>
                </body></html>`);
          pdfWindow.document.title = "Image Preview";
          pdfWindow.document.close();
        }
      }
    };

  return (
    <div ref={contentRef}
    style={{ width: "100%", padding: "0px", background: "#f5f5f5" }}>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                Inventory Info
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                Inventory Management / Inventory Info
              </p>
            </div>

            {/*Card filter */}
            <div className="text-sm font-bold mb-1">Month/Year :</div>

            <form className="grid col-span-12 lg:grid-cols-12 lg:grid-rows-none  sm:grid-rows-2 gap-2 ">
              {/* <div className="col-span-3 px-2"></div> */}
              {/* {!isPortManager && <div className="col-span-4"></div>} */}
              <div className="col-span-4 flex">
                <div className="h-[40px] w-[160px] sm:ml-2">
                  <MonthPicker
                    value={selectedStart}
                    setValue={setSelectedStart}
                    mindate={minDate}
                    maxdate={maxDate}
                  />
                </div>
                <div className="ml-2 items-center">
                  <label className="font-bold text-2xl mt-1">-</label>
                </div>
                <div className="ml-2 h-[40px] w-[160px]">
                  <MonthPicker
                    value={selectedEnd}
                    setValue={setSelectedEnd}
                    mindate={selectedStart}
                    maxdate={maxDate}
                  />
                </div>
              </div>
              <div className="col-span-8">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-2">
                    <Form layout="horizontal" size="large">
                      <Form.Item className="col-span-1  col-start-1">
                        <Select
                          size="large"
                          value={fileterUGT}
                          onChange={(value) => handleSelectUGT(value)}
                        >
                          {mockUGTDropdown.map((item, index) => (
                            <Select.Option
                              key={index}
                              value={item.id}
                              //disabled={item > latestYearHasData}
                            >
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Form>
                  </div>
                  <div className="col-span-5">
                    <Controller
                      name="portFilter"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <MultiselectInvenDetail
                          {...field}
                          id={"portFilter"}
                          placeholder={"All"}
                          typeSelect={2}
                          options={filterPortList}
                          valueProp={"id"}
                          displayProp={"portfolioName"}
                          onChangeInput={(value) => {
                            handleChangeAssignFilter(value, "TYPE");
                          }}
                          wrapText={true}
                          isSearchable={true}
                          size="large"
                          value={filterPort}
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <Form layout="horizontal" size="large">
                      <Form.Item className="col-span-1 col-start-2 lg:w-[120px]">
                        <Select
                          size="large"
                          value={overviewDataUnit}
                          variant="borderless"
                          onChange={(value) => handleChangeOverviewUnit(value)}
                          className={
                            /*`${!canViewSettlementDetail && "opacity-20"}`*/ ""
                          }
                        >
                          {CONVERT_UNIT?.map((item, index) => (
                            <Select.Option key={index} value={item.unit}>
                              {item.unit}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Form>
                  </div>
                  <div className="col-span-2 lg:ml-3">
                    <SubMenuAction
                      labelBtn={"Export"}
                      actionList={[
                        {
                          icon: (
                            <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]" />
                          ),
                          label: "Export PDF",
                          onClick: handleExportPDF,
                          rightTxt: "",
                          hide: false,
                        },
                        {
                          icon: (
                            <FaRegFileExcel className="text-green-700 w-[20px] h-[20px]" />
                          ),
                          label: "Export Excel",
                          onClick: handleExportExcel,
                          rightTxt: "",
                          hide: false,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/*<Card
              shadow="md"
              radius="md"
              className="flex w-full h-full"
              padding="lg"
            >
              
            </Card>*/}

            {/*Dashboard Card */}
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
                      className={`flex justify-center w-[75px] h-[75px] mb-2 bg-[#3370BF26]`}
                    >
                      <img
                        alt={"TotalInven"}
                        src={TotalInven}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-2xl font-semibold flex justify-end">
                        {inventoryInfoCard.totalInventory}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        {"kWh"}
                      </label>
                    </div>
                  </div>
                  <div className="font-bold  mt-2 mb-4">Total Inventory</div>
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
                      className={`flex justify-center w-[75px] h-[75px] mb-2 bg-[#F7A04226]`}
                    >
                      <img
                        alt={"InvenUsage"}
                        src={InvenUsage}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-2xl font-semibold flex justify-end">
                        {inventoryInfoCard.inventoryUsage}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        kWh
                      </label>
                    </div>
                  </div>
                  <div className="font-bold  mt-2">Inventory Usage</div>
                  <div
                    className={`text-gray-500 text-right text-[0.8rem] font-medium mt-2`}
                  >
                    {inventoryInfoCard.inventoryUsagePercentage+"% of Total Inventory"}
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
                      className={`flex justify-center w-[75px] h-[75px] bg-[#97979726] mb-2 `}
                    >
                      <img
                        alt={"ExpireInven"}
                        src={ExpireInven}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-2xl font-semibold flex justify-end">
                        {inventoryInfoCard.expiredInventory}
                      </label>
                      <label className="text-lg font-medium text-slate-500">
                        kWh
                      </label>
                    </div>
                  </div>
                  <div className="w-60">
                    <div className="font-bold mt-2">Expire Inventory</div>
                  </div>
                  <div
                    className={`text-gray-500 text-right text-[0.8rem] font-medium mt-2`}
                  >
                    {inventoryInfoCard.expiredInventoryPercentage+"% of Total Inventory"}
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
                      className={`flex justify-center w-[75px] h-[75px] bg-[#4D6A0026] mb-2 `}
                    >
                      <img
                        alt={"RemainInven"}
                        src={RemainInven}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-2xl font-semibold flex justify-end">
                        {inventoryInfoCard.remainingInventory}
                      </label>
                      <label className="text-lg font-medium text-slate-500">
                        kWh
                      </label>
                    </div>
                  </div>

                  <div className="w-60">
                    <div className="font-bold mt-2">Remaining Inventory</div>
                  </div>

                  <div
                    className={`text-gray-500 text-right text-[0.8rem] font-medium mt-2`}
                  >
                    {inventoryInfoCard.remainingInventoryPercentage+"% of Total Inventory"}
                  </div>
                </div>
              </Card>
            </div>

            {/*Chart Card */}
            <div className="mt-2">
              <Card
                shadow="md"
                radius="md"
                className="flex w-full h-full"
                padding="lg"
              >
                <div className="w-full grid grid-col-2">
                  {tempChart && (
                    <div className="col-span-2">
                      <>
                        {/* custom legend */}
                        <div className="flex flex-col items-center justify-center mt-3 mb-3">
                          <Stack gap={2} alignItems={"center"}>
                            <div className="flex gap-5">
                              {customLegendLine.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className={
                                      item.style == null
                                        ? "w-3 h-3 rounded"
                                        : "w-3 h-3"
                                    }
                                    style={{
                                      backgroundColor: `${
                                        item.name === "Total Inventory"
                                          ? fileterUGT === 0
                                            ? "#3CA12D33"
                                            : fileterUGT === 1
                                            ? "#70B2FF"
                                            : "#FA6B6E"
                                          : item.color
                                      }`,
                                    }}
                                  />
                                  <div className="text-xs">{item.name}</div>
                                </div>
                              ))}
                            </div>
                          </Stack>
                        </div>
                        <ResponsiveContainer width={"95%"} height={300}>
                          <ComposedChart
                            key={overviewDataUnit}
                            data={tempChart}
                            margin={{
                              top: 5,
                              right: 0,
                              left: 0,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis
                              dataKey="period"
                              scale="auto"
                              tick={{ fontSize: 12 }}
                              tickFormatter={(tick) => {
                                const [month, year] = tick.split("/");
                                return MONTH_LIST[month - 1].abbr;
                              }}
                            />
                            <YAxis
                              width={80}
                              label={{
                                fontSize: 11,
                                value: overviewDataUnit,
                                angle: -90,
                                position: "insideLeft",
                              }}
                              tick={{ fontSize: 11 }}
                              tickFormatter={(tick) => {
                                return numeral(tick).format("0,0.[00000000]");
                              }}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            <Bar
                              dataKey="totalInventory"
                              stackId="a"
                              barSize={25}
                              fill={
                                fileterUGT === 0
                                  ? "#3CA12D33"
                                  : fileterUGT === 1
                                  ? "#70B2FF"
                                  : "#FA6B6E"
                              }
                            />
                            <Bar
                              dataKey="expiredInventory"
                              stackId="a"
                              barSize={25}
                              fill="#979797"
                            />
                            <Bar
                              dataKey="inventoryUsage"
                              stackId="a"
                              barSize={25}
                              fill="#F7A042"
                            />
                            <Line
                              type="monotone"
                              dataKey="remainingInventory"
                              stroke="#4D6A00"
                              strokeWidth={3}
                            />
                            <Brush
                              dataKey="period"
                              height={30}
                              stroke="#8884d8"
                              onChange={(range) => {
                                if (
                                  range &&
                                  range.startIndex !== undefined &&
                                  range.endIndex !== undefined
                                ) {
                                  setZoomDomain([
                                    range.startIndex,
                                    range.endIndex,
                                  ]);
                                }
                              }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Table Card */}
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
                        {inventoryList?.length}{" "}
                        {inventoryList?.length > 1 ? "Portfolios" : "Portfolio"}
                      </label>
                    </span>
                  </div>

                  <div className="grid col-span-4 grid-cols-12">
                    <form className="grid col-span-12 grid-cols-12 gap-2 ">
                      {/* <div className="col-span-3 px-2"></div> */}
                      {/* {!isPortManager && <div className="col-span-4"></div>} */}
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
                              onChange={handleAssignedSearchChange}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>

                <DataTable
                  data={inventoryList}
                  columns={columnsAssigned}
                  searchData={serchQuery}
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

export default InventoryList;

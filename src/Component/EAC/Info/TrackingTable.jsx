"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CloseButton, Input, Card } from "@mantine/core";

import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Theme
import classNames from "classnames";

import { Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import numeral from "numeral";
// const customParseFormat = require("dayjs/plugin/customParseFormat");
import {
  MONTH_LIST,
  MONTH_LIST_WITH_KEY,
  STATUS_COLOR,
  USER_GROUP_ID,
} from "../../../Constants/Constants";
import DataTable from "../../Control/Table/DataTableSimple";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  EAC_DASHBOARD_LIST_URL,
  EAC_DASHBOARD_MONTH_LIST_URL,
  EAC_DASHBOARD_YEAR_LIST_URL,
} from "../../../Constants/ServiceURL";
import { getHeaderConfig } from "../../../Utils/FuncUtils";
import { setSelectedMonth, setSelectedYear } from "../../../Redux/Menu/Action";
import StatusLabel from "../../Control/StatusLabel";
import Highlighter from "react-highlight-words";
import {
  convertStatus,
  formatToFullMonthYear,
  formatToNumberWithDecimalPlaces,
} from "../../../Utils/Utils";
import StatusLabelLink from "./StatusLabelLink";

dayjs.extend(customParseFormat);

const yearObject = [{ name: "2024" }];
// const monthObject = MONTH_LIST;
const monthObject = MONTH_LIST_WITH_KEY;
const monthArray = MONTH_LIST;

export default function TrackingTable() {
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const trackingYear = useSelector((state) => state.menu?.selectedYear);
  const trackingMonth = useSelector((state) => state.menu?.selectedMonth);
  const userData = useSelector((state) => state.login.userobj);

  const dispatch = useDispatch();

  const [portData, setPortData] = useState([]);
  const [value, setValue] = useState("");

  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);
  // const [trackingYear, setTrackingYear] = useState(2024);
  // const [trackingMonth, setTrackingMonth] = useState();

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      getPortData();
    }
  }, [currentUGTGroup, trackingYear, trackingMonth]);

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) getYearList();
  }, [currentUGTGroup]);

  useEffect(() => {
    if (trackingYear && currentUGTGroup?.id !== undefined) getMonthList();
  }, [currentUGTGroup, trackingYear]);

  async function getYearList() {
    try {
      const params = {
        ugtGroupId: currentUGTGroup?.id,
      };
      const res = await axios.get(`${EAC_DASHBOARD_YEAR_LIST_URL}`, {
        ...getHeaderConfig(),
        params: params,
      });
      if (res?.status == 200) {
        setYearList(res.data.yearList);
        // setYearMonthList(res.data);
      }
    } catch (error) {
      // setPortData(mockPortData);
      // setFilterPortData(mockPortData);
    }
  }

  async function getMonthList() {
    try {
      const params = {
        ugtGroupId: currentUGTGroup?.id,
        year: trackingYear,
      };
      const res = await axios.get(`${EAC_DASHBOARD_MONTH_LIST_URL}`, {
        ...getHeaderConfig(),
        params: params,
      });
      if (res?.status == 200) {
        if (res.data.monthList?.length > 0) {
          // วนข้อมูลใน response
          let tempMonthList = [];

          for (const month of res.data.monthList) {
            tempMonthList.push(monthObject[month]);
          }
          setMonthList(tempMonthList);

          const alreadyHasMonth = tempMonthList.find(
            (item) => item.month === trackingMonth
          );
          // setTrackingMonth(tempMonthList[0].month);
          if (!alreadyHasMonth)
            dispatch(
              setSelectedMonth(tempMonthList[tempMonthList.length - 1].month)
            );
        } else {
          // if no month data, reset month list and selected month
          setMonthList([]);
          dispatch(setSelectedMonth(null));
        }
      }
    } catch (error) {
      // setPortData(mockPortData);
      // setFilterPortData(mockPortData);
    }
  }

  async function getPortData() {
    try {
      let utilityGroupId = 0;
      if (userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG) {
        utilityGroupId = 1;
      } else if (userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG) {
        utilityGroupId = 2;
      } else if (userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG) {
        utilityGroupId = 3;
      }
      const params = {
        ugtGroupId: currentUGTGroup?.id,
        year: trackingYear,
        month: trackingMonth,
        utilityId: utilityGroupId
      };

      const res = await axios.get(EAC_DASHBOARD_LIST_URL, {
        ...getHeaderConfig(),
        params: params,
      });
      if (res?.status == 200) {
        for (const item of res.data) {
          item.issuanceStatus = convertStatus(item.issuanceStatus, "issue");
          item.transferStatus = convertStatus(item.transferStatus, "transfer");
          item.redemptionStatus = convertStatus(
            item.redemptionStatus,
            "redemption"
          );
          item.currentSettlement = formatToFullMonthYear(
            item.currentSettlement
          );
        }
        console.log(res.data);
        setPortData(res.data);
        setPortfolio(res.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleSearchChange = (searchValue) => {
    setValue(searchValue);
    const filterArray = portData.filter((obj) => {
      for (let key in obj) {
        if (key == "id") continue;
        if (key == "issuanceStatus") {
          let objectData = "";
          if (String(obj[key]).toLowerCase() === "pending" || obj[key] == null)
            objectData = "pending";
          else if (String(obj[key]).toLowerCase() === "in progress")
            objectData = "in progress";
          else if (String(obj[key]).toLowerCase() === "issued")
            objectData = "issued";
          else if (String(obj[key]).toLowerCase() === "rejected")
            objectData = "rejected";

          if (objectData.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
          }
        }
        if (key == "transferStatus") {
          let objectData = "";
          if (
            String(obj[key]).toLowerCase() === "unavailable" ||
            obj[key] == null ||
            obj[key] == ""
          )
            objectData = "unavailable";
          else if (String(obj[key]).toLowerCase() === "pending")
            objectData = "pending";
          else if (String(obj[key]).toLowerCase() === "completed")
            objectData = "completed";

          if (objectData.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
          }
        }
        if (key == "redemptionStatus") {
          let objectData = "";
          if (
            String(obj[key]).toLowerCase() === "unavailable" ||
            obj[key] == null ||
            obj[key] == ""
          )
            objectData = "unavailable";
          else if (String(obj[key]).toLowerCase() === "pending")
            objectData = "pending";
          else if (String(obj[key]).toLowerCase() === "completed")
            objectData = "completed";

          if (objectData.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
          }
        }
        if (key == "totalGeneration") {
          if (
            numeral(obj[key])
              .format("0,0.00")
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            numeral(obj[key]).format("0.00").includes(searchValue.toLowerCase())
          ) {
            return true;
          }
        }
        if (
          String(obj[key]).toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });

    setPortfolio(filterArray);
  };

  const handleChangeTrackingYear = (year) => {
    // setTrackingYear(year);
    dispatch(setSelectedYear(year));
  };

  const handleChangeTrackingMonth = (month) => {
    // setTrackingMonth(month);
    dispatch(setSelectedMonth(month));
  };

  const CenterHeaderComponent = (column) => {
    console.log("column", column);
    return (
      <div className="text-center">
        <span className="text-center">{column.displayName}</span>
      </div>
    );
  };
  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnPort = [
    {
      id: "portfolioName",
      label: "Portfolio Name",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[value]}
          autoEscape={true}
          textToHighlight={row.portfolioName}
        />
      ),
      //  <span>{row.portfolioName}</span>,
    },
    {
      id: "totalGeneration",
      label: "Total Generation (kWh)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[value]}
          /*    sanitize={(data) => {
            console.log("data", data);
            // remove comma from the number
            if (data.includes) return data.replace(/,/g, "");
            else return data;
          }} */
          autoEscape={true}
          textToHighlight={numeral(row.totalGeneration).format("0,0.000")}
        />
        // <span>{numeral(row.totalGeneration).format("0,0.00")}</span>
      ),
    },
    {
      id: "matchedGeneration",
      label: "Actual Generation Matched (kWh)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[value]}
          autoEscape={true}
          textToHighlight={numeral(row.actualGenerationMatched).format(
            "0,0.000"
          )}
        />
      ),
    },
    {
      id: "mechanism",
      label: "Inventory Matched (kWh)",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[value]}
          autoEscape={true}
          textToHighlight={numeral(row.inventoryMatched).format("0,0.000")}
        />
      ),
      // <span>{row.mechanism}</span>,
    },

    {
      id: "issuanceStatus",
      label: "Issuance Status",
      align: "center",
      render: (row) => (
        <StatusLabelLink
          status={row.issuanceStatus}
          searchQuery={value}
          yearSettlement={Number(dayjs(row.currentSettlement).format("YYYY"))}
          id={row.id}
          portName={row.portfolioName}
          count={row.issuanceCount}
          destination={"issue"}
        />
      ),
    },
    {
      id: "transferStatus",
      label: "Transfer Status",
      align: "center",
      render: (row) => (
        <StatusLabelLink
          status={row.transferStatus == "" ? "Unavailable" : row.transferStatus}
          searchQuery={value}
          id={row.id}
          portName={row.portfolioName}
          count={row.transferCount}
          yearSettlement={Number(dayjs(row.currentSettlement).format("YYYY"))}
          destination={"tranfer"}
          currentPeriod={row.currentSettlement}
        />
      ),
    },
    {
      id: "redemptionStatus",
      label: "Redemption Status",
      align: "center",
      render: (row) => (
        <StatusLabelLink
          status={
            row.redemptionStatus == "" ? "Unavailable" : row.redemptionStatus
          }
          searchQuery={value}
          yearSettlement={Number(dayjs(row.currentSettlement).format("YYYY"))}
          id={row.id}
          portName={row.portfolioName}
          count={row.redemptionCount}
          destination={"redemption"}
          currentPeriod={row.currentSettlement}
        />
      ),
    },
  ];

  // const [colDefs, setColDefs] = useState([
  //   { field: "portfolioName" },
  //   {
  //     field: "currentSettlement",
  //     type: "leftAligned",
  //     cellRenderer: (params) => {
  //       return <>{dayjs(params.value, "YYYY-MM").format("MMMM YYYY")}</>;
  //     },
  //   },
  //   {
  //     field: "totalGeneration",
  //     type: "rightAligned",
  //     cellRenderer: (params) => {
  //       return <>{numeral(params.value).format("0,0.[000]")}</>;
  //     },
  //   },
  //   { field: "mechanism" },

  //   { field: "issuanceStatus", cellRenderer: StatusIcon },
  //   { field: "transferStatus", cellRenderer: StatusIcon },
  //   { field: "redemptionStatus", cellRenderer: StatusIcon },
  // ]);

  const [portfolio, setPortfolio] = useState(portData);
  console.log(portfolio);
  return (
    <Card shadow="md" radius="lg" className="flex" padding="xl">
      <div className="flex justify-between">
        <div className="flex flex-col text-left">
          <span className="font-bold text-lg">EAC Tracking</span>
          <span className="font-sm font-normal text-sm text-BREAD_CRUMB pt-1">
            {portData?.length > 1
              ? `${portData?.length} Portfolios`
              : `${portData?.length} Portfolio`}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search"
            value={value}
            onChange={(event) => handleSearchChange(event.target.value)}
            rightSectionPointerEvents="all"
            leftSection={<MagnifyingGlassIcon className="w-4 h-4" />}
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => handleSearchChange("")}
                style={{ display: value ? undefined : "none" }}
              />
            }
          />
          {/*    <Form.Item className="mb-0">
            <Select
              size="large"
              defaultValue={trackingYear}
              style={{ width: 140 }}
              onChange={(value) => handleChangeTrackingYear(value)}
              showSearch
            >
              {yearList?.map((item, index) => (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
        </div>
      </div>
      <div className="mt-4">
        <DataTable data={portfolio} columns={columnPort} />
      </div>
    </Card>
  );
}

import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import TrackingTable from "./TrackingTable";
import axios from "axios";
import {
  EAC_DASHBOARD_CARD_URL,
  EAC_DASHBOARD_LIST_URL,
  EAC_DASHBOARD_YEAR_LIST_URL,
} from "../../../Constants/ServiceURL";
import { getHeaderConfig } from "../../../Utils/FuncUtils";
import { Form, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedYear } from "../../../Redux/Menu/Action";
import { convertStatus, hideLoading, showLoading } from "../../../Utils/Utils";

const mockData = [
  {
    title: "Total Portfolios",
    description: "Keep track of all your portfolio",
    value: 7,
    unit: "Portfolios",
    color: "#87BE33",
  },
  {
    title: "Total Issued REC",
    description: "Monitor your issued RECS at a glance",
    value: 4569.2,
    unit: "RECs",
    color: "#33BFBF",
  },
  {
    title: "Remaining Energy Attribute",
    description: "Monitor your inventory at a glance",
    value: 1314.6,
    unit: "MWh",
    color: "#F7A042",
    detail: [
      {
        deviceName: "UGT1-Portfolio 1",
        remainingEnergyAttribute: 1000,
        periodOfProduction: "2024-01",
      },
      {
        deviceName: "UGT1-Portfolio 2",
        remainingEnergyAttribute: 300,
        periodOfProduction: "2024-01",
      },
      {
        deviceName: "UGT1-Portfolio 3",
        remainingEnergyAttribute: 165.4,
        periodOfProduction: "2024-01",
      },
    ],
  },
];

const mockPortData = [
  {
    id: 1,
    portfolioName: "UGT1-Portfolio 1",
    totalGeneration: 2100000,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    issuanceStatus: "issued",
    transferStatus: "completed",
    redemptionStatus: "completed",
  },
  {
    id: 2,
    portfolioName: "UGT1-Portfolio 2",
    totalGeneration: 1390000,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    issuanceStatus: "issued",
    transferStatus: "unavailable",
    redemptionStatus: "unavailable",
  },
  {
    id: 3,
    portfolioName: "UGT1-Portfolio 3",
    totalGeneration: 1500000,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    issuanceStatus: "in progress",
    transferStatus: "unavailable",
    redemptionStatus: "unavailable",
  },
  {
    id: 4,
    portfolioName: "UGT1-Portfolio 4",
    totalGeneration: 4700000,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    issuanceStatus: "issued",
    transferStatus: "unavailable",
    redemptionStatus: "unavailable",
  },
  {
    id: 5,
    portfolioName: "UGT1-Portfolio 5",
    totalGeneration: 3100000,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    issuanceStatus: "pending",
    transferStatus: "unavailable",
    redemptionStatus: "unavailable",
  },
  {
    id: 6,
    portfolioName: "UGT1-Portfolio 6",
    totalGeneration: 2500000,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    issuanceStatus: "issued",
    transferStatus: "pending",
    redemptionStatus: "unavailable",
  },
  {
    id: 7,
    portfolioName: "UGT1-Portfolio 7",
    totalGeneration: 4000000,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    issuanceStatus: "issued",
    transferStatus: "completed",
    redemptionStatus: "completed",
  },
];

const yearObject = [{ name: "2024" }];
export default function Overview() {
  // const dispatch = useDispatch();

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const trackingYear = useSelector((state) => state.menu?.selectedYear);

  const dispatch = useDispatch();

  const [summaryData, setSummaryData] = useState([]);
  const [portData, setPortData] = useState([]);

  const [yearList, setYearList] = useState([]);

  const handleChangeTrackingYear = (year) => {
    // setTrackingYear(year);
    dispatch(setSelectedYear(year));
  };

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      getYearList();
      getSummaryData();
    }
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

  async function getSummaryData() {
    try {
      showLoading();
      const params = {
        ugtGroupId: currentUGTGroup.id,
        currentYear: trackingYear,
      };
      const res = await axios.get(EAC_DASHBOARD_CARD_URL, {
        ...getHeaderConfig(),
        params: params,
      });
      if (res?.status == 200) {
        const _data = res.data.map((item) => {
          if (item.title == "Total Portfolios") {
            return {
              ...item,
              unit: item.value > 1 ? "Portfolios" : "Portfolio",
            };
          } else {
            return { ...item };
          }
        });
        setSummaryData(_data);
        hideLoading();
      }
    } catch (error) {
      // setSummaryData(mockData);
      console.log("error", error);
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between  items-center">
        <div className="text-left flex flex-col">
          <h2 className="font-bold text-xl text-black">EAC Tracking Info</h2>
          <p className={`text-BREAD_CRUMB text-sm mb-3 font-normal`}>
            {currentUGTGroup?.name} / EAC Tracking Management / EAC Tracking
            Info
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="col-span-2 text-sm font-bold">Settlement Year</div>

          <Form.Item className="mb-0">
            <Select
              key={trackingYear}
              size="large"
              defaultValue={trackingYear}
              style={{ width: 140 }}
              onChange={(value) => handleChangeTrackingYear(value)}
              showSearch
            >
              {yearList.map((item, index) => (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
      <SummaryCard data={summaryData} />
      <TrackingTable key={trackingYear} />
    </div>
  );
}

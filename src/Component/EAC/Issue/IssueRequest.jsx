import React, { useEffect, useState } from "react";
import PortfolioTable from "./PortfolioTable";
import axios from "axios";
import dayjs from "dayjs";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CloseButton, Input, Card } from "@mantine/core";
import { Form, Select } from "antd";
import {
  EAC_ISSUE_REQUEST_LIST_URL,
  EAC_DASHBOARD_MONTH_LIST_URL,
  EAC_DASHBOARD_YEAR_LIST_URL,
} from "../../../Constants/ServiceURL";
import { getHeaderConfig } from "../../../Utils/FuncUtils";
import { useDispatch, useSelector } from "react-redux";
import { MONTH_LIST, MONTH_LIST_WITH_KEY } from "../../../Constants/Constants";
import { setSelectedMonth, setSelectedYear } from "../../../Redux/Menu/Action";
import {
  convertStatus,
  formatToFullMonthYear,
  hideLoading,
  showLoading,
} from "../../../Utils/Utils";

const mockPortData = [
  {
    id: 1,
    portfolioName: "UGT1-Portfolio 1",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    status: "pending",
  },
  {
    id: 2,
    portfolioName: "UGT1-Portfolio 2",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    status: "pending",
  },
  {
    id: 3,
    portfolioName: "UGT1-Portfolio 3",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    status: "pending",
  },
  {
    id: 4,
    portfolioName: "UGT1-Portfolio 4",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    status: "pending",
  },
  {
    id: 5,
    portfolioName: "UGT1-Portfolio 5",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    status: "issued",
  },
  {
    id: 6,
    portfolioName: "UGT1-Portfolio 6",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    status: "pending",
  },
  {
    id: 7,
    portfolioName: "UGT1-Portfolio 7",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-01",
    status: "in progress",
  },
];

const yearObject = [{ name: "2024" }];

const monthObject = MONTH_LIST_WITH_KEY;
const monthArray = MONTH_LIST;

export default function IssueRequest() {
  const [value, setValue] = useState("");
  const [portData, setPortData] = useState([]);
  const [filterPortData, setFilterPortData] = useState([]);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const trackingYear = useSelector((state) => state.menu?.selectedYear);
  const trackingMonth = useSelector((state) => state.menu?.selectedMonth);

  const dispatch = useDispatch();
  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);
  // const [trackingYear, setTrackingYear] = useState(2024);
  // const [trackingMonth, setTrackingMonth] = useState();

  const handleSearchChange = (searchValue) => {
    setValue(searchValue);
    const filterArray = portData.filter((obj) => {
      for (let key in obj) {
        if (key == "id") continue;
        if (key == "status") {
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
        } else {
          if (
            String(obj[key]).toLowerCase().includes(searchValue.toLowerCase())
          ) {
            return true;
          }
        }
      }
      return false;
    });

    setFilterPortData(filterArray);
  };

  const handleChangeTrackingYear = (year) => {
    // setTrackingYear(year);
    dispatch(setSelectedYear(year));

    // reset month list and selected month
    dispatch(setSelectedMonth(null));
  };

  const handleChangeTrackingMonth = (month) => {
    // setTrackingMonth(month);
    dispatch(setSelectedMonth(month));
  };

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined && trackingMonth !== undefined)
      getPortData();
  }, [currentUGTGroup, trackingMonth, trackingYear]);

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
          // set month list สำหรับ dropdown ว่าสามารถเลือกเดือนอะไรได้บ้าง
          setMonthList(tempMonthList);

          // ตรวจสอบว่า selected month ที่เลือกอยู่ มีอยู่ใน month list หรือไม่
          const alreadyHasMonth = tempMonthList.find(
            (item) => item.month === trackingMonth
          );

          // ถ้าไม่มีให้เลือกเดือนล่าสุดใน month list
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
      console.log("error", error);
    }
  }
  async function getPortData() {
    try {
      showLoading();
      const params = {
        ugtGroupId: currentUGTGroup?.id,
        year: trackingYear,
        month: trackingMonth,
      };
      const res = await axios.get(`${EAC_ISSUE_REQUEST_LIST_URL}`, {
        ...getHeaderConfig(),
        params: params,
      });
      if (res?.status == 200) {
        for (const item of res.data) {
          item.status = convertStatus(item.status, "issue");
          item.currentSettlement = formatToFullMonthYear(
            item.currentSettlement
          );
        }
        setPortData(res.data);
        setFilterPortData(res.data);
      }
    } catch (error) {
      // setPortData(mockPortData);
      // setFilterPortData(mockPortData);
    } finally {
      hideLoading();
    }
  }

  return (
    <Card shadow="md" radius="lg" className="flex" padding="xl">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-lg">Portfolio</span>
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
          <Form.Item className="mb-0">
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
          </Form.Item>

          {trackingMonth !== undefined && (
            <>
              <Form.Item className="mb-0">
                <Select
                  size="large"
                  value={trackingMonth}
                  defaultValue={trackingMonth}
                  onChange={(value) => handleChangeTrackingMonth(value)}
                  style={{ width: 140 }}
                  showSearch
                  filterOption={(input, option) =>
                    (option.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {monthArray?.map((item, index) => {
                    return (
                      <Select.Option
                        key={index}
                        value={item.month}
                        disabled={
                          !monthList.some((obj) => obj.month == item.month)
                        }
                      >
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </>
          )}
        </div>
      </div>
      <PortfolioTable portData={filterPortData} searchValue={value} />
    </Card>
  );
}

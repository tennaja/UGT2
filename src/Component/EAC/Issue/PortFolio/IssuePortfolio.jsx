import React, { useState, useEffect, useLayoutEffect } from "react";
import DeviceTable from "./DeviceTable";
import AlmostDone from "../../../assets/done.png";
import { useDispatch, useSelector } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Card, CloseButton, Input, Modal } from "@mantine/core";
import { Form, Select } from "antd";
import {
  EAC_ISSUE_DEVICE_LIST_BY_PORT_URL,
  // EAC_DASHBOARD_MONTH_LIST_URL,
  // EAC_DASHBOARD_YEAR_LIST_URL,
  EAC_ISSUE_REQUEST_YEAR_MONTH_LIST_URL,
  EAC_ISSUE_SYNC_ISSUE_ITEM,
  EAC_ISSUE_SYNC_ISSUE_STATUS,
  EAC_ISSUE_REQUEST_LAST_UPDATE_SYNC_STATUS
} from "../../../../Constants/ServiceURL";
import { getHeaderConfig } from "../../../../Utils/FuncUtils";
import axios from "axios";
import dayjs from "dayjs";
import {
  MONTH_LIST,
  MONTH_LIST_WITH_KEY,
} from "../../../../Constants/Constants";
import {
  setSelectedMonth,
  setSelectedYear,
} from "../../../../Redux/Menu/Action";
import {
  convertStatus,
  hideLoading,
  showLoading,
} from "../../../../Utils/Utils";
import { useNavigate } from "react-router-dom";
import { EAC_ISSUE } from "../../../../Constants/WebURL";
import { FaChevronCircleLeft } from "react-icons/fa";
import numeral from "numeral";
import { useDisclosure } from "@mantine/hooks";
import ModalFail from "../../../Control/Modal/ModalFail";
import { IoMdSync } from "react-icons/io";

const mockMonthYear = [
  {
    year: 2023,
    month: 10,
  },
  {
    year: 2023,
    month: 11,
  },
  {
    year: 2023,
    month: 12,
  },
  {
    year: 2024,
    month: 3,
  },
  {
    year: 2024,
    month: 4,
  },
];
const mockDeviceData = [
  {
    id: 1,
    deviceName: "EGAT Kwae Noi Bumrung Dan Hydropower Plant",
    deviceCode: "HYDROE10106",
    fuelType: "Hydroelectric",
    assignedUtility: "EGAT",
    totalGeneration: 3000000,
    matchedGeneration: 1500000,
    status: "pending",
  },
  {
    id: 2,
    deviceName: "EGAT Bhumiphol Hydropower Plant",
    deviceCode: "HYDROE10107",
    fuelType: "Hydroelectric",
    assignedUtility: "EGAT",
    totalGeneration: 3000000,
    matchedGeneration: 1500000,
    status: "pending",
  },
  {
    id: 3,
    deviceName: "EGAT Chao Phraya Hydropower Plant",
    deviceCode: "HYDROE10108",
    fuelType: "Hydroelectric",
    assignedUtility: "EGAT",
    totalGeneration: 3000000,
    matchedGeneration: 1500000,
    status: "pending",
  },
  {
    id: 4,
    deviceName: "EGAT Naresuan Hydropower Plant",
    deviceCode: "HYDROE10109",
    fuelType: "Hydroelectric",
    assignedUtility: "EGAT",
    totalGeneration: 3000000,
    matchedGeneration: 1500000,
    status: "in progress",
  },
  {
    id: 4,
    deviceName: "EGAT Mae Klong Hydropower Plant",
    deviceCode: "HYDROE10110",
    fuelType: "Hydroelectric",
    assignedUtility: "EGAT",
    totalGeneration: 3000000,
    matchedGeneration: 1500000,
    status: "issued",
  },
];

const yearObject = [{ name: "2024" }];

const monthObject = MONTH_LIST_WITH_KEY;
const monthArray = MONTH_LIST;

export default function IssuePortfolio({ portfolioData }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const trackingYear = useSelector((state) => state.menu?.selectedYear);
  const selectedMonth = useSelector((state) => state.menu?.selectedMonth);

  // const [trackingYear, setTrackingYear] = useState();
  const [trackingMonth, setTrackingMonth] = useState();

  const [yearMonthList, setYearMonthList] = useState([]);

  const dispatch = useDispatch();

  const [device, setDevice] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);

  const [filterDevice, setFilterDevice] = useState([]);

  const [isSyncing, syncHandlers] = useDisclosure();
  const [showModalSyncSuccess, modalSyncSuccessHandlers] = useDisclosure();
  const [showModalSyncFail, modalSyncFailHandlers] = useDisclosure();
  const [lastedUpdate,setLastUpdate] = useState("DD/MM/YYYY 00:00")

  const handleSearchChange = (searchValue) => {
    setValue(searchValue);
    const filterArray = device.filter((obj) => {
      for (let key in obj) {
        if (key == "deviceId") continue;
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
        if (key == "matchedGeneration") {
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

    // console.log("filterArray", filterArray);
    setFilterDevice(filterArray);
  };

  const handleChangeTrackingYear = (year) => {
    // setTrackingYear(year);
    dispatch(setSelectedYear(year));

    // reset month list and selected month
    dispatch(setSelectedMonth(null));

    let yearIndex = yearMonthList.findIndex((item) => item.year == year);

    const monthList = yearMonthList[yearIndex]?.month;

    if (monthList === undefined) {
      setMonthList([]);
      setTrackingMonth(null);
    } else {
      setMonthList(monthList);

      console.log("monthList", monthList);
      let monthLength = monthList.length;
      if (monthLength > 0)
        setTrackingMonth(
          yearMonthList?.[yearIndex]?.month?.[monthLength - 1]?.month
        );
      else setTrackingMonth(yearMonthList?.[yearIndex]?.month?.[0]?.month);

      // setTrackingMonth(
      //   yearMonthList.find((item) => item.year === year)?.month[0]?.month
      // );
    }
  };

  const handleChangeTrackingMonth = (month) => {
    setTrackingMonth(month);
    dispatch(setSelectedMonth(month));
  };

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined && trackingMonth !== undefined)
      getDevice();
      getLastedUpdateSyncStatus()
  }, [currentUGTGroup, trackingMonth, trackingYear]);

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) getYearMonthList();
  }, [currentUGTGroup]);

  useEffect(() => {
    if (yearMonthList != undefined && yearMonthList.length > 0) {
      const tempYearList = yearMonthList.map((item) => item.year);

      setYearList(tempYearList);
      // setMonthList(yearMonthList?.[0]?.month);

      // setTrackingYear(yearMonthList?.[0]?.year);
      // dispatch(setSelectedYear(year));

      // find index of Year in yearMonthList
      let yearIndex = yearMonthList.findIndex(
        (item) => item.year == trackingYear
      );
      // ไม่เจอข้อมูล year month ให้เอาข้อมูลล่าสุด
      if (yearIndex == -1) {
        const lastItem = yearMonthList[yearMonthList.length - 1];

        const year = lastItem.year;
        const lastMonth = lastItem.month[lastItem.month.length - 1];

        dispatch(setSelectedYear(year));

        setMonthList(lastItem.month);
        setTrackingMonth(lastMonth.month);
        dispatch(setSelectedMonth(lastMonth.month));
      } else {
        setMonthList(
          yearMonthList.find((item) => item.year === trackingYear)?.month
        );
        // if yearMonthList has selectedMonth then set it as trackingMonth
        if (
          yearMonthList?.[yearIndex]?.month.some(
            (item) => item.month == selectedMonth
          )
        ) {
          setTrackingMonth(selectedMonth);
          dispatch(setSelectedMonth(selectedMonth));
        } else {
          let monthLength = yearMonthList?.[yearIndex]?.month.length;
          if (monthLength > 0)
            setTrackingMonth(
              yearMonthList?.[yearIndex]?.month?.[monthLength - 1]?.month
            );
          else setTrackingMonth(yearMonthList?.[yearIndex]?.month?.[0]?.month);
        }
      }
    }
  }, [yearMonthList]);

  async function getYearMonthList() {
    try {
      const params = {
        ugtGroupId: currentUGTGroup?.id,
        portfolioId: portfolioData?.id,
      };
      const res = await axios.get(`${EAC_ISSUE_REQUEST_YEAR_MONTH_LIST_URL}`, {
        ...getHeaderConfig(),
        params: params,
      });

      if (res?.status == 200) {
        const uniqueYear = [...new Set(res.data.map((item) => item.year))];

        const tempYearMonthList = uniqueYear.map((year) => {
          return {
            year: year,
            month: res.data
              .filter((item) => item.year === year)
              .map((item) => monthObject[item.month]),
          };
        });

        setYearMonthList(tempYearMonthList);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  // async function getYearList() {
  //   try {
  //     const params = {
  //       ugtGroupId: currentUGTGroup?.id,
  //     };
  //     const res = await axios.get(`${EAC_DASHBOARD_YEAR_LIST_URL}`, {
  //       ...getHeaderConfig(),
  //       params: params,
  //     });
  //     if (res?.status == 200) {
  //       setYearList(res.data.yearList);
  //       // setYearMonthList(res.data);
  //     }
  //   } catch (error) {
  //     // setPortData(mockPortData);
  //     // setFilterPortData(mockPortData);
  //   }
  // }

  // async function getMonthList() {
  //   try {
  //     const params = {
  //       ugtGroupId: currentUGTGroup?.id,
  //       year: trackingYear,
  //     };
  //     const res = await axios.get(`${EAC_DASHBOARD_MONTH_LIST_URL}`, {
  //       ...getHeaderConfig(),
  //       params: params,
  //     });
  //     if (res?.status == 200) {
  //       let tempMonthList = [];
  //       for (const month of res.data.monthList) {
  //         tempMonthList.push(monthObject[month]);
  //       }

  //       setMonthList(tempMonthList);
  //       const alreadyHasMonth = tempMonthList.find(
  //         (item) => item.month === trackingMonth
  //       );
  //       // setTrackingMonth(tempMonthList[0].month);
  //       if (!alreadyHasMonth)
  //         dispatch(setSelectedMonth(tempMonthList[0].month));
  //     }
  //   } catch (error) {
  //     // setPortData(mockPortData);
  //     // setFilterPortData(mockPortData);
  //   }
  // }

  async function getDevice() {
    try {
      showLoading();
      const res = await axios.get(`${EAC_ISSUE_DEVICE_LIST_BY_PORT_URL}`, {
        params: {
          ugtGroupId: currentUGTGroup?.id,
          portfolioId: portfolioData?.id,
          month: trackingMonth,
          year: trackingYear,
          pageNumber: 1,
          pageSize: 10,
        },
        ...getHeaderConfig(),
      });
      if (res?.status == 200) {
        for (const item of res.data) {
          item.status = convertStatus(item.status, "issue");
        }
        setDevice(res.data);
        setFilterDevice(res.data);
      }
    } catch (error) {
      console.log("error", error);
      setDevice(mockDeviceData);
      setFilterDevice(mockDeviceData);
    } finally {
      hideLoading();
    }
  }

  const syncIssue = async () => {
    try {
      showLoading();
      syncHandlers.open();

      const params = {
        year: trackingYear,
        month: trackingMonth,
        portfolioId: portfolioData?.id,
        UgtGroupId: currentUGTGroup?.id,
      };

      const [resultItem, resultStatus] = await Promise.all([
        syncIssueItem(params),
        syncIssueStatus(params),
      ]);

      if (
        (resultItem?.status == 200 || resultItem?.status == 404) &&
        resultStatus?.status == 200
      ) {
        getDevice();
        hideLoading();
        syncHandlers.close();
        modalSyncSuccessHandlers.open();
      } else {
        hideLoading();
        syncHandlers.close();
        modalSyncFailHandlers.open();
      }
    } catch (error) {
      hideLoading();
      syncHandlers.close();
      modalSyncFailHandlers.open();
    }
  };

  async function syncIssueItem(params) {
    const res = await axios.get(`${EAC_ISSUE_SYNC_ISSUE_ITEM}`, {
      params: params,
      ...getHeaderConfig(),
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    });
    return res;
  }
  async function syncIssueStatus(params) {
    const res = await axios.get(`${EAC_ISSUE_SYNC_ISSUE_STATUS}`, {
      params: params,
      ...getHeaderConfig(),
    });

    return res;
  }

  async function getLastedUpdateSyncStatus(){
    console.log("Get Last update")
    try{
      const URL = `${EAC_ISSUE_REQUEST_LAST_UPDATE_SYNC_STATUS}?portfolioId=${portfolioData?.id}&year=${trackingYear}&month=${trackingMonth}`
      console.log(URL)
      await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
        if(response.status == 200){
        console.log(response.data)
          setLastUpdate(response.data)
        }
    }, (error) => {
        console.log(error)
    });
    }
    catch(error){

    }
  }

  return (
    <Card shadow="md" radius="lg" className="flex" padding="xl">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <FaChevronCircleLeft
            className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
            size="30"
            onClick={() => navigate(EAC_ISSUE)}
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg">
              {portfolioData?.portfolioName}
            </span>
            <span className="font-sm font-normal text-sm text-BREAD_CRUMB pt-1">
              {device?.length > 1
                ? `${device?.length} Devices`
                : `${device?.length} Device`}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <Input
              radius={6}
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
                value={trackingYear}
                defaultValue={trackingYear}
                onChange={(value) => handleChangeTrackingYear(value)}
                style={{ width: 140 }}
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
                  {monthArray?.map((item, index) => (
                    <Select.Option
                      key={index}
                      value={item.month}
                      disabled={
                        !monthList.some((obj) => obj.month == item.month)
                      }
                    >
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {device.length > 0 && (
              <Button
                loading={isSyncing}
                className="  text-white  hover:bg-[#4D6A00] bg-[#87BE33]"
                onClick={() => syncIssue()}
              >
               <IoMdSync className="mr-1"/> Sync Status
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="text-right w-full text-xs text-[#848789]">
          <label className="font-normal">{"Last Uploaded in "}</label><label className="font-bold ml-1">{" "+lastedUpdate}</label>
        </div>
      {device.length > 0 ? (
        <DeviceTable
          deviceData={filterDevice}
          portfolioData={portfolioData}
          searchValue={value}
        />
      ) : (
        <DeviceTable
          deviceData={[]}
          portfolioData={portfolioData}
          searchValue={value}
        />
      )}

      <Modal
        opened={showModalSyncSuccess}
        onClose={modalSyncSuccessHandlers.close}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <div className="flex flex-col items-center justify-center px-10 pt-4 pb-3">
          <img
            className="w-32 object-cover rounded-full flex items-center justify-center"
            src={AlmostDone}
            alt="Current profile photo"
          />

          <div className="text-3xl font-bold text-center pt-2">
            Sync Status Success
          </div>
          <div className="flex gap-4">
            <Button
              className="text-white bg-PRIMARY_BUTTON mt-12 px-10"
              onClick={() => modalSyncSuccessHandlers.close()}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {showModalSyncFail && (
        <ModalFail onClickOk={modalSyncFailHandlers.close} />
      )}
    </Card>
  );
}

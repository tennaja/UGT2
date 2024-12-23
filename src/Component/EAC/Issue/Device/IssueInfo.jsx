"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Divider, LoadingOverlay, Table } from "@mantine/core";
import { Form, Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ItemIssue from "./ItemIssue";
import ItemInventory from "./ItemInventory";
import axios from "axios";

import {
  EAC_ISSUE_TRANSACTION_BY_DEVICE_URL,
  EAC_DASHBOARD_MONTH_LIST_URL,
  EAC_DASHBOARD_YEAR_LIST_URL,
  EAC_ISSUE_REQUEST_YEAR_MONTH_LIST_URL,
} from "../../../../Constants/ServiceURL";
import { EAC_ISSUE } from "../../../../Constants/WebURL";
import { getHeaderConfig } from "../../../../Utils/FuncUtils";
import {
  MONTH_LIST,
  MONTH_LIST_WITH_KEY,
} from "../../../../Constants/Constants";
import numeral from "numeral";
import {
  setSelectedMonth,
  setSelectedYear,
} from "../../../../Redux/Menu/Action";
import { set } from "lodash";
import Swal from "sweetalert2";
import { hideLoading, showLoading } from "../../../../Utils/Utils";
import { FaChevronCircleLeft } from "react-icons/fa";

dayjs.extend(customParseFormat);

const yearObject = [{ name: "2024" }];
const monthObject = MONTH_LIST_WITH_KEY;
const monthArray = MONTH_LIST;
export default function IssueInfo({ portfolioData, deviceData }) {
  // get path parameter from url
  const { portfolio, device } = useParams();

  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const trackingYear = useSelector((state) => state.menu?.selectedYear);
  const selectedMonth = useSelector((state) => state.menu?.selectedMonth);

  // const [trackingYear, setTrackingYear] = useState();
  const [trackingMonth, setTrackingMonth] = useState();

  const [yearMonthList, setYearMonthList] = useState([]);

  const dispatch = useDispatch();

  const [yearList, setYearList] = useState([]);
  const [monthList, setMonthList] = useState([]);

  const [totalInventory, setTotalInventory] = useState(0);
  const [issueTransactionData, setIssueTransactionData] = useState();
  console.log(issueTransactionData)

  const handleChangeTrackingYear = (year) => {
    // setTrackingYear(year);
    dispatch(setSelectedYear(year));
    // setMonthList(yearMonthList.find((item) => item.year === year)?.month);
    // setTrackingMonth(
    //   yearMonthList.find((item) => item.year === year)?.month[0]?.month
    // );

    let yearIndex = yearMonthList.findIndex((item) => item.year == year);

    const monthList = yearMonthList[yearIndex]?.month;
    setMonthList(monthList);

    let monthLength = monthList.length;
    if (monthLength > 0)
      setTrackingMonth(
        yearMonthList?.[yearIndex]?.month?.[monthLength - 1]?.month
      );
    else setTrackingMonth(yearMonthList?.[yearIndex]?.month?.[0]?.month);
  };

  const handleChangeTrackingMonth = (month) => {
    setTrackingMonth(month);
    dispatch(setSelectedMonth(month));
  };

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined && trackingMonth !== undefined)
      getIssueTransaction();
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

      // find index of Year in yearMonthList
      let yearIndex = yearMonthList.findIndex(
        (item) => item.year == trackingYear
      );
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

  async function getIssueTransaction() {
    try {
      showLoading();
      const res = await axios.get(`${EAC_ISSUE_TRANSACTION_BY_DEVICE_URL}`, {
        params: {
          ugtGroupId: currentUGTGroup?.id,
          portfolioId: portfolio,
          deviceId: device,
          month: trackingMonth,
          year: trackingYear,
        },
        ...getHeaderConfig(),
      });
      if (res?.status == 200) {
        setIssueTransactionData(res.data);
        const issueRequestDetailId =
          res.data?.issueRequestDetail?.issueRequestDetailId;
      }
    } catch (error) {
      // setIssueTransactionData(mockIssueTransactionData);
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    getTotalInventory();
  }, []);

  async function getTotalInventory() {
    let sum = 0;
    for (const item of issueTransactionData?.InventoryTransaction) {
      for (const detail of item.inventorySettlementDetail) {
        sum += detail.production;
      }
    }

    setTotalInventory(sum);
  }
  return (
    <div>
      <Card shadow="md" radius="lg" className="flex" padding="xl">
        <div className="flex  gap-3 items-center pb-4">
          <FaChevronCircleLeft
            className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
            size="30"
            onClick={() =>
              navigate(`${EAC_ISSUE}/${portfolioData?.id}`, {
                state: { portfolioData: portfolioData },
              })
            }
          />
          <div className="text-lg font-bold text-left">
            {portfolioData?.portfolioName}
          </div>
          {/*   <Button
            className="hover:bg-[#e2e2ac] bg-[#f5f4e9] text-[#4d6a00] px-8"
            onClick={() =>
              navigate(`${EAC_ISSUE}/${portfolioData?.id}`, {
                state: { portfolioData: portfolioData },
              })
            }
          >
            Back
          </Button> */}
        </div>

        <Divider orientation="horizontal" size={"xs"} />

        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold text-[#4D6A00]">
            {deviceData?.deviceName}
          </div>

          <Form layout="horizontal" size="large">
            <div className="grid grid-cols-6 gap-4 items-center">
              <div className="col-span-2 text-sm font-bold">
                Settlement Period
              </div>

              <Form.Item className="col-span-2 pt-4">
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

              {trackingMonth && (
                <Form.Item className="col-span-2 pt-4">
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
            </div>
          </Form>
        </div>
      </Card>

      {issueTransactionData && (
        <Card
          shadow="md"
          radius="lg"
          className="flex mt-3 text-left"
          padding="xl"
        >
          {/* Issue Transaction */}
          {issueTransactionData && (
            <ItemIssue
              issueTransactionData={issueTransactionData}
              issueRequest={issueTransactionData?.issueRequestDetail}
              getIssueTransaction={getIssueTransaction}
            />
          )}
          {issueTransactionData?.InventoryTransaction?.length > 0 && (
            <>
              <div className="flex bg-[#4D6A00] justify-center py-1 mt-3">
                <div className="text-xl font-bold  text-white text-center">
                  Inventory
                </div>
              </div>
              {issueTransactionData?.InventoryTransaction?.map(
                (item, index) => {
                  return (
                    <ItemInventory
                      key={index}
                      issueTransactionData={issueTransactionData}
                      inventoryTransaction={item}
                    />
                  );
                }
              )}
              <Table stickyHeader verticalSpacing="sm">
                <Table.Tfoot>
                  <Table.Tr className=" bg-[#F4F6F9]">
                    <Table.Th className="text-center w-48 ">
                      Total Inventory
                    </Table.Th>
                    <Table.Th className="text-center w-64 "></Table.Th>
                    <Table.Th className="text-center w-64 "></Table.Th>
                    <Table.Th className="text-right min-w-64 max-w-full">
                      {numeral(numeral(totalInventory).value()).format(
                        "0,0.000000"
                      )}
                    </Table.Th>
                    <Table.Th className="text-center w-32 "></Table.Th>
                    <Table.Th className="text-center w-32 "></Table.Th>
                    <Table.Th className="text-center w-32 "></Table.Th>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>
            </>
          )}
        </Card>
      )}
    </div>
  );
}

const mockIssueTransactionData = {
  deviceName: "EGAT Naresuan Hydropower Plant",
  deviceCode: "HYDROE10106",
  fuel: "ES300 Hydro-electric",
  assignedUtility: "EGAT",
  settlementPeriod: "2024-01", //yyyy-MM
  totalGeneration: "3,000,000.000", //ทศนิยม 3 ตน., หน่วย MWh
  matchedGeneration: "1,500,000.000", //ทศนิยม 3 ตน., หน่วย MWh
  issueRequest: {
    month: 1,
    year: 2024,
    issueRequestDetailId: 1,
    note: "Issue Test Doc 1",
    settlementDetail: [
      {
        tradeAccount: "UGT EGAT Trade",
        allocationAccount: "EGAT",
        production: 200.0, //ทศนิยม 6 ตน., หน่วย MWh
        startDate: "2024-01-01", //yyyy-MM-dd
        endDate: "2024-01-15", //yyyy-MM-dd
        status: "Pending",
      },
      {
        tradeAccount: "UGT EGAT Trade",
        allocationAccount: "MEA",
        production: 800.0, //ทศนิยม 6 ตน., หน่วย MWh
        startDate: "2024-01-01", //yyyy-MM-dd
        endDate: "2024-01-15", //yyyy-MM-dd
        status: "Pending",
      },
    ],
    fileUploaded: [
      {
        uid: "01HCHH0N1ACKKJ6C2874RGQ4P8", //evident
        fileName: "image1.jpg",
        fileSize: 78.2, //ทศนิยม 2 ตน., หน่วย MB
        mimeType: "pdf",
        createDate: "2024-01-15", //yyyy-MM-dd
        removeDate: null, //yyyy-MM-dd
      },
      {
        uid: "01HCHH0N1ACKKJ6C2874RGQ4P9", //evident
        fileName: "image2.jpg",
        fileSize: 78.2, //ทศนิยม 2 ตน., หน่วย MB
        mimeType: "pdf",
        createDate: "2024-01-14", //yyyy-MM-dd
        removeDate: "2024-01-15", //yyyy-MM-dd
      },
    ],
  },
  InventoryTransaction: [
    {
      month: 1,
      year: 2023,
      inventoryDetailId: 1,
      note: "Inventory Test Doc 1",
      inventorySettlementDetail: [
        {
          tradeAccount: "UGT EGAT Trade",
          allocationAccount: "EGAT",
          production: 50.0, //ทศนิยม 6 ตน., หน่วย MWh
          startDate: "2023-07-10", //yyyy-MM-dd
          endDate: "2023-07-15", //yyyy-MM-dd
          status: "Pending",
        },
        {
          tradeAccount: "UGT EGAT Trade",
          allocationAccount: "MEA",
          production: 200.0, //ทศนิยม 6 ตน., หน่วย MWh
          startDate: "2023-07-10", //yyyy-MM-dd
          endDate: "2023-07-15", //yyyy-MM-dd
          status: "Pending",
        },
        {
          tradeAccount: "UGT EGAT Trade",
          allocationAccount: "PEA",
          production: 200.0, //ทศนิยม 6 ตน., หน่วย MWh
          startDate: "2023-07-10", //yyyy-MM-dd
          endDate: "2023-07-15", //yyyy-MM-dd
          status: "Pending",
        },
      ],
      fileUploaded: [
        {
          deviceId: 1,
          month: 1,
          year: 2024,
          uid: "01HCHH0N1ACKKJ6C2874RGQ4P8", //evident
          fileName: "image1.jpg",
          fileSize: 78.2, //ทศนิยม 2 ตน., หน่วย MB
          mimeType: "pdf",
          createDate: "2024-01-15", //yyyy-MM-dd
          removeDate: null, //yyyy-MM-dd
        },
      ],
    },
    {
      month: 12,
      year: 2023,
      inventoryDetailId: 1,
      note: "Inventory",
      inventorySettlementDetail: [
        {
          tradeAccount: "UGT EGAT Trade",
          allocationAccount: "EGAT",
          production: 50.0, //ทศนิยม 6 ตน., หน่วย MWh
          startDate: "2023-07-10", //yyyy-MM-dd
          endDate: "2023-07-15", //yyyy-MM-dd
          status: "Pending",
        },
      ],
      fileUploaded: [],
    },
  ],
};

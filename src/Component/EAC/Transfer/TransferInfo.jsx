"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransferReqPortfolioYearList,
  getTransferReqPortfolioMonthList,
  getTransferRequesInfo,
} from "../../../Redux/EAC/Transfer/Action";
import { Button, Card, Divider } from "@mantine/core";
import { Form, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import ItemTransfer from "./ItemTransfer";
import { MONTH_LIST } from "../../../Constants/Constants";
import { FaChevronCircleLeft } from "react-icons/fa";
import noContent from "../../assets/no-content.png";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export default function TransferInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const yearListData = useSelector(
    (state) => state.transfer.transferReqPortYearList
  );
  const monthListData = useSelector(
    (state) => state.transfer.transferReqPortMonthList
  );
  const transferDataInfo = useSelector(
    (state) => state.transfer.transferRequestInfo
  );

  const { portfolioID, portfolioName, period } = location.state;
  // console.log(portfolioID, portfolioName, period);

  // const period_arr = period.split("-");
  // const period_year = Number(period_arr[0]);
  // const period_month = Number(period_arr[1]);

  const period_year = Number(dayjs(period).format("YYYY"));
  const period_month = Number(dayjs(period).format("M"));
  const [trackingYear, setTrackingYear] = useState(period_year);
  const [trackingMonth, setTrackingMonth] = useState(period_month);
  const [transferData, setTransferData] = useState([]);

  // get year list
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      dispatch(
        getTransferReqPortfolioYearList(currentUGTGroup?.id, portfolioID)
      );
    }
  }, [currentUGTGroup]);

  // get month list
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      dispatch(
        getTransferReqPortfolioMonthList(
          currentUGTGroup?.id,
          portfolioID,
          trackingYear
        )
      );
    }
  }, [currentUGTGroup, trackingYear]);

  // set default year dropdown with latest month
  useEffect(() => {
    if (monthListData?.monthList?.length > 0 && trackingMonth == null) {
      const monthList = monthListData.monthList;
      const latest_month = monthList.slice(-1)[0];
      setTrackingMonth(latest_month);
    }
  }, [monthListData]);

  // get Info
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      dispatch(
        getTransferRequesInfo(
          currentUGTGroup?.id,
          portfolioID,
          trackingYear,
          trackingMonth
        )
      );
    }
  }, [currentUGTGroup, trackingYear]);

  // get Info ทำอีกอันไว้เพราะ จะให้ขึ้น loading ตอนเปลี่ยน month
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      Swal.fire({
        title: "Please Wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      dispatch(
        getTransferRequesInfo(
          currentUGTGroup?.id,
          portfolioID,
          trackingYear,
          trackingMonth
        )
      );
    }
  }, [currentUGTGroup, trackingMonth]);

  useEffect(() => {
    if (transferDataInfo?.length > 0) {
      // Reformat status 'draft'
      const formattedData = transferDataInfo?.map((item) => {
        return {
          ...item,
          status:
            item?.status?.toLowerCase() == "draft" ? "pending" : item?.status,
        };
      });

      // ถ้าเป็น null ทุกการ ให้แสดง unavailable
      let count_null_status = 0;
      formattedData.map((item) => {
        if (item.status == null || item.status == "") {
          count_null_status = count_null_status + 1;
        }
      });

      const has_status_null = count_null_status == formattedData.length;

      // console.log("formattedData", formattedData);
      setTransferData(!has_status_null ? formattedData : []);
    } else {
      setTransferData([]);
    }
  }, [transferDataInfo]);

  const handleChangeTrackingYear = (year) => {
    setTrackingYear(year);
    setTrackingMonth(null);
  };

  const handleChangeTrackingMonth = (month) => {
    setTrackingMonth(month);
  };

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">REC Transfer</h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / EAC Tracking Management / REC Transfer
                / {portfolioName}
              </p>
            </div>

            <Card shadow="md" radius="lg" className="flex" padding="xl">
              <div className="flex  gap-3 items-center pb-4">
                <FaChevronCircleLeft
                  className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                  size="30"
                  onClick={() =>
                    navigate("/eac/transfer", {
                      state: {
                        selectedYear: period_year,
                        selectedMonth: period_month,
                      },
                    })
                  }
                />
                <div className="text-lg font-bold text-left">
                  {portfolioName}
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />

              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-[#4D6A00]">
                  Transfer
                </div>

                <Form layout="horizontal" size="large">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2 text-sm font-bold">
                      Settlement Period
                    </div>

                    <Form.Item className="col-span-2 pt-4">
                      <Select
                        size="large"
                        defaultValue={trackingYear}
                        onChange={(value) => handleChangeTrackingYear(value)}
                        style={{ width: 140 }}
                        showSearch
                      >
                        {yearListData?.yearList?.map((item, index) => (
                          <Select.Option key={index} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item className="col-span-2 pt-4">
                      <Select
                        size="large"
                        value={trackingMonth}
                        onChange={(value) => handleChangeTrackingMonth(value)}
                        style={{ width: 140 }}
                        showSearch
                        filterOption={(input, option) =>
                          (option.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {MONTH_LIST?.map((item, index) => {
                          return (
                            <Select.Option
                              key={index}
                              value={item.month}
                              disabled={
                                !monthListData?.monthList?.some(
                                  (obj) => obj == item.month
                                )
                              }
                            >
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </Card>

            {transferData?.length > 0 ? (
              <ItemTransfer
                ugtGroupId={currentUGTGroup?.id}
                portfolioID={portfolioID}
                portfolioName={portfolioName}
                period={period}
                year={trackingYear}
                month={trackingMonth}
                transferData={transferData}
                setTransferData={setTransferData}
              />
            ) : (
              <Card shadow="md" radius="lg" padding="xl">
                <div className="flex flex-col items-center justify-center text-sm font-normal gap-2">
                  <img
                    src={noContent}
                    alt="React Logo"
                    width={50}
                    height={50}
                  />
                  <div>Transfer Unavailable.</div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

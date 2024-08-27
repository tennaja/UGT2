"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AlmostDone from "../assets/done.png";
import { Button, Card, Divider, Modal } from "@mantine/core";
import { Form, Select } from "antd";
import SettlementInfo from "./SettlementInfo";
import { useLocation, useNavigate } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import { MONTH_LIST, CONVERT_UNIT } from "../../Constants/Constants";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  getPortfolioYearList,
  getPortfolioMonthList,
  settlementApproval,
  getSettlementApproval,
  setSelectedYear,
  setSelectedMonth,
} from "../../Redux/Settlement/Action";

// icon import
import { FaCheck } from "react-icons/fa";

export default function SettlementApproval() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    ugtGroupId,
    portfolioId,
    portfolioName,
    prevSelectedYear,
    prevSelectedMonth,
  } = location.state;
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);

  const settlementApprovalResponse = useSelector(
    (state) => state.settlement.settlementApproval
  );
  const getSettlementApproveData = useSelector(
    (state) => state.settlement.getSettlementApproval
  );

  const yearListData = useSelector((state) => state.settlement.yearList);
  const monthListData = useSelector((state) => state.settlement.monthList);
  const tmpSelectedYear = useSelector(
    (state) => state.settlement?.selectedYear
  );
  const [settlementYear, setSettlementYear] = useState(prevSelectedYear);
  const [settlementMonth, setSettlementMonth] = useState(prevSelectedMonth);
  const [prevMonth, setPrevMonth] = useState(prevSelectedMonth);
  const [latestYearHasData, setLatestYearHasData] = useState(
    yearListData.latestYearHasData
  );
  const [latestMonthHasData, setLatestMonthHasData] = useState(
    monthListData.defaultMonth
  );

  const [unit, setUnit] = useState(CONVERT_UNIT[1].unit);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [approveStatus, setApproveStatus] = useState(false);
  const [approveDate, setApproveDate] = useState(null);
  const [showModalComplete, setShowModalComplete] = useState(false);

  useEffect(() => {
    // Re-Load ใหม่ กรณีที่ refresh
    dispatch(getPortfolioYearList(ugtGroupId, portfolioId));
  }, []);

  useEffect(() => {
    // Re-Load ใหม่ กรณีที่ refresh และมีเปลี่ยนปี
    if (!tmpSelectedYear) {
      setSettlementYear(prevSelectedYear);
    } else {
      setSettlementYear(tmpSelectedYear);
    }
  }, [tmpSelectedYear]);

  useEffect(() => {
    // Re-Load ใหม่ กรณีที่ refresh
    dispatch(getPortfolioMonthList(ugtGroupId, portfolioId, settlementYear));
  }, [settlementYear]);

  // Fetch approve status
  useEffect(() => {
    if (settlementMonth) {
      dispatch(
        getSettlementApproval(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
    }
  }, [settlementMonth]);

  useEffect(() => {
    if (getSettlementApproveData) {
      setApproveStatus(getSettlementApproveData.status);
      setApproveDate(getSettlementApproveData.approveDate);
    } else {
      setApproveStatus(false);
      setApproveDate(null);
    }
  }, [getSettlementApproveData]);

  useEffect(() => {
    // set default month
    if (monthListData?.monthList?.length > 0) {
      if (!prevMonth) {
        // กรณีกดจากปุ่ม Pending Approval
        setSettlementMonth(monthListData.defaultMonth);
        dispatch(setSelectedMonth(monthListData.defaultMonth));
      } else {
        // กรณีกดจากปุ่ม Awaiting for Approval
        setSettlementMonth(prevMonth);
        dispatch(setSelectedMonth(prevMonth));
      }
    }
  }, [monthListData]);

  // เอาไว้เช็ค dropdown และ set disable ไว้
  useEffect(() => {
    setLatestYearHasData(yearListData.latestYearHasData);
  }, [yearListData.latestYearHasData]);

  // เอาไว้เช็ค dropdown และ set disable ไว้
  useEffect(() => {
    setLatestMonthHasData(monthListData.defaultMonth);
  }, [monthListData]);

  const handleChangeSettlementYear = (year) => {
    Swal.fire({
      title: "Please Wait...",
      html: `กำลังโหลด...`,
      allowOutsideClick: false,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }); // ปิด swal อยู่ที่ api

    setPrevMonth(); // ล้างค่าที่พักจากหน้าก่อน
    dispatch(setSelectedYear(year));
    dispatch(getPortfolioMonthList(ugtGroupId, portfolioId, year));
  };

  const handleChangeSettlementMonth = (month) => {
    Swal.fire({
      title: "Please Wait...",
      html: `กำลังโหลด...`,
      allowOutsideClick: false,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }); // ปิด swal อยู่ที่ api

    dispatch(setSelectedMonth(month));
    setSettlementMonth(month);
  };

  const handleApprove = () => {
    dispatch(
      settlementApproval(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth
      )
    );
  };

  useEffect(() => {
    if (settlementApprovalResponse.status) {
      setApproveStatus(true);
      setApproveDate(settlementApprovalResponse.approveDate);
      setOpenModalConfirm(false);
      setShowModalComplete(true);
    } else {
      console.log("approved failed");
    }
  }, [settlementApprovalResponse]);

  const handleCloseModalConfirm = () => {
    setOpenModalConfirm(false);
  };

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col">
            <h2 className="font-semibold text-xl text-black">
              View Settlement
            </h2>
            <p className={`text-BREAD_CRUMB text-sm mb-6 font-normal`}>
              {currentUGTGroup?.name} / Settlement Approval /{portfolioName}
            </p>
          </div>

          <Card shadow="md" radius="lg" className="flex" padding="xl">
            <div className="flex justify-between">
              <div className="pb-3">
                <div className="text-sm font-semibold text-[#4D6A00] text-left">
                  Settlement Approval
                </div>
                <div className="text-xl font-bold ">{portfolioName}</div>
              </div>

              <div>
                <div className="flex items-center justify-content-end gap-4">
                  <div className="flex items-center text-sm">
                    <span>
                      Status :{" "}
                      <b>{approveStatus ? "Approved" : "Not Approved"}</b>
                    </span>
                  </div>
                </div>

                {approveStatus && (
                  <div className="mt-1 text-right">
                    <div className="text-xs text-slate-500 italic">
                      Approved{" "}
                      {dayjs(approveDate).format(
                        "dddd, D MMMM YYYY h:mm A [(GMT+7)]"
                      )}
                    </div>
                  </div>
                )}

                <div
                  className="flex items-center justify-content-end text-sm text-[#4D6A00] underline cursor-pointer"
                  onClick={() =>
                    navigate(WEB_URL.SETTLEMENT, {
                      state: {
                        id: portfolioId,
                        name: portfolioName,
                      },
                    })
                  }
                >
                  Go to Summary
                </div>
              </div>
            </div>
            <Divider orientation="horizontal" size={"xs"} />

            <div className="flex justify-between items-center my-2">
              <div className="text-xl font-semibold text-[#4D6A00]">
                Settlement Information
              </div>

              <Form layout="horizontal" size="large">
                <div className="grid grid-cols-6 gap-4 items-center pt-2">
                  <div className="col-span-2 text-sm font-bold">
                    Settlement Period
                  </div>

                  <Form.Item className="col-span-2 pt-3">
                    <Select
                      size="large"
                      value={settlementYear}
                      onChange={(value) => handleChangeSettlementYear(value)}
                      showSearch
                    >
                      {yearListData?.yearList?.map((item, index) => (
                        <Select.Option
                          key={index}
                          value={item}
                          disabled={item > latestYearHasData}
                        >
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item className="col-span-2 pt-3">
                    <Select
                      size="large"
                      value={settlementMonth}
                      onChange={(value) => handleChangeSettlementMonth(value)}
                      showSearch
                      filterOption={(input, option) =>
                        (option.children ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {monthListData?.monthList?.map((item, index) => {
                        return (
                          <Select.Option
                            key={index}
                            value={MONTH_LIST[item - 1].month}
                            disabled={item > latestMonthHasData}
                          >
                            {MONTH_LIST[item - 1].name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Form>
            </div>

            <SettlementInfo
              ugtGroupId={ugtGroupId}
              portfolioId={portfolioId}
              portfolioName={portfolioName}
              unit={unit}
              convertUnit={CONVERT_UNIT[1].convertValue}
              showSeeDetailButton={true}
              showWaitApprove={false}
              settlementYear={settlementYear}
              settlementMonth={settlementMonth}
            />
          </Card>

          <div className="flex flex-col items-center mt-5">
            <div className="flex items-center gap-5">
              <Button
                size="xl"
                className={`${
                  approveStatus ? "bg-[#CCD1D9]" : "bg-[#87BE33]"
                } text-white px-8`}
                onClick={() => setOpenModalConfirm(true)}
                disabled={approveStatus}
              >
                {approveStatus && <FaCheck />}
                <span className="pl-2">Approve{approveStatus && "d"}</span>
              </Button>
            </div>

            {approveStatus && (
              <div className="mt-4 text-right">
                <div className="text-xs text-slate-500 italic">
                  Approved{" "}
                  {dayjs(approveDate).format(
                    "dddd, D MMMM YYYY h:mm A [(GMT+7)]"
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {openModalConfirm && (
          <ModalConfirm
            onClickConfirmBtn={handleApprove}
            onCloseModal={handleCloseModalConfirm}
            title={"Are you sure?"}
            content={"Do you confirm this approval ?"}
          />
        )}

        <Modal
          opened={showModalComplete}
          onClose={() => setShowModalComplete(!showModalComplete)}
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

            <div className="text-2xl font-bold text-center pt-2">
              Settlement Approval Completed
            </div>
            <div className="flex gap-4">
              <Button
                className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
                onClick={() => setShowModalComplete(!showModalComplete)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

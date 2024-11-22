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
import {
  MONTH_LIST,
  CONVERT_UNIT,
  USER_GROUP_ID,
  UTILITY_GROUP_ID,
} from "../../Constants/Constants";
import { FaChevronCircleLeft } from "react-icons/fa";
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

const sample_SettlementApproveData = [
  {
    utilityId: 1,
    approvedBy: "EGAT",
    approveStatus: "W",
    approveDate: null,
  },
  {
    utilityId: 2,
    approvedBy: "PEA",
    approveStatus: "W",
    approveDate: null,
  },
  {
    utilityId: 3,
    approvedBy: "MEA",
    approveStatus: "Y",
    approveDate: new Date(),
  },
];

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

  // redux
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const settlementApprovalResponse = useSelector(
    // response หลังกด Approve
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

  // all state
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
  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[1].convertValue);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [approveDetail, setApproveDetail] = useState([]);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [userGroupUtilityID, setUserGroupUtilityID] = useState("");
  const [isClickApprove, setIsClickApprove] = useState(false);

  // get utilityID
  useEffect(() => {
    const userGroupID = userData?.userGroup?.id;
    let user_utilityID = "";
    if (userGroupID == USER_GROUP_ID.PORTFOLIO_MNG) {
      user_utilityID = UTILITY_GROUP_ID.EGAT; // EGAT 1
    } else if (userGroupID == USER_GROUP_ID.PEA_CONTRACTOR_MNG) {
      user_utilityID = UTILITY_GROUP_ID.PEA; // PEA 2
    } else if (userGroupID == USER_GROUP_ID.MEA_CONTRACTOR_MNG) {
      user_utilityID = UTILITY_GROUP_ID.MEA; // MEA 3
    }

    setUserGroupUtilityID(user_utilityID);
  }, [userData]);

  // 1st Load
  useEffect(() => {
    dispatch(getPortfolioYearList(ugtGroupId, portfolioId));
  }, []);

  // Re-Load ใหม่ กรณีที่ refresh และมีเปลี่ยนปี
  useEffect(() => {
    if (!tmpSelectedYear) {
      setSettlementYear(prevSelectedYear);
    } else {
      setSettlementYear(tmpSelectedYear);
    }
  }, [tmpSelectedYear]);

  // Re-Load ใหม่ กรณีที่ refresh
  useEffect(() => {
    dispatch(getPortfolioMonthList(ugtGroupId, portfolioId, settlementYear));
  }, [settlementYear]);

  // Fetch approve status กรณีเลือกเดือน
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

  // set default month
  useEffect(() => {
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

  // หลังกด approve แล้ว Fetch approve status ล่าสุดอีกรอบ
  useEffect(() => {
    if (isClickApprove && settlementApprovalResponse?.status) {
      setShowModalComplete(true);
      // get status อีกรอบ
      dispatch(
        getSettlementApproval(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
    }
  }, [settlementApprovalResponse]);

  // approve status
  useEffect(() => {
    if (getSettlementApproveData) {
      const approveData = getSettlementApproveData?.utilityList?.filter(
        // const approveData = sample_SettlementApproveData?.filter(
        (item) => item.approveStatus !== null
      );
      setApproveDetail(approveData);
    }
  }, [getSettlementApproveData]);

  const isUserCanApprove = (item) => {
    if (userGroupUtilityID == item.utilityId && item.approveStatus == "W") {
      return true;
    }
    return false;
  };

  const handleChangeSettlementYear = (year) => {
    Swal.fire({
      title: "Please Wait...",
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
        settlementMonth,
        userGroupUtilityID
      )
    );
    setIsClickApprove(true);
  };

  const onClickApprove = () => {
    Swal.fire({
      title:
        "<span class='text-3xl font-semibold text-[#666666]'>Are you sure ?</span>",
      html: "<span class='text-sm text-[#666666]'>Are you sure want to confirm this approval ?</span>",
      icon: "warning",
      iconColor: "#87BE33",
      showCancelButton: true,
      cancelButtonColor: "#F3F6F9",
      cancelButtonText: `<span class="text-[#666666]">Cancel</span>`,
      confirmButtonColor: "#87BE33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        handleApprove();
      }
    });
  };

  const handleCloseModalConfirm = () => {
    setOpenModalConfirm(false);
  };

  const handleChangeUnit = (unit) => {
    const unitObj = CONVERT_UNIT.filter((obj) => {
      return obj.unit == unit;
    });
    setUnit(unit);
    setConvertUnit(unitObj[0].convertValue);
  };

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div className="grid gap-4 gap-y-2">
              <div className="">
                <h2 className="font-semibold text-xl text-black truncate">
                  {portfolioName}
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal`}>
                  {currentUGTGroup?.name} / Portfolio & Settlement Management /
                  Settlement Approval / {portfolioName}
                </p>
              </div>
            </div>

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="0"
            >
              <div className="flex justify-between items-center p-4">
                <div className="text-left flex gap-3 items-center">
                  <FaChevronCircleLeft
                    className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                    size="30"
                    onClick={() => {
                      navigate(WEB_URL.SETTLEMENT, {
                        state: {
                          id: portfolioId,
                          name: portfolioName,
                        },
                      });
                    }}
                  />

                  <span className="text-xl	mr-14 	leading-tight">
                    <b> Settlement Approval</b>
                  </span>

                  {/* <div>
                    <div className="text-sm font-semibold text-[#4D6A00]">
                      Settlement Approval
                    </div>
                    <div className="text-xl font-bold ">{portfolioName}</div>
                  </div> */}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold">Settlement Period</div>

                  <div className="mb-0 h-9">
                    <Form layout="horizontal" size="large">
                      <div className="flex items-center gap-3">
                        <Form.Item>
                          <Select
                            size="large"
                            value={settlementYear}
                            onChange={(value) =>
                              handleChangeSettlementYear(value)
                            }
                            showSearch
                            style={{ width: 140 }}
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

                        <Form.Item>
                          <Select
                            size="large"
                            value={settlementMonth}
                            onChange={(value) =>
                              handleChangeSettlementMonth(value)
                            }
                            showSearch
                            filterOption={(input, option) =>
                              (option.children ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            style={{ width: 140 }}
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
                </div>
              </div>
              <Divider orientation="horizontal" size={"xs"} />

              <div className="flex justify-between items-center px-4 mt-7">
                <div className="flex justify-between items-center">
                  <div className="text-xl font-semibold text-[#4D6A00]">
                    Settlement Information
                  </div>
                </div>

                <div>
                  <Form layout="horizontal" size="large">
                    <Form.Item className="mb-3">
                      <Select
                        size="large"
                        value={unit}
                        variant="borderless"
                        onChange={(value) => handleChangeUnit(value)}
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
              </div>

              <div className="text-right px-4">
                <a
                  className="text-[#4D6A00] cursor-pointer text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    const targetElement =
                      document.getElementById("approveInformation");
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  View Approval Details {">"}
                </a>
              </div>

              <div className="p-4">
                <SettlementInfo
                  ugtGroupId={ugtGroupId}
                  portfolioId={portfolioId}
                  portfolioName={portfolioName}
                  unit={unit}
                  convertUnit={convertUnit}
                  showSeeDetailButton={true}
                  showWaitApprove={false}
                  settlementYear={settlementYear}
                  settlementMonth={settlementMonth}
                />
              </div>
            </Card>

            <Card
              id="approveInformation"
              shadow="md"
              radius="lg"
              className="flex w-full h-full mb-10"
              padding="lg"
            >
              <div className="pt-2 flex items-center gap-4">
                <div className="text-xl font-semibold text-[#4D6A00] ">
                  Approval Details
                </div>
                {approveDetail?.length == 0 && (
                  <div className="text-xl font-normal text-center text-secondary">
                    -- Awaiting for Approval --
                  </div>
                )}
              </div>

              {approveDetail?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  {approveDetail?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded shadow-md ${
                          item.approveStatus == "Y"
                            ? "bg-[#E9F8E9]"
                            : "bg-[#FFE5E4]"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <div className="text-left text-sm">
                              <b
                                className={`${
                                  item.approveStatus === "Y"
                                    ? "text-[#2BA228]"
                                    : "text-[#E41D12]"
                                }`}
                              >
                                {item.approveStatus === "Y"
                                  ? "Approved"
                                  : "Waiting for Approval"}
                              </b>
                            </div>
                            <div className="text-xs text-slate-700 italic text-left">
                              By <b>{item.approvedBy}</b>
                            </div>
                            <div className="text-xs text-slate-700 italic text-left">
                              {item.approveStatus == "Y" && (
                                <span>
                                  At{" "}
                                  {dayjs(item.approveDate).format(
                                    "dddd, D MMMM YYYY h:mm A [(GMT+7)]"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {isUserCanApprove(item) && (
                            <Button
                              size="sm"
                              className="bg-[#87BE33] text-white px-3"
                              onClick={() => onClickApprove()}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
                      onClick={() => {
                        setShowModalComplete(!showModalComplete);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Modal>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState,useRef } from "react";
import Swal from "sweetalert2";
import AlmostDone from "../assets/done.png";
import { Button, Card, Divider, Modal } from "@mantine/core";
import { Form, Select } from "antd";
import SettlementInfo from "./SettlementInfo";
import { useLocation, useNavigate } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import {
  USER_GROUP_ID,
  MONTH_LIST,
  CONVERT_UNIT,
  UTILITY_GROUP_ID,
} from "../../Constants/Constants";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  getPortfolioYearList,
  getPortfolioMonthList,
  settlementApproval,
  getSettlementApproval,
  setSelectedYear,
  setSelectedMonth,
  clearSettlementFailRequest,
  settlementReject,
  //clearSettlementSuccessRequest,
  getSettlementDetail
} from "../../Redux/Settlement/Action";
import { FetchUtilityContractList } from "../../Redux/Dropdrow/Action";
import { AiOutlineExport } from "react-icons/ai";
//import { useLocation } from "react-router-dom";


// icon import
import { FaCheck } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import SettlementMenu from "./SettlementMenu";
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegFileExcel } from "react-icons/fa";
import ModalConfirmRemarkSettlement from "./ModalConfirmRemarkSettlement";
import { hideLoading, showLoading } from "../../Utils/Utils";
import ModalFail from "../Control/Modal/ModalFail";

export default function SettlementApproval() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();

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

  const userData = useSelector((state) => state.login.userobj);

  const utilityContractListData = useSelector(
    (state) => state.dropdrow.utilityCOntractList
  );
  //console.log(utilityContractListData)

  const yearListData = useSelector((state) => state.settlement.yearList);
  const monthListData = useSelector((state) => state.settlement.monthList);
  const tmpSelectedYear = useSelector(
    (state) => state.settlement?.selectedYear
  );
  const settlementDetailData = useSelector((state)=> state.settlement.settlementDetail)
  const isShowModalFail = useSelector((state) => state.settlement.isFailRequest)
  const isShowModalSuccess = useSelector((state)=> state.settlement.isSuccessRequest)
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

  const [overviewDataUnit, setOverviewDataUnit] = useState(
    CONVERT_UNIT[0].unit
  );

  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[0].convertValue);
  const [canViewSettlementDetail, setCanViewSettlementDetail] = useState(false);
  const [listOptionUtility, setListOptionUtility] = useState([
    { id: 0, abbr: "All", name: "All" },
  ]);
  const [selectOptionUtility, setSelectOptionUtility] = useState(
    listOptionUtility[0].abbr
  );
  const [selectOptionUtilityID, setSelectOptionSelectID] = useState(
    listOptionUtility[0].id
  );
  const [approveDetail, setApproveDetail] = useState([]);
  const [isClickApprove, setIsClickApprove] = useState(false);
  const [userGroupUtilityID, setUserGroupUtilityID] = useState("");
  const [isShowPopupReject,setIsShowPopupReject] = useState(false)

  const RemarkReject = useRef("")

  useEffect(() => {
    // Re-Load ใหม่ กรณีที่ refresh
    dispatch(getPortfolioYearList(ugtGroupId, portfolioId));
    dispatch(FetchUtilityContractList());
  }, []);

  useEffect(() => {
    const userGroupID = userData?.userGroup?.id;
    let user_utilityID = "";
    if (userGroupID == USER_GROUP_ID.WHOLE_SALEER_ADMIN) {
      console.log("Egat")
      user_utilityID = UTILITY_GROUP_ID.EGAT; // EGAT 1
    } else if (userGroupID == USER_GROUP_ID.PEA_SUBSCRIBER_MNG) {
      console.log("PEA")
      user_utilityID = UTILITY_GROUP_ID.PEA; // PEA 2
    } else if (userGroupID == USER_GROUP_ID.MEA_SUBSCRIBER_MNG) {
      console.log("MEA")
      user_utilityID = UTILITY_GROUP_ID.MEA; // MEA 3
    }

    setUserGroupUtilityID(user_utilityID);
  }, [userData]);

  useEffect(()=>{
    if(settlementYear != null && settlementMonth != null){
      dispatch(
        getSettlementDetail(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
    }
  },[settlementMonth,settlementYear])
console.log(settlementDetailData)
  useEffect(() => {
    console.log(utilityContractListData);
    console.log(selectOptionUtility);
    if (utilityContractListData.length > 0) {
      console.log("Come to Set");
      let tmpUtility = [];
      tmpUtility.push({ id: 0, abbr: "All", name: "All" });
      utilityContractListData?.map((items) => tmpUtility.push(items));
      setListOptionUtility(tmpUtility);
    }
  }, [utilityContractListData]);

  //console.log(listOptionUtility)

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
  // approve status
  useEffect(() => {
    if (getSettlementApproveData) {
      const approveData = getSettlementApproveData?.utilityList?.filter(
        // const approveData = sample_SettlementApproveData?.filter(
        (item) => item.approveStatus !== null
      );
      setApproveDetail(approveData);
    } /*else {
      setApproveStatus(false);
      setApproveDate(null);
    }*/
  }, [getSettlementApproveData]);

  // หลังกด approve แล้ว Fetch approve status ล่าสุดอีกรอบ
  useEffect(() => {
    if (isClickApprove && settlementApprovalResponse?.status) {
      //setShowModalComplete(true);
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

  const isUserCanApprove = (item) => {
    console.log(userGroupUtilityID)
    if (userGroupUtilityID == item.utilityId && item.approveStatus == "W") {
      return true;
    }
    return false;
  };

  // approve status
  /*useEffect(() => {
    if (getSettlementApproveData) {
      const approveData = getSettlementApproveData?.utilityList?.filter(
        // const approveData = sample_SettlementApproveData?.filter(
        (item) => item.approveStatus !== null
      );
      setApproveDetail(approveData);
    }
  }, [getSettlementApproveData]);*/

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
console.log(isShowModalFail)
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
    /*dispatch(
      settlementApproval(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        userGroupUtilityID
      )
    );*/
    setIsClickApprove(true);
  };

  const onClickApprove = () => {
    Swal.fire({
      title:
        "<span class='text-2xl font-semibold text-[#666666]'>Confirm this Settlement?</span>",
      html: "<span class='text-sm text-[#666666]'>Would you like to confirm this Settlement Details?</span>",
      //icon: "warning",
      iconColor: "#87BE33",
      showCancelButton: true,
      reverseButtons: true, // สลับตำแหน่งปุ่ม
      customClass: {
        popup: "min-h-[225px] h-auto", // ปรับความสูง popup
        confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-[150px]", // ปุ่ม Confirm
        cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded w-[150px]", // ปุ่ม Cancel
      },
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

  const onClickReject = () => {
    setIsShowPopupReject(true)
  };

  const onCloseRejectPopup =()=>{
    setIsShowPopupReject(false)
  }

  const handleReject =()=>{
    console.log(RemarkReject)
    showLoading()
    setTimeout(()=>{
      dispatch(settlementReject(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        userGroupUtilityID,
        RemarkReject.current, ()=>{
          hideLoading()
          setIsShowPopupReject(false)
          dispatch(
            getSettlementDetail(
              ugtGroupId,
              portfolioId,
              settlementYear,
              settlementMonth
            )
          );
        }
    ))
    },1000)
    
    
  }

  /*useEffect(() => {
    if (settlementApprovalResponse.status) {
      setApproveStatus(true);
      setApproveDate(settlementApprovalResponse.approveDate);
      setOpenModalConfirm(false);
      setShowModalComplete(true);
    } else {
      console.log("approved failed");
    }
  }, [settlementApprovalResponse]);*/

  const handleCloseModalConfirm = () => {
    setOpenModalConfirm(false);
  };

  const handleChangeOverviewUnit = (unit) => {
    console.log("Handle unit", unit);
    const unitObj = CONVERT_UNIT.filter((obj) => {
      return obj.unit == unit;
    });
    setOverviewDataUnit(unit);
    setConvertUnit(unitObj[0].convertValue);
    /*setTmpOverviewChartData(
      convertChartData(settlementOverviewData, unitObj[0].convertValue)
    );*/
  };

  const handleChangeUtility = (value) => {
    console.log(value);

    const findIDUtility = listOptionUtility.filter((obj) => {
      return obj.id == value;
    });
    console.log(findIDUtility);
    console.log(findIDUtility[0].id);
    setSelectOptionUtility(findIDUtility[0].abbr);
    setSelectOptionSelectID(value);
    console.log(selectOptionUtilityID);
  };

  const exportTablePDf = () => {};

  const exportTableExcel = () => {};

  const exportScreenPDF = () => {};

  const exportScreenExcel = () => {};

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
              <div className="content-center">
                <div className="text-left flex gap-3 items-center">
                  <FaChevronCircleLeft
                    className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                    size="30"
                    onClick={() =>
                      navigate(WEB_URL.SETTLEMENT, {
                        state: {
                          id: state?.portfolioId,
                          name: state?.portfolioName,
                        },
                      })
                    }
                  />

                  <div>
                    <div className="text-xl font-bold ">
                      Settlement Confirmation
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-center">
                {/*<div className="flex items-center justify-content-end gap-4">
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
                </div>*/}
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
            </div>
            <Divider className="mt-3" orientation="horizontal" size={"xs"} />

            <div className="flex justify-between items-center my-2">
              <div className="text-xl font-semibold text-[#4D6A00]"></div>

              <Form layout="horizontal" size="large">
                <div className={`grid gap-4 pt-4 grid-cols-3`}>
                  <Form.Item className="col-span-1"></Form.Item>
                  {/*Select Year filter */}
                  <Form.Item className="col-span-1">
                    <Select
                      size="large"
                      value={selectOptionUtilityID}
                      onChange={(value) => handleChangeUtility(value)}
                    >
                      {listOptionUtility.map((item, index) => (
                        <Select.Option
                          key={index}
                          value={item.id}
                          //disabled={item > latestYearHasData}
                        >
                          {item.abbr}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/*Select Unit Filter convert */}
                  <Form.Item className="col-span-1">
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

                  {/*<SettlementMenu
                    labelBtn={"Export"}
                    actionList={[
                      {
                        icon: <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]"/>,
                        label: "Table",
                        onClick: exportTablePDf,
                        rightTxt:"(.pdf)",
                      },
                      {
                        icon: <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]"/>,
                        label: "Screen",
                        onClick: exportScreenPDF,
                        rightTxt:"(.pdf)",
                      },
                      {
                        icon: <FaRegFileExcel  className="text-green-600 w-[20px] h-[20px]"/>,
                        label: "Table",
                        onClick: exportTableExcel,
                        rightTxt:"(.xls)",
                      },
                      {
                        icon: <FaRegFileExcel  className="text-green-600 w-[20px] h-[20px]"/>,
                        label: "Screen",
                        onClick: exportScreenExcel,
                        rightTxt:"(.xls)",
                      }

                    ]}
                  />*/}
                </div>
              </Form>
            </div>

            <SettlementInfo
              ugtGroupId={ugtGroupId}
              portfolioId={portfolioId}
              portfolioName={portfolioName}
              unit={overviewDataUnit}
              convertUnit={convertUnit}
              showSeeDetailButton={true}
              showWaitApprove={false}
              settlementYear={settlementYear}
              settlementMonth={settlementMonth}
            />
          </Card>

          {/*<div className="flex flex-col items-center mt-5">
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
          </div>*/}

          <Card
            id="approveInformation"
            shadow="md"
            radius="lg"
            className="flex w-full h-full mb-10 mt-4"
            padding="lg"
          >
            <div className="pt-2 flex items-center gap-4">
              <div className="text-xl font-semibold text-[#4D6A00] ">
                Confirmation Details
              </div>
              {approveDetail?.length == 0 && (
                <div className="text-xl font-normal text-center text-secondary">
                  -- Awaiting for Confirmation --
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
                          ? "bg-[#87BE3333]":item.approveStatus == "R"?"bg-[#EF483533]"
                          : "bg-[#FF8B0E33]"
                      }`}
                    >
                      <div>
                        <div className="flex flex-col gap-1 w-full">
                          <div className="text-left text-sm">
                            <b
                              className={`${
                                item.approveStatus === "Y"
                                  ? "text-[#2BA228]":item.approveStatus === "R"?"text-[#EF4835]"
                                  : "text-[#FF8B0E]"
                              }`}
                            >
                              {item.approveStatus === "Y"
                                ? "Confirmed":item.approveStatus === "R"?"Rejected"
                                : "Waiting for Confirmation"}
                            </b>
                          </div>
                          <div className="text-xs text-slate-700 italic text-left">
                            By <b>{item.approvedBy}</b>
                          </div>
                          <div className="text-xs text-slate-700 italic text-left">
                            {item.approveStatus == "Y" || item.approveStatus == "R" && (
                              <span>
                                At{" "}
                                {dayjs(item.approveDate).format(
                                  "dddd, D MMMM YYYY h:mm A [(GMT+7)]"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        { settlementDetailData.rejectStatus == false || settlementDetailData.rejectStatus == null ?
                        isUserCanApprove(item) && (
                          <div className="w-full text-right">
                            <Button
                            size="sm"
                            className="bg-[#EF4835] text-white px-3 mr-2"
                            onClick={() => onClickReject()}
                          >
                            Reject
                          </Button>

                          <Button
                            size="sm"
                            className="bg-[#87BE33] text-white px-3"
                            onClick={() => onClickApprove()}
                          >
                            Confirm
                          </Button>
                          </div>
                        )
                        :undefined}
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

            {isShowPopupReject &&
            <ModalConfirmRemarkSettlement
            onClickConfirmBtn={handleReject}
            onCloseModal={onCloseRejectPopup}
            title={"Reject this Settlement?"}
            content={"Settlement Details requires to be edited."}
            openCheckBox = {false}
            setRemark={RemarkReject}
            sizeModal={"md"}
            buttonTypeColor="danger"
            textButton = "Reject"
            />}

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
            {isShowModalSuccess &&
              <Modal
              opened={isShowModalSuccess}
              onClose={() => dispatch(clearSettlementSuccessRequest())}
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
                      dispatch(clearSettlementSuccessRequest())
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Modal>
            }
            {isShowModalFail && 
            <ModalFail
              onClickOk={() => {
                dispatch(clearSettlementFailRequest())
              }}
            content={"Something went wrong. Please go back and try again."}
          />

            }
          </Card>
        </div>

        {/*  {openModalConfirm && (
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
        </Modal>*/}
      </div>
    </div>
  );
}

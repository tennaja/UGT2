import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Button, Card } from "@mantine/core";
import { Form, Select } from "antd";
import SettlementInfo from "./SettlementInfo";
import { MONTH_LIST, CONVERT_UNIT } from "../../Constants/Constants";
import {
  getPortfolioMonthList,
  setSelectedMonth,
  getSettlementDetail,
  getSettlementStatus,
  getSettlementMonthlySummaryFinal
} from "../../Redux/Settlement/Action";
import { useNavigate } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import { USER_GROUP_ID } from "../../Constants/Constants";
import SettlementInfoFinal from "./SettlementInfoFinal";
import WaitApprove from "../assets/WaitApprove.png";

// Icon import
import { AiOutlineExport } from "react-icons/ai";

const MonthlySettlement = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    ugtGroupId,
    portfolioId,
    portfolioName,
    setHasSettlementData,
    isShowDetail,
  } = props;
  const [unit, setUnit] = useState("MWh");

  console.log(portfolioId)

  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[0].convertValue);
  const monthListData = useSelector((state) => state.settlement.monthList);
  const settlementYear = useSelector((state) => state.settlement.selectedYear);
  const userData = useSelector((state) => state.login.userobj);
  const settlementMonth = useSelector(
    (state) => state.settlement.selectedMonth
  );
  const settlementMonthlySummaryData = useSelector(
    (state) => state.settlement.settlementDetail
  );
  const settlementStatus = useSelector((state)=>state.settlement.settlementStatus)
  const settlementMonthlySummaryDataFinal = useSelector(
      (state) => state.settlement.settlementDetailFinal
    );

  const [latestMonthHasData, setLatestMonthHasData] = useState(
    monthListData.defaultMonth
  );
console.log(settlementStatus,monthListData)
  const [isShowView, setIsShowView] = useState(false);
  const [hideBtn,setHideBtn] = useState(false)
  console.log(settlementYear, settlementMonth);
  useEffect(() => {
    if (settlementYear != null && settlementMonth != null) {
      dispatch(
        getSettlementDetail(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
      dispatch(getSettlementStatus(portfolioId,settlementYear,settlementMonth,ugtGroupId))
      dispatch(
        getSettlementMonthlySummaryFinal(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          0
        )
      );
    }
  }, [settlementMonth, settlementYear]);

  console.log(settlementMonthlySummaryData,settlementStatus)

  useEffect(() => {
    if (settlementMonthlySummaryData && userData) {
      if(settlementStatus.status == "N" || settlementStatus.status == "E" || settlementStatus.status == "R"){
        if(userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
          userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER){
            setIsShowView(true);
          }
          else{
            setIsShowView(false);
          }
      }
      else if(settlementStatus.status == "V"){
        if(userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
          userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
          userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
          userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG){
            setIsShowView(true);
          }
          else{
            setIsShowView(false);
          }
      }
      else if(settlementStatus.status == "Y"){
        setIsShowView(true);
      }


      /*if (
        userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
        userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
        userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
      ) {
        setIsShowView(true);
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG
      ) {
        setIsShowView(false);
      } else {
        if (settlementMonthlySummaryData?.approveStatus == true) {
          setIsShowView(true);
        } else {
          setIsShowView(false);
        }
      }*/
    }
  }, [userData, settlementMonthlySummaryData]);

  useEffect(() => {
    // get month list
    if (settlementYear) {
      handleChangeUnit(CONVERT_UNIT[0].unit);
      dispatch(getPortfolioMonthList(ugtGroupId, portfolioId, settlementYear));
    }
  }, [settlementYear]);

  useEffect(() => {
    // set selected month
    if (monthListData?.monthList?.length > 0) {
     /* if (
        userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
        userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
        userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
      ) {*/
        if (
          monthListData?.monthList.some((item) => item == settlementMonth) &&
          settlementMonth <= monthListData?.defaultMonth
        ) {
          dispatch(setSelectedMonth(settlementMonth));
        } else {
          dispatch(setSelectedMonth(monthListData?.defaultMonth));
        }
      /*} else {
        if (monthListData?.defaultMonth == 12) {
          dispatch(setSelectedMonth(monthListData?.defaultMonth));
        }
        else if(monthListData?.defaultMonth == 1){
          dispatch(setSelectedMonth(monthListData?.defaultMonth));
        } else {
          let defualtMonth = monthListData?.defaultMonth - 1;
          dispatch(setSelectedMonth(defualtMonth));
        }
      }*/
      setLatestMonthHasData(monthListData.defaultMonth); // เอาไว้เช็ค dropdown และ set disable ไว้
    }

    setHasSettlementData(monthListData.defaultMonth ? true : false); //
  }, [monthListData]);

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

    // set to redux
    dispatch(setSelectedMonth(month));
  };

  const handleChangeUnit = (unit) => {
    const unitObj = CONVERT_UNIT.filter((obj) => {
      return obj.unit == unit;
    });
    setUnit(unit);
    setConvertUnit(unitObj[0].convertValue);
  };

  const checkMonth = (month) => {
    if (
      userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ||
      userData?.userGroup?.id == USER_GROUP_ID.WHOLE_SALEER_ADMIN ||
      userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG ||
      userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
    ) {
      return month > latestMonthHasData;
    } else {
      if (latestMonthHasData == 12) {
        return false;
      }else if(latestMonthHasData == 1){
        return month = latestMonthHasData
      } else {
        return month >= latestMonthHasData;
      }
    }
  };

  return (
    monthListData?.monthList?.length > 0 && (
      <Card shadow="md" radius="lg" className="flex mt-10" padding="xl">
        <div className="flex justify-between">
          <div className="text-xl font-semibold text-[#4D6A00]">
            Monthly Settlement
          </div>

          <Form layout="horizontal" size="large">
            <div className="grid grid-cols-[80px_90px_120px] gap-2">
              
                <Button
                  className="bg-[#87BE33] hover:bg-[#4D6A00] w-20 h-[39px]"
                  onClick={() =>
                    navigate(WEB_URL.SETTLEMENT_APPROVAL, {
                      state: {
                        ugtGroupId: ugtGroupId,
                        portfolioId: portfolioId,
                        portfolioName: portfolioName,
                        prevSelectedYear: settlementYear,
                        prevSelectedMonth: settlementMonth,
                      },
                    })
                  }
                >
                  <span className="font-semobold text-white text-base">
                    View
                  </span>
                </Button>
              
              <Form.Item className="col-span-1 col-start-2">
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

              <Form.Item className="col-start-3">
                <Select
                  size="large"
                  value={settlementMonth}
                  onChange={(value) => handleChangeSettlementMonth(value)}
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
                        disabled={/*checkMonth(item)*/item > latestMonthHasData}
                      >
                        {MONTH_LIST[item - 1].name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {/*<Button
                className="bg-[#F5F4E9] text-[#4D6A00]"
                rightSection={<AiOutlineExport size={14} />}
              >
                Export
              </Button>*/}
            </div>
          </Form>
        </div>
        {settlementMonthlySummaryDataFinal &&
      Object.keys(settlementMonthlySummaryDataFinal).length !== 0
        ?<SettlementInfoFinal
          ugtGroupId={ugtGroupId}
          portfolioId={portfolioId}
          portfolioName={portfolioName}
          unit={unit}
          convertUnit={convertUnit}
          showSeeDetailButton={false}
          showWaitApprove={true}
          settlementYear={settlementYear}
          settlementMonth={settlementMonth}
          isShowDetail={isShowDetail}
          status={settlementStatus.status}
          hideBtn={setHideBtn}
        />:<div className="w-full h-[400px] items-center content-center">
                      <div className="flex justify-center items-center">
                        <img
                          src={WaitApprove}
                          alt="WaitApprove"
                          width={100}
                          height={100}
                          className="content-center"
                        />
                      </div>
                      <label className="text-[#000000CC] font-semibold">
                        Settlement in progress
                      </label>
                    </div>}
      </Card>
    )
  );
};

export default MonthlySettlement;

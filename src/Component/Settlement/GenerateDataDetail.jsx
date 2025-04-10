import React, { useEffect, useState } from "react";
import { Card, Button, Divider } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBox from "../Control/SearchBox";
import DataTable from "../Control/Table/DataTable";
import {
  PortfolioManagementDashboard,
  PortfolioManagementDashboardList,
} from "../../Redux/Portfolio/Action";
import {
  getGenerateDataInfoMonthList,
  getGenerateDataInfoYearList,
  getGenerateDataDashBoard,
  getGenerateDataInfoList,
  getGenerateDataRevision,
} from "../../Redux/Settlement/Action";
import { setCookie } from "../../Utils/FuncUtils";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import { USER_GROUP_ID, UTILITY_GROUP_ID } from "../../Constants/Constants";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import { message } from "antd";
import { MdOutlineContentCopy } from "react-icons/md";
import DataDashBoard from "../assets/DataDashBoardIcon.svg";
import GraphDashboard from "../assets/GraphDashboardIcon.svg";
import ChartDashboard from "../assets/ChartDashBoardIcon.svg";
import { MONTH_LIST } from "../../Constants/Constants";
import { Form, Select } from "antd";
import CircleCheck from "../assets/CircleCheck.svg";
import CircleTime from "../assets/CircleTime.svg";
import DataTableSettlement from "./DataTableSettlement";
import { FaChevronCircleLeft } from "react-icons/fa";
import GenerateDataRevision from "./GenerateDataRevision";
import {
  setSettlementSelectedYear,
  setSettlementSelectedMonth,
} from "../../Redux/Menu/Action";

const itemsPerPage = 5;
const GenerateDataDetail = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);

  const generateInfoYearList = useSelector(
    (state) => state.settlement.generateDataInfoYearList
  );
  const generateInfoMontList = useSelector(
    (state) => state.settlement.generateDataInfoMonthList
  );
  const generateRevision = useSelector(
    (state) => state.settlement.revisionList
  );
  const trackingYear = useSelector((state) => state.menu?.settlementSelectYear);
        const trackingMonth = useSelector(
          (state) => state.menu?.settlementSelectMonth
        );

  console.log(generateRevision);

  const [selectYear, setSelectyear] = useState(state.year);

  const [selectMonth, setSelectMonth] = useState(state.month);

  const [selectTab, setSelectTab] = useState(1);

  useEffect(() => {
    if (currentUGTGroup?.id) {
      dispatch(PortfolioManagementDashboard(currentUGTGroup?.id));
      dispatch(PortfolioManagementDashboardList(currentUGTGroup?.id));
      dispatch(
        getGenerateDataInfoYearList(currentUGTGroup?.id, state.portfolioId)
      );
    }
  }, [currentUGTGroup?.id]);

  useEffect(() => {
    if (currentUGTGroup?.id && trackingMonth && trackingYear) {
      dispatch(
        getGenerateDataRevision(
          currentUGTGroup?.id,
          state.portfolioId,
          trackingYear,
          trackingMonth,
          state.deviceid
        )
      );
    }
  }, [currentUGTGroup?.id, trackingMonth, trackingYear]);

  /*useEffect(() => {
    if (generateInfoYearList.yearList) {
      if (!selectYear) {
        setSelectyear(generateInfoYearList.yearList[0]);
      }
    }
  }, [generateInfoYearList]);*/

  useEffect(() => {
    if (currentUGTGroup?.id && trackingYear) {
      dispatch(
        getGenerateDataInfoMonthList(
          currentUGTGroup?.id,
          trackingYear,
          state.portfolioId
        )
      );
    }
  }, [currentUGTGroup?.id, trackingYear]);

  /*useEffect(() => {
    if (generateInfoMontList.monthList) {
      if (!selectMonth) {
        setSelectMonth(generateInfoMontList.monthList[0]);
      }
    }
  }, [generateInfoMontList]);*/

  useEffect(()=>{
    setSelectTab(generateRevision?.revisionList?.[0])
  },[generateRevision])

  const handleChangeTrackingYear = (year) => {
          // setTrackingYear(year);
          dispatch(setSettlementSelectedYear(year));
      
          // reset month list and selected month
          dispatch(setSettlementSelectedMonth(null));
        };
      
        const handleChangeTrackingMonth = (month) => {
          console.log(month);
          // setTrackingMonth(month);
          dispatch(setSettlementSelectedMonth(month));
        };

  console.log(state);
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <div>
                <h2 className="font-semibold text-xl text-black">
                  Generation Data Input
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / Settlement Management / Generation
                  Data Input / {state.portName} / {state.devicename}
                </p>
              </div>
            </div>
            
            {/* Active */}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="flex justify-between gap-2">
                <div className="content-center">
                  <div className="text-left flex gap-3 items-center">
                    <FaChevronCircleLeft
                      className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                      size="30"
                      onClick={() =>
                        navigate(WEB_URL.SETTLEMENT_GENERATE_DATA_INFO, {
                          state: {
                            id: state?.portfolioId,
                            name: state?.portName,
                          },
                        })
                      }
                    />

                    <div>
                      <div className="text-xl font-bold ">
                        {state.devicename}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="content-center">
                  <Form layout="horizontal" size="large">
                    <div className="grid grid-cols-2 gap-4 items-center pt-2">
                      <Form.Item className="pt-3 w-[130px]">
                        <Select
                          size="large"
                          value={trackingYear}
                          onChange={(value) => handleChangeTrackingYear(value)}
                        >
                          {generateInfoYearList?.yearList?.map(
                            (item, index) => (
                              <Select.Option
                                key={index}
                                value={item}
                                //disabled={item > latestYearHasData}
                              >
                                {item}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </Form.Item>

                      <Form.Item className="pt-3 w-[130px]">
                        <Select
                          size="large"
                          value={trackingMonth}
                          onChange={(value) => handleChangeTrackingMonth(value)}
                        >
                          {generateInfoMontList?.monthList?.map(
                            (item, index) => (
                              <Select.Option
                                key={index}
                                value={MONTH_LIST[item - 1].month}
                                //disabled={item > latestYearHasData}
                              >
                                {MONTH_LIST[item - 1].name}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              </div>
              <Divider className="mt-3" orientation="horizontal" size={"xs"} />
              <div className="text-sm mt-4">
                <div className="mt-5  flex border-b-2 border-[#87BE334D]">
                  {generateRevision?.revisionList ? (
                    generateRevision?.revisionList.map((item, index) => (
                      <div
                        key={index}
                        className={
                          selectTab === item
                            ? " w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center "
                            : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px] text-center border-none"
                        }
                      >
                        <button
                          className={
                            selectTab === item
                              ? "font-bold text-base"
                              : "text-[#949292] font-thin text-base"
                          }
                          onClick={() => setSelectTab(item)}
                        >
                          Revision {item}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div
                      className={
                        selectTab === 1
                          ? " w-36 pl-1 pt-2 pb-1 rounded-t-[10px] bg-[#87BE334D] text-center "
                          : "w-36 pl-1 pb-1 pt-2 rounded-t-[10px] text-center border-none"
                      }
                    >
                      <button
                        className={
                          selectTab === 1
                            ? "font-bold text-base"
                            : "text-[#949292] font-thin text-base"
                        }
                        onClick={() => setSelectTab(1)}
                      >
                        Revision 1
                      </button>
                    </div>
                  )}
                </div>
                <GenerateDataRevision
                  revision={selectTab}
                  portfolioId={state.portfolioId}
                  year={trackingYear}
                  month={trackingMonth}
                  deviceId={state.deviceid}
                  ugtGroupId={currentUGTGroup?.id}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // function prePage() {
  //   if (currentPage !== 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // }
  // function chageCPage(id) {
  //   alert(id);
  //   // setCurrentPage(id)
  // }
  // function nextPage() {
  //   if (currentPage !== npage) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // }
};

export default GenerateDataDetail;

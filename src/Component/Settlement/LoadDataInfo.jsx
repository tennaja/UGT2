import React, { useEffect, useState } from "react";
import { Card, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBox from "../Control/SearchBox";
import {
  getLoadDataInfoMonthList,
  getLoadDataInfoYearList,
  getLoadDataDashBoard,
  getLoadDataInfoList,
} from "../../Redux/Settlement/Action";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import { message } from "antd";
import DataDashBoard from "../assets/DataDashBoardIcon.svg";
import GraphDashboard from "../assets/GraphDashboardIcon.svg";
import ChartDashboard from "../assets/ChartDashBoardIcon.svg";
import { MONTH_LIST, USER_GROUP_ID } from "../../Constants/Constants";
import { Form, Select } from "antd";
import CircleCheck from "../assets/CircleCheck.svg";
import CircleTime from "../assets/CircleTime.svg";
import DataTableSettlement from "./DataTableSettlement";
import {
  setSettlementSelectedYear,
  setSettlementSelectedMonth,
} from "../../Redux/Menu/Action";

const LoadDatainfo = (props) => {
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

  const loadInfoYearList = useSelector(
    (state) => state.settlement.loadDataInfoYearList
  );
  const loadInfoMontList = useSelector(
    (state) => state.settlement.loadDataInfoMonthList
  );
  const loadDateDashBoard = useSelector(
    (state) => state.settlement.loadDataDashBoard
  );
  const loadDataInfoList = useSelector(
    (state) => state.settlement.loadDataInfoList
  );
  const trackingYear = useSelector((state) => state.menu?.settlementSelectYear);
  const trackingMonth = useSelector(
    (state) => state.menu?.settlementSelectMonth
  );
console.log(trackingMonth,trackingYear)
  console.log(loadDataInfoList);

  const [selectYear, setSelectyear] = useState(state.year);

  const [selectMonth, setSelectMonth] = useState(state.month);

  useEffect(() => {
    if (currentUGTGroup?.id) {
      dispatch(getLoadDataInfoYearList(currentUGTGroup?.id, state.id));
    }
  }, [currentUGTGroup?.id]);

  useEffect(() => {
    if (currentUGTGroup?.id && trackingMonth && trackingYear) {
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
        userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER
      ) {
        dispatch(
          getLoadDataDashBoard(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            1
          )
        );
        dispatch(
          getLoadDataInfoList(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            1
          )
        );
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
      ) {
        dispatch(
          getLoadDataDashBoard(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            2
          )
        );
        dispatch(
          getLoadDataInfoList(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            2
          )
        );
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
      ) {
        dispatch(
          getLoadDataDashBoard(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            3
          )
        );
        dispatch(
          getLoadDataInfoList(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            3
          )
        );
      } else {
        dispatch(
          getLoadDataDashBoard(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            0
          )
        );
        dispatch(
          getLoadDataInfoList(
            currentUGTGroup?.id,
            state.id,
            trackingYear,
            trackingMonth,
            0
          )
        );
      }
    }
  }, [currentUGTGroup?.id, trackingMonth, trackingYear]);

  /*useEffect(() => {
    if (loadInfoYearList.yearList) {
      if (!trackingYear) {
        setSelectyear(loadInfoYearList.yearList[0]);
        dispatch(setSettlementSelectedYear(loadInfoYearList.yearList[0]))
      }
    }
  }, [loadInfoYearList]);*/

  useEffect(() => {
    if (currentUGTGroup?.id && trackingYear) {
      dispatch(
        getLoadDataInfoMonthList(currentUGTGroup?.id, trackingYear, state.id)
      );
    }
  }, [currentUGTGroup?.id, trackingYear]);

  /*useEffect(() => {
    if (loadInfoMontList.monthList) {
      if (!trackingMonth) {
        setSelectMonth(loadInfoMontList.monthList[0]);
        dispatch(setSettlementSelectedMonth(loadInfoMontList.monthList[0]))
      }
    }
  }, [loadInfoMontList]);*/

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsActive = [
    {
      id: "subscriberName",
      label: "Subscriber Name",
      align: "left",
      maxWidth: "300px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div className="break-words">
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryActive]}
              autoEscape={true}
              textToHighlight={row.subscriberName}
            />
          </div>
          <label
            className={`${
              row?.subscriberType == 1
                ? "bg-[#E8E2F6] text-[#4c3486]"
                : "bg-[#D6EEF1] text-[#32686f]"
            } rounded w-max px-3 py-1 mt-1 text-xs font-normal`}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryActive]}
              autoEscape={true}
              textToHighlight={
                row.subscriberType == 1 ? "Subscriber" : "Aggregate Subscriber"
              }
            />
          </label>
        </div>
      ),
    },
    {
      id: "subscriberCode",
      label: "Subscriber Code",
      align: "left",
      maxWidth: "300px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div className="break-words">
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryActive]}
              autoEscape={true}
              textToHighlight={row.subscriberCode}
            />
          </div>
        </div>
      ),
    },
    {
      id: "utility",
      label: "Utility",
      maxWidth: "50px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.utility}
        />
      ),
    },
    {
      id: "revision1",
      label: "Revision 1",
      align: "center",
      maxWidth: "50px",
      render: (row) => (
        <div className="items-center flex justify-center">
          {row.revision1 == 0 ? (
            <img
              alt={"revision1"}
              src={CircleTime}
              width={20}
              height={20}
            ></img>
          ) : (
            <img
              alt={"revision1"}
              src={CircleCheck}
              width={20}
              height={20}
            ></img>
          )}
        </div>
      ),
    },
    {
      id: "totalLoad1",
      label: "Total Load (kWh)",
      align: "center",
      maxWidth: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={numeral(row.totalLoad1).format("0,0.00")}
        />
      ),
    },
    {
      id: "revision2",
      label: "Revision 2",
      align: "center",
      maxWidth: "50px",
      render: (row) => (
        <div className="items-center flex justify-center">
          {row.revision2 == 0 ? (
            <img
              alt={"revision1"}
              src={CircleTime}
              width={20}
              height={20}
            ></img>
          ) : (
            <img
              alt={"revision1"}
              src={CircleCheck}
              width={20}
              height={20}
            ></img>
          )}
        </div>
      ),
    },
    {
      id: "totalLoad2",
      label: "Total Load (kWh)",
      align: "center",
      maxWidth: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={numeral(row.totalLoad2).format("0,0.00")}
        />
      ),
    },
    {
      id: "evidence",
      label: "Upload Evidence",
      align: "center",
      maxWidth: "80px",
      render: (row) => (
        <div className="items-center flex justify-center">
          {row.evidence == 0 ? (
            <img
              alt={"revision1"}
              src={CircleTime}
              width={20}
              height={20}
            ></img>
          ) : (
            <img
              alt={"revision1"}
              src={CircleCheck}
              width={20}
              height={20}
            ></img>
          )}
        </div>
      ),
    },
    {
      id: "manage",
      label: "",
      maxWidth: "100px",
      render: (row) => (
        <div className="flex gap-2">
          <Link
            type="button"
            state={{
              subscriberId: row?.subscriberid,
              subscriberName: row?.subscriberName,
              year: trackingYear,
              month: trackingMonth,
              portfolioId: state.id,
              portName: state.name,
            }}
            to={WEB_URL.SETTLEMENT_LOAD_DATA_DETAIL}
            className="flex no-underline rounded p-2 cursor-pointer text-sm items-center w-[100px] justify-center hover:bg-[#4D6A00] bg-[#87BE33]"
          >
            <label className="flex items-center m-auto cursor-pointer text-white font-semibold gap-1">
              View
            </label>
          </Link>
        </div>
      ),
    },

    // Add more columns as needed
  ];

  const [searchQueryActive, setSearchQueryActive] = useState("");

  const handleSearchChangeActive = (e) => {
    setSearchQueryActive(e.target.value);
  };

  console.log(loadDateDashBoard);
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div className="grid grid-cols-3">
              <div className="col-start-1 col-span-2">
                <h2 className="font-semibold text-xl text-black">
                  {state.name}
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / Settlement Management / Load
                  Data Input / {state.name}
                </p>
              </div>
              <div className="col-start-3">
                <div className="grid grid-cols-4">
                  <Form.Item className="col-span-2 col-start-1">
                    <Select
                      size="large"
                      value={trackingYear}
                      onChange={(value) => dispatch(setSettlementSelectedYear(value))}
                    >
                      {loadInfoYearList?.yearList?.map((item, index) => (
                        <Select.Option
                          key={index}
                          value={item}
                          //disabled={item > latestYearHasData}
                        >
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item className="col-span-2 col-start-3 ml-2">
                    <Select
                      size="large"
                      value={trackingMonth}
                      onChange={(value) => dispatch(setSettlementSelectedMonth(value))}
                    >
                      {loadInfoMontList?.monthList?.map((item, index) => (
                        <Select.Option
                          key={index}
                          value={MONTH_LIST[item - 1].month}
                          //disabled={item > latestYearHasData}
                        >
                          {MONTH_LIST[item - 1].name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-rows-3 sm:grid-col-1 lg:grid-rows-1 lg:grid-cols-3 justify-start items-start gap-3">
              <div>
                <Card
                  shadow="md"
                  radius="lg"
                  className="flex w-full h-[150px]"
                  padding="lg"
                >
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div
                        style={{ borderRadius: "50%" }}
                        className={`flex justify-center w-[55px] h-[55px] mb-2 bg-[#87BE3326]`}
                      >
                        {/* <CgCircleci className="text-green-500 w-[50px] h-[50px] mb-2"></CgCircleci> */}
                        <img
                          alt={"subscriber"}
                          src={DataDashBoard}
                          width={30}
                          height={30}
                        ></img>
                      </div>
                      <div className="text-end">
                        <label className="text-3xl font-semibold flex justify-end">
                          {loadDateDashBoard?.loadDataInputRevision1}
                        </label>
                        <span> </span>
                        <label className="text-base font-medium text-slate-500">
                          {"out of " + loadDateDashBoard?.outOf}
                        </label>
                      </div>
                    </div>
                    <div className="font-bold mt-1">
                      Load Data Input (Revision 1)
                    </div>
                    <div className="text-gray-500 text-xs">
                      A number of Load Data Inputs submitted via API
                      successfully
                    </div>
                  </div>
                </Card>
                <Card
                  shadow="md"
                  radius="lg"
                  className="flex w-full h-[150px] mt-3"
                  padding="lg"
                >
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div
                        style={{ borderRadius: "50%" }}
                        className={`flex justify-center w-[55px] h-[55px] mb-2 bg-[#87BE3326]`}
                      >
                        {/* <CgCircleci className="text-green-500 w-[50px] h-[50px] mb-2"></CgCircleci> */}
                        <img
                          alt={"subscriber"}
                          src={DataDashBoard}
                          width={30}
                          height={30}
                        ></img>
                      </div>
                      <div className="text-end">
                        <label className="text-3xl font-semibold flex justify-end">
                          {loadDateDashBoard?.loadDataInputRevision2}
                        </label>
                        <span> </span>
                        <label className="text-base font-medium text-slate-500">
                          {"out of " + loadDateDashBoard?.outOf}
                        </label>
                      </div>
                    </div>
                    <div className="font-bold mt-1">
                      Load Data Input (Revision 2)
                    </div>
                    <div className="text-gray-500 text-xs">
                      A number of Load Data Inputs submitted via API
                      successfully
                    </div>
                  </div>
                </Card>
              </div>

              <Card
                shadow="md"
                radius="lg"
                className="flex w-full h-full"
                padding="lg"
              >
                <div className="w-full">
                  <div className="flex justify-between">
                    <div
                      style={{ borderRadius: "50%" }}
                      className={`flex justify-center w-[75px] h-[75px] mb-2 bg-[#3370BF26]`}
                    >
                      <img
                        alt={"ig"}
                        src={GraphDashboard}
                        width={50}
                        height={50}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-4xl font-semibold flex justify-end">
                        {numeral(loadDateDashBoard?.totalLoad).format("0,0.00")}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        kWh
                      </label>
                    </div>
                  </div>
                  <div className="font-bold mt-10">Total Load</div>
                  <div className="text-gray-500 text-xs">
                    The summation of latest load volume of each subscriber
                    submitted via API successfully
                  </div>
                  <div className="text-gray-500 text-xs text-right mt-2">
                    Last Updated on {loadDateDashBoard?.lastUpdate}
                  </div>
                </div>
              </Card>

              <Card
                shadow="md"
                radius="lg"
                className="flex w-full h-full"
                padding="lg"
              >
                <div className="w-full">
                  <div className="flex justify-between">
                    <div
                      style={{ borderRadius: "50%" }}
                      className={`flex justify-center w-[75px] h-[75px] bg-[#FFAD3326] mb-2 `}
                    >
                      <img
                        alt={"ig"}
                        src={ChartDashboard}
                        width={40}
                        height={40}
                      ></img>
                    </div>
                    <div className="text-end">
                      <label className="text-4xl font-semibold flex justify-end">
                        {loadDateDashBoard?.volumeEvidence}
                      </label>
                      <span> </span>
                      <label className="text-lg font-medium text-slate-500">
                        {"out of " + loadDateDashBoard?.outOf}
                      </label>
                    </div>
                  </div>
                  <div className="font-bold mt-10">Volume Evidence</div>
                  <div className="text-gray-500 text-xs">
                    A number of generation volume evidences submitted
                    successfully however, validity is depend on the Issuer
                    consideration. The volume evidence is necessary for REC
                    issuance.
                  </div>
                </div>
              </Card>
            </div>

            {/* Active */}
            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="xl"
            >
              <div className="text-sm">
                <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6">
                  <div className="col-span-2 mb-4">
                    <span className="font-bold text-lg">
                      Load Data Input
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      ></label>
                    </span>
                  </div>

                  <div className="grid col-span-4 grid-cols-12">
                    <form className="grid col-span-12 grid-cols-12 gap-2 ">
                      {/* <div className="col-span-3 px-2"></div> */}
                      {/* {!isPortManager && <div className="col-span-4"></div>} */}
                      <div className="col-span-4"></div>
                      <div className="col-span-4"></div>
                      <div className="col-span-4">
                        <Controller
                          name="SearchText"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <SearchBox
                              placeholder="Search"
                              onChange={handleSearchChangeActive}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>

                <DataTableSettlement
                  data={loadDataInfoList}
                  columns={columnsActive}
                  searchData={searchQueryActive}
                  checkbox={false}
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

export default LoadDatainfo;

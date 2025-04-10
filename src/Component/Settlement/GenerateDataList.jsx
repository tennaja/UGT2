import React, { useEffect, useState } from "react";
import { Card, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import SearchBox from "../Control/SearchBox";
import { Form, Select } from "antd";
import { MONTH_LIST, USER_GROUP_ID } from "../../Constants/Constants";
import DataTableSubmenu from "./DataTableSubmenu";
import Highlighter from "react-highlight-words";
import {
  getGenerateDataInputList,
  getGenerateDataYearList,
  getGenerateDataMonthList,
} from "../../Redux/Settlement/Action";
import {
  setSettlementSelectedYear,
  setSettlementSelectedMonth,
} from "../../Redux/Menu/Action";

const GenerateDataList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const mockYear = [{ year: 2024 }, { year: 2025 }];

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const generateDataList = useSelector(
    (state) => state.settlement.generateDataInputList
  );
  const generateDataMonthList = useSelector(
    (state) => state.settlement.generateDataMonthList
  );
  const generateDataYearList = useSelector(
    (state) => state.settlement.generateDataYearList
  );

  const trackingYear = useSelector((state) => state.menu?.settlementSelectYear);
    const trackingMonth = useSelector(
      (state) => state.menu?.settlementSelectMonth
    );
  console.log(currentUGTGroup?.id);
  console.log(generateDataList);
  const [selectYear, setSelectyear] = useState("");

  const [selectMonth, setSelectMonth] = useState("");

  const [searchQueryActive, setSearchQueryActive] = useState("");

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  useEffect(() => {
    if (currentUGTGroup?.id && trackingYear && trackingMonth) {
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
      ) {
        dispatch(
          getGenerateDataInputList(
            currentUGTGroup?.id,
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
          getGenerateDataInputList(
            currentUGTGroup?.id,
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
          getGenerateDataInputList(
            currentUGTGroup?.id,
            trackingYear,
            trackingMonth,
            3
          )
        );
      } else {
        dispatch(
          getGenerateDataInputList(
            currentUGTGroup?.id,
            trackingYear,
            trackingMonth,
            0
          )
        );
      }
    }

    if (currentUGTGroup?.id) {
      dispatch(getGenerateDataYearList(currentUGTGroup?.id, 0));
      /*if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
      ) {
        dispatch(getGenerateDataYearList(currentUGTGroup?.id, 1));
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
      ) {
        dispatch(getGenerateDataYearList(currentUGTGroup?.id, 2));
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
      ) {
        dispatch(getGenerateDataYearList(currentUGTGroup?.id, 3));
      } else {
        dispatch(getGenerateDataYearList(currentUGTGroup?.id, 0));
      }*/
    }

    if (currentUGTGroup?.id && trackingYear) {
      dispatch(getGenerateDataMonthList(currentUGTGroup?.id, trackingYear));
    }
  }, [trackingYear, trackingMonth, currentUGTGroup?.id]);

  useEffect(() => {
    /*if (generateDataYearList.yearList) {
      if (!selectYear) {
        setSelectyear(generateDataYearList.yearList[0]);
      }
    }*/

    if (
      generateDataYearList.yearList &&
          !generateDataYearList.yearList.includes(trackingYear)
        ) {
          const lastesr_year = generateDataYearList.yearList.slice(-1);
          console.log(lastesr_year[0]);
          console.log(trackingYear);
          //dispatch(setSelectedYear(lastesr_year[0]))
          dispatch(setSettlementSelectedYear(lastesr_year[0]));
        }
  }, [generateDataYearList]);

  /*useEffect(() => {
    if (generateDataMonthList.monthList) {
      if (!selectMonth) {
        setSelectMonth(generateDataMonthList.monthList[0]);
      }
    }
  }, [generateDataMonthList]);*/

  const handleSearchChangeActive = (e) => {
    setSearchQueryActive(e.target.value);
  };
  const columnsActive = [
    {
      id: "portfolio",
      label: "Portfolio",
      align: "left",
      width: "200px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <style>{`
        .highlight {
          background-color: yellow;
          font-weight: bold;
        }
      `}</style>
          <div
            className="break-words"
            style={{
              // whiteSpace: "nowrap",
              // overflow: "hidden",
              // textOverflow: "ellipsis",
              maxWidth: "300px",
            }}
          >
            <Highlighter
              highlightClassName="highlight"
              highlightTag={Highlight}
              searchWords={[searchQueryActive]}
              autoEscape={true}
              textToHighlight={row.portfolioName}
            />
          </div>
        </div>
      ),
    },
    {
      id: "startDate",
      label: "Number of Devices",
      width: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },

    {
      id: "endDate",
      label: "Number of Subscribers",
      width: "100px",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
    {
      id: "revision1",
      label: "Mechanism",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.revision1}
        />
      ),
    },
    {
      id: "revision2",
      label: "Start Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.revision2}
        />
      ),
    },
    {
      id: "evidence",
      label: "End Date",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchQueryActive]}
          autoEscape={true}
          textToHighlight={row.evidence}
        />
      ),
    },
    {
      id: "manage",
      label: "",
      render: (row) => (
        <div className="flex gap-2">
          <Link
            type="button"
            state={{
              id: row?.portfolioId,
              name: row?.portfolioName,
              year: trackingYear,
              month: trackingMonth,
            }}
            to={WEB_URL.SETTLEMENT_GENERATE_DATA_INFO}
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

  console.log(trackingMonth, trackingYear, generateDataMonthList);
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div className="grid grid-cols-2">
              <div className="col-start-1">
                <h2 className="font-semibold text-xl text-black">
                  Generation Data Input
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / Settlement Management / Generation
                  Data Input
                </p>
              </div>
              <div className="col-start-2">
                <div className="grid grid-cols-4">
                  <Form.Item className="col-span-1 col-start-3">
                    <Select
                      size="large"
                      value={trackingYear}
                      onChange={(value) => handleChangeTrackingYear(value)}
                    >
                      {generateDataYearList?.yearList?.map((item, index) => (
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

                  <Form.Item className="col-span-1 col-start-4 ml-2">
                    <Select
                      size="large"
                      value={trackingMonth}
                      onChange={(value) => handleChangeTrackingMonth(value)}
                    >
                      {generateDataMonthList?.monthList?.map((item, index) => (
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
                      Active Portfolio
                      <br />
                      <label
                        className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                      >
                        {generateDataList.length}{" "}
                        {generateDataList.length > 1
                          ? "Portfolios"
                          : "Portfolio"}
                      </label>
                    </span>
                  </div>

                  <div className="grid col-span-4 grid-cols-12">
                    <form className="grid col-span-12 grid-cols-12 gap-2 ">
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
                <DataTableSubmenu
                  data={generateDataList}
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
};

export default GenerateDataList;

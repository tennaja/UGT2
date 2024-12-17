import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Card, Title, Group, Divider, Badge } from "@mantine/core";
import { Form, Select } from "antd";
import { useNavigate } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import {
  setSelectedYear,
  setSelectedMonth,
  getSettlementOverview,
  getSettlementOverviewSummary,
  getPortfolioYearList,
} from "../../Redux/Settlement/Action";
import { useDispatch, useSelector } from "react-redux";
import {
  USER_GROUP_ID,
  MONTH_LIST,
  CONVERT_UNIT,
} from "../../Constants/Constants";
import { Stack } from "@mui/material";
import numeral from "numeral";

// Chart import
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Icon import
import { LuFileCheck } from "react-icons/lu";
import { IoBriefcaseOutline } from "react-icons/io5";
import { AiOutlineExport } from "react-icons/ai";
import { TbLineDashed } from "react-icons/tb";
import { BsDashLg } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronCircleLeft } from "react-icons/fa";
import noContent from "../assets/no-content.png";

const customLegendBarRow1 = [
  { name: "Actual Solar", color: "#4D6A00" },
  { name: "Actual Wind", color: "#87BE33" },
  { name: "Actual Hydro", color: "#02C6F6" },
];

const customLegendBarRow2 = [
  { name: "UGT2 Inventory", color: "#33BFBF" },
  { name: "UGT1 Inventory", color: "#F7A042" },
  { name: "Unmatched Energy", color: "#B0BAC9" },
];

const customLegendLine = [
  { name: "Contracted Consumption", color: "#B0BAC9", style: "dash" },
  { name: "Actual Consumption", color: "#005E4D", style: "solid" },
  { name: "Net Deliverables", color: "#EF4835", style: "solid" },
];

const Overview = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ugtGroupId, portfolioId, portfolioName, hasSettlementData } = props;

  const [isModuleViewerUser, setIsModuleViewerUser] = useState(false);
  const userData = useSelector((state) => state.login.userobj);

  useEffect(() => {
    if (ugtGroupId !== undefined) {
      if (userData?.userGroup?.id == USER_GROUP_ID.ALL_MODULE_VIEWER) {
        setIsModuleViewerUser(true);
      }
    }
  }, [ugtGroupId, userData]);

  // console.log(ugtGroupId, portfolioId, portfolioName);

  const yearListData = useSelector((state) => state.settlement.yearList);
  const settlementYear = useSelector((state) => state.settlement.selectedYear);
  const settlementOverviewData = useSelector(
    (state) => state.settlement.settlementOverview
  );
  const settlementOverviewSummaryData = useSelector(
    (state) => state.settlement.settlementOverviewSummary
  );

  const [tmpOverviewChartData, setTmpOverviewChartData] = useState();
  const [overviewDataUnit, setOverviewDataUnit] = useState(
    CONVERT_UNIT[0].unit
  );
  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[0].convertValue);
  const [latestYearHasData, setLatestYearHasData] = useState(
    yearListData.latestYearHasData
  );

  //console.log("Data Unit",CONVERT_UNIT)

  //console.log("Unit",overviewDataUnit,convertUnit)

  useEffect(() => {
    // get year list
    if (ugtGroupId) {
      dispatch(getPortfolioYearList(ugtGroupId, portfolioId));
    }
  }, [ugtGroupId]);
  const [canViewSettlementDetail, setCanViewSettlementDetail] = useState(false);

  useEffect(() => {
    // set selected year
    if (yearListData?.latestYearHasData) {
      dispatch(setSelectedYear(yearListData.latestYearHasData));
      setLatestYearHasData(yearListData.latestYearHasData); // เอาไว้เช็ค dropdown และ set disable ไว้

      // if (
      //   yearListData?.yearList.some((item) => item == settlementYear) &&
      //   settlementYear <= yearListData?.latestYearHasData
      // ) {
      //   // มีปีที่เลือกไว้แล้ว จากหน้า approve
      //   // set to redux
      //   dispatch(setSelectedYear(settlementYear));
      // } else {
      //   // set to redux
      //   dispatch(setSelectedYear(yearListData.latestYearHasData));
      // }
    } else {
      dispatch(setSelectedYear(null));
    }
  }, [yearListData]);

  useEffect(() => {
    if (settlementYear) {
      // กรณีเลือกปีแล้ว ให้เรียก api data
      dispatch(getSettlementOverview(ugtGroupId, portfolioId, settlementYear));
      dispatch(
        getSettlementOverviewSummary(ugtGroupId, portfolioId, settlementYear)
      );
    } else {
      // กรณีเข้ามาครั้งแรก ให้เรียก api yearList ใหม่
      dispatch(getPortfolioYearList(ugtGroupId, portfolioId));
    }
  }, [settlementYear]);

  useEffect(() => {
    if (
      settlementOverviewData !== undefined &&
      settlementOverviewData?.length > 0
    ) {
      handleChangeOverviewUnit(CONVERT_UNIT[0].unit);
      setCanViewSettlementDetail(true);
    } else {
      setTmpOverviewChartData([]);
      setCanViewSettlementDetail(false);
    }
    // if user is ModuleViewer then can view only.
    if (isModuleViewerUser !== undefined && isModuleViewerUser) {
      setCanViewSettlementDetail(true);
    }
  }, [settlementOverviewData]);

  useEffect(() => {
    // เช็ค มีข้อมูล settlement ของเดือนหรือไม่
    // ถ้ามี สามารถดูได้
    // ถ้าไม่มี ไม่สามารถดูได้
    if (hasSettlementData && isModuleViewerUser) {
      setCanViewSettlementDetail(true);
    } else {
      setCanViewSettlementDetail(false);
    }
  });

  const handleChangeOverviewYear = (year) => {
    dispatch(setSelectedYear(year));
    dispatch(setSelectedMonth()); // เคลียร์ค่าที่ redux
  };

  const getTooltipLabel = (shortLabel) => {
    const longLabel = MONTH_LIST.filter((obj) => {
      return obj.month == shortLabel;
    });

    return longLabel[0].name;
  };

  const handleChangeOverviewUnit = (unit) => {
    //console.log("Handle unit",unit)
    const unitObj = CONVERT_UNIT.filter((obj) => {
      return obj.unit == unit;
    });
    setOverviewDataUnit(unit);
    setConvertUnit(unitObj[0].convertValue);
    setTmpOverviewChartData(
      convertChartData(settlementOverviewData, unitObj[0].convertValue)
    );
  };

  const convertChartData = (overviewChartData, convertUnit) => {
    const new_overviewChartData = overviewChartData.map((item) => {
      const new_item = {
        year: item.year,
        month: item.month,
        matchedEnergy: item.matchedEnergy * convertUnit,
        actualGeneration: item.actualGeneration * convertUnit,
        contractedConsumption: item.contractedConsumption * convertUnit,
        actualConsumption: item.actualConsumption * convertUnit,
        netDeliverables: item.netDeliverables * convertUnit,
        actualSolar: item.actualSolar * convertUnit,
        actualWind: item.actualWind * convertUnit,
        actualHydro: item.actualHydro * convertUnit,
        ugt1Inventory: item.ugt1Inventory * convertUnit,
        ugt2Inventory: item.ugt2Inventory * convertUnit,
        grid: item.grid * convertUnit,
        totalContractedLoad: item.totalContractedLoad * convertUnit,
        totalLoad: item.totalLoad * convertUnit,
        totalGeneration: item.totalGeneration * convertUnit,
        netGreenDeliverables: item.netGreenDeliverables * convertUnit,
        generationMatched: item.generationMatched * convertUnit,
        unmatchedEnergy : item.unmatchedEnergy * convertUnit
      };
      return new_item;
    });
    return new_overviewChartData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    //console.log("Payload",payload)
    if (active && payload && payload.length) {
      let datafilter = settlementOverviewData.filter((item)=> item.year == payload[0].payload.year && item.month == payload[0].payload.month)

      const _totalContractLoad = payload?.[0]?.payload?.totalContractedLoad > 0 ? convertData(payload?.[0]?.payload?.totalContractedLoad) : "-";
      const _totalLoad = payload?.[0]?.payload?.totalLoad > 0?convertData(payload?.[0]?.payload?.totalLoad) : "-";
      const _totalGeneration = payload?.[0]?.payload?.totalGeneration > 0 ? convertData(payload?.[0]?.payload?.totalGeneration) : "-";
      const _netGreenDeliverabled = payload?.[0]?.payload?.netGreenDeliverables > 0 ? convertData(payload?.[0]?.payload?.netGreenDeliverables) : "-";
      const _generationMatched = payload?.[0]?.payload?.generationMatched > 0 ?convertData(payload?.[0]?.payload?.generationMatched) : "-";
      const _ugt2InventoryNew = payload[4].value > 0 ? convertData(payload[4].value) : "-";
      const _ugt1InventoryNew = payload[3].value > 0 ? convertData(payload[3].value) : "-";
      const _unmatchedEnergy = payload?.[0]?.payload?.unmatchedEnergy > 0? convertData(payload?.[0]?.payload?.unmatchedEnergy) : "-";

      //console.log("Data",datafilter?.totalContractedLoad,datafilter?.totalLoad,datafilter?.totalGeneration,datafilter?.netGreenDeliverables,datafilter?.generationMatched,datafilter?.ugt2Inventory,datafilter?.ugt1Inventory,datafilter?.unmatchedEnergy)
      
      //console.log("Data filter",datafilter)
      /*const _matchedEnergy =
        payload?.[0]?.payload?.matchedEnergy > 0
          ? convertData(payload[0].payload.matchedEnergy)
          : "-";
      const _netDeliverables =
        payload[0].payload.netDeliverables > 0
          ? convertData(payload[0].payload.netDeliverables)
          : "-";
      const _actualGeneration =
        payload[0].payload.actualGeneration > 0
          ? convertData(payload[0].payload.actualGeneration)
          : "-";
      const _actualSolar =
        payload[0].value > 0 ? convertData(payload[0].value) : "-";
      const _actualWind =
        payload[1].value > 0 ? convertData(payload[1].value) : "-";
      const _actualHydro =
        payload[2].value > 0 ? convertData(payload[2].value) : "-";
      const _ugt1Inventory =
        payload[3].value > 0 ? convertData(payload[3].value) : "-";
      const _ugt2Inventory =
        payload[4].value > 0 ? convertData(payload[4].value) : "-";
      const _grid =
        payload[5].value > 0 ? convertData(payload[5].value) : "-";*/

      return (
        <div className="bg-[#F5F4E9] rounded p-3 text-left">
          <div className="pb-2">
            <div className="text-sm font-bold">{getTooltipLabel(label)}</div>
            <div className="text-xs">Total Contracted Load: <label className="text-[#4D6A00] font-semibold">{` ${
              _totalContractLoad + " " + overviewDataUnit
            }`}</label></div>
            <div className="text-xs">Total Load: <label className="text-[#4D6A00] font-semibold">{` ${
              _totalLoad + " " + overviewDataUnit
            }`}</label></div>
            <div className="text-xs">Total Generation:<label className="text-[#4D6A00] font-semibold">{` ${
              _totalGeneration + " " + overviewDataUnit
            }`}</label></div>
            <div className="text-xs">Net Green Deliverables:<label className="text-[#4D6A00] font-semibold">{` ${
              _netGreenDeliverabled + " " + overviewDataUnit
            }`}</label></div>
          </div>
          <Divider orientation="horizontal" size={"xs"} />
          <div className="pt-2">
            <div className="text-xs">Generation Matched:<label className="text-[#4D6A00] font-semibold">{` ${
              _generationMatched + " " + overviewDataUnit
            }`}</label></div>
            <div className="text-xs">UGT 2 Inventory: <label className="text-[#4D6A00] font-semibold">{` ${
              _ugt2InventoryNew + " " + overviewDataUnit
            }`}</label></div>
            <div className="text-xs">UGT 1 Inventory: <label className="text-[#4D6A00] font-semibold" >{` ${
              _ugt1InventoryNew + " " + overviewDataUnit
            }`}</label></div>
            <div className="text-xs">Unmatched Energy: <label className="text-[#4D6A00] font-semibold">{` ${
              _unmatchedEnergy + " " + overviewDataUnit
            }`}</label></div>
          </div>
        </div>
      );
    }
    return null;
  };

  const convertData = (value) => {
    let decFixed = 3;
    if (overviewDataUnit == "kWh") {
      decFixed = 3;
    } else if (overviewDataUnit == "MWh") {
      decFixed = 6;
    } else if (overviewDataUnit == "GWh") {
      decFixed = 6;
    }

    if (value) {
      if (decFixed == 3) {
        return numeral(value).format("0,0.000");
      }
      if (decFixed == 6) {
        return numeral(value).format("0,0.000000");
      }
    } else {
      return "-";
    }
  };

  return settlementYear ? (
    <Card shadow="md" radius="lg" className="flex" padding="xl">
      <div className="flex justify-between pb-3">
        <div className="text-left flex gap-3 items-center">
          <FaChevronCircleLeft
            className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
            size="30"
            onClick={() => navigate(WEB_URL.SETTLEMENT_INFO)}
          />

          <div>
            <div className="text-xl font-bold ">Settlement Dashboard</div>
          </div>
        </div>

        {/*<Button
          className={`bg-[#87BE33] hover:bg-[#4D6A00] 
          ${!canViewSettlementDetail && "opacity-20"}`}
          onClick={() =>
            navigate(WEB_URL.SETTLEMENT_APPROVAL, {
              state: {
                ugtGroupId: ugtGroupId,
                portfolioId: portfolioId,
                portfolioName: portfolioName,
                prevSelectedYear: settlementYear,
              },
            })
          }
          disabled={!canViewSettlementDetail}
        >
          <span className="font-semobold text-white ">View</span>
        </Button>*/}
      </div>
      <Divider orientation="horizontal" size={"xs"} />

      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold text-[#4D6A00]">Overview</div>

        <Form layout="horizontal" size="large">
          <div className={`grid gap-4 pt-4 grid-cols-2`}>
            {/*Select Unit Filter convert */}
            <Form.Item className="col-span-1">
              <Select
                size="large"
                value={overviewDataUnit}
                variant="borderless"
                onChange={(value) => handleChangeOverviewUnit(value)}
                //className={`${!canViewSettlementDetail && "opacity-20"}`}
              >
                {CONVERT_UNIT?.map((item, index) => (
                  <Select.Option key={index} value={item.unit}>
                    {item.unit}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/*Select Year filter */}
            <Form.Item className="col-span-1">
              <Select
                size="large"
                value={settlementYear}
                onChange={(value) => handleChangeOverviewYear(value)}
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

            {/*<Button
              className={`bg-[#F5F4E9] text-[#4D6A00] ${
                !canViewSettlementDetail && "opacity-20"
              }`}
              rightSection={<AiOutlineExport size={14} />}
              disabled={!canViewSettlementDetail}
            >
              Export
            </Button>*/}
          </div>
        </Form>
      </div>

      {tmpOverviewChartData?.length > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-8 mt-3">
            <div className="col-span-3">
              <div className="text-md font-semibold mb-10 text-left">
                Settlement Summary
              </div>

              {tmpOverviewChartData && (
                <>
                  <ResponsiveContainer width={"100%"} height={300}>
                    <ComposedChart
                      key={overviewDataUnit}
                      data={tmpOverviewChartData}
                      margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis
                        dataKey="month"
                        scale="auto"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(tick) => {
                          return MONTH_LIST[tick - 1].abbr;
                        }}
                      />
                      <YAxis
                        width={80}
                        label={{
                          fontSize: 11,
                          value: overviewDataUnit,
                          angle: -90,
                          position: "insideLeft",
                        }}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(tick) => {
                          return numeral(tick).format("0,0.[00]");
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      <Bar
                        dataKey="actualSolar"
                        stackId="a"
                        barSize={25}
                        fill="#4D6A00"
                      />
                      <Bar
                        dataKey="actualWind"
                        stackId="a"
                        barSize={25}
                        fill="#87BE33"
                      />
                      <Bar
                        dataKey="actualHydro"
                        stackId="a"
                        barSize={25}
                        fill="#02C6F6"
                      />
                      <Bar
                        dataKey="ugt2Inventory"
                        stackId="a"
                        barSize={25}
                        fill="#33BFBF"
                      />
                      <Bar
                        dataKey="ugt1Inventory"
                        stackId="a"
                        barSize={25}
                        fill="#F7A042"
                      />
                      <Bar
                        dataKey="grid"
                        stackId="a"
                        barSize={25}
                        fill="#B0BAC9"
                      />
                      <Line
                        type="monotone"
                        dataKey="actualConsumption"
                        stroke="#005E4D"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="netDeliverables"
                        stroke="#EF4835"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="contractedConsumption"
                        stroke="#848789"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>

                  {/* custom legend */}
                  <div className="flex flex-col items-center justify-center mt-3">
                    <Stack gap={2} alignItems={"center"}>
                      <div className="flex gap-5">
                        {customLegendBarRow1.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: `${item.color}` }}
                            />
                            <div className="text-xs">{item.name}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-5">
                        {customLegendBarRow2.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: `${item.color}` }}
                            />
                            <div className="text-xs">{item.name}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-5">
                        {customLegendLine.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {item.style == "solid" ? (
                              <BsDashLg color={item.color} size={40} />
                            ) : (
                              <TbLineDashed color={item.color} size={40} />
                            )}
                            <div className="text-xs">{item.name}</div>
                          </div>
                        ))}
                      </div>
                    </Stack>
                  </div>
                </>
              )}
            </div>

            <div className="col-span-1 flex flex-col justify-around text-left">
              <div>
                <div className="text-sm font-normal text-[#5B5C5C]">
                  Accumulated Total Contracted Load
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedTotalContractedLoad *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />

              <div>
                <div className="text-sm font-normal text-[#5B5C5C]">
                  Accumulated Total Load
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedTotalLoad *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />

              <div>
                <div className="text-sm font-normal text-[#5B5C5C]">
                  Accumulated Total Generation
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedTotalGeneration *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />

              <div>
                <div className="text-sm font-normal text-[#5B5C5C]">
                  Accumulated Net Green Deliverables
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedNetGreenDeliverables *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>

                <div className="text-right inline-block w-full">
                    <div className="text-xl font-bold w-full ">{settlementOverviewSummaryData?.accumulatedNetGreenDeliverablesofTotalLoad+"% "}<label className="text-xs font-normal text-[#5B5C5C]">of Total Load</label></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 container mx-auto gap-2 mt-10 text-left">
            <div className="border-r-2">
              <div className="mr-2">
                <div className="text-sm font-normal text-[#5B5C5C]">
                Accumulated Actual Generation Matched
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedActualGenerationMatched *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>

                <div className="text-right inline-block w-full">
                    <div className="text-xl font-bold w-full">{settlementOverviewSummaryData?.accumulatedActualGenerationMatchedofTotalLoad+"% "}<label className="text-xs font-normal text-[#5B5C5C]">of Total Load</label></div>
                </div>
              </div>
            </div>
            
            <div className="border-r-2">
            <div className="mr-2">
                <div className="text-sm font-normal text-[#5B5C5C]">
                Accumulated UGT2 Inventory Matched
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedUGT2InventoryMatched *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>
                <div className="text-right inline-block w-full">
                    <div className="text-xl font-bold w-full">{settlementOverviewSummaryData?.accumulatedUGT2InventoryMatchedofTotalLoad+"% "}<label className="text-xs font-normal text-[#5B5C5C]">of Total Load</label></div>
                </div>
              </div>
            </div>
            <div className="border-r-2">
            <div className="mr-2">
                <div className="text-sm font-normal text-[#5B5C5C]">
                Accumulated UGT1 Inventory Matched
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedUGT1InventoryMatched *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>
                <div className="text-right inline-block w-full">
                    <div className="text-xl font-bold w-full">{settlementOverviewSummaryData?.accumulatedUGT1InventoryMatchedofTotalLoad+"% "}<label className="text-xs font-normal text-[#5B5C5C]">of Total Load</label></div>
                </div>
              </div>
            </div>
            <div>
            <div>
                <div className="text-sm font-normal text-[#5B5C5C]">
                Accumulated Unmatched Energy
                </div>
                <div className="text-xl lg:mt-[20px] font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedUnmatchedEnergy *
                      convertUnit
                  )}
                </div>

                <div className="text-xs font-normal text-[#5B5C5C]">
                  {overviewDataUnit}
                </div>
                <div className="text-right inline-block w-full">
                    <div className="text-xl font-bold w-full">{settlementOverviewSummaryData?.accumulatedUnmatchedEnergyofTotalLoad+"% "}<label className="text-xs font-normal text-[#5B5C5C]">of Total Load</label></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-sm font-normal gap-2 mt-4 h-[400px]">
          <img src={noContent} alt="React Logo" width={50} height={50} />
          <div>No Settlement Data.</div>
        </div>

        // <div className="text-sm font-normal pt-5">No Settlement Data.</div>
      )}
    </Card>
  ) : (
    <Card shadow="md" radius="lg" className="flex" padding="xl">
      <div className="flex justify-between pb-3">
        <div className="text-left flex gap-3 items-center">
          <FaChevronCircleLeft
            className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
            size="30"
            onClick={() => navigate(WEB_URL.SETTLEMENT_INFO)}
          />

          <div>
            <div className="text-xl font-bold ">Settlement Dashboard</div>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" size={"xs"} />

      <div className="flex flex-col items-center justify-center text-sm font-normal gap-2 mt-4 h-[400px]">
        <img src={noContent} alt="React Logo" width={50} height={50} />
        <div>No Settlement Data.</div>
      </div>
    </Card>
  );
};

export default Overview;

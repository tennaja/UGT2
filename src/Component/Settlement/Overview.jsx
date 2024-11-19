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
  { name: "Grid", color: "#B0BAC9" },
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
    CONVERT_UNIT[1].unit
  );
  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[1].convertValue);
  const [latestYearHasData, setLatestYearHasData] = useState(
    yearListData.latestYearHasData
  );

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
      handleChangeOverviewUnit(CONVERT_UNIT[1].unit);
      setCanViewSettlementDetail(true);
    } else {
      setTmpOverviewChartData([]);
      setCanViewSettlementDetail(false);
    }
    // if user is ModuleViewer then can view only.
    if (isModuleViewerUser !== undefined && isModuleViewerUser) {
      setCanViewSettlementDetail(false);
    }
  }, [settlementOverviewData]);

  useEffect(() => {
    // เช็ค มีข้อมูล settlement ของเดือนหรือไม่
    // ถ้ามี สามารถดูได้
    // ถ้าไม่มี ไม่สามารถดูได้
    if (hasSettlementData && !isModuleViewerUser) {
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
      };
      return new_item;
    });
    return new_overviewChartData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const _matchedEnergy =
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
        payload[5].value > 0 ? convertData(payload[5].value) : "-";

      return (
        <div className="bg-[#F5F4E9] rounded p-3 text-left">
          <div className="pb-2">
            <div className="text-sm font-bold">{getTooltipLabel(label)}</div>
            <div className="text-xs">{`Matched Energy: ${
              _matchedEnergy + " " + overviewDataUnit
            }`}</div>
            <div className="text-xs">{`Net Deliverables: ${
              _netDeliverables + " " + overviewDataUnit
            }`}</div>
            <div className="text-xs">{`Actual Generation: ${
              _actualGeneration + " " + overviewDataUnit
            }`}</div>
          </div>
          <Divider orientation="horizontal" size={"xs"} />
          <div className="pt-2">
            <div className="text-xs">{`Solar: ${
              _actualSolar + " " + overviewDataUnit
            }`}</div>
            <div className="text-xs">{`Wind: ${
              _actualWind + " " + overviewDataUnit
            }`}</div>
            <div className="text-xs">{`Hydro: ${
              _actualHydro + " " + overviewDataUnit
            }`}</div>
            <div className="text-xs">{`UGT2 Inventory: ${
              _ugt2Inventory + " " + overviewDataUnit
            }`}</div>
            <div className="text-xs">{`UGT1 Inventory: ${
              _ugt1Inventory + " " + overviewDataUnit
            }`}</div>
            <div className="text-xs">{`Grid: ${
              _grid + " " + overviewDataUnit
            }`}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const convertData = (value) => {
    let decFixed = 2;
    if (overviewDataUnit == "kWh") {
      decFixed = 2;
    } else if (overviewDataUnit == "MWh") {
      decFixed = 6;
    } else if (overviewDataUnit == "GWh") {
      decFixed = 6;
    }

    if (value) {
      if (decFixed == 2) {
        return numeral(value).format("0,0.00");
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
            <div className="text-sm font-semibold text-[#4D6A00]">
              Summary of
            </div>
            <div className="text-xl font-bold ">{portfolioName}</div>
          </div>
        </div>

        <Button
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
          <span className="font-semobold text-white ">Settlement Approval</span>
        </Button>
      </div>
      <Divider orientation="horizontal" size={"xs"} />

      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold text-[#4D6A00]">Overview</div>

        <Form layout="horizontal" size="large">
          <div className={`grid gap-4 pt-4 grid-cols-4`}>
            <Form.Item className="col-span-1">
              <Select
                size="large"
                value={overviewDataUnit}
                variant="borderless"
                onChange={(value) => handleChangeOverviewUnit(value)}
                className={`${!canViewSettlementDetail && "opacity-20"}`}
              >
                {CONVERT_UNIT?.map((item, index) => (
                  <Select.Option key={index} value={item.unit}>
                    {item.unit}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className="col-span-2">
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

            <Button
              className={`bg-[#F5F4E9] text-[#4D6A00] ${
                !canViewSettlementDetail && "opacity-20"
              }`}
              rightSection={<AiOutlineExport size={14} />}
              disabled={!canViewSettlementDetail}
            >
              Export
            </Button>
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
                <div className="text-sm font-normal">
                  Accumulated Generation
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedGeneration *
                      convertUnit
                  )}
                </div>

                <div className="text-xl font-normal text-[#848789]">
                  {overviewDataUnit}
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />

              <div>
                <div className="text-sm font-normal">
                  Accumulated Actual Consumption
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedActualConsumtion *
                      convertUnit
                  )}
                </div>

                <div className="text-xl font-normal text-[#848789]">
                  {overviewDataUnit}
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />

              <div>
                <div className="text-sm font-normal">
                  Accumulated Net Deliverables
                </div>
                <div className="text-xl font-bold">
                  {convertData(
                    settlementOverviewSummaryData?.accumulatedNetDeliverables *
                      convertUnit
                  )}
                </div>

                <div className="text-xl font-normal text-[#848789]">
                  {overviewDataUnit}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 container mx-auto gap-8 mt-20 text-left">
            <div className="border-r-2">
              <div className="flex justify-between items-center pr-10">
                <div className="text-sm font-normal">
                  Contracted Consumption
                </div>
                <div>
                  <div className="flex w-10 h-10 rounded-large items-center justify-center bg-[#8A55D8] ">
                    <LuFileCheck color="#FFF" size="20" />
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">
                {convertData(
                  settlementOverviewSummaryData?.contractedConsumption *
                    convertUnit
                )}
              </div>

              <div className="text-sm font-normal text-[#848789]">
                {overviewDataUnit} per Year
              </div>
            </div>
            <div className="border-r-2">
              <div className="flex justify-between items-center pr-10">
                <div className="text-sm font-normal">Matched Energy</div>
                <div>
                  <div className="w-10 h-10 bg-[#F7A042] rounded-large flex items-center justify-center">
                    <LuFileCheck color="#FFF" size="20" />
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">
                {convertData(
                  settlementOverviewSummaryData?.matchedEnergyPercentage *
                    convertUnit
                )}
                <span className="font-bold"> %</span>
              </div>

              <div className="text-sm font-normal text-[#848789]">
                of Total Consumption
              </div>
            </div>
            <div className="border-r-2">
              <div className="flex justify-between items-center pr-10">
                <div className="text-sm font-normal">Total Issued REC</div>
                <div>
                  <div className="w-10 h-10 bg-[#33BFBF] rounded-large flex items-center justify-center">
                    <LuFileCheck color="#FFF" size="20" />
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">
                {numeral(
                  settlementOverviewSummaryData?.totalRECIssued * 0.001
                ).format("0,0.000000")}
              </div>

              <div className="text-sm font-normal text-[#848789]">RECs</div>
            </div>
            <div>
              <div className="flex justify-between items-center pr-10">
                <div className="text-sm font-normal">UGT1 Inventory</div>
                <div>
                  <div className="w-10 h-10 bg-[#FF6150] rounded-large flex items-center justify-center">
                    <IoBriefcaseOutline color="#FFF" size="20" />
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold">
                {convertData(
                  settlementOverviewSummaryData?.Inventory * convertUnit
                )}
              </div>

              <div className="text-sm font-normal text-[#848789]">
                {overviewDataUnit}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-sm font-normal gap-2 mt-4">
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
            <div className="text-sm font-semibold text-[#4D6A00]">
              Summary of
            </div>
            <div className="text-xl font-bold ">{portfolioName}</div>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" size={"xs"} />

      <div className="flex flex-col items-center justify-center text-sm font-normal gap-2 mt-4">
        <img src={noContent} alt="React Logo" width={50} height={50} />
        <div>No Settlement Data.</div>
      </div>
    </Card>
  );
};

export default Overview;

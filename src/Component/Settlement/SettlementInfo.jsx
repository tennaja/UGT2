"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, Divider, Table, ScrollArea, Card } from "@mantine/core";
import { Form, Select } from "antd";
import {
  getSettlementMonthlySummary,
  getSettlementMonthlyGeneration,
  getSettlementMonthlyConsumtion,
  getInventorySupplyUsage,
  getRemainingEnergyttribute,
} from "../../Redux/Settlement/Action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";
import * as WEB_URL from "../../Constants/WebURL";
import { USER_GROUP_ID } from "../../Constants/Constants";

// Chart import
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Cell,
  Label,
  Tooltip,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

// Icon import
import { LuTable } from "react-icons/lu";
import { MdBarChart } from "react-icons/md";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import { RxCaretDown } from "react-icons/rx";
import SettlementDetail from "./SettlementDetail";
import ModalInventorySupplyUsage from "./ModalInventorySupplyUsage";
import ModalRemainingEnergyAttribute from "./ModalRemainingEnergyAttribute";

const COLORS = [
  "#FF8042",
  "#87BE33",
  "#4D6A00",
  "#BE1E2E",
  "#28AAE1",
  "#662D91",
];

const SettlementInfo = ({
  ugtGroupId,
  portfolioId,
  portfolioName,
  unit,
  convertUnit,
  showSeeDetailButton,
  showWaitApprove,
  settlementYear,
  settlementMonth,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.login.userobj);
  const settlementMonthlySummaryData = useSelector(
    (state) => state.settlement.settlementMonthlySummary
  );
  const settlementMonthlyGenerationData = useSelector(
    (state) => state.settlement.settlementMonthlyGeneration
  );
  const settlementMonthlyConsumptionData = useSelector(
    (state) => state.settlement.settlementMonthlyConsumption
  );
  const inventorySupplyUsageData = useSelector(
    (state) => state.settlement.inventorySupplyUsage
  );

  const remainingEnergyAttributeData = useSelector(
    (state) => state.settlement.remainEnergyAttribute
  );

  const ref = useRef(null);
  const [canApproveSettlement, setCanApproveSettlement] = useState(false);
  const [matchedEnergyData, setMatchedEnergyData] = useState({});
  const [tmpMatchedEnergyActualData, setTmpMatchedEnergyActualData] = useState(
    {}
  );

  const [inventoryData, setInventoryData] = useState({});
  const [tmpInventoryData, setTmpInventoryData] = useState({});

  const [activeIndex, setActiveIndex] = useState(0);
  // generation
  const [monthlyGenData, setMonthlyGenData] = useState([]);
  const [tmpMonthlyGenData, setTmpMonthlyGenData] = useState([]);
  const [generationViewMode, setGenerationViewMode] = useState("chart");
  const [generationSortBy, setGenerationSortBy] = useState("deviceName");
  const [generationSortDirection, setGenerationSortDirection] = useState("asc");
  // consumption
  const [monthlyConsumpData, setMonthlyConsumpData] = useState([]);
  const [tmpMonthlyConsumpData, setTmpMonthlyConsumpData] = useState([]);
  const [consumptionViewMode, setConsumptionViewMode] = useState("chart");
  const [consumptionSortBy, setConsumptionSortBy] = useState("subscriberName");
  const [consumptionSortDirection, setConsumptionSortDirection] =
    useState("asc");
  const [openModalSupplyUsage, setOpenModalSupplyUsage] = useState(false);
  const [
    openModalRemainingEnergyAttribute,
    setOpenModalRemainingEnergyAttribute,
  ] = useState(false);

  const [showSettlementTableDetail, setShowSettlementTableDetail] =
    useState(true);

  useEffect(() => {
    const autoScroll = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Use smooth scrolling behavior if supported
      });
    };
    autoScroll();
  }, []);

  useEffect(() => {
    if (ugtGroupId !== undefined) {
      const isUserCanApprove =
        userData?.userGroup?.id !== USER_GROUP_ID.EGAT_DEVICE_MNG &&
        userData?.userGroup?.id !== USER_GROUP_ID.ALL_MODULE_VIEWER;
      // User Egat Device Manager or All Module Viewer , can view only.
      setCanApproveSettlement(isUserCanApprove);
    }
  }, [ugtGroupId, userData]);

  useEffect(() => {
    if (settlementMonth && settlementYear) {
      dispatch(
        getSettlementMonthlySummary(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
      dispatch(
        getSettlementMonthlyGeneration(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          generationSortBy,
          generationSortDirection
        )
      );
      dispatch(
        getSettlementMonthlyConsumtion(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth,
          consumptionSortBy,
          consumptionSortDirection
        )
      );
      dispatch(
        getInventorySupplyUsage(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
      dispatch(
        getRemainingEnergyttribute(
          ugtGroupId,
          portfolioId,
          settlementYear,
          settlementMonth
        )
      );
    }
  }, [settlementMonth, settlementYear]);

  // match summary
  useEffect(() => {
    if (settlementMonthlySummaryData) {
      console.log(
        settlementMonthlySummaryData?.matchedEnergyData?.actual_data?.data
      );
      // match energy
      setMatchedEnergyData(
        settlementMonthlySummaryData?.matchedEnergyData?.actual_data
      );
      setTmpMatchedEnergyActualData(
        convertMatchedEnergyData(
          settlementMonthlySummaryData?.matchedEnergyData?.actual_data
        )
      );

      // inventory
      setInventoryData(
        settlementMonthlySummaryData?.matchedEnergyData?.inventory_data
      );
      setTmpInventoryData(
        convertMatchedEnergyData(
          settlementMonthlySummaryData?.matchedEnergyData?.inventory_data
        )
      );
    }
  }, [settlementMonthlySummaryData]);

  // generation
  useEffect(() => {
    if (settlementMonthlyGenerationData?.actualGenerationItems) {
      setMonthlyGenData(settlementMonthlyGenerationData?.actualGenerationItems);
      setTmpMonthlyGenData(
        convertMonthlyGenData(
          settlementMonthlyGenerationData?.actualGenerationItems
        )
      );
    }
  }, [settlementMonthlyGenerationData]);

  // consumption
  useEffect(() => {
    if (settlementMonthlyConsumptionData?.actualConsumptionItems) {
      setMonthlyConsumpData(
        settlementMonthlyConsumptionData?.actualConsumptionItems
      );
      setTmpMonthlyConsumpData(
        convertMonthlyConsumpData(
          settlementMonthlyConsumptionData?.actualConsumptionItems
        )
      );
    }
  }, [settlementMonthlyConsumptionData]);

  useEffect(() => {
    // auctual
    setTmpMatchedEnergyActualData(convertMatchedEnergyData(matchedEnergyData));
    // inventory
    setTmpInventoryData(convertMatchedEnergyData(inventoryData));
    // Gen / Load
    setTmpMonthlyGenData(convertMonthlyGenData(monthlyGenData));
    setTmpMonthlyConsumpData(convertMonthlyConsumpData(monthlyConsumpData));
  }, [unit, settlementMonth]);

  const convertMatchedEnergyData = (matchedEnergyData) => {
    const new_match = matchedEnergyData?.data?.map((item) => {
      const new_item = {
        deviceId: item.deviceId,
        deviceName: item.deviceName,
        utilityContract: item.utilityContract,
        matchedSupply: item.matchedSupply * convertUnit,
        supplyWeightedAverage: item.supplyWeightedAverage,
      };
      return new_item;
    });

    const tmpMatchedEnergyData = {
      netDeliverables: matchedEnergyData?.netDeliverables * convertUnit,
      data: new_match,
    };

    return tmpMatchedEnergyData;
  };

  const convertMonthlyGenData = (monthlyGenData) => {
    const new_gen = monthlyGenData?.map((item) => {
      const new_item = {
        ...item,
        actualGeneration: item.actualGeneration * convertUnit,
        matched: item.matched * convertUnit,
      };
      return new_item;
    });
    return new_gen;
  };

  const convertMonthlyConsumpData = (monthlyConsumpData) => {
    const new_consump = monthlyConsumpData?.map((item) => {
      const new_item = {
        ...item,
        actualConsumption: item.actualConsumption * convertUnit,
        allocatedEnergy: item.allocatedEnergy * convertUnit,
        matched: item.matched * convertUnit,
      };
      return new_item;
    });
    return new_consump;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          <tspan alignmentBaseline="middle" fontSize="12px">
            {`${convertDecimalPlace(value)}`} {unit}
          </tspan>
        </text>
      </g>
    );
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    payload,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        // textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="13px">
          {`${(percent * 100).toFixed(0)}%`}
        </tspan>
      </text>
    );
  };

  const TotalPieLabel = ({ viewBox, value, title }) => {
    const { cx, cy } = viewBox;
    return (
      <>
        {value > 0 ? (
          <>
            <text
              x={cx}
              y={cy - 25}
              fill="rgba(0, 0, 0, 0.87)"
              textAnchor="middle"
            >
              <tspan alignmentBaseline="middle" fontSize="14px">
                {title}
              </tspan>
            </text>

            <text x={cx} y={cy + 15} textAnchor="middle">
              <tspan
                alignmentBaseline="middle"
                fontSize="16px"
                fontWeight="bold"
              >
                {convertDecimalPlace(value)}
              </tspan>
            </text>
            <text
              x={cx}
              y={cy + 50}
              fill="rgba(0, 0, 0, 0.54)"
              textAnchor="middle"
            >
              <tspan alignmentBaseline="middle" fontSize="14px">
                {unit}
              </tspan>
            </text>
          </>
        ) : (
          <text x={cx} y={cy} textAnchor="middle">
            <tspan alignmentBaseline="middle" fontSize="14px">
              No Data
            </tspan>
          </text>
        )}
      </>
    );
  };

  const TotalCustomTooltip = ({ payload }) => {
    if (payload?.[0]?.payload?.deviceName == "No Inventory") {
      return true;
    } else {
      const _deviceName = payload?.[0]?.payload?.deviceName;
      const _utilityContract = payload?.[0]?.payload?.utilityContract;
      const _matchedSupply =
        payload?.[0]?.payload?.matchedSupply > 0
          ? convertDecimalPlace(payload?.[0]?.payload?.matchedSupply)
          : "-";
      const _supplyWeightedAverage =
        payload?.[0]?.payload?.supplyWeightedAverage;

      return (
        <div className="bg-[#F5F4E9] rounded-lg p-3">
          <div className="pb-2">
            <div className="text-sm font-bold">{_deviceName || "-"}</div>
          </div>
          <Divider orientation="horizontal" size={"xs"} />
          <div className="pt-2">
            <div className="text-xs">{`Utility: ${
              _utilityContract || "-"
            } `}</div>
            <div className="text-xs">{`Matched Supply: ${
              (_matchedSupply || "-") + " " + unit
            }`}</div>
            <div className="text-xs">{`Supply Weighted Average: ${
              _supplyWeightedAverage ? _supplyWeightedAverage : "-"
            }`}</div>
          </div>
        </div>
      );
    }
  };

  const GenerationCustomTooltip = ({ payload }) => {
    const _deviceName = payload?.[0]?.payload?.deviceName;
    const _utilityContract = payload?.[0]?.payload?.utilityContract;
    const _actualGeneration =
      payload?.[0]?.payload?.actualGeneration > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.actualGeneration)
        : "-";
    const _generationRatio = payload?.[0]?.payload?.generationRatio;
    const _matched =
      payload?.[0]?.payload?.matched > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.matched)
        : "-";

    return (
      <div className="bg-[#F5F4E9] rounded-lg p-4">
        <div className="pb-2">
          <div className="text-sm font-bold">{_deviceName}</div>
        </div>
        <Divider orientation="horizontal" size={"xs"} />
        <div className="pt-2">
          <div className="text-xs">{`Utility: ${_utilityContract}`}</div>
          <div className="text-xs">{`Actual Generation: ${
            _actualGeneration + " " + unit
          }`}</div>
          <div className="text-xs">{`Matched Actual Generation: ${
            _matched + " " + unit
          }`}</div>
          <div className="text-xs">{`Generation Ratio: ${
            _generationRatio ? _generationRatio : "-"
          }`}</div>
        </div>
      </div>
    );
  };

  const ConsumptionCustomTooltip = ({ payload }) => {
    const _subscriberName = payload?.[0]?.payload?.subscriberName;
    const _utilityContract = payload?.[0]?.payload?.utilityContract;
    const _actualConsumption =
      payload?.[0]?.payload?.actualConsumption > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.actualConsumption)
        : "-";
    const _allocatedEnergy =
      payload?.[0]?.payload?.allocatedEnergy > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.allocatedEnergy)
        : "-";
    const _consumptionRatio = payload?.[0]?.payload?.consumptionRatio;
    const _matched =
      payload?.[0]?.payload?.matched > 0
        ? convertDecimalPlace(payload?.[0]?.payload?.matched)
        : "-";

    return (
      <div className="bg-[#F5F4E9] rounded-lg p-4">
        <div className="pb-2">
          <div className="text-sm font-bold">{_subscriberName}</div>
        </div>
        <Divider orientation="horizontal" size={"xs"} />
        <div className="pt-2">
          <div className="text-xs">{`Utility: ${_utilityContract}`}</div>
          <div className="text-xs">{`Net Actual Consumption: ${
            _actualConsumption + " " + unit
          }`}</div>
          <div className="text-xs">{`Matched Load: ${
            _matched + " " + unit
          }`}</div>
          <div className="text-xs">{`Allocated Energy: ${
            _allocatedEnergy + " " + unit
          }`}</div>
          <div className="text-xs">{`Consumption Ratio: ${
            _consumptionRatio ? _consumptionRatio : "-"
          }`}</div>
        </div>
      </div>
    );
  };

  const handleClickInventorySupplyUsage = () => {
    // show modal
    if (inventorySupplyUsageData) {
      setOpenModalSupplyUsage(true);
    }
  };

  const handleClickRemainingEnergyAttribute = () => {
    // show modal
    if (remainingEnergyAttributeData) {
      setOpenModalRemainingEnergyAttribute(true);
    }
  };

  const handleChangeGenerationSort = (sortBy, sortDi) => {
    setGenerationSortBy(sortBy);
    setGenerationSortDirection(sortDi);
    // call api
    dispatch(
      getSettlementMonthlyGeneration(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        sortBy,
        sortDi
      )
    );
  };

  const handleChangeConsumptionSort = (sortBy, sortDi) => {
    setConsumptionSortBy(sortBy);
    setConsumptionSortDirection(sortDi);
    // call api
    dispatch(
      getSettlementMonthlyConsumtion(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth,
        sortBy,
        sortDi
      )
    );
  };

  const convertDecimalPlace = (value) => {
    let decFixed = 2;
    if (unit == "kWh") {
      decFixed = 3;
    } else if (unit == "MWh") {
      decFixed = 6;
    } else if (unit == "GWh") {
      decFixed = 6;
    }

    if (value) {
      if (decFixed == 2) {
        return numeral(value).format("0,0.00");
      } else if (decFixed == 3) {
        return numeral(value).format("0,0.000");
      } else if (decFixed == 6) {
        return numeral(value).format("0,0.000000");
      }
    } else {
      return "-";
    }
  };

  const getPieColor = (item, index) => {
    if (item.deviceId == "Inventory") {
      return "#005AC2";
    } else {
      return COLORS[index % COLORS.length];
    }
  };
  return (
    <>
      {canApproveSettlement &&
        !settlementMonthlySummaryData?.approveStatus &&
        showWaitApprove && (
          <div className="flex justify-center z-1">
            <Card
              radius="lg"
              className="absolute items-center shadow-2xl"
              style={{
                width: "50%",
                marginTop: "20%",
              }}
            >
              <div className="grid gap-5 py-20">
                <div className="text-xl font-semibold">
                  Awaiting for Approval
                </div>

                {canApproveSettlement && (
                  <Button
                    className="bg-[#87BE33] text-white px-8 h-10 hover:bg-[#4D6A00]"
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
                    {/* <FaCheck /> */}
                    <span className="pl-2 text-lg font-bold">
                      Go to Approve
                    </span>
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

      {canApproveSettlement ||
      (!canApproveSettlement && settlementMonthlySummaryData?.approveStatus) ? (
        <div
          className={`
         ${
           !settlementMonthlySummaryData?.approveStatus && showWaitApprove
             ? "opacity-10"
             : ""
         } `}
        >
          <div className="grid grid-cols-4 container mx-auto px-0 gap-3 mt-3 text-left">
            <div className="col-span-1 flex flex-col gap-4">
              <div>
                <div className="text-sm font-normal">Matched Energy</div>
                <div className="text-xl font-bold">
                  {settlementMonthlySummaryData.matchedEnergyPercentage}
                  <span className="font-bold"> %</span>
                </div>

                <div className="text-md font-normal text-[#848789]">
                  of Net Deliverables
                </div>
              </div>
              <Divider orientation="horizontal" size={"xs"} />
              <div>
                <div className="text-sm font-normal">
                  Contracted Consumption
                </div>
                <div className="text-xl font-bold">
                  {convertDecimalPlace(
                    settlementMonthlySummaryData.contractedConsumption *
                      convertUnit
                  )}
                </div>
                <div className="text-md font-normal text-[#848789]">
                  {unit} per Month
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />
              <div>
                <div className="text-sm font-normal">
                  UGT1 Inventory Supply Usage
                </div>
                <div className="text-xl font-bold">
                  {convertDecimalPlace(
                    settlementMonthlySummaryData.inventorySupplyUsage *
                      convertUnit
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-md font-normal text-[#848789]">
                    {unit}
                  </span>
                  <span
                    className="text-xs font-normal text-[#4D6A00] underline cursor-pointer"
                    onClick={() => handleClickInventorySupplyUsage()}
                  >
                    View Detail
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-1 flex flex-col gap-4">
              <div>
                <div className="text-sm font-normal">Total Issued REC</div>
                <div className="text-xl font-bold">
                  {numeral(
                    settlementMonthlySummaryData.totalRECIssued * 0.001
                  ).format("0,0.000000")}
                </div>
                <div className="text-md font-normal text-[#848789]">REC</div>
              </div>
              <Divider orientation="horizontal" size={"xs"} />
              <div>
                <div className="text-sm font-normal">Unmatched Energy</div>
                <div className="text-xl font-bold">
                  {convertDecimalPlace(
                    settlementMonthlySummaryData.unmatchedEnergy * convertUnit
                  )}
                </div>
                <div className="text-md font-normal text-[#848789]">{unit}</div>
              </div>
              <Divider orientation="horizontal" size={"xs"} />
              <div>
                <div className="text-sm font-normal">
                  Remaining Energy Attribute
                </div>
                <div className="text-xl font-bold">
                  {convertDecimalPlace(
                    settlementMonthlySummaryData.remainingGreenAttribute *
                      convertUnit
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-md font-normal text-[#848789]">
                    {unit}
                  </span>
                  <span
                    className="text-xs font-normal text-[#4D6A00] underline cursor-pointer"
                    onClick={() => handleClickRemainingEnergyAttribute()}
                  >
                    View Detail
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <div className="flex">
                <div className="w-full text-center font-normal">
                  Net Deliverables
                </div>
                <div className="w-full text-center font-normal">Inventory</div>
              </div>

              <div className="w-full h-100">
                {tmpMatchedEnergyActualData || tmpInventoryData ? (
                  <>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart width={100} height={100}>
                        <Pie
                          activeIndex={activeIndex}
                          // activeShape={renderActiveShape}
                          // data={tmpMatchedEnergyActualData.data}
                          // data={tmpMatchedEnergyActualData?.data}
                          data={tmpMatchedEnergyActualData?.data}
                          cx="25%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={105}
                          dataKey="matchedSupply"
                          onMouseEnter={onPieEnter}
                          nameKey="matchedSupply"
                          label={renderCustomizedLabel}
                          labelLine={false}
                          // label
                          startAngle={90}
                          endAngle={-270}
                        >
                          {tmpMatchedEnergyActualData?.data?.map(
                            (entry, index) => {
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={getPieColor(entry, index)}
                                />
                              );
                            }
                          )}

                          <Label
                            content={
                              <TotalPieLabel
                                value={
                                  tmpMatchedEnergyActualData.netDeliverables
                                }
                                title="Net Deliverables"
                              />
                            }
                          />
                        </Pie>

                        {tmpInventoryData?.data ? (
                          <Pie
                            activeIndex={activeIndex}
                            // activeShape={renderActiveShape}
                            // data={tmpInventoryData.data}
                            data={tmpInventoryData?.data}
                            cx="75%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={105}
                            dataKey="matchedSupply"
                            onMouseEnter={onPieEnter}
                            nameKey="matchedSupply"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            startAngle={90}
                            endAngle={-270}
                          >
                            {tmpInventoryData.data?.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={getPieColor(entry, index)}
                              />
                            ))}

                            <Label
                              content={
                                <TotalPieLabel
                                  value={tmpInventoryData.netDeliverables}
                                  title="Net Deliverables"
                                />
                              }
                            />
                          </Pie>
                        ) : (
                          <Pie
                            data={[
                              {
                                deviceName: "No Inventory",
                                matchedSupply: 0.1,
                                utilityContract: "-",
                                supplyWeightedAverage: "-",
                              },
                            ]}
                            cx="75%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={105}
                            dataKey="matchedSupply"
                            onMouseEnter={onPieEnter}
                            nameKey="matchedSupply"
                            fill="#eeeeee"
                            startAngle={90}
                            endAngle={-270}
                          >
                            <Label content={<TotalPieLabel value={0} />} />
                          </Pie>
                        )}

                        <Tooltip content={<TotalCustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>

                    {tmpInventoryData.data?.length > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: "#005AC2" }}
                        />
                        <div className="text-xs">Inventory</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="text-[#848789]">No Data</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 container mx-auto px-0 gap-8 mt-10 text-left">
            <div className="border-r-2">
              <div className="text-lg font-bold">Generation</div>

              <div className="grid grid-cols-2 mx-auto gap-8 mt-3">
                <div>
                  <div className="text-sm font-normal">Actual Generation</div>
                  <div className="text-xl font-bold">
                    {convertDecimalPlace(
                      settlementMonthlyGenerationData.actualGeneration *
                        convertUnit
                    )}
                  </div>

                  <div className="text-sm font-normal text-[#848789]">
                    {unit}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-normal">
                    Supply Weighted Average
                  </div>
                  <div className="text-xl font-bold">
                    {settlementMonthlyGenerationData.supplyWeightedAverage} %
                  </div>
                </div>
              </div>

              {tmpMonthlyGenData.length > 0 && (
                <div className="pr-10">
                  <div className="flex justify-between items-center py-5">
                    <div className="flex items-center">
                      <div className="text-xs font-semibold pr-3">Sort By</div>

                      <Select
                        size="small"
                        defaultValue="Device Name"
                        onChange={(value) =>
                          handleChangeGenerationSort(
                            value,
                            generationSortDirection
                          )
                        }
                        style={{ width: 200 }}
                        showSearch
                      >
                        <Select.Option value="deviceName">
                          Device Name
                        </Select.Option>
                        <Select.Option value="generation">
                          Actual Generation
                        </Select.Option>
                        <Select.Option value="matched">
                          Matched Actual Generation
                        </Select.Option>
                      </Select>

                      <Button.Group className="ml-2">
                        <Button
                          style={{
                            backgroundColor:
                              generationSortDirection == "asc" ? "#87BE33" : "",
                          }}
                          variant={
                            generationSortDirection == "asc"
                              ? "filled"
                              : "default"
                          }
                          size="compact-sm"
                          onClick={() =>
                            handleChangeGenerationSort(generationSortBy, "asc")
                          }
                        >
                          <BiSortUp size={14} />
                        </Button>

                        <Button
                          variant={
                            generationSortDirection == "desc"
                              ? "filled"
                              : "default"
                          }
                          style={{
                            backgroundColor:
                              generationSortDirection == "desc"
                                ? "#87BE33"
                                : "",
                          }}
                          size="compact-sm"
                          onClick={() =>
                            handleChangeGenerationSort(generationSortBy, "desc")
                          }
                        >
                          <BiSortDown size={14} />
                        </Button>
                      </Button.Group>
                    </div>

                    <Button.Group>
                      <Button
                        variant={
                          generationViewMode == "chart" ? "filled" : "default"
                        }
                        style={{
                          backgroundColor:
                            generationViewMode == "chart" ? "#87BE33" : "",
                        }}
                        size="compact-sm"
                        onClick={() => setGenerationViewMode("chart")}
                      >
                        <MdBarChart size={14} />
                      </Button>
                      <Button
                        variant={
                          generationViewMode == "table" ? "filled" : "default"
                        }
                        style={{
                          backgroundColor:
                            generationViewMode == "table" ? "#87BE33" : "",
                        }}
                        size="compact-sm"
                        onClick={() => setGenerationViewMode("table")}
                      >
                        <LuTable size={14} />
                      </Button>
                    </Button.Group>
                  </div>

                  {generationViewMode == "chart" ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart
                        key={unit}
                        data={tmpMonthlyGenData}
                        margin={{
                          top: 30,
                          right: 0,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                          type="category"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(tick) => {
                            return numeral(tick + 1).format("0,0.[00]");
                          }}
                        />
                        <YAxis
                          width={80}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(tick) => {
                            return numeral(tick).format("0,0.[00]");
                          }}
                          label={{
                            fontSize: 10,
                            value: unit,
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip content={<GenerationCustomTooltip />} />
                        <Bar
                          dataKey="actualGeneration"
                          barSize={15}
                          fill="#4D6A00"
                          radius={[5, 5, 0, 0]}
                          layout="vertical"
                        >
                          <LabelList
                            dataKey="deviceName"
                            position="top"
                            style={{ fontSize: "10px", width: "50px" }}
                          />
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <ScrollArea w="100%" h={300}>
                      <Table stickyHeader>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th className="text-center">No.</Table.Th>
                            <Table.Th>Device Name</Table.Th>
                            <Table.Th className="text-center">
                              Actual Generation
                              <div>({unit})</div>
                            </Table.Th>
                            <Table.Th className="text-center">
                              Matched Actual Generation
                              <div>({unit})</div>
                            </Table.Th>
                            <Table.Th className="text-right">%</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {tmpMonthlyGenData?.map((row, index) => (
                            <Table.Tr key={index}>
                              <Table.Td className="text-center">
                                {index + 1}
                              </Table.Td>
                              <Table.Td width="50%">{row.deviceName}</Table.Td>
                              <Table.Td className="text-right">
                                {convertDecimalPlace(row.actualGeneration)}
                              </Table.Td>
                              <Table.Td className="text-right">
                                {convertDecimalPlace(row.matched)}
                              </Table.Td>
                              <Table.Td className="text-right">
                                {row.generationRatio}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                        <Table.Tfoot>
                          <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                            <Table.Th colSpan={2} className="text-center">
                              Total Capacity
                            </Table.Th>
                            <Table.Th className="text-right">
                              {convertDecimalPlace(
                                settlementMonthlyGenerationData.totalCapGeneration *
                                  convertUnit
                              )}
                            </Table.Th>
                            <Table.Th className="text-right">
                              {convertDecimalPlace(
                                settlementMonthlyGenerationData.totalCapMatched *
                                  convertUnit
                              )}
                            </Table.Th>
                            <Table.Th />
                          </Table.Tr>
                        </Table.Tfoot>
                      </Table>
                    </ScrollArea>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="text-lg font-bold">Consumption</div>

              <div className="grid grid-cols-2 container mx-auto gap-8 mt-3">
                <div>
                  <div className="text-sm font-normal">
                    Net Actual Consumption
                  </div>
                  <div className="text-xl font-bold">
                    {convertDecimalPlace(
                      settlementMonthlyConsumptionData.actualConsumption *
                        convertUnit
                    )}
                  </div>

                  <div className="text-sm font-normal text-[#848789]">
                    {unit}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-normal">
                    Load Weighted Average
                  </div>
                  <div className="text-xl font-bold">
                    {settlementMonthlyConsumptionData.loadWeightedAverage} %
                  </div>
                </div>
              </div>

              {settlementMonthlyConsumptionData?.actualConsumptionItems && (
                <div className="pr-10">
                  <div className="flex justify-between items-center py-5">
                    <Form>
                      <div className="flex items-center">
                        <div className="text-xs font-semibold pr-3">
                          Sort By
                        </div>
                        <Select
                          size="small"
                          defaultValue="Subscriber Name"
                          onChange={(value) =>
                            handleChangeConsumptionSort(
                              value,
                              consumptionSortDirection
                            )
                          }
                          style={{ width: 200 }}
                          showSearch
                        >
                          <Select.Option value="subscriberName">
                            Subscriber Name
                          </Select.Option>
                          <Select.Option value="consumption">
                            Net Actual Consumption
                          </Select.Option>
                          <Select.Option value="matched">
                            Matched Load
                          </Select.Option>
                        </Select>
                        <Button.Group className="ml-2">
                          <Button
                            variant={
                              consumptionSortDirection == "asc"
                                ? "filled"
                                : "default"
                            }
                            style={{
                              backgroundColor:
                                consumptionSortDirection == "asc"
                                  ? "#87BE33"
                                  : "",
                            }}
                            size="compact-sm"
                            onClick={() =>
                              handleChangeConsumptionSort(
                                consumptionSortBy,
                                "asc"
                              )
                            }
                          >
                            <BiSortUp size={14} />
                          </Button>
                          <Button
                            variant={
                              consumptionSortDirection == "desc"
                                ? "filled"
                                : "default"
                            }
                            style={{
                              backgroundColor:
                                consumptionSortDirection == "desc"
                                  ? "#87BE33"
                                  : "",
                            }}
                            size="compact-sm"
                            onClick={() =>
                              handleChangeConsumptionSort(
                                consumptionSortBy,
                                "desc"
                              )
                            }
                          >
                            <BiSortDown size={14} />
                          </Button>
                        </Button.Group>
                      </div>
                    </Form>

                    <Button.Group>
                      <Button
                        variant={
                          consumptionViewMode == "chart" ? "filled" : "default"
                        }
                        style={{
                          backgroundColor:
                            consumptionViewMode == "chart" ? "#87BE33" : "",
                        }}
                        size="compact-sm"
                        onClick={() => setConsumptionViewMode("chart")}
                      >
                        <MdBarChart size={14} />
                      </Button>
                      <Button
                        variant={
                          consumptionViewMode == "table" ? "filled" : "default"
                        }
                        style={{
                          backgroundColor:
                            consumptionViewMode == "table" ? "#87BE33" : "",
                        }}
                        size="compact-sm"
                        onClick={() => setConsumptionViewMode("table")}
                      >
                        <LuTable size={14} />
                      </Button>
                    </Button.Group>
                  </div>

                  {consumptionViewMode == "chart" ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart
                        data={tmpMonthlyConsumpData}
                        margin={{
                          top: 30,
                          right: 0,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(tick) => {
                            return numeral(tick + 1).format("0,0.[00]");
                          }}
                        />
                        <YAxis
                          width={80}
                          label={{
                            fontSize: 10,
                            value: unit,
                            angle: -90,
                            position: "insideLeft",
                          }}
                          tick={{ fontSize: 10 }}
                          tickFormatter={(tick) => {
                            return numeral(tick).format("0,0.[00]");
                          }}
                        />
                        <Tooltip content={<ConsumptionCustomTooltip />} />
                        <Bar
                          dataKey="actualConsumption"
                          barSize={15}
                          fill="#87BE33"
                          radius={[5, 5, 0, 0]}
                        >
                          <LabelList
                            dataKey="subscriberName"
                            position="top"
                            style={{ fontSize: "10px" }}
                          />
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <ScrollArea w="100%" h={300}>
                      <Table stickyHeader>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th className="text-center">No.</Table.Th>
                            <Table.Th>Subscriber Name</Table.Th>
                            <Table.Th className="text-center">
                              Net Actual Consumption<div>({unit})</div>
                            </Table.Th>
                            <Table.Th className="text-center">
                              Matched Load<div>({unit})</div>
                            </Table.Th>
                            <Table.Th className="text-right">%</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {tmpMonthlyConsumpData.map((row, index) => (
                            <Table.Tr key={index}>
                              <Table.Td className="text-center">
                                {index + 1}
                              </Table.Td>
                              <Table.Td width="50%">
                                {row.subscriberName}
                              </Table.Td>
                              <Table.Td className="text-right">
                                {convertDecimalPlace(row.actualConsumption)}
                              </Table.Td>
                              <Table.Td className="text-right">
                                {convertDecimalPlace(row.matched)}
                              </Table.Td>
                              <Table.Td className="text-right">
                                {row.consumptionRatio}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                        <Table.Tfoot>
                          <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                            <Table.Th colSpan={2} className="text-center">
                              Total Consumption
                            </Table.Th>
                            <Table.Th className="text-right">
                              {settlementMonthlyConsumptionData.totalCapConsumption
                                ? convertDecimalPlace(
                                    settlementMonthlyConsumptionData.totalCapConsumption *
                                      convertUnit
                                  )
                                : "-"}
                            </Table.Th>
                            <Table.Th className="text-right">
                              {settlementMonthlyConsumptionData.totalCapMatched
                                ? convertDecimalPlace(
                                    settlementMonthlyConsumptionData.totalCapMatched *
                                      convertUnit
                                  )
                                : "-"}
                            </Table.Th>
                            <Table.Th></Table.Th>
                          </Table.Tr>
                        </Table.Tfoot>
                      </Table>
                    </ScrollArea>
                  )}
                </div>
              )}
            </div>
          </div>

          {(showSeeDetailButton ||
            settlementMonthlySummaryData.approveStatus) && (
            <>
              <div className="flex justify-center mt-10">
                <Button
                  size="md"
                  className="bg-[#F5F4E9] text-[#4D6A00]"
                  variant="default"
                  rightSection={<RxCaretDown size={14} />}
                  onClick={() => {
                    setShowSettlementTableDetail(!showSettlementTableDetail);
                    ref.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {!showSettlementTableDetail ? "See Details" : "Hide Details"}
                </Button>
              </div>
              <div className="mt-10" ref={ref}>
                {showSettlementTableDetail && (
                  <SettlementDetail
                    ugtGroupId={ugtGroupId}
                    portfolioId={portfolioId}
                    settlementYear={settlementYear}
                    settlementMonth={settlementMonth}
                    unit={unit}
                    convertUnit={convertUnit}
                  />
                )}
              </div>
            </>
          )}

          {inventorySupplyUsageData && openModalSupplyUsage && (
            <ModalInventorySupplyUsage
              inventorySupplyUsageData={inventorySupplyUsageData}
              openModalSupplyUsage={openModalSupplyUsage}
              setOpenModalSupplyUsage={setOpenModalSupplyUsage}
            />
          )}

          {remainingEnergyAttributeData &&
            openModalRemainingEnergyAttribute && (
              <ModalRemainingEnergyAttribute
                remainingEnergyAttributeData={remainingEnergyAttributeData}
                openModalRemainingEnergyAttribute={
                  openModalRemainingEnergyAttribute
                }
                setOpenModalRemainingEnergyAttribute={
                  setOpenModalRemainingEnergyAttribute
                }
              />
            )}
        </div>
      ) : (
        <div className="text-sm font-semibold text-center py-2">
          -- Awaiting for Approval --
        </div>
      )}
    </>
  );
};

export default SettlementInfo;

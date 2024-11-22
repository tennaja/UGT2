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
} from "../../Redux/Settlement/Action";

// Icon import
import { AiOutlineExport } from "react-icons/ai";

const MonthlySettlement = (props) => {
  const dispatch = useDispatch();
  const { ugtGroupId, portfolioId, portfolioName, setHasSettlementData } =
    props;
  const [unit, setUnit] = useState("MWh");
  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[1].convertValue);
  const monthListData = useSelector((state) => state.settlement.monthList);
  const settlementYear = useSelector((state) => state.settlement.selectedYear);
  const settlementMonth = useSelector(
    (state) => state.settlement.selectedMonth
  );
  const [latestMonthHasData, setLatestMonthHasData] = useState(
    monthListData.defaultMonth
  );

  useEffect(() => {
    // get month list
    if (settlementYear) {
      handleChangeUnit(CONVERT_UNIT[1].unit);
      dispatch(getPortfolioMonthList(ugtGroupId, portfolioId, settlementYear));
    }
  }, [settlementYear]);

  useEffect(() => {
    // set selected month
    if (monthListData?.monthList?.length > 0) {
      if (
        monthListData?.monthList.some((item) => item == settlementMonth) &&
        settlementMonth <= monthListData?.defaultMonth
      ) {
        dispatch(setSelectedMonth(settlementMonth));
      } else {
        dispatch(setSelectedMonth(monthListData?.defaultMonth));
      }
      setLatestMonthHasData(monthListData?.defaultMonth); // เอาไว้เช็ค dropdown และ set disable ไว้
    }

    setHasSettlementData(monthListData.defaultMonth ? true : false); //
  }, [monthListData]);

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

  return (
    monthListData?.monthList?.length > 0 && (
      <Card shadow="md" radius="lg" className="flex mt-10" padding="xl">
        <div className="flex justify-between">
          <div className="text-xl font-semibold text-[#4D6A00]">
            Monthly Settlement
          </div>

          <Form layout="horizontal" size="large">
            <div className="grid grid-cols-4 gap-4">
            <div className="cols-span-1"></div>
              <Form.Item className="col-span-1">
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

              <Form.Item className="col-span-2">
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
                        disabled={item > latestMonthHasData}
                      >
                        {MONTH_LIST[item - 1].name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {/* <Button
                className="bg-[#F5F4E9] text-[#4D6A00]"
                rightSection={<AiOutlineExport size={14} />}
              >
                Export
              </Button> */}
            </div>
          </Form>
        </div>

        <SettlementInfo
          ugtGroupId={ugtGroupId}
          portfolioId={portfolioId}
          portfolioName={portfolioName}
          unit={unit}
          convertUnit={convertUnit}
          showSeeDetailButton={false}
          showWaitApprove={true}
          settlementYear={settlementYear}
          settlementMonth={settlementMonth}
        />
      </Card>
    )
  );
};

export default MonthlySettlement;

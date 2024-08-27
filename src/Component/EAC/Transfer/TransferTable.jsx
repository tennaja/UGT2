import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getEACPortfolioYearList,
  getEACPortfolioMonthList,
} from "../../../Redux/EAC/Action";
import { getTransferRequestList } from "../../../Redux/EAC/Transfer/Action";
import PortfolioTable from "./PortfolioTable";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CloseButton, Input, Card } from "@mantine/core";
import { Form, Select } from "antd";
import dayjs from "dayjs";
import { MONTH_LIST } from "../../../Constants/Constants";
const monthArray = MONTH_LIST;

export default function TransferTable() {
  const dispatch = useDispatch();
  const location = useLocation();
  let state = location.state;
  let selectedYear = state?.selectedYear ?? "";
  let selectedMonth = state?.selectedMonth ?? "";
 
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const portData = useSelector((state) => state.transfer?.transferRequestList);
  const yearListData = useSelector((state) => state.eac?.yearList);
  const monthListData = useSelector((state) => state.eac?.monthList);

  const [search, setSearch] = useState("");
  const [trackingYear, setTrackingYear] = useState(selectedYear);
  const [trackingMonth, setTrackingMonth] = useState(selectedMonth);

  useEffect(() => {
    // get year list
    if (currentUGTGroup?.id !== undefined) {
      dispatch(getEACPortfolioYearList(currentUGTGroup?.id));
    }
  }, [currentUGTGroup]);

  useEffect(() => {
    // get month list
    if (currentUGTGroup?.id !== undefined && trackingYear) {
      dispatch(getEACPortfolioMonthList(currentUGTGroup?.id, trackingYear));
    }
  }, [currentUGTGroup, trackingYear]);

  useEffect(() => {
    // set default year dropdown with latest year
    if (yearListData.yearList && trackingYear == "") {
      const yearList = yearListData.yearList;
      const latest_year = yearList.slice(-1);
      setTrackingYear(latest_year);
    }
  }, [yearListData]);

  useEffect(() => {
    // set default year dropdown with latest month
    if (monthListData?.monthList?.length > 0 && trackingYear) {
      if (trackingMonth !== "") {
        setTrackingMonth(trackingMonth);
      } else {
        const monthList = monthListData.monthList;
        const latest_month = monthList.slice(-1)[0];
        setTrackingMonth(latest_month);
      }
    }
  }, [monthListData]);

  useEffect(() => {
    if (trackingYear && trackingMonth) {
      dispatch(
        getTransferRequestList(currentUGTGroup?.id, trackingYear, trackingMonth)
      );
    }
  }, [trackingYear, trackingMonth]);

  const handleChangeTrackingYear = (year) => {
    setTrackingYear(year);
    setTrackingMonth("");
  };

  const handleChangeTrackingMonth = (month) => {
    setTrackingMonth(month);
  };

  return (
    <Card shadow="md" radius="lg" className="flex" padding="xl">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-lg">Portfolio</span>
          <span className="font-sm font-normal text-sm text-BREAD_CRUMB pt-1">
            {portData?.length > 1
              ? `${portData?.length} Portfolios`
              : `${portData?.length} Portfolio`}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            leftSection={<MagnifyingGlassIcon className="w-4 h-4" />}
            // style={{ height: 20 }}
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => setSearch("")}
                style={{ display: search ? undefined : "none" }}
              />
            }
          />
          <Form.Item className="mb-0">
            <Select
              size="large"
              value={trackingYear}
              style={{ width: 140 }}
              onChange={(value) => handleChangeTrackingYear(value)}
              showSearch
            >
              {yearListData?.yearList?.map((item, index) => (
                <Select.Option key={index} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Select
              size="large"
              value={trackingMonth}
              onChange={(value) => handleChangeTrackingMonth(value)}
              style={{ width: 140 }}
              showSearch
              filterOption={(input, option) =>
                (option.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {monthArray?.map((item, index) => {
                return (
                  <Select.Option
                    key={index}
                    value={item.month}
                    disabled={
                      !monthListData?.monthList?.some(
                        (obj) => obj == item.month
                      )
                    }
                  >
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="ag-theme-material pt-4" style={{ height: 500 }}>
        {<PortfolioTable portData={portData} search={search} />}
      </div>
    </Card>
  );
}

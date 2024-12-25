import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getEACPortfolioYearList } from "../../../Redux/EAC/Action";
import { getRedemptionRequestList } from "../../../Redux/EAC/Redemption/Action";
import PortfolioTableCer from "./PortfolioTableCer";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CloseButton, Input, Card } from "@mantine/core";
import { Form, Select } from "antd";
import * as WEB_URL from "../../../Constants/WebURL";

const yearObject = [{ name: "2024" }];

export default function RedemptionTableCer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let state = location.state;
  let selectedYear = state?.selectedYear ?? "";

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const portData = useSelector((state) => state.redeem?.redemptionRequestList);
  const yearListData = useSelector((state) => state.eac?.yearList);

  const [search, setSearch] = useState("");
  const [trackingYear, setTrackingYear] = useState(selectedYear);

  // Check is page is reloaded
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType("navigation");
    if (
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload"
    ) {
      console.log("This page is reloaded");
      navigate(WEB_URL.EAC_REDEMPTION_CERTIFICATE, { replace: true });
    }
  }, []);

  useEffect(() => {
    // get year list
    if (currentUGTGroup?.id !== undefined) {
      dispatch(getEACPortfolioYearList(currentUGTGroup?.id));
    }
  }, [currentUGTGroup]);

  useEffect(() => {
    // set default year dropdown with latest year
    if (yearListData.yearList) {
      if (trackingYear !== "") {
        setTrackingYear(trackingYear);
      } else {
        const yearList = yearListData.yearList;
        const latest_year = yearList.slice(-1);
        setTrackingYear(latest_year);
      }
    }
  }, [yearListData]);

  useEffect(() => {
    // get redeem data list
    if (currentUGTGroup?.id !== undefined && trackingYear) {
      dispatch(getRedemptionRequestList(currentUGTGroup?.id, trackingYear));
    }
  }, [currentUGTGroup, trackingYear]);

  const handleChangeTrackingYear = (year) => {
    setTrackingYear(year);
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
            radius={6}
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            leftSection={<MagnifyingGlassIcon className="w-4 h-4" />}
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
        </div>
      </div>
      <div className="ag-theme-material pt-4" style={{ height: 500 }}>
        {<PortfolioTableCer portData={portData} search={search} />}
      </div>
    </Card>
  );
}

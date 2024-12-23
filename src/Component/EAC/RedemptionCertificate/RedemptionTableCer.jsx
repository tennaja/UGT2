import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRedemptionRequestListCerPage } from "../../../Redux/EAC/Redemption/Action";
import PortfolioTable from "./PortfolioTableCer";
import { FiSearch } from "react-icons/fi";
import { CloseButton, Input, Card } from "@mantine/core";
import { Form, Select } from "antd";
import dayjs from "dayjs";
import PortfolioTableCer from "./PortfolioTableCer";

const yearObject = [{ name: "2024" }];

export default function RedemptionTableCer() {
  const dispatch = useDispatch();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const portData = useSelector((state) => state.redeem.redemptionRequestListCerPage);
  const [search, setSearch] = useState("");
  const [trackingYear, setTrackingYear] = useState(2024);

  console.log(portData)

  useEffect(() => {
    dispatch(getRedemptionRequestListCerPage(1, trackingYear, search));
  }, [trackingYear, search]);

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
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            leftSection={<FiSearch className="w-4 h-4" />}
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
              defaultValue={trackingYear}
              onChange={(value) => handleChangeTrackingYear(value)}
              style={{ width: 140 }}
            >
              {yearObject.map((item, index) => (
                <Select.Option key={index} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="ag-theme-material pt-4" >
        {<PortfolioTableCer portData={portData} search={search}/>}
      </div>
    </Card>
  );
}

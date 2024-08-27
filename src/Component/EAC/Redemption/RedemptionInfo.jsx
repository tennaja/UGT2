"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRedemptionRequestInfo,
  getRedemptionSubscriberList,
} from "../../../Redux/EAC/Redemption/Action";
import { Button, Card, Divider } from "@mantine/core";
import { Form, Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useNavigate } from "react-router-dom";
import ItemRedemption from "./ItemRedemption";
dayjs.extend(customParseFormat);

const yearObject = [{ name: "2024" }];

export default function RedemptionInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const redemptionData = useSelector(
    (state) => state.redeem.redemptionRequestInfo
  );
  const redemptionSubscriberData = useSelector(
    (state) => state.redeem.redemptionSubscriberList
  );

  const { portfolioID, portfolioName, period } = location.state;
  const [trackingYear, setTrackingYear] = useState(Number(period));
  const [selectedSubscriber, setSelectedSubscriber] = useState({});

  console.log("portfolioID", portfolioID);
  console.log("period_year", period);

  useEffect(() => {
    dispatch(getRedemptionSubscriberList(1, portfolioID));
    dispatch(getRedemptionRequestInfo(1, portfolioID, trackingYear));
  }, [trackingYear]);

  const handleChangeSubscriber = (value) => {
    setSelectedSubscriber(value);
  };

  const handleChangeTrackingYear = (year) => {
    setTrackingYear(year);
  };

  return (
    <div className="bg-[#F2F6F8] min-h-screen w-full p-10">
      <div className="flex flex-col items-start">
        <span className="text-xl font-semibold">Redemption</span>
        <span className="text-sm font-normal text-[#4D6A00]">
          {currentUGTGroup?.name} / EAC Tracking Management / Redemption /{" "}
          {portfolioName}
        </span>
      </div>

      <Card shadow="md" radius="lg" className="flex mt-10" padding="xl">
        <div className="flex justify-between pb-4">
          <div className="text-xl font-bold text-left">UGT1-Portfolio 1</div>
          <Button
            className="bg-[#F5F4E9] text-[#4D6A00] px-8"
            onClick={() => navigate("/eac/redemption")}
          >
            Back
          </Button>
        </div>

        <Divider orientation="horizontal" size={"xs"} />

        <div className="flex justify-between items-center">
          <div className="text-left">
            <span className="text-xl font-semibold text-[#4D6A00]">
              Redemption
            </span>
          </div>

          <div className="">
            <Form layout="horizontal" size="large">
              <div className="flex gap-4 items-center">
                <Form.Item className="pt-4" style={{ minWidth: 200 }}>
                  <Select
                    size="large"
                    placeholder="Select Subscriber"
                    defaultValue={selectedSubscriber.id}
                    onChange={(value) => handleChangeSubscriber(value)}
                    fullwidth
                  >
                    {redemptionSubscriberData.map((item, index) => (
                      <Select.Option key={index} value={item.id}>
                        {item.subscriberName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item className="pt-4" style={{ minWidth: 150 }}>
                  <Select
                    size="large"
                    defaultValue={trackingYear}
                    onChange={(value) => handleChangeTrackingYear(value)}
                  >
                    {yearObject.map((item, index) => (
                      <Select.Option key={index} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </Card>

      <ItemRedemption redemptionData={redemptionData} />
    </div>
  );
}

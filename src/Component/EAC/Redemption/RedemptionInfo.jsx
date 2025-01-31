"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRedemptionRequestInfo,
  getRedemptionSubscriberList,
  getRedemptionReqPortfolioYearList,
} from "../../../Redux/EAC/Redemption/Action";
import { Button, Card, Divider } from "@mantine/core";
import { Form, Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronCircleLeft } from "react-icons/fa";
import ItemRedemption from "./ItemRedemption";
import Swal from "sweetalert2";
import noContent from "../../assets/no-content.png";
dayjs.extend(customParseFormat);

export default function RedemptionInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const yearListData = useSelector(
    (state) => state.redeem.redemptionReqPortYearList
  );
  const redemptionInfo = useSelector(
    (state) => state.redeem.redemptionRequestInfo
  );
  const redemptionSubscriberData = useSelector(
    (state) => state.redeem.redemptionSubscriberList
  );

  const { portfolioID, portfolioName, period } = location.state;
  console.log(portfolioID, portfolioName, period)
  const period_year = Number(dayjs(period).format("YYYY"));
  const [trackingYear, setTrackingYear] = useState(period_year);
  const [redemptionData, setRedemptionData] = useState([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState("");

  // get year and subscriber list
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      dispatch(
        getRedemptionReqPortfolioYearList(currentUGTGroup?.id, portfolioID)
      );
      dispatch(getRedemptionSubscriberList(currentUGTGroup?.id, portfolioID));
    }
  }, [currentUGTGroup]);

  // get Info
  useEffect(() => {
    if (currentUGTGroup?.id !== undefined && portfolioID && trackingYear) {
      Swal.fire({
        title: "Please Wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      dispatch(
        getRedemptionRequestInfo(
          currentUGTGroup?.id,
          portfolioID,
          trackingYear,
          selectedSubscriber
        )
      );
    }
  }, [currentUGTGroup, trackingYear, selectedSubscriber]);

  useEffect(() => {
    if (redemptionInfo) {
      // console.log("redemptionInfo", redemptionInfo);
      setRedemptionData(redemptionInfo);
    }
  }, [redemptionInfo]);

  useEffect(() => {
    if (redemptionData) {
      // console.log("redemptionInfo", redemptionInfo);
      setRedemptionData(redemptionData);
    }
  }, [redemptionData]);

  const handleChangeSubscriber = (value) => {
    setSelectedSubscriber(value);
  };

  const handleChangeTrackingYear = (year) => {
    setTrackingYear(year);
  };

  const fetchRedemptionRequestInfo = () => {
    dispatch(
      getRedemptionRequestInfo(
        currentUGTGroup?.id,
        portfolioID,
        trackingYear,
        selectedSubscriber
      )
    );
  };

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">Redemption</h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / EAC Tracking Management / Redemption /{" "}
                {portfolioName}
              </p>
            </div>

            <Card shadow="md" radius="lg" className="flex" padding="xl">
              <div className="flex  gap-3 items-center pb-4">
                <FaChevronCircleLeft
                  className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                  size="30"
                  onClick={() =>
                    navigate("/eac/redemption", {
                      state: {
                        selectedYear: trackingYear,
                      },
                    })
                  }
                />
                <div className="text-lg font-bold text-left">
                  {portfolioName}
                </div>
              </div>

              <Divider orientation="horizontal" size={"xs"} />

              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-[#4D6A00]">
                  Redemption
                </div>

                <Form layout="horizontal" size="large">
                  <div className="flex gap-4 items-center">
                    <Form.Item className="pt-4" style={{ minWidth: 200 }}>
                      <Select
                        size="large"
                        placeholder="Select Subscriber"
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
                        style={{ width: 140 }}
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
                </Form>
              </div>
            </Card>

            {redemptionData?.length > 0 ? (
              <ItemRedemption
                ugtGroupId={currentUGTGroup?.id}
                portfolioID={portfolioID}
                year={trackingYear}
                redemptionData={redemptionData}
                setRedemptionData={setRedemptionData}
                fetchRedemptionRequestInfo={fetchRedemptionRequestInfo}
              />
            ) : (
              <Card shadow="md" radius="lg" padding="xl">
                <div className="flex flex-col items-center justify-center text-sm font-normal gap-2">
                  <img
                    src={noContent}
                    alt="React Logo"
                    width={50}
                    height={50}
                  />
                  <div>Redemption Unavailable.</div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

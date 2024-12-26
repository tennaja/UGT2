"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@mantine/core";
import { Form, Select } from "antd";
import dayjs from "dayjs";
import numeral from "numeral";
import { ScrollArea, Table ,Divider} from "@mantine/core";
import {
  getRedemptionCertYearList,
  getRedemptionCertPortfolioList,
  getRedemptionCertUtilityList,
  getRedemptionCertList,
} from "../../../Redux/EAC/Redemption/Action";
import { DOWNLOAD_REDEMPTION_STATEMENT_URL } from "../../../Constants/ServiceURL";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { USER_GROUP_ID } from "../../../Constants/Constants";

import { FaChevronCircleLeft } from "react-icons/fa";

export default function RedemptionCert() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  // redux
  const userData = useSelector((state) => state.login.userobj);
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);

  console.log(currentUGTGroup)
  const yearListData = useSelector(
    (state) => state.redeem?.redemptionCertYearList
  );

  console.log(yearListData)
  const portListData = useSelector(
    (state) => state.redeem?.redemptionCertPortList
  );
  const utilityListData = useSelector(
    (state) => state.redeem?.redemptionCertUtilityList
  );
  const certListData = useSelector((state) => state.redeem?.redemptionCertList);
  console.log(state.portfolioID)
  // state
  const [trackingYear, setTrackingYear] = useState("");
  const [trackingPort, setTrackingPort] = useState(state.portfolioID);
  const [trackingUtility, setTrackingUtility] = useState("");
  const [dropdownYearList, setDropdownYearList] = useState([]);
  const [dropdownPortList, setDropdownPortList] = useState([]);
  const [dropdownUtilityList, setDropdownUtilityList] = useState([]);
  const [redemptionCertList, setRedemptionCertList] = useState([]);
console.log(certListData)
  useEffect(() => {
    // get year list
    console.log(currentUGTGroup)
    if (currentUGTGroup?.id !== undefined) {
      dispatch(getRedemptionCertYearList(currentUGTGroup?.id));
    }
  }, [currentUGTGroup]);

  useEffect(() => {
    // get portfolio list
    console.log(currentUGTGroup?.id,trackingYear)
    if (currentUGTGroup?.id !== undefined && trackingYear) {
      dispatch(
        getRedemptionCertPortfolioList(currentUGTGroup?.id, trackingYear)
      );
    }
  }, [currentUGTGroup, trackingYear]);

  useEffect(() => {
    // get utility list
    if (currentUGTGroup?.id !== undefined && trackingYear && trackingPort) {
      console.log("Get Utility",trackingPort)
      dispatch(
        getRedemptionCertUtilityList(
          currentUGTGroup?.id,
          trackingYear,
          trackingPort
        )
      );
    }
  }, [currentUGTGroup, trackingYear, trackingPort]);

  useEffect(() => {
    if (!trackingPort) {
      // clear utility dropdown when select all portfolio
      setTrackingUtility("");
      setDropdownUtilityList([]);
    }
  }, [trackingPort]);

  useEffect(() => {
    // get redemption certificate list
    console.log(currentUGTGroup?.id,trackingYear,trackingUtility)
    if (
      currentUGTGroup?.id !== undefined &&
      trackingYear &&
      trackingUtility
    ) {
      console.log("Change Detail Cer",currentUGTGroup?.id,trackingYear,)
      dispatch(
        getRedemptionCertList(
          currentUGTGroup?.id,
          trackingYear,
          state.portfolioID,
          trackingUtility
        )
      );
    }
  }, [currentUGTGroup, trackingYear, trackingUtility]);

  useEffect(() => {
    // set default year dropdown with latest
    if (yearListData?.length > 0) {
      const latest = yearListData.slice(-1)[0];
      setTrackingYear(latest);
      setDropdownYearList(yearListData);
    } else {
      setTrackingYear("");
      setDropdownYearList([]);
    }
  }, [yearListData]);

  console.log(yearListData)

  /*useEffect(() => {
    // set default port dropdown with latest
    if (portListData?.length > 0) {
      const latest = portListData.slice(-1)[0];
      setTrackingPort(latest?.portfolioId);
      setDropdownPortList(portListData);
    } else {
      setTrackingPort("");
      setDropdownPortList([]);
    }
  }, [portListData]);*/

  useEffect(() => {
    // set default utility dropdown with latest
    if (utilityListData?.length > 0) {
      const latest = utilityListData.slice(-1)[0];
      setTrackingUtility(1)
      //setTrackingUtility(latest?.utilityId);
      setDropdownUtilityList(utilityListData);
    } else {
      setTrackingUtility("");
      setDropdownUtilityList([]);
    }
  }, [utilityListData]);

  useEffect(() => {
    console.log(certListData)
    if (certListData?.length > 0) {
      setRedemptionCertList(certListData);
    } else {
      setRedemptionCertList([]);
    }
  }, [certListData]);

  const handleChangeTrackingYear = (year) => {
    setTrackingYear(year);
  };

  /*const handleChangeTrackingPort = (portId) => {
    setTrackingPort(portId);
  };*/

  const handleChangeTrackingUtility = (utilityId) => {
    setTrackingUtility(utilityId);
  };

  const downloadStatement = async (transactionUid) => {
    const URL = `${DOWNLOAD_REDEMPTION_STATEMENT_URL}?transactionUid=${transactionUid}`;
    window.open(URL, "_blank");
  };

  const checkRoleDownloadCer=()=>{
    if(userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY || 
      userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER
    ){
      return false
    }
    else{
      return true
    }
  }

  console.log(trackingPort)

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold text-xl text-black">
                  Redemption Certificate
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / EAC Tracking Management / Redemption
                  Certificate / {state.portfolioName}
                </p>
              </div>
            </div>
            <Card shadow="md" radius="lg" className="flex" padding="xl">
              <div className="flex  gap-3 items-center pb-4">
                <FaChevronCircleLeft
                  className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                  size="30"
                  onClick={() =>
                    navigate("/eac/certificate", {
                      state: {
                        selectedYear: trackingYear,
                      },
                    })
                  }
                />
                  <div className="text-lg font-bold text-left">
                    {state.portfolioName}
                  </div>
              </div>
            
              <Divider orientation="horizontal" size={"xs"} />
            
              <div className="flex justify-between items-center px-4">
                <div className="text-lg font-bold text-left">
                  {currentUGTGroup?.name} Redemption Certificate
                </div>

                <Form layout="horizontal" size="large">
                  <div className="grid grid-cols-8 gap-2 items-center">
                    <Form.Item className="col-span-2 pt-4 col-start-5">
                      <Select
                        size="large"
                        placeholder="Year"
                        value={trackingYear}
                        onChange={(value) => handleChangeTrackingYear(value)}
                        style={{ width: 140 }}
                        showSearch
                      >
                        {dropdownYearList?.map((item, index) => (
                          <Select.Option key={index} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/*<Form.Item className="col-span-4 pt-4">
                      <Select
                        size="large"
                        placeholder="Portfolio"
                        value={trackingPort}
                        onChange={(value) => handleChangeTrackingPort(value)}
                        // style={{ width: 140 }}
                        showSearch
                      >
                        {dropdownPortList?.map((item, index) => (
                          <Select.Option key={index} value={item?.portfolioId}>
                            {item?.portfolioName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>*/}

                    <Form.Item className="col-span-2 pt-4 col-start-7">
                      <Select
                        size="large"
                        placeholder="Utility"
                        value={trackingUtility}
                        onChange={(value) => handleChangeTrackingUtility(value)}
                        // style={{ width: 140 }}
                        showSearch
                      >
                        {dropdownUtilityList?.map((item, index) => (
                          <Select.Option key={index} value={item?.utilityId}>
                            {item?.utilityName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </Card>
            {/*<Card
              shadow="md"
              radius="lg"
              className="flex text-left"
              padding={5}
            >
              <div className="flex justify-between items-center px-4">
                <div className="text-lg font-bold text-left">
                  {currentUGTGroup?.name} Redemption Certificate
                </div>

                <Form layout="horizontal" size="large">
                  <div className="grid grid-cols-8 gap-2 items-center">
                    <Form.Item className="col-span-2 pt-4">
                      <Select
                        size="large"
                        placeholder="Year"
                        value={trackingYear}
                        onChange={(value) => handleChangeTrackingYear(value)}
                        style={{ width: 140 }}
                        showSearch
                      >
                        {dropdownYearList?.map((item, index) => (
                          <Select.Option key={index} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item className="col-span-4 pt-4">
                      <Select
                        size="large"
                        placeholder="Portfolio"
                        value={trackingPort}
                        onChange={(value) => handleChangeTrackingPort(value)}
                        // style={{ width: 140 }}
                        showSearch
                      >
                        {dropdownPortList?.map((item, index) => (
                          <Select.Option key={index} value={item?.portfolioId}>
                            {item?.portfolioName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item className="col-span-2 pt-4">
                      <Select
                        size="large"
                        placeholder="Utility"
                        value={trackingUtility}
                        onChange={(value) => handleChangeTrackingUtility(value)}
                        // style={{ width: 140 }}
                        showSearch
                      >
                        {dropdownUtilityList?.map((item, index) => (
                          <Select.Option key={index} value={item?.utilityId}>
                            {item?.utilityName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </Card>*/}

            {redemptionCertList?.map((item, index) => (
              <Card
                key={index}
                shadow="md"
                radius="lg"
                className="flex text-left"
                padding="xl"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-normal text-[#91918A]">
                      Portfolio Name
                    </div>
                    <div className="text-sm font-semibold">
                      {item.portfolioName}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-normal text-[#91918A]">
                      Assigned Utility
                    </div>
                    <div className="text-sm font-semibold">
                      {item.assignedUtility}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-normal text-[#91918A]">
                      Total RECs (MWh)
                    </div>
                    <div className="text-sm font-semibold">
                      {numeral(item.totalRECs).format("0,0.000000")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-normal text-[#91918A]">
                      Reporting Period
                    </div>
                    <div className="text-sm font-semibold">
                      {dayjs(item.reportingStartPeriod).format("DD/MM/YYYY")} to{" "}
                      {dayjs(item.reportingEndPeriod).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-normal text-[#91918A]">
                      Total Redemption Certificates
                    </div>
                    <div className="text-sm font-semibold">
                      {item.redemptionStatements?.length || "-"}
                    </div>
                  </div>
                </div>

                <ScrollArea w="100%" h="100%" className="mt-10">
                  <Table stickyHeader verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr className="text-[#848789]">
                        <Table.Th className="text-center">No.</Table.Th>
                        <Table.Th>Subscriber Name</Table.Th>
                        <Table.Th>Redemption Certificate</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {item?.redemptionStatements?.map((row, index) => (
                        <Table.Tr key={index} className="font-semibold">
                          <Table.Td
                            className="text-center"
                            style={{ width: "10%" }}
                          >
                            {index + 1}
                          </Table.Td>
                          <Table.Td style={{ width: "30%" }}>
                            {row?.subscriberName}
                          </Table.Td>
                          <Table.Td>
                            {checkRoleDownloadCer() && <a
                              href="javascript:void(0)"
                              className={`no-underline cursor-pointer text-PRIMARY_TEXT font-semibold`}
                              onClick={() =>
                                downloadStatement(row?.transactionUid)
                              }
                            >
                              {"Download"}
                            </a>}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { convertDateTimeToDisplayDate } from "../../Utils/DateTimeUtils";
import { useForm, Controller } from "react-hook-form";
import { Button, Card, Menu } from "@mantine/core";
import * as WEB_URL from "../../Constants/WebURL";
import { USER_GROUP_ID } from "../../Constants/Constants";
import StatusLabel from "../../Component/Control/StatusLabel";
import { SubscriberInfo } from "../../Redux/Subscriber/Action";
import LoadPage from "../Control/LoadPage";
import Skeleton from "@mui/material/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Row from "./components/TableRow";
import { FaChevronCircleLeft, FaRegEdit } from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
import numeral from "numeral";
import ManageBtn from "../Control/ManageBtn";
import { hideLoading, showLoading } from "../../Utils/Utils";

const InfoSubscriber = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const [isEdit, setIsEdit] = useState(false);
  const details = useSelector((state) => state.subscriber.detailInfoList);
  const [sumAllocateEnergy, setSumAllocateEnergy] = useState(0);
  const [isOpenLoading, setIsOpenLoading] = useState(false);

  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (currentUGTGroup?.id !== undefined) {
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
      ) {
        setIsEdit(true);
      }
    }
  }, [currentUGTGroup, userData]);

  useEffect(() => {
    setIsOpenLoading(true);
    showLoading();
    dispatch(
      SubscriberInfo(state?.id, () => {
        setIsOpenLoading(false);
        hideLoading();
      })
    );
  }, []);

  useEffect(() => {
    if (details) {
      let tempSum = 0;
      for (let i = 0; i < details?.allocateEnergyAmountInfo?.length; i++) {
        tempSum += details?.allocateEnergyAmountInfo[i]?.totalAmount;
      }
      setSumAllocateEnergy(tempSum);
    }
  }, [details]);

  useEffect(() => {
    autoScroll();
  }, []);

  const autoScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const onClickEdit = () => {
    navigate(`${WEB_URL.SUBSCRIBER_EDIT}`, { state: { code: state?.id } });
  };

  const renderData = (value) => {
    let data = "-";
    if (value) {
      data = value;
    }

    return isOpenLoading ? <Skeleton animation="wave" width={200} /> : data;
  };

  const renderAddress = (detail) => {
    const address = detail?.address;
    const subdistrictName = detail?.subdistrictName;
    const districtName = detail?.districtName;
    const proviceName = detail?.proviceName;
    const postcode = detail?.postcode;
    let _address = "";

    if (
      !address &&
      !subdistrictName &&
      !districtName &&
      !proviceName &&
      !postcode
    ) {
      _address = "";
    } else {
      _address =
        address +
        " , " +
        subdistrictName +
        " , " +
        districtName +
        " , " +
        proviceName +
        " , " +
        postcode;
    }
    return renderData(_address);
  };

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                {details?.subscriberDetail?.organizationName !== ""
                  ? details?.subscriberDetail?.organizationName
                  : details?.subscriberDetail?.name}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Subscriber Management / Subscriber
                Info /{" "}
                <span className="truncate">
                  {details?.subscriberDetail?.organizationName !== ""
                    ? details?.subscriberDetail?.organizationName
                    : details?.subscriberDetail?.name}
                </span>
              </p>
            </div>

            <Card
              shadow="md"
              radius="lg"
              className="flex w-full h-full"
              padding="0"
            >
              <div className="p-4">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    <div
                      id="top-div"
                      className="md:col-span-3  lg:col-span-4 flex  m-0 items-center gap-3"
                    >
                      <FaChevronCircleLeft
                        className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                        size="30"
                        onClick={() => navigate(WEB_URL.SUBSCRIBER_LIST)}
                      />
                      <span className="text-xl	mr-14 	leading-tight">
                        <b> Subscriber Info</b>
                      </span>
                      {/* <span>
                        {StatusLabel(
                          details?.subscriberDetail?.statusSubscriberName
                        )}
                      </span> */}
                    </div>

                    {/* Button Section */}
                    {isEdit && (
                      /*     <div className="md:col-span-6 lg:col-span-2 text-right">
                        <button
                          onClick={onClickEdit}
                          className="h-[40px] w-[25%]  text-PRIMARY_TEXT font-semibold bg-[#f4f4e9] rounded mx-2"
                        >
                          Edit
                        </button>
                      </div> */
                      <div className="md:col-span-6 lg:col-span-2 text-right">
                        {/*   <Menu
                          trigger="hover"
                          openDelay={100}
                          closeDelay={400}
                          offset={5}
                          width={180}
                          position="bottom-end"
                        >
                          <Menu.Target>
                            <Button
                              rightSection={<LuChevronDown />}
                              className="bg-PRIMARY_BUTTON hover:bg-BREAD_CRUMB text-white w-30"
                            >
                              Manage
                            </Button>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<FaRegEdit />}
                              component="button"
                              onClick={onClickEdit}
                              className="hover:bg-gray-100"
                            >
                              Edit
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu> */}
                        <ManageBtn
                          actionList={[
                            {
                              icon: <FaRegEdit />,
                              label: "Edit",
                              onClick: onClickEdit,
                            },
                          ]}
                        />
                      </div>
                    )}
                    {/* Button Section */}
                  </div>
                </div>
              </div>

              <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top" />

              <div className="p-6 px-8 md:p-8 mb-6 ">
                <div className=" lg:col-span-2 ">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    {/* Subscriber Detail */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Subscriber Details</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Subscriber Name
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.organizationName !== ""
                                    ? details?.subscriberDetail
                                        ?.organizationName
                                    : details?.subscriberDetail?.name
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                Status
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  <StatusLabel
                                    status={
                                      details?.subscriberDetail
                                        ?.statusSubscriberName
                                    }
                                    type="xs"
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Trade Account
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail?.tradeAccount
                                )}
                              </div>
                            </div>

                            {details?.subscriberDetail?.statusSubscriberType ==
                            1 ? (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Redemption Account
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.redemptionAccount || "-"
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Subscriber Type
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.statusSubscriberType == 1
                                      ? "Subscriber"
                                      : "Aggregate Subscriber" || "-"
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs ">
                                Assigned Utility
                              </label>
                              <div className="break-words	font-bold">
                                {renderData(
                                  details?.subscriberDetail
                                    ?.assignedUtilityId === 1
                                    ? "Electricity Generating Authority of Thailand"
                                    : details?.subscriberDetail
                                        ?.assignedUtilityId === 2
                                    ? "Provincial Electricity Authority"
                                    : details?.subscriberDetail
                                        ?.assignedUtilityId === 3
                                    ? "Metropolitan Electricity Authority"
                                    : "-"
                                )}
                              </div>
                            </div>

                            {details?.subscriberDetail?.statusSubscriberType ==
                            1 ? (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Subscriber Type
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.statusSubscriberType == 1
                                      ? "Subscriber"
                                      : "Aggregate Subscriber" || "-"
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Aggregate Allocated Energy (kWh)
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    numeral(
                                      details?.subscriberDetail?.aggregateAllocatedEnergy
                                    ).format("0,0.00")
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {details?.subscriberDetail?.statusSubscriberType ==
                            1 && (
                            <>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA No.
                                  </label>
                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail?.retailESANo ||
                                        "-"
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract Duration
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractDuration || "-"
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                                <div>
                                  <label className="text-[#6B7280] text-xs ">
                                    Retail ESA Contract Start Date
                                  </label>
                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractStartDate
                                        ? convertDateTimeToDisplayDate(
                                            details?.subscriberDetail
                                              ?.retailESAContractStartDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[#6B7280] text-xs">
                                    Retail ESA Contract End Date
                                  </label>

                                  <div className="break-words	font-bold">
                                    {renderData(
                                      details?.subscriberDetail
                                        ?.retailESAContractEndDate
                                        ? convertDateTimeToDisplayDate(
                                            details?.subscriberDetail
                                              ?.retailESAContractEndDate,
                                            "d MMMM yyyy"
                                          )
                                        : "-"
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Organization Information */}
                    {details?.subscriberDetail?.statusSubscriberType == 1 && (
                      <div className="md:col-span-6">
                        <div className="grid grid-cols-12 gap-1">
                          <div className="row-span-3 col-span-12 lg:col-span-3">
                            <div className="shrink-0">
                              <h6 className="text-PRIMARY_TEXT">
                                <b>Organization Infomation</b>
                              </h6>
                            </div>
                          </div>

                          <div className="col-span-12 lg:col-span-9">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Business Registration No.
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail
                                      ?.businessRegistrationNo || "-"
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Address
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    renderAddress(details?.subscriberDetail)
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  State/Province
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.proviceName
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  District
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.districtName
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Subdistrict
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.subdistrictName
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Country
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.countryName
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Postcode
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.postcode
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Personal Information */}
                    {details?.subscriberDetail?.statusSubscriberType == 1 && (
                      <div className="md:col-span-6">
                        <div className="grid grid-cols-12 gap-1">
                          <div className="row-span-3 col-span-12 lg:col-span-3">
                            <div className="shrink-0">
                              <h6 className="text-PRIMARY_TEXT">
                                <b>Personal Information</b>
                              </h6>
                            </div>
                          </div>

                          <div className="col-span-12 lg:col-span-9">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Contact Name
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.title +
                                      " " +
                                      details?.subscriberDetail?.name +
                                      " " +
                                      details?.subscriberDetail?.lastname || "-"
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Email
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(details?.subscriberDetail?.email)}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Telephone (Mobile)
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.mobilePhone
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Telephone (Office)
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.officePhone
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Attorney / Attorney-in-fact
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.subscriberDetail?.attorney
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Subscription Information */}
                    <div className="md:col-span-6">
                      <div className="grid grid-cols-12 gap-1">
                        <div className="row-span-3 col-span-12 lg:col-span-3">
                          <div className="shrink-0">
                            <h6 className="text-PRIMARY_TEXT">
                              <b>Subscription Infomation</b>
                            </h6>
                          </div>
                        </div>

                        <div className="col-span-12 lg:col-span-9">
                          {details?.subscriberDetail?.statusSubscriberType ==
                            1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Feeder Name
                                </label>

                                <div>
                                  {details?.feederNameInfo?.length > 0 &&
                                    details?.feederNameInfo.map((item) => {
                                      return (
                                        <div
                                          className="break-words font-bold mb-1"
                                          key={item.id}
                                        >
                                          {item?.feederName || "-"}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Total Allocated Energy (kWh)
                              </label>

                              <div className="break-words	font-bold">
                                {renderData(
                                  numeral(sumAllocateEnergy).format("0,0.00")
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                            <div>
                              <label className="text-[#6B7280] text-xs">
                                Allocated Energy Amount
                              </label>

                              <div className="w-2/3">
                                <TableContainer>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Year</TableCell>
                                        <TableCell align="right">
                                          Total Allocated Energy Amount (kWh)
                                        </TableCell>
                                        <TableCell />
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {details?.allocateEnergyAmountInfo
                                        ?.length > 0 &&
                                        details?.allocateEnergyAmountInfo?.map(
                                          (row, index) => (
                                            <Row
                                              key={index}
                                              rowindex={index}
                                              row={row}
                                            />
                                          )
                                        )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Beneficiary Information */}
                    {details?.subscriberDetail?.statusSubscriberType == 1 && (
                      <div className="md:col-span-6">
                        <div className="grid grid-cols-12 gap-1">
                          <div className="row-span-3 col-span-12 lg:col-span-3">
                            <div className="shrink-0">
                              <h6 className="text-PRIMARY_TEXT">
                                <b>Beneficiary Information</b>
                              </h6>
                            </div>
                          </div>

                          <div className="col-span-12 lg:col-span-9">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Beneficiary Name
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.beneficiaryInfo?.beneficiaryName
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Status
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(details?.beneficiaryInfo?.status)}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Address
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.beneficiaryInfo?.address
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  State / Province
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.beneficiaryInfo?.proviceName
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  District
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.beneficiaryInfo?.districtName
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Subdistrict
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.beneficiaryInfo?.subdistrictName
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Country
                                </label>
                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.beneficiaryInfo?.countryName
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="text-[#6B7280] text-xs">
                                  Postcode
                                </label>

                                <div className="break-words	font-bold">
                                  {renderData(
                                    details?.beneficiaryInfo?.postcode
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* {isOpenLoading && <LoadPage></LoadPage>} */}
    </div>
  );
};

export default InfoSubscriber;

import React, { useState, useEffect } from "react";
import { Card } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { convertDateTimeToDisplayDate } from "../../Utils/DateTimeUtils";
import { useForm, Controller } from "react-hook-form";
import * as WEB_URL from "../../Constants/WebURL";
import SearchBox from "../Control/SearchBox";
import DataTable from "../Control/Table/DataTable";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModalComplete from "../Control/Modal/ModalComplete";
import { PortfolioInfo, PortfolioDelete } from "../../Redux/Portfolio/Action";
import { hi, tr } from "date-fns/locale";
import Multiselect from "../Control/Multiselect";
import { format } from "date-fns";
import { hideLoading, showLoading } from "../../Utils/Utils";
import numeral from "numeral";
import { FaChevronCircleLeft, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import ManageBtn from "../Control/ManageBtn";
import Highlighter from "react-highlight-words";
import { USER_GROUP_ID } from "../../Constants/Constants";

const InfoPortfolio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login?.userobj);
  const [isEdit, setIsEdit] = useState(true);
  const [isStartPort, setIsStartPort] = useState(false);
  const details = useSelector((state) => state.portfolio.detailInfoList);
  console.log(details)
  const [searchDevice, setSearchDevice] = useState("");
  const [searchSubscriber, setSearchSubscriber] = useState("");
  const [deviceList, setDeviceList] = useState([]);
  const [subscriberList, setSubscriberList] = useState([]);
  const [showModalDelete, setShowModalDeleteConfirm] = React.useState(false);
  const [showModalComplete, setShowModalComplete] = React.useState(false);
  console.log(deviceList)
  console.log(subscriberList)
  const checkCanEdit = () => {
    let isEdit = false;

    if (userData?.userGroup?.id == USER_GROUP_ID.PORTFOLIO_MNG) {
      // other role can only view
      isEdit = true;
    }

    return isEdit;
  };

  const canEdit = checkCanEdit();
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log("id === ", state?.id);
    showLoading();
    dispatch(
      PortfolioInfo(state?.id, () => {
        hideLoading();
      })
    );

    autoScroll();
  }, [state?.id]);

  useEffect(() => {
    return () => dispatch({ type: "RESET_STATE" });
  }, []);

  useEffect(() => {
    console.log("details === ", details);
    if (details?.portfolioInfo?.startDate) {
      const now = new Date();
      const startDate = new Date(details?.portfolioInfo?.startDate);
      now > startDate ? setIsStartPort(true) : setIsStartPort(false);
    }
  }, [details]);
  useEffect(() => {
    if (details?.device?.length > 0) {
      const formatDate = (timestamp) => {
        if (timestamp == null || timestamp == "") {
          return "-";
        } else {
          const dateObject = new Date(timestamp);
          const day = dateObject.getDate().toString().padStart(2, "0");
          const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
          const year = dateObject.getFullYear();
          return `${day}/${month}/${year}`;
        }
      };
      const formattedDataArray = details?.device.map(
        ({
          deviceTechnologiesId, // Removed from final object
          assignedUtilityId, // Removed from final object
          commissioningDate, // Removed from final object
          portfolioDetailsId, // Removed from final object
          ...item // Keep the rest of the properties
        }) => ({
          ...item,
          startDate: formatDate(item?.ugtStartDate),
          endDate: formatDate(item?.ugtEndDate),
        })
      );

      setDeviceList(formattedDataArray);
    }
  }, [details?.subscriber]);
  useEffect(() => {
    if (details?.subscriber?.length > 0) {
      const formatDate = (timestamp) => {
        if (timestamp == null || timestamp == "") {
          return "-";
        } else {
          const dateObject = new Date(timestamp);
          const day = dateObject.getDate().toString().padStart(2, "0");
          const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
          const year = dateObject.getFullYear();
          return `${day}/${month}/${year}`;
        }
      };
      const formattedDataArray = details?.subscriber.map((item) => ({
        ...item,
        startDate: formatDate(item?.ugtStartDate),
        endDate: formatDate(item?.ugtEndDate),
      }));
      setSubscriberList(formattedDataArray);
    }
  }, [details?.subscriber]);
  useEffect(() => {
    if (details?.device?.length > 0) {
      const formatDate = (timestamp) => {
        if (timestamp == null) {
          return "-";
        } else {
          const dateObject = new Date(timestamp);
          const day = dateObject.getDate().toString().padStart(2, "0");
          const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
          const year = dateObject.getFullYear();
          return `${day}/${month}/${year}`;
        }
      };
      const formattedDataArray = details?.device.map(
        ({
          deviceTechnologiesId, // Removed from final object
          assignedUtilityId, // Removed from final object
          commissioningDate, // Removed from final object
          portfolioDetailsId, // Removed from final object
          ...item // Keep the rest of the properties
        }) => ({
          ...item,
          startDate: formatDate(item?.ugtStartDate),
          endDate: formatDate(item?.ugtEndDate),
        })
      );

      setDeviceList(formattedDataArray);
    }
  }, [details?.device]);

  const autoScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  function convertToDate(dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const statusList = [
    {
      id: 1,
      statusName: "Active",
    },
    {
      id: 2,
      statusName: "InActive",
    },
  ];
  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columnsDevice = [
    {
      id: "deviceName",
      label: "Device Name",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.deviceName}
        />
      ),
    },
    {
      id: "utilityContractAbbr",
      label: "Utility Contract",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.utilityContractAbbr}
        />
      ),
    },
    {
      id: "deviceTechnologiesName",
      label: "Energy Source",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.deviceTechnologiesName}
        />
      ),
    },
    {
      id: "capacity",
      label: "Capacity (MW)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={numeral(row?.capacity).format("0,0.000000")}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
  ];
  const columnsSubscriber = [
    {
      id: "subcriberName",
      label: "Subscriber Name",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={row.subcriberName}
        />
      ),
    },
    {
      id: "utilityContractAbbr",
      label: "Utility Contract",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={row.utilityContractAbbr}
        />
      ),
    },
    {
      id: "allocateEnergyAmount",
      label: "Allocated Energy Amount (kWh)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={numeral(row?.allocateEnergyAmount).format("0,0.00")}
        />
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={row.startDate}
        />
      ),
    },
    {
      id: "endDate",
      label: "End Date",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchSubscriber]}
          autoEscape={true}
          textToHighlight={row.endDate}
        />
      ),
    },
  ];
  const handleSearchDeviceChange = (e) => {
    setSearchDevice(e.target.value);
  };
  const handleSearchSubscriberChange = (e) => {
    setSearchSubscriber(e.target.value);
  };
  const onClickEdit = () => {
    navigate(`${WEB_URL.PORTFOLIO_EDIT}`, { state: { code: state?.id } });
  };
  const onClickBack = () => {
    navigate(`${WEB_URL.PORTFOLIO_LIST}`);
  };
  const onClickDelete = () => {
    setShowModalDeleteConfirm(true);
  };
  const handleClickConfirm = () => {
    setShowModalDeleteConfirm(false);
    console.log("Confirm Delete");
    dispatch(
      PortfolioDelete(state?.id, (res) => {
        console.log("res === ", res);
        if (res?.portfolioInfo !== null) {
          setShowModalComplete(true);
        } else {
          setFailedModal(true);
        }
      })
    );
  };
  const handleCloseModalConfirm = (val) => {
    setShowModalDeleteConfirm(false);
    console.log("Cancle Delete");
  };
  const handleChangeDeviceStatus = (value) => {
    if (value?.length == 1) {
      if (value[0]?.id == 1) {
        console.log("deviceList == ", deviceList);
        const now = new Date();
        const filtered = deviceList.filter((item) => {
          console.log("item == ", item);
          const [day, month, year] = item.endDate.split("/");
          const endDate = new Date(`${year}-${month}-${day}`);
          return endDate >= now;
        });
        console.log("filtered ===", filtered);
        setDeviceList(filtered);
      } else {
        const now = new Date();
        const filtered = deviceList.filter((item) => {
          console.log("item == ", item);
          const [day, month, year] = item.endDate.split("/");
          const endDate = new Date(`${year}-${month}-${day}`);
          return endDate < now;
        });
        setDeviceList(filtered);
      }
    } else {
      const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const formattedDataArray = details?.device.map(
        ({
          deviceTechnologiesId, // Removed from final object
          assignedUtilityId, // Removed from final object
          commissioningDate, // Removed from final object
          portfolioId, // Removed from final object
          ...item // Keep the rest of the properties
        }) => ({
          ...item,
          startDate: formatDate(item.ugtStartDate),
          endDate: formatDate(item.ugtEndDate),
        })
      );

      setDeviceList(formattedDataArray);
    }
  };
  const handleChangeSubscriberStatus = (value) => {
    if (value?.length == 1) {
      if (value[0]?.id == 1) {
        const now = new Date();
        const filtered = subscriberList.filter((item) => {
          const [day, month, year] = item.endDate.split("/");
          const endDate = new Date(`${year}-${month}-${day}`);
          return endDate >= now;
        });
        setSubscriberList(filtered);
      } else {
        const now = new Date();
        const filtered = subscriberList.filter((item) => {
          const [day, month, year] = item.endDate.split("/");
          const endDate = new Date(`${year}-${month}-${day}`);
          return endDate < now;
        });
        setSubscriberList(filtered);
      }
    } else {
      const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const formattedDataArray = details?.subscriber.map((item) => ({
        ...item,
        startDate: formatDate(item.ugtStartDate),
        endDate: formatDate(item.ugtEndDate),
      }));
      setSubscriberList(formattedDataArray);
    }
  };
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div className="grid gap-4 gap-y-2 grid-cols-1 md:grid-cols-6 ">
              <div className="md:col-span-3">
                <h2 className="font-semibold text-xl text-black truncate">
                  {details?.portfolioInfo?.portfolioName || "-"}
                </h2>
                <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                  {currentUGTGroup?.name} / Portfolio & Settlement Management /
                  Portfolio Info /{" "}
                  <span className="truncate">
                    {details?.portfolioInfo?.portfolioName || "-"}
                  </span>
                </p>
              </div>
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
                      className="md:col-span-6  lg:col-span-4 flex   items-center gap-3"
                    >
                      <FaChevronCircleLeft
                        className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                        size="30"
                        onClick={() => navigate(WEB_URL.PORTFOLIO_LIST)}
                      />
                      <span className="text-xl	mr-14 	leading-tight">
                        <b> Portfolio Info </b>
                      </span>
                    </div>

                    {/* Button Section */}
                    {canEdit && (
                      <div className="md:col-span-6 lg:col-span-2 text-right">
                        {/* <button
                          onClick={onClickBack}
                          className="h-[40px] w-[25%]  text-PRIMARY_TEXT font-semibold bg-[#f4f4e9] rounded mx-2 "
                        >
                          Back
                        </button> */}
                        <ManageBtn
                          actionList={[
                            {
                              icon: <FaRegEdit />,
                              label: "Edit",
                              onClick: onClickEdit,
                              disabled: !canEdit,
                            },
                            {
                              icon: <FaTrashAlt />,
                              label: "Delete",
                              onClick: onClickDelete,
                              disabled: isStartPort,
                            },
                          ]}
                        />

                        {/*    <button
                          onClick={onClickEdit}
                          className="h-[40px] w-[25%] rounded text-white font-semibold transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB"
                        >
                          Edit
                        </button>
                        {!isStartPort && (
                          <button
                            onClick={onClickDelete}
                            className="h-[40px] w-[25%]  text-DANGER_BUTTON font-semibold bg-[#FFE5E4] rounded mx-2 hover:bg-DANGER_BUTTON hover:text-MAIN_SCREEN_BG"
                          >
                            Delete
                          </button>
                        )} */}
                      </div>
                    )}

                    {/* Button Section */}
                  </div>
                </div>
              </div>
              <div className="  p-0 px-0 md:p-0 mb-0 border-1 align-top" />

              {/* information */}
              <div className="p-6 px-8 md:p-8 mb-0 ">
                <div className="lg:col-span-2">
                  <div className="grid gap-2 gap-y-2 text-sm grid-cols-1 md:grid-cols-6 ">
                    <div className="md:col-span-2">
                      <h6 className="text-PRIMARY_TEXT mt-3">
                        <b>Portfolio Information</b>
                      </h6>
                    </div>
                    <div className="md:col-span-2">
                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Portfolio Name
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {details?.portfolioInfo?.portfolioName || "-"}
                            </div>
                          </span>
                        </div>
                      </div>
                      

                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Start Date
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {details?.portfolioInfo?.startDate
                                ? convertDateTimeToDisplayDate(
                                    details?.portfolioInfo?.startDate,
                                    "d MMMM yyyy"
                                  )
                                : "-"}
                            </div>
                          </span>
                        </div>
                      </div>
                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Number of Devices
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {details?.portfolioInfo?.numberOfDevices || "-"}
                            </div>
                          </span>
                        </div>
                      </div>
                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Total Capacity
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {numeral(
                                details?.portfolioInfo?.totalCapacity
                              ).format("0,0.000000") || "-"}{" "}
                              MW
                            </div>
                          </span>
                        </div>
                      </div>
                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Mechanism
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {details?.portfolioInfo?.mechanismId == 1
                                ? "Weighted Average"
                                : details?.portfolioInfo?.mechanismId == 2
                                ? "Priority supply"
                                : "-"}
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                    <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Portfolio Code
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {details?.portfolioInfo?.portfolioCode || "-"}
                            </div>
                          </span>
                        </div>
                      </div>
                      
                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            End Date
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {details?.portfolioInfo?.endDate
                                ? convertDateTimeToDisplayDate(
                                    details?.portfolioInfo?.endDate,
                                    "d MMMM yyyy"
                                  )
                                : "-"}
                            </div>
                          </span>
                        </div>
                      </div>
                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Number of Subscriber
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {details?.portfolioInfo?.numberOfSubscribers ||
                                "-"}
                            </div>
                          </span>
                        </div>
                      </div>
                      <div className=" md:col-span-6">
                        <div>
                          <label className="mt-3 text-[#6B7280] text-xs">
                            Total Allocated Energy Amount
                          </label>
                        </div>
                        <div>
                          <span className="">
                            <div className="break-words	font-bold">
                              {numeral(
                                details?.portfolioInfo
                                  ?.totalAllocatedEnergyAmount
                              ).format("0,0.00") || "-"}{" "}
                              kWh
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Devices*/}
              <div className="bg-white rounded shadow-none p-14 px-4 md:p-8 mb-6">
                <div className="  text-sm  ">
                  <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6  ">
                    <div className="col-span-2 mb-4">
                      <div className="md:col-span-6">
                        <h6 className="text-PRIMARY_TEXT font-semibold">
                          Device Assignment
                        </h6>
                        <label
                          className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                        >
                          {deviceList?.length || "0"}{" "}
                          {deviceList?.length > 1 ? "Devices" : "Device"}
                        </label>
                      </div>
                    </div>

                    <div className="grid col-span-4 grid-cols-12">
                      <form
                        autoComplete="off"
                        className="grid col-span-12 grid-cols-12"
                      >
                        <div className="col-span-1 px-2"></div>
                        <div className="col-span-3 px-2"></div>
                        <div className="col-span-3 px-2">
                          <Controller
                            name="deviceStatus"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <Multiselect
                                {...field}
                                id={"deviceStatus"}
                                typeSelect={2}
                                options={statusList}
                                valueProp={"id"}
                                displayProp={"statusName"}
                                placeholder={"Find Status"}
                                onChangeInput={(value) => {
                                  handleChangeDeviceStatus(value);
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="col-span-5 px-2">
                          <Controller
                            name="SearchText"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <SearchBox
                                placeholder="Search"
                                onChange={handleSearchDeviceChange}
                              />
                            )}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div>
                    <DataTable
                      data={deviceList}
                      columns={columnsDevice}
                      searchData={searchDevice}
                      checkbox={false}
                      isTotal={"Total Capacity"}
                      // onSelectedRowsChange={selectedDeviceChange}
                    />
                  </div>
                </div>
              </div>
              {/* Subscriber*/}
              <div className="bg-white rounded shadow-none p-14 px-4 md:p-8 mb-6 ">
                <div className="  text-sm  ">
                  <div className="grid gap-4 gap-y-2 text-sm  lg:grid-cols-6  ">
                    <div className="col-span-2 mb-4">
                      <div className="md:col-span-6">
                        <h6 className="text-PRIMARY_TEXT font-semibold">
                          Subscriber Assignment
                        </h6>
                        <label
                          className={`font-sm font-normal text-sm text-BREAD_CRUMB`}
                        >
                          {subscriberList?.length || "0"}{" "}
                          {subscriberList?.length > 1
                            ? "Subscribers"
                            : "Subscriber"}
                        </label>
                      </div>
                    </div>

                    <div className="grid col-span-4 grid-cols-12">
                      <form
                        autoComplete="off"
                        className="grid col-span-12 grid-cols-12"
                      >
                        <div className="col-span-4 px-2"></div>
                        <div className="col-span-3 px-2">
                          <Controller
                            name="subscriberStatus"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <Multiselect
                                {...field}
                                id={"subscriberStatus"}
                                typeSelect={2}
                                options={statusList}
                                valueProp={"id"}
                                displayProp={"statusName"}
                                placeholder={"Find Status"}
                                onChangeInput={(value) => {
                                  handleChangeSubscriberStatus(value);
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="col-span-5 px-2">
                          <Controller
                            name="SearchText"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <SearchBox
                                placeholder="Search"
                                onChange={handleSearchSubscriberChange}
                              />
                            )}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div>
                    <DataTable
                      data={subscriberList}
                      columns={columnsSubscriber}
                      searchData={searchSubscriber}
                      checkbox={false}
                      isTotal={"Total Allocated Energy Amount"}
                      // onSelectedRowsChange={selectedDeviceChange}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {showModalDelete && (
        <ModalConfirm
          onClickConfirmBtn={handleClickConfirm}
          onCloseModal={handleCloseModalConfirm}
          title={"Are you sure?"}
          content={"Are you sure you would like to delete this portfolio?"}
          buttonTypeColor="danger"
        />
      )}
      {showModalComplete && (
        <ModalComplete
          title="Done!"
          context="Delete complete"
          link={WEB_URL.PORTFOLIO_LIST}
        />
      )}
    </div>
  );
};

export default InfoPortfolio;

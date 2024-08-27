import React, { useState, useEffect } from "react";
import { Card } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Input from "../Control/Input";
import MySelect from "../Control/Select";
import DataTablePortfolio from "./component/DataTablePortfolio";
import { TextField } from "@mui/material";
import SearchBox from "../Control/SearchBox";
import plus from "../assets/plus.svg";
import * as _ from "lodash";
import ModalAddPort from "../Portfolio/ModalAddPort";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModalComplete from "../Control/Modal/ModalComplete";
import ModalFail from "../Control/Modal/ModalFail";
import ModelLoadPage from "../Control/LoadPage";
import bin from "../assets/bin-3.svg";
import { Tooltip } from "react-tooltip";
import DatePicker from "../Control/DayPicker";
import { useFieldArray } from "react-hook-form";
import * as WEB_URL from "../../Constants/WebURL";
import { USER_GROUP_ID, UTILITY_GROUP_ID } from "../../Constants/Constants";
import { format } from "date-fns";
import {
  PortfolioManagementDevice,
  PortfolioManagementSubscriber,
  PortfolioMechanismList,
  PortfolioManagementUpdate,
  PortfolioGetOne,
} from "../../Redux/Portfolio/Action";
import { FaChevronCircleLeft } from "react-icons/fa";
import { hideLoading, showLoading } from "../../Utils/Utils";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { IoInformationCircleSharp } from "react-icons/io5";

const UpdatePortfolio = () => {
  const {
    // register,
    handleSubmit,
    resetField,
    setValue,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const [selectedCommisionDate, setSelectedCommisionDate] = useState(null);
  const [disableRequestedEffectiveDate, setDisableRequestedEffectiveDate] =
    useState(true);
  const userData = useSelector((state) => state.login.userobj);
  const [disableUtility, setDisableUtility] = useState(false);
  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);

  useEffect(() => {
    autoScroll();
  }, []);

  useEffect(() => {}, [userData]);

  const initialvalueForSelectField = (listItems = [], key, itemID) => {
    const initialValue = listItems?.filter((item) => item[key] == itemID);
    if (initialValue.length > 0) {
      return initialValue[0];
    } else {
      return null;
    }
  };
  const autoScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleChangeCommissioningDate = (date) => {
    setValue("endDate", "");
    // If date has a value that is considered truthy (like a valid date object, a non-empty string, etc.), !!date will be true, and setIsStartDate will be called with true. If date is falsy (like null, undefined, an empty string, etc.), !!date will be false
    setIsStartDate(!!date);
    setIsEndDate(false);
    setOnEditDevice(false);
    setOnEditDatetimeDevice(false);
    setOnEditSubscriber(false);
    setOnEditDatetimeSubscriber(false);
    setSelectedCommisionDate(date);

    setValue("retailESAContractEndDate", "");
    if (date) {
      setDisableRequestedEffectiveDate(false);
    } else {
      setDisableRequestedEffectiveDate(true);
    }

    // setValue("endDate", "");
    // setIsStartDate(!!date);
    // const newDateDeviceStartDate = deviceListSelected.map((item) => ({
    //   ...item,
    //   startDate: format(date, "dd/MM/yyyy"),
    // }));

    // const newDateSuscriberStartDate = subscriberListSelected
    //   .filter((item) => {
    //     const partStartTemp = item.retailESAContractStartDate.split("/");
    //     const retailESAContractStartDate = new Date(
    //       `${partStartTemp[2]}-${partStartTemp[1]}-${partStartTemp[0]}`
    //     );
    //     const partEndTemp = item.retailESAContractEndDate.split("/");
    //     const retailESAContractEndDate = new Date(
    //       `${partEndTemp[2]}-${partEndTemp[1]}-${partEndTemp[0]}`
    //     );
    //     return (
    //       date >= retailESAContractStartDate && date <= retailESAContractEndDate
    //     );
    //   })
    //   .map((item) => {
    //     const partStartTemp = item.retailESAContractStartDate.split("/");
    //     const retailESAContractStartDate = new Date(
    //       `${partStartTemp[2]}-${partStartTemp[1]}-${partStartTemp[0]}`
    //     );
    //     return {
    //       ...item,
    //       retailESAContractStartDate: format(retailESAContractStartDate, "dd/MM/yyyy"),
    //     };
    //   });
    // setDeviceListSelected(newDateDeviceStartDate);
    // setSubscriberListSelected(newDateSuscriberStartDate);

    // setSelectedCommisionDate(date);
    // setValue("retailESAContractEndDate", "");
    // if (date) {
    //   setDisableRequestedEffectiveDate(false);
    // } else {
    //   setDisableRequestedEffectiveDate(true);
    // }
  };
  const handleChangeEndDate = (date) => {
    setOnEditDevice(false);
    setOnEditDatetimeDevice(false);
    setOnEditSubscriber(false);
    setOnEditDatetimeSubscriber(false);
    dispatch(PortfolioManagementDevice(currentUGTGroup?.id, state?.code));
    dispatch(
      PortfolioManagementSubscriber(currentUGTGroup?.id, state?.code, true)
    );
    setIsEndDate(!!date);
    const startDatePort = watch("startDate");
    // console.log("startDatePort ==== ", new Date(startDatePort));
    // console.log("endDatePort === ", date);
    if (date) {
      // device
      let newDateDeviceList = deviceListSelected
        .filter((item) => {
          const startDevice = new Date(item?.registrationDate);
          const endDevice = date;
          return endDevice > startDevice;
        })
        .map((item) => ({
          ...item,
          startDate:
            new Date(startDatePort).setHours(0, 0, 0, 0) >=
            new Date(item?.registrationDate)
              ? format(new Date(startDatePort), "dd/MM/yyyy")
              : format(new Date(item?.registrationDate), "dd/MM/yyyy"),
          endDate: format(date, "dd/MM/yyyy"),
        }));
      setDeviceListSelected(newDateDeviceList);

      // subscriber
      console.log("subscriberListSelected ===>>> ", subscriberListSelected);
      let newSuscriberList = subscriberListSelected
        .filter((item) => {
          const partStartTemp = item?.retailESAContractStartDate.split("/");
          const startSub = new Date(
            `${partStartTemp[2]}-${partStartTemp[1]}-${partStartTemp[0]}`
          );
          const partEndTemp = item?.retailESAContractEndDate.split("/");
          const endSub = new Date(
            `${partEndTemp[2]}-${partEndTemp[1]}-${partEndTemp[0]}`
          );
          const startPort = new Date(startDatePort).setHours(0, 0, 0, 0);
          const endPort = date;
          return startSub < endPort && endSub > startPort;
        })
        .map((item) => {
          const startSub = new Date(item?.ugtStartDate);
          const endSub = new Date(item?.ugtEndDate);
          return {
            ...item,
            retailESAContractStartDate:
              new Date(startDatePort).setHours(0, 0, 0, 0) >= startSub
                ? format(new Date(startDatePort), "dd/MM/yyyy")
                : format(startSub, "dd/MM/yyyy"),
            retailESAContractEndDate:
              date <= endSub
                ? format(date, "dd/MM/yyyy")
                : format(endSub, "dd/MM/yyyy"),
          };
        });
      console.log("newSuscriberList >>>>>>> ", newSuscriberList);
      setSubscriberListSelected(newSuscriberList);
    }
  };
  const disableStartDateCal = (day) => {
    // หาว่าตอนนี้อยู่ ugtGroup ไหน จาก userGroup
    const currentUgtGroupData = userData?.ugtGroups?.filter(
      (item) => item?.id === currentUGTGroup?.id
    );

    // กำหนดวันแรกของ port ตาม ugtGroup ที่เลือกอยู่ ถ้าไม่เจอวันแรกของ port ให้ใช้เป็นวันปัจจุบันไปก่อน
    const ugtGroupStartDate = currentUgtGroupData[0]?.startDate
      ? dayjs(currentUgtGroupData[0]?.startDate).endOf("day")
      : dayjs().startOf("day");

    console.log("ugtGroupStartDate", ugtGroupStartDate);
    // กำหนดวันสุดท้ายของ port ตาม ugtGroup ที่เลือกอยู่ ถ้าไม่เจอวันสุดท้ายของ port ให้ใช้เป็นวันถัดมาจากวันที่เริ่มต้นไปก่อน
    const ugtGroupStopDate = currentUgtGroupData[0]?.stopDate
      ? dayjs(currentUgtGroupData[0]?.stopDate).endOf("day")
      : dayjs(selectedCommisionDate).endOf("day").add(1, "day");

    const condition1 = day < ugtGroupStartDate || day > ugtGroupStopDate;
    const disable = condition1;
    return disable;
  };
  const requestedEffectiveDateDisableDateCal = (day) => {
    let dateValue = new Date(selectedCommisionDate);
    const previousDate = new Date(dateValue);
    previousDate.setHours(0, 0, 0, 0);
    previousDate.setDate(dateValue.getDate() + 1);

    let currentDate = new Date();
    const previousCurrentDate = new Date(currentDate);
    previousCurrentDate.setDate(currentDate.getDate() - 1);

    // // end date จะต้องอยู่ภายในปีที่เลือก
    // const lastDate = dayjs(selectedCommisionDate).endOf("year");

    // หาว่าตอนนี้อยู่ ugtGroup ไหน จาก userGroup
    const currentUgtGroupData = userData?.ugtGroups?.filter(
      (item) => item?.id === currentUGTGroup?.id
    );
    // กำหนดวันสุดท้ายของ port ตาม ugtGroup ที่เลือกอยู่ ถ้าไม่เจอวันสุดท้ายของ port ให้ใช้เป็นวันถัดมาจากวันที่เริ่มต้นไปก่อน
    const ugtGroupStopDate = currentUgtGroupData[0]?.stopDate
      ? dayjs(currentUgtGroupData[0]?.stopDate).endOf("day")
      : dayjs(selectedCommisionDate).endOf("day").add(1, "day");

    const condition1 = day < previousDate || day > ugtGroupStopDate;
    const disable = condition1;

    return disable;
  };

  // -------------------------------------------------------------------------------------------------------------------------------------
  const portfolioDeviceList = useSelector(
    (state) => state.portfolio.portfolioDevice
  );
  const portfolioSubscriberList = useSelector(
    (state) => state.portfolio.portfolioSubscriber
  );
  const portfolioMechanismList = useSelector(
    (state) => state.portfolio.portfolioMechanism
  );
  const detailPortfolio = useSelector(
    (state) => state.portfolio.getOnePortfolio
  );
  const { state } = useLocation();
  const [showModal, setShowModalConfirm] = React.useState(false);
  const [showModalCreate, setShowModalCreateConfirm] = React.useState(false);
  const [showModalComplete, setShowModalComplete] = React.useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceListSelected, setDeviceListSelected] = useState([]);
  const [subscriberList, setSubscriberList] = useState([]);
  const [subscriberListSelected, setSubscriberListSelected] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [titleAddModal, setTitleAddModal] = useState("");
  const [columnsTable, setColumnsTable] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [listTable, setListTable] = useState([]);
  const [onEditDevice, setOnEditDevice] = useState(false);
  const [onEditSubscriber, setOnEditSubscriber] = useState(false);
  const [onEditDatetimeDevice, setOnEditDatetimeDevice] = useState(false);
  const [onEditDatetimeSubscriber, setOnEditDatetimeSubscriber] =
    useState(false);
  const [selectDeviceChange, setSelectDeviceChange] = useState([]);
  const [selectSubscriberChange, setSelectSubscriberChange] = useState([]);
  const [paramsCreate, setParamsCreate] = useState("");
  const [failedModal, setFailedModal] = useState("");
  const [tempDeviceListSelected, setTempDeviceListSelected] = useState([]);
  const [tempSubscriberListSelected, setTempSubscriberListSelected] = useState(
    []
  );
  const [isStartPort, setIsStartPort] = useState(false);
  const [formattedCurrentDate, setformattedCurrentDate] = useState("");

  useEffect(() => {
    return () => dispatch({ type: "RESET_STATE" });
  }, []);

  useEffect(() => {
    console.log("state?.code", state?.code);
    showLoading();
    dispatch(
      PortfolioGetOne(state?.code, () => {
        hideLoading();
      })
    );
    // dispatch(PortfolioManagementDevice(currentUGTGroup?.id, state?.code));
    // dispatch(
    //   PortfolioManagementSubscriber(currentUGTGroup?.id, state?.code, true)
    // );
    dispatch(PortfolioMechanismList());
  }, [state?.code]);

  useEffect(() => {
    if (
      detailPortfolio?.portfolioInfo?.id &&
      portfolioMechanismList?.length > 0
    ) {
      setDefualtData();
      const now = new Date();
      const startDate = new Date(detailPortfolio?.portfolioInfo?.startDate);

      const _now = now.setHours(0, 0, 0, 0);
      const _startDate = startDate.setHours(0, 0, 0, 0);
      _now >= _startDate ? setIsStartPort(true) : setIsStartPort(false);
    }
  }, [detailPortfolio, portfolioMechanismList]);

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "") {
      return "-";
    }
    const dateObject = new Date(timestamp);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    autoScroll();
    console.log("portfolioDeviceList == ", portfolioDeviceList);
    if (portfolioDeviceList?.length > 0) {
      const eDate = watch("endDate");

      // Filter devices registered before the end date and format their data
      const formattedDataArray = portfolioDeviceList
        .filter((item) => new Date(eDate) > new Date(item?.registrationDate))
        .map(
          ({
            deviceTechnologiesId, // Removed from final object
            assignedUtilityId, // Removed from final object
            commissioningDate, // Removed from final object
            portfolioId, // Removed from final object
            ...item // Keep the rest of the properties
          }) => ({
            ...item, // Spread the remaining properties
            startDate: formatDate(item.registrationDate), // Add formatted start date
            endDate: formatDate(item.registrationDate), // Add formatted end date
          })
        );

      // Update the state with the formatted device list
      setDeviceList(formattedDataArray);
    }
  }, [portfolioDeviceList]);

  useEffect(() => {
    // console.log("portfolioSubscriberList == ", portfolioSubscriberList);
    if (portfolioSubscriberList?.length > 0) {
      const sDate = watch("startDate");
      const eDate = watch("endDate");
      const formattedDataArray = portfolioSubscriberList
        .filter(
          (item) =>
            (item?.retailESAContractStartDate === "" &&
              item?.retailESAContractEndDate === "") ||
            (new Date(eDate) >
              convertToDate(formatDate(item?.retailESAContractStartDate)) &&
              new Date(sDate) <
                convertToDate(formatDate(item?.retailESAContractEndDate)))
        )
        .map(
          ({
            assignedUtilityId, // Removed from final object
            portfolioId, // Removed from final object
            ...item // Keep the rest of the properties
          }) => ({
            ...item, // Spread the remaining properties
            retailESAContractStartDate: formatDate(
              item?.retailESAContractStartDate
            ),
            retailESAContractEndDate: formatDate(
              item?.retailESAContractEndDate
            ),
            subStartDate: formatDate(item?.retailESAContractStartDate),
            subEndDate: formatDate(item?.retailESAContractEndDate),
          })
        );
      setSubscriberList(formattedDataArray);
    }
  }, [portfolioSubscriberList]);

  function convertToDate(dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

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
          textToHighlight={(
            numeral(row.capacity).format("0,0.000000") ?? ""
          ).toString()}
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
          textToHighlight={(
            numeral(row.allocateEnergyAmount).format("0,0.00") ?? ""
          ).toString()}
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
          textToHighlight={(row.startDate ?? "").toString()}
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
          textToHighlight={(row.endDate ?? "").toString()}
        />
      ),
    },
  ];

  const [searchDevice, setSearchDevice] = useState("");
  const [searchSubscriber, setSearchSubscriber] = useState("");

  const setDefualtData = () => {
    console.log("detailPortfolio == ", detailPortfolio);
    setValue(
      "portfolioName",
      detailPortfolio?.portfolioInfo?.portfolioName || "-"
    );
    console.log(
      "detailPortfolio?.portfolioInfo?.startDate ==",
      detailPortfolio?.portfolioInfo?.startDate
    );
    setValue("startDate", detailPortfolio?.portfolioInfo?.startDate);
    setValue("endDate", detailPortfolio?.portfolioInfo?.endDate);
    const tempMechanism = initialvalueForSelectField(
      portfolioMechanismList,
      "id",
      detailPortfolio?.portfolioInfo?.mechanismId
    );
    setValue("mechanism", tempMechanism || "");
    const tempDevice = detailPortfolio?.device.map((item) => {
      return {
        ...item,
        startDate:
          item?.ugtStartDate == ""
            ? "-"
            : format(new Date(item?.ugtStartDate), "dd/MM/yyyy"),
        endDate:
          item?.ugtEndDate == ""
            ? "-"
            : format(new Date(item?.ugtEndDate), "dd/MM/yyyy"),
      };
    });
    setDeviceListSelected(tempDevice);

    const tempSubscriber = detailPortfolio?.subscriber.map((item) => {
      return {
        ...item,
        startDate:
          item?.ugtStartDate == ""
            ? "-"
            : format(new Date(item?.ugtStartDate), "dd/MM/yyyy"),
        endDate:
          item?.ugtEndDate == ""
            ? "-"
            : format(new Date(item?.ugtEndDate), "dd/MM/yyyy"),
      };
    });

    setSubscriberListSelected(tempSubscriber);
  };

  const onSubmitForm1 = (formData) => {
    console.log("deviceListSelected == ", deviceListSelected);
    const deviceList = deviceListSelected.map((item) => ({
      deviceId: item?.id,
      ugtStartDate:
        item?.startDate == null || item?.startDate == "-"
          ? null
          : format(convertToDate(item?.startDate), "yyyy-MM-dd"),
      ugtEndDate:
        item?.endDate == null || item?.endDate == "-"
          ? null
          : format(convertToDate(item?.endDate), "yyyy-MM-dd"),
    }));
    const subscriberList = subscriberListSelected.map((item) => ({
      subscriberId: item?.id,
      ugtStartDate:
        item?.startDate == null || item?.startDate == "-"
          ? null
          : format(convertToDate(item?.startDate), "yyyy-MM-dd"),
      ugtEndDate:
        item?.endDate == null || item?.endDate == "-"
          ? null
          : format(convertToDate(item?.endDate), "yyyy-MM-dd"),
    }));
    const params = {
      id: state?.code,
      portfolioName: formData?.portfolioName,
      merchanismId: formData?.mechanism?.id,
      startDate: formData?.startDate,
      endDate: formData?.endDate,
      device: deviceList,
      subscriber: subscriberList,
    };
    console.log("params ===", params);
    setParamsCreate(params);
    setShowModalCreateConfirm(true);
  };
  const handleClickConfirm = () => {
    setShowModalCreateConfirm(false);
    showLoading();
    dispatch(
      PortfolioManagementUpdate(paramsCreate, (res) => {
        console.log("res === ", res);
        if (res?.portfolioInfo !== null) {
          setShowModalComplete(true);
        } else {
          setFailedModal(true);
        }
        hideLoading();
      })
    );
  };
  const clearModal = (data) => {
    setFailedModal(data);
  };
  const handleCloseModalConfirm = (val) => {
    setShowModalCreateConfirm(false);

    console.log("cancle");
  };
  const handleSearchDeviceChange = (e) => {
    setSearchDevice(e.target.value);
  };
  const handleSearchSubscriberChange = (e) => {
    setSearchSubscriber(e.target.value);
  };
  const addDeviceModal = () => {
    const title = "Add Device";
    setTitleAddModal(title);
    setColumnsTable("device");
    setListTable(deviceList);
    setSelectedData(deviceListSelected);
    setShowModalAdd(true);
  };
  const addSubscriberModal = () => {
    const title = "Add Subscriber";
    setTitleAddModal(title);
    setColumnsTable("subscriber");
    setListTable(subscriberList);
    setSelectedData(subscriberListSelected);
    setShowModalAdd(true);
  };
  const onClickConfirmBtn = (data) => {
    const defualtStartDate = watch("startDate");
    const defualtEndDate = watch("endDate");
    if (titleAddModal == "Add Device") {
      if (defualtStartDate) {
        const remainingData = data.filter(
          (item) =>
            !detailPortfolio?.device.find(
              (selectedItem) => selectedItem.id === item.id
            )
        );
        const newDateDevice = remainingData.map((item) => {
          // device ที่ add เข้ามาใหม่ ถ้าวัน registrationDate น้อยกว่า startDate ของ port ให้ใช้วันของ portfolio
          let itemStartDate = dayjs(item?.registrationDate);
          if (itemStartDate < dayjs(defualtStartDate)) {
            itemStartDate = dayjs(defualtStartDate);
          }

          // เอา enddate ของ device หลังจากที่ edit ไปแล้วมาใช้
          let deviceDataTable = deviceListSelected.filter((row) => {
            return row.id === item.id;
          });

          let itemEndDate = dayjs(defualtEndDate);

          if (deviceDataTable.length > 0) {
            itemStartDate = dayjs(deviceDataTable[0]?.startDate, "DD/MM/YYYY");
            itemEndDate = dayjs(deviceDataTable[0]?.endDate, "DD/MM/YYYY");
          }
          return {
            ...item,
            startDate: itemStartDate.format("DD/MM/YYYY"),
            endDate: itemEndDate.format("DD/MM/YYYY"),
          };
          /*  return {
              ...item,
              startDate: format(new Date(item?.registrationDate), "dd/MM/yyyy"),
              endDate: format(new Date(defualtEndDate), "dd/MM/yyyy"),
            }; */
        });
        const currentDateDevice = detailPortfolio?.device.map((item) => {
          //  device ที่มีอยู่แล้วใน portfolio ใช้วัน ugtStartDate ของ Device
          let itemStartDate = dayjs(item?.ugtStartDate);

          // เอา enddate ของ device หลังจากที่ edit ไปแล้วมาใช้
          let deviceDataTable = deviceListSelected.filter((row) => {
            return row.id === item.id;
          });

          let itemEndDate = dayjs(deviceDataTable[0]?.endDate, "DD/MM/YYYY");
          return {
            ...item,
            startDate: itemStartDate.format("DD/MM/YYYY"),
            endDate: itemEndDate.format("DD/MM/YYYY"),
          };
        });

        const concatArray = [...currentDateDevice, ...newDateDevice];
        setDeviceListSelected(concatArray);
      } else {
        setDeviceListSelected(data);
      }
    } else if (titleAddModal == "Add Subscriber") {
      if (defualtStartDate) {
        const remainingData = data.filter(
          (item) =>
            !detailPortfolio?.subscriber.find(
              (selectedItem) => selectedItem.id === item.id
            )
        );
        const newDateSubscriber = remainingData.map((item) => {
          // subscriber ที่ add เข้ามาใหม่ ถ้าวัน retailESAContractStartDate น้อยกว่า startDate ของ port ให้ใช้วันของ portfolio
          let itemStartDate = dayjs(
            item?.retailESAContractStartDate,
            "DD/MM/YYYY"
          );
          if (itemStartDate < dayjs(defualtStartDate)) {
            itemStartDate = dayjs(defualtStartDate);
          }

          // เอา startdate และ enddate ของ subscriber หลังจากที่ edit ไปแล้วมาใช้
          let subscriberDataTable = subscriberListSelected.filter((row) => {
            return row.id === item.id;
          });

          let itemEndDate = dayjs(defualtEndDate);

          if (subscriberDataTable.length > 0) {
            itemStartDate = dayjs(
              subscriberDataTable[0]?.startDate,
              "DD/MM/YYYY"
            );
            itemEndDate = dayjs(subscriberDataTable[0]?.endDate, "DD/MM/YYYY");
          }
          return {
            ...item,
            startDate: itemStartDate.format("DD/MM/YYYY"),
            endDate: itemEndDate.format("DD/MM/YYYY"),
          };
          /*  return {
              ...item,
              startDate: format(new Date(item?.registrationDate), "dd/MM/yyyy"),
              endDate: format(new Date(defualtEndDate), "dd/MM/yyyy"),
            }; */
        });
        const currentDateSubscriber = detailPortfolio?.subscriber.map(
          (item) => {
            //  subscriber ที่มีอยู่แล้วใน portfolio ใช้วัน ugtStartDate ของ subscriber
            let itemStartDate = dayjs(item?.ugtStartDate);

            // เอา enddate ของ device หลังจากที่ edit ไปแล้วมาใช้
            let subscriberDataTable = subscriberListSelected.filter((row) => {
              return row.id === item.id;
            });

            let itemEndDate = dayjs(
              subscriberDataTable[0]?.endDate,
              "DD/MM/YYYY"
            );
            return {
              ...item,
              startDate: itemStartDate.format("DD/MM/YYYY"),
              endDate: itemEndDate.format("DD/MM/YYYY"),
            };
          }
        );

        const concatArray = [...currentDateSubscriber, ...newDateSubscriber];
        console.log("concatArray", concatArray);
        setSubscriberListSelected(concatArray);

        /*   const newDateSubscriber = data?.map((item) => {
          const startOverlap =
            new Date(defualtStartDate) < convertToDate(item?.subStartDate)
              ? convertToDate(item?.subStartDate)
              : new Date(defualtStartDate);
          const endOverlap =
            convertToDate(item?.subEndDate) < new Date(defualtEndDate)
              ? convertToDate(item?.subEndDate)
              : new Date(defualtEndDate);
          console.log(
            convertToDate(item?.subEndDate) < new Date(defualtEndDate)
          );
          return {
            ...item,
            retailESAContractStartDate: format(startOverlap, "dd/MM/yyyy"),
            retailESAContractEndDate: format(endOverlap, "dd/MM/yyyy"),
          };
        }); */
        // setSubscriberListSelected(newDateSubscriber);
      } else {
        setSubscriberListSelected(data);
      }
    }
  };
  const onCloseAddModal = () => {
    setShowModalAdd(false);
  };

  const editDevice = () => {
    if (deviceListSelected?.length > 0) {
      console.log("deviceListSelected ===", deviceListSelected);
      setTempDeviceListSelected(structuredClone(deviceListSelected));
      setOnEditDevice(true);
      setOnEditDatetimeDevice(true);
    }
  };
  const editSubscriber = () => {
    if (subscriberListSelected?.length > 0) {
      setTempSubscriberListSelected(structuredClone(subscriberListSelected));
      setOnEditSubscriber(true);
      setOnEditDatetimeSubscriber(true);
    }
  };

  const discardDevice = () => {
    setSelectDeviceChange([]);
    setDeviceListSelected([...tempDeviceListSelected]);
    setOnEditDevice(false);
    setOnEditDatetimeDevice(false);
  };

  const discardSubscriber = () => {
    setSelectSubscriberChange([]);
    setSubscriberListSelected([...tempSubscriberListSelected]);
    setOnEditSubscriber(false);
    setOnEditDatetimeSubscriber(false);
  };
  const handleDeviceDateChange = (newDate, rowId, type) => {
    const rowData = deviceListSelected.find((item) => item.id === rowId);
    if (type === "startDate") {
      rowData.startDate = newDate;
    } else if (type === "endDate") {
      rowData.endDate = newDate;
    }
  };
  const handleSubscriberDateChange = (newDate, rowId, type) => {
    const rowData = subscriberListSelected.find((item) => item.id === rowId);
    if (type === "startDate") {
      rowData.startDate = newDate;
    } else if (type === "endDate") {
      rowData.endDate = newDate;
    }
  };
  const onApplyChangeDevice = () => {
    const deviceListSelectedTemp = [...deviceListSelected];
    selectDeviceChange.forEach((id) => {
      const index = deviceListSelectedTemp.findIndex((row) => row.id === id);
      if (index !== -1) {
        deviceListSelectedTemp.splice(index, 1);
      }
    });
    setDeviceListSelected(deviceListSelectedTemp);
    setOnEditDevice(false);
    setOnEditDatetimeDevice(false);
    setSelectDeviceChange([]);
    console.log("deviceListSelected === ", deviceListSelected);
  };

  const onApplyChangeSubscriber = () => {
    const subscriberListSelectedTemp = [...subscriberListSelected];

    selectSubscriberChange.forEach((id) => {
      const index = subscriberListSelectedTemp.findIndex(
        (row) => row.id === id
      );
      if (index !== -1) {
        subscriberListSelectedTemp.splice(index, 1);
      }
    });
    setSubscriberListSelected(subscriberListSelectedTemp);
    setOnEditSubscriber(false);
    setOnEditDatetimeSubscriber(false);
    setSelectSubscriberChange([]);
    console.log("subscriberListSelected === ", subscriberListSelected);
  };
  const selectedDeviceChange = (selected) => {
    setSelectDeviceChange(selected);
  };
  const selectedSubscriberChange = (selected) => {
    setSelectSubscriberChange(selected);
  };
  const backtoPortfolioListPage = () => {
    navigate(WEB_URL.PORTFOLIO_LIST);
  };
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto text-left">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                {detailPortfolio?.portfolioInfo?.portfolioName || "-"}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Portfolio & Settlement Management /
                Portfolio Info /{" "}
                <span className="truncate">
                  {detailPortfolio?.portfolioInfo?.portfolioName || "-"}
                </span>
              </p>
            </div>

            <form>
              <div className="flex flex-col gap-3">
                {/* Portfolio Information */}
                <Card
                  shadow="md"
                  radius="lg"
                  className="flex w-full h-full overflow-visible"
                  padding="xl"
                >
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                      <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                        <div className="md:col-span-6 flex items-center gap-3">
                          <FaChevronCircleLeft
                            className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                            size="30"
                            onClick={() =>
                              navigate(WEB_URL.PORTFOLIO_INFO, {
                                state: { id: state?.code },
                              })
                            }
                          />
                          <h6 className="text-PRIMARY_TEXT font-semibold mb-0">
                            Portfolio Information
                          </h6>
                        </div>
                        <div className="md:col-span-6">
                          <Controller
                            name="portfolioName"
                            control={control}
                            rules={{
                              required: "This field is required",
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id={"portfolioName"}
                                type={"text"}
                                label={"Portfolio Name"}
                                error={errors.portfolioName}
                                validate={" *"}
                                // ... other props
                              />
                            )}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Controller
                            name="startDate"
                            control={control}
                            rules={{
                              required: "This field is required",
                            }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                id={"startDate"}
                                label={"Start Date"}
                                error={errors.startDate}
                                onChangeInput={handleChangeCommissioningDate}
                                onCalDisableDate={disableStartDateCal}
                                isDisable={isStartPort}
                                validate={" *"}
                                // ... other props
                              />
                            )}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Controller
                            name="endDate"
                            control={control}
                            rules={{
                              required: "This field is required",
                            }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                id={"endDate"}
                                label={"End Date"}
                                error={errors.endDate}
                                onChangeInput={handleChangeEndDate}
                                onCalDisableDate={
                                  requestedEffectiveDateDisableDateCal
                                }
                                isDisable={disableRequestedEffectiveDate}
                                validate={" *"}
                                // ... other props
                              />
                            )}
                          />
                          {disableRequestedEffectiveDate && (
                            <Tooltip
                              anchorSelect="#registration-date-tooltip"
                              content="Please select the commissioning date first."
                            />
                          )}
                        </div>
                        <div className="md:col-span-3">
                          <Controller
                            name="mechanism"
                            control={control}
                            defaultValue={null}
                            rules={{
                              required: "This field is required",
                            }}
                            render={({ field }) => (
                              <MySelect
                                {...field}
                                id={"mechanism"}
                                options={portfolioMechanismList}
                                displayProp={"mexhanismName"}
                                valueProp={"id"}
                                label={"Mechanism"}
                                validate={" *"}
                                error={errors.mechanism}
                                disable={disableUtility}
                                // ... other props
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Devices Assignment */}
                <Card
                  shadow="md"
                  radius="lg"
                  className="flex w-full h-full overflow-visible"
                  padding="xl"
                >
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
                            {deviceListSelected?.length}{" "}
                            {deviceListSelected?.length > 1
                              ? "Devices"
                              : "Device"}
                          </label>
                        </div>
                      </div>

                      <div className="grid col-span-4 grid-cols-12">
                        <form
                          autoComplete="off"
                          className="grid col-span-12 grid-cols-12"
                        >
                          <div className="col-span-1 px-2"></div>
                          {onEditDevice && (
                            <div className="col-span-6 px-2"></div>
                          )}

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

                          {!onEditDevice && (
                            <div className="col-span-2 px-2">
                              <div
                                type="button"
                                onClick={editDevice}
                                className={`w-full h-[40px] bg-LIGHT_BUTTON border-BREAD_CRUMB border-1 rounded no-underline`}
                              >
                                <div className="flex justify-center items-center">
                                  <button
                                    type="button"
                                    className={`h-[40px] text-BREAD_CRUMB  rounded`}
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-span-4 px-2">
                            {isStartDate && isEndDate ? (
                              !onEditDevice && (
                                <div
                                  type="button"
                                  // to={WEB_URL.DEVICE_ADD}
                                  onClick={addDeviceModal}
                                  className={`w-full h-[40px] bg-[#87be33] rounded no-underline	`}
                                >
                                  <div className="flex justify-center items-center">
                                    <img
                                      src={plus}
                                      alt="React Logo"
                                      width={20}
                                      height={20}
                                      className={"text-white mr-2"}
                                    />

                                    <button
                                      className="h-[40px] text-white bg-[#87be33] rounded"
                                      type="button"
                                    >
                                      Add Device
                                    </button>
                                  </div>
                                </div>
                              )
                            ) : (
                              <div
                                type="button"
                                className={`w-full h-[40px] bg-[#87be33] rounded no-underline	opacity-50`}
                              >
                                <div className="flex justify-center items-center ">
                                  <img
                                    src={plus}
                                    alt="React Logo"
                                    width={20}
                                    height={20}
                                    className={"text-white mr-2"}
                                  />

                                  <button
                                    className="h-[40px] text-white bg-[#87be33] rounded "
                                    type="button"
                                  >
                                    Add Device
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                    {onEditDevice && (
                      <div className="col-span-2 mb-2">
                        <div
                          className={`w-full h-[50px] flex  items-center justify-between bg-LIGHT_BUTTON rounded no-underline`}
                        >
                          <div className="flex gap-2 pl-4 items-center text-PRIMARY_TEXT">
                            {selectDeviceChange?.length == 0 ? (
                              <>
                                <IoInformationCircleSharp size={20} />
                                <span>Select checkbox to remove</span>
                              </>
                            ) : (
                              <span>
                                {selectDeviceChange?.length} Selected item to
                                remove
                              </span>
                            )}
                          </div>

                          <div className="flex justify-end mr-4 items-center">
                            <button
                              type="button"
                              onClick={onApplyChangeDevice}
                              className={`h-[30px] text-white bg-DANGER_BUTTON rounded mr-4 px-4`}
                            >
                              {selectDeviceChange?.length > 0
                                ? "Remove and Apply change"
                                : "Apply change"}
                            </button>
                            <button
                              type="button"
                              onClick={discardDevice}
                              className={`text-BREAD_CRUMB rounded`}
                            >
                              Discard
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {deviceListSelected?.length > 0 ? (
                      <div>
                        <DataTablePortfolio
                          data={deviceListSelected}
                          columns={columnsDevice}
                          searchData={searchDevice}
                          checkbox={onEditDevice}
                          editDatetime={onEditDatetimeDevice}
                          onSelectedRowsChange={selectedDeviceChange}
                          dateChange={handleDeviceDateChange}
                          isStartPort={isStartPort}
                          isTotal={"Total Capacity"}
                          portfolioStartDate={getValues("startDate")}
                          portfolioEndDate={getValues("endDate")}
                        />
                      </div>
                    ) : (
                      <div>
                        <p class="px-4 py-4 text-gray">No data selected</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Subscriber Assignment */}
                <Card
                  shadow="md"
                  radius="lg"
                  className="flex w-full h-full overflow-visible"
                  padding="xl"
                >
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
                            {subscriberListSelected?.length}{" "}
                            {subscriberListSelected?.length > 1
                              ? "Subscribers"
                              : "Subscriber"}
                          </label>
                        </div>
                      </div>

                      <div className="grid col-span-4 grid-cols-12">
                        <form className="grid col-span-12 grid-cols-12">
                          <div className="col-span-1 px-2"></div>
                          {onEditSubscriber && (
                            <div className="col-span-6 px-2"></div>
                          )}
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
                          {!onEditSubscriber && (
                            <div className="col-span-2 px-2">
                              <div
                                type="button"
                                onClick={editSubscriber}
                                className={`w-full h-[40px] bg-LIGHT_BUTTON border-BREAD_CRUMB border-1 rounded no-underline`}
                              >
                                <div className="flex justify-center items-center">
                                  <button
                                    type="button"
                                    className={`h-[40px] text-BREAD_CRUMB  rounded`}
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-span-4 px-2">
                            {isStartDate && isEndDate ? (
                              !onEditSubscriber && (
                                <div
                                  type="button"
                                  // to={WEB_URL.DEVICE_ADD}
                                  onClick={addSubscriberModal}
                                  className={`w-full h-[40px] bg-[#87be33] rounded no-underline	`}
                                >
                                  <div className="flex justify-center items-center">
                                    <img
                                      src={plus}
                                      alt="React Logo"
                                      width={20}
                                      height={20}
                                      className={"text-white mr-2"}
                                    />

                                    <button
                                      className="h-[40px] text-white bg-[#87be33] rounded"
                                      type="button"
                                    >
                                      Add Subscriber
                                    </button>
                                  </div>
                                </div>
                              )
                            ) : (
                              <div
                                type="button"
                                className={`w-full h-[40px] bg-[#87be33] rounded no-underline	opacity-50`}
                              >
                                <div className="flex justify-center items-center ">
                                  <img
                                    src={plus}
                                    alt="React Logo"
                                    width={20}
                                    height={20}
                                    className={"text-white mr-2"}
                                  />

                                  <button
                                    className="h-[40px] text-white bg-[#87be33] rounded "
                                    type="button"
                                  >
                                    Add Subscriber
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                    {onEditSubscriber && (
                      <div className="col-span-2 mb-2">
                        <div
                          className={`w-full h-[50px] flex items-center justify-between bg-LIGHT_BUTTON rounded no-underline`}
                        >
                          <div className="flex gap-2 pl-4 items-center text-PRIMARY_TEXT">
                            {selectSubscriberChange?.length == 0 ? (
                              <>
                                <IoInformationCircleSharp size={20} />
                                <span>Select checkbox to remove</span>
                              </>
                            ) : (
                              <span>
                                {selectSubscriberChange?.length} Selected item
                                to remove
                              </span>
                            )}
                          </div>

                          <div className="flex justify-end mr-4 items-center">
                            <button
                              type="button"
                              onClick={onApplyChangeSubscriber}
                              className={`h-[30px] text-white bg-DANGER_BUTTON rounded mr-4 px-4`}
                            >
                              {selectSubscriberChange?.length > 0
                                ? "Remove and Apply change"
                                : "Apply change"}
                            </button>
                            <button
                              type="button"
                              onClick={discardSubscriber}
                              className={`text-BREAD_CRUMB rounded`}
                            >
                              Discard
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {subscriberListSelected?.length > 0 ? (
                      <div>
                        <DataTablePortfolio
                          data={subscriberListSelected}
                          columns={columnsSubscriber}
                          searchData={searchSubscriber}
                          checkbox={onEditSubscriber}
                          editDatetime={onEditDatetimeSubscriber}
                          onSelectedRowsChange={selectedSubscriberChange}
                          dateChange={handleSubscriberDateChange}
                          isStartPort={isStartPort}
                          isTotal={"Total Allocated Energy Amount"}
                          portfolioStartDate={getValues("startDate")}
                          portfolioEndDate={getValues("endDate")}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="px-4 py-4 text-gray">No data selected</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* submit button */}
                <div className="text-center my-5">
                  <button
                    onClick={backtoPortfolioListPage}
                    className="mr-4 w-1/4 rounded h-12 px-6 text-gray transition-colors duration-150 rounded-lg focus:shadow-outline bg-[#CBD0D5] hover:bg-[#78829D] text-[#78829D] hover:text-white font-semibold"
                  >
                    Back
                  </button>
                  {!onEditSubscriber && !onEditDevice ? (
                    <button
                      onClick={handleSubmit(onSubmitForm1)}
                      className="ml-4 w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB font-semibold"
                    >
                      <b>Save</b>
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      className="ml-4 w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg opacity-50"
                    >
                      <b>Save</b>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* {isOpenLoading && <ModelLoadPage></ModelLoadPage>} */}
        {showModalCreate && (
          <ModalConfirm
            onClickConfirmBtn={handleClickConfirm}
            onCloseModal={handleCloseModalConfirm}
            title={"Are you sure?"}
            content={"Do you confirm the change?"}
          />
        )}
        {showModalComplete && (
          <ModalComplete
            title="Done!"
            context="Update Complete"
            link={WEB_URL.PORTFOLIO_LIST}
          />
        )}
        {showModalAdd && (
          <ModalAddPort
            title={titleAddModal}
            columns={columnsTable}
            selectedData={selectedData}
            dataList={listTable}
            onClickConfirmBtn={onClickConfirmBtn}
            closeModal={onCloseAddModal}
          />
        )}
        {failedModal && (
          <ModalFail
            onClickOk={clearModal}
            content="Your Portfolio Name is the same as in the database"
          />
        )}
      </div>
    </div>
  );
};

export default UpdatePortfolio;

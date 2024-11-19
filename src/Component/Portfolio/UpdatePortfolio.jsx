import React, { useState, useEffect ,useRef } from "react";
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
  PortfolioManagementForVailidation,
  PortfolioValidationDevicePopup,
  PortfolioValidationSubPopup,
  PortfolioSendEmailDevice,
  PortfolioSendEmailSubscriber
} from "../../Redux/Portfolio/Action";
import { FaChevronCircleLeft } from "react-icons/fa";
import { hideLoading, showLoading } from "../../Utils/Utils";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { IoInformationCircleSharp } from "react-icons/io5";
import DataTableForCaptures from "../Control/Table/DataTableForCapture";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';
import '../Control/Css/page.css'
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ModalValidation from "./Modalpopupvalidation";
import { BiErrorCircle } from "react-icons/bi";
import WarningIcon from '@mui/icons-material/Warning';
import ModalConfirmChangeDatePortrun from "../Control/Modal/ModalChangDate";
import DatePickerEndDate from "./DatePickerEndDate";
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
  const cardRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const [selectedCommisionDate, setSelectedCommisionDate] = useState(null);
  const [selectedCommisionDateCheck, setSelectedCommisionDateCheck] = useState(null);
  const [deviceChanges, setDeviceChanges] = useState([]);
  const [subChanges, setSubChanges] = useState([]);
  const [disableRequestedEffectiveDate, setDisableRequestedEffectiveDate] =
    useState(true);
  const userData = useSelector((state) => state.login.userobj);
  const [disableUtility, setDisableUtility] = useState(false);
  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;
  const [isStartDate, setIsStartDate] = useState(false);
  const [isEndDate, setIsEndDate] = useState(false);
  const [isClearData, setIsClearData] = useState(false);
  const detailPortfolio = useSelector(
    (state) => state.portfolio.getOnePortfolio
  );
  const portfolioValidateStatus = useSelector((state) => state.portfolio.portfolioValidateStatus)
  const getValidationDevicePopup = useSelector((state) => state.portfolio.getValidationDevicePopup)
  const getValidationSubPopup = useSelector((state) => state.portfolio.getValidationSubPopup)
  const [showPopup, setShowPopup] = useState(false);
  const datebofore = useRef()
  const [selectedDate, setSelectedDate] = useState(null); // State for the selected date
  console.log(userData)
  
 
  
  
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
  function convertDateFormat(dateString) {
    const [day, month, year] = dateString.split('/'); // Split the date string
    return `${year}-${month}-${day}`; // Return in 'YYYY-MM-DD' format
  }
  const handleChangeCommissioningDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setValue("endDate", "");
    // If date has a value that is considered truthy (like a valid date object, a non-empty string, etc.), !!date will be true, and setIsStartDate will be called with true. If date is falsy (like null, undefined, an empty string, etc.), !!date will be false
    setIsStartDate(!!date);
    setIsEndDate(false);
    setOnEditDevice(false);
    setOnEditDatetimeDevice(false);
    setOnEditSubscriber(false);
    setOnEditDatetimeSubscriber(false);
    setSelectedCommisionDate(date);
    setSelectedCommisionDateCheck(formattedDate)
    setValue("retailESAContractEndDate", "");
    // setDeviceListSelected([]);
    // setSubscriberListSelected([]);
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
  const EnddateCheck = useRef()
  const handleChangeEndDate = (date) => {
    EnddateCheck.current = date
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
   
    setOnEditDevice(false);
    setOnEditDatetimeDevice(false);
    setOnEditSubscriber(false);
    setOnEditDatetimeSubscriber(false);
    console.log("Onchange End Date",selectedCommisionDateCheck)
    if(date !== undefined && selectedCommisionDateCheck !== null){
      
    dispatch(PortfolioManagementDevice(currentUGTGroup?.id,selectedCommisionDateCheck,formattedDate,state?.code,true));
    dispatch(
      PortfolioManagementSubscriber(currentUGTGroup?.id,selectedCommisionDateCheck,formattedDate,state?.code,true)
    );
  }
    setIsEndDate(!!date);
    const startDatePort = watch("startDate");
    
    // console.log("startDatePort ==== ", new Date(startDatePort));
    // console.log("endDatePort === ", date);

    if (date) {
      if (!isStartPort) {
        console.log("popup show")
        if(date !== undefined && selectedCommisionDateCheck !== null){
        }
        if (isClearData) {
          setDeviceListSelected([]);
          setSubscriberListSelected([]);
        }
      } else {
        console.log("popup show")
        if(date !== undefined && selectedCommisionDateCheck !== null){
        }
        // device
        let newDateDeviceList = deviceListSelected
          .filter((item) => {
            const startDevice = dayjs(item?.startDate, [
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]);
            const endDevice = dayjs(date).startOf("day");
            return endDevice >= startDevice;
          })
          .map((item) => {
            console.log("Date End",item)
            const Enddevice = dayjs(item?.expiryDate, [
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]);

            let endDateValue;
            console.log("endSub", Enddevice);
            console.log("date", date);
            if (date < Enddevice) {
              endDateValue = dayjs(date);
            } else {
              endDateValue = dayjs(Enddevice);
            }
            return {
              ...item,
              endDate: endDateValue.format("DD/MM/YYYY"),
            };
          });
        setDeviceListSelected(newDateDeviceList);

        // subscriber
          
        let newSuscriberList = subscriberListSelected
          .filter((item) => {
            /* const partStartTemp = item?.retailESAContractStartDate.split("/");
            const startSub = new Date(
              `${partStartTemp[2]}-${partStartTemp[1]}-${partStartTemp[0]}`
            );
            const partEndTemp = item?.retailESAContractEndDate.split("/");
            const endSub = new Date(
              `${partEndTemp[2]}-${partEndTemp[1]}-${partEndTemp[0]}`
            ); */
            const startSub = dayjs(item?.startDate, [
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]);
            const endSub = dayjs(item?.endDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
            const startPort = new Date(startDatePort).setHours(0, 0, 0, 0);
            const endPort = dayjs(date).startOf("day");
            return startSub <= endPort && endSub >= startPort;
          })
          .map((item) => {
            console.log("Date End",item)
            const endSub = dayjs(item?.retailESAContractEndDate, [
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]);

            let endDateValue;
            console.log("endSub", endSub);
            console.log("date", date);
            if (date < endSub) {
              endDateValue = dayjs(date);
            } else {
              endDateValue = dayjs(endSub);
            }
            return {
              ...item,
              endDate: endDateValue.format("DD/MM/YYYY"),
            };
          });

        setSubscriberListSelected(newSuscriberList);
      }
      setIsClearData(true);
    }
    
  };
  const disableStartDateCal = (day) => {
    // หาว่าตอนนี้อยู่ ugtGroup ไหน จาก userGroup
    const currentUgtGroupData = userData?.ugtGroups?.filter(
      (item) => item?.id === currentUGTGroup?.id
    );

    // กำหนดวันแรกของ port ตาม ugtGroup ที่เลือกอยู่ ถ้าไม่เจอวันแรกของ port ให้ใช้เป็นวันปัจจุบันไปก่อน
    const ugtGroupStartDate = currentUgtGroupData[0]?.startDate
      ? dayjs(currentUgtGroupData[0]?.startDate).startOf("day")
      : dayjs().startOf("day");

    // กำหนดวันสุดท้ายของ port ตาม ugtGroup ที่เลือกอยู่ ถ้าไม่เจอวันสุดท้ายของ port ให้ใช้เป็นวันถัดมาจากวันที่เริ่มต้นไปก่อน
    const ugtGroupStopDate = currentUgtGroupData[0]?.stopDate
      ? dayjs(currentUgtGroupData[0]?.stopDate).startOf("day")
      : dayjs(selectedCommisionDate).startOf("day").add(1, "day");

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
      ? dayjs(currentUgtGroupData[0]?.stopDate).startOf("day")
      : dayjs(selectedCommisionDate).startOf("day").add(1, "day");

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
  
  console.log(detailPortfolio?.portfolioInfo?.portfolioOperate)
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
  const [paramsForValidation, setParamsForValidation] = useState("");
  const [selectSubscriberChange, setSelectSubscriberChange] = useState([]);
  const [paramsCreate, setParamsCreate] = useState("");
  const [failedModal, setFailedModal] = useState("");
  const [tempDeviceListSelected, setTempDeviceListSelected] = useState([]);
  const [tempSubscriberListSelected, setTempSubscriberListSelected] = useState(
    []
  );
 
  const [isStartPort, setIsStartPort] = useState(false);
  const [formattedCurrentDate, setformattedCurrentDate] = useState("");
  const [openpopupDeviceError,setopenpopupDeviceError] = useState(false)
  const [filteredDeviceList, setFilteredDeviceList] = useState(deviceListSelected);
  const [isAddDevice, setisAddDevice] = useState(false);
  const [isAddSub, setisAddSub] = useState(false);
  const [IsRemovedDevice,setIsRemovedDevice] = useState(false);
  const [IsRemovedSub,setIsRemovedSub] = useState(false);
  const [IsError,setIsError] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (Array.isArray(portfolioValidateStatus.device)) {
      const devicesWithError = portfolioValidateStatus.device.filter(device => device.isError === true);
  
      // Map over deviceListSelected to add isError flag
      const updatedDeviceList = deviceListSelected.map(device => {
        const errorDevice = devicesWithError.find(errorDevice => errorDevice.deviceId === device.id);
        return {
          ...device,
          isError: errorDevice ? true : false,
        };
      });
  
      setFilteredDeviceList(updatedDeviceList);
      console.log(updatedDeviceList)
    } else {
      setFilteredDeviceList(deviceListSelected)
      console.log(deviceListSelected)
    }
  }, [portfolioValidateStatus, deviceListSelected]);
  
  const [filteredSubList, setFilteredSubList] = useState(subscriberListSelected);
  
  useEffect(() => {
    if (Array.isArray(portfolioValidateStatus.subscriber)) {
      const subWithError = portfolioValidateStatus.subscriber.filter(sub => sub.isError === true);
  
      // Map over deviceListSelected to add isError flag
      const updatedSubList = subscriberListSelected.map(sub => {
        const errorSub = subWithError.find(errorSub => errorSub.subscriberId === sub.id);
        return {
          ...sub,
          isError: errorSub ? true : false,
        };
      });
  
      setFilteredSubList(updatedSubList);
      console.log(updatedSubList)
    } else {
      setFilteredSubList(subscriberListSelected)
      console.log(subscriberListSelected)
    }
  }, [portfolioValidateStatus, subscriberListSelected]);

  useEffect(() => {
    return () => dispatch({ type: "RESET_STATE" });
  }, []);

  useEffect(() => {
    if (state?.code) {
    console.log("state?.code", state?.code);
    showLoading();
    dispatch(
      PortfolioGetOne(state?.code, () => {
        hideLoading();
      })
    );
    if(detailPortfolio?.portfolioInfo){
      setSelectedCommisionDateCheck(detailPortfolio?.portfolioInfo?.startDate)
      console.log("Start Date",detailPortfolio?.portfolioInfo?.startDate)
      console.log("End Date",detailPortfolio?.portfolioInfo?.endDate)
    dispatch(PortfolioManagementDevice(
      currentUGTGroup?.id,
      detailPortfolio?.portfolioInfo?.startDate,
      detailPortfolio?.portfolioInfo?.endDate,
      state?.code,true));
    dispatch(
      PortfolioManagementSubscriber(
        currentUGTGroup?.id,
        detailPortfolio?.portfolioInfo?.startDate,
        detailPortfolio?.portfolioInfo?.endDate,
        state?.code, 
        true)
    );
  }
  }
    dispatch(PortfolioMechanismList());
  }, [state?.code,detailPortfolio?.portfolioInfo?.startDate,detailPortfolio?.portfolioInfo?.endDate]);

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
            endDate: formatDate(item.expiryDate), // Add formatted end date
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
  const handleErrorDevicepopup = (id,name,stDate,enDate) => {
    setColumnsTable("device");
    // Function to parse DD/MM/YYYY and return a Date object
    const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // month is 0-based in Date
  };

  // Parse and format the start and end dates
  const formattedStDate = parseDate(stDate);
  const formattedEnDate = parseDate(enDate);

  // Format the dates to a more human-readable format
  const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize as needed
  const formattedStDateString = new Intl.DateTimeFormat('en-US', options).format(formattedStDate);
  const formattedEnDateString = new Intl.DateTimeFormat('en-US', options).format(formattedEnDate);

    dispatch(
      PortfolioValidationDevicePopup(state?.code,id,formattedStDateString,formattedEnDateString, (res) => {
        console.log("res === ", res);
        if (res !== null) {
          
          setopenpopupDeviceError(true)
        } else {
          setFailedModal(true);
        }
        hideLoading();
      })
    );
    console.log("Error details for row:", id,name,formattedStDateString,formattedEnDateString);
   
  };
  const handleErrorSubpopup = (id,stDate,enDate,subcon) => {
    setColumnsTable("subscriber");
    // Function to parse DD/MM/YYYY and return a Date object
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day); // month is 0-based in Date
  };

  // Parse and format the start and end dates
  const formattedStDate = parseDate(stDate);
  const formattedEnDate = parseDate(enDate);

  // Format the dates to a more human-readable format
  const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize as needed
  const formattedStDateString = new Intl.DateTimeFormat('en-US', options).format(formattedStDate);
  const formattedEnDateString = new Intl.DateTimeFormat('en-US', options).format(formattedEnDate);

    dispatch(
      PortfolioValidationSubPopup(state?.code,id,formattedStDateString,formattedEnDateString,subcon, (res) => {
        console.log("res === ", res);
        if (res !== null) {
          
          setopenpopupDeviceError(true)
        } else {
          setFailedModal(true);
        }
        hideLoading();
      })
    );
    console.log("Error details for row:", id,formattedStDateString,formattedEnDateString);
   
  };
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
      label: "Device Fuel",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchDevice]}
          autoEscape={true}
          textToHighlight={row.fuelName}
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
    {
      id: "errorDevice",
      label: "",
      align: "center",
      render: (row) => {
        // Display error icon if isError is true for this row
        return row.isError ? (
          <div
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }} // Center the icon and make it look clickable
      >
        <WarningIcon
          style={{ color: "red", marginLeft: 4 }}
          titleAccess="Error" // Tooltip text
        />
        <div
         type="button"
         className="w-24 bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-2"
         onClick={() => handleErrorDevicepopup(row)}
        >
          Error Detail
        </div>
      </div>
        ) : null;
      },
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
      label: "Contracted Energy(kWh)",
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
    {
      id: "errorSub",
      label: "",
      align: "center",
      render: (row) => {
        // Display error icon if isError is true for this row
        return row.isError ? (
          <div
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }} // Center the icon and make it look clickable
      >
        <WarningIcon
          style={{ color: "red", marginLeft: 4 }}
          titleAccess="Error" // Tooltip text
        />
        <div
         type="button"
         className="w-24 bg-red-500 text-white p-1 rounded hover:bg-red-600 ml-2"
         onClick={() => handleErrorSubpopup(row)}
        >
          Error Detail
        </div>
      </div>
        ) : null;
      },
    },
  ];

  const [searchDevice, setSearchDevice] = useState("");
  const [searchSubscriber, setSearchSubscriber] = useState("");

  const setDefualtData = () => {
    console.log("run setDefaultData");
    setValue(
      "portfolioName",
      detailPortfolio?.portfolioInfo?.portfolioName || "-"
    );
    datebofore.current = detailPortfolio?.portfolioInfo?.endDate 
    setValue("startDate", detailPortfolio?.portfolioInfo?.startDate);
    setValue("endDate", detailPortfolio?.portfolioInfo?.endDate);
    setSelectedCommisionDate(detailPortfolio?.portfolioInfo?.startDate)
    const tempMechanism = initialvalueForSelectField(
      portfolioMechanismList,
      "id",
      detailPortfolio?.portfolioInfo?.mechanismId
    );
    setValue("mechanism", tempMechanism || "");
    const tempDevice = detailPortfolio?.device.map((item) => {
      console.log(item)
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
        expriryDate : 
          item?.expiryDate == "" 
            ? "-" 
            : format(new Date(item?.expiryDate), "dd/MM/yyyy"),
        regisDate : 
            item?.registrationDate == "" 
              ? "-" 
              : format(new Date(item?.registrationDate), "dd/MM/yyyy")
      };
    });

    setDeviceListSelected(tempDevice);
    console.log("tempDevice ==", tempDevice);

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
        checkstartDate :
        item?.retailESAContractStartDate == ""
          ? "-"
          : format(new Date(item?.retailESAContractStartDate), "dd/MM/yyyy"),
          checkEndDate :
          item?.retailESAContractEndDate == ""
            ? "-"
            : format(new Date(item?.retailESAContractEndDate), "dd/MM/yyyy"),
      };
    });

    setSubscriberListSelected(tempSubscriber);
  };

   const onSubmitForm1 = (formData) => {
    console.log("deviceListSelected", deviceListSelected);
    const element = cardRef.current//document.getElementById('pdf-content');
    element.style.display = 'block';
  // กำหนดตัวเลือกสำหรับ html2pdf
  const options = {
    margin: 0,
    filename: 'webscreen.pdf',
    image: { type: 'jpeg', quality: 50 },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    html2canvas: { scale: 2}, // เพิ่ม scale เพื่อเพิ่มความละเอียด
    jsPDF: { unit: 'cm', format: 'a3', orientation: 'portrait'},
  };

  
  // สร้าง PDF ด้วย html2pdf และดึง base64 string
  html2pdf()
    .from(element)
    .set(options)
    .outputPdf('datauristring') // ดึงข้อมูลออกมาเป็น Base64 string
    .then((pdfBase64) => {
      // console.log(pdfBase64); // แสดง base64 string ใน console
      const base64Content = pdfBase64.split(",")[1];
      const now = new Date();
      const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
      const structrueSend =[{
        id:0,
        guid:"",
        name: formattedDateTime+".pdf",
        binary: base64Content,
        type: "application/pdf"
      }]
    
    // const blob = new Blob([Uint8Array.from(atob(base64Content), c => c.charCodeAt(0))], { type: "application/pdf" });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = `${formattedDateTime}.pdf`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link); 
    element.style.display = 'none';
  
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
      subscribersContractInformationId : item.subscribersContractInformationId
 
    }));
    const portfoliosHistoryLogList = [{
      deviceId : 0,
      subscriberId: 0,
      subscribersContractInformationId: 0,
      action: "Edit",
      createBy: userData?.firstName + " " + userData?.lastName 
    }]
    const portfoliosHistoryLogListWhenaddNewItemDevice = [{
      deviceId : 0,
      subscriberId: 0,
      subscribersContractInformationId: 0,
      action: "Add Device",
      createBy: userData?.firstName + " " + userData?.lastName
    }]
    const portfoliosHistoryLogListWhenaddNewItemSub = [{
      deviceId : 0,
      subscriberId: 0,
      subscribersContractInformationId: 0,
      action: "Add Subscriber",
      createBy: userData?.firstName + " " + userData?.lastName 
    }]
    const portfoliosHistoryLogListWhenaddRemovedItemDevice = [{
      deviceId : 0,
      subscriberId: 0,
      subscribersContractInformationId: 0,
      action: "Discontinue - Device",
      createBy: userData?.firstName + " " + userData?.lastName 
    }]
    const portfoliosHistoryLogListWhenaddRemovedItemSub = [{
      deviceId : 0,
      subscriberId: 0,
      subscribersContractInformationId: 0,
      action: "Discontinue - Subscriber",
      createBy: userData?.firstName + " " + userData?.lastName 
    }]
    const updatedPortfoliosHistoryLogList = [
      ...portfoliosHistoryLogList,
      ...(isAddDevice? [...portfoliosHistoryLogListWhenaddNewItemDevice] : []),
      ...(isAddSub? [...portfoliosHistoryLogListWhenaddNewItemSub] : []),
      ...(IsRemovedDevice? [...portfoliosHistoryLogListWhenaddRemovedItemDevice] : []),
      ...(IsRemovedSub? [...portfoliosHistoryLogListWhenaddRemovedItemSub] : []),
      ...deviceChanges,
      ...subChanges
    ];
    const params = {
      id: state?.code,
      portfolioName: formData?.portfolioName,
      merchanismId: formData?.mechanism?.id,
      startDate: formData?.startDate,
      endDate: formData?.endDate,
      device: deviceList,
      subscriber: subscriberList,
      fileUploadPortfoliosHistoryLog: detailPortfolio?.portfolioInfo?.portfolioOperate ? structrueSend : [],
      portfoliosHistoryLog : updatedPortfoliosHistoryLogList,
    };
    const paramsforvalidation = {
      portfolioName: formData?.portfolioName,
      merchanismId: formData?.mechanism?.id,
      startDate: formData?.startDate,
      endDate: formData?.endDate,
      PortfolioId : state?.code,
      ugtGroupId: currentUGTGroup?.id,
      device: deviceList,
      subscriber: subscriberList,
    };
    console.log("params ===", params);
    setParamsForValidation(paramsforvalidation)
    setParamsCreate(params);
    return structrueSend
  })
  .catch((error) => {
    console.error('Error generating PDF:', error);
    element.style.display = 'none';
  });
  if (deviceListSelected?.length === 0 || subscriberListSelected?.length === 0) {
    setIsError(true); // Set isError to true if either list is empty
    return; // Exit the function if there is an error
  } else {
    setIsError(false);
    setShowModalCreateConfirm(true);
    return;
  }

  };
  const handleClickConfirm = () => {
    // Early exit if already processing
    if (isProcessing) return;
  
    setShowModalCreateConfirm(false);
    showLoading();
    setIsProcessing(true); // Set the flag to true when processing starts
  
    dispatch(
      PortfolioManagementForVailidation(paramsForValidation, (res) => {
        console.log(res);
        if (res?.isPass) { // Check validation status from response
          dispatch(
            PortfolioManagementUpdate(paramsCreate,userData?.firstName + " " + userData?.lastName, (createRes) => {
              console.log("res === ", createRes);
              if (res?.portfolioInfo !== null) {
                setShowModalComplete(true);
  
                // Create a function to handle the dispatch of device changes
                const dispatchDeviceChanges = (index) => {
                  // If index is out of bounds for deviceChanges, check subChanges
                  if (index >= deviceChanges.length) {
                    // Start dispatching subscriber changes from index 0
                    dispatchSubscriberChanges(0);
                    return; // Exit device processing
                  }
                
                  // Destructure deviceId and action from deviceChanges
                  const { deviceId, action } = deviceChanges[index];
                
                  // Check if deviceId exists; if not, skip to the next item
                  if (!deviceId) {
                    dispatchDeviceChanges(index + 1); // Move to the next device change
                    return; // Exit early for this iteration
                  }
                
                  // Check the action and set isAdd accordingly, or skip if "Edit"
                  if (action === "Edit") {
                    dispatchDeviceChanges(index + 1); // Skip to the next device change
                    return; // Exit early for this iteration
                  }
                
                  // Set isAdd based on action type
                  const isAdd = action === "Add"; // true if "Add", false if "Remove"
                
                  // Dispatch the action with a callback for device
                  dispatch(
                    PortfolioSendEmailDevice(state?.code, deviceId, isAdd, (callbackRes) => {
                      console.log(`Dispatched for device ID ${deviceId}, isAdd: ${isAdd}`, callbackRes);
                      // Move to the next index after processing the callback
                      dispatchDeviceChanges(index + 1); // Dispatch next device change
                    })
                  );
                };
                
  
                // Create a function to handle the dispatch of subscriber changes
                const dispatchSubscriberChanges = (subIndex) => {
                  // If index is out of bounds for subChanges, finish processing
                  if (subIndex >= subChanges.length) {
                    hideLoading();
                    setIsProcessing(false); // Reset the flag after processing
                    return;
                  }
                
                  // Destructure subscriberId and action from subChanges
                  const { subscriberId, action } = subChanges[subIndex];
                
                  // Check if subscriberId exists; if not, skip to the next item
                  if (!subscriberId) {
                    dispatchSubscriberChanges(subIndex + 1); // Move to the next subscriber change
                    return; // Exit early for this iteration
                  }
                
                  // Check the action and set isAdd accordingly, or skip if "Edit"
                  if (action === "Edit") {
                    dispatchSubscriberChanges(subIndex + 1); // Skip to the next subscriber change
                    return; // Exit early for this iteration
                  }
                
                  // Set isAdd based on action type
                  const isAdd = action === "Add"; // true if "Add", false if "Remove"
                
                  // Dispatch the subscriber action with a callback
                  dispatch(
                    PortfolioSendEmailSubscriber(state?.code, subscriberId, isAdd, (callbackRes) => {
                      console.log(`Dispatched for subscriber ID ${subscriberId}, isAdd: ${isAdd}`, callbackRes);
                      // Move to the next index after processing the callback
                      dispatchSubscriberChanges(subIndex + 1); // Dispatch the next subscriber change
                    })
                  );
                };
                
  
                // Start dispatching device changes from index 0
                dispatchDeviceChanges(0);
  
              } else {
                setFailedModal(true);
                hideLoading();
                setIsProcessing(false); // Reset the flag if there are no portfolioInfo
              }
            })
          );
        } else {
          console.log("Not yet Pass");
          hideLoading();
          setIsProcessing(false); // Reset the flag if validation fails
        }
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
    setSelectedData(filteredDeviceList);
    setShowModalAdd(true);
  };
  const addSubscriberModal = () => {
    const title = "Add Subscriber";
    setTitleAddModal(title);
    setColumnsTable("subscriber");
    setListTable(subscriberList);
    setSelectedData(filteredSubList);
    setShowModalAdd(true);
  };
  const onClickConfirmBtn = (data) => {
    const defualtStartDate = watch("startDate");
    const defualtEndDate = watch("endDate");
    if (titleAddModal == "Add Device") {
      const newDeviceChanges = [];
      if (defualtStartDate) {
        const remainingData = data.filter(
          (item) =>
            !deviceListSelected?.find(
              (selectedItem) => selectedItem.id === item.id
            )
        );

        const newDateDevice = remainingData.map((item) => {
          setisAddDevice(true)
          // device ที่ add เข้ามาใหม่ ถ้าวัน registrationDate น้อยกว่า startDate ของ port ให้ใช้วันของ portfolio
          let itemStartDate = dayjs(item?.registrationDate);
          if (itemStartDate < dayjs(defualtStartDate)) {
            itemStartDate = dayjs(defualtStartDate);
          }


          // Fetch expiryDate (previously endDate) and startDate from deviceListSelected if it exists
      let deviceDataTable = deviceListSelected.filter((row) => row.id === item.id);
      let itemExpiryDate = dayjs(item?.expiryDate); // Device's expiryDate

      if (deviceDataTable.length > 0) {
        itemStartDate = dayjs(deviceDataTable[0]?.startDate, "DD/MM/YYYY");
        itemExpiryDate = dayjs(deviceDataTable[0]?.endDate, "DD/MM/YYYY");
      }

      // Compare the device's expiryDate with the portfolio's endDate
      if (dayjs(defualtEndDate) <= itemExpiryDate) {
        itemExpiryDate = dayjs(defualtEndDate);
      } else if (itemExpiryDate <= dayjs(defualtEndDate)) {
        itemExpiryDate = dayjs(item?.expiryDate);
      }
          const newDeviceChange = {
            deviceId: item.id, // Capture the device ID
            subscriberId:  0, // Use actual value or a default
            subscribersContractInformationId: 0, // Use actual value or a default
            action: "Add", // Specify the action
            createBy: userData?.firstName + " " + userData?.lastName, // Replace with the actual creator's information
            startDate: format(new Date(itemStartDate), "yyyy-MM-dd"),
            endDate: format(new Date(itemExpiryDate), "yyyy-MM-dd")
          };
          console.log(newDeviceChange)
          newDeviceChanges.push(newDeviceChange);
          return {
            ...item,
            startDate: itemStartDate.format("DD/MM/YYYY"),
            endDate: itemExpiryDate.format("DD/MM/YYYY"),
          };
          /*  return {
              ...item,
              startDate: format(new Date(item?.registrationDate), "dd/MM/yyyy"),
              endDate: format(new Date(defualtEndDate), "dd/MM/yyyy"),
            }; */
        });
        
        const currentDateDevice = deviceListSelected?.map((item) => {
          //  device ที่มีอยู่แล้วใน portfolio ใช้วัน ugtStartDate ของ Device
          //  เปลี่ยนไปใช้ device ที่อยู่ในตารางที่เลือกมาแล้ว
          
          let itemStartDate = dayjs(item?.ugtStartDate);
          let itemEndDate = dayjs(item?.ugtEndDate);

          // เอา startdate และ enddate ของ device หลังจากที่ edit ไปแล้วมาใช้
          let deviceDataTable = deviceListSelected.filter((row) => {
            return row.id === item.id;
          });
          if (deviceDataTable.length > 0) {
            itemStartDate = dayjs(deviceDataTable[0]?.startDate, "DD/MM/YYYY");
            itemEndDate = dayjs(deviceDataTable[0]?.endDate, "DD/MM/YYYY");
          }
          return {
            ...item,
            startDate: itemStartDate.format("DD/MM/YYYY"),
            endDate: itemEndDate.format("DD/MM/YYYY"),
          };
        });


        const concatArray = [...currentDateDevice, ...newDateDevice];
        console.log("concatArray", concatArray);
        setDeviceListSelected(concatArray);
        
        setDeviceChanges((prevChanges) => [...prevChanges, ...newDeviceChanges]);
      } else {
        setDeviceListSelected(data);
      }
    } else if (titleAddModal == "Add Subscriber") {
      const newSubChanges = [];
      if (defualtStartDate) {
        const remainingData = data.filter(
          (item) =>
            !subscriberListSelected.find(
              (selectedItem) => selectedItem.id === item.id
            )
        );
        const newDateSubscriber = remainingData.map((item) => {
          setisAddSub(true)
          // subscriber ที่ add เข้ามาใหม่ ถ้าวัน retailESAContractStartDate น้อยกว่า startDate ของ port ให้ใช้วันของ portfolio
          let itemStartDate = dayjs(
            item?.retailESAContractStartDate,
            "DD/MM/YYYY"
          );
          if (dayjs(defualtStartDate) >= itemStartDate ) {
            itemStartDate = dayjs(defualtStartDate);
          } else if (itemStartDate >= dayjs(defualtStartDate)){
            itemStartDate = dayjs(item?.retailESAContractStartDate,
              "DD/MM/YYYY")
          }
// Fetch endDate from item or adjust using portfolio's endDate
let itemEndDate = dayjs(item?.retailESAContractEndDate, "DD/MM/YYYY");
      
if (dayjs(defualtEndDate) <= itemEndDate ) {
  itemEndDate = dayjs(defualtEndDate);
} else if (itemEndDate <= dayjs(defualtEndDate)) {
  itemEndDate = dayjs(item?.retailESAContractEndDate,"DD/MM/YYYY")
}

// Check if the subscriber exists in subscriberListSelected
let subscriberDataTable = subscriberListSelected.filter((row) => row.id === item.id);

if (subscriberDataTable.length > 0) {
  // Use the edited startDate and endDate if subscriber exists
  itemStartDate = dayjs(subscriberDataTable[0]?.startDate, "DD/MM/YYYY");
  itemEndDate = dayjs(subscriberDataTable[0]?.endDate, "DD/MM/YYYY");
}
          const newSubChange = {
            deviceId:  0, // Capture the device ID
            subscriberId: item.id || 0, // Use actual value or a default
            subscribersContractInformationId: item.subscribersContractInformationId || 0, // Use actual value or a default
            action: "Add", // Specify the action
            createBy: userData?.firstName + " " + userData?.lastName, // Replace with the actual creator's information
            startDate: format(new Date(itemStartDate), "yyyy-MM-dd"),
            endDate: format(new Date(itemEndDate), "yyyy-MM-dd")
          };
          console.log(newSubChange)
          newSubChanges.push(newSubChange);
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
        const currentDateSubscriber = subscriberListSelected?.map((item) => {
          //  subscriber ที่มีอยู่แล้วใน portfolio ใช้วัน ugtStartDate และ ugtEndDate ของ subscriber
          let itemStartDate = dayjs(item?.ugtStartDate);
          let itemEndDate = dayjs(item?.ugtEndDate);

          // เอา startdate และ enddate ของ subscriber หลังจากที่ edit ไปแล้วมาใช้
          let subscriberDataTable = subscriberListSelected.filter((row) => {
            return row.id === item.id;
          });
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
        });

        const concatArray = [...currentDateSubscriber, ...newDateSubscriber];
        console.log("concatArray", concatArray);
        setSubscriberListSelected(concatArray);
        setSubChanges((prevChanges) => [...prevChanges, ...newSubChanges]);
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
  const oncloseValidationModal = () =>{
    setopenpopupDeviceError(false)
  }
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
      console.log(structuredClone(subscriberListSelected))
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
    const newDeviceChanges = [...deviceChanges]; // Spread the previous deviceChanges
    let isChanged = false; // Flag to check if any value is changed
  
    // Find if the record already exists in the deviceChanges array
    const existingDeviceChangeIndex = newDeviceChanges.findIndex(
      (change) => change.deviceId === rowData.id
    );
  
    if (type === "startDate") {
      if (rowData.startDate !== newDate) {
        rowData.startDate = newDate;
        console.log(rowData.startDate);
        isChanged = true; // Mark as changed
      }
    } else if (type === "endDate") {
      if (rowData.endDate !== newDate) {
        rowData.endDate = newDate;
        console.log(rowData.endDate);
        isChanged = true; // Mark as changed
      }
    }
  
    // If any date is changed, update the existing entry or add a new one
    if (isChanged) {
      const newDeviceChange = {
        deviceId: rowData.id,
        subscriberId: 0,
        subscribersContractInformationId: 0,
        action: "Edit",
        startDate: convertDateFormat(rowData.startDate),
        endDate: convertDateFormat(rowData.endDate),
      };
  
      if (existingDeviceChangeIndex !== -1) {
        // If the entry already exists, update it
        newDeviceChanges[existingDeviceChangeIndex] = newDeviceChange;
      } else {
        // If no entry exists, add the new change
        newDeviceChanges.push(newDeviceChange);
      }
  
      // Update the state with the updated deviceChanges
      setDeviceChanges(newDeviceChanges);
    }
  };
  
  
  
  const handleSubscriberDateChange = (newDate, rowId, type) => {
    const rowData = subscriberListSelected.find((item) => item.id === rowId);
    const newSubChanges = [...subChanges]; // Spread the previous subChanges
    let isChanged = false; // Flag to check if any value is changed
  
    // Find if the record already exists in the subChanges array
    const existingSubChangeIndex = newSubChanges.findIndex(
      (change) => change.subscriberId === rowData.id && change.subscribersContractInformationId === rowData.subscribersContractInformationId
    );
  
    if (type === "startDate") {
      if (rowData.startDate !== newDate) {
        rowData.startDate = newDate;
        console.log(rowData.startDate);
        isChanged = true; // Mark as changed
      }
    } else if (type === "endDate") {
      if (rowData.endDate !== newDate) {
        rowData.endDate = newDate;
        console.log(rowData.endDate);
        isChanged = true; // Mark as changed
      }
    }
  
    // If any date is changed, update the existing entry or add a new one
    if (isChanged) {
      const newSubChangeDate = {
        deviceId: 0, // Use actual deviceId if available
        subscriberId: rowData.id,
        subscribersContractInformationId: rowData.subscribersContractInformationId,
        action: "Edit",
        createBy: `${userData?.firstName} ${userData?.lastName}`,
        startDate: convertDateFormat(rowData.startDate),
        endDate: convertDateFormat(rowData.endDate),
      };
  
      if (existingSubChangeIndex !== -1) {
        // If the entry already exists, update it
        newSubChanges[existingSubChangeIndex] = newSubChangeDate;
      } else {
        // If no entry exists, add the new change
        newSubChanges.push(newSubChangeDate);
      }
  
      // Update the state with the updated subChanges
      setSubChanges(newSubChanges);
    }
  };
  
  
  













 

const onApplyChangeDevice = () => {
    console.log(...deviceListSelected)
    const deviceListSelectedTemp = [...deviceListSelected];
    const newDeviceChanges = [];
    let isChanged = false;
    
    selectDeviceChange.forEach((id) => {
        const index = deviceListSelectedTemp.findIndex((row) => row.id === id);
        if (index !== -1) {
            const deviceToRemove = deviceListSelectedTemp[index];
            console.log(deviceToRemove)
            // Prepare new device change object for removal
            const newDeviceChange = {
                deviceId: deviceToRemove.id, // Capture the device ID
                subscriberId: deviceToRemove.subscriberId || 0,
                subscribersContractInformationId: deviceToRemove.subscribersContractInformationId || 0,
                action: "Remove", // Specify the action
                createBy: userData?.firstName + " " + userData?.lastName, // Replace with the actual creator's information
                startDate: convertDateFormat(deviceToRemove.startDate),
                endDate: convertDateFormat(deviceToRemove.endDate)
              };
            console.log(newDeviceChange);
            newDeviceChanges.push(newDeviceChange);
            deviceListSelectedTemp.splice(index, 1);
            setIsRemovedDevice(true);
           
        }
    });

    for (const item of deviceListSelectedTemp) {
      console.log(item)
        // Check if the device's end date is greater than the port end date
        const portEndDate = dayjs(getValues("endDate"));
        let itemEndDate = dayjs(item?.endDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);

        // If the item's endDate is after portEndDate, adjust it
        if (itemEndDate < portEndDate) {
            console.log("item enddate > portenddate");
            itemEndDate = dayjs(item?.endDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
        } else if (portEndDate < itemEndDate){
          itemEndDate = portEndDate.format("DD/MM/YYYY");
        }
    }
   // Create a Set of deviceIds from newDeviceChanges for quick lookup
   const newDeviceIds = new Set(newDeviceChanges.map(change => change.deviceId));

   setDeviceChanges((prevChanges) => {
    // Create a new list to store updated deviceChanges
    const updatedChanges = [...prevChanges];
    let hasRemoval = false; // Flag to track if any removal happens
    let hasAddition = false; // Flag to track if any addition happens

    newDeviceIds.forEach(newId => {
        // Find the existing index where the deviceId matches
        const existingIndex = updatedChanges.findIndex(change => change.deviceId === newId);

        if (existingIndex !== -1) {
            // If the ID already exists, check the action
            const existingChange = updatedChanges[existingIndex];

            if (existingChange.action === "Add") {
                // If the action is "Add", remove it from the list (undo the addition)
                updatedChanges.splice(existingIndex, 1);
                hasRemoval = true; // Mark removal because of undoing the add
            } 
            else if (existingChange.action === "Edit") {
              // If the action is "Edit", change it to "Remove"
              updatedChanges[existingIndex].action = "Remove";
              console.log(`Changed action for device ID ${newId} from Edit to Remove.`);
              hasRemoval = true; // แสดงว่าได้ทำการลบแล้ว
            } 
        } else {
            // If the ID does not exist, find the new change
            const newChange = newDeviceChanges.find(change => change.deviceId === newId);
            if (newChange) {
                // Check the action of the new change
                updatedChanges.push(newChange);

                if (newChange.action === "Add") {
                    hasAddition = true; // Mark as added
                } else if (newChange.action === "Remove") {
                    hasRemoval = true; // Mark as removed
                }

                // Optional logging for other actions
                console.log(`${newChange.action} action for device ID:`, newId);
            }
        }
    });

    // Set the states only once after processing all devices
    if (hasRemoval) {
        setIsRemovedDevice(true);
    }
    
    // Set addition flag based on whether any "Add" action exists
    if (hasAddition) {
        setisAddDevice(true); // Set to true if any addition happened
    } else {
        setisAddDevice(false); // Set to false if no addition happened
    }

    return updatedChanges; // Return the updated list
});






    setDeviceListSelected(deviceListSelectedTemp);
    setOnEditDevice(false);
    setOnEditDatetimeDevice(false);
    setSelectDeviceChange([]);
    
    console.log("deviceListSelected === ", deviceListSelected);
};

  
  const onApplyChangeSubscriber = () => {
    const subscriberListSelectedTemp = [...subscriberListSelected];
    const newSubChanges = [];
    selectSubscriberChange.forEach((id) => {
      const index = subscriberListSelectedTemp.findIndex(
        (row) => row.id === id
      );
      if (index !== -1) {
        const SubToRemove = subscriberListSelectedTemp[index];
      // Prepare new device change object
      const newSubChange = {
        deviceId:  0, // Capture the device ID
        subscriberId: SubToRemove.id , // Use actual value or a default
        subscribersContractInformationId: SubToRemove.subscribersContractInformationId , // Use actual value or a default
        action: "Remove", // Specify the action
        createBy: userData?.firstName + " " + userData?.lastName ,// Replace with the actual creator's information
        startDate: convertDateFormat(SubToRemove.startDate),
        endDate: convertDateFormat(SubToRemove.endDate)
      };
        console.log(newSubChange)
        newSubChanges.push(newSubChange);
        subscriberListSelectedTemp.splice(index, 1);
        setIsRemovedSub(true);
      }
    });
    for (const item of subscriberListSelectedTemp) {
      // check end date ของ subscriber ที่ค้างไว้มากกว่า port end date หรือไม่
      const portEndDate = dayjs(getValues("endDate"));
      let itemEndDate = dayjs(item?.endDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
      if (itemEndDate < portEndDate) {
        console.log("item enddate > portenddate");
        itemEndDate= dayjs(item?.endDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
        
      } else if (portEndDate < itemEndDate){
        itemEndDate = portEndDate.format("DD/MM/YYYY");
      }
    }

    
    // Create a Set of deviceIds from newDeviceChanges for quick lookup
    const newSubIds = new Set(newSubChanges.map(change => change.subscriberId));

    // Update deviceChanges
   setSubChanges((prevChanges) => {
    // Create a new list to store updated deviceChanges
    const updatedChanges = [...prevChanges];
    let hasRemoval = false; // Flag to track if any removal happens
    let hasAddition = false; // Flag to track if any addition happens

    newSubIds.forEach(newId => {
        const existingIndex = updatedChanges.findIndex(change => change.subscriberId === newId);
        if (existingIndex !== -1) {
         const existingChange = updatedChanges[existingIndex];
         if (existingChange.action === "Add") {
            updatedChanges.splice(existingIndex, 1);
            hasRemoval = true; // Mark removal because of undoing the add
         } else if (existingChange.action === "Edit") {
           // If the action is "Edit", change it to "Remove"
           updatedChanges[existingIndex].action = "Remove";
           console.log(`Changed action for device ID ${newId} from Edit to Remove.`);
           hasRemoval = true; // แสดงว่าได้ทำการลบแล้ว
          }


        } else {
            // If the ID does not exist, add it to the list
            const newChange = newSubChanges.find(change => change.subscriberId === newId);
            if (newChange) {
              updatedChanges.push(newChange);

              if (newChange.action === "Add") {
                  hasAddition = true; // Mark as added
              } else if (newChange.action === "Remove") {
                  hasRemoval = true; // Mark as removed
              }

             // else if (newChange.action === "Edit" || newChange.action === "Remove") {
             //     // Add "Edit" and "Remove" actions to the list as well
             //     updatedChanges.push(newChange);
             //     console.log(`${newChange.action} action for device ID:`, newId); // Example logging
             // }
         }
        }
    });
// Set the states only once after processing all devices
if (hasRemoval) {
  setIsRemovedSub(true);
}

// Set addition flag based on whether any "Add" action exists
if (hasAddition) {
  setisAddSub(true); // Set to true if any addition happened
} else {
  setisAddSub(false); // Set to false if no addition happened
}
    return updatedChanges; // Return the updated list
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
  const totalAllocateEnergyAmount = subscriberListSelected.reduce((sum, subscriber) => {
    return sum + (subscriber.allocateEnergyAmount || 0);
  }, 0);

  const TotalCapacityAmount = deviceListSelected.reduce((sum, device) => {
    return sum + (device.capacity || 0);
  }, 0);
  // const handleCaptureToPDF = async () => {
  //   const element = cardRef.current//document.getElementById('pdf-content');
  //   element.style.display = 'block';
  // // กำหนดตัวเลือกสำหรับ html2pdf
  // const options = {
  //   margin: 0,
  //   filename: 'webscreen.pdf',
  //   image: { type: 'jpeg', quality: 50 },
  //   pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  //   html2canvas: { scale: 2}, // เพิ่ม scale เพื่อเพิ่มความละเอียด
  //   jsPDF: { unit: 'cm', format: 'a3', orientation: 'portrait'},
  // };

  // // สร้าง PDF ด้วย html2pdf และดึง base64 string
  // html2pdf()
  //   .from(element)
  //   .set(options)
  //   .outputPdf('datauristring') // ดึงข้อมูลออกมาเป็น Base64 string
  //   .then((pdfBase64) => {
  //     console.log(pdfBase64); // แสดง base64 string ใน console
  //     const base64Content = pdfBase64.split(",")[1];
  //     const now = new Date();
  //     const formattedDateTime = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}_${now.getMinutes().toString().padStart(2, '0')}_${now.getSeconds().toString().padStart(2, '0')}`;
  //     const structrueSend =[{
  //       id:0,
  //       guid:"",
  //       name: formattedDateTime+".pdf",
  //       binary: base64Content,
  //       type: "application/pdf"
  //     }]
  //   // Create a Blob from the base64 string and trigger the download
  //   const blob = new Blob([Uint8Array.from(atob(base64Content), c => c.charCodeAt(0))], { type: "application/pdf" });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `${formattedDateTime}.pdf`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link); // Cleanup the DOM by removing the link
  //   element.style.display = 'none';
  // })
  // .catch((error) => {
  //   console.error('Error generating PDF:', error);
  //   element.style.display = 'none';
  // });
      
  // };
  return (
    <>
   
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto text-left">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                {detailPortfolio?.portfolioInfo?.portfolioName || "-"}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / Portfolio Management /
                Portfolio Info /{" "}
                <span className="truncate">
                  {detailPortfolio?.portfolioInfo?.portfolioName || "-"}
                </span> / Edit
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
  <div className="ml-auto py-2 flex items-center">
    <span className="text-[#f94a4a] flex items-center  text-sm rounded-full px-2">
      <b>* Required Field</b>
    </span>
  </div>
</div>

<div className="p-0 md:col-span-6 mb-0 border-1 align-top"></div>

                      
                      <div className="md:col-span-6">
                      <h6 className="text-PRIMARY_TEXT mt-3">
                        <b>Portfolio Information</b>
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
                                defaultValue={
                                  detailPortfolio?.portfolioInfo?.startDate
                                }
                                
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
                              <DatePickerEndDate
                                {...field}
                                id={"endDate"}
                                label={"End Date"}
                                error={errors.endDate}
                                isPortrun= {isStartPort}
                                defaultValue={
                                  detailPortfolio?.portfolioInfo?.endDate
                                }
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
                          data={filteredDeviceList}
                          columns={columnsDevice}
                          searchData={searchDevice}
                          checkbox={onEditDevice}
                          editDatetime={onEditDatetimeDevice}
                          onSelectedRowsChange={selectedDeviceChange}
                          dateChange={handleDeviceDateChange}
                          isStartPort={isStartPort}
                          error = {portfolioValidateStatus }
                          isTotal={"Total Capacity"}
                          portfolioStartDate={getValues("startDate")}
                          portfolioEndDate={getValues("endDate")}
                          openpopupDeviceError={handleErrorDevicepopup}
                        />
                      </div>
                    ) : (
                      <div style={{ border: IsError ? "2px solid red" : "none", padding: "16px", borderRadius: "4px", position: "relative" }}>
        <p className="px-4 py-4 text-gray">There is no data to display.</p>
        {IsError && (
          <p style={{ color: "red", position: "absolute", bottom: "-25px", left: "5px", margin: 0 ,fontSize: "12px"}}>
            This field is required
          </p>
        )}
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
                          data={filteredSubList}
                          columns={columnsSubscriber}
                          searchData={searchSubscriber}
                          checkbox={onEditSubscriber}
                          editDatetime={onEditDatetimeSubscriber}
                          onSelectedRowsChange={selectedSubscriberChange}
                          dateChange={handleSubscriberDateChange}
                          isStartPort={isStartPort}
                          error = {portfolioValidateStatus }
                          isTotal={"Total Contracted Energy"}
                          portfolioStartDate={getValues("startDate")}
                          portfolioEndDate={getValues("endDate")}
                          openpopupSubError={handleErrorSubpopup}
                          
                        />
                      </div>
                    ) : (
                      <div style={{ border: IsError ? "2px solid red" : "none", padding: "16px", borderRadius: "4px", position: "relative" }}>
        <p className="px-4 py-4 text-gray">There is no data to display.</p>
        {IsError && (
          <p style={{ color: "red", position: "absolute", bottom: "-25px", left: "5px", margin: 0 ,fontSize: "12px"}}>
            This field is required
          </p>
        )}
      </div>
                    )}
                  </div>
                </Card>

                {/* submit button */}
                <div className="text-center my-5">
                
                  <button
                    onClick={() =>
                      navigate(WEB_URL.PORTFOLIO_INFO, {
                        state: { id: state?.code },
                      })
                    }
                    className="mr-4 w-1/4 rounded h-12 px-6 text-gray transition-colors duration-150 rounded-lg focus:shadow-outline bg-[#CBD0D5] hover:bg-[#78829D] text-[#78829D] hover:text-white font-semibold"
                  >
                    Back
                  </button>
                  
                  {!onEditSubscriber && !onEditDevice ? (
                    
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmitForm1)}
                      className="ml-4 w-1/4 rounded h-12 px-6 text-white transition-colors duration-150 bg-PRIMARY_BUTTON rounded-lg focus:shadow-outline hover:bg-BREAD_CRUMB font-semibold"
                    >
                      <b>Save</b>
                    </button>
                  ) : (
                    
                    <button
                      type="button"
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
            title={"Save Changes this Portfolio?"}
            content={"Would you like to save changes this Portfolio?"}
          />
        )}
        {showModalComplete && (
          <ModalComplete
            title="Update Complete!"
            context=""
            link={WEB_URL.PORTFOLIO_LIST}
          />
        )}
        {openpopupDeviceError && (
          <ModalValidation
            dataList={columnsTable == "device" ? getValidationDevicePopup : getValidationSubPopup}
            onClickConfirmBtn={oncloseValidationModal}
            closeModal={oncloseValidationModal}
            columns={columnsTable}
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
  
  
  {/* For Capture */}
  <div  ref={cardRef} className="min-h-screen p-6 items-center justify-center hidden">
  <div className="container max-w-screen-lg mx-auto" id="page-1">
    <div className="text-left flex flex-col gap-3">
      <div className="grid gap-4 gap-y-2 grid-cols-1 md:grid-cols-6 ">
        <div className="md:col-span-3">
          <h2 className="font-semibold text-xl text-black truncate">
          {detailPortfolio?.portfolioInfo?.portfolioName || "-"}
          </h2>
          <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
            {currentUGTGroup?.name} / Portfolio Management /
            Portfolio Info /{" "}
            <span className="truncate">
            {detailPortfolio?.portfolioInfo?.portfolioName || "-"}
            </span> / Edit
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
                      {watch("portfolioName")}
                      
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
                      {formatDate(watch("startDate"))}
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
                      {deviceListSelected?.length}{" "}
                            {deviceListSelected?.length > 1
                              ? "Devices"
                              : "Device"}
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
                          TotalCapacityAmount
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
                        {watch("mechanism")?.mexhanismName}
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
                        {detailPortfolio?.portfolioInfo?.portfolioCode || "-"}
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
                      {formatDate(watch("endDate"))}
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
                      {subscriberListSelected?.length}{" "}
                            {subscriberListSelected?.length > 1
                              ? "Subscribers"
                              : "Subscriber"}
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
                          totalAllocateEnergyAmount
                        ).format("0,0.000000") || "-"}{" "}
                      
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
                    {filteredDeviceList?.length || "0"}{" "}
                    {filteredDeviceList?.length > 1 ? "Devices" : "Device"}
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
                    {/* <Controller
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
                    /> */}
                  </div>
                  
                </form>
              </div>
            </div>
            <div>
              <DataTableForCaptures
                data={filteredDeviceList}
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
                    {filteredSubList?.length || "0"}{" "}
                    {filteredSubList?.length > 1
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
                    {/* <Controller
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
                    /> */}
                  </div>
                  
                </form>
              </div>
            </div>
            <div>
              <DataTableForCaptures
                data={filteredSubList}
                columns={columnsSubscriber}
                searchData={searchSubscriber}
                checkbox={false}
                isTotal={"Total Contracted Energy (kWh)"}
                // onSelectedRowsChange={selectedDeviceChange}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div></div>
    </div>
    
    







</>


);
};

export default UpdatePortfolio;

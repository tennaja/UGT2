import React, { useEffect, useState, useRef } from "react";
import { Card, Button, Divider } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as WEB_URL from "../../Constants/WebURL";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBox from "../Control/SearchBox";
import DataTable from "../Control/Table/DataTable";
import StatusLabel from "../../Component/Control/StatusLabel";
import { MdOutlineContentCopy } from "react-icons/md";
import MonthPicker from "./components/MonthPicker";
import dayjs from "dayjs";
import { Form, Select } from "antd";
import { setCookie } from "../../Utils/FuncUtils";
import { setSelectedSubMenu } from "../../Redux/Menu/Action";
import {
  CONVERT_UNIT,
  USER_GROUP_ID,
  MONTH_LIST,
} from "../../Constants/Constants";
import Highlighter from "react-highlight-words";
import numeral from "numeral";
import { message } from "antd";
import SubMenuAction from "../Control/SubMenuAction";
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegFileExcel } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import MultiselectInven from "./components/MultiselectInven";
import CollapsDataTableInven from "./components/CollapsDataTableInven";
import {
  getInventoryDetailFilter,
  getInventoryDetailData,
  getInventoryDetailDropdown,
  downloadExcelInventoryDetail,
} from "../../Redux/Inventory/InventoryAction";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";
import DropdownMultiSelect from "./components/DropDownMultiSelect";

const itemsPerPage = 5;
const InventoryDetail = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = useLocation();
  const { portfolioId, portfolioName, ugtName } = location.state;
  const {
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const userData = useSelector((state) => state.login.userobj);
  const inventoryFilter = useSelector(
    (state) => state.inventory.inventoryDetailFilter
  );
  const inventoryDatailData = useSelector(
    (state) => state.inventory.inventoryDetailData
  );
  const inventoryDetailDropdown = useSelector(
    (state) => state.inventory.inventoryDetailDropdownList
  );

  const [serchQuery, setSerchQuery] = useState("");
  const [selectedStart, setSelectedStart] = useState();
  const [selectedEnd, setSelectedEnd] = useState();

  const [fileterUGT, setSelectUGT] = useState(0);
  const [filterDevice, setFilterDevice] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [overviewDataUnit, setOverviewDataUnit] = useState(
    CONVERT_UNIT[0].unit
  );
  const [convertUnit, setConvertUnit] = useState(CONVERT_UNIT[0].convertValue);

  const [filterPortList, setFilterPortList] = useState([]);
  const [selected, setSelected] = useState("month");
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [isGenerate, setIsGenerate] = useState(false);
  const contentRef = useRef();
  const [isSelectDevice, setIsSelectDevice] = useState(false);
  console.log(minDate, maxDate, selectedStart, selectedEnd);
  console.log(inventoryFilter);

  useEffect(() => {
    if (!minDate && !maxDate && userData?.userGroup?.id) {
      let utilityId = 0;
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
      ) {
        utilityId = 1;
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
      ) {
        utilityId = 2;
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
      ) {
        utilityId = 3;
      } else {
        utilityId = 0;
      }
      dispatch(
        getInventoryDetailFilter(
          ugtName === "UGT-1" ? 1 : 2,
          portfolioId,
          userData?.userGroup?.id,
          utilityId
        )
      );
    }
  }, [userData]);

  useEffect(() => {
    console.log(inventoryFilter);
    if (inventoryFilter && Object.keys(inventoryFilter).length !== 0) {
      const [monthMax, yearMax] = inventoryFilter.monthYearMax.split("/");
      const [monthMin, yearMin] = inventoryFilter.monthYearMin.split("/");
      const startMaxday = new Date(yearMax, monthMax, 0).getDate();
      const minDateTemp = yearMin + "/" + monthMin + "/1";
      const maxDateTemp = yearMax + "/" + monthMax + "/" + startMaxday;
      console.log(maxDateTemp, minDateTemp);
      setMaxDate(dayjs(maxDateTemp));
      setMinDate(dayjs(minDateTemp));
      setSelectedStart(dayjs(minDateTemp));
      setSelectedEnd(dayjs(maxDateTemp));
      //fetchDetailData(true);
    }
  }, [inventoryFilter]);
  console.log(inventoryFilter && Object.keys(inventoryFilter).length !== 0);

  useEffect(() => {
    if (inventoryFilter && Object.keys(inventoryFilter).length !== 0) {
      console.log("Fetch not in Device");
      fetchDetailData(true);
    }
  }, [selected, selectedStart, selectedEnd]);
console.log(filterStatus)
  useEffect(() => {
    if (inventoryDetailDropdown) {
      setFilterPortList(inventoryDetailDropdown);
      setIsSelectDevice(false);
    }
  }, [inventoryDetailDropdown]);

  useEffect(() => {
    if (inventoryFilter && Object.keys(inventoryFilter).length !== 0) {
      console.log("Fetch in Device");
      if (isSelectDevice == true) {
        fetchDetailData(false);
      }
    }
  }, [filterDevice, filterStatus]);

  const fetchDetailData = (isFetchDrop) => {
    if (selectedStart && selectedEnd) {
      console.log("Fetch in");
      if (selected == "all") {
        /*let deviceList = [];
        for (let i = 0; i < filterDevice.length; i++) {
          deviceList.push(filterDevice[i].deviceId);
        }
        let statusList = [];
        for (let i = 0; i < filterStatus.length; i++) {
          statusList.push(filterStatus[i].name);
        }*/
        let utilityId = 0;
        if (
          userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
        ) {
          utilityId = 1;
        } else if (
          userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
        ) {
          utilityId = 2;
        } else if (
          userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
        ) {
          utilityId = 3;
        } else {
          utilityId = 0;
        }
        const param = {
          portfolioId: portfolioId,
          startDate: inventoryFilter.monthYearMin,
          endDate: inventoryFilter.monthYearMax,
          unitPrefix: overviewDataUnit,
          unit: convertUnit,
          deviceId: filterDevice,
          status: filterStatus,
          roleId: userData?.userGroup?.id,
          utilityId: utilityId,
        };
        console.log("Param All",param)
        dispatch(getInventoryDetailData(param));
        if (isFetchDrop) {
          setFilterDevice([]);
          dispatch(getInventoryDetailDropdown(param));
        }
        setIsSelectDevice(false);
      } else if (selected == "month") {
        console.log(filterStatus);
        console.log(selectedStart, selectedEnd);
        const startDate =
          String(selectedStart.$d.getMonth() + 1).padStart(2, "0") +
          "/" +
          selectedStart.$y;
        const endDate =
          String(selectedEnd.$d.getMonth() + 1).padStart(2, "0") +
          "/" +
          selectedEnd.$y;
        /*let deviceList = [];
        for (let i = 0; i < filterDevice.length; i++) {
          deviceList.push(filterDevice[i].deviceId);
        }
        let statusList = [];
        for (let j = 0; j < filterStatus.length; j++) {
          statusList.push(filterStatus[j].name);
        }*/
        let utilityId = 0;
        if (
          userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
        ) {
          utilityId = 1;
        } else if (
          userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
        ) {
          utilityId = 2;
        } else if (
          userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
        ) {
          utilityId = 3;
        } else {
          utilityId = 0;
        }
        const param = {
          portfolioId: portfolioId,
          startDate: startDate,
          endDate: endDate,
          unitPrefix: overviewDataUnit,
          unit: convertUnit,
          deviceId: filterDevice,
          status: filterStatus,
          roleId: userData?.userGroup?.id,
          utilityId: utilityId,
        };
        console.log("Param month",param)
        dispatch(getInventoryDetailData(param));
        if (isFetchDrop) {
          setFilterDevice([]);
          dispatch(getInventoryDetailDropdown(param));
        }
        setIsSelectDevice(false);
      }
    }
  };

  //console.log(selectedStart.$d.getMonth());

  const handleChangeOverviewUnit = (unit) => {
    console.log("Handle unit", unit);
    const unitObj = CONVERT_UNIT.filter((obj) => {
      return obj.unit == unit;
    });
    setOverviewDataUnit(unit);
    setConvertUnit(unitObj[0].convertValue);
    /*setTmpOverviewChartData(
        convertChartData(settlementOverviewData, unitObj[0].convertValue)
      );*/
  };

  const handleExportPDF = () => {
    setIsGenerate(true);
    setTimeout(() => {
      generatePDFScreenFinal();
    }, 1000);
  };

  const generatePDFScreenFinal = () => {
    //let oldSelect = selectTab
    //setSelectTab("final")
    Swal.fire({
      title: "Please Wait...",
      html: `กำลังโหลด...`,
      allowOutsideClick: false,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      console.log("GEN PDF");
      // เลือก DOM element ที่ต้องการแปลงเป็น PDF
      const element = contentRef.current; //document.getElementById('pdf-content');

      // กำหนดตัวเลือกสำหรับ html2pdf
      const options = {
        margin: 0,
        filename: "webscreen.pdf",
        image: { type: "jpeg", quality: 50 },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        html2canvas: { scale: 2 }, // เพิ่ม scale เพื่อเพิ่มความละเอียด
        jsPDF: { unit: "cm", format: "a2", orientation: "portrait" },
      };

      // สร้าง PDF ด้วย html2pdf และดึง base64 string
      html2pdf()
        .from(element)
        .set(options)
        .outputPdf("datauristring") // ดึงข้อมูลออกมาเป็น Base64 string
        .then((pdfBase64) => {
          console.log(pdfBase64); // แสดง base64 string ใน console
          const base64Content = pdfBase64.split(",")[1];
          const now = new Date();
          const formattedDateTime = `${now
            .getDate()
            .toString()
            .padStart(2, "0")}_${(now.getMonth() + 1)
            .toString()
            .padStart(2, "0")}_${now.getFullYear()}_${now
            .getHours()
            .toString()
            .padStart(2, "0")}_${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}_${now.getSeconds().toString().padStart(2, "0")}`;
            const startDate =
          String(selectedStart.$d.getMonth() + 1).padStart(2, "0") +
          "/" +
          selectedStart.$y;
        const endDate =
          String(selectedEnd.$d.getMonth() + 1).padStart(2, "0") + "/" + selectedEnd.$y;
          const [monthStart,yearStart] = startDate.split("/")
          const [monthEnd,yearEnd] = endDate.split("/")
          const fileName = formattedDateTime + ".pdf";
          const fileNameNew = "InventoryByDevice_"+monthStart+""+yearStart+"_"+monthEnd+""+yearEnd+"_" + formattedDateTime + ".pdf";
          openPDFInNewTab(base64Content, "application/pdf", fileNameNew);
          setIsGenerate(false);
        })
        .catch((error) => {
          consol.log(error);
        })
        .finally(() => {
          setTimeout(() => {
            Swal.close();
          }, 300);
        });
    }, 1200);
  };
  const openPDFInNewTab = (base64String, type, name) => {
    const extension = name.split(".").pop();
    const pdfWindow = window.open("");
    console.log("PDF", pdfWindow);
    console.log(type);
    if (type === "application/pdf") {
      if (pdfWindow) {
        // Set the title of the new tab to the filename
        //pdfWindow.document.title = name;
        setTimeout(() => {
          pdfWindow.document.title = name;
        }, 100);

        // Convert Base64 to raw binary data held in a string
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the byte array and set the MIME type
        const blob = new Blob([byteArray], { type: type });
        console.log("Blob", blob);

        // Create a URL for the Blob and set it as the iframe source
        const blobURL = URL.createObjectURL(blob);
        console.log("Blob url :", blobURL);
        let names = name;

        const iframe = pdfWindow.document.createElement("iframe");

        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.bottom = "0";
        iframe.style.right = "0";
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";

        // Use Blob URL as the iframe source
        iframe.src = blobURL;

        // Remove any margin and scrollbars
        pdfWindow.document.body.style.margin = "0";
        pdfWindow.document.body.style.overflow = "hidden";

        // Append the iframe to the new window's body
        pdfWindow.document.body.appendChild(iframe);

        // Optionally, automatically trigger file download with correct name
      } else {
        alert("Unable to open new tab. Please allow popups for this website.");
      }
    } else if (
      extension === "jpeg" ||
      extension === "jpg" ||
      extension === "png" ||
      extension === "svg"
    ) {
      if (pdfWindow) {
        pdfWindow.document
          .write(`<html><body style="margin:0; display:flex; align-items:center; justify-content:center;">
                  <img src="data:image/jpeg;base64,${base64String}" style="max-width:100%; height:auto;"/>
              </body></html>`);
        pdfWindow.document.title = "Image Preview";
        pdfWindow.document.close();
      }
    }
  };
  const handleExportExcel = () => {
    if (selected == "all") {
      let deviceList = [];
      for (let i = 0; i < filterDevice.length; i++) {
        deviceList.push(filterDevice[i].deviceId);
      }
      let statusList = [];
      for (let i = 0; i < filterStatus.length; i++) {
        statusList.push(filterStatus[i].name);
      }
      let utilityId = 0;
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
      ) {
        utilityId = 1;
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
      ) {
        utilityId = 2;
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
      ) {
        utilityId = 3;
      } else {
        utilityId = 0;
      }
      const param = {
        portfolioId: portfolioId,
        startDate: inventoryFilter.monthYearMin,
        endDate: inventoryFilter.monthYearMax,
        unitPrefix: overviewDataUnit,
        unit: convertUnit,
        deviceId: filterDevice,
        status: statusList,
        roleId: userData?.userGroup?.id,
        utilityId: utilityId,
      };

      dispatch(downloadExcelInventoryDetail(param));
    } else if (selected == "month") {
      console.log(filterStatus);
      const startDate =
        String(selectedStart.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedStart.$y;
      const endDate =
        String(selectedEnd.$d.getMonth() + 1).padStart(2, "0") +
        "/" +
        selectedEnd.$y;
      let deviceList = [];
      for (let i = 0; i < filterDevice.length; i++) {
        deviceList.push(filterDevice[i].deviceId);
      }
      let statusList = [];
      for (let j = 0; j < filterStatus.length; j++) {
        statusList.push(filterStatus[j].name);
      }
      let utilityId = 0;
      if (
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.EGAT_SUBSCRIBER_MNG
      ) {
        utilityId = 1;
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.PEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.PEA_SUBSCRIBER_MNG
      ) {
        utilityId = 2;
      } else if (
        userData?.userGroup?.id == USER_GROUP_ID.MEA_DEVICE_MNG ||
        userData?.userGroup?.id == USER_GROUP_ID.MEA_SUBSCRIBER_MNG
      ) {
        utilityId = 3;
      } else {
        utilityId = 0;
      }
      const param = {
        portfolioId: portfolioId,
        startDate: startDate,
        endDate: endDate,
        unitPrefix: overviewDataUnit,
        unit: convertUnit,
        deviceId: deviceList,
        status: statusList,
        roleId: userData?.userGroup?.id,
        utilityId: utilityId,
      };

      dispatch(downloadExcelInventoryDetail(param));
    }
  };

  const mockStatus = [
    {
      id: 1,
      name: "Available",
    },
    {
      id: 2,
      name: "Out of Stock",
    },
    {
      id: 3,
      name: "No Inventory",
    },
    {
      id: 4,
      name: "Expired",
    },
  ];

  const handleChangeAssignFilter = (value) => {
    setFilterDevice(value);
    setIsSelectDevice(true);
  };

  const handleChangeStatusFilter = (value) => {
    setFilterStatus(value);
    setIsSelectDevice(true);
  };
  const handleChangeToggle = (value) => {
    setSelected(value);
  };

  return (
    <div
      ref={contentRef}
      style={{ width: "100%", padding: "0px", background: "#f5f5f5" }}
    >
      <div>
        <div className="min-h-screen p-6 items-center justify-center">
          <div className="container max-w-screen-lg mx-auto">
            <div className="text-left flex flex-col">
              <h2 className="font-semibold text-xl text-black">
                {portfolioName}
              </h2>
              <p className={`text-BREAD_CRUMB text-sm mb-6 font-normal`}>
                Inventory Management / Inventory Info / {portfolioName}
              </p>
            </div>

            <Card shadow="md" radius="lg" className="flex" padding="xl">
              <div className="flex justify-between pb-3">
                <div className="text-left flex gap-3 items-center">
                  <FaChevronCircleLeft
                    className="text-[#e2e2ac] hover:text-[#4D6A00] cursor-pointer"
                    size="30"
                    onClick={() => navigate(WEB_URL.INVENTORY_INFO)}
                  />

                  <div>
                    <div className="text-xl font-bold ">Inventory Info</div>
                  </div>
                </div>
              </div>
              <Divider orientation="horizontal" size={"xs"} />
              <div className="text-left mt-2 items-center">
                <label
                  className={`${
                    ugtName === "UGT-1"
                      ? "bg-[#3370BF33] text-[#3370BF]"
                      : "bg-[#FA6B6E33] text-[#FA6B6E]"
                  } rounded w-max px-3 py-1 mt-1 text-xs font-normal`}
                >
                  {ugtName}
                </label>
                <label className="text-[#4D6A00] ml-1 text-xl font-bold">
                  {portfolioName}
                </label>
              </div>

              <div className="mt-4 text-left">
                <form className="grid col-span-12 lg:grid-cols-12 sm:grid-cols-1 gap-2 ">
                  {/* <div className="col-span-3 px-2"></div> */}
                  {/* {!isPortManager && <div className="col-span-4"></div>} */}
                  <div className="col-span-2">
                    <div className="h-10 text-center justify-center">
                      <div className="grid grid-cols-2">
                        <div
                          className={`${
                            selected == "all"
                              ? "bg-[#87BE33] text-[#FFFFFF] border-[#87BE33]"
                              : "bg-[#FFFFFF] text-[#848789] border-[#848789]"
                          } rounded-l-[5px] border-t-2 border-b-2 border-l-2  px-3 py-2  font-normal h-10 hover:cursor-pointer`}
                          onClick={() => handleChangeToggle("all")}
                        >
                          All
                        </div>
                        <div
                          className={`${
                            selected == "month"
                              ? "bg-[#87BE33] text-[#FFFFFF] border-[#87BE33]"
                              : "bg-[#FFFFFF] text-[#848789] border-[#848789]"
                          } rounded-r-[5px] border-t-2 border-b-2 border-r-2  px-3 py-2 font-normal h-10 hover:cursor-pointer`}
                          onClick={() => handleChangeToggle("month")}
                        >
                          Month
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 flex">
                    <div className="h-[40px] lg:w-[150px] sm:w-[136px] sm:ml-2">
                      <MonthPicker
                        value={selectedStart}
                        setValue={setSelectedStart}
                        isDisable={selected == "month" ? false : true}
                        mindate={minDate}
                        maxdate={selectedEnd}
                      />
                    </div>
                    <div className="ml-2 items-center">
                      <label className="font-bold text-2xl mt-1">-</label>
                    </div>
                    <div className="ml-2 h-[40px] lg:w-[150px] sm:w-[136px]">
                      <MonthPicker
                        value={selectedEnd}
                        setValue={setSelectedEnd}
                        isDisable={selected == "month" ? false : true}
                        mindate={selectedStart}
                        maxdate={maxDate}
                      />
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="flex">
                      <div className="w-24">
                        <Form layout="horizontal" size="large">
                          <Form.Item className="col-span-2 col-start-2">
                            <Select
                              size="large"
                              value={overviewDataUnit}
                              variant="borderless"
                              onChange={(value) =>
                                handleChangeOverviewUnit(value)
                              }
                              className={
                                /*`${!canViewSettlementDetail && "opacity-20"}`*/ ""
                              }
                            >
                              {CONVERT_UNIT?.map((item, index) => (
                                <Select.Option key={index} value={item.unit}>
                                  {item.unit}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Form>
                      </div>

                      <div className="w-40 ml-2">
                        {/*<Controller
                          name="portFilter"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <MultiselectInven
                              {...field}
                              id={"portFilter"}
                              placeholder={"All"}
                              typeSelect={2}
                              options={filterPortList}
                              valueProp={"deviceId"}
                              displayProp={"deviceName"}
                              onChangeInput={(value) => {
                                handleChangeAssignFilter(value, "TYPE");
                              }}
                              wrapText={true}
                              isSearchable={true}
                              size="300px"
                              value={filterDevice}
                            />
                          )}
                        />*/}
                        <DropdownMultiSelect
                          options={filterPortList}
                          selectedValues={filterDevice}
                          setSelectedValues={setFilterDevice}
                          label="Find Device"
                          allowSelectAll={true} // ✅ เปลี่ยนเป็น false ถ้าไม่ต้องการ "All Devices"
                          valueKey="deviceId"
                          labelKey="deviceName"
                          setSelectDropdown={setIsSelectDevice}
                          textSelectAll="All Device"
                        />
                      </div>
                      <div className="ml-2 w-40 h-[40px]">
                        {/*<Controller
                          name="statusFilter"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <MultiselectInven
                              {...field}
                              id={"statusFilter"}
                              placeholder={"Find Status"}
                              typeSelect={2}
                              options={mockStatus}
                              valueProp={"id"}
                              displayProp={"name"}
                              onChangeInput={(value) => {
                                handleChangeStatusFilter(value, "TYPE");
                              }}
                              wrapText={true}
                              isSearchable={true}
                              size="200px"
                            />
                          )}
                        />*/}
                        <DropdownMultiSelect
                          options={mockStatus}
                          selectedValues={filterStatus}
                          setSelectedValues={setFilterStatus}
                          label="Find Status"
                          allowSelectAll={false} // ✅ เปลี่ยนเป็น false ถ้าไม่ต้องการ "All Devices"
                          valueKey="name"
                          labelKey="name"
                          setSelectDropdown={setIsSelectDevice}
                        />
                      </div>
                      <div className="ml-2">
                        <SubMenuAction
                          labelBtn={"Export"}
                          actionList={[
                            {
                              icon: (
                                <FaRegFilePdf className="text-red-700 w-[20px] h-[20px]" />
                              ),
                              label: "Export PDF",
                              onClick: handleExportPDF,
                              rightTxt: "",
                              hide: false,
                            },
                            {
                              icon: (
                                <FaRegFileExcel className="text-green-700 w-[20px] h-[20px]" />
                              ),
                              label: "Export Excel",
                              onClick: handleExportExcel,
                              rightTxt: "",
                              hide: false,
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-2"></div>
                      <div className="col-span-4"></div>
                      <div className="col-span-3"></div>
                      <div className="col-span-2"></div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="mt-2">
                <CollapsDataTableInven
                  data={inventoryDatailData}
                  unit={overviewDataUnit}
                  convertUnit={convertUnit}
                  rowPerPage={20}
                  isGenerate={isGenerate}
                  portId={portfolioId}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // function prePage() {
  //   if (currentPage !== 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // }
  // function chageCPage(id) {
  //   alert(id);
  //   // setCurrentPage(id)
  // }
  // function nextPage() {
  //   if (currentPage !== npage) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // }
};

export default InventoryDetail;

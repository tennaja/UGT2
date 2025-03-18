import React, { useState, useEffect } from "react";
import { Collapse, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import dayjs from "dayjs";
import numeral from "numeral";
import DataTableInventory from "./DataTableInventory";
import { Button, Card, Divider, Modal } from "@mantine/core";
import AlmostDone from "../../assets/done.png";
import StatusTag from "./StatusTag";
import { getInventoryDetailPopup } from "../../../Redux/Inventory/InventoryAction";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../Control/Table/DataTable";
import {
  CONVERT_UNIT,
  USER_GROUP_ID,
  MONTH_LIST,
} from "../../../Constants/Constants";

const RowInventory = (props) => {
  const dispatch = useDispatch();
  const {
    row,
    rowindex,
    isDevice,
    headTxt,
    total,
    unit,
    convertUnit,
    isGenerate = false,
    portId,
    deviceId,
  } = props;
  //console.log(row)
  const dataPopup = useSelector(
    (state) => state.inventory.inventoryDetailPopup
  );
  const userData = useSelector((state) => state.login.userobj);
  const [open, setOpen] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [periodTemp, setPeriodTemp] = useState();
  const [monthTemp, setMonthTemp] = useState();
  const [yearTemp, setYearTemp] = useState();
  //console.log(total)

  const monthMapping = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
    มกราคม: 1,
    กุมภาพันธ์: 2,
    มีนาคม: 3,
    เมษายน: 4,
    พฤษภาคม: 5,
    มิถุนายน: 6,
    กรกฎาคม: 7,
    สิงหาคม: 8,
    กันยายน: 9,
    ตุลาคม: 10,
    พฤศจิกายน: 11,
    ธันวาคม: 12,
  };

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  //console.log(headTxt,total,row,row?.deviceName)

  const convertData = (value) => {
    console.log(unit,typeof value,"Value Convert",value)
    let decFixed = 3;
    if (unit == "kWh") {
      decFixed = 3;
    } else if (unit == "MWh") {
      decFixed = 6;
    } else if (unit == "GWh") {
      decFixed = 6;
    }
// ตรวจสอบว่า value เป็นตัวเลขที่ถูกต้อง
const isNumber = !isNaN(value);

// ตรวจสอบว่า value เป็นตัวเลขในรูปแบบวิทยาศาสตร์ (เลขทศนิยมที่เล็กมาก)
const isScientific = value.toString().includes('e');
console.log(isNumber,isScientific)
if(isNumber == true && isScientific == false){
    if (value) {
      //console.log("Set Value")
      if (decFixed == 3) {
        return numeral(value).format("0,0.000");
      }
      if (decFixed == 6) {
        return numeral(value).format("0,0.000000");
      }
    } else {
      //console.log("Set Zero")
      if (decFixed == 3) {
        return numeral(0).format("0,0.000");
      }
      if (decFixed == 6) {
        return numeral(0).format("0,0.000000");
      }
    }}
    else{
      if (value) {
        //console.log("Set Value")
        if (decFixed == 3) {
          return numeral(0).format("0,0.000");
        }
        if (decFixed == 6) {
          return numeral(0).format("0,0.000000");
        }
      } else {
        //console.log("Set Zero")
        if (decFixed == 3) {
          return numeral(0).format("0,0.000");
        }
        if (decFixed == 6) {
          return numeral(0).format("0,0.000000");
        }
      }
    }
  };

  const renderValue = (value) => {
    //console.log(value)
    //console.log(convertUnit)
    if (value) {
      //console.log("Have value")
      return convertData(value * convertUnit);
    } else {
      //console.log("No have Value")
      return convertData(0);
    }
  };

  const getStyle = (value, inventory) => {
    if (value) {
      if (value == "Y") {
        if (inventory == 1) {
          return "px-2 py-1 rounded-[15px] bg-[#3370BF33] text-[#3370BF] w-20";
        } else if (inventory == 2) {
          return "px-2 py-1 rounded-[15px] bg-[#FA6B6E33] text-[#FA6B6E] w-20";
        }
      } else {
        return "px-2 py-1 rounded-[15px] bg-[#3CA12D33] text-[#3CA12D] w-20";
      }
    }
  };

  const handleModal = (year,month) => {
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
      getInventoryDetailPopup(
        portId,
        deviceId,
        year,
        month,
        unit,
        convertUnit,
        userData?.userGroup?.id,
        utilityId,
      )
    );
    setShowModalComplete(true);
  };

  const rederPeriod = (period) => {
    const [monthNum, year] = period.split("/");
    const monthFull = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(new Date(2024, monthNum - 1));
    console.log(monthFull + " " + year);
    return monthFull + " " + year;
  };

  useEffect(() => {
    if (isGenerate == true) {
      setOpen(true);
    } else if (isGenerate == false) {
      setOpen(false);
    }
  }, [isGenerate]);

  const columnData = [
    {
      id: "settlementPeriod",
      label: "Settlement Period",
      align: "left",
      maxWidth: "80px",
      render: (row) => (
        <div
          className=" break-words"
          style={{
            width: "100px",
            wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
          }}
        >
          {row.settlementPeriod}
        </div>
      ),
    },
    {
      id: "generation",
      label: "Generation",
      align: "center",
      maxWidth: "70px",
      render: (row) => (
        <div
          className={row.status == "Expired"?"break-words  text-[#BFBFBF]" :row.status == "Out Of Stock"?"break-words ":"break-words"}
          style={{
            wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
          }}
        >
          {/*row.generation <= 0 ? "-" : */renderValue(Number(row.generation))}
        </div>
      ),
    },
    {
      id: "totalInventory",
      label: "Total Inventory",
      align: "center",
      maxWidth: "70px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className={row.status == "Expired"?"break-words  text-[#BFBFBF]" :row.status == "Out Of Stock"?"break-words ":"break-words"}
            style={{
              wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
            }}
          >
            {/*row.totalInventory <= 0
              ? "-"
              :*/ renderValue(Number(row.totalInventory))}
          </div>
        </div>
      ),
    },
    {
      id: "inventoryUsage",
      label: "Inventory Usage",
      align: "center",
      maxWidth: "70px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className={row.status == "Expired"?"break-words  text-[#BFBFBF]" :row.status == "Out Of Stock"?"break-words ":"break-words"}
            style={{
              wordWrap: "break-word",
            }}
          >
            <label
              className="underline underline-offset-2 hover:cursor-pointer"
              onClick={() => handleModal(row.year,row.month)}
            >
              {/*row.inventoryUsage <= 0
                ? "-"
                :*/ renderValue(Number(row.inventoryUsage))}
            </label>
          </div>
        </div>
      ),
    },
    {
      id: "expiredInventory",
      label: "Expired Inventory",
      align: "center",
      maxWidth: "70px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className={row.status == "Expired"?"break-words  text-[#BFBFBF]" :row.status == "Out Of Stock"?"break-words ":"break-words"}
            style={{
              wordWrap: "break-word",
            }}
          >
            {/*row.expiredInventory <= 0
              ? "-"
              :*/ renderValue(Number(row.expiredInventory))}
          </div>
        </div>
      ),
    },
    {
      id: "remainingInventory",
      label: "Remaining Inventory",
      align: "center",
      maxWidth: "70px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className={row.status == "Expired"?"break-words  text-[#BFBFBF]" :row.status == "Out Of Stock"?"break-words ":"break-words"}
            style={{
              wordWrap: "break-word",
            }}
          >
            {/*row.remainingInventory <= 0
              ? "-"
              : */renderValue(Number(row.remainingInventory))}
          </div>
        </div>
      ),
    },
    {
      id: "remainingPeriod",
      label: "Remaining Period",
      align: "center",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className={row.status == "Expired"?"break-words line-through text-[#BFBFBF]":"break-words"}
            style={{
              width: "100px",
              wordWrap: "break-word",
            }}
          >
            {row.status == "Out Of Stock"?"-":row.remainingPeriod}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      maxWidth: "120px",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <div
            className=" break-words"
            style={{
              width: "100px",
              wordWrap: "break-word",
            }}
          >
            <StatusTag status={row.status} />
          </div>
        </div>
      ),
    },
    // Add more columns as needed
  ];

  const columnPopup = [
    {
      id: "usedInSettlementPeriod",
      label: "Used in Settlement Period",
      align: "left",
      maxWidth: "50px",
      render: (row) => (
        <div
          className=" break-words"
          style={{
            width: "100px",
            wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
          }}
        >
          {row.usedInSettlementPeriod}
        </div>
      ),
    },
    {
      id: "inventoryMathced",
      label: "Inventory Matched ("+unit+")",
      align: "center",
      maxWidth: "80px",
      render: (row) => (
        <div
          className=" break-words text-right w-full pr-5"
          style={{
            wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
          }}
        >
          {renderValue(row.inventoryMathced)}
        </div>
      ),
    },
    {
      id: "periodofProduction",
      label: "Period of Production",
      align: "left",
      maxWidth: "80px",
      render: (row) => (
        <div
          className=" break-words w-full"
          style={{
            wordWrap: "break-word", // ให้ข้อความขึ้นบรรทัดใหม่ถ้ายาวเกิน
          }}
        >
          {row.periodofProduction}
        </div>
      ),
    },
  ];
console.log(dataPopup)
  return (
    <div style={{pageBreakAfter:"always",marginTop:"10px"}}>
      <TableRow
        className="bg-[#F4F6F9] cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {/*<TableCell style={{ fontWeight: "bold" }}>{row.year}</TableCell>
        <TableCell align="right" style={{ fontWeight: "bold" }}>
          {numeral(row.totalAmount).format("0,0.00")}
        </TableCell>*/}
        <TableCell
          style={{
            width: "600px",
            fontWeight: "bold",
          }} /*className="w-[250px]"*/
        >
          {headTxt}
        </TableCell>
        <TableCell
          style={{
            width: "100px",
            fontWeight: "bold",
          }} /*className="w-[100px]"*/
        ></TableCell>
        <TableCell
          style={{ width: "1000px", fontWeight: "bold" }}
          align="right" /*className="w-[140px]"*/
        >
          <div>
            <label className="font-bold mr-1">Total Remaining Inventory</label>
            {renderValue(total)}
          </div>
        </TableCell>
        <TableCell style={{ width: "50px", fontWeight: "bold" }}>
          {!open ? <IoChevronDown /> : <IoChevronUp />}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 5,
            paddingRight: 5,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="mt-2 mb-2">
              <DataTableInventory
                data={row}
                columns={columnData}
                isTotal={"Total Inventory"}
                rowPage={20}
                unit={unit}
                convertUnit={convertUnit}
              />
            </div>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal
        opened={showModalComplete}
        onClose={() => setShowModalComplete(!showModalComplete)}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
        size={"60%"}
      >
        <div className="flex flex-col px-10 pt-4 pb-3">
          <div className="text-left font-bold text-xl">
            {dataPopup.portfolioName + " - " + dataPopup.deviceName}
          </div>
          <div className="mt-4 bg-[#999999] text-[#FFFFFF] px-2 py-3 text-base">
          Inventory of Settlement Period: {dataPopup.settlementPeriod}
          </div>
          <div className="items-center justify-center">
            <DataTableInventory
              data={dataPopup.detailData?dataPopup.detailData:[]}
              columns={columnPopup}
              isTotal={"Total Popup"}
              unit={unit}
              convertUnit={convertUnit}
            />
          </div>

          <div className="flex gap-4 items-center justify-center">
            <Button
              className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
              onClick={() => {
                setShowModalComplete(!showModalComplete);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RowInventory;

import React, { useState, useEffect, useRef } from "react";

import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // Import the error icon
import "../../Control/Css/DataTable.css";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Checkbox,
  TableFooter,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import WarningIcon from "@mui/icons-material/Warning";
//import RowSettlement from "./components/TableRowSettlement";
import RowInventory from "./TableRowInventory";


const CollapsDataTableInven = ({
  data,
  columns,
  searchData,
  checkbox,
  onSelectedRowsChange,
  selectedData,
  editDatetime,
  dateChange,
  isTotal,
  isStartPort,
  portfolioStartDate,
  portfolioEndDate,
  openpopupDeviceError,
  openpopupSubError,
  error,
  isSubTotal,
  isDevice = true,
  rowPerPage = 10,
  unit,
  convertUnit,
  isGenerate = false,
  portId,
}) => {
  const {
    handleSubmit,
    resetField,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  //console.log(data);
  const dispatch = useDispatch();
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowPerPage);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#F3F6F9",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalValue, setTotalValue] = useState([]);
  const [totalLoadDevice, setTotalLoadDevice] = useState([]);
  const [actualGenerationDevice, setActualGenerationDevice] = useState([]);
  const [inventoryMatchDevice, setInventoryMatchDevice] = useState([]);
  const [perActualMatchDevice, setPerActualMatchDevice] = useState([]);
  const [totalLoadSubscriber, setTotalLoadSubscriber] = useState([]);
  const [actualGenerationSubscriber, setActualGenerationSubscriber] = useState(
    []
  );
  const [inventoryMatchSubscriber, setInventoryMatchSubscriber] = useState([]);
  const [perActualMatchSubscriber, setPerActualMatchSubscriber] = useState([]);

  // useEffect(() => {
  //   return () => dispatch({ type: "RESET_STATE" });
  // }, []);
  //console.log(data);
  useEffect(() => {
    if (editDatetime) {
      console.log("data === ", data);
      data?.map((data) => {
        setValue(
          "startDate_" + data?.id,
          format(
            convertToDate(data?.startDate || data?.retailESAContractStartDate),
            "yyyy-MM-dd"
          )
        );
        setValue(
          "endDate_" + data?.id,
          format(
            convertToDate(data?.endDate || data?.retailESAContractEndDate),
            "yyyy-MM-dd"
          )
        );
      });
    }
  }, [editDatetime]);

  useEffect(() => {
    // console.log("data == ", data?.length);
    setSearchTerm(searchData);
    setPage(0);
  }, [searchData]);

  useEffect(() => {
    setPage(0);
    if (isTotal === "Total Capacity") {
      const total = paginatedData.reduce(
        (acc, row) => acc + (row.capacity || 0),
        0
      );
      setTotalValue(numeral(total).format("0,0.000000"));
    } else if (isTotal === "Total Contracted Energy") {
      const total = paginatedData.reduce(
        (acc, row) => acc + (row.allocateEnergyAmount || 0),
        0
      );
      setTotalValue(numeral(total).format("0,0.00"));
    } else if (isTotal === "Total Supply") {
      const total = paginatedData.reduce(
        (acc, row) => acc + (row.matched || 0),
        0
      );
      setTotalValue(numeral(total).format("0,0.00"));
    } else if (isTotal === "Total Remaining") {
      const total = paginatedData.reduce(
        (acc, row) => acc + (row.remainingEnergyAttribute || 0),
        0
      );
      setTotalValue(numeral(total).format("0,0.00"));
    } else if (isTotal === "Total") {
      if (isSubTotal == "Device") {
        console.log(paginatedData);
        const totalloadDevice = paginatedData.reduce(
          (acc, row) => acc + (row.totalGeneration || 0),
          0
        );
        setTotalLoadDevice(numeral(totalloadDevice).format("0,0.00"));
        const actualGenerateDevice = paginatedData.reduce(
          (acc, row) => acc + (row.actualGenerationMatch || 0),
          0
        );
        setActualGenerationDevice(
          numeral(actualGenerateDevice).format("0,0.00")
        );
        const inventorymatchDevice = paginatedData.reduce(
          (acc, row) => acc + (row.inventoryMatch || 0),
          0
        );
        setInventoryMatchDevice(numeral(inventorymatchDevice).format("0,0.00"));
        const perActualMatch = paginatedData.reduce(
          (acc, row) => acc + (row.perActualGenerationMatch || 0),
          0
        );
        setPerActualMatchDevice(numeral(perActualMatch).format("0,0.00"));
      } else if (isSubTotal == "Subscriber") {
        const totalloadDevice = paginatedData.reduce(
          (acc, row) => acc + (row.totalLoad || 0),
          0
        );
        setTotalLoadSubscriber(numeral(totalloadDevice).format("0,0.00"));
        const actualGenerateDevice = paginatedData.reduce(
          (acc, row) => acc + (row.actualLoadMatch || 0),
          0
        );
        setActualGenerationSubscriber(
          numeral(actualGenerateDevice).format("0,0.00")
        );
        const inventorymatchDevice = paginatedData.reduce(
          (acc, row) => acc + (row.inventorymatch || 0),
          0
        );
        setInventoryMatchSubscriber(
          numeral(inventorymatchDevice).format("0,0.00")
        );
        const perActualMatch = paginatedData.reduce(
          (acc, row) => acc + (row.perNetGreenDeliverables || 0),
          0
        );
        setPerActualMatchSubscriber(numeral(perActualMatch).format("0,0.00"));
      }
    }
  }, [data]);

  useEffect(() => {
    if (selectedData?.length > 0) {
      const newSelectedRows = selectedData.map((data) => data?.id);
      setSelectedRows(newSelectedRows);
      if (onSelectedRowsChange) {
        onSelectedRowsChange(newSelectedRows);
      }
    }
  }, [selectedData]);

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrderBy(columnId);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else if (selectedIndex === 0) {
      newSelected = selectedRows.slice(1);
    } else if (selectedIndex === selectedRows?.length - 1) {
      newSelected = selectedRows.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = selectedRows
        .slice(0, selectedIndex)
        .concat(selectedRows.slice(selectedIndex + 1));
    }
    // console.log("newSelected == ", newSelected);
    setSelectedRows(newSelected);
    if (onSelectedRowsChange) {
      onSelectedRowsChange(newSelected);
    }
  };
  const isSelected = (id) => {
    return selectedRows.indexOf(id) !== -1;
  };
  const isDisableSelected = (id) => {
    const filterDisabled = selectedData?.filter((item) => item.id == id);
    return filterDisabled?.length > 0 ? true : false;
  };
  const sortedData = data?.sort((a, b) => {
    if (orderBy === null) return 0;

    const aValue = a[orderBy];
    const bValue = b[orderBy];
    
    //console.log(aValue,bValue)

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle numeric sorting
    return order === "asc" ? aValue - bValue : bValue - aValue;
  });
  //console.log(sortedData)
  const filteredData = sortedData?.filter((obj) => {
    for (let key in obj) {
      if (key === "id") continue;
      if (key == "subscriberTypeId") {
        // console.log("subType")
        if (String(obj[key]) == 1) {
          return "Subscriber".toLowerCase().includes(searchTerm?.toLowerCase());
        } else if (String(obj[key]) == 2) {
          return "Aggregate Subscriber"
            .toLowerCase()
            .includes(searchTerm?.toLowerCase());
        }
      } else if (key == "contractedEnergy") {
        // console.log("ContractEnergy")
        let contractedEnergy = obj[key];
        if (contractedEnergy != null) {
          if (
            numeral(String(obj[key]).toLowerCase())
              .value()
              .toString()
              .includes(numeral(searchTerm).value())
          ) {
            return true;
          }
        }
      } else if (key == "capacity") {
        //console.log("capacity")
        let capacity = obj[key];
        if (capacity != null) {
          if (
            numeral(String(obj[key]).toLowerCase())
              .value()
              .toString()
              .includes(numeral(searchTerm).value())
          ) {
            return true;
          }
        }
      } else if (key == "allocateEnergyAmount") {
        //console.log("allow")
        let allocateEnergyAmount = obj[key];
        if (allocateEnergyAmount != null) {
          if (
            numeral(String(obj[key]).toLowerCase())
              .value()
              .toString()
              .includes(numeral(searchTerm).value())
          ) {
            return true;
          }
        }
      } else if (key == "matchedSupply") {
        let allocateEnergyAmount = obj[key];
        if (allocateEnergyAmount != null) {
          if (
            numeral(String(obj[key]).toLowerCase())
              .value()
              .toString()
              .includes(numeral(searchTerm).value())
          ) {
            return true;
          }
        }
      } else if (key == "totalLoad") {
        let allocateEnergyAmount = obj[key];
        if (allocateEnergyAmount != null) {
          if (
            numeral(String(obj[key]).toLowerCase())
              .value()
              .toString()
              .includes(numeral(searchTerm).value())
          ) {
            return true;
          }
        }
      } else if(key == "totalAmount"){
        let allocateEnergyAmount = obj[key];
        if (allocateEnergyAmount != null) {
          if (
            numeral(String(obj[key]).toLowerCase())
              .value()
              .toString()
              .includes(numeral(searchTerm).value())
          ) {
            return true;
          }
        }
      } else if(key == "deviceId" || key == "deviceName" || key == "detail"){
        continue
      }else {
        //console.log("another")
        //
        //console.log(obj)
        //console.log(obj[key])
        /*  else if (key == "currentSettlement") {
        if (
          dayjs(obj[key], "YYYY-M")
            .format("MMMM YYYY")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
      }  */
        //console.log(String(obj[key]).toLowerCase().includes(searchTerm?.toLowerCase()))
        if (
          String(obj[key]).toLowerCase().includes(searchTerm?.toLowerCase())
        ) {
          return true;
        }
        // Object?.values(obj)?.some((value) =>
        //   value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        // );
      }
    }
  });
  //console.log(filteredData)
  const paginatedData = sortedData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  //console.log(paginatedData)
  function convertToDate(dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);

    // ตรวจสอบว่ามีวันที่ที่ถูกต้องหรือไม่
    if (isNaN(date)) {
      return null; // หรือส่งกลับวันที่ที่เป็นค่าเริ่มต้นตามต้องการ
    }

    // รับวัน เดือน และปี
    const day = String(date.getDate()).padStart(2, "0"); // เพิ่ม 0 ข้างหน้าถ้าจำนวนน้อยกว่า 10
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มต้นที่ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // ส่งกลับวันที่ในรูปแบบ dd/mm/yyyy
  }
  const parseDate = (dateStr) => {
    const parts = dateStr.split("/");
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  };

  const requestedEffectiveDateDisableDateCal = (
    day,
    index,
    isStartDate = true
  ) => {
    // startDate calculation
    const previousDateStart = new Date(portfolioStartDate);
    previousDateStart.setHours(0, 0, 0, 0);

    const checkStartDate =
      data.find((item) => item.id === index)?.startDate ||
      data.find((item) => item.id === index)?.subStartDate;

    let tempStartDate;

    if (checkStartDate) {
      const registrationDate = formatDateToDDMMYYYY(
        data.find((item) => item.id === index)?.registrationDate
      );
      const retailStartDate = data.find(
        (item) => item.id === index
      )?.retailESAContractStartDate;

      // แปลง registrationDate และ retailStartDate
      const parsedRegistrationDate = registrationDate
        ? parseDate(registrationDate)
        : null;
      const parsedRetailStartDate = retailStartDate
        ? parseDate(retailStartDate)
        : null;

      // ตรวจสอบว่า previousDateStart มีค่าน้อยกว่าหรือเท่ากับ registrationDate หรือ retailStartDate หรือไม่
      if (
        (parsedRegistrationDate &&
          previousDateStart > parsedRegistrationDate) ||
        (parsedRetailStartDate && previousDateStart > parsedRetailStartDate)
      ) {
        tempStartDate = parseDate(
          previousDateStart instanceof Date
            ? previousDateStart.toISOString().slice(0, 10)
            : previousDateStart
        );

        console.log("Using Previous Start Date:", tempStartDate);
      } else {
        tempStartDate = parsedRegistrationDate || parsedRetailStartDate;
        console.log("Parsed Start Date:", tempStartDate);
      }
    } else {
      tempStartDate = parseDate(previousDateStart);
      console.log("Default Start Date:", tempStartDate); // ตั้งค่าเป็น previousDate ถ้าไม่มี
    }

    // If checking for start date, we need to ensure it does not exceed the minimum end date
    if (isStartDate) {
      let minEndDate = new Date(
        Math.min(
          ...data
            .filter((item) => item.id === index)
            .map((item) => {
              const checkEndDate = item.endDate || item.subEndDate;
              if (checkEndDate) {
                return parseDate(checkEndDate);
              }
              return Infinity; // return a high value if no date is found
            })
        )
      );

      const startDateDisabled =
        day < previousDateStart || day > minEndDate || day < tempStartDate;
      return startDateDisabled;
    }

    // endDate calculation
    const previousDateEnd = new Date(portfolioEndDate);
    previousDateEnd.setHours(0, 0, 0, 0);

    const checkEndDate =
      data.find((item) => item.id === index)?.endDate ||
      data.find((item) => item.id === index)?.subEndDate;

    console.log("Check End Date:", checkEndDate);
    let tempEndDate;

    if (checkEndDate) {
      const expiryDate = formatDateToDDMMYYYY(
        data.find((item) => item.id === index)?.expiryDate
      );
      const retailEndDate = data.find(
        (item) => item.id === index
      )?.retailESAContractEndDate;

      const parsedExpiryDate = expiryDate ? parseDate(expiryDate) : null;
      const parsedRetailEndDate = retailEndDate
        ? parseDate(retailEndDate)
        : null;
      const parsedPortfolioEndDate = new Date(portfolioEndDate);

      // Check if parsedPortfolioEndDate is less than parsedExpiryDate or parsedRetailEndDate
      if (
        (parsedExpiryDate && parsedPortfolioEndDate < parsedExpiryDate) ||
        (parsedRetailEndDate && parsedPortfolioEndDate < parsedRetailEndDate)
      ) {
        tempEndDate = previousDateEnd;
        console.log("Using Previous End Date:", previousDateEnd);
      } else {
        // Use the available valid date or fallback to previousDateEnd
        tempEndDate =
          parsedExpiryDate || parsedRetailEndDate || previousDateEnd;
        console.log("Using Available End Date:", tempEndDate);
      }
    } else {
      tempEndDate = previousDateEnd;
      console.log("No End Date Found, Using Previous End Date:", tempEndDate);
    }

    const foundItem = data.find((item) => item.id === index);

    let startDate = null;
    if (foundItem) {
      const parsedStartDate = foundItem.startDate
        ? parseDate(foundItem.startDate)
        : null;
      const parsedSubStartDate = foundItem.subStartDate
        ? parseDate(foundItem.subStartDate)
        : null;

      startDate = parsedStartDate || parsedSubStartDate;
    }

    // Check for startDate validity
    if (!startDate) {
      console.error("Start date could not be determined.");
    }

    // Disable logic for end date: must be greater than StartDate
    const endDateDisabled =
      day < startDate || day < previousDateStart || day > tempEndDate;

    return endDateDisabled; // คืนค่า endDateDisabled
  };

  const renderCell = (row, column) => {
    const isError = row.isError; // Assuming row has an isError property
    if (column.id === "errorDevice" && isError) {
      return (
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
            onClick={() =>
              openpopupDeviceError(
                row.id,
                row.deviceName,
                row.startDate,
                row.endDate
              )
            }
          >
            Error Detail
          </div>
        </div>
      );
    }
    if (column.id === "errorSub" && isError) {
      return (
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
            onClick={() =>
              openpopupSubError(
                row.id,
                row.startDate,
                row.endDate,
                row.subscribersContractInformationId
              )
            }
          >
            Error Detail
          </div>
        </div>
      );
    }
    if (column.render) {
      // ถ้ามี props 'render'
      if (!editDatetime) {
        return column.render(row);
      } else {
        if (isStartPort) {
          // ถ้า Port เริ่มไปแล้ว แก้ไขวันที่ EndDate ได้อย่างเดียว
          if (
            column.id === "startDate" ||
            column.id === "retailESAContractStartDate"
          ) {
            return <span>{row[column.id]}</span>;
          }else {
            // column อื่นๆ
            return column.render(row);
          }
        } else {
          // ถ้า Port ยังไม่เริ่ม แก้ไขวันที่ Start / EndDate ได้
        
            return column.render(row);
        }
      }
    } else {
      return <span>{row[column.id]}</span>;
    }
  };

  const convertData = (value) => {
    let decFixed = 3;
    if (unit == "kWh") {
      decFixed = 3;
    } else if (unit == "MWh") {
      decFixed = 6;
    } else if (unit == "GWh") {
      decFixed = 6;
    }

    if (value) {
      //console.log("Show Value")
      if (decFixed == 3) {
        return numeral(value).format("0,0.000");
      }
      if (decFixed == 6) {
        return numeral(value).format("0,0.000000");
      }
    } else {
      //console.log("Set Zero")
      return numeral(0).format("0,0.000");
    }
  };

  const renderValue = (value) => {
    if (value) {
      return convertData(value * convertUnit);
    } else {
      return convertData(0);
    }
  };

  //console.log(data)

  return (
    <div>
      <TableContainer
        component={Paper}
        style={{ border: "none", boxShadow: "none" }}
      >
        <Table>
          <TableContainer>
            <Table>
              <TableHead>
                
              </TableHead>
              <TableBody>
                {paginatedData.length > 0?(
                paginatedData.map((item,index)=>{
                return(<RowInventory
                key={index}
                row={item.detailData}
                headTxt={item.deviceName}
                total={item.totalRemainingInventory}
                unit={unit}
                convertUnit={convertUnit}
                isGenerate={isGenerate}
                portId={portId}
                deviceId={item.deviceId}/>)})
              ):
                (<TableRow>
                  <TableCell
                    colSpan={100}
                    style={{ textAlign: "center",color: '#848789'}}
                  >
                    No data found
                  </TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 25, 100]}
        component="div"
        count={sortedData?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Show:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from} - ${to} of ${count}`
        }
      />
    </div>
  );
};

export default CollapsDataTableInven;

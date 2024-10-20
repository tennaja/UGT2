import React, { useState, useEffect, useRef } from "react";
import DatePicker from "../../Control/DayPicker";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; 
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
import WarningIcon from '@mui/icons-material/Warning';

const DataTablePortfolio = ({
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
  error
}) => {
  const {
    handleSubmit,
    resetField,
    setValue,
    control,
    formState: { errors },
  } = useForm();
console.log(data)
  const dispatch = useDispatch();

  const detailPortfolio = useSelector(
    (state) => state.portfolio.getOnePortfolio
  );

  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  // useEffect(() => {
  //   return () => dispatch({ type: "RESET_STATE" });
  // }, []);

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
  const isDisableSelected = ({ id, name }) => {
    const addedDevice = detailPortfolio?.device?.filter(
      (item) => item?.id == id && item?.name == name
    );
    const addedSubscriber = detailPortfolio?.subscriber?.filter(
      (item) => item?.id == id && item?.name == name
    );

    const filterDisabled = selectedData?.filter((item) => item.id == id);
    return filterDisabled?.length > 0 || addedDevice.length > 0
      ? true
      : false || addedSubscriber.length > 0
      ? true
      : false;
  };
  const sortedData = data?.sort((a, b) => {
    if (orderBy === null) return 0;

    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle numeric sorting
    return order === "asc" ? aValue - bValue : bValue - aValue;
  });

  const filteredData = sortedData?.filter((obj) => {
    for (let key in obj) {
      if (key === "id") continue;
      if (key == "subscriberTypeId") {
        if (String(obj[key]) == 1) {
          return "Subscriber".toLowerCase().includes(searchTerm?.toLowerCase());
        } else if (String(obj[key]) == 2) {
          return "Aggregate Subscriber"
            .toLowerCase()
            .includes(searchTerm?.toLowerCase());
        }
      } else if (key == "contractedEnergy") {
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
      } else {
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

  const paginatedData = filteredData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  function convertToDate(dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  const requestedEffectiveDateDisableDateCal = (day, index) => {
    // startDate calculate
    let dateValueStart = new Date(portfolioStartDate);
    console.log(dateValueStart)
    const previousDateStart = new Date(dateValueStart);
    console.log(previousDateStart)
    previousDateStart.setHours(0, 0, 0, 0);
    previousDateStart.setDate(dateValueStart.getDate());
    
    const checkStartDate =
      data.find((item) => item.id === index)?.startDate 
     

    let tempStartDate;

    if (data.find((item) => item.id === index)?.Date >= previousDateStart) {
      const parts = checkStartDate.split("/");
      tempStartDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      console.log("in1")
    } 
    else {
      tempStartDate = new Date(checkStartDate);
      console.log("out")
    }


    tempStartDate.setDate(tempStartDate.getDate());

    const startDateDisabled =
      tempStartDate <= previousDateStart
        ? day < previousDateStart
        : day < tempStartDate;

    // endDate calculate
    let dateValueEnd = new Date(portfolioEndDate);
    const previousDateEnd = new Date(dateValueEnd);
    previousDateEnd.setHours(0, 0, 0, 0);
    previousDateEnd.setDate(dateValueEnd.getDate());

    const checkEndDate =
      data.find((item) => item.id === index)?.expiryDate ||
      data.find((item) => item.id === index)?.checkEndDate

    let tempDateEndDate;
    if (data.find((item) => item.id === index)?.expiryDate <= dateValueEnd) {
      const parts = checkEndDate.split("/");
      tempDateEndDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else if (data.find((item) => item.id === index)?.checkEndDate <= dateValueEnd){
      const parts = checkEndDate.split("/");
      tempDateEndDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }else {
      tempDateEndDate = previousDateEnd;
    }
    const endDateDisabled =
      tempDateEndDate >= previousDateEnd
        ? day > previousDateEnd
        : day > tempDateEndDate;

    const disable = startDateDisabled || endDateDisabled;

    return disable;
  };

  const renderCell = (row, column) => {
    const isError = row.isError;
    if (column.render) {
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
           onClick={() => openpopupDeviceError(row.id ,row.deviceName,row.startDate,row.endDate)}
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
         onClick={() => openpopupSubError(row.id,row.startDate,row.endDate,row.subscribersContractInformationId)}
        >
          Error Detail
        </div>
      </div>
        );
      }
      // ถ้ามี props 'render'
      if (!editDatetime) {
        return column.render(row);
      } else {
        // ถ้า Port ยังไม่เริ่ม แก้ไขวันที่ Start / EndDate ได้
        if (
          column.id === "startDate" ||
          column.id === "retailESAContractStartDate"
        ) {
          // ถ้าเป็นข้อมูลที่ add ลงไปใน port อยู่แล้ว ห้าม edit start date
          const addedDevice = detailPortfolio?.device?.filter(
            (item) => item?.id == row.id && item?.name == row.name
          );

          // ถ้าเป็นข้อมูลที่ add ลงไปใน port อยู่แล้ว ห้าม edit start date
          const addedSubscriber = detailPortfolio?.subscriber?.filter(
            (item) => item?.id == row.id && item?.name == row.name
          );
          if (addedDevice.length > 0) return <span>{row[column.id]}</span>;
          else if (addedSubscriber.length > 0)
            return <span>{row[column.id]}</span>;
          else {
            console.log("column.id subscriber", column.id);
            console.log("row.id subscriber", row);
            // เป็นข้อมูลที่ add เข้ามา ยังไม่ได้ save จะแก้ไขได้
            return (
              <Controller
                name={"startDate" + "_" + row.id}
                control={control}
                rules={
                  {
                    // required: "This field is required",
                  }
                }
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    id={"startDate" + "_" + row.id}
                    formatDate={"d/M/yyyy"}
                    error={errors["startDate" + "_" + row.id]}
                    onCalDisableDate={(newValue) => {
                      return requestedEffectiveDateDisableDateCal(
                        newValue,
                        row.id
                      );
                    }}
                    onChangeInput={(newValue) => {
                      console.log("newValue", newValue);
                      const newDate = format(newValue, "dd/MM/yyyy");
                      dateChange(newDate, row.id, "startDate");
                    }}
                    validate={" *"}
                    // ... other props
                  />
                )}
              />
            );
          }
        } else if (
          column.id === "endDate" ||
          column.id === "retailESAContractEndDate"
        ) {
          return (
            <Controller
              name={"endDate" + "_" + row.id}
              control={control}
              rules={
                {
                  // required: "This field is required",
                }
              }
              render={({ field }) => (
                <DatePicker
                  {...field}
                  id={"endDate" + "_" + row.id}
                  formatDate={"d/M/yyyy"}
                  error={errors["endDate" + "_" + row.id]}
                  onCalDisableDate={(newValue) => {
                    return requestedEffectiveDateDisableDateCal(
                      newValue,
                      row.id
                    );
                  }}
                  onChangeInput={(newValue) => {
                    const newDate = format(newValue, "dd/MM/yyyy");
                    dateChange(newDate, row.id, "endDate");
                  }}
                  validate={" *"}
                  // ... other props
                />
              )}
            />
          );
        } else {
          // column อื่นๆ
          return column.render(row);
        }
      }
    } else {
      return <span>{row[column.id]}</span>;
    }
  };

  return (
    <div>
      <TableContainer component={Paper} style={{ border: "none", boxShadow: "none" }}>
  <Table>
    <TableHead>
      <TableRow>
        {checkbox && (
          <TableCell
            padding="checkbox"
            style={{
              backgroundColor: "#F3F6F9",
            }}
          >
            <Checkbox
  indeterminate={
    selectedRows?.length > 0 &&
    selectedRows?.length < data?.filter((row) => !isDisableSelected({ id: row.id, name: row.name }))?.length
  }
  checked={
    selectedRows?.length > 0 && 
    selectedRows?.length === data?.filter((row) => !isDisableSelected({ id: row.id, name: row.name }))?.length
  }
  disabled={selectedData?.length > 0 ? true : false}
  onChange={(event) => {
    const nonDisabledRows = data?.filter((row) => !isDisableSelected({ id: row.id, name: row.name })).map((row) => row.id);

    if (event.target.checked) {
      // If ticked, select all non-disabled rows
      setSelectedRows(nonDisabledRows);
      onSelectedRowsChange(nonDisabledRows);
    } else {
      // If unticked, unselect all rows
      setSelectedRows([]);
      onSelectedRowsChange([]);
    }
  }}
/>

          </TableCell>
        )}
        {columns?.map((column, index) => (
          <TableCell
            key={column.id}
            style={{
              backgroundColor: "#F3F6F9",
            }}
            align={column.align ? column.align : "center"}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={() => handleSort(column.id)}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedData.length > 0 ? (
        paginatedData.map((row, index) => {
          const isItemSelected = isSelected(row.id);
          const isDisabled = isDisableSelected({ id: row.id, name: row.name });
          const isError = row.isError;
          return (
            <TableRow
              key={index}
              hover
              role="checkbox"
              tabIndex={-1}
              selected={isItemSelected}
              style={{
                backgroundColor: isError ? "#F4433614" : "inherit", // Light red background on error
              }}
            >
              {checkbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                    disabled={isDisabled}
                    onChange={(event) => handleCheckboxChange(event, row.id)}
                  />
                </TableCell>
              )}
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align ? column.align : "center"}
                  style={{ maxWidth: column.maxWidth }}
                >
                  {renderCell(row, column)}
                </TableCell>
              ))}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length + (checkbox ? 1 : 0)}
            style={{ textAlign: "center" }}
          >
            No data found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
    <TableFooter>
      {isTotal && (
        <TableRow>
          {checkbox && (
            <TableCell padding="checkbox" style={{ backgroundColor: "#F3F6F9" }}></TableCell>
          )}
          {columns.map((column, index) => {
            if (index === 0) {
              return (
                <TableCell
                  key={`footer-label`}
                  style={{
                    textAlign: "center",
                    backgroundColor: "#F3F6F9",
                    padding: "10px",
                  }}
                >
                  <strong> {isTotal} </strong>
                </TableCell>
              );
            } else if (isTotal === "Total Capacity" && index === 3) {
              return (
                <TableCell
                  key={`footer-total-capacity`}
                  style={{
                    textAlign: "right",
                    backgroundColor: "#F3F6F9",
                    padding: "1rem",
                  }}
                >
                  <strong>
                    {totalValue ? numeral(totalValue).format("0,0.000000") : ""}
                  </strong>
                </TableCell>
              );
            } else if (isTotal === "Total Contracted Energy" && index === 2) {
              return (
                <TableCell
                  key={`footer-total-capacity`}
                  style={{
                    textAlign: "right",
                    backgroundColor: "#F3F6F9",
                    padding: "1rem",
                  }}
                >
                  <strong>
                    {totalValue ? numeral(totalValue).format("0,0.00") : ""}
                  </strong>
                </TableCell>
              );
            } else if (isTotal === "Total Remaining" && index === 2) {
              return (
                <TableCell
                  key={`footer-total-capacity`}
                  style={{
                    textAlign: "right",
                    backgroundColor: "#F3F6F9",
                    padding: "1rem",
                  }}
                >
                  <strong>
                    {totalValue ? numeral(totalValue).format("0,0.00") : ""}
                  </strong>
                </TableCell>
              );
            } else if (isTotal === "Total Supply" && index === 2) {
              return (
                <TableCell
                  key={`footer-total-capacity`}
                  style={{
                    textAlign: "right",
                    backgroundColor: "#F3F6F9",
                    padding: "1rem",
                  }}
                >
                  <strong>
                    {totalValue ? numeral(totalValue).format("0,0.00") : ""}
                  </strong>
                </TableCell>
              );
            } else {
              return (
                <TableCell
                  key={`footer-empty-${index}`}
                  style={{
                    textAlign: "center",
                    backgroundColor: "#F3F6F9",
                    padding: "10px",
                  }}
                />
              );
            }
          })}
        </TableRow>
      )}
    </TableFooter>
  </Table>
</TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={filteredData?.length}
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

export default DataTablePortfolio;

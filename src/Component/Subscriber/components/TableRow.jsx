import React, { useState } from "react";
import { Collapse, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import dayjs from "dayjs";
import numeral from "numeral";

const Row = (props) => {
  const { row, rowindex } = props;
  const [open, setOpen] = useState(false);
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
  return (
    <>
      <TableRow
        className="bg-[#F4F6F9] cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <TableCell style={{ fontWeight: "bold" }}>{row.year}</TableCell>
        <TableCell align="right" style={{ fontWeight: "bold" }}>
          {numeral(row.totalAmount).format("0,0.00")}
        </TableCell>
        <TableCell>{!open ? <IoChevronDown /> : <IoChevronUp />}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Month</TableCell>
                  <TableCell align="right" style={{ fontWeight: "bold" }}>
                    Allowcated Energy Amounth (kWh)
                  </TableCell>
                  <TableCell />
                </TableRow>

                {months.map((month, index) => {
                  const key = String(index + 1).padStart(2, "0");
                  return (
                    <TableRow
                      key={index + 1}
                      className=""
                      style={{ border: "none" }}
                    >
                      <TableCell
                        style={{ width: "5%", borderBottom: "none" }}
                        className="text-center"
                      >
                        {month}
                      </TableCell>
                      <TableCell align="right" style={{ borderBottom: "none" }}>
                        {numeral(row[`amount${key}`]).format("0,0.00")}
                      </TableCell>
                      <TableCell style={{ borderBottom: "none" }} />
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;

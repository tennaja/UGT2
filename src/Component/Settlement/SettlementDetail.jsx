"use client";

import React, { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import { getSettlementMonthlyDetail } from "../../Redux/Settlement/Action";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const SettlementDetail = ({
  ugtGroupId,
  portfolioId,
  settlementYear,
  settlementMonth,
  unit,
  convertUnit,
}) => {
  const dispatch = useDispatch();
  const detailData = useSelector(
    (state) => state.settlement.settlementMonthlyDetail
  );

  useEffect(() => {
    dispatch(
      getSettlementMonthlyDetail(
        ugtGroupId,
        portfolioId,
        settlementYear,
        settlementMonth
      )
    );
  }, [settlementYear, settlementMonth]);

  const convertDecimalPlace = (value) => {
    let decFixed = 2;
    if (unit == "kWh") {
      decFixed = 3;
    } else if (unit == "MWh") {
      decFixed = 6;
    } else if (unit == "GWh") {
      decFixed = 6;
    }

    if (value) {
      if (decFixed == 2) {
        return numeral(value).format("0,0.00");
      } else if (decFixed == 3) {
        return numeral(value).format("0,0.000");
      } else if (decFixed == 6) {
        return numeral(value).format("0,0.000000");
      }
    } else {
      return "-";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center pb-2">
        <div className="text-lg font-bold text-left">Settlement Detail</div>
        <div className="flex gap-10">
          <div className="flex gap-4 ">
            <div className="text-sm font-bold">Settlement Period</div>
            <div className="text-sm">
              {dayjs(detailData?.settlementPeriod).format("MMMM YYYY")}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-sm font-bold">Matched</div>
            <div className="text-sm">
              {convertDecimalPlace(detailData?.matched * convertUnit) +
                " " +
                unit}
            </div>
          </div>
        </div>
      </div>

      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell className="text-center">Period Start</TableCell>
              <TableCell className="text-center">Period End</TableCell>
              <TableCell className="text-center">Settlement Type</TableCell>
              <TableCell className="text-center">
                Matched Supply{"\n"} ({unit})
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {detailData?.deviceList?.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No Settlement Data.</TableCell>
              </TableRow>
            ) : (
              detailData?.deviceList?.map((row, index) => (
                <Row
                  key={index}
                  rowindex={index}
                  row={row}
                  convertUnit={convertUnit}
                  convertDecimalPlace={convertDecimalPlace}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const Row = (props) => {
  const { row, convertUnit, convertDecimalPlace, rowindex } = props;
  const [open, setOpen] = React.useState(rowindex == 0 ? true : false);
  return (
    <>
      <TableRow
        className="bg-[#F4F6F9] cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <TableCell style={{ fontWeight: "bold", width: "55%" }}>
          {row.deviceName}
        </TableCell>
        <TableCell className="text-center" style={{ width: "10%" }} />
        <TableCell className="text-center" style={{ width: "10%" }} />
        <TableCell className="text-center" style={{ width: "10%" }} />
        <TableCell align="right" style={{ fontWeight: "bold" }}>
          {convertDecimalPlace(row.matchedSupply * convertUnit)}
        </TableCell>
        <TableCell>{!open ? <IoChevronDown /> : <IoChevronUp />}</TableCell>
      </TableRow>

      <TableRow className="px-0">
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {row.detail.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ width: "5%" }} className="text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "50%" }}
                    >
                      {item.utilityContract}
                    </TableCell>
                    <TableCell className="text-center" style={{ width: "10%" }}>
                      {dayjs(item.periodStart).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="text-center" style={{ width: "10%" }}>
                      {dayjs(item.periodEnd).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="text-center" style={{ width: "10%" }}>
                      {item.type == "Y" ? "Inventory" : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {convertDecimalPlace(item.matched * convertUnit)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SettlementDetail;

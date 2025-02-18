import React, { useState } from "react";
import {
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Box,
} from "@mui/material";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import dayjs from "dayjs";
import numeral from "numeral";
import { HiDownload } from "react-icons/hi";

const CollapseEAC = (props) => {
  const { data, no, row,checkRole,download } = props;
  console.log(row)
  const [open, setOpen] = useState(false);
  //console.log(total)
  console.log(data);

  return (
    <>
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
            width: "10%",
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: "white",
          }} /*className="w-[250px]"*/
        >
          {no}
        </TableCell>
        <TableCell
          style={{
            width: "50%",
            fontWeight: "bold",
            backgroundColor: "white",
          }} /*className="w-[100px]"*/
        >
          {data?.subscriberName}
        </TableCell>
        <TableCell
          style={{ width: "10%", fontWeight: "bold", backgroundColor: "white" }}
        >
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
            backgroundColor: "white",
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    style={{ width: "10%" }} /*className="w-[250px]"*/
                  ></TableCell>
                  <TableCell style={{ width: "50%" }} /*className="w-[100px]"*/>
                    <Table>
                      <TableHead className="bg-[#87BE3333]">
                        <TableRow>
                          <TableCell
                            style={{
                              width: "50%",
                              borderBottom: "none",
                            }} /*className="w-[250px]"*/
                          >
                            <label className="text-sm text-[#496B14] ">
                              Beneficiary Name
                            </label>
                          </TableCell>
                          <TableCell
                            style={{
                              width: "50%",
                              borderBottom: "none",
                              textAlign: "center",
                            }} /*className="w-[100px]"*/
                          >
                            <label className="text-sm text-[#496B14]">
                              Redemption Certificate
                            </label>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.map((item, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  textAlign: "left",
                                  color: "#848789",
                                }}
                              >
                                {item.beneficiaryName}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: "#848789",
                                  alignItems: "center",
                                }}
                              >
                                {checkRole &&<div className="flex justify-center items-center">
                                  <HiDownload className="hover:cursor-pointer" onClick={()=>download(item.transactionUid)}/>
                                </div>}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell
                    style={{ width: "10%" }} /*className="w-[180px]"*/
                  ></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapseEAC;

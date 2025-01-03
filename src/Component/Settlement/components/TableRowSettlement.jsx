import React, { useState } from "react";
import { Collapse, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import dayjs from "dayjs";
import numeral from "numeral";

const RowSettlement = (props) => {
  const { row, rowindex,isDevice,headTxt,total,unit,convertUnit } = props;
  //console.log(row)
  const [open, setOpen] = useState(false);
  //console.log(total)
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
    //console.log("Value Convert",value)
    let decFixed = 3;
    if (unit == "kWh") {
      decFixed = 3;
    } else if (unit == "MWh") {
      decFixed = 6;
    } else if (unit == "GWh") {
      decFixed = 6;
    }

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
      return numeral(0).format("0,0.000");
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

  const getStyle =(value,inventory)=>{
      if(value){
        if(value == "Y"){
          if(inventory == 1){
            return "px-2 py-1 rounded-[15px] bg-[#3370BF33] text-[#3370BF] w-20"
          }
          else if(inventory == 2){
            return "px-2 py-1 rounded-[15px] bg-[#FA6B6E33] text-[#FA6B6E] w-20"
          }
        }
        else{
          return "px-2 py-1 rounded-[15px] bg-[#3CA12D33] text-[#3CA12D] w-20"
        }
      }
  }
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
        <TableCell style={{ width: "600px", fontWeight: "bold" }} /*className="w-[250px]"*/>{headTxt}</TableCell>
        <TableCell style={{ width: "100px", fontWeight: "bold" }} /*className="w-[100px]"*/></TableCell>
        <TableCell style={{ width: "400px", fontWeight: "bold" }} /*className="w-[180px]"*/></TableCell>
        <TableCell style={{ width: "200px", fontWeight: "bold" }} /*className="w-[140px]"*/></TableCell>
        <TableCell style={{ width: "400px", fontWeight: "bold" }} align="right" /*className="w-[140px]"*/>
        {renderValue(total)}
        </TableCell>
        <TableCell style={{ width: "50px", fontWeight: "bold" }}>{!open ? <IoChevronDown /> : <IoChevronUp />}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0,paddingLeft: 5,paddingRight:5 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {
                  row.map((item,index)=>{
                    return(
                      <TableRow key={index}>
                        <TableCell style={{ width: "600px" }} /*className="w-[250px]"*/>{item.utilityContract}</TableCell>
                        <TableCell style={{ width: "100px" }} /*className="w-[100px]"*/>{item.utility}</TableCell>
                        <TableCell style={{ width: "400px" }} /*className="w-[180px]"*/>{item.periodStart+"-"+item.periodEnd}</TableCell>
                        <TableCell style={{ width: "200px",alignItems: "center" }} align="center"/*className="w-[140px]"*/>
                        <div className="flex justify-center">
                        <div className={getStyle(item.type,item.prodUGTGroup)}>
                          {item.type == "Y"?"Inventory":"Actual"}
                        </div>
                        </div>
                        </TableCell>
                        <TableCell style={{ width: "400px" }} align="right" /*className="w-[140px]"*/>
                        {renderValue(item.matched)}
                        </TableCell>
                        <TableCell style={{ width: "50px" }}></TableCell>
                      </TableRow>
                    )
                  })
                }
                {/*months.map((month, index) => {
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
                })*/}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowSettlement;

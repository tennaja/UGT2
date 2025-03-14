import React, { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

const MonthPicker = ({mindate = dayjs("2023/1/1"),maxdate = dayjs("2025/12/31"),value = dayjs(),setValue,isDisable = false}) => {
    //const [value, setValue] = useState(dayjs());
  //console.log(value)
  //console.log(mindate,maxdate)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <DatePicker
            views={["year", "month"]}
            //label="Select Month/Year"
            minDate={mindate}
            maxDate={maxdate}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            format="MM/YYYY" // ⭐️ กำหนดให้แสดงเดือนเป็นตัวเลข
            disabled = {isDisable} // ❌ ปิดการใช้งานทั้งหมด
            slotProps={{
                textField: {
                  inputProps: { readOnly: true }, // 🔹 ปิดการพิมพ์ในช่อง input
                  error:false,
                  sx: {
                    "& .MuiInputBase-root": {
                      height: "40px", // ปรับความสูงของ input field
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#fff"
                    },
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      borderRadius: "5px",
                      overflow: "hidden"
                    },
                    "& input": {
                      padding: "10px 14px", // ปรับ padding ภายในให้เหมาะสม
                      backgroundColor: "#fff",
                      
                    },
                  },
                },
              }}
          />
        </div>
      </LocalizationProvider>
    );
  };
  
  export default MonthPicker;
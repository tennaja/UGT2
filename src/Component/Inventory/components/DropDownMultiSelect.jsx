import React, { useState } from "react";
import { Dropdown, Button, Input, Space, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";

const DropdownMultiSelect = ({
  options = [],
  selectedValues = [],
  setSelectedValues,
  label = "Select Items",
  valueKey = "id",
  labelKey = "name",
  allowSelectAll = false, // ✅ อนุญาตให้เลือก "All Devices" หรือไม่
  setSelectDropdown,
  textSelectAll = "Select All",
  isNotsetSelectDrop = true,
}) => {
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelect = (item) => {
    const itemValue = item[valueKey];

    if (allowSelectAll && itemValue === "all") {
      // ถ้าเลือก "All Devices" → เลือกทั้งหมด ยกเว้น "all"
      if(isNotsetSelectDrop == true){
        setSelectDropdown(true);
      }
      
      setSelectedValues(
        selectedValues.length === options.length
          ? [] // ถ้าติ๊กอยู่ → เอาออกทั้งหมด
          : options.map((item) => item[valueKey]) // ใส่ค่าทุกตัว (ไม่มี "all")
      );
    } else {
      // กรณีเลือกหรือติ๊กออกบางตัว
      const newSelected = selectedValues.includes(itemValue)
        ? selectedValues.filter((val) => val !== itemValue) // เอาออก
        : [...selectedValues, itemValue]; // เพิ่มเข้าไป

      // ถ้าติ๊กครบทุกตัว → ติ๊ก "All Devices" ด้วย (แต่ไม่เก็บค่า "all")
      if (newSelected.length === options.length) {
        if(isNotsetSelectDrop == true){
            setSelectDropdown(true);
        }
        
        setSelectedValues(options.map((item) => item[valueKey]));
      } else {
        if(isNotsetSelectDrop == true){
            setSelectDropdown(true);
        }
        
        setSelectedValues(newSelected);
      }
    }
  };

  const menu = (
    <div
      style={{
        padding: 8,
        width: 300,
        maxHeight: 250, // ✅ กำหนดความสูงสูงสุด
        overflowY: "auto", // ✅ ให้แสดง scrollbar เมื่อเนื้อหาเกิน
      }}
      className="bg-[#fff] w-[300px] mt-2 rounded-[2px] shadow-xl"
    >
      <Input
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Space
        direction="vertical"
        style={{ display: "flex" }}
        className="mb-2 text-base font-semibold"
      >
        {allowSelectAll && (
          <div
            className="hover:bg-[#87BE33] hover:text-[#fff] w-full p-2 cursor-pointer rounded-[4px]"
            onClick={() =>
              handleSelect({ [valueKey]: "all", [labelKey]: "All Devices" })
            }
          >
            <Checkbox
              key="all"
              checked={selectedValues.length === options.length}
              onChange={() =>
                handleSelect({ [valueKey]: "all", [labelKey]: "All Devices" })
              }
            >
              {textSelectAll}
            </Checkbox>
          </div>
        )}
        {options
          .filter((item) =>
            item?.[labelKey]?.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((item) => (
            <div
              key={item?.[valueKey] || "unknown"}
              style={{
                borderRadius: "4px",
                transition: "background 0.2s ease-in-out",
              }}
              className="hover:bg-[#87BE33] hover:text-white cursor-pointer p-2"
            >
              <Checkbox
                checked={selectedValues.includes(item?.[valueKey])}
                onChange={() => handleSelect(item)}
                className="hover:text-[#fff]"
              >
                {item?.[labelKey] || "Unknown Item"}
              </Checkbox>
            </div>
          ))}
      </Space>
    </div>
  );

  return (
    <Dropdown
      menu={{ items: [] }}
      dropdownRender={() => menu} // ✅ ใช้ menu ที่แก้ไขแล้ว
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      className="hover:bg-[#fff] bg-[#fff] hover:text-[#000] h-[40px]"
    >
      <Button
        style={{
          textAlign: "left",
          backgroundColor: "#fff",
          border: "1px solid #d9d9d9" /* ✅ กำหนดให้ border เป็นสีเทา*/,
        }}
        className="w-full hover:text-[#000]"
      >
        <div className="flex justify-between hover:text-[#000]">
          <div className="text-base">
            {selectedValues.length === options.length
              ? "Selected All"
              : selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : label}
          </div>
          <div>
            <DownOutlined />
          </div>
        </div>
      </Button>
    </Dropdown>
  );
};

export default DropdownMultiSelect;

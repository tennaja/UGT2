import React, { useEffect, useState } from "react";
import { Table, ScrollArea, Modal } from "@mantine/core";
import { Form, Select } from "antd";
import numeral from "numeral";
import dayjs from "dayjs";
import DataTable from "../Control/Table/DataTable";

export default function ModalInventorySupplyUsage({
  inventorySupplyUsageData,
  openModalSupplyUsage,
  setOpenModalSupplyUsage,
}) {
  const columns = [
    {
      id: "deviceName",
      label: "Device Name",
      align: "left",
    },
    {
      id: "matched",
      label: "Matched (kWh)",
      align: "right",
      render: (row) => (
        <span className="text-right">
          {numeral(row.matched).format("0,0.000")}
        </span>
      ),
    },
    {
      id: "periodOfProductionStartDate",
      label: "Period Start",
      align: "center",
      render: (row) => (
        <span className="text-center">
          {dayjs(row.periodOfProductionStartDate).format("D MMM YYYY")}{" "}
        </span>
      ),
    },
    {
      id: "periodOfProductionEndDate",
      label: "Period End",
      align: "center",
      render: (row) => (
        <span className="text-center">
          {dayjs(row.periodOfProductionEndDate).format("D MMM YYYY")}{" "}
        </span>
      ),
    },
    // Add more columns as needed
  ];

  return (
    <Modal
      size="xl"
      opened={openModalSupplyUsage}
      onClose={() => setOpenModalSupplyUsage(!openModalSupplyUsage)}
      withCloseButton={false}
      centered
    >
      <div className="flex flex-col p-3">
        <div className="text-md font-bold text-[#4D6A00]">
          UGT1 Inventory Supply Usage
        </div>

        <div className="my-4">
          <DataTable
            data={inventorySupplyUsageData?.data}
            columns={columns}
            searchData={""}
            checkbox={false}
            isTotal={"Total Supply"}
          />
        </div>

        <div className="text-center">
          <button
            onClick={() => setOpenModalSupplyUsage(!openModalSupplyUsage)}
            className="w-25 rounded shadow-sm px-4 py-2 text-base font-semibold bg-[#78829D] text-white sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

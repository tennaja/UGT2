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
          {numeral(row.matched).format("0,0.00")}
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

          {/* <div className="text-xs font-semibold pr-3">Sort By</div>
          <Form>
            <Select
              size="small"
              defaultValue="Device Name"
              variant="borderless"
              style={{ width: "200px" }}
              // onChange={(value) => handleChangeGenerationSortBy(value)}
            >
              <Select.Option value="deviceName">Device Name</Select.Option>
              <Select.Option value="matched">Matched</Select.Option>
              <Select.Option value="period">Period of Production</Select.Option>
            </Select>
          </Form> */}
        </div>

        {/* <ScrollArea w="100%" h={400}>
        <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="text-center">#</Table.Th>
                <Table.Th className="text-left">Device Name</Table.Th>
                <Table.Th className="text-right">Matched (kWh)</Table.Th>
                <Table.Th className="text-center">
                  Period of Production
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {inventorySupplyUsageData?.data?.length > 0 ? (
                inventorySupplyUsageData?.data?.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="text-center">{index + 1}</Table.Td>
                    <Table.Td className="text-left">{row.deviceName}</Table.Td>
                    <Table.Td className="text-right">
                      {numeral(row.matched).format("0,0.00")}
                    </Table.Td>
                    <Table.Td className="text-left">
                      {dayjs(row.periodOfProductionStartDate).format(
                        "D MMM YYYY"
                      )}{" "}
                      -{" "}
                      {dayjs(row.periodOfProductionEndDate).format(
                        "D MMM YYYY"
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4} className="text-center">
                    {" "}
                    No data found
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody> 

         {inventorySupplyUsageData?.data?.length > 0 && (
              <Table.Tfoot>
                <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                  <Table.Th className="text-center" colspan="2">
                    Total Supply
                  </Table.Th>
                  <Table.Th className="text-right">
                    {numeral(inventorySupplyUsageData.totalMatched).format(
                      "0,0.00"
                    )}
                  </Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Tfoot>
            )} 
        </Table>
         </ScrollArea> */}

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

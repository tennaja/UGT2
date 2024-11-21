import React, { useEffect, useState } from "react";
import { Table, ScrollArea, Modal } from "@mantine/core";
import { Form, Select } from "antd";
import dayjs from "dayjs";
import numeral from "numeral";
import DataTable from "../Control/Table/DataTable";

export default function ModalRemainingEnergyAttribute({
  remainingEnergyAttributeData,
  openModalRemainingEnergyAttribute,
  setOpenModalRemainingEnergyAttribute,
}) {
  const columns = [
    {
      id: "deviceName",
      label: "Device Name",
      align: "left",
    },
    {
      id: "remainingEnergyAttribute",
      label: "Remaining Energy Attribute (kWh)",
      align: "right",
      render: (row) => (
        <span className="text-right">
          {numeral(row.remainingEnergyAttribute).format("0,0.000")}
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
      opened={openModalRemainingEnergyAttribute}
      onClose={() =>
        setOpenModalRemainingEnergyAttribute(!openModalRemainingEnergyAttribute)
      }
      withCloseButton={false}
      centered
    >
      <div className="flex flex-col p-3">
        <div className="text-md font-bold text-[#4D6A00]">
          Remaining Energy Attribute
        </div>

        <div className="my-4">
          <DataTable
            data={remainingEnergyAttributeData?.data}
            columns={columns}
            searchData={""}
            checkbox={false}
            isTotal={"Total Remaining"}
          />

          {/* <div className="text-xs font-semibold pr-3">Sort By</div>
          <Form>
            <Select
              size="small"
              defaultValue="Device Name"
              // onChange={(value) => handleChangeGenerationSortBy(value)}
            >
              <Select.Option value="deviceName">Device Name</Select.Option>
              <Select.Option value="matched">
                Remaining Energy Attribute
              </Select.Option>
              <Select.Option value="period">Period of Production</Select.Option>
            </Select>
          </Form> */}
        </div>

        {/* <ScrollArea w="100%" h={500}> 
         <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="text-center">#</Table.Th>
                <Table.Th className="text-left">Device Name</Table.Th>
                <Table.Th className="text-right">
                  Remaining Energy <div>Attribute (kWh)</div>
                </Table.Th>
                <Table.Th className="text-center">
                  Period of Production
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {remainingEnergyAttributeData?.data?.length > 0 ? (
                remainingEnergyAttributeData?.data.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="text-center">{index + 1}</Table.Td>
                    <Table.Td className="text-left">{row.deviceName}</Table.Td>
                    <Table.Td className="text-right">
                      {numeral(row.remainingEnergyAttribute).format("0,0.00")}
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
                    No data found
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>

            {remainingEnergyAttributeData?.data?.length > 0 && (
              <Table.Tfoot>
                <Table.Tr style={{ backgroundColor: "#F4F6F9" }}>
                  <Table.Th className="text-center" colspan="2">
                    Total Remaining
                  </Table.Th>
                  <Table.Th className="text-right">
                    {numeral(
                      remainingEnergyAttributeData.totalRemaining
                    ).format("0,0.00")}
                  </Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Tfoot>
            )}
          </Table> 
        </ScrollArea> */}

        <div className="text-center">
          <button
            onClick={() =>
              setOpenModalRemainingEnergyAttribute(
                !openModalRemainingEnergyAttribute
              )
            }
            className="w-25 rounded shadow-sm px-4 py-2 text-base font-semibold bg-[#78829D] text-white sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

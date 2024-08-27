"use client";
import {
  BriefcaseIcon,
  ChartPieIcon,
  ClockIcon,
  DocumentTextIcon,
  EllipsisHorizontalCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Card, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Table } from "@mantine/core";

import React from "react";
import numeral from "numeral";
import dayjs from "dayjs";
import { Select } from "antd";

export default function ItemInfo({ data, color = "#d8d5d5" }) {
  const [opened, { open, close }] = useDisclosure(false);

  const RenderIcon = () => {
    switch ((data?.title ?? "").toLowerCase()) {
      case "total portfolios":
        return (
          <div
            className={`flex rounded-large w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[50px] xl:h-[50px] justify-center items-center p-1 bg-[#87BE33] text-white`}
          >
            <ChartPieIcon className="w-[50px] h-[50px]" />
          </div>
        );
      case "total issued recs":
        return (
          <div
            className={`flex rounded-large w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[50px] xl:h-[50px] justify-center items-center p-1 bg-[#33BFBF] text-white`}
          >
            <DocumentTextIcon className="w-[50px] h-[50px]" />
          </div>
        );
      case "unissued attribute":
        return (
          <div
            className={`flex rounded-large w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[50px] xl:h-[50px] justify-center items-center p-1 bg-[${color}] text-white`}
          >
            <ClockIcon className="w-[50px] h-[50px]" />
          </div>
        );
      case "remaining energy attribute":
        return (
          <div
            className={`flex rounded-large w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[50px] xl:h-[50px] justify-center items-center p-1 bg-[#F7A042] text-white`}
          >
            <BriefcaseIcon className="w-[50px] h-[50px]" />
          </div>
        );
      default:
        return (
          <div
            className={`flex rounded-large w-[40px] h-[40px] lg:w-[45px] lg:h-[45px] xl:w-[50px] xl:h-[50px] justify-center items-center p-1 bg-[${color}] text-white`}
          >
            <EllipsisHorizontalCircleIcon className="w-[50px] h-[50px]" />
          </div>
        );
    }
  };
  return (
    <Card shadow="md" radius="lg" className="flex" padding="lg">
      {/* <div className="grid rounded bg-white p-3 shadow-default"> */}
      <div className="flex flex-col text-left ">
        <div className="flex justify-between">
          <RenderIcon />
          <div className="flex flex-col text-right justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-sm lg:text-lg xl:text-xl break-all">
                {data?.unit?.toLowerCase() == "recs" ||
                data?.unit?.toLowerCase() == "mwh"
                  ? numeral(data?.value).format("0,0.000000")
                  : numeral(data?.value).format("0,0")}
              </span>
              <span className=" text-gray-500">{data?.unit}</span>
            </div>
          </div>
        </div>

        <span className="font-bold mt-3">{data?.title}</span>
        <span className="text-xs text-gray-500">{data?.description}</span>
      </div>
      <div className="flex flex-col text-right justify-between">
        {data?.title.toLowerCase() == "remaining energy attribute" && (
          <div className="flex justify-end items-end">
            <EyeIcon className="w-6 h-6" onClick={open} />
          </div>
        )}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        centered
        size={"xl"}
        overlayProps={{
          color: "#000",
          backgroundOpacity: 0.2,
        }}
      >
        <div className="flex flex-col gap-4 p-5">
          <div className="flex gap-2 items-center">
            <div className="text-xs font-semibold pr-3">Sort By</div>

            <Select
              defaultValue="Device Name"
              className="w-60"
              onChange={(value) => console.log(value)}
            >
              <Select.Option value="deviceName">Device Name</Select.Option>
              <Select.Option value="energy">
                Remaining Energy Attribute
              </Select.Option>
              <Select.Option value="period">Period of Production</Select.Option>
            </Select>
          </div>
          <span className="font-bold text-[#4D6A00]">{data?.title}</span>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Device Name</Table.Th>
                <Table.Th className="text-right">
                  Remaining Energy Attribute (kWh)
                </Table.Th>
                <Table.Th className="text-center">
                  Period of Production
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.dashboardDetail?.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{item?.deviceName}</Table.Td>
                  <Table.Td className="text-right">
                    {numeral(item?.remainingEnergyAttribute).format("0,0.[00]")}
                  </Table.Td>
                  <Table.Td className="text-center">
                    {dayjs(item?.periodOfProduction).format("MMMM YYYY")}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Modal>
      {/* </div> */}
    </Card>
  );
}

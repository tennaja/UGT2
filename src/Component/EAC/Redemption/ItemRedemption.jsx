import React, { useState } from "react";
import { Button, Card, Input, ScrollArea, Table, Modal } from "@mantine/core";
import numeral from "numeral";
import AlmostDone from "../../assets/done.png";
import ModalFail from "../../Control/Modal/ModalFail";
import { useLocation, useNavigate } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import * as WEB_URL from "../../../Constants/WebURL";
import { FaChevronRight } from "react-icons/fa6";
import dayjs from "dayjs";

const ItemRedemption = ({ redemptionData }) => {
  const navigate = useNavigate();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [showModalFail, setShowModalFail] = useState(false);
  const [itemRedemptionSelected, setItemRedemptionSelected] = useState({});
  const [confirmChecked, setConfirmChecked] = useState(false);

  const handleConfrimTransfer = () => {
    setOpenModalConfirm(false);

    // To do.
    // 1. call api transfer
    const resonse = { statusCode: 200 };
    if (resonse.statusCode === 200) {
      setShowModalComplete(true);

      setTimeout(() => {
        // To do.
        // 1.call api fetch data again which status will be changed to Completed
        // 2.close modal automatically
        setShowModalComplete(false);
        console.log("close modal complete");
      }, 2000);
    } else {
      setShowModalFail(true);
    }

    setConfirmChecked(false);
  };

  const handleCloseFailModal = () => {
    setShowModalFail(false);
  };

  return (
    <>
      {redemptionData?.map((item, index) => {
        return (
          <Card
            key={index}
            shadow="md"
            radius="lg"
            className="flex mt-10 text-left"
            padding="xl"
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Subscriber Name
                </div>
                <div className="text-sm font-semibold">
                  {item.subscriberName}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Beneficiary
                </div>
                <div className="text-sm font-semibold">{item.beneficiary}</div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Source Account (Trade Account)
                </div>
                <div className="text-sm font-semibold">
                  {item.sourceAccount}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Assigned Utility
                </div>
                <div className="text-sm font-semibold">
                  {item.assignedUtility}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Destination Account (Redemption Account)
                </div>
                <div className="text-sm font-semibold">
                  {item.destinationAccount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Settlement Year
                </div>
                <div className="text-sm font-semibold">
                  {item.settlementPeriod}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Total Consumption
                </div>
                <div className="text-sm font-semibold">
                  {numeral(item.totalConsumption).format("0,000.000")} kWh
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Reporting Period
                </div>
                <div className="text-sm font-semibold">
                  {dayjs(item.reportingStart).format("DD/MM/YYYY")} to{" "}
                  {dayjs(item.reportingEnd).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Total RECs
                </div>
                <div className="text-sm font-semibold">
                  {numeral(item.totalRecs).format("0,000.000000")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Redemption Purpose
                </div>
                <div className="text-sm font-semibold">
                  {item.redemptionPurpose}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  (% Match)
                </div>
                <div className="text-sm font-semibold">
                  {item.matchedPercentage}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">Note</div>
                <div className="text-sm font-semibold">
                  <Input
                    size="md"
                    value={""}
                    // onChange={(event) => setValue(event.currentTarget.value)}
                  />
                </div>
              </div>
            </div>

            <ScrollArea w="100%" h={500} className="mt-10">
              <Table stickyHeader verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr className="text-[#848789]">
                    <Table.Th>Period</Table.Th>
                    <Table.Th>Device Name</Table.Th>
                    <Table.Th className="text-right">Volume (MWh)</Table.Th>
                    <Table.Th className="text-center">Status</Table.Th>
                    <Table.Th>Redemption Statement</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {item?.devices?.map((row, index) => (
                    <Table.Tr
                      key={index}
                      className="text-[#071437] font-semibold"
                    >
                      <Table.Td>{row.period}</Table.Td>
                      <Table.Td>{row.deviceName}</Table.Td>
                      <Table.Td className="text-right">
                        {numeral(row?.volume).format("0,000.000000")}
                      </Table.Td>
                      <Table.Td className="text-center capitalize">
                        {row.status}
                      </Table.Td>
                      <Table.Td>{row.statement}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            {/* sticky footer */}
            <Table>
              <Table.Thead>
                <Table.Tr className="bg-[#F4F6F9]">
                  <Table.Th style={{ width: "30%" }} className="text-center">
                    Total
                  </Table.Th>
                  <Table.Th style={{ width: "30%" }} className="text-right">
                    {numeral(item.totalRecs).format("0,000.000000")}
                  </Table.Th>
                  <Table.Th colSpan={4} className="text-right">
                    <Button
                      className="bg-[#87BE33] text-white px-8"
                      onClick={() => {
                        setItemRedemptionSelected(item);
                        setOpenModalConfirm(!openModalConfirm);
                      }}
                    >
                      Redeem
                    </Button>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
            </Table>
          </Card>
        );
      })}
    
      <Modal
        size={"lg"}
        opened={openModalConfirm}
        onClose={() => setOpenModalConfirm(!openModalConfirm)}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <div className="flex flex-col px-10 p-5">
          <div className="text-2xl font-bold text-center">
            Submit Redemption
          </div>

          <div className="flex justify-center mt-5">
            <div className="grid grid-cols-3">
              <div>
                <div className="text-md font-bold">Source Account:</div>
                <div className="text-md font-normal">
                  {itemRedemptionSelected.sourceAccount}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <FaChevronRight size={30} color="#87BE33" />
              </div>
              <div>
                <div className="text-md font-bold">Destination Account: </div>
                <div className="text-md font-normal">
                  {itemRedemptionSelected.destinationAccount}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div>
              <span className="font-bold">Beneficiary : </span>
              <span>{itemRedemptionSelected.beneficiary}</span>
            </div>
            <div>
              <span className="font-bold">Reporting period : </span>
              <span>
                {dayjs(itemRedemptionSelected.reportingStart).format(
                  "DD/MM/YYYY"
                )}{" "}
                to{" "}
                {dayjs(itemRedemptionSelected.reportingEnd).format(
                  "DD/MM/YYYY"
                )}
              </span>
            </div>
            <div>
              <span className="font-bold">Redemption Purpose : </span>
              <span>{itemRedemptionSelected.redemptionPurpose}</span>
            </div>
            <div>
              <span className="font-bold">Settlement Year : </span>
              <span>{itemRedemptionSelected.settlementPeriod}</span>
            </div>
            <div>
              <span className="font-bold">Redeeming : </span>
              <span>
                {numeral(itemRedemptionSelected.totalRecs).format(
                  "0,000.000000"
                )}{" "}
                RECs
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <FormGroup>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    sx={{
                      [`&, &.${checkboxClasses.checked}`]: {
                        color: "#87BE33",
                      },
                    }}
                  />
                }
                label="I confirm the accuracy of the information."
                onChange={(e) => setConfirmChecked(e.target.checked)}
              />
            </FormGroup>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
              onClick={() => setOpenModalConfirm(!openModalConfirm)}
            >
              Close
            </Button>
            <Button
              className={`text-white mt-12 px-10 ${
                confirmChecked ? "bg-[#87BE33]" : "bg-[#87BE33]/[.5]"
              } `}
              onClick={() => handleConfrimTransfer()}
              disabled={!confirmChecked}
            >
              Submit Redemption
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={showModalComplete}
        onClose={() => setShowModalComplete(!showModalComplete)}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <div className="flex flex-col items-center justify-center px-10 pt-4 pb-3">
          <img
            className="w-32 object-cover rounded-full flex items-center justify-center"
            src={AlmostDone}
            alt="Current profile photo"
          />

          <div className="text-3xl font-bold text-center pt-2">
            Redemption Submitted!
          </div>
          <div className="flex gap-4">
            <Button
              className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
              onClick={() => setShowModalComplete(!showModalComplete)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {showModalFail && <ModalFail onClickOk={handleCloseFailModal} />}
    </>
  );
};

export default ItemRedemption;

import React, { useState, useEffect } from "react";
import { Button, Card, Input, ScrollArea, Table, Modal } from "@mantine/core";
import numeral from "numeral";
import AlmostDone from "../../assets/done.png";
import ModalFail from "../../../Component/Control/Modal/ModalFail";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createReservation } from "../../../Redux/EAC/Transfer/Action";
import dayjs from "dayjs";
import StatusLabel from "../../Control/StatusLabel";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const ItemTransfer = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    transferData,
    setTransferData,
    ugtGroupId,
    portfolioID,
    portfolioName,
    period,
    year,
    month,
  } = props;

  const [selectedItemTransfer, setSelectedItemTransfer] = useState({});
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [showModalFail, setShowModalFail] = useState(false);
  const [modalFailContent, setModalFailContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createReservationResponse = useSelector(
    (state) => state.transfer.createReservation
  );

  const handleClickTransfer = (item) => {
    setSelectedItemTransfer(item);
    setOpenModalConfirm(!openModalConfirm);
  };

  const handleConfirmTransfer = () => {
    setOpenModalConfirm(!openModalConfirm);
    setIsLoading(true);

    // call api create reservation
    const reservationData = {
      ugtGroupId: ugtGroupId,
      portfolioId: portfolioID,
      year: year,
      month: month,
      items: {
        transferRequestId: selectedItemTransfer.transferRequestId, //int
        items: [
          {
            sourceAccount: `/accounts/${selectedItemTransfer.sourceAccountCode}`, //UGT TRADE Account
            destinationAccount: `/accounts/${selectedItemTransfer.destinationAccountCode}`, //UGT EGAT TRADE
            volume: numeral(selectedItemTransfer.totalConsumption)
              .format("0.000000")
              .toString(), // ส่งไปเป็น kWh
            notes: selectedItemTransfer.note,
            status: "Draft",
          },
        ],
      },
      transactionNotes: "",
    };

    console.log("Reservation Data", reservationData);
    dispatch(createReservation(reservationData));
  };

  const handleCloseFailModal = () => {
    setShowModalFail(false);
  };

  useEffect(() => {
    if (isLoading) {
      if (createReservationResponse?.status == true) {
        setShowModalComplete(true);

        // กลับไปหน้า Info เพื่อ refresh ข้อมูลใหม่
        navigate("/eac/transfer/info", {
          state: {
            portfolioID: portfolioID,
            portfolioName: portfolioName,
            period: period,
          },
        });
      } else if (createReservationResponse?.status == false) {
        setModalFailContent(createReservationResponse?.message ?? null);
        setShowModalFail(true);
      }
    }
  }, [createReservationResponse]);

  return (
    <>
      {transferData?.map((item, index) => {
        return (
          <Card
            key={index}
            shadow="md"
            radius="lg"
            className="flex text-left"
            padding="xl"
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Source Account
                </div>
                <div className="text-sm font-semibold">
                  {item.sourceAccount}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Destination Account
                </div>
                <div className="text-sm font-semibold">
                  {item.destinationAccount}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div></div>
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
                  Settlement Period
                </div>
                <div className="text-sm font-semibold">
                  {dayjs(item.settlementPeriod).format("MMMM YYYY")}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Total Consumption
                </div>
                <div className="text-sm font-semibold">
                  {numeral(item.totalConsumption).format("0,000.00")} kWh
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  (% Match)
                </div>
                <div className="text-sm font-semibold">
                  {item.matchedPercentage}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Total RECs (MWh)
                </div>
                <div className="text-sm font-semibold">
                  {numeral(item.totalRecs / 1000).format("0,000.000000")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">Note</div>
                <div className="text-sm font-semibold">
                  <Input
                    size="md"
                    value={item.note}
                    onChange={(e) => {
                      let updatedItem = transferData.map((row) => {
                        if (
                          item.destinationAccountCode ===
                          row.destinationAccountCode
                        ) {
                          return { ...row, note: e.target.value };
                        } else {
                          return row;
                        }
                      });
                      setTransferData(updatedItem);
                    }}
                    disabled={item.status?.toLowerCase() == "completed"}
                  />
                </div>
              </div>
            </div>

            <ScrollArea w="100%" h={400} className="mt-10">
              <Table stickyHeader verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr className="text-[#848789]">
                    <Table.Th>Period</Table.Th>
                    <Table.Th>Device Name</Table.Th>
                    <Table.Th className="text-right">Volume (MWh)</Table.Th>
                    <Table.Th className="text-center">Status</Table.Th>
                    {/* <Table.Th>Remark</Table.Th> */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {item?.devices?.map((row, index) => (
                    <Table.Tr key={index} className="font-semibold">
                      <Table.Td style={{ width: "20%" }}>
                        {dayjs(row.period).format("MMMM YYYY")}
                      </Table.Td>
                      <Table.Td style={{ width: "30%" }}>
                        {row.deviceName}
                      </Table.Td>
                      <Table.Td style={{ width: "30%" }} className="text-right">
                        {numeral(row?.volume / 1000).format("0,000.000000")}
                      </Table.Td>
                      <Table.Td
                        style={{ width: "20%" }}
                        className="text-center"
                      >
                        <StatusLabel
                          status={row.status == "" ? "Pending" : row.status}
                          type="xs"
                        />
                      </Table.Td>
                      {/* <Table.Td>{row.remark ? row.remark : "-"}</Table.Td> */}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            {/* sticky footer */}
            <Table>
              <Table.Thead>
                <Table.Tr className="bg-[#F4F6F9]">
                  <Table.Th style={{ width: "50%" }} className="text-center">
                    Total
                  </Table.Th>
                  <Table.Th style={{ width: "30%" }} className="text-right">
                    {numeral(item.totalRecs / 1000).format("0,000.000000")}
                  </Table.Th>
                  <Table.Th style={{ width: "20%" }} className="text-center">
                    <Button
                      className={`text-white px-8 
                        ${
                          item?.status == "Completed"
                            ? "bg-[#E0E2EB] cursor-not-allowed"
                            : "bg-[#87BE33]"
                        }`}
                      onClick={() => handleClickTransfer(item)}
                      disabled={item?.status == "Completed"}
                    >
                      Transfer
                    </Button>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
            </Table>
          </Card>
        );
      })}

      <Modal
        opened={openModalConfirm}
        onClose={() => setOpenModalConfirm(!openModalConfirm)}
        withCloseButton={false}
        centered
        closeOnClickOutside={false}
      >
        <div className="flex flex-col items-center justify-center px-10 pt-5 pb-3">
          <div className="text-2xl font-bold">Transfer Issued REC</div>
          <div className="text-sm font-normal mt-8">
            Are you sure you wish to transfer issued RECs?
          </div>
          <div className="flex gap-4">
            <Button
              className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
              onClick={() => setOpenModalConfirm(!openModalConfirm)}
            >
              Close
            </Button>
            <Button
              className="text-white bg-[#87BE33] mt-12 px-10"
              onClick={() => handleConfirmTransfer()}
            >
              Yes, Transfer RECs
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
            Issued RECs Transfered!
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

      {showModalFail && (
        <ModalFail
          onClickOk={handleCloseFailModal}
          title="Oops!"
          content={modalFailContent}
        />
      )}
    </>
  );
};

export default ItemTransfer;

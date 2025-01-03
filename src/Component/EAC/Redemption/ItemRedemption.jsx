import React, { useState, useEffect } from "react";
import { Button, Card, Input, ScrollArea, Table, Modal, Textarea } from "@mantine/core";
import numeral from "numeral";
import AlmostDone from "../../assets/done.png";
import ModalFail from "../../Control/Modal/ModalFail";
import { useDispatch, useSelector } from "react-redux";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox, { checkboxClasses } from "@mui/material/Checkbox";
import { FaChevronRight } from "react-icons/fa6";
import dayjs from "dayjs";
import { USER_GROUP_ID } from "../../../Constants/Constants";
import StatusLabel from "../../Control/StatusLabel";
import { createReservationRedeem } from "../../../Redux/EAC/Redemption/Action";
import { DOWNLOAD_REDEMPTION_STATEMENT_URL } from "../../../Constants/ServiceURL";

const ItemRedemption = (props) => {
  const dispatch = useDispatch();
  const {
    redemptionData,
    setRedemptionData,
    ugtGroupId,
    portfolioID,
    year,
    fetchRedemptionRequestInfo,
  } = props;

  const userData = useSelector((state) => state.login.userobj);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [showModalFail, setShowModalFail] = useState(false);
  const [modalFailContent, setModalFailContent] = useState(null);
  const [itemRedemptionSelected, setItemRedemptionSelected] = useState({});
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createRedemptionResponse = useSelector(
    (state) => state.redeem.createReservationRedeem
  );

  const handleConfirmRedeem = () => {
    setOpenModalConfirm(!openModalConfirm);
    setIsLoading(true);

    // call api create reservation
    const reservationData = {
      ugtGroupId: ugtGroupId,
      portfolioId: portfolioID,
      year: year,
      items: {
        redemtionRequestpId: itemRedemptionSelected.redemtionRequestpId, //int
        items: [
          {
            sourceAccount: itemRedemptionSelected.sourceAccountCode,
            redemptionAccount: itemRedemptionSelected.destinationAccountCode,
            subscriberId: itemRedemptionSelected.subscriberId,
            beneficiary: itemRedemptionSelected?.beneficiaryUid,
            purpose: itemRedemptionSelected?.redemptionPurpose,
            periodStart: itemRedemptionSelected?.reportingStart,
            periodEnd: itemRedemptionSelected?.reportingEnd,
            volume: numeral(
              numeral(itemRedemptionSelected.totalRecs / 1000).format(
                "0.000000"
              ) * 1000
            )
              .format("0.000000")
              .toString(), // ส่งไปเป็น kWh
            notes: itemRedemptionSelected?.note,
            status: "Draft",
          },
        ],
      },
      redemptionNotes: "",
    };

    // console.log("reservationData", reservationData);
    dispatch(createReservationRedeem(reservationData));

    setConfirmChecked(false);
  };

  const handleCloseFailModal = () => {
    setShowModalFail(false);
  };

  useEffect(() => {
    if (isLoading) {
      console.log(createRedemptionResponse)
      if (createRedemptionResponse?.status == true) {
        setShowModalComplete(true);

        // กลับไปหน้า Info เพื่อ refresh ข้อมูลใหม่
        fetchRedemptionRequestInfo();
      } else if (createRedemptionResponse?.status == false) {
        setModalFailContent(createRedemptionResponse?.message ?? null);
        setShowModalFail(true);
      }
      else{
        setModalFailContent(createRedemptionResponse);
        setShowModalFail(true);
      }
    }
  }, [createRedemptionResponse]);

  const downloadStatement = async (transactionUid) => {
    const URL = `${DOWNLOAD_REDEMPTION_STATEMENT_URL}?transactionUid=${transactionUid}`;
    window.open(URL, "_blank");
  };

  console.log(redemptionData)

  return (
    <>
      {redemptionData?.map((item, index) => {
        // control action status
        let canSendRedeem = false;

        if (
          // check user group
          userData?.userGroup?.id == USER_GROUP_ID.MEA_CONTRACTOR_MNG ||
          userData?.userGroup?.id == USER_GROUP_ID.PEA_CONTRACTOR_MNG
        ) {
          canSendRedeem = false;
        } else {
          // check status
          if(userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY || 
            userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER
          ){
            canSendRedeem =
            item.status?.toLowerCase() == "completed" ? false : true;
          }
          else{
            canSendRedeem = false;
          }
          
        }

        // canSendRedeem = true; // for test only

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
                  {item.sourceAccountName}
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
                  Redemption Account Name
                </div>
                <div className="text-sm font-semibold">
                  {item.destinationAccountName}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">
                  Redemption Account Code
                </div>
                <div className="text-sm font-semibold">
                  {item.destinationAccountCode}
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
                  Total Load
                </div>
                <div className="text-sm font-semibold">
                  {numeral(item.totalConsumption).format("0,000.000")} kWh ({numeral(item.totalConsumption * 0.001).format("0,000.000000")} MWh)
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
                  {numeral(item.totalRecs / 1000).format("0,000.000000")}
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
                  % Matched
                </div>
                <div className="text-sm font-semibold">
                  {item.matchedPercentage}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2  gap-8 mt-3">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-normal text-[#91918A]">Note</div>
                <div>
                  {canSendRedeem ? (
                    <Textarea
                      size="md"
                      value={item.note}
                      rows={4}
                      onChange={(e) => {
                        let updatedItem = redemptionData.map((row) => {
                          if (item.beneficiaryUid === row.beneficiaryUid) {
                            return { ...row, note: e.target.value };
                          } else {
                            return row;
                          }
                        });
                        setRedemptionData(updatedItem);
                      }}
                    />
                  ) : (
                    <div className="text-sm font-semibold">
                      {item.note || "-"}
                    </div>
                  )}
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
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {item?.devices?.map((row, index) => (
                    <Table.Tr
                      key={index}
                      className="text-[#071437] font-semibold"
                    >
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
                        className="text-center capitalize"
                      >
                        <StatusLabel
                          status={row?.status || "Pending"}
                          type="xs"
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            {/* sticky footer */}
            <Table>
              <Table.Thead>
                <Table.Tr className="bg-[#F4F6F9]">
                  <Table.Th style={{ width: "40%" }} className="text-center">
                    Total
                  </Table.Th>
                  <Table.Th style={{ width: "40%" }} className="text-right">
                    {numeral(item.totalRecs / 1000).format("0,000.000000")}
                  </Table.Th>
                  <Table.Th style={{ width: "20%" }} className="text-right">
                    {canSendRedeem && (
                      <Button
                        className="bg-[#87BE33] text-white px-8"
                        onClick={() => {
                          setItemRedemptionSelected(item);
                          setOpenModalConfirm(!openModalConfirm);
                        }}
                      >
                        Redeem
                      </Button>
                    )}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
            </Table>
            {item?.transactionUid && (
              <div className="pt-3">
                <Button
                  className="text-[#4D6A00] underline"
                  onClick={() => downloadStatement(item?.transactionUid)}
                >
                  Download Redemption Statement
                </Button>
              </div>
            )}
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
                  {itemRedemptionSelected.sourceAccountName}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <FaChevronRight size={30} color="#87BE33" />
              </div>
              <div>
                <div className="text-md font-bold">Destination Account: </div>
                <div className="text-md font-normal">
                  {itemRedemptionSelected.destinationAccountName}
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
                {numeral(itemRedemptionSelected.totalRecs / 1000).format(
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
              onClick={() => handleConfirmRedeem()}
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

export default ItemRedemption;

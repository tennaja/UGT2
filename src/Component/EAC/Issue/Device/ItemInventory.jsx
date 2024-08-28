import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Card, Input, ScrollArea, Table, Modal } from "@mantine/core";
import numeral from "numeral";
import AlmostDone from "../../../assets/almostdone.png";
import Warning from "../../../assets/warning.png";
import ModalFail from "../../../Control/Modal/ModalFail";
import { useLocation, useNavigate } from "react-router-dom";
import * as WEB_URL from "../../../../Constants/WebURL";
import dayjs from "dayjs";

import { Checkbox, message, Upload } from "antd";

const { Dragger } = Upload;

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error(
      "You can only upload jpeg, jpg, png, svg, pdf, doc, xls, docx, xlsx, pptx, txt and csv file!"
    );
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error("File must smaller than 20MB!");
  }
  console.log("isJpgOrPng", isJpgOrPng);
  return isJpgOrPng && isLt2M;
};
const ItemInventory = ({ issueTransactionData, inventoryTransaction }) => {
  const navigate = useNavigate();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [showModalFail, setShowModalFail] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [note, setNote] = useState(inventoryTransaction?.note);
  const [totalProduction, setTotalProduction] = useState(0);
  const [isConfirmChecked, setIsConfirmChecked] = useState(false);

  const props = {
    name: "file",
    multiple: true,
    listType: "picture",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188", // รอใส่ URL Evident
    beforeUpload: beforeUpload,
    onChange(info) {
      const { status } = info.file;
      // console.log("file list", info.fileList);
      if (status !== "uploading") {
        console.log(status, info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        message.success(`${info.file.name} remove successfully.`);
        // const arrayWithoutRemoveFile = fileUploaded.filter(
        //   (item) => item.uid != info.file.uid
        // );
        // setFileUploaded(arrayWithoutRemoveFile);
      }
      if (status !== undefined) setFileUploaded(info.fileList);
    },
    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
    onRemove(file) {
      console.log("click remove", file);
      // CALL Evident to archived file
    },
  };
  const handleConfrimSubmitRequest = () => {
    setIsConfirmChecked(false); // กลับสถานะให้ confirm checkbox เป็นค่าเริ่มต้น
    setOpenModalConfirm(!openModalConfirm);

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
  };

  const handleCloseFailModal = () => {
    setShowModalFail(false);
  };
  const handleCheckboxChange = (e) => {
    setIsConfirmChecked(e.target.checked);
  };

  useEffect(() => {
    sumTotalProduction();
  }, []);

  useLayoutEffect(() => {
    prepareFileUploadData();
  }, []);

  async function sumTotalProduction() {
    let sumProduction = 0;
    for (const item of inventoryTransaction?.inventorySettlementDetail) {
      sumProduction += item.production;
    }
    setTotalProduction(sumProduction);
  }

  async function prepareFileUploadData() {
    const fileUploadedArray = [];
    for (const item of inventoryTransaction?.fileUploaded) {
      const fileObject = {
        uid: item.uid,
        name: item.fileName,
        status: "done",
        url: `https://api.sandbox.evident.dev/files/${item.uid}/download`,
      };
      fileUploadedArray.push(fileObject);
    }
    setFileUploaded(fileUploadedArray);
  }

  return (
    <>
      <Table stickyHeader verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr className="text-[#848789]">
            <Table.Th className="text-center w-48 ">Period</Table.Th>
            <Table.Th className="text-center w-64 ">
              Recipient Account (Trade Account)
            </Table.Th>
            <Table.Th className="text-center w-64 ">
              Allocation Account
            </Table.Th>
            <Table.Th className="text-right min-w-64 max-w-full">
              Production (MWh)
            </Table.Th>
            <Table.Th className="text-center w-32 ">Start Date</Table.Th>
            <Table.Th className="text-center w-32 ">End Date</Table.Th>
            <Table.Th className="text-center w-32 ">Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {inventoryTransaction?.inventorySettlementDetail?.map(
            (row, index) => (
              <Table.Tr key={index} className="text-[#071437] font-semibold">
                {index == 0 && (
                  <Table.Td
                    rowSpan={
                      inventoryTransaction?.inventorySettlementDetail.length
                    }
                    className="text-center align-top w-48 "
                  >
                    {dayjs(
                      `${inventoryTransaction.year}-${inventoryTransaction.month}`
                    ).format("MMM-YY")}
                  </Table.Td>
                )}

                <Table.Td className="text-center w-64 ">
                  {row.tradeAccount}
                </Table.Td>
                <Table.Td className="text-center w-64">
                  {row.allocationAccount}
                </Table.Td>
                <Table.Td className="text-right min-w-64 max-w-full">
                  {numeral(row?.production).format("0,000.000000")}
                </Table.Td>
                <Table.Td className="text-center w-32  capitalize">
                  {dayjs(row.startDate).format("DD/MM/YYYY")}
                </Table.Td>
                <Table.Td className="text-center w-32  capitalize">
                  {dayjs(row.endDate).format("DD/MM/YYYY")}
                </Table.Td>
                <Table.Td className="text-center w-32">{row.status}</Table.Td>
              </Table.Tr>
            )
          )}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr className="border-t border-slate-200">
            <Table.Th className="text-center w-48">Total</Table.Th>
            <Table.Th className="text-center w-64"></Table.Th>
            <Table.Th className="text-center w-64"></Table.Th>
            <Table.Th className="text-right min-w-64 max-w-full">
              {numeral(numeral(totalProduction).value()).format("0,0.000000")}
            </Table.Th>
            <Table.Th className="text-center w-32"></Table.Th>
            <Table.Th className="text-center w-32"></Table.Th>
            <Table.Th className="text-center w-32"></Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
      <div className="flex justify-between pt-3">
        <div className="flex gap-2">
          <Button
            className="bg-[#F5F4E9] text-[#4D6A00] px-8"
            onClick={() => setOpenModalUpload(!openModalUpload)}
          >
            Upload Files
          </Button>
          {fileUploaded.length > 0 && (
            <Button
              className="text-[#4D6A00] underline px-8"
              onClick={() => setOpenModalUpload(!openModalUpload)}
            >
              {fileUploaded.length == 1
                ? `${fileUploaded.length} File Uploaded`
                : `${fileUploaded.length} Files Uploaded`}
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex  items-center gap-2">
            <div className="text-sm font-normal text-[#91918A]">Note</div>
            <div className="text-sm">
              <Input
                size="md"
                value={note}
                onChange={(event) => setNote(event.currentTarget.value)}
              />
            </div>
          </div>
          <Button
            className="bg-[#87BE33] text-white px-8"
            onClick={() => setOpenModalConfirm(!openModalConfirm)}
          >
            Send
          </Button>
        </div>
      </div>

      <Modal
        opened={openModalConfirm}
        onClose={() => setOpenModalConfirm(!openModalConfirm)}
        withCloseButton={false}
        centered
        size={"lg"}
        closeOnClickOutside={false}
      >
        <div className="flex flex-col items-center justify-center px-10 pt-5 pb-3">
          {fileUploaded.length > 0 ? (
            <>
              <div className="text-2xl font-bold">Submit Issue Request</div>
            </>
          ) : (
            <>
              <img
                className="w-16 object-cover rounded-full flex items-center justify-center mb-3"
                src={Warning}
                alt="Current profile photo"
              />
              <div className="text-2xl text-center font-bold">
                This issue request has no active files attached to it.
              </div>
            </>
          )}
          <div className="text-sm font-normal my-8">
            Are you sure you wish to submit issue request?
          </div>
          <Checkbox checked={isConfirmChecked} onChange={handleCheckboxChange}>
            I confirm all the required information is completed and the
            necessary supporting information and file are attached{" "}
            <span className="text-red-400">*</span>
          </Checkbox>
          <div className="flex gap-4">
            <Button
              className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10"
              onClick={() => setOpenModalConfirm(!openModalConfirm)}
            >
              Close
            </Button>
            {isConfirmChecked ? (
              <Button
                className="text-white bg-PRIMARY_BUTTON mt-12 px-10"
                onClick={() => handleConfrimSubmitRequest()}
              >
                Yes, Submit Request
              </Button>
            ) : (
              <Button
                className="text-[#69696A] bg-[#E6EAEE] mt-12 px-10 "
                disabled
              >
                Yes, Submit Request
              </Button>
            )}
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

      <Modal
        opened={openModalUpload}
        onClose={() => setOpenModalUpload(!openModalUpload)}
        withCloseButton={false}
        centered
        size={"lg"}
        closeOnClickOutside={false}
      >
        <div className="flex flex-col   px-10 py-3">
          <div className="text-2xl mb-3 font-bold text-left text-BREAD_CRUMB">
            Documents Upload
          </div>
          <Dragger {...props} fileList={fileUploaded}>
            <p className="ant-upload-drag-icon"></p>
            <p className="ant-upload-text">
              Drop files here or click to upload.
            </p>
            <p className="ant-upload-hint">
              Acceptable formats : jpeg, jpg, png, svg, pdf, doc, .xls, .docx,
              .xlsx, .pptx, .txt, .csv Each file can be a maximum of 20MB.
            </p>
          </Dragger>
          <div className="flex justify-center">
            <Button
              className="text-white w-64 text-center bg-PRIMARY_BUTTON mt-12 px-10"
              onClick={() => setOpenModalUpload(!openModalUpload)}
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>

      {showModalFail && <ModalFail onClickOk={handleCloseFailModal} />}
    </>
  );
};

export default ItemInventory;

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Card, Input, ScrollArea, Table, Modal } from "@mantine/core";
import numeral from "numeral";
import AlmostDone from "../../../assets/done.png";
import Warning from "../../../assets/warning.png";
import ModalFail from "../../../../Component/Control/Modal/ModalFail";
import { useLocation, useNavigate } from "react-router-dom";
import * as WEB_URL from "../../../../Constants/WebURL";
import dayjs from "dayjs";
import classNames from "classnames";
import { Checkbox, message, Upload } from "antd";
import {
  EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL,
  EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL_FILE,
  EAC_ISSUE_REQUEST_DELETE_FILE,
  EAC_ISSUE_REQUEST_DOWNLOAD_FILE,
} from "../../../../Constants/ServiceURL";
import axios from "axios";
import { saveAs } from "file-saver";
import { showLoading, hideLoading } from "../../../../Utils/Utils";
import { Trash2 } from "lucide-react";
import StatusLabel from "../../../Control/StatusLabel";

const { Dragger } = Upload;

const beforeUpload = (file) => {
  const isValidFile =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/svg+xml" ||
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.type === "text/plain" ||
    file.type === "text/csv";
  if (!isValidFile) {
    message.error(
      "You can only upload jpeg, jpg, png, svg, pdf, doc, xls, docx, xlsx, pptx, txt and csv file!"
    );
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error("File must smaller than 20MB!");
  }
  return isValidFile && isLt2M;
};

const ItemIssue = ({
  issueTransactionData,
  issueRequest,
  getIssueTransaction,
}) => {
  const navigate = useNavigate();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [showModalFail, setShowModalFail] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [note, setNote] = useState(issueRequest?.note ?? "");
  const [totalProduction, setTotalProduction] = useState(0);
  const [isConfirmChecked, setIsConfirmChecked] = useState(false);

  const issueRequestDetailId = issueRequest?.issueRequestDetailId;

  let issueRequestStatus =
    issueTransactionData?.issueRequestDetail?.status ?? "";

  if (issueRequestStatus === "") {
    issueRequestStatus = "Pending";
  } else if (issueRequestStatus.toLowerCase() === "draft") {
    issueRequestStatus = "Draft";
  } else if (
    issueRequestStatus.toLowerCase() === "in progress" ||
    issueRequestStatus.toLowerCase() === "submitted"
  ) {
    issueRequestStatus = "In Progress";
  } else if (issueRequestStatus.toLowerCase() === "completed") {
    issueRequestStatus = "Issued";
  }

  let canSendIssue = false;
  let canUpload = false;

  if (
    issueRequestStatus?.toLowerCase() === "in progress" ||
    issueRequestStatus?.toLowerCase() === "withdraw" ||
    issueRequestStatus?.toLowerCase() === "withdrawn" ||
    issueRequestStatus?.toLowerCase() === "completed" ||
    issueRequestStatus?.toLowerCase() === "issued"
  ) {
    canSendIssue = false;
    canUpload = false;
  } else {
    canSendIssue = true;
    canUpload = true;
  }

  const props = {
    multiple: true,
    // listType: "picture",
    beforeUpload: beforeUpload,
    customRequest: uploadToEvident,
    onDownload: (file) => {
      console.log("file", file);
    },
    onPreview: previewFile,
    onRemove: removeFile,

    /* iconRender(file, listType) {
      console.log("listType", listType);
      return (
        <>
          <span>{file.name}</span>
        </>
      );
    }, */
    // itemRender: (originNode, file, fileList, { download, preview, remove }) => {
    //   return (
    //     <div className="flex justify-between">
    //       <div className="">{file.name}</div>
    //       <Trash2 color="#F1533B" />
    //     </div>
    //   );
    // },
    onChange(info) {
      const { status } = info.file;
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
  };

  async function uploadToEvident(options) {
    const { file, onSuccess, onError } = options;
    const params = new FormData();
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    let fileName = file.name?.replace(/\.[^/.]+$/, "");
    params.append("issueRequestDetailId", issueRequestDetailId);
    params.append("file", file);
    params.append("name", fileName);
    params.append("notes", "");
    try {
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL_FILE}`,
        params,
        config
      );
      onSuccess("Ok");
      // เรียกข้อมูล issue ใหม่ เพื่อให้มี File List
      getIssueTransaction();
    } catch (err) {
      console.log("Error: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  }

  async function previewFile(file) {
    try {
      showLoading();
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_DOWNLOAD_FILE}?fileUid=${file.uid}`,
        {},
        { responseType: "blob" } // Important: indicate that the response type is a Blob
      );

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      saveAs(blob, file.name);
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  }
  console.log(issueRequest)
  async function removeFile(file) {
    try {
      showLoading();
      const res = await axios.delete(
        `${EAC_ISSUE_REQUEST_DELETE_FILE}?fileUid=${file.uid}`
      );
      console.log("res", res);
      getIssueTransaction();
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      hideLoading();
    }
  }
  const handleConfrimSubmitRequest = async () => {
    setIsConfirmChecked(false); // กลับสถานะให้ confirm checkbox เป็นค่าเริ่มต้น
    setOpenModalConfirm(!openModalConfirm);

    // To do.
    // 1. call api issue request

    console.log("fileUploaded", fileUploaded);
    // get file uid from array of object fileUploaded
    const fileUidArray = issueRequest.fileUploaded.map(
      (item) => `/files/${item.uid}`
    );

    const paramsDraft = {
      issueRequestDetailId: issueRequestDetailId,
      issueUid: `/issues/${issueTransactionData.issueRequestUid}`,
      startDate: dayjs(issueRequest.startDate).format(
        "YYYY-MM-DDTHH:mm:ss[+00:00]"
      ),
      endDate: dayjs(issueRequest.endDate).format(
        "YYYY-MM-DDTHH:mm:ss[+00:00]"
      ),
      productionVolume: numeral(totalProduction).format("0.000000"),
      fuel: `/fuels/${issueTransactionData.fuelCode}`,
      recipientAccount: `/accounts/${issueRequest.tradeAccountCode}`,
      status: `Draft`,
      notes: note,
      issuerNotes: note,
      files: fileUidArray,
    };

    console.log("paramsDraft", paramsDraft);
    // showSwal();
    showLoading();
    const responseDraft = await createIssueDetail(paramsDraft);

    if (responseDraft?.status === 200) {
      // เรียก createIssueDetail อีกครั้งแต่ส่ง status: `Submitted`

      hideLoading();
      setShowModalComplete(true);

      setTimeout(() => {
        // To do.
        // 1.call api fetch data again which status will be changed to Completed
        getIssueTransaction();
        // 2.close modal automatically
        setShowModalComplete(false);

        console.log("close modal complete");
      }, 2000);
    } else {
      console.log("responseDraft", responseDraft);
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
    if (issueRequest?.settlementDetail) sumTotalProduction();
  }, [issueRequest]);
  useLayoutEffect(() => {
    if (issueRequest?.settlementDetail) prepareFileUploadData();
  }, [issueRequest]);

  async function sumTotalProduction() {
    let sumProduction = 0;
    for (const item of issueRequest.settlementDetail) {
      sumProduction += item.production;
    }

    setTotalProduction(sumProduction / 1000);
  }
  async function prepareFileUploadData() {
    const fileUploadedArray = [];
    for (const item of issueRequest.fileUploaded) {
      const fileObject = {
        uid: item.uid,
        name: item.fileName,
        status: "done",
        // url: `https://api.sandbox.evident.dev/files/${item.uid}/download`, // รอเปลี่ยนเป็น API ของ Backend ที่ใช้สำหรับโหลดไฟล์
        url: `${EAC_ISSUE_REQUEST_DOWNLOAD_FILE}`,
      };
      fileUploadedArray.push(fileObject);
    }
    setFileUploaded(fileUploadedArray);
  }

  async function createIssueDetail(params) {
    try {
      const res = await axios.post(
        `${EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL}`,
        params
      );
      // return response result
      return res;
    } catch (error) {
      return error;
    }
  }

  // const StatusIcon = ({ status }) => {
  //   let color;

  //   switch (status?.toLowerCase()) {
  //     case "pending":
  //       color = STATUS_COLOR.PENDING;
  //       break;
  //     case "complete":
  //       color = STATUS_COLOR.COMPLETE;
  //       break;
  //     case "in progress":
  //       color = STATUS_COLOR.IN_PROGRESS;
  //       break;
  //     case "unavailable":
  //       color = STATUS_COLOR.UNAVAILABLE;
  //       break;
  //     case "issued":
  //       color = STATUS_COLOR.ISSUED;
  //       break;
  //     case "rejected":
  //       color = STATUS_COLOR.REJECTED;
  //       break;
  //     default:
  //       color = STATUS_COLOR.PENDING;
  //       break;
  //   }

  //   return (
  //     <div className="text-center text-xs font-normal">
  //       <span
  //         className={classNames({
  //           "px-3 py-1 rounded-large   text-white capitalize text-nowrap": true,
  //         })}
  //         style={{ background: color }}
  //       >
  //         {status ?? "Pending"}
  //       </span>
  //     </div>
  //   );
  // };

  return (
    <>
      <div className="grid grid-cols-2  gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">Device Name</div>
          <div className="text-sm font-semibold">
            {issueTransactionData?.deviceName}
          </div>
          <div className="text-xs font-base">
            {issueTransactionData?.deviceCode}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">Fuel</div>
          <div className="text-sm font-semibold">
            {issueTransactionData?.fuelCode} {issueTransactionData?.fuelName}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Assigned Utility
          </div>
          <div className="text-sm font-semibold">
            {issueTransactionData?.assignedUtility}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Settlement Period
          </div>
          <div className="text-sm font-semibold">
            {dayjs(issueTransactionData?.settlementPeriod).format("MMMM YYYY")}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Total Generation
          </div>
          <div className="text-sm font-semibold">
            {numeral(issueTransactionData?.totalGeneration).format("0,0.00")}{" "}
            kWh (
            {numeral(
              numeral(issueTransactionData?.totalGeneration).value() / 1000
            ).format("0,0.000000")}{" "}
            MWh)
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal text-[#91918A]">
            Matched Generation
          </div>
          <div className="text-sm font-semibold">
            {numeral(issueTransactionData?.matchedGeneration).format("0,0.00")}{" "}
            kWh (
            {numeral(
              numeral(issueTransactionData?.matchedGeneration).value() / 1000
            ).format("0,0.000000")}{" "}
            MWh)
          </div>
        </div>
      </div>

      <Table stickyHeader verticalSpacing="sm" className="mt-10">
        <Table.Thead>
          <Table.Tr className="text-[#848789]">
            <Table.Th className="text-center w-48">Period</Table.Th>
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
          {issueRequest?.settlementDetail?.map((row, index) => (
            <Table.Tr key={index} className="text-[#071437] font-semibold">
              {index == 0 && (
                <Table.Td
                  rowSpan={issueRequest?.settlementDetail.length}
                  className="text-center align-top w-48"
                >
                  {dayjs(`${issueRequest.year}-${issueRequest.month}`).format(
                    "MMMM YYYY"
                  )}
                </Table.Td>
              )}

              <Table.Td className="text-center w-64 ">
                {issueRequest?.tradeAccountName}
              </Table.Td>
              <Table.Td className="text-center w-64 ">
                {row.allocationAccount}
              </Table.Td>
              <Table.Td className="text-right min-w-64 max-w-full">
                {numeral(numeral(row?.production).value() / 1000).format(
                  "0,000.000000"
                )}
              </Table.Td>
              <Table.Td className="text-center w-32 capitalize">
                {dayjs(row.startDate).format("DD/MM/YYYY")}
              </Table.Td>
              <Table.Td className="text-center w-32 capitalize">
                {dayjs(row.endDate).format("DD/MM/YYYY")}
              </Table.Td>
              <Table.Td className="text-center w-32 ">
                <StatusLabel
                  status={issueRequestStatus ?? "Pending"}
                  type="xs"
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr className="bg-[#F4F6F9]">
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
          {canUpload && (
            <Button
              className={classNames({
                "bg-[#F5F4E9] text-[#4D6A00] px-8": canUpload,
              })}
              onClick={() => setOpenModalUpload(!openModalUpload)}
            >
              Upload Files
            </Button>
          )}
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
          <div className="flex items-start gap-2">
            <div className="text-sm font-normal text-[#91918A]">Note</div>
            {canSendIssue ? (
              <div className="text-sm">
                <Input
                  size="md"
                  value={note}
                  onChange={(event) => setNote(event.currentTarget.value)}
                />
              </div>
            ) : (
              <div className="w-52 lg:w-96 lg:break-words text-sm font-normal">
                {note || "-"}
              </div>
            )}
          </div>
          {canSendIssue && (
            <Button
              className="bg-[#87BE33] text-white px-8"
              onClick={() => setOpenModalConfirm(!openModalConfirm)}
            >
              Send
            </Button>
          )}
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
            Issue Request Submitted!
          </div>
          <div className="flex gap-4">
            <Button
              className="text-white bg-PRIMARY_BUTTON mt-12 px-10"
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

          <Dragger {...props} fileList={fileUploaded} disabled={!canUpload}>
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

export default ItemIssue;

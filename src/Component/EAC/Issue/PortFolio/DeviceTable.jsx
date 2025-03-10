import React, { useLayoutEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Theme
import classNames from "classnames";
// import { useRouter } from "next/navigation";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { EAC_ISSUE } from "../../../../Constants/WebURL";
import DataTable from "../../../Control/Table/DataTableSimple";
import StatusLabel from "../../../../Component/Control/StatusLabel";
import Highlighter from "react-highlight-words";
import { USER_GROUP_ID } from "../../../../Constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import StatusLabelEAC from "../../StatusLabelEAC";

export default function DeviceTable({
  deviceData,
  portfolioData,
  searchValue,
}) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.login.userobj);

  const handleNavigate = (deviceData, portfolioData) => {
    console.log("Issue clicked for row:", portfolioData);
    navigate(`${EAC_ISSUE}/${portfolioData?.id}/${deviceData?.deviceId}`, {
      state: { portfolioData: portfolioData, deviceData: deviceData },
    });
  };
  const ActionCell = (data, portfolioData) => {
    const handleClickIssueRequest = () => {
      handleNavigate(data, portfolioData);
    };

    return (
      <div className="text-center" onClick={handleClickIssueRequest}>
        <span className="px-3 py-2 rounded cursor-pointer text-nowrap text-sm font-semibold text-white  hover:bg-[#4D6A00] bg-[#87BE33]">
          {userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_SIGNATORY ||
                            userData?.userGroup?.id == USER_GROUP_ID.UGT_REGISTANT_VERIFIER ? "Issue Request":"View"}
        </span>
      </div>
    );
  };

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );
  const columns = [
    {
      id: "deviceName",
      label: "Device Name",
      align: "left",
      width: "300px",
      render: (row) => (
        <div className="flex flex-col gap-2">
          <Highlighter
            highlightTag={Highlight}
            searchWords={[searchValue]}
            autoEscape={true}
            textToHighlight={row.deviceName}
          />
          {row.deviceCode && (
            <label className="text-[#2e8d8d] bg-[#f0f8ff] rounded w-max px-2 py-1 mt-1 text-xs font-normal">
              <Highlighter
                highlightTag={Highlight}
                searchWords={[searchValue]}
                autoEscape={true}
                textToHighlight={row.deviceCode}
              />
            </label>
          )}
        </div>
        /*   <div className="flex flex-col gap-2">
          <span>{row.deviceName}</span>
          {row.deviceCode && <span className="text-xs ">{row.deviceCode}</span>}
        </div> */
      ),
    },
    {
      id: "fuelType",
      label: "Devices Fuel",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={row.fuelType}
        />
      ),
      //  <span>{row.fuelType}</span>,
    },
    {
      id: "assignedUtility",
      label: "Assigned Utility",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={row.assignedUtility}
        />
      ),
      // <span>{row.assignedUtility}</span>,
    },
    {
      id: "totalGeneration",
      label: "Total Generation (kWh)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={numeral(row.totalGeneration).format("0,0.000")}
        />

        // <span>{numeral(row.totalGeneration).format("0,0.00")}</span>
      ),
    },
    {
      id: "matchedGeneration",
      label: "Matched Generation (kWh)",
      align: "right",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={numeral(row.matchedGeneration).format("0,0.000")}
        />

        /*   <span>
          {row.matchedGeneration
            ? numeral(row.matchedGeneration).format("0,0.00")
            : ""}
        </span> */
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => (
        <StatusLabelEAC
          status={row.status ?? "Pending"}
          searchQuery={searchValue}
        />
      ),
      // StatusLabel(row.status ?? "Pending"),
    },
    {
      id: "action",
      label: "",
      align: "center",
      render: (row) => ActionCell(row, portfolioData),
    },
  ];
  // const [colDefs, setColDefs] = useState([
  //   { field: "deviceName" },
  //   { field: "deviceCode" },
  //   { field: "fuelType" },
  //   { field: "assignedUtility" },
  //   {
  //     field: "totalGeneration",
  //     cellRenderer: (params) => {
  //       return <>{numeral(params.value).format("0,0.[000]")} kWh</>;
  //     },
  //   },
  //   { field: "status", cellRenderer: StatusIcon },
  //   {
  //     headerName: "",
  //     field: "status",
  //     cellRenderer: ActionCell,
  //     cellRendererParams: {
  //       portfolioData: portfolioData,
  //     },
  //   },
  // ]);

  return (
    <div className="mt-4">
      <DataTable data={deviceData} columns={columns} />
    </div>
  );
}

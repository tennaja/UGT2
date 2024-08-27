"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Theme
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { EAC_ISSUE } from "../../../Constants/WebURL";
import DataTable from "../../Control/Table/DataTable";
import DataTableSimple from "../../Control/Table/DataTableSimple";
import StatusLabel from "../../Control/StatusLabel";
import Highlighter from "react-highlight-words";

export default function PortfolioTable({ portData, searchValue }) {
  const navigate = useNavigate();

  const ActionCell = (data) => {
    const handleClickIssueRequest = () => {
      console.log("Issue clicked for row:", data.id);
      navigate(`${EAC_ISSUE}/${data.id}`, {
        state: { portfolioData: data },
      });
      // router.push(`/eac-tracking/issue-request/${data.id}`);
    };

    return (
      <div className="text-center" onClick={handleClickIssueRequest}>
        <span className="px-3 py-2 rounded cursor-pointer text-nowrap text-sm font-semibold text-white  hover:bg-[#4D6A00] bg-[#87BE33]">
          Issue Request
        </span>
      </div>
    );
  };

  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  const columns = [
    {
      id: "portfolioName",
      label: "Portfolio Name",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={row.portfolioName}
        />
      ),
      // <span>{row.portfolioName}</span>,
    },
    {
      id: "numberDevices",
      label: "Number of Devices",
      align: "center",
      render: (row) => (
        //  <span>{row.numberDevices}</span>,
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={(row.numberDevices ?? "").toString()}
        />
      ),
    },
    {
      id: "numberSubscribers",
      label: "Number of Subscribers",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={(row.numberSubscribers ?? "").toString()}
        />
      ),
      // <span>{row.numberSubscribers}</span>,
    },
    {
      id: "mechanism",
      label: "Mechanism",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={row.mechanism}
        />
      ),
      // <span>{row.mechanism}</span>,
    },
    {
      id: "currentSettlement",
      label: "Current Settlement",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchValue]}
          autoEscape={true}
          textToHighlight={row.currentSettlement}
        />
        /*     <span>
          {dayjs(row.currentSettlement, "YYYY-M").format("MMMM YYYY")}
        </span> */
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => (
        <StatusLabel status={row.status} searchQuery={searchValue} />
      ),
    },
    {
      id: "action",
      label: "",
      align: "center",
      render: (row) => ActionCell(row),
    },
  ];
  // const [colDefs, setColDefs] = useState([
  //   { field: "portfolioName" },
  //   { field: "numberDevices" },
  //   { field: "numberSubscribers" },
  //   { field: "mechanism" },
  //   {
  //     field: "currentSettlement",
  //     cellRenderer: (params) => {
  //       return <>{dayjs(params.value, "YYYY-MM").format("MMMM YYYY")}</>;
  //     },
  //   },
  //   { field: "status", cellRenderer: StatusIcon },
  //   { headerName: "", field: "status", cellRenderer: ActionCell },
  // ]);

  return (
    <div className="mt-4">
      <DataTable data={portData} columns={columns} searchData={searchValue} />
    </div>
  );
}

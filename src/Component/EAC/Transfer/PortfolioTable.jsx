import { useState } from "react";
import dayjs from "dayjs";
import { Button } from "@mantine/core";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// import DataTableSimple from "../../Control/Table/DataTableSimple";
import DataTable from "../../Control/Table/DataTable";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import StatusLabel from "../../../Component/Control/StatusLabel";
import Highlighter from "react-highlight-words";

export default function PortfolioTable({ portData, search }) {
  const navigate = useNavigate();

  const ActionCell = (data) => {
    const handleClickTransfer = () => {
      navigate("/eac/transfer/info", {
        state: {
          portfolioID: data.id,
          portfolioName: data.portfolioName,
          period: data.currentSettlement,
        },
      });
    };
    if (data?.status.toLowerCase() == "pending") {
      // มาแก้เป็น ==
      return (
        <div className="text-center" onClick={handleClickTransfer}>
          <span className="px-3 py-2 rounded cursor-pointer text-nowrap text-sm font-semibold text-white  hover:bg-[#4D6A00] bg-[#87BE33]">
            Transfer
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <span className="px-3 py-2 rounded cursor-pointer text-nowrap text-sm font-semibold text-white  bg-[#E6EAEE]">
            Transfer
          </span>
        </div>
      );
    }
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
          searchWords={[search]}
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
        <Highlighter
          highlightTag={Highlight}
          searchWords={[search]}
          autoEscape={true}
          textToHighlight={(row.numberDevices ?? "").toString()}
        />
      ),
      // <span>{row.numberDevices}</span>,
    },
    {
      id: "numberSubscribers",
      label: "Number of Subscribers",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[search]}
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
          searchWords={[search]}
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
      render: (row) => {
        return (
          <Highlighter
            highlightTag={Highlight}
            searchWords={[search]}
            autoEscape={true}
            textToHighlight={row.currentSettlement}
          />
        );

        /*   const dateArr = row.currentSettlement.split("-");
        let dateString = dateArr[0] + "-";
        if (dateArr[1].length < 2) {
          dateString += "0" + dateArr[1];
        }
        return (
          <Highlighter
            highlightTag={Highlight}
            searchWords={[search]}
            autoEscape={true}
            textToHighlight={dayjs(dateString).format("MMMM YYYY")}
          />
        ); */
        // return <span>{dayjs(dateString).format("MMMM YYYY")}</span>;
      },
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => <StatusLabel status={row.status} searchQuery={search} />,
      // StatusLabel(row.status),
    },
    {
      id: "",
      label: "",
      align: "center",
      render: (row) => ActionCell(row),
    },
  ];

  return (
    <DataTable
      data={portData}
      columns={columns}
      searchData={search}
      checkbox={false}
    />
  );

  //  <DataTableSimple data={portData} columns={columns} />;
}

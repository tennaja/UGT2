import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import DataTable from "../../Control/Table/DataTable";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

export default function PortfolioTable({ portData }) {
  const navigate = useNavigate();

  const StatusIcon = (status) => {
    let color;

    switch (status.toLowerCase()) {
      case "completed":
        color = "#9240E4";
        break;
      case "pending":
        color = "#F7A042";
        break;
      case "unavailable":
        color = "#E6EAEE";
        break;
      default:
        color = "#33BFBF";
        break;
    }

    return (
      <div className="text-center">
        <span
          className={classNames({
            "px-3 py-1 rounded-large text-white capitalize": true,
          })}
          style={{ background: color }}
        >
          {status}
        </span>
      </div>
    );
  };

  const ActionCell = (data) => {
    const handleClickRedeem = () => {
      navigate("/eac/redemption/info", {
        state: {
          portfolioID: data.id,
          portfolioName: data.portfolioName,
          period: data.yearSettlement,
        },
      });
    };
    if (data?.status.toLowerCase() == "pending") {
      return (
        <div className="text-center" onClick={handleClickRedeem}>
          <span
            className={classNames({
              "px-3 py-2 rounded capitalize cursor-pointer": true,
            })}
            style={{
              background: "#F5F4E9",
              color: "#4D6A00",
            }}
          >
            Redeem
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <span
            className={classNames({
              "px-3 py-2 rounded capitalize": true,
            })}
            style={{
              background: "#E6EAEE",
              color: "white",
            }}
          >
            Redeem
          </span>
        </div>
      );
    }
  };

  const columns = [
    {
      id: "portfolioName",
      label: "Portfolio Name",
      align: "left",
      render: (row) => <span>{row.portfolioName}</span>,
    },
    {
      id: "numberDevices",
      label: "Number of Devices",
      align: "center",
      render: (row) => <span>{row.numberDevices}</span>,
    },
    {
      id: "numberSubscribers",
      label: "Number of Subscriber",
      align: "center",
      render: (row) => <span>{row.numberSubscribers}</span>,
    },
    {
      id: "numberBeneficiary",
      label: "Number of Beneficiary",
      align: "center",
      render: (row) => <span>{row.numberBeneficiary}</span>,
    },
    {
      id: "yearSettlement",
      label: "Settlement Year",
      align: "center",
      render: (row) => <span>{row.yearSettlement}</span>,
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => StatusIcon(row.status),
    },
    {
      id: "",
      label: "Manage",
      align: "center",
      render: (row) => ActionCell(row),
    },
  ];

  return (
    <DataTable data={portData} columns={columns} />
  );
}

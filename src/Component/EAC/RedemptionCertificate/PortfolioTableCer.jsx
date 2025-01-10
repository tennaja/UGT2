import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import * as WEB_URL from "../../../Constants/WebURL"

import DataTable from "../../Control/Table/DataTable";
import { useNavigate } from "react-router-dom";
import StatusLabel from "../../../Component/Control/StatusLabel";
import Highlighter from "react-highlight-words";

export default function PortfolioTableCer({ portData,search }) {
  const navigate = useNavigate();

  const ActionCell = (data) => {
    const handleClickRedeem = () => {
      navigate("/eac/certificate/redemptionCert", {
        state: {
          portfolioID: data.id,
          portfolioName: data.portfolioName,
          period: data.yearSettlement,
        },
      });
    };
    console.log(data)
    if (data?.status.toLowerCase() == "completed") {
      // ใช้จริงอันนี้นะ
      // @30Sep2024 ทุกสถานะที่ไม่ใช่ Unavailable สามารถเข้าดูรายละเอียดได้
      return (
        <div className="text-center" onClick={handleClickRedeem}>
          <span className="px-3 py-2 rounded  cursor-pointer text-nowrap text-sm font-semibold text-white  hover:bg-[#4D6A00] bg-[#87BE33]">
            View
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <span className="px-3 py-2 rounded cursor-pointer text-nowrap text-sm font-semibold text-white  bg-[#E6EAEE]">
          View
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
    },
    {
      id: "numberBeneficiary",
      label: "Number of Beneficiaries",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[search]}
          autoEscape={true}
          textToHighlight={(row.numberBeneficiary ?? "").toString()}
        />
      ),
    },
    {
      id: "yearSettlement",
      label: "Settlement Year",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[search]}
          autoEscape={true}
          textToHighlight={(row.yearSettlement ?? "").toString()}
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row) => <StatusLabel status={row.status} searchQuery={search} />,
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
}

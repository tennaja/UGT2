"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, Divider, Table, ScrollArea, Card } from "@mantine/core";
import { Form, Select } from "antd";
import { getHistoryLogData } from "../../Redux/Settlement/Action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";
import * as WEB_URL from "../../Constants/WebURL";
import { USER_GROUP_ID } from "../../Constants/Constants";
import Highlighter from "react-highlight-words";
import DataTable from "../Control/Table/DataTable";
import SearchBox from "../Control/SearchBox";
import { hideLoading, showLoading } from "../../Utils/Utils";

const HistoryLogSettlement = ({
  ugtGroupId,
  portfolioId,
  portfolioName,
  unit,
  convertUnit,
  showSeeDetailButton,
  showWaitApprove,
  settlementYear,
  settlementMonth,
  isShowDetail = true,
  utilityId = 0,
  selectTab = "final",
  searchLog
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const Highlight = ({ children, highlightIndex }) => (
    <strong className="bg-yellow-200">{children}</strong>
  );

  //console.log("Year",settlementYear)
  //console.log("Month",settlementMonth)

  const userData = useSelector((state) => state.login.userobj);
  const history = useSelector((state) => state.settlement.historyLog);

  useEffect(() => {
    dispatch(getHistoryLogData(portfolioId, settlementYear, settlementMonth));
    hideLoading();
  }, [settlementYear, settlementMonth]);

  console.log(history);

  const mockHistory = [
    {
      year: 0,
      month: 0,
      portfolio: 0,
      action: "string",
      createBy: "string",
      createDateTime: "2025-01-10T09:11:57.697Z",
      remark: "string",
    },
  ];

  const getDate = (Date) => {
    const dateToText = Date.toString();
    const date = dateToText.split("T")[0];
    const dateSplit = date.split("-");
    const year = dateSplit[0];
    const month = dateSplit[1];
    const day = dateSplit[2];
    const fullDate = `${day}-${month}-${year}`.toLowerCase();

    return fullDate
  };

  const getTime = (Date) => {
    //console.log(Date)
    const dateToText = Date.toString();
    const time = dateToText.split("T")[1];
    const timeFull = time.split(".")[0];
    return timeFull;
  };

  const columnsHistory = [
    {
      id: "action",
      label: "Action",
      align: "left",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchLog]}
          autoEscape={true}
          textToHighlight={row.action}
        />
      ),
    },
    {
      id: "actionBy",
      label: "Action by",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchLog]}
          autoEscape={true}
          textToHighlight={row.createBy}
        />
      ),
    },
    {
      id: "date",
      label: "Date",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchLog]}
          autoEscape={true}
          textToHighlight={row.date}
        />
      ),
    },
    {
      id: "time",
      label: "Time",
      align: "canter",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchLog]}
          autoEscape={true}
          textToHighlight={row.time}
        />
      ),
    },
    {
      id: "remark",
      label: "Remark",
      align: "center",
      render: (row) => (
        <Highlighter
          highlightTag={Highlight}
          searchWords={[searchLog]}
          autoEscape={true}
          textToHighlight={row.remark}
        />
      ),
    },
  ];



  return (
    <>
      <DataTable
        data={history}
        columns={columnsHistory}
        searchData={searchLog}
        checkbox={false}
      />
    </>
  );
};

export default HistoryLogSettlement;

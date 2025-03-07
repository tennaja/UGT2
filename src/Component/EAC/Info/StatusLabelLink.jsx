import React from "react";
import Highlighter from "react-highlight-words";
import { STATUS_COLOR } from "../../../Constants/Constants";
import { useNavigate } from "react-router-dom";
import * as webURL from "../../../Constants/WebURL"
import {setSelectedSubMenu,} from "../../../Redux/Menu/Action"
import { getCookie, removeCookie, setCookie } from "../../../Utils/FuncUtils";
import { useDispatch, useSelector } from "react-redux";

const Highlight = ({ children, highlightIndex }) => (
  <strong className="bg-yellow-200">{children}</strong>
);

const StatusLabelLink = ({ status, type = 'sm', searchQuery,id,portName,count,destination,currentPeriod,yearSettlement }) => {
  let bg_color;
  let text_color;
  console.log(yearSettlement)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  switch (status?.toLowerCase().replace(" ", "")) {
    case "draft":
      bg_color = STATUS_COLOR.DRAFT.bg;
      text_color = STATUS_COLOR.DRAFT.text;
      break;
    case "pending":
      bg_color = "#FFF6BD";
      text_color = "#A58700";
      break;
    case "submitted":
      bg_color = STATUS_COLOR.SUBMITTED.bg;
      text_color = STATUS_COLOR.SUBMITTED.text;
      break;
    case "inprogress":
      bg_color = STATUS_COLOR.IN_PROGRESS.bg;
      text_color = STATUS_COLOR.IN_PROGRESS.text;
      break;
    case "verified":
      bg_color = STATUS_COLOR.VERIFIED.bg;
      text_color = STATUS_COLOR.VERIFIED.text;
      break;
      case "verifying":
      bg_color = STATUS_COLOR.VERIFYING.bg;
      text_color = STATUS_COLOR.VERIFYING.text;
      break;
    case "issued":
      bg_color = STATUS_COLOR.ISSUED.bg;
      text_color = STATUS_COLOR.ISSUED.text;
      break;
    case "completed":
      bg_color = STATUS_COLOR.COMPLETE.bg;
      text_color = STATUS_COLOR.COMPLETE.text;
      break;
    case "approved":
      bg_color = STATUS_COLOR.APPROVED.bg;
      text_color = STATUS_COLOR.APPROVED.text;
      break;
    case "active":
      bg_color = STATUS_COLOR.ACTIVE.bg;
      text_color = STATUS_COLOR.ACTIVE.text;
      break;
    case "unavailable":
      bg_color = STATUS_COLOR.UNAVAILABLE.bg;
      text_color = STATUS_COLOR.UNAVAILABLE.text;
      break;
    case "withdrawn":
      bg_color = STATUS_COLOR.WITHDRAW.bg;
      text_color = STATUS_COLOR.WITHDRAW.text;
      break;
    case "rejected":
      bg_color = STATUS_COLOR.REJECTED.bg;
      text_color = STATUS_COLOR.REJECTED.text;
      break;
    case "inactive":
      bg_color = STATUS_COLOR.INACTIVE.bg;
      text_color = STATUS_COLOR.INACTIVE.text;
      break;
    case "returned":
      bg_color = "#FFE1C9";
      text_color = "#DC6A01";
      break;
    default:
      bg_color = STATUS_COLOR.DEFAULT.bg;
      text_color = STATUS_COLOR.DEFAULT.text;
      break;
  }

  const handlePage=()=>{
    if(destination == "issue"){
      const param = {
        id:id,
        portfolioName:portName
      }
      dispatch(setSelectedSubMenu(2));
      setCookie("currentSubmenu", 2);
      navigate(`${webURL.EAC_ISSUE}/${id}`, {
              state: { portfolioData: param },
            });
      

    }
    else if(destination == "tranfer"){
      dispatch(setSelectedSubMenu(3));
      setCookie("currentSubmenu", 3);
      navigate("/eac/transfer/info", {
        state: {
          portfolioID: id,
          portfolioName: portName,
          period: currentPeriod,
        },
      });
    }
    else if(destination == "redemption"){
      dispatch(setSelectedSubMenu(4));
      setCookie("currentSubmenu", 4);
      navigate("/eac/redemption/info", {
        state: {
          portfolioID: id,
          portfolioName: portName,
          period: `${yearSettlement}`,
        },
      });
    }
  }

  return (
    <>
    {status?.toLowerCase() == "pending" ? (
      <span
      className={`px-3 ${
        type == 'sm' ? "py-2" : "py-0.5"
      } ${status?.toLowerCase() == "pending"?"underline hover:cursor-pointer":""} rounded-large capitalize text-nowrap font-semibold text-xs`}
      style={{ background: bg_color, color: text_color, textTransform: "none" }}
      onClick={handlePage}
    >
      <Highlighter
        highlightTag={Highlight}
        searchWords={[searchQuery]}
        autoEscape={true}
        textToHighlight={status ? status?.toLowerCase() == "pending"? "("+count+") "+status : status : ""}
      />
    </span>
    ):
    (
      <span
      className={`px-3 ${
        type == 'sm' ? "py-2" : "py-0.5"
      } ${status?.toLowerCase() == "pending"?"underline hover:cursor-pointer":""} rounded-large capitalize text-nowrap font-semibold text-xs`}
      style={{ background: bg_color, color: text_color, textTransform: "none" }}
    >
      <Highlighter
        highlightTag={Highlight}
        searchWords={[searchQuery]}
        autoEscape={true}
        textToHighlight={status ? status?.toLowerCase() == "pending"? "("+count+") "+status : status : ""}
      />
    </span>
    )}
    </>
    
  );
};

export default StatusLabelLink;

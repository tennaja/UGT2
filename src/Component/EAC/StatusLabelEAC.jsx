import React from "react";
import Highlighter from "react-highlight-words";
import { STATUS_COLOR } from "../../Constants/Constants";

const Highlight = ({ children, highlightIndex }) => (
  <strong className="bg-yellow-200">{children}</strong>
);

const StatusLabelEAC = ({ status, type = 'sm', searchQuery }) => {
  let bg_color;
  let text_color;

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

  return (
    <span
      className={`px-3 ${
        type == 'sm' ? "py-2" : "py-0.5"
      } rounded-large capitalize text-nowrap font-semibold text-xs`}
      style={{ background: bg_color, color: text_color, textTransform: "none" }}
    >
      <Highlighter
        highlightTag={Highlight}
        searchWords={[searchQuery]}
        autoEscape={true}
        textToHighlight={status ?? ""}
      />
    </span>
  );
};

export default StatusLabelEAC;

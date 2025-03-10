import React from "react";
import Highlighter from "react-highlight-words";
import { INVENTORY_STAUS_COLOR } from "../../../Constants/Constants"

const Highlight = ({ children, highlightIndex }) => (
  <strong className="bg-yellow-200">{children}</strong>
);

const StatusTag = ({ status, type = "sm", searchQuery }) => {
  let bg_color;
  let text_color;
    //console.log(status?.toLowerCase().replace(" ", ""))
  switch (status?.toLowerCase().replace(" ", "")) {
    case "available":
      bg_color = INVENTORY_STAUS_COLOR.ACTIVE.bg;
      text_color = INVENTORY_STAUS_COLOR.ACTIVE.text;
      break;
    case "outof stock":
      bg_color = INVENTORY_STAUS_COLOR.OUT_OF_STOCK.bg;
      text_color = INVENTORY_STAUS_COLOR.OUT_OF_STOCK.text;
      break;
    case "noinventory":
      bg_color = INVENTORY_STAUS_COLOR.NO_INVENTORY.bg;
      text_color = INVENTORY_STAUS_COLOR.NO_INVENTORY.text;
      break;
    case "expired":
      bg_color = INVENTORY_STAUS_COLOR.EXPIRED.bg;
      text_color = INVENTORY_STAUS_COLOR.EXPIRED.text;
      break;
    default:
      bg_color = INVENTORY_STAUS_COLOR.ACTIVE.bg;
      text_color = INVENTORY_STAUS_COLOR.ACTIVE.text;
      break;
  }

  return (
    <span
      className={` ${
        type == "sm" ? "py-2" : "py-0.5"
      } rounded-large capitalize text-nowrap text-xs px-[10px]`}
      style={{ background: bg_color, color: text_color, textTransform: "none" }}
    >
      <label className="break-all p-0">{status ?? ""}</label>
    </span>
  );
};

export default StatusTag;

import React from "react";
import Highlighter from "react-highlight-words";
import { SETTLEMENT_TYPE_COLOR } from "../../Constants/Constants";

const Highlight = ({ children, highlightIndex }) => (
  <strong className="bg-yellow-200">{children}</strong>
);

const SettlementTypeLabel = ({ settlementType,inventory, type = 'sm', searchQuery }) => {
  let bg_color;
  let text_color;

  switch (settlementType) {
    case true:
        if(inventory == 1){
            bg_color = SETTLEMENT_TYPE_COLOR.INVENTORY1.bg;
            text_color = SETTLEMENT_TYPE_COLOR.INVENTORY1.text;
            break;
        }
        else if(inventory == 2){
            bg_color = SETTLEMENT_TYPE_COLOR.INVENTORY2.bg;
            text_color = SETTLEMENT_TYPE_COLOR.INVENTORY2.text;
            break;
        }
    case false:
        bg_color = SETTLEMENT_TYPE_COLOR.ACTUAL.bg;
        text_color = SETTLEMENT_TYPE_COLOR.ACTUAL.text;
      break;
    default:
        bg_color = SETTLEMENT_TYPE_COLOR.ACTUAL.bg;
        text_color = SETTLEMENT_TYPE_COLOR.ACTUAL.text;
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
        textToHighlight={settlementType ? "Inventory":"Actual"}
      />
    </span>
  );
};

export default SettlementTypeLabel;

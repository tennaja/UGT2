import React from "react";
import ItemInfo from "./ItemInfo";

export default function SummaryCard({ data }) {
  console.log(data)
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {data.map((item, index) => {
        return <ItemInfo key={index} data={item} color={item?.color} />;
      })}
    </div>
  );
}

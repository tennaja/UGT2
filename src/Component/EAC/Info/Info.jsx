import React from "react";
import Overview from "./Overview";
import { useSelector } from "react-redux";

export default function Info() {
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center w-12/12">
        <div className="container max-w-screen-lg mx-auto">
          {/* ย้าย ชื่อเรื่องเข้าไปอยู่ใน Component แทน */}
          {/*   <div className="text-left flex flex-col">
            <h2 className="font-bold text-xl text-black">EAC Tracking Info</h2>
            <p className={`text-BREAD_CRUMB text-sm mb-6 font-normal`}>
              {currentUGTGroup?.name} / EAC Tracking / EAC Tracking Info
            </p>
          </div> */}

          <Overview />
        </div>
      </div>
    </div>
  );
}

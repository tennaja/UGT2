import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import IssueInfo from "./IssueInfo";

export default function DeviceIssue() {
  const location = useLocation();
  const portfolioData = location.state.portfolioData;
  const deviceData = location.state.deviceData;
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">
                Issue Request
              </h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / EAC Tracking Management / Issue
                Request / {portfolioData?.portfolioName} /{" "}
                {deviceData?.deviceName}
              </p>
            </div>

            <IssueInfo portfolioData={portfolioData} deviceData={deviceData} />
          </div>
        </div>
      </div>
    </div>
  );
}

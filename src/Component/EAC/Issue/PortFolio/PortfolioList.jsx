import React, { useEffect, useState } from "react";
import IssuePortfolio from "./IssuePortfolio";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PortfolioList() {
  // const { portfolio } = useParams();
  const location = useLocation();
  // console.log("location", location);
  const portfolioData = location.state.portfolioData;
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
                Request / {portfolioData?.portfolioName}
              </p>
            </div>

            <IssuePortfolio portfolioData={portfolioData} />
          </div>
        </div>
      </div>
    </div>
  );
}

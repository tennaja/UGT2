import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Overview from "./Overview";
import MonthlySettlement from "./MonthlySettlement";
import { useLocation } from "react-router-dom";

export default function Settlement() {
  const { state } = useLocation();
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);
  const settlementYear = useSelector((state) => state.settlement?.selectedYear);
  const portfolioId = state.id;
  const portfolioName = state.name;
  const [hasSettlementData, setHasSettlementData] = useState(false);

  return (
    currentUGTGroup?.id && (
      <div>
        <div className="min-h-screen p-6 items-center justify-center">
          <div className="container max-w-screen-lg mx-auto">
            <div className="text-left flex flex-col gap-3">
              <div className="grid gap-4 gap-y-2 grid-cols-1 md:grid-cols-6 ">
                <div className="md:col-span-3">
                  <h2 className="font-semibold text-xl text-black truncate">
                    {portfolioName}
                  </h2>
                  <p className={`text-BREAD_CRUMB text-sm font-normal`}>
                    {currentUGTGroup?.name} / Portfolio & Settlement Management
                    / View Settlement / {portfolioName}
                  </p>
                </div>
              </div>
              {/* Overview */}

              <Overview
                ugtGroupId={currentUGTGroup?.id}
                portfolioId={portfolioId}
                portfolioName={portfolioName}
                hasSettlementData={hasSettlementData}
              />

              {/* Monthly Settlement */}
              {settlementYear && (
                <MonthlySettlement
                  ugtGroupId={currentUGTGroup?.id}
                  portfolioId={portfolioId}
                  portfolioName={portfolioName}
                  setHasSettlementData={setHasSettlementData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

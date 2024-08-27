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
            <div className="text-left flex flex-col">
              <h2 className="font-semibold text-xl text-black">
                View Settlement
              </h2>
              <p className={`text-BREAD_CRUMB text-sm mb-6 font-normal`}>
                {currentUGTGroup?.name} / View Settlement / {portfolioName}
              </p>
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
    )
  );
}

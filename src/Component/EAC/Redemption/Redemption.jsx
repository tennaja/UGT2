import { useSelector } from "react-redux";
import RedemptionTable from "./RedemptionTable";

export default function Redemption() {
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center w-12/12">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col">
            <h2 className="font-semibold text-xl text-black">Redemption</h2>
            <p className={`text-BREAD_CRUMB text-sm mb-6 font-semibold`}>
              {currentUGTGroup?.name} / EAC Tracking Management / Redemption
            </p>
          </div>

          <RedemptionTable />
        </div>
      </div>
    </div>
  );
}

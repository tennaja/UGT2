import { useSelector } from "react-redux";
import RedemptionTableCer from "./RedemptionTableCer";

export default function RedemptionCer() {
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center w-12/12">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col">
            <h2 className="font-semibold text-xl text-black">Redemption Certificate</h2>
            <p className={`text-BREAD_CRUMB text-sm mb-6 font-semibold`}>
              {currentUGTGroup?.name} / EAC Tracking Management / Redemption Certificate
            </p>
          </div>

          <RedemptionTableCer />
        </div>
      </div>
    </div>
  );
}

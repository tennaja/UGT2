import { useSelector } from "react-redux";
import TransferTable from "./TransferTable";

export default function Transfer() {
  const currentUGTGroup = useSelector((state) => state.menu?.currentUGTGroup);

  return (
    <div>
      <div className="min-h-screen p-6 items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="text-left flex flex-col gap-3">
            <div>
              <h2 className="font-semibold text-xl text-black">REC Transfer</h2>
              <p className={`text-BREAD_CRUMB text-sm font-normal truncate`}>
                {currentUGTGroup?.name} / EAC Tracking Management / REC Transfer
              </p>
            </div>

            <TransferTable />
          </div>
        </div>
      </div>
    </div>
  );
}

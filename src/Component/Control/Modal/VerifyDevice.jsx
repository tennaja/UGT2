import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import WarningImg from "../../assets/warning.png";

const ModalVerifydevice = (props) => {
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Verify this Device?",
    content = "Would you like to verify this device? Verified device will be sent to sign and unable to recall.",
    buttonTypeColor = "primary",
  } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickOk = () => {
    onClickConfirmBtn();
  };

  const getButtonColor = () => {
    switch (buttonTypeColor) {
      case "primary":
        return "bg-[#87BE33]";
      case "danger":
        return "bg-[#EF4835]";

      default:
        return "bg-[#87BE33]";
    }
  };
  return (
    <>
      <>
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div
            className="flex items-end justify-center min-h-screen  pt-4 px-4 pb-20 text-center sm:block sm:p-0"
          >
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div
              className="inline-block align-bottom bg-white rounded px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="md:col-span-6 rounded-full rounded mx-auto flex items-center justify-center h-16 w-20  ">
              <img
                type="file"
                id="preview_img"
                className="h-20 w-20 object-cover rounded-full flex items-center justify-center"
                src={WarningImg}
                alt="Current profile photo"
              />
            </div>
              <div>
                <div className="mt-3 text-center sm:mt-4">
                  <h6
                    className="text-2xl leading-6 font-bold text-[#071437] "
                    id="modal-headline"
                  >
                    {title}
                  </h6>
                  <div className="mt-4">
                    <p className="text-sm">{content}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  onClick={onClickOk}
                  // style={{backgroundColor:getButtonColor()}}
                  className={`${getButtonColor()} inline-flex justify-center w-full rounded  border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-[#78829D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm`}
                >
                  Verify
                </button>
              </div>
              <div className="mt-1 sm:mt-6">
                <button
                  onClick={onCloseModal}
                  className="inline-flex justify-center w-full rounded  shadow-sm px-4 py-2 bg-MAIN_SCREEN_BG text-base font-medium text-balk hover:bg-[#78829D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ModalVerifydevice;

import { useState, useEffect } from "react";
import AlmostDone from "../../assets/done.png";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";
import { useDispatch } from "react-redux";
import {
  WithdrawDevice,
  SubmitDevice,
  clearModal,
  VerifingDevice
} from "../../../Redux/Device/Action";
import ModalConfirm from "./ModalConfirm";
import * as WEB_URL from "../../../Constants/WebURL";
import { SUB_MENU_ID } from "../../../Constants/Constants";
import { setSelectedSubMenu } from "../../../Redux/Menu/Action";
import { hideLoading, padNumber, showLoading } from "../../../Utils/Utils";
const ModalDone = (props) => {
  const {
    // data,
    deviceID,
    status,
    onChangeModalDone,
  } = props;
  const dispatch = useDispatch();

  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false);
  const [modalConfirmProps, setModalConfirmProps] = useState(null);

  useEffect(() => {}, []);
  const navigate = useNavigate();

  const backToHome = () => {
    dispatch(clearModal());
    navigate(WEB_URL.DEVICE_LIST);
    dispatch(setSelectedSubMenu(SUB_MENU_ID.DEVICE_LIST_INFO));
  };

  const handleCloseModalConfirm = () => {
    setOpenConfirmModal(false);
  };

  // ---------------Submit Function---------------- //

  const handleClickSubmit = () => {
    setOpenConfirmModal(true);
    setModalConfirmProps({
      onCloseModal: handleCloseModalConfirm,
      onClickConfirmBtn: handleClickConfirmSubmit,
      title: "Are you sure?",
      content:
        "If you confirm , this device will be submitted to review by EVIDENT, you will no longer be able to modify it.",
      buttonTypeColor: "primary",
    });
  };

  const handleClickConfirmSubmit = () => {
    dispatch(
      SubmitDevice(deviceID, () => {
        //Call Back
        dispatch(clearModal());
        navigate(WEB_URL.DEVICE_LIST);
      })
    );
  };

  // ---------------------------------------------- //


//------------------------Send to Verify-------------------------------//
const onClickSendtoVerifyBtn = () => {
  setOpenConfirmModal(true);
  setModalConfirmProps({
    onCloseModal: handleCloseModalConfirm,
    onClickConfirmBtn: handleClickConfirmVerifying,
    title: "Send to Verify?",
    content:
      "Would you like to send this device to verify?",
    buttonTypeColor: "primary",
  });
};

//Call Api Verifying
const handleClickConfirmVerifying = () => {
  showLoading();
  dispatch(
    VerifingDevice(deviceID, () => {
      dispatch(clearModal());
      navigate(WEB_URL.DEVICE_LIST);
      hideLoading();
    })
  );
};

// ---------------------------------------------- //


  // ---------------Withdraw Function---------------- //
  const handleClickWithdraw = () => {
    setOpenConfirmModal(true);
    setModalConfirmProps({
      onCloseModal: handleCloseModalConfirm,
      onClickConfirmBtn: handleClickConfirmWithdraw,
      title: "Confirm withdraw?",
      content: "Are you sure you would like to withdraw this device?",
      buttonTypeColor: "danger",
    });
  };

  const handleClickConfirmWithdraw = () => {
    dispatch(
      WithdrawDevice(deviceID, () => {
        //Call Back
        dispatch(clearModal());
        navigate(WEB_URL.DEVICE_LIST);
      })
    );
  };

  return (
    <>
      <Modal
        size="md"
        opened={true}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="p-3 pt-4">
          {/* <div className="flex items-center justify-center h-20 w-20 mx-auto">
            <img
              type="file"
              id="preview_img"
              src={AlmostDone}
              alt="Current profile photo"
            />
          </div> */}

          <div className="mt-3 text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              Almost Done!
            </h6>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
              Press 'Send to Verify' to proceed or ‘Back’ to Device Details. 
                
                
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            {/* <div className="flex flex-col gap-2 pb-2">
              <button
                onClick={handleClickSubmit}
                className={`w-full bg-[#87BE33] hover:bg-[#4D6A00] text-white hover:text-white rounded shadow-sm px-4 py-2 text-base font-semibold  sm:text-sm`}
              >
                Submit
              </button>
              <button
                onClick={handleClickWithdraw}
                className={`w-full bg-[#D9E2BD] hover:bg-[#4D6A00] text-[#4D6A00] hover:text-white rounded shadow-sm px-4 py-2 text-base font-semibold  sm:text-sm`}
              >
                Withdraw
              </button>
            </div> */}

            <div className="flex gap-2">
              <button
                onClick={backToHome}
                className={`w-full bg-[#F5F4E9] hover:bg-[#4D6A00] text-[#4D6A00] hover:text-white rounded shadow-sm px-4 py-2 text-base font-semibold  sm:text-sm`}
              >
                Back 
              </button>
              <button
                onClick={onClickSendtoVerifyBtn}
                className={`w-full bg-PRIMARY_BUTTON hover:bg-indigo-[#4ed813d1] text-white hover:text-white rounded shadow-sm px-4 py-2 text-base font-semibold  sm:text-sm`}
              >
                Send to Verify
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {isOpenConfirmModal && <ModalConfirm {...modalConfirmProps} />}
    </>
  );
};

export default ModalDone;

import { useState, useEffect } from "react";
import AlmostDone from "../../assets/done.png";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";
import { useDispatch } from "react-redux";
// import {
//   WithdrawDevice,
//   SubmitDevice,
//   clearModal,
//   VerifingDevice
// } from "../../../Redux/Device/Action";
import ModalConfirm from "./ModalConfirm";
import * as WEB_URL from "../../../Constants/WebURL";
import { SUB_MENU_ID } from "../../../Constants/Constants";
import { setSelectedSubMenu } from "../../../Redux/Menu/Action";
import PreviewPdf from "../Previewsf02";

const ModalSubmitDone = (props) => {
  const {
    File,
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
          <div className="flex items-center justify-center h-20 w-20 mx-auto">
            <img
              type="file"
              id="preview_img"
              src={AlmostDone}
              alt="Current profile photo"
            />
          </div>

          <div className="mt-3 text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              Device Submitted Successfully
            </h6>
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

            <div className="flex items-center justify-center gap-2">
            <PreviewPdf data={File}/>
              <button
                onClick={onChangeModalDone}
                className={`w-48 bg-[#F5F4E9] hover:bg-[#4D6A00] text-[#4D6A00] hover:text-white rounded shadow-sm px-4 py-2 text-base font-semibold  sm:text-sm`}
              >
                Confirm
              </button>
              
            </div>
          </div>
        </div>
      </Modal>

      {/* {isOpenConfirmModal && <ModalConfirm {...modalConfirmProps} />} */}
    </>
  );
};

export default ModalSubmitDone;

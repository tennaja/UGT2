import { Modal } from "@mantine/core";
import { useState } from "react";

// Custom Hook
function useRemarkHandler(onClickConfirmBtn) {
  const [remark, setRemark] = useState("");

  const handleRemarkChange = (e) => {
    let value = null;
                if (e.target.value) {
                  value = e.target.value;
                  value = value.replace(/[^A-Za-z0-9.\s]/g, '')
                }
          setRemark(value);
  };

  const submitRemark = () => {
    onClickConfirmBtn(remark);
  };

  return {
    remark,
    handleRemarkChange,
    submitRemark,
  };
}

const ModalReturnConfirm = (props) => {
  const {
    onCloseModal,
    onClickConfirmBtn,
    title = "Return to Device Owner?",
    content = "Device Registration requires to be edited. Would you like to return to Device Owner?",
    buttonTypeColor = "primary",
  } = props;

  const { handleRemarkChange, submitRemark } = useRemarkHandler(onClickConfirmBtn);

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
    <Modal
      size="md"
      opened={true}
      onClose={() => submitRemark(false)}
      withCloseButton={false}
      closeOnClickOutside={false}
      centered
    >
      <div className="pt-4 pb-5">
        <div className="text-center sm:mt-4">
          <h6 className="text-2xl leading-6 font-bold text-[#071437]" id="modal-headline">
            {title}
          </h6>
          <div className="mt-4">
            <p className="text-sm text-gray-600">{content}</p>
          </div>
          <div className="mt-4 text-left">
            <div className="flex justify-start">
              <p className="text-sm text-gray-600">Remark</p>
              <p className="text-red-500 ml-1">*</p>
            </div>
            <textarea
              className="h-[120px] focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full bg-transparent outline-none py-4 px-3"
              onChange={handleRemarkChange}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-3 pb-2">
        <button
          onClick={onCloseModal}
          className="w-50 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
        >
          Back
        </button>
        <button
          onClick={submitRemark}
          className={`${getButtonColor()} w-50 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm hover:bg-[#4D6A00] `}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ModalReturnConfirm;

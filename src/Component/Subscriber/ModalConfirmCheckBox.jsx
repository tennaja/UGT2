import { Modal } from "@mantine/core";
import {useRef, useState} from 'react'

const ModalConfirmCheckBox = (props) => {
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirm?",
    content = "Are you sure you would like to confirm this action?",
    textCheckBox,
    buttonTypeColor = "primary",
    showCheckBox = true,
    sizeModal="lg",
  } = props;

  const [isCheckBox,setIsCheckBox] = useState(false)

  const onChangeCheckBox=()=>{
    setIsCheckBox(!isCheckBox)
    console.log(isCheckBox)
  }

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

  const getButtonColorHover = () => {
    switch (buttonTypeColor) {
      case "primary":
        return "hover:bg-[#4D6A00]";
      case "danger":
        return "hover:bg-[#964036]";

      default:
        return "hover:bg-[#4D6A00]";
    }
  };
  return (
    <>
      <Modal
        size={sizeModal}
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="pt-4 pb-4">
          <div className="text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-base text-gray-600">{content}</p>
            </div>
          </div>
        </div>
        {showCheckBox && <div className="flex item-center gap-3">
              <div className="">
                <input
                  type="checkbox"
                  onChange={onChangeCheckBox}
                  checked={isCheckBox}
                  className={"border-1 border-gray-300 rounded mt-2 w-5 h-5 align-top "}
                />
                
                  <label className={`w-[95%] font-bold text-base ml-2 mt-2`}>
                    {textCheckBox}
                  </label>
              </div>
            </div>}
        <div className="flex justify-center gap-3 pb-2 mt-3">
          <button
            onClick={onCloseModal}
            className="w-50 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
          >
            Back
          </button>

          <button
            onClick={onClickOk}
            className={`${getButtonColor()} w-50 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm ${getButtonColorHover()} `}
            disabled={showCheckBox?!isCheckBox:false}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmCheckBox;

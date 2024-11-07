import { Modal } from "@mantine/core";
import {useRef, useState,useEffect} from 'react'

const ModalConfirmCheckBox = (props) => {
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirm?",
    content = "Are you sure you would like to confirm this action?",
    content2 = "",
    textCheckBox,
    buttonTypeColor = "primary",
    showCheckBox = true,
    sizeModal="lg",
    textButton = "Confirm"
  } = props;

  const [isCheckBox,setIsCheckBox] = useState(false)

  const handleKeyDown = (e) =>{
    if(e.key === "Enter"){
      e.preventDefault()
    }
  }

  useEffect(()=>{
    window.addEventListener("keydown",handleKeyDown)
    return ()=>{
      window.removeEventListener("keydown",handleKeyDown)
    }
  },[])

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
        onKeyDown={handleKeyDown}
      >
        <div className="pt-4 ">
          <div className="text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-sm text-center font-bold text-gray-600">{content}</p>
            </div>
            {content2 !== "" &&<div className="mt-3">
              <p className="text-sm text-center font-bold text-gray-600">{content2}</p>
            </div>}
          </div>
        </div>
        {showCheckBox && <div className="flex item-center">
              <div className="w-[5%] ml-2">
                <input
                  type="checkbox"
                  onChange={onChangeCheckBox}
                  checked={isCheckBox}
                  className={"border-1 border-gray-300 rounded mt-2 w-5 h-5 align-top "}
                />
                
                  
              </div>
              <div className="w-full">
              <label className={`text-sm ml-2 mt-2 inline-block`}>
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
            {textButton}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmCheckBox;

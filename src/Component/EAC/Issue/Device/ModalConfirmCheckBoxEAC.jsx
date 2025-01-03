import { Modal } from "@mantine/core";
import {useRef, useState,useEffect} from 'react'

const ModalConfirmCheckBoxEAC = (props) => {
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirm?",
    content = "Are you sure you would like to confirm this action?",
    content2 = "",
    content3 = "",
    textCheckBox,
    buttonTypeColor = "primary",
    showCheckBox = true,
    sizeModal="lg",
    textButton = "Confirm",
    isHaveFile = false,
    isShowInfo = false,
    textAlign = "center"
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
    if(showCheckBox == false){
      switch (buttonTypeColor) {
        case "primary":
          return "bg-[#87BE33]";
        case "danger":
          return "bg-[#EF4835]";

        default:
          return "bg-[#87BE33]";
      }
    }
    else if(showCheckBox == true){
      switch (buttonTypeColor) {
        case "primary":
          if(isCheckBox){
            return "bg-[#87BE33]";
          }
          else{
            return "bg-[#cbdeaf]";
          }
        case "danger":
          if(isCheckBox){
            return "bg-[#EF4835]";
          }
          else{
            return "bg-[#e6a29a]";
          }

        default:
          if(isCheckBox){
            return "bg-[#87BE33]";
          }
          else{
            return "bg-[#cbdeaf]";
          }
      }
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
            {isHaveFile == false && <div className="mt-4 p-2">
                <div className="bg-[#FFF2C9] px-[15px] py-[10px] text-[#766214]">
                    <label className="font-bold mr-1 text-sm">Warnning:</label><label className="text-sm"> This issue request has no active files attached to it.</label>
                </div>
            </div>}
            {isShowInfo && <div className="mt-4 p-2">
                <div className="bg-[#CBEEFF] px-[15px] py-[10px] text-[#1B659A]">
                    <label className="font-bold mr-1 text-sm">Info:</label><label className="text-sm"> Please read the following legal confirmation carefully.</label>
                </div>
            </div>}
            <div className="mt-4">
              <p className={textAlign == "center"?"text-sm text-center font-bold text-gray-600":textAlign == "left"?"text-sm text-left font-bold text-gray-600":"text-sm text-right font-bold text-gray-600"}>{content}</p>
            </div>
            {content2 !== "" &&<div className="mt-3">
              <p className={textAlign == "center"?"text-sm text-center font-bold text-gray-600":textAlign == "left"?"text-sm text-left font-bold text-gray-600":"text-sm text-right font-bold text-gray-600"}>{content2}</p>
            </div>}
            {content3 !== "" &&<div className="mt-3 mb-3">
              <p className={textAlign == "center"?"text-sm text-center font-bold text-gray-600":textAlign == "left"?"text-sm text-left font-bold text-gray-600":"text-sm text-right font-bold text-gray-600"}>{content3}</p>
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
        <div className="flex justify-center gap-3 pb-2 mt-4">
          <button
            onClick={onCloseModal}
            className="w-50 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
          >
            Close
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

export default ModalConfirmCheckBoxEAC;

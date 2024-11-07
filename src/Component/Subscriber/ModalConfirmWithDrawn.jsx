import { Modal } from "@mantine/core";
import {useRef, useState} from 'react'
import WarningIcon from "../assets/WarningIcon.svg"

const ModalConfirmWithdrawn = (props) => {
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
    contentButton = "Confirm",
    content2 =""
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
        <div className="pt-2 pb-1">
          <div className="text-center sm:mt-4">
          <div className="md:col-span-6 rounded-full rounded mx-auto flex items-center justify-center h-20 w-20 mb-4  bg-[#ffffff]">
                  <img
                    type="file"
                    id="preview_img"
                    className="h-15 w-56 object-cover rounded-full flex items-center justify-center"
                    src={WarningIcon}
                    alt="Current profile photo"
                  />
                </div>
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              {title}
            </h6>
            
            <div className="mt-3">
              <p className="text-base text-gray-600">{content}
              {content2 !== "" &&
              <p className="text-base text-gray-600">{content2}</p>
            }
              </p>
              
            </div>
            
          </div>
        </div>
        <div className="flex justify-center gap-3 pb-2 mt-2">
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
            {contentButton}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmWithdrawn;

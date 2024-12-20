import { Modal } from "@mantine/core";
import PdfTablePreview from '../TemplatePdf';
import { useState } from "react";
const ModalConfirmVerified = (props) => {
  const {
    data,
    UserSign,
    registanstdetail,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirm?",
    content = "Are you sure you would like to confirm this action?",
    buttonTypeColor = "primary",
  } = props;
  const [isfirst,setIsFirst] = useState(true);
  const onClickOk = () => {
    onClickConfirmBtn();
  };
  const setIsfirst = () => {
    setIsFirst(false)
  }
  
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
    <PdfTablePreview 
     data={data}
     aftersign={registanstdetail}
     Status ={"Verified"}
     Sign={""}
     isFirst={isfirst}
     setupsetIsfirst={setIsfirst}/>
      {!isfirst && (<Modal
        size="md"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="pt-4 pb-5">
          <div className="text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4 gap-0">
              <p className="text-sm text-gray-600">
              {`Would you like to verify this device?`}
  <br />
  {`Verified device will be sent to sign and unable to recall.`}
              </p>
              
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
            onClick={onClickOk}
            className={`${getButtonColor()} w-50 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm hover:bg-[#4D6A00] `}
          >
            Verify
          </button>
        </div>
      </Modal>)}
    </>
  );
};

export default ModalConfirmVerified;

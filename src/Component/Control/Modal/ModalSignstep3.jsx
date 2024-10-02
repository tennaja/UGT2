import { Modal } from "@mantine/core";
import PdfTablePreview from '../TemplatePdf';

const ModalSignStep3 = (props) => {
  const {
    data,
    UserSign,
    registanstdetail,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirmation Signature & Submission",
    content = "By submitting this form I confirm acceptance of Evident’s Privacy Policy, as published on  https://evident.global/privacy and any such policies as published by the responsible Issuer.  I acknowledge and agree that the information provided will be used by Evident for the purpose of  providing services relating to I-REC Electricity certificates and that Evident may share this information  with other organisations as may be necessary for the provision of these services.",
    buttonTypeColor = "primary",
  } = props;

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
    <PdfTablePreview data={data} aftersign={registanstdetail} Sign={UserSign} Status ={"Submited"}/>
      <Modal
        size="lg"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="pt-4 pb-3 pl-3 pr-3">
          <div className="text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-sm text-gray-600 text-left indent-8">{content}</p>
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
            Sign & Submit
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalSignStep3;

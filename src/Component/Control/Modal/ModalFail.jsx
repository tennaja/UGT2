import { Modal } from "@mantine/core";
import CancelImg from "../../assets/cancel.png";
const ModalFail = (props) => {
  const {
    onClickOk,
    title = "Oops!",
    content = "Your transaction has failed. Please go back and try again",
  } = props;

  return (
    <Modal
      size="md"
      opened={true}
      onClose={() => onClickOk && onClickOk(false)}
      withCloseButton={false}
      closeOnClickOutside={false}
      centered
    >
      <div className="py-4">
        <div className="flex items-center justify-center h-18 w-16 mx-auto">
          <img
            type="file"
            id="preview_img"
            src={CancelImg}
            alt="Current profile photo"
          />
        </div>

        <div className="mt-3 text-center sm:mt-4">
          <h6
            className="text-2xl leading-6 font-bold text-[#071437] "
            id="modal-headline"
          >
            {title}
          </h6>
          <div className="mt-4">
            <p className="text-sm text-gray-600">{content}</p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => {
            onClickOk && onClickOk(false);
          }}
          className="rounded border border-transparent shadow-sm px-5 py-2 bg-[#EF4835] text-base font-semibold text-white hover:bg-[#b51105] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default ModalFail;

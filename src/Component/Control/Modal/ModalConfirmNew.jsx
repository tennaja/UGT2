import { Modal } from "@mantine/core";

const ModalConfirmNew = (props) => {
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirm?",
    content = "Are you sure you would like to confirm this action?",
    buttonTypeColor = "primary",
    textBtn = "Confirm"
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
        size="md"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="pt-4 pb-2">
          <div className="text-center sm:mt-4">
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
        <div className="flex justify-center gap-3 pb-2">
          <button
            onClick={onCloseModal}
            className="w-50 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
          >
            Back
          </button>

          <button
            onClick={onClickOk}
            className={`${getButtonColor()} w-50 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm ${getButtonColorHover()} `}
          >
            {textBtn}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmNew;

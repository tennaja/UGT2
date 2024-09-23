import { Modal } from "@mantine/core";
import WarningImg from "../../assets/Danger.svg";
const ModalConfirmWithdraw = (props) => {
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirm?",
    content = "Are you sure you would like to confirm this action?",
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
      <Modal
        size="md"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="pt-4 pb-5">
        <div className="md:col-span-6 rounded-full rounded mx-auto flex items-center justify-center h-16 w-20  ">
              <img
                type="file"
                id="preview_img"
                className="h-20 w-20 object-cover rounded-full flex items-center justify-center"
                src={WarningImg}
                alt="Current profile photo"
              />
            </div>
          <div className="text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
              {`Would you like to withdraw this device?`}<br/>{`Device will be permanently deleted.`}
               
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
            Confirm Withdraw
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmWithdraw;

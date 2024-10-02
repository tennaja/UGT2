import { Modal } from "@mantine/core";
import { useState } from 'react';

const ModalSignStep1 = (props) => {
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Sign & Submit?",
    content = "By proceeding with this step, you confirm to sign the device registration form and automatically submit this form to Evident. Would you like to sign and submit?",
    buttonTypeColor = "primary",
  } = props;
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  
  const onClickOk = () => {
    if (isChecked) {
      onClickConfirmBtn();
    }
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
        size="lg"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="pt-4 pb-5 pl-3 pr-3">
          <div className="text-center sm:mt-4">
            <h6 className="text-2xl leading-6 font-bold text-[#071437]" id="modal-headline">
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-sm text-gray-600">{content}</p>
            </div>
            <div className="flex items-center text-left mt-4">
              <input
                checked={isChecked}
                onChange={handleCheckboxChange}
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ms-2 text-sm text-gray-600">
                I confirm all the required information is completed and the necessary supporting information and files are attached.
              </label>
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
  className={`${isChecked ? getButtonColor() : 'bg-gray-400 cursor-not-allowed'} w-50 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm ${
    isChecked ? 'hover:bg-[#4D6A00]' : ''
  }`}
  disabled={!isChecked} // Disable the button if checkbox is not checked
>
  Next
</button>

        </div>
      </Modal>
    </>
  );
};

export default ModalSignStep1;

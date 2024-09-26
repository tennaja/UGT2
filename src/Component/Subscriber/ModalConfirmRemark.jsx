import { Modal } from "@mantine/core";
import {useRef, useState} from 'react'
import { useForm, Controller } from "react-hook-form";
import Textarea from "../Control/Textarea";
import TextareaNoteSubscriber from "./TextareaNoteSubscriber";

const ModalConfirmRemark = (props) => {
  const {
    // register,
    handleSubmit,
    resetField,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  const {
    data,
    status,
    onCloseModal,
    onClickConfirmBtn,
    title = "Confirm?",
    content = "Are you sure you would like to confirm this action?",
    content2="",
    textCheckBox,
    buttonTypeColor = "primary",
    setRemark,
    userName,
    userLastName,
    remark
  } = props;

  const [isCheckBox,setIsCheckBox] = useState(false)

  const onChangeCheckBox=()=>{
    setIsCheckBox(!isCheckBox)
    console.log(isCheckBox)
  }

  const onClickOk = () => {
    const currentDateTime = new Date();
    /*setRemark((prevFileList) => {
      console.log("prevFileList", prevFileList);
      let newFileList = [
        ...prevFileList,
        {id: 0, remarkName: ("Remark "+(remark.length+1)), remarkDetail: getValues("remark"),createdBy: userName,createdDateTime: currentDateTime.toLocaleString(),subscriberId:0,isActive:"" },
      ];
      console.log("New Remrk",newFileList)
      return newFileList;
    });*/
    console.log("User Name",userName)
    const name = (userName.firstName+" "+userName.lastName)
    console.log("Name",name)
    setRemark.current = {id: 0, remarkName: ("Remark "+(remark.length+1)), remarkDetail: getValues("remark"),createdBy: name,createdDateTime: null,subscriberId:0,isActive:"" };
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
        size="lg"
        opened={true}
        onClose={() => onClickOk && onClickOk(false)}
        withCloseButton={false}
        closeOnClickOutside={false}
        centered
      >
        <div className="pt-4 pb-3">
          <div className="text-center sm:mt-4">
            <h6
              className="text-2xl leading-6 font-bold text-[#071437] "
              id="modal-headline"
            >
              {title}
            </h6>
            <div className="mt-4">
              <p className="text-base text-center font-bold text-gray-600">{content}</p>
            </div>
            {content2 !== "" &&<div className="mt-4">
              <p className="text-base text-center font-bold text-gray-600">{content2}</p>
            </div>}
            <div className="mt-4 text-left">
              <Controller
                name="remark"
                control={control}
                rules={{
                  required: "This field is required",
                  validate: (value) => value.trim() !== "" || "Input cannot be just spaces",
                }}
                render={({ field }) => (
                  <TextareaNoteSubscriber
                    {...field}
                    id={"remark"}
                    type={"text"}
                    label={"Remark"}
                    error={errors.remark}
                    validate={" *"}
                    // ... other props
                  />
                )}
                />
            </div>
          </div>
        </div>
        <div className="flex item-center gap-3">
              <div className="">
                <input
                  type="checkbox"
                  onChange={onChangeCheckBox}
                  checked={isCheckBox}
                  className={"border-1 border-gray-300 rounded mt-2 w-5 h-5 align-top "}
                />
                
                  <label className={`w-[95%] text-base ml-2 mt-2`}>
                    {textCheckBox}
                  </label>
              </div>
            </div>
        <div className="flex justify-center gap-3 pb-2 mt-3">
          <button
            onClick={onCloseModal}
            className="w-50 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
          >
            Back
          </button>

          <button
            onClick={handleSubmit(onClickOk)}
            className={`${getButtonColor()} w-50 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm hover:bg-[#4D6A00] `}
            disabled={!isCheckBox}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmRemark;

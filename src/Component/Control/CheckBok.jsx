import React, { useState } from "react";

const CheckBox = (props) => {
  const {
    register,
    label,
    validate,
    error,
    id,
    onChangeInput,
    disabled,
    initValue = null,
    ...inputProps
  } = props;
  //const [ischeckBox,setIsCheckBox] = useState(inputProps.value)
  {
    initValue && inputProps.onChange(initValue);
  }
  inputProps.onChange(inputProps.value)
  return (
    <>
      {/*label ? (
        <label className="mb-1" htmlFor={id}>
          <b>
            {label}
            <font className="text-[#f94a4a]">{validate}</font>
          </b>
        </label>
      ) : (
        <></>
      )*/}
      <div class="flex items-center mt-4">
      <input
        id={id}
        {...inputProps}
        value={inputProps.value}
        onChange={() => {
          let value = null;
          //if (e.target.value) {
          //  value = e.target.value;
          //}
          //onChangeInput && onChangeInput(value);
          //inputProps.onChange(value);
          //setIsCheckBox((ischeckBox)=>!ischeckBox)
          value = !inputProps.value
          console.log(value)
          //console.log(ischeckBox)
          inputProps.onChange(value)
          console.log(inputProps.value)
          //console.log(inputProps.value)
        }}

        checked={inputProps.value}
        disabled={disabled}
        className={`${
          disabled && "bg-[#ededed] disabled:cursor-not-allowed "
        } ${
          error && error?.message
            ? "border-1 border-rose-500 rounded mt-2 w-5 h-5"
            : " border-1 border-gray-300 rounded mt-2 w-5 h-5"
        }`}
      />
      <label className="font-bold ml-2 mt-2">{label}</label>
      </div>
      

      {error && error?.message && (
        <p className="absolute mt-1 mb-1 text-red-500 text-xs text-left ">
          {error.message}
        </p>
      )}
    </>
  );
};

export default CheckBox;

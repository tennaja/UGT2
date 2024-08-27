import React from "react";

const Input = (props) => {
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
  {
    initValue && inputProps.onChange(initValue);
  }
  return (
    <>
      {label ? (
        <label className="mb-1" htmlFor={id}>
          <b>
            {label}
            <font className="text-[#f94a4a]">{validate}</font>
          </b>
        </label>
      ) : (
        <></>
      )}
      <input
        id={id}
        {...inputProps}
        onChange={(e) => {
          let value = null;
          if (e.target.value) {
            value = e.target.value;
            value = value.replace(/[^A-Za-z0-9]/ig, '')
          }
          onChangeInput && onChangeInput(value);
          inputProps.onChange(value);
        }}
        disabled={disabled}
        className={`${
          disabled && "bg-[#ededed] disabled:cursor-not-allowed "
        } ${
          error && error?.message
            ? "border-1 border-rose-500 rounded block w-full  outline-none py-2 px-3"
            : "focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full  outline-none py-2 px-3"
        }`}
      />

      {error && error?.message && (
        <p className="absolute mt-1 mb-1 text-red-500 text-xs text-left ">
          {error.message}
        </p>
      )}
    </>
  );
};

export default Input;

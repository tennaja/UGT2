import React from "react";
import { FaInfo } from 'react-icons/fa';
import { Tooltip } from "react-tooltip";
const Input = (props) => {
  const {
    register,
    label,
    validate,
    error,
    id,
    onChangeInput,
    disabled,
    iconsid,
    messageTooltip,
    initValue = null,
    ...inputProps
  } = props;
  {
    initValue && inputProps.onChange(initValue);
  }
  return (
    <>
      {label ? (
        <label className="mb-1 " htmlFor={id}>
        <b >
          {label}
          <font className="text-[#f94a4a]">{validate}</font>
          {iconsid ? (
            <>
            <span id={iconsid} style={{ cursor: 'pointer', display: 'inline-flex',alignItems: 'center', marginLeft: '0.5rem' ,color: '#98FB98', // Text and icon color
    backgroundColor: '#E9F8E9', // Background color
    padding: '0.4rem', // Padding to make space between text/icon and background
    borderRadius: '550px' }}>
              <FaInfo size={13} style={{color: '#87BE33'}} />
            </span>
            <Tooltip
            anchorSelect={`#${iconsid}`}
            content={messageTooltip}
            style={{
              backgroundColor: '#fff', // Background color
              color: '#000',               // Text color
              border: '2px solid #66CC66', // Border color (green)
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Box shadow
              borderRadius: '8px'          // Optional: rounded corners
            }}
          /></>
          ) : null}
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
            value = value.replace(/[^A-Za-z0-9\s\-./\[\]\{\}]/g, '')
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

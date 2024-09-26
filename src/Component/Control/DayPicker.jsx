import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import FocusTrap from "focus-trap-react";
import { DayPicker } from "react-day-picker";
import { usePopper } from "react-popper";
import "react-day-picker/dist/style.css";
import { convertDateTimeToDisplayDate } from "../../Utils/DateTimeUtils";
import { FaCalendarAlt } from "react-icons/fa";

export default function DatePicker(props) {
  const {
    register,
    isDisable = false,
    label,
    validate,
    error,
    id,
    onChangeInput,
    onCalDisableDate,
    formatDate,
    currentDate,
    defaultValue, // New prop for defaultValue
    ...inputProps
  } = props;

  const [selected, setSelected] = useState();
  const [inputValue, setInputValue] = useState("");
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef(null);
  const buttonRef = useRef(null);
  const [popperElement, setPopperElement] = useState(null);
  const [isFirstTimeInit, setIsFirstTimeInit] = useState(true);

  const yearForSelect = new Date().getFullYear();
  const yearMinus100 = yearForSelect - 100;
  const yearPlus100 = yearForSelect + 100;
  const popper = usePopper(popperRef.current, popperElement, {
    placement: "bottom-start",
  });

  useEffect(() => {
    if (isFirstTimeInit && inputProps.value) {
      const initDate = new Date(inputProps.value);
      handleDaySelect(initDate);
    }
  }, [inputProps.value]);

  useEffect(() => {
    if (!inputProps.value) {
      setInputValue("");
      setSelected(null);
    }
  }, [inputProps.value]);

  useEffect(() => {
    // Set default value if it exists
    if (defaultValue) {
      const defaultDate = new Date(defaultValue);
      handleDaySelect(defaultDate);
    }
  }, [defaultValue]);

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleDaySelect = (date) => {
    setIsFirstTimeInit && setIsFirstTimeInit(false);
    setSelected(date);
    if (date) {
      const displayDate = convertDateTimeToDisplayDate(
        date,
        formatDate ? formatDate : "d MMMM yyyy"
      );
      const dateValue = format(new Date(date), "yyyy-MM-dd");
      inputProps.onChange(dateValue);
      setInputValue(displayDate);
      onChangeInput && onChangeInput(date);
      closePopper();
    } else {
      setInputValue("");
      inputProps.onChange(null);
      onChangeInput && onChangeInput(null);
    }
  };

  return (
    <div>
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

      <div ref={popperRef}>
        <div
          className={`flex  items-center justify-between ${
            isDisable && "bg-[#ededed] disabled:cursor-not-allowed "
          } ${
            error
              ? "border-1 border-rose-500 rounded block w-full  outline-none "
              : "focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full  outline-none "
          }`}
        >
          <input
            size={12}
            type="text"
            placeholder={"dd/mm/yyyy"}
            value={inputValue}
            defaultValue={defaultValue} // Set defaultValue
            disabled={isDisable}
            onClick={handleButtonClick}
            className={`${
              isDisable && "bg-[#ededed] disabled:cursor-not-allowed "
            } rounded w-full py-2 px-3 outline-none cursor-pointer`}
          />
          <FaCalendarAlt
            onClick={!isDisable && handleButtonClick}
            className={`${
              isDisable
                ? "bg-[#ededed] disabled:cursor-not-allowed "
                : " cursor-pointer"
            } text-slate-400 mr-2 `}
          />
        </div>

        {error && (
          <p className="mt-1 mb-1 text-red-500 text-xs text-left">
            {error.message}
          </p>
        )}
      </div>

      {isPopperOpen && (
        <>
          {/* Overlay to block background interactions */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={closePopper}
          />

          <FocusTrap
            active
            focusTrapOptions={{
              initialFocus: false,
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              onDeactivate: closePopper,
              fallbackFocus: buttonRef.current || undefined,
            }}
          >
            <div
              tabIndex={-1}
              style={popper.styles.popper}
              className="dialog-sheet z-50" // Set a high z-index to place it above the overlay
              {...popper.attributes.popper}
              ref={setPopperElement}
              role="dialog"
              aria-label="DayPicker calendar"
            >
              <DayPicker
                {...inputProps}
                initialFocus={isPopperOpen}
                mode="single"
                captionLayout="dropdown-buttons"
                fromYear={yearMinus100}
                toYear={yearPlus100}
                defaultMonth={selected}
                selected={selected}
                onSelect={handleDaySelect}
                className="bg-white shadow-xl"
                disabled={onCalDisableDate}
              />
            </div>
          </FocusTrap>
        </>
      )}
    </div>
  );
}

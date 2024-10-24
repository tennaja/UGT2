import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import FocusTrap from "focus-trap-react";
import { DayPicker } from "react-day-picker";
import { usePopper } from "react-popper";
import "react-day-picker/dist/style.css";
import { convertDateTimeToDisplayDate } from "../../Utils/DateTimeUtils";
import { FaCalendarAlt } from "react-icons/fa";
import ModalConfirm from "../Control/Modal/ModalConfirm";
import ModalWarning from "../Control/Modal/ModalWarning";
import ModalConfirmDateWarning from "../Control/Modal/ModalConfirmDatewarning";

export default function DatePickerEndDate(props) {
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
    defaultValue,
    isPortrun,
    ...inputProps
  } = props;

  const [selected, setSelected] = useState();
  const [inputValue, setInputValue] = useState("");
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [previousDate, setPreviousDate] = useState(null); // Keep track of the previous date
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
  const [isModalPortrunOpen, setIsModalPortrunOpen] = useState(false);  // Modal state

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
        setIsFirstTimeInit(false);  // Disable first-time flag after initializing
        setSelected(initDate);  // Set the selected date without calling handleDaySelect
        setInputValue(
          convertDateTimeToDisplayDate(initDate, formatDate ? formatDate : "d MMMM yyyy")
        );
        onChangeInput && onChangeInput(initDate);
      }
  }, [inputProps.value,isFirstTimeInit]);

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
      if (isFirstTimeInit && inputProps.value) {
        setIsFirstTimeInit(false);  // Disable first-time flag after initializing
        setSelected(defaultDate);  // Set the selected date without calling handleDaySelect
        setInputValue(
          convertDateTimeToDisplayDate(defaultDate, formatDate ? formatDate : "d MMMM yyyy")
        );
      }
    }
  }, [defaultValue,isFirstTimeInit]);

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  // Open modal to confirm date change
  const handleDaySelect = (date) => {
    setPreviousDate(selected);  // Save previous date before changing
    setSelected(date);  // Update selected date
    if(date !== undefined && isPortrun){
      setIsModalPortrunOpen(true);  // Open modal for confirmation
    }else {
      setIsModalOpen(true);
    }
  };

  // Confirm date change
  const handleConfirmDateChange = () => {
    const displayDate = convertDateTimeToDisplayDate(
      selected,
      formatDate ? formatDate : "d MMMM yyyy"
    );
    const dateValue = format(new Date(selected), "yyyy-MM-dd");
    inputProps.onChange(dateValue);
    setInputValue(displayDate);
    onChangeInput && onChangeInput(selected);
    closePopper();
    setIsModalOpen(false);  // Close modal
    setIsModalPortrunOpen(false)
  };

  // Cancel date change and revert to previous date
  const handleCancelDateChange = () => {
    setSelected(previousDate);  // Revert to previous date
    setInputValue(convertDateTimeToDisplayDate(previousDate, formatDate ? formatDate : "d MMMM yyyy"));
    setIsModalOpen(false);  // Close modal
    setIsModalPortrunOpen(false)
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
      ) : null}

      <div ref={popperRef}>
        <div
          className={`flex items-center justify-between ${
            isDisable && "bg-[#ededed] disabled:cursor-not-allowed "
          } ${
            error
              ? "border-1 border-rose-500 rounded block w-full outline-none "
              : "focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full outline-none "
          }`}
        >
          <input
            size={12}
            type="text"
            placeholder={"dd/mm/yyyy"}
            value={inputValue}
            defaultValue={defaultValue}
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
            className="dialog-sheet z-1"
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
      )}

      {/* Modal for confirming date change */}
      {isModalOpen && (
        <ModalConfirm
          onClickConfirmBtn={handleConfirmDateChange}
          onCloseModal={handleCancelDateChange}
          title={"Confirm Changes?"}
          content={`Would you confirm the change of Start Date/End Date from ${convertDateTimeToDisplayDate(previousDate, formatDate ? formatDate : "d MMMM yyyy")} to ${convertDateTimeToDisplayDate(selected, formatDate ? formatDate : "d MMMM yyyy")}?`}
        />
      )}

      
      {isModalPortrunOpen && (
        <ModalConfirmDateWarning
          onClickConfirmBtn={handleConfirmDateChange}
          onCloseModal={handleCancelDateChange}
          title={"Change End Date during Portfolio Operation?"}
          content={`Would you confirm the change of Start Date/End Date from ${convertDateTimeToDisplayDate(previousDate, formatDate ? formatDate : "d MMMM yyyy")} to ${convertDateTimeToDisplayDate(selected, formatDate ? formatDate : "d MMMM yyyy")}?`}
        />
      )}
    </div>
  );
}

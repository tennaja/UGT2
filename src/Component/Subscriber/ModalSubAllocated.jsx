import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "../Control/Input";
import MySelect from "../Control/Select";
import { initialvalueForSelectField } from "../../Utils/FuncUtils";
import { Modal, ScrollArea } from "@mantine/core";
import InputSubAllow from "./InputSubAllow";

const ModalSubAllocated = (props) => {
  const {
    // register,
    handleSubmit,
    resetField,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const {
    editStatus,
    onCloseModal,
    listData,
    allowcatedEnergyData,
    allowcatedEnergyDataEdit,
    allowcatedEnergyDataIndex,
    buttonTypeColor = "primary",
    yearStart,
    yearEnd
  } = props;

  const [dropDownListYear, setDropDownListYear] = useState([]);

  const onlyPositiveNum = /^[+]?\d+([.]\d+)?$/;

  const onEdit = (yearList) => {
    const tempYear = initialvalueForSelectField(
      yearList,
      "year",
      allowcatedEnergyDataEdit.year
    );

    setValue("year", tempYear);

    setSelectedOption(allowcatedEnergyDataEdit.allocateType);

    if (allowcatedEnergyDataEdit.allocateType == "MONTHLY") {
      setValue("MONTHLY", parseFloat(allowcatedEnergyDataEdit.amount01).toFixed(2));
    }
    setValue("month0", parseFloat(allowcatedEnergyDataEdit.amount01).toFixed(2));
    setValue("month1", parseFloat(allowcatedEnergyDataEdit.amount02).toFixed(2));
    setValue("month2", parseFloat(allowcatedEnergyDataEdit.amount03).toFixed(2));
    setValue("month3", parseFloat(allowcatedEnergyDataEdit.amount04).toFixed(2));
    setValue("month4", parseFloat(allowcatedEnergyDataEdit.amount05).toFixed(2));
    setValue("month5", parseFloat(allowcatedEnergyDataEdit.amount06).toFixed(2));
    setValue("month6", parseFloat(allowcatedEnergyDataEdit.amount07).toFixed(2));
    setValue("month7", parseFloat(allowcatedEnergyDataEdit.amount08).toFixed(2));
    setValue("month8", parseFloat(allowcatedEnergyDataEdit.amount09).toFixed(2));
    setValue("month9", parseFloat(allowcatedEnergyDataEdit.amount10).toFixed(2));
    setValue("month10", parseFloat(allowcatedEnergyDataEdit.amount11).toFixed(2));
    setValue("month11", parseFloat(allowcatedEnergyDataEdit.amount12).toFixed(2));
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    const yearData = [];
    console.log("Year Start",yearStart)
    console.log("Year End",yearEnd)
    for (let i = 0; i < listData?.length; i++) {
      yearData.push(listData[i]?.year);
    }

    for (let i = yearStart; i <= yearEnd; i++) {
      yearList.push({
        value: Number(i),
        year: i.toString(),
      });
    }

    const filteredYearList = yearList.filter(
      (item) => !yearData.includes(item.value)
    );

    setDropDownListYear(filteredYearList);

    if (editStatus === true) {
      onEdit(yearList);
    }
  }, []);

  const MONTHLY = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const [selectedOption, setSelectedOption] = useState("MONTHLY");
  const handleRadioChange = (e) => {
    if (e.target.value === "CUSTOM") {
      /*setValue("MONTHLY", "");
      setValue("month0", "");
      setValue("month1", "");
      setValue("month2", "");
      setValue("month3", "");
      setValue("month4", "");
      setValue("month5", "");
      setValue("month6", "");
      setValue("month7", "");
      setValue("month8", "");
      setValue("month9", "");
      setValue("month10", "");
      setValue("month11", "");*/
    } else {
      const monthlyValue = getValues("MONTHLY") ?? 0;
      setValue("MONTHLY", monthlyValue);
      setValue("month0", monthlyValue);
      setValue("month1", monthlyValue);
      setValue("month2", monthlyValue);
      setValue("month3", monthlyValue);
      setValue("month4", monthlyValue);
      setValue("month5", monthlyValue);
      setValue("month6", monthlyValue);
      setValue("month7", monthlyValue);
      setValue("month8", monthlyValue);
      setValue("month9", monthlyValue);
      setValue("month10", monthlyValue);
      setValue("month11", monthlyValue);
    }
    setSelectedOption(e.target.value);
  };
  const onClickOk = (data) => {
    let allocateEnergyAmount = {};
    if (selectedOption == "CUSTOM") {
      allocateEnergyAmount = {
        year: parseInt(data?.year?.value),
        amount01: Number(data?.month0),
        amount02: Number(data?.month1),
        amount03: Number(data?.month2),
        amount04: Number(data?.month3),
        amount05: Number(data?.month4),
        amount06: Number(data?.month5),
        amount07: Number(data?.month6),
        amount08: Number(data?.month7),
        amount09: Number(data?.month8),
        amount10: Number(data?.month9),
        amount11: Number(data?.month10),
        amount12: Number(data?.month11),
        allocateType: selectedOption,
      };
    } else {
      allocateEnergyAmount = {
        year: parseInt(data?.year?.value),
        amount01: Number(data?.MONTHLY),
        amount02: Number(data?.MONTHLY),
        amount03: Number(data?.MONTHLY),
        amount04: Number(data?.MONTHLY),
        amount05: Number(data?.MONTHLY),
        amount06: Number(data?.MONTHLY),
        amount07: Number(data?.MONTHLY),
        amount08: Number(data?.MONTHLY),
        amount09: Number(data?.MONTHLY),
        amount10: Number(data?.MONTHLY),
        amount11: Number(data?.MONTHLY),
        amount12: Number(data?.MONTHLY),
        allocateType: selectedOption,
      };
    }
    if (editStatus === false) {
      allowcatedEnergyData(allocateEnergyAmount);
    } else {
      allowcatedEnergyDataIndex(
        allocateEnergyAmount,
        allowcatedEnergyDataEdit?.index
      );
    }
    onCloseModal();
  };
  const onChangeMonthly = (value) => {
    let val = parseFloat(value).toFixed(2);
    setValue("month0", value == null ? "" : val);
    setValue("month1", value == null ? "" : val);
    setValue("month2", value == null ? "" : val);
    setValue("month3", value == null ? "" : val);
    setValue("month4", value == null ? "" : val);
    setValue("month5", value == null ? "" : val);
    setValue("month6", value == null ? "" : val);
    setValue("month7", value == null ? "" : val);
    setValue("month8", value == null ? "" : val);
    setValue("month9", value == null ? "" : val);
    setValue("month10", value == null ? "" : val);
    setValue("month11", value == null ? "" : val);
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
    <Modal
      size="xl"
      opened={true}
      onClose={() => onClickOk && onClickOk(false)}
      withCloseButton={false}
      closeOnClickOutside={false}
      centered
    >
      <div className="pt-4 px-4 pb-2">
        <h6 className="text-PRIMARY_TEXT font-semibold">
        Contracted energy amount
        </h6>

        <form className="text-sm">
          <div className="md:col-span-2 mt-4 w-80">
            <Controller
              name="year"
              control={control}
              defaultValue={null}
              rules={{
                required: "This field is required",
              }}
              render={({ field }) => (
                <MySelect
                  {...field}
                  id={"year"}
                  options={dropDownListYear}
                  displayProp={"year"}
                  valueProp={"value"}
                  label={"Year"}
                  error={errors.year}
                  validate={" *"}
                />
              )}
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <strong>
              Contracted energy amount
              <span className="text-red-500"> *</span>
            </strong>
          </div>

          <div className="pt-3">
            <div className="flex items-center space-x-2">
              <input
                id="MONTHLY"
                value="MONTHLY"
                type="radio"
                checked={selectedOption === "MONTHLY"}
                onChange={handleRadioChange}
                className="form-radio h-4 w-4 focus:ring-green-400 checked:bg-green-600 checked:border-transparent"
              />
              <span className="text-gray-700">Monthly</span>
              {selectedOption == "MONTHLY" && (
                <div className="flex items-center">
                  <div className="md:col-span-3">
                    <Controller
                      name="MONTHLY"
                      control={control}
                      rules={{
                        required:
                          selectedOption === "MONTHLY"
                            ? "This field is required"
                            : "",
                        pattern: {
                          value: onlyPositiveNum,
                          message: "Please enter only numeric characters.",
                        },
                      }}
                      render={({ field }) => (
                        <InputSubAllow
                          {...field}
                          id={"MONTHLY"}
                          type={"number"}
                          label={""}
                          placeholder={"0"}
                          disabled={selectedOption === "MONTHLY" ? false : true}
                          onKeyDown={(e) => {
                            // Prevent invalid characters like 'e', '+', '-'
                            if (['e', 'E', '+','-'].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onBlur={(e) => {
                            let val = parseFloat(e?.target?.value).toFixed(2);
                            setValue("MONTHLY", val);
                          }}
                          error={
                            selectedOption === "MONTHLY" ? errors.MONTHLY : ""
                          }
                          onChangeInput={onChangeMonthly}
                          validate={" *"}
                        />
                      )}
                    />
                  </div>
                  <span className="ml-3"> kWh</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="CUSTOM"
                value="CUSTOM"
                checked={selectedOption === "CUSTOM"}
                onChange={handleRadioChange}
                className="form-checkbox h-4 w-4 text-red-500 focus:ring-green-400"
              />
              <label htmlFor="CUSTOM">Custom</label>
            </div>
          </div>

          <div className="pt-4">
            <div className="grid grid-cols-4 px-4 gap-4 font-semibold">
              <div className="col-span-1 text-center text-gray-500 text-sm">
                Month
              </div>
              <div className="col-span-3 text-center text-gray-500 text-sm">
                Contracted energy amount (kWh)
              </div>
            </div>
            <hr className="mx-4 my-1" />
            <ScrollArea h={280} type="auto" scrollbarSize={2}>
              {MONTHLY.map((item, index) => (
                <div key={index}>
                  <div className="grid grid-cols-4 px-4 gap-4">
                    <div className="col-span-1 flex items-center justify-center">
                      {item}
                    </div>
                    <div className="col-span-3 px-5">
                      <Controller
                        name={"month" + index}
                        control={control}
                        rules={{
                          required:
                            selectedOption === "CUSTOM"
                              ? "This field is required"
                              : "",
                          pattern: {
                            value: onlyPositiveNum,
                            message: "Please enter only numeric characters.",
                          },
                        }}
                        render={({ field }) => (
                          <InputSubAllow
                            {...field}
                            id={"month" + index}
                            type={"number"}
                            label={""}
                            placeholder={"0"}
                            disabled={
                              selectedOption === "CUSTOM" ? false : true
                            }
                            onKeyDown={(e) => {
                              // Prevent invalid characters like 'e', '+', '-'
                              if (['e', 'E', '+','-'].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            onBlur={(e) => {
                              let val = parseFloat(e?.target?.value).toFixed(2);
                              setValue("month" + index, val);
                            }}
                            validate={" *"}
                            error={
                              selectedOption === "CUSTOM"
                                ? errors[`month${index}`]
                                : ""
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                  <hr className="mx-4 my-1" />
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="flex justify-center gap-3 p-2 mt-4">
            <button
              onClick={onCloseModal}
              className="w-25 rounded shadow-sm px-4 py-2 font-normal bg-[#EFEFEF] hover:bg-[#78829D] hover:text-white"
          >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onClickOk)}
              className={`${getButtonColor()} w-25 rounded shadow-sm px-4 py-2 font-semibold text-white sm:text-sm hover:bg-[#4D6A00] `}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalSubAllocated;

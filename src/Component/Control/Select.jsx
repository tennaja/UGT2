import { start } from "@popperjs/core";
import { tr } from "date-fns/locale";
import React from "react";
import Select from "react-select";

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' }
// ]

const MySelect = (props) => {
  
  const {
    withNullValue = false,
    disable = false,
    options,
    id,
    error,
    valueProp,
    displayProp,
    onChangeInput,
    label,
    typeSelect = 1,
    placeholder = "Please Select",
    bgColor,
    fontSize = "none",
    validate,
    searchable = true,
    ...inputProps
  } = props;

  const getOptionLabel = (option) => option[displayProp];
  const getOptionValue = (option) => option[valueProp];

  
  const renderSelectType1 = () => {
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
        <Select
          {...inputProps}
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isSearchable={searchable}
          placeholder={placeholder}
          isDisabled={disable}
          onChange={(value) => {
            onChangeInput && onChangeInput(value);
            inputProps.onChange && inputProps.onChange(value);
            // if(selectedValue.length>0){
            //     onChangeInput&&onChangeInput(selectedValue[0])
            //     inputProps.onChange&&inputProps.onChange(value.target.value)
            // }else{
            //     onChangeInput&&onChangeInput(null)
            //     inputProps.onChange&&inputProps.onChange(null)
            // }
          }}
          styles={{
            option: (base, state) => ({
              ...base,
              textAlign: start,
              cursor: "pointer",
              fontSize: fontSize,
              padding: "10px",
              "&:hover": { backgroundColor: "#87BE33", color: "white" },
              backgroundColor: state.isSelected ? "#87BE33" : "white",
            }),
            singleValue: (base) => ({
              ...base,
              color: "black",
              // fontWeight: 'bold',
              width: "100%",
              textAlign: start,
              paddingLeft: "5px",
            }),
            control: (base, state) => ({
              ...base,
              cursor: "pointer",
              fontSize: fontSize,
              borderColor: error && "red",
              boxShadow: error && "none",
              backgroundColor: bgColor ? bgColor : base.backgroundColor,
              width: "100%",
              "&:hover": { borderColor: error && "red" },
            }),
            container: (base, state) => ({
              ...base,
              width: "100%",
            }),
            placeholder: (base) => ({
              ...base,
              textAlign: start,
              width: "100%",
            }),
          }}
        />

        {error && (
          <p className="mt-1 mb-1 text-red-500 text-xs text-left">
            {error.message}
          </p>
        )}
      </>
    );
  };

  const renderSelectType2 = () => {
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
        <Select
          {...inputProps}
          options={options}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isSearchable={false}
          isClearable
          placeholder={placeholder}
          isDisabled={disable}
          onChange={(value) => {
            onChangeInput && onChangeInput(value);
            inputProps.onChange && inputProps.onChange(value);
          }}
          styles={{
            option: (base, state) => ({
              ...base,
              textAlign: start,
              cursor: "pointer",
              padding: "10px",
              "&:hover": { backgroundColor: "#87BE33", color: "white" },
              backgroundColor: state.isSelected ? "#87BE33" : "white",
            }),
            singleValue: (base) => ({
              ...base,
              color: "black",
              fontWeight: "bold",
              width: "100%",
              textAlign: start,
              paddingLeft: "5px",
            }),
            control: (base, state) => ({
              ...base,
              cursor: "pointer",
              borderColor: error && "red",
              borderWidth: 0,
              boxShadow: error && "none",
              "&:hover": { borderColor: error && "red" },
            }),
            placeholder: (base) => ({
              ...base,
              color: "black",
              fontWeight: "bold",
              width: "100%",
            }),
            indicatorContainer: (base) => ({
              ...base,
              color: "black",
              fontWeight: "bold",
            }),
          }}
        />

        {error && (
          <p className="mt-1 mb-1 text-red-500 text-xs text-left">
            {error.message}
          </p>
        )}
      </>
    );
  };
  return typeSelect == 1 ? renderSelectType1() : renderSelectType2();
};

export default MySelect;

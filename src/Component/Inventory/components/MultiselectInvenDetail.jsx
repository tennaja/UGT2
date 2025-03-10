import React, { useEffect, useState } from "react";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <div class="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
          <input
            class=" relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] 
            border-[0.125rem] border-solid border-neutral-200 outline-none before:pointer-events-none 
            before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full 
            before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] 
            checked:border-primary checked:bg-[#FFFFFF] checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px 
            checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 
            checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid 
            checked:after:border-[#33BFBF] checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer 
            hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] 
            focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] 
            focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] 
            focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] 
            focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] 
            checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] 
            checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] 
            checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white 
            checked:focus:after:bg-transparent dark:border-neutral-200 dark:checked:border-primary dark:checked:bg-[#FFFFFF] 
            dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
            type="checkbox"
            checked={props.isSelected}
            value=""
            id="checkboxChecked"
          />
          <label
            className="cursor-pointer text-sm ml-2 leading-6	"
            // for="checkboxChecked"
          >
            {props.label}
          </label>
        </div>
      </components.Option>
    </div>
  );
};

const ValueContainer = ({ children, ...props }) => {
  let [values, input] = children;
  let placeholder = props.selectProps.placeholder;
  let splitText = placeholder.split(" "); // splits the text by space
  let terms = splitText[splitText.length - 1]; // gets the last word
  if (Array.isArray(values)) {
    values = `${values.length} ${terms.toLowerCase()} selected`;
  }

  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  );
  /* 
  console.log("has value", props.getValue);
  const length = props.children?.length;
  let tmpChildren = [...children];
  let placeholder = props.selectProps.placeholder;
  let splitText = placeholder.split(" "); // splits the text by space
  let terms = splitText[splitText.length - 1]; // gets the last word

  if (length >= 1) {
    console.log(children[0][0]);
    tmpChildren[0] = `${length} selected ${terms.toLowerCase()}`;
  }

  return (
    <div className="flex items-center   tabular-nums  bg-yellow-300 ">
      {props.getValue().length > 0 ? (
        <FaCheckCircle className="mr-2 text-[#87BE33]" />
      ) : (
        <components.ValueContainer {...props}>
          {tmpChildren}
        </components.ValueContainer>
      )}
    </div>
  ); */
};

const MultiselectInvenDetail = (props) => {
  const {
    error,
    placeholder,
    onChangeInput,
    options = [],
    valueProp = "value",
    disable = false,
    displayProp = "label",
    isSearchable = false,
    wrapText = false,
    size = "auto",
    value=[]
  } = props;
  const [optionSelected, setOptionSelected] = useState(value);

  const optionsWithSelectAll =
    options.length > 0
      ? [{ [valueProp]: 99, [displayProp]: "Select All" }, ...options]
      : options;
  const handleChange = (selected) => {
    // if(selected.length>0){
    //     selected[0][valueProp] == 99
    // }
    setOptionSelected(selected);
    onChangeInput && onChangeInput(selected);
  };

  const customFilter = (option, searchText) => {
    if (option.label.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  const getOptionLabel = (option) => option[displayProp];
  const getOptionValue = (option) => option[valueProp];

  useEffect(()=>{
      if (!value || value.length === 0) {
        setOptionSelected(null); // เคลียร์ค่าที่เลือก
      }
    },[value])

  return (
    <ReactSelect
      options={options}
      isMulti
      closeMenuOnSelect={false}
      isSearchable={isSearchable}
      hideSelectedOptions={false}
      isDisabled={disable}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      components={{
        Option,
        ValueContainer,
      }}
      onChange={handleChange}
      allowSelectAll={true}
      value={optionSelected}
      isClearable={true}
      placeholder={placeholder}
      filterOption={customFilter}
      error={error}
      styles={{
        option: (base, state) => ({
          //   ...base,
          cursor: "pointer",
          padding: "10px",
          width:
            size == "auto"
              ? "auto"
              : size == "large"
              ? "350px"
              : size == "medium"
              ? "275px"
              : "200px",
          whiteSpace: wrapText ? "pre-wrap" : "nowrap",
          overflow: "hidden",

          "&:hover": { backgroundColor: "#87BE33", color: "white" },
        }),
        menu: (base, state) => ({
          ...base,
          width: "auto", // Set the desired width here
          minWidth: "200px",
        }),
        valueContainer: (base) => ({
          ...base,
          color: "black",
          // fontWeight: "bold",
          width: "100%",
          cursor: "pointer",
          // "&:disable":{cursor:'not-allowed'}
        }),
      }}
      classNames={{
        control: (state) => "border-1 cursor-pointer shadow-none rounded",
        valueContainer: (state) => " cursor-pointer  flex mx-0 pl-2",
        indicatorsContainer: (state) => " cursor-pointer  flex mx-0  gap-0 p-0",
        clearIndicator: (state) => " cursor-pointer  p-0",
        dropdownIndicator: (state) => " cursor-pointer  p-1",
        // option:(state)=> `cursor-pointer bg-green-500`
      }}
    />
  );
};

export default MultiselectInvenDetail;

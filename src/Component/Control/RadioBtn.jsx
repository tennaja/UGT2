import React, { useState, useEffect, useCallback } from "react";

const Radiobtn = (props) => {
  const { value = [], label, error, validate, id, onChange, ...restProps } = props;

  const [checking, setChecking] = useState(() =>
    value.length
      ? value.map((item) => ({
          ...item,
          Checked: item.Checked === "True" || item.Checked === true,
        }))
      : [
          { name: "Meteringdata", Checked: false },
          { name: "Contractsalesinvoice", Checked: false },
          { name: "Other", Checked: false, otherText: "" },
        ]
  );

  const [showError, setShowError] = useState(false);

  const onOptionChange = useCallback((index) => {
    setChecking((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, Checked: !item.Checked } : item
      )
    );
  }, []);

  const onOtherTextChange = useCallback((index, text) => {
    setChecking((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, otherText: text } : item
      )
    );
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(checking);
    }
  }, [checking, onChange]);

  useEffect(() => {
    const isDifferent = value.some((item, index) => {
      const currentItem = checking[index];
      return (
        currentItem?.Checked !== (item.Checked === "True" || item.Checked === true) ||
        currentItem?.otherText !== item.otherText
      );
    });

    if (isDifferent) {
      setChecking(
        value.length
          ? value.map((item) => ({
              ...item,
              Checked: item.Checked === "True" || item.Checked === true,
              otherText: item.otherText || "",
            }))
          : [
              { name: "Meteringdata", Checked: false },
              { name: "Contractsalesinvoice", Checked: false },
              { name: "Other", Checked: false, otherText: "" },
            ]
      );
    }
  }, [value]);

  useEffect(() => {
    // Check if at least one box is checked
    const isAnyChecked = checking.some((item) => item.Checked);
    setShowError(!isAnyChecked);
  }, [checking]);

  return (
    <>
      {label && (
        <label className="mb-1" htmlFor={id}>
          <b>{label}
          <font className="text-[#f94a4a]">{validate}</font>
          </b>
        </label>
      )}
      <form {...restProps}>
        {checking.map((item, index) => (
          <div key={index} className="flex items-center mb-4 mt-4">
            <input
              id={`default-checkbox-${index + 1}`}
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={item.Checked}
              onChange={() => onOptionChange(index)}
              {...restProps}  // Pass restProps to input element
            />
            <label
              htmlFor={`default-checkbox-${index + 1}`}
              className="ms-2 text-sm font-semibold text-gray-900 "
            >
              {item.name}
            </label>
            {item.name === "Other" && item.Checked && (
              <input
                className="ml-3 focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full outline-none py-2 px-3"
                placeholder="Specify other..."
                value={item.otherText || ""}
                onChange={(e) => onOtherTextChange(index, e.target.value)}
                {...restProps}  // Pass restProps to input element
              />
            )}
          </div>
        ))}
      </form>
      {(showError || error) && (
        <p className="mt-1 mb-1 text-red-500 text-xs text-left">
          {error?.message || "Please select at least one option."}
        </p>
      )}
    </>
  );
};

export default Radiobtn;

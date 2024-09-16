import React, { useState, useEffect, useCallback } from "react";

const cleanInputText = (inputText) => {
  const allowedPattern = /[^A-Za-z0-9\s\-.,;:!?'"@&%$#+=^*\/\\~|_()\[\]\{\}<>©®™§¶÷×±√∞≠≤≥\u00C0-\u00FF\u0152\u0153]/g;
  return inputText.replace(allowedPattern, '');
};

const Radiobtn = ({ value = [], label, error, validate, id, onChange, ...restProps }) => {
  const [checking, setChecking] = useState(() =>
    value.length
      ? value.map((item) => ({
          ...item,
          Checked: item.Checked === "True" || item.Checked === true,
        }))
      : [
          { name: "Metering data", Checked: false },
          { name: "Contract sales invoice", Checked: false },
          { name: "Other", Checked: false, otherText: "" },
        ]
  );

  const onOptionChange = useCallback((index) => {
    setChecking((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, Checked: !item.Checked } : item
      )
    );
  }, []);

  const onOtherTextChange = useCallback((index, text) => {
    const cleanedText = cleanInputText(text);
    setChecking((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, otherText: cleanedText } : item
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
              { name: "Metering data", Checked: false },
              { name: "Contract sales invoice", Checked: false },
              { name: "Other", Checked: false, otherText: "" },
            ]
      );
    }
  }, [value]);

  return (
    <>
      {label && (
        <label className="mb-1" htmlFor={id}>
          <b>{label}<font className="text-[#f94a4a]">{validate}</font></b>
        </label>
      )}
      <div {...restProps}>
        {checking.map((item, index) => (
          <div key={index} className="flex items-center mb-4 mt-4">
            <input
              id={`default-checkbox-${index + 1}`}
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={item.Checked}
              onChange={() => onOptionChange(index)}
              {...restProps}
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
                {...restProps}
              />
            )}
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 mb-1 text-red-500 text-xs text-left">
          {error.message || "Please select at least one option."}
        </p>
      )}
    </>
  );
};

export default Radiobtn;

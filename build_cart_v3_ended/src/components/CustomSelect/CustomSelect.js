import { Text } from "@chakra-ui/react";
import React from "react";
import Select from "react-select";

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  padding = "5px",
  isMulti = false,
  label,
  isRequired,
  isDisabled,
  isLoading,
  controlShouldRenderValue = true,
}) => {
  return (
    <>
      <Text fontSize="14px">
        {label && label}
        {isRequired && <span style={{ color: "red", margin: "0 8px" }}>*</span>}
      </Text>
      <Select
        options={options}
        value={value}
        isMulti={isMulti}
        isDisabled={isDisabled}
        placeholder={placeholder}
        onChange={onChange}
        isLoading={isLoading}
        styles={{
          control: (
            baseStyles,
            { data, isDisabled, isFocused, isSelected }
          ) => ({
            ...baseStyles,
            borderColor: isDisabled
              ? "#ffffff"
              : isSelected
              ? "#f5862e"
              : isFocused
              ? "#f5862e"
              : "#999999",
            padding: padding,
            outline: "none",
            fontSize: "16px",
            boxShadow: "none",
            borderRadius: "8px",
            width: "100%",
            ":hover": {
              border: "1px solid #c2c7ce",
            },
          }),
        }}
        className="role-type-select"
        classNamePrefix="select"
        controlShouldRenderValue={controlShouldRenderValue}
      />
    </>
  );
};

export default CustomSelect;

import {
  Flex,
  FormControl,
  FormLabel,
  Input as InputBox,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import PhoneInput from "react-phone-input-2";
import CalendarIcon from "./Icons/Calendar";
import moment from "moment";

export default function Input({
  id = "",
  label = "",
  isRequired = false,
  type = "text",
  readOnly = false,
  onChange = null,
  isDisabled = false,
  size = "lg",
  placeholder = `Enter ${label.toLowerCase()}`,
  pl = 0,
  rightIcon = null,
  leftIcon = null,
  css,
  ...rest
}) {
  const [active, setActive] = useState(false);
  const [inputType, setInputType] = useState(type);

  return (
    <FormControl
      id={id}
      isReadOnly={readOnly}
      isDisabled={isDisabled}
      isRequired={isRequired}
      pos="relative"
    >
      {label && (
        <FormLabel
          mb="0"
          textTransform="capitalize"
          fontWeight="400"
          fontSize="15px"
        >
          {capitalize(label)}
        </FormLabel>
      )}

      <InputGroup>
        <InputBox
          onChange={onChange}
          placeholder={
            inputType === "password" ? "⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺ ⏺" : placeholder
          }
          type={inputType}
          border="1px solid #999999"
          _focus={{ borderColor: "#F5862E", color: "#F5862E" }}
          size={size}
          min={inputType === "date" ? moment().format("YYYY-MM-DD") : null}
          fontSize="16px"
          rounded="8px"
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          css={css}
          {...rest} // passing other html input props
        />
        {rightIcon && (
          <InputRightElement
            color={active ? "#F5862E" : "#999999"}
            children={rightIcon}
            h="100%"
          />
        )}
        {leftIcon && (
          <InputLeftElement
            color={active ? "#F5862E" : "#999999"}
            children={leftIcon}
            h="100%"
          />
        )}
        {isDisabled && type === "date" && (
          <InputRightElement
            color={active ? "#F5862E" : "#999999"}
            children={<CalendarIcon />}
            h="100%"
          />
        )}
        {type === "password" && (
          <InputRightElement
            h="100%"
            cursor={"pointer"}
            onClick={() => {
              if (inputType === "password") {
                setInputType("text");
              } else {
                setInputType("password");
              }
            }}
          >
            <Flex justify="center" color={"#999999"} alignItems="center">
              {inputType !== "text" ? <FaEye /> : <FaEyeSlash />}
            </Flex>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
}

const InputPhone = ({ value, onChange, label, isRequired, ...rest }) => {
  return (
    <>
      {label && (
        <FormLabel
          mb="0"
          textTransform="capitalize"
          fontWeight="400"
          fontSize="15px"
        >
          {capitalize(label)}{" "}
          {isRequired && (
            <span style={{ color: "red", margin: "0 5px" }}>*</span>
          )}
        </FormLabel>
      )}
      <Flex>
        <PhoneInput
          value={value}
          onChange={onChange}
          defaultCountry="ng"
          country={"ng"}
          id="phone"
          {...rest}
          inputStyle={{
            color: rest.disabled ? "#999" : "initial",
          }}
        />
        <Flex
          align="center"
          color="#999999"
          p="10px 15px"
          h="45px"
          borderRadius="0 8px 8px 0"
          border="1px solid #999999"
          borderLeft="none"
        >
          <FaPhone />
        </Flex>
      </Flex>
    </>
  );
};

export { InputPhone };

const TextArea = ({
  label = "",
  isRequired = false,
  readOnly = false,
  isDisabled = false,
  placeholder = `Enter ${label.toLowerCase()}`,
  value,
  onChange,
  h,
  id = "",
  ...rest
}) => {
  return (
    <FormControl
      id={id}
      isReadOnly={readOnly}
      isDisabled={isDisabled}
      isRequired={isRequired}
      pos="relative"
    >
      {label && (
        <FormLabel
          mb="0"
          textTransform="capitalize"
          fontWeight="400"
          fontSize="15px"
        >
          {capitalize(label)}
        </FormLabel>
      )}
      <Textarea
        placeholder={placeholder}
        value={value}
        _focus={{ borderColor: "#F5862E", color: "#F5862E" }}
        border={"1px solid #999999"}
        onChange={onChange}
        rounded="8px"
        p="10px 15px"
        h={h}
        {...rest}
      />
    </FormControl>
  );
};

export { TextArea };

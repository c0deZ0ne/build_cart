import { Box, Flex, useRadio, useRadioGroup } from "@chakra-ui/react";
import React from "react";

const RadioCard = (props) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderColor={"#999999"}
        borderRadius="40px"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        _checked={{
          bg: "secondary",
          color: "white",
          borderColor: "transparent",
        }}
        px={5}
        minHeight={"40px"}
      >
        {props.children}
      </Box>
    </Box>
  );
};

/**
 * @typedef {import("@chakra-ui/react").ResponsiveValue<import("@chakra-ui/react").SystemCSSProperties['flexDirection']>} FlexDirection
 */

/**
 *
 * @param {object} props
 * @param {Array<string>} props.options
 * @param {string} props.defaultValue
 * @param {(str: string) => void} props.onChange
 * @param {string} props.name
 * @param {FlexDirection} props.direction
 * @param {string} props.gap
 * @returns
 */
function CustomRadioGroup({
  options,
  name,
  defaultValue,
  onChange,
  direction = "row",
  gap = "24px",
  value,
}) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: name,
    defaultValue: defaultValue ? defaultValue : "",
    onChange: (v) => {
      onChange(v);
    },
    value: value,
  });

  const group = getRootProps();

  return (
    <Flex {...group} direction={direction} gap={gap}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </Flex>
  );
}

export default CustomRadioGroup;

import { Button as ButtonBox } from "@chakra-ui/button";
import React from "react";
import { useHistory } from "react-router-dom";

export default function Button({
  children,
  leftIcon,
  border,
  onClick = () => {},
  isLoading = false,
  link = false,
  isSubmit = false,
  size = "lg",
  width,
  fontSize = "16px",
  fontWeight = "500",
  disabled = false,
  full = false,
  background = "#12355A",
  color = "#fff",
  _hover,
  rightIcon,
  variant,
  rounded = "8px",
}) {
  const history = useHistory();

  return (
    <ButtonBox
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={variant ? background : color}
      bg={variant ? "#fff" : background}
      _hover={{
        bg: variant
          ? `${background}29`
          : _hover
          ? `${color}19`
          : `${background}e3`,
      }}
      _active={{
        bg: variant
          ? `${background}29`
          : _hover
          ? `${color}19`
          : `${background}e3`,
      }}
      border={variant ? `1px solid ${background}` : border}
      rounded={rounded}
      size={size}
      as="button"
      onClick={(e) => {
        link ? history.push(link) : onClick(e);
      }}
      isLoading={isLoading}
      loadingText="Please wait ..."
      type={isSubmit ? "submit" : "button"}
      isDisabled={isLoading || disabled}
      minW={full ? "100%" : width}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      variant={variant && "outline"}
    >
      {children}
    </ButtonBox>
  );
}

export function Button2({
  children,
  leftIcon,
  border,
  onClick = () => {},
  isLoading = false,
  link = false,
  isSubmit = false,
  size = "sm",
  width,
  fontSize = "14px",
  fontWeight = "500",
  disabled = false,
  full = false,
  color = "#12355A",
  padding = "20px 30px",
  rightIcon,
  variant,
}) {
  const history = useHistory();

  return (
    <ButtonBox
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      bg={variant ? "#fff" : `${color}29`}
      _hover={{
        bg: `${color}19`,
      }}
      _active={{
        bg: `${color}19`,
      }}
      border={variant ? `1px solid ${color}` : border}
      rounded="7px"
      size={size}
      as="button"
      onClick={(e) => {
        link ? history.push(link) : onClick(e);
      }}
      isLoading={isLoading}
      loadingText="Please wait ..."
      type={isSubmit ? "submit" : "button"}
      isDisabled={isLoading || disabled}
      minW={full ? "100%" : width}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      variant={variant && "outline"}
      padding={padding}
    >
      {children}
    </ButtonBox>
  );
}

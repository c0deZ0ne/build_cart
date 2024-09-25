import { Box, Button as ChakraButton, Flex, Text } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoCheckmarkCircle, IoChevronDown } from "react-icons/io5";
import { RiSearch2Line } from "react-icons/ri";
import { addTransparency } from "../utility/helpers";
import Input from "./Input";

/**
 * Represents an item with an id and a name.
 * @typedef {{id: string | number, name: string}} Item
 */

/**
 * Creates a custom select component.
 * @param {object} props - The props object.
 * @param {Item[]} props.options - The array of options for the select component.
 * @param {Item | Item[]} props.value - The selected value(s) of the select component, `Item` if isMulti is false, `Item[]` if isMulti is true.
 * @param {(option: Item) => void} props.onChange - The function called when the value changes.
 * @param {string} props.placeholder - The placeholder text for the select component.
 * @param {boolean} props.disabled - Indicates if the select component is disabled.
 * @param {boolean} props.isMulti - Indicates if the select component allows multiple selections.
 *
 */
const SelectSearchAlt = ({
  options = [],
  value,
  onChange,
  placeholder,
  disabled,
  isMulti = false,
}) => {
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const computedResult = useMemo(() => {
    return options.filter((option) => {
      return option?.name.toLowerCase().includes(searchTerm);
    });
  }, [searchTerm, options]);

  /**
   *
   * @param {Item} option
   */
  function handleClick(option) {
    if (isMulti) {
      /**
       * @type {Item[]}
       */
      const currentValues = [...value];

      const currentIndex = currentValues.findIndex((v) => v.id === option.id);

      if (currentIndex !== -1) {
        currentValues.splice(currentIndex, 1);
      } else {
        currentValues.push(option);
      }
      onChange(currentValues);
    } else {
      onChange(option);
    }
  }

  /**
   *
   * @param {Item} option
   */
  function showCheckMark(option) {
    if (isMulti) {
      return value.map((o) => o?.name).includes(option?.name);
    } else {
      return value?.name === option?.name;
    }
  }

  return (
    <Box pos={"relative"}>
      <Flex
        border="1px solid #999999"
        _focus={{ borderColor: "#F5862E", color: "#F5862E" }}
        w={"100%"}
        h={"48px"}
        fontSize="16px"
        rounded="8px"
        px="16px"
        align="center"
        justify={"space-between"}
        pointerEvents={disabled ? "none" : "auto"}
        bg={disabled ? "lightgray" : "initial"}
        onClick={() => setOpenSearch(!openSearch)}
      >
        {value ? (
          <Text>{value?.name}</Text>
        ) : (
          <Text color={"#718096"}>{placeholder}</Text>
        )}

        <IoChevronDown color="#999999" />
      </Flex>

      {openSearch && (
        <Box
          border={`1px solid ${addTransparency("#000000", 0.1)}`}
          mt={"0.5rem"}
          w={"100%"}
          pos={"absolute"}
          top={"48px"}
          color={"white"}
          backgroundColor={"white"}
          zIndex={"9999"}
          py="24px"
          boxShadow="2xl"
          borderRadius="8px"
        >
          <Flex align={"center"} mb={"8px"} px={" 24px"}>
            <ChakraButton
              ml={"auto"}
              onClick={() => setOpenSearch(false)}
              variant={"ghost"}
            >
              <AiFillCloseCircle
                fontSize="24px"
                color="primary"
                bg="#12355A"
                cursor="pointer"
                onClick={() => setOpenSearch(false)}
              />
            </ChakraButton>
          </Flex>

          <Box w={"100%"} mb={"24px"} px={" 24px"}>
            <Input
              css={{ color: "#12355a" }}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Box>

          <Box maxHeight={"200px"} overflow={"auto"}>
            {computedResult.map((option) => {
              return (
                <Flex
                  px={" 24px"}
                  _hover={{ background: `${addTransparency("#12355a", 0.1)}` }}
                  key={option.id}
                  justify={"space-between"}
                  align={"center"}
                  py={"12px"}
                  cursor={"pointer"}
                  color="#12355A"
                  onClick={() => {
                    setOpenSearch(false);
                    handleClick(option);
                  }}
                >
                  <Text>{option?.name}</Text>

                  {showCheckMark(option) && (
                    <IoCheckmarkCircle color="#F5852C" fontSize="24px" />
                  )}
                </Flex>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SelectSearchAlt;

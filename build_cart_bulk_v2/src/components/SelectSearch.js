import { Box, Flex, Text, Button as ChakraButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle, IoChevronDown } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { RiSearch2Line } from "react-icons/ri";
import Input from "./Input";
import { FaPlus } from "react-icons/fa6";

export default function SelectSearch({
  placeholder,
  w = "100%",
  h = "48px",
  data,
  selectOption,
  setSelectOption,
  showInvite,
  inviteText,
  setOpenInvite,
  position = "up",
  isCloseSearch = false,
}) {
  const [openSearch, setOpenSearch] = useState(isCloseSearch);
  const [search, setSearch] = useState("");

  function selectOptionValue(item) {
    setSelectOption(item);
    setOpenSearch(false);
  }

  useEffect(() => {
    setOpenSearch(false);
  }, [isCloseSearch]);

  function searchTable() {
    const searchResult = data.filter((el) => {
      return el?.name.toLowerCase().match(search.toLowerCase());
    });

    return searchResult;
  }

  return (
    <Box pos="relative">
      <Flex
        border="1px solid #999999"
        _focus={{ borderColor: "#F5862E", color: "#F5862E" }}
        w={w}
        h={h}
        fontSize="16px"
        rounded="8px"
        px="16px"
        align="center"
        justifyContent="space-between"
        onClick={() => setOpenSearch(!openSearch)}
      >
        {selectOption ? (
          <Text>{selectOption?.name}</Text>
        ) : (
          <Text color="#718096" fontWeight="400">
            {placeholder}
          </Text>
        )}

        <IoChevronDown color="#999999" />
      </Flex>
      {openSearch && (
        <Box
          w={w}
          borderRadius="8px"
          p="40px 24px"
          bg="#fff"
          boxShadow="2xl"
          mt="10px"
          mb="24px"
          pos="absolute"
          zIndex="1"
          top={position === "up" ? "-200px" : ""}
        >
          <Flex align="center" justifyContent="space-between" mb="18px">
            <Text color="#12355A" fontWeight="600" fontSize="14px">
              {placeholder}
            </Text>
            <AiFillCloseCircle
              fontSize="24px"
              color="primary"
              bg="#12355A"
              cursor="pointer"
              onClick={() => setOpenSearch(false)}
            />
          </Flex>

          <Box w={{ base: "100%", md: "462px" }} mb="24px">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Box>
          {showInvite && (
            <ChakraButton
              variant="link"
              color="#12355A"
              fontWeight="400"
              mb="16px"
              onClick={() => setOpenInvite(true)}
            >
              <FaPlus mr="8px" />
              {inviteText}
            </ChakraButton>
          )}
          {searchTable().map((item, i) => {
            return (
              <Flex
                align="center"
                justifyContent="space-between"
                key={item.id + i}
                fontSize="16px"
                mb="5px"
                p="5px"
                cursor="pointer"
                color="#12355A"
                onClick={() => selectOptionValue(item)}
                _hover={{ bg: "rgba(0, 0, 0, 0.1)" }}
              >
                {item.name}
                {selectOption?.name === item.name && (
                  <IoCheckmarkCircle color="#F5852C" fontSize="24px" />
                )}
              </Flex>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

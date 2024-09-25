import {
  Box,
  Button as ChakraButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { addTransparency } from "../../../utility/helpers";

/**
 *
 * @param {object} props
 * @param {Function} props.onDrop
 */

/**
 *
 * @param {object} props
 * @param {Function} props.onChange
 * @param {string} props.pickedName
 * @returns
 */
const DocNamePicker = ({ onChange, pickedName }) => {
  const names = [
    "Certificate of Incorporation",
    "Bank Statement",
    "Projects Portfolio",
    "Plant/Equipment Inventory",
    "Priced BOQ",
    "Others",
  ];

  return (
    <Popover placement="auto">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box
              as={"button"}
              p={"12px 16px"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={"16px"}
              borderRadius={"4px"}
              fontWeight={400}
              fontSize={"12px"}
              border={`1px solid ${addTransparency("#999999", 0.25)}`}
              background={"white"}
              color={"primary"}
              height={"40px"}
            >
              <Text
                width={"80%"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
              >
                {pickedName ? pickedName : "Select file name"}
              </Text>
              <FaAngleDown size={"16px"} />
            </Box>
          </PopoverTrigger>
          <PopoverContent p={"24px"} width={"max-content"}>
            <PopoverBody p={0}>
              <Text fontWeight={500} color={"secondary"} mb={"0.75rem"}>
                DOCUMENT NAMES
              </Text>

              {names.map((name) => {
                return (
                  <Box key={name}>
                    <ChakraButton
                      fontWeight={400}
                      variant={"ghost"}
                      px="0"
                      onClick={() => {
                        onChange(name);
                        onClose();
                      }}
                    >
                      {name}
                    </ChakraButton>
                  </Box>
                );
              })}
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export default DocNamePicker;

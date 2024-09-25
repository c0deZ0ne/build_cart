import {
  useDisclosure,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Box,
} from "@chakra-ui/react";
import React from "react";
import InfoIcon from "../Icons/Info";

const Popup = ({
  info,
  fill = "#999999",
  width = "230px",
  triggerIcon = <InfoIcon fill={fill} />,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={false}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Box
          pos="relative"
          onMouseEnter={() => onOpen()}
          onMouseLeave={onClose}
          ml={"10px"}
        >
          {triggerIcon}
        </Box>
      </PopoverTrigger>
      <PopoverContent
        color="rgba(51, 51, 51, 0.56)"
        w={width}
        overflowY={"auto"}
      >
        <PopoverArrow bg={"#fff"} />
        {/* <PopoverCloseButton /> */}
        <PopoverBody fontWeight="400" textAlign="left" fontSize="12px">
          {info}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Popup;

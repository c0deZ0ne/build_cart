import {
  Box,
  Text,
  useDisclosure,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import React from "react";

const TruncateText = ({
  children,
  innerWidth = "150px",
  outerWidth = "200px",
  width = "180px",
  popover = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box w={outerWidth}>
      {!popover ? (
        <Text
          w={innerWidth}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {children}
        </Text>
      ) : (
        <Popover
          returnFocusOnClose={false}
          isOpen={isOpen}
          onClose={onClose}
          closeOnBlur={false}
          placement="bottom-start"
        >
          <PopoverTrigger>
            <Box
              pos="relative"
              onMouseEnter={() => onOpen()}
              onMouseLeave={onClose}
            >
              <Text
                w={innerWidth}
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
              >
                {children}
              </Text>
            </Box>
          </PopoverTrigger>
          <PopoverContent top="-12px" color="rgba(51, 51, 51, 0.56)" w={width}>
            {/* <Box
              w="12px"
              h="12px"
              bg="#fff"
              left="10px"
              pos="absolute"
              top="-6px"
              transform="rotate(45deg)"
              borderLeft="1px solid #e2e8f0"
              borderTop="1px solid #e2e8f0"
            /> */}

            <PopoverBody fontWeight="400" textAlign="left" fontSize="12px">
              {children}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </Box>
  );
};

export default TruncateText;

const TruncateWordCount = ({ children, count = 400 }) => {
  return (
    <Box>
      <Text>
        {children?.length > count ? `${children.slice(0, count)}...` : children}
      </Text>
    </Box>
  );
};

export { TruncateWordCount };

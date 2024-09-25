import { Box, Flex } from "@chakra-ui/react";
import React from "react";

const IconContainer = ({ color, children, rounded = "8px" }) => {
  return (
    <Box>
      <Box>
        <Flex
          justifyContent="center"
          align="center"
          w="40px"
          h="40px"
          rounded={rounded}
          bg={`${color}29`}
          mr="8px"
        >
          {children}
        </Flex>
      </Box>
    </Box>
  );
};

export default IconContainer;

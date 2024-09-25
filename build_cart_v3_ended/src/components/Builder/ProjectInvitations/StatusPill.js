import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { addTransparency } from "../../../utility/helpers";

/**
 *
 * @param {object} props
 * @param {string} props.status
 * @param {string} props.color must be in this HEX format #123456
 * @returns
 */
const StatusPill = ({ status, color }) => {
  return (
    <Flex
      alignItems={"center"}
      gap={"8px"}
      height={"24px"}
      width={"max-content"}
      px={"8px"}
      borderRadius={"24px"}
      backgroundColor={addTransparency(color, 0.08)}
      color={color}
    >
      <Box
        height={"8px"}
        width={"8px"}
        borderRadius={"50%"}
        backgroundColor={color}
      ></Box>

      <Text fontSize={"14px"}>{status}</Text>
    </Flex>
  );
};

export default StatusPill;

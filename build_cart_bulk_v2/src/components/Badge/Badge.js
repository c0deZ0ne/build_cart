import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import _ from "lodash";

const Badge = ({ status }) => {
  status = _.lowerCase(status);

  return (
    <Flex
      as={"span"}
      align="center"
      fontWeight="600"
      textTransform={"capitalize"}
      fontSize="14px"
      color={
        status === "closed" || status === "negotiation"
          ? "#6341a7"
          : status === "rejected" ||
            status === "inactive" ||
            status === "flagged" ||
            status === "disabled" ||
            status === "outflow"
          ? "#f26951"
          : status === "open" ||
            status === "accepted" ||
            status === "visible" ||
            status === "completed" ||
            status === "onboarded" ||
            status === "approved" ||
            status === "paid" ||
            status === "inflow"
          ? "#1C903D"
          : status === "pending" ||
            status === "processing" ||
            status === "reopened" ||
            status === "ongoing"
          ? "#FFBD00"
          : status === "active"
          ? "#074794"
          : "#605959"
      }
      bg={
        status === "closed" || status === "negotiation"
          ? "#d3d1df"
          : status === "rejected" ||
            status === "inactive" ||
            status === "flagged" ||
            status === "disabled" ||
            status === "outflow"
          ? "#ffdedb"
          : status === "open" ||
            status === "accepted" ||
            status === "visible" ||
            status === "completed" ||
            status === "onboarded" ||
            status === "approved" ||
            status === "paid" ||
            status === "inflow"
          ? "rgba(28, 144, 61, 0.18)"
          : status === "pending" ||
            status === "processing" ||
            status === "reopened" ||
            status === "ongoing"
          ? "rgba(255, 189, 0, 0.18)"
          : status === "active"
          ? "rgba(7, 71, 148, 0.18)"
          : "#e7e8e9"
      }
      p={"2px 8px"}
      borderRadius="24px"
      w={"max-content"}
    >
      <Box
        as="span"
        display="block"
        w="8px"
        h="8px"
        borderRadius="100%"
        mr="8px"
        bg={
          status === "closed" || status === "negotiation"
            ? "#6341a7"
            : status === "rejected" ||
              status === "inactive" ||
              status === "flagged" ||
              status === "disabled" ||
              status === "outflow"
            ? "#f26951"
            : status === "open" ||
              status === "accepted" ||
              status === "visible" ||
              status === "completed" ||
              status === "onboarded" ||
              status === "approved" ||
              status === "paid" ||
              status === "inflow"
            ? "#1C903D"
            : status === "pending" ||
              status === "processing" ||
              status === "reopened" ||
              status === "ongoing"
            ? "#FFBD00"
            : status === "active"
            ? "#074794"
            : "#605959"
        }
      />
      {status}
    </Flex>
  );
};

export default Badge;

import React from "react";
import EmptyStateIcon from "./Icons/EmptyStateIcon";
import { Box } from "@chakra-ui/react";

export default function EmptyState({
  children,
  py = "80px",
  md = "70%",
  icon = <EmptyStateIcon />,
}) {
  return (
    <Box w="100%">
      <Box mx="auto" py={py} w={{ base: "100%", md: md }}>
        <Box mx="auto" w="fit-content">
          {icon}
        </Box>
        <Box
          textAlign="center"
          style={{ textWrap: "balance" }}
          fontWeight="600"
          fontSize="20px"
          lineHeight="1.5"
          color="#999"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

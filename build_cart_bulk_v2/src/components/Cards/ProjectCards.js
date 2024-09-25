import { Box } from "@chakra-ui/react";
import React from "react";
import cardPattern from "../../assets/images/card-pattern.svg";
export default function ProjectCards({
  children,
  padding = "20px",
  height = "100%",
  width = "100%",
  border = "null",
  rounded = "8px",
}) {
  return (
    <Box
      w={width}
      borderRadius={rounded}
      boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
      p={padding}
      bgImage={cardPattern}
      height={height}
      borderLeft={border}
    >
      {children}
    </Box>
  );
}

import { Box } from "@chakra-ui/react";
import React from "react";
import LogoImage from "../assets/images/logo.png";

export default function Logo2({ w = "180px" }) {
  return (
    <Box>
      <img
        src={LogoImage}
        style={{ maxWidth: w }}
        alt="CutStruct Technology Limited"
      />
    </Box>
  );
}

import { Box } from "@chakra-ui/react";
import React from "react";
import LogoImage from "../assets/images/logo2.png";

export default function Logo({ color = "#fff", maxWidth = "180px" }) {
  return (
    <Box>
      <img
        src={LogoImage}
        style={{ maxWidth: maxWidth }}
        alt="CutStruct Technology Limited"
      />
    </Box>
  );
}

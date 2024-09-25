import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Lottie from "react-lottie";
import Checkmark from "../assets/Lotties/checkmark.json";

export default function SuccessMessage({ message, py = "100px" }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Checkmark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Box py={py}>
      <Lottie options={defaultOptions} height={160} width={160} />
      <Text textAlign="center" mt="10px" fontSize="24px" fontWeight="600">
        {message}
      </Text>
    </Box>
  );
}

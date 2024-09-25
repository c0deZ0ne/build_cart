import { Box, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useWatch } from "react-hook-form";

function PasswordChecker({ control }) {
  const password = useWatch({
    control,
    name: "password",
  });

  return (
    <Box color="#333333">
      <HStack gap="2" my="3px" alignItems="center">
        <FaCheckCircle color={/.{8,}/.test(password) ? "#F5862E" : "#C0C0C1"} />
        <Text fontSize="14px">At least 8 characters</Text>
      </HStack>
      <HStack gap="2" my="3px" alignItems="center">
        <FaCheckCircle
          color={/(?=.*?[0-9])/.test(password) ? "#F5862E" : "#C0C0C1"}
        />
        <Text fontSize="14px">Contains at least one number</Text>
      </HStack>
      <HStack gap="2" my="3px" alignItems="center">
        <FaCheckCircle
          color={
            /(?=.*[~!@£#$%^&*()_\-+=,.<>?/|':;{}])/.test(password)
              ? "#F5862E"
              : "#C0C0C1"
          }
        />
        <Text fontSize="14px">Contains one special character</Text>
      </HStack>
    </Box>
  );
}

export default PasswordChecker;

export const PasswordCondition = () => {
  return (
    <Box color="#999999">
      <HStack gap="2" my="3px" alignItems="center">
        <Text fontSize="13px">At least 8 characters</Text>
      </HStack>
      <HStack gap="2" my="3px" alignItems="center">
        <Text fontSize="13px">Contains at least one number</Text>
      </HStack>
      <HStack gap="2" my="3px" alignItems="center">
        <Text fontSize="13px">Contains one special character</Text>
      </HStack>
    </Box>
  );
};

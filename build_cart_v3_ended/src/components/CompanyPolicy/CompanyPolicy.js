import React from "react";
import PrivacyPolicy from "../../pages/auth/components/PrivacyPolicy";
import ReturnPolicy from "../../pages/auth/components/ReturnPolicy";
import TermsAndCondition from "../../pages/auth/components/TermsAndCondition";
import { Box, Text } from "@chakra-ui/react";

const CompanyPolicy = () => {
  return (
    <Box w="90%" textAlign="center" m="20px auto" fontSize={".9em"}>
      <Text>
        By clicking on "Create Account" button, you have agreed to <br />
        <span
          style={{
            color: "#F5862E",
            cursor: "pointer",
          }}
        >
          <TermsAndCondition />,
        </span>
        <span
          style={{
            color: "#F5862E",
            cursor: "pointer",
          }}
        >
          {" "}
          <ReturnPolicy />{" "}
        </span>
        <span>and </span>
        <span
          style={{
            color: "#F5862E",
            cursor: "pointer",
          }}
        >
          <PrivacyPolicy />
        </span>
      </Text>
    </Box>
  );
};

export default CompanyPolicy;

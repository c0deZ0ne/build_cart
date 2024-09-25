import React from "react";
import PrivacyPolicy from "../../pages/auth/components/PrivacyPolicy";
import ReturnPolicy from "../../pages/auth/components/ReturnPolicy";
import TermsAndCondition from "../../pages/auth/components/TermsAndCondition";
import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const CompanyPolicy = () => {
  return (
    <Box textAlign="center" fontSize={".9em"}>
      <Text m="10px auto">
        Unable to verify your email?{" "}
        <span
          style={{
            color: "#F5862E",
            cursor: "pointer",
          }}
        >
          <Link to="/auth/request-otp">Click here.</Link>
        </span>
      </Text>

      <Text w="90%" m="15px auto">
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

      <Text m="10px auto" fontSize=".85em" color="#999" fontWeight={600}>
        * kindly note that the business person will be liable for any signoffs
        on behalf of the business.
      </Text>
    </Box>
  );
};

export default CompanyPolicy;

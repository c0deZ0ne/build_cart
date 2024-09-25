import { Box } from "@chakra-ui/react";
import React from "react";
import BaseTable from "../../../../components/Table";

export default function PendingPayouts({ payouts = [] }) {
  const tableColumn = [
    "S/N",
    "CUSTOMER NAME",
    "USER TYPE",
    "REFERENCE NO.",
    "AMOUNT (₦)",
    "REQUEST DATE",
    "ACTION",
  ];
  return (
    <Box bg="#fff" borderRadius="8px" my="30px">
      <BaseTable tableColumn={tableColumn} tableBody={payouts} />
    </Box>
  );
}

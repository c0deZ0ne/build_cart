import { Box } from "@chakra-ui/react";
import React, { useMemo } from "react";
import BaseTable from "../../../../components/Table";

const tableColumns = [
  "S/N",
  "CUSTOMER NAME",
  "USER TYPE",
  "REFERENCE NO",
  "AMOUNT (₦)",
  "PAYMENT CHANNEL",
  // "PAYER",
  "PAYMENT DATE",
];

/**
 *
 * @param {{completedPayoutsTableData: Array}} props
 * @returns
 */
const CompletedPayoutsTable = ({ completedPayoutsTableData }) => {
  const tableData = useMemo(() => {
    return completedPayoutsTableData.map((c, index) => {
      const {
        CreatedBy,
        reference,
        amount,
        paymentProvider,
        createdAt,
        paymentMethod,
      } = c;

      const { name, userType } = CreatedBy;
      return {
        "S/N": index < 9 ? `0${index + 1}` : `${index + 1}`,
        "CUSTOMER NAME": name,
        "USER TYPE": userType,
        "REFERENCE NO": reference,
        "AMOUNT (₦)": Intl.NumberFormat().format(amount),
        "PAYMENT CHANNEL": paymentMethod.split("_").join(" "),
        "PAYMENT DATE": createdAt.split("T")[0],
      };
    });
  }, [completedPayoutsTableData]);

  return (
    <Box>
      <BaseTable tableColumn={tableColumns} tableBody={tableData} />
    </Box>
  );
};

export default CompletedPayoutsTable;

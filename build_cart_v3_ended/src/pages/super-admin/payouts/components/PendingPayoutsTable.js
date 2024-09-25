import { Box, useDisclosure } from "@chakra-ui/react";
import React, { useMemo } from "react";
import Button from "../../../../components/Button";
import EmptyState from "../../../../components/EmptyState";
import PaymentModal from "../../../../components/Modals/PaymentModal";
import BaseTable from "../../../../components/Table";
import { addTransparency } from "../../../../utility/helpers";

const tableColumns = [
  "S/N",
  "CUSTOMER NAME",
  "USER TYPE",
  "REFERENCE NO",
  "AMOUNT (₦)",
  "REQUEST DATE",
  "ACTION",
];

const Actions = (data) => {
  const {
    isOpen: fundIsOpen,
    onOpen: fundOnOpen,
    onClose: fundOnClose,
  } = useDisclosure();
  return (
    <Box ml={"-24px"}>
      <Button
        onClick={fundOnOpen}
        size="sm"
        fontSize="14px"
        background={addTransparency("#074794", 0.16)}
        color="#074794"
      >
        Make Payment
      </Button>

      <Box pos={"absolute"}>
        <PaymentModal
          onOpen={fundOnOpen}
          onClose={fundOnClose}
          isOpen={fundIsOpen}
          title="Payout"
          userType="admin"
          bankInfo={data?.data?.CreatedBy?.Vendor?.Bank}
          // refresh={refetchUserAccountDetails}
          callbackUrl="/fundManager/fund-account"
        />
      </Box>
    </Box>
  );
};

/**
 *
 * @param {{pendingPayoutsTableData: Array}} props
 * @returns
 */
const PendingPayoutsTable = ({ pendingPayoutsTableData }) => {
  const tableData = useMemo(() => {
    return pendingPayoutsTableData.map((p, index) => {
      const { CreatedBy, reference, amount, createdAt } = p;

      const { name, userType } = CreatedBy;
      return {
        "S/N": index < 9 ? `0${index + 1}` : `${index + 1}`,
        "CUSTOMER NAME": name,
        "USER TYPE": userType,
        "REFERENCE NO": reference,
        "AMOUNT (₦)": Intl.NumberFormat().format(amount),
        "REQUEST DATE": createdAt.split("T")[0],
        ACTION: <Actions data={p} />,
      };
    });
  }, [pendingPayoutsTableData]);

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={tableData}
        empty={<EmptyState>No data ...</EmptyState>}
      />
    </Box>
  );
};

export default PendingPayoutsTable;

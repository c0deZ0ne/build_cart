import { Box } from "@chakra-ui/react";
import React from "react";
import StatusPill from "../../../../components/Builder/ProjectInvitations/StatusPill";
import EmptyState from "../../../../components/EmptyState";
import BaseTable from "../../../../components/Table";

const tableColumns = [
  "S/N",
  "SUPPLIER'S NAME",
  "BUILDER'S NAME",
  "ITEM NAME",
  "QUANTITY",
  "AMOUNT (₦)",
  "DELIVERY DATE",
  "STATUS",
];

const DisputesTable = ({ data, isLoading }) => {
  const mapped = data.map((d, index) => {
    const {
      Builder,
      Vendor,
      RfqQuote: { RfqRequestMaterial },
      totalCost,
      RfqRequest,
      status,
    } = d;

    const { businessName: builderName } = Builder;
    const { businessName: vendorName } = Vendor;
    const { deliveryDate } = RfqRequest;
    const { name: ItemName, quantity } = RfqRequestMaterial;

    const statusColor = (status) => {
      const map = {
        ACCEPTED: "#1C903D",
        PENDING: "#FFBD00",
        DEFAULT: "#000000",
      };
      return map[status] || map.DEFAULT;
    };
    return {
      "S/N": index < 9 ? `0${index + 1}` : `${index + 1}`,
      "SUPPLIER'S NAME": vendorName,
      "BUILDER'S NAME": builderName,
      "ITEM NAME": ItemName,
      QUANTITY: Intl.NumberFormat().format(quantity),
      "AMOUNT (₦)": totalCost,
      "DELIVERY DATE": deliveryDate.split("T")[0],
      STATUS: <StatusPill color={statusColor(status)} status={status} />,
    };
  });

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={mapped}
        isLoading={isLoading}
        empty={<EmptyState>Nothing to display...</EmptyState>}
      />
    </Box>
  );
};

export default DisputesTable;

import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../../components/Table";
import moment from "moment/moment";
import EmptyState from "../../../../components/EmptyState";
import { capitalize } from "lodash";

const CompletedVerification = ({
  data,
  setDefaultIndex,
  getAllBidData,
  isLoading,
}) => {
  const [tableBody, setTableBody] = useState([]);
  const tableColumn = [
    "S/N",
    "CUSTOMER'S NAME",
    "CUSTOMER TYPE",
    "EMAIL",
    "PHONE NUMBER",
    "SIGNUP DATE",
    "ACTION",
  ];

  useEffect(() => {
    data = [0];
    const arr = data?.map((item, index) => ({
      SN: `0${index + 1}`,
      customername: capitalize(item?.CreatedBy?.name),
      type: capitalize(item?.paymentTerm?.replaceAll("_", " ")),
      itemname: capitalize(item?.name) ?? "-",
      email: capitalize(item?.name) ?? "-",
      expectedDelivery: moment(item?.deliveryDate).format("DD-MM-YYYY"),
      id: item?.id,
    }));
    setTableBody(arr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Box my="20px">
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableBody}
        isLoading={isLoading}
        empty={
          <EmptyState>
            There are no{" "}
            <Text as="span" color="secondary">
              {" "}
              Completed ID Verification Requests
            </Text>{" "}
            on the platform.
          </EmptyState>
        }
      />
    </Box>
  );
};

export default CompletedVerification;

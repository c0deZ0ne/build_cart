import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../../components/Table";
import moment from "moment/moment";
import Badge from "../../../../components/Badge/Badge";
import EmptyState from "../../../../components/EmptyState";
import { capitalize } from "lodash";
import { Button2 } from "../../../../components/Button";

const OngoingVerification = ({
  data,
  setDefaultIndex,
  getAllBidData,
  isLoadingRfq,
}) => {
  const [tableBody, setTableBody] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    const arr = data?.map((item, index) => ({
      SN: `0${index + 1}`,
      customername: capitalize(item?.CreatedBy?.name),
      type: capitalize(item?.paymentTerm?.replaceAll("_", " ")),
      itemname: capitalize(item?.name) ?? "-",
      email: capitalize(item?.name) ?? "-",
      expectedDelivery: moment(item?.deliveryDate).format("DD-MM-YYYY"),
      action: (
        <Flex justify="space-between" gap={5}>
          <Button2
            color="#1C903D"
            onClick={() => {
              // setRfq(item);
              onOpen();
            }}
          >
            Review
          </Button2>
        </Flex>
      ),
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
        isLoading={isLoadingRfq}
        empty={
          <EmptyState>
            There are no{" "}
            <Text as="span" color="secondary">
              {" "}
              Ongoing ID Verification Requests
            </Text>{" "}
            on the platform.
          </EmptyState>
        }
      />
    </Box>
  );
};

export default OngoingVerification;

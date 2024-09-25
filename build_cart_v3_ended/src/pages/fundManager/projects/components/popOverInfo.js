import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import StarRatings from "../../../../components/StarRatings";
import { capitalize } from "lodash";
import sentenceCase from "../../../../utility/helpers";

const PopOverInfo = ({ data }) => {
  return (
    <Box>
      <Flex align="center" gap={2}>
        Supplier Name: <b> {sentenceCase(data?.createdBy?.businessName)}</b>
      </Flex>
      <Flex align="center" gap={2}>
        Rating :{" "}
        <StarRatings rating={data?.vendorRateScore ?? 0} iconSize="13px" />
      </Flex>
      <Flex align="center" gap={2}>
        Completed Order : <b>{data?.vendorCompletedOrdersCount ?? 0}</b>
      </Flex>
      <Flex align="center" gap={2}>
        Supplier Type : <b>{capitalize(data?.VendorType)}</b>
      </Flex>
    </Box>
  );
};

export default PopOverInfo;

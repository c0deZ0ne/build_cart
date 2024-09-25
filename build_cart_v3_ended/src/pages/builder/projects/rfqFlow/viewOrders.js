import React, { useEffect, useState } from "react";
import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import moment from "moment";
import BaseTable from "../../../../components/Table";
import EmptyState from "../../../../components/EmptyState";
import Badge from "../../../../components/Badge/Badge";
import Popup from "../../../../components/Popup/Popup";
import PopOverInfo from "../components/popOverInfo";
import sentenceCase from "../../../../utility/helpers";

const ViewOrders = ({ data }) => {
  const [tableBody, setTableBody] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getTableData = async () => {
    try {
      let request = data?.RfqRequestMaterials && data?.RfqRequestMaterials[0];
      let order = data?.orders && data?.orders[0];
      let filteredOrder = data?.RfqQuotes.find(
        (e, i) => e.RfqQuote?.id === order.RfqQuoteId
      );

      const arr = {
        SN: `0${1}`,
        vendorName: (
          <Flex align="center">
            {sentenceCase(
              filteredOrder?.RfqQuote?.Vendor.createdBy?.businessName
            )}{" "}
            <Popup
              info={<PopOverInfo data={filteredOrder?.RfqQuote?.Vendor} />}
              fill="#666"
            />
          </Flex>
        ),
        itemName: request?.name,
        amount: new Intl.NumberFormat().format(
          filteredOrder?.RfqQuote?.totalCost
        ),
        estimatedDelivery: moment(data?.deliveryDate).format("DD-MM-YYYY"),
        action: (
          <Flex align="center" gap={4} cursor="pointer" color="#12355A">
            <Badge status={order?.status} />
          </Flex>
        ),
        id: filteredOrder?.RfqQuote?.id,
      };

      setTableBody([arr]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTableData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableColumn = [
    "S/N",
    "VENDOR'S NAME",
    "ITEM NAME",
    "UNIT AMOUNT (₦)",
    "ESTIMATED DELIVERY",
    "STATUS",
  ];

  return (
    <Box my="40px" p={"32px 24px"} background={"#FCF7F6"}>
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "flex-end"]}
        gap={2}
      >
        <Box fontSize="20px">
          <Text fontWeight="600" color="secondary">
            Orders
          </Text>
          <Text fontSize="14px">
            These are the orders you've submitted to suppliers.
          </Text>
        </Box>

        <Spacer />
        <Box width="max-content" position={"relative"}>
          <Flex gap={"1rem"}>
            {/* <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<RiSearch2Line />}
            /> */}
          </Flex>
        </Box>
      </Flex>

      <Box mt="20px">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={tableBody}
          isLoading={isLoading}
          empty={
            <EmptyState>
              <Text>
                No{" "}
                <Text as="span" color="secondary">
                  Orders
                </Text>{" "}
                yet
              </Text>
            </EmptyState>
          }
        />
      </Box>
    </Box>
  );
};

export default ViewOrders;

import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import EmptyState from "../../../../components/EmptyState";
import BaseTable from "../../../../components/Table";
import { IoIosArrowForward } from "react-icons/io";
import Button from "../../../../components/Button";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function RequestForQuote({ rfqs = [] }) {
  const [search, setSearch] = useState("");
  const [rfqList, setRfqList] = useState([]);
  const history = useHistory();
  const tableColumn = [
    "S/N",
    "ITEM NAME",
    "CATEGORY",
    "QUANTITY",
    "BUDGET (₦)",
    "ACTION",
  ];
  useEffect(() => {
    if (rfqs.length > 0) {
      const rfqsTable = rfqs.map((rfq, index) => {
        return {
          SN: `${(index + 1).toString().length < 2 ? 0 : ""}${index + 1}`,
          itemName: rfq?.RfqRequestMaterials[0].name,
          category: rfq?.RfqRequestMaterials[0]?.category?.title,
          qunatity: rfq?.RfqRequestMaterials[0]?.quantity,
          budget: new Intl.NumberFormat().format(
            rfq?.RfqRequestMaterials[0]?.budget ?? 0
          ),
          action: (
            <Flex
              onClick={() => {
                history.push(`/super-admin/rfq-details/${rfq.id}`);
              }}
              align="center"
              cursor="pointer"
              color="#12355A"
            >
              View Bids <IoIosArrowForward />
            </Flex>
          ),
        };
      });
      setRfqList(rfqsTable);
    }
  }, [rfqs]);

  return (
    <Box bgColor="rgba(245, 133, 44, 0.04)" py="16px" px="24px">
      <Box mb="24px">
        <Box as="h3" color="secondary" fontSize="20px" fontWeight="600">
          <Box as="span" color="primary">
            Request
          </Box>{" "}
          For Quote (RFQ)
        </Box>
        <Text color="primary" fontSize="14px">
          Add documents relevant to your project like project plan, letter of
          charter, etc
        </Text>
      </Box>
      <Flex justifyContent="space-between" align="center" mb="24px">
        <Box w={{ base: "100%", md: "462px" }}>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<RiSearch2Line />}
          />
        </Box>
      </Flex>
      {rfqs.length === 0 ? (
        <Box
          boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
          borderRadius="8px"
          bg="#fff"
          h="470px"
        >
          <EmptyState>
            <Text>
              There are no{" "}
              <Text as="span" color="#F5852C">
                Bids
              </Text>{" "}
              on this project.
            </Text>
          </EmptyState>
        </Box>
      ) : (
        <Box bg="#fff" borderRadius="8px" my="30px">
          <BaseTable tableColumn={tableColumn} tableBody={rfqList} />
        </Box>
      )}
    </Box>
  );
}

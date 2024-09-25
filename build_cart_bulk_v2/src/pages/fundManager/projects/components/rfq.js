import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import EmptyState from "../../../../components/EmptyState";
import BaseTable from "../../../../components/Table";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Input from "../../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";

const RFQ = ({ setDefaultIndex, refreshRfq, data }) => {
  const [tableBody, setTableBody] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const history = useHistory();

  const getTableData = async () => {
    try {
      const arr = [];
      let counter = 1;

      data.forEach((item, index) => {
        arr.push({
          SN: `0${counter}`,
          builder: item?.Builder?.businessName,
          materialName: item?.RfqRequestMaterials[0]?.name,
          category: item?.RfqRequestMaterials[0]?.category?.title,
          budget: new Intl.NumberFormat().format(
            item?.RfqRequestMaterials[0]?.budget ?? 0
          ),
          quantity: item?.RfqRequestMaterials[0]?.quantity,
          totalBudget: new Intl.NumberFormat().format(item?.totalBudget),
          action: (
            <Flex
              onClick={() => {
                history.push(`/fund-manager/project/view-bids/${item.id}`);
              }}
              align="center"
              cursor="pointer"
              color="#12355A"
            >
              View Bids <IoIosArrowForward />
            </Flex>
          ),
          id: item?.id,
        });
        counter++;
      });

      setTableBody(arr);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTableData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, refreshRfq]);

  const tableColumn = [
    "S/N",
    "DEVELOPER NAME",
    "ITEM NAME",
    "CATEGORY",
    "UNIT BUDGET (₦)",
    "QUANTITY",
    "TOTAL BUDGET (₦)",
    "ACTION",
  ];
  return (
    <Box mt="20px">
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "center"]}
        gap={2}
      >
        <Box>
          <Flex fontWeight="600" fontSize="24px">
            <Text color="primary" mr="5px">
              Request For
            </Text>
            <Text color="secondary"> Quote</Text>
          </Flex>
          <Text mb="10px" fontSize="14px">
            Raise RFQs, Approve Bids, Fund and Manage orders here.
          </Text>
        </Box>
        <Box width={["100%", "100%", "300px"]}>
          <Input leftIcon={<RiSearch2Line />} placeholder="Search" />
        </Box>
      </Flex>

      <Box mt="20px">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={tableBody}
          isLoading={isLoading}
          empty={
            <EmptyState>
              <Text as="span" color="secondary">
                {" "}
                No RFQ
              </Text>{" "}
              has been added to this project
            </EmptyState>
          }
        />
      </Box>
    </Box>
  );
};

export default RFQ;

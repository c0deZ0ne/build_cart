import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import BaseModal from "../../../../components/Modals/Modal";
import CreateRfq from "../modals/createRfq";
import instance from "../../../../utility/webservices";
import EmptyState from "../../../../components/EmptyState";
import BaseTable from "../../../../components/Table";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Input from "../../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import Badge from "../../../../components/Badge/Badge";

const RFQ = ({ setDefaultIndex, refreshRfq, details }) => {
  const [tableBody, setTableBody] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { projectId } = useParams();
  const history = useHistory();
  const {
    isOpen: isOpenRfq,
    onOpen: onOpenRfq,
    onClose: onCloseRfq,
  } = useDisclosure();

  const getTableData = async () => {
    try {
      const { data } = (
        await instance.get(`/builder/project/${projectId}/rfq?page_size=10000`)
      ).data;

      const arr = [];
      let counter = 1;
      data.forEach((item, index) => {
        arr.push({
          SN: `0${counter}`,
          materialName: item?.RfqRequestMaterials[0]?.name,
          category: item?.RfqRequestMaterials[0]?.category?.title,
          quantity: item?.RfqRequestMaterials[0]?.quantity,
          budget: new Intl.NumberFormat().format(
            item?.RfqRequestMaterials[0]?.budget
          ),
          totalBudget: new Intl.NumberFormat().format(item?.totalBudget),
          status: <Badge status={item?.status} />,
          action: (
            <Flex
              onClick={() => {
                history.push(`/builder/company-project/view-bids/${item.id}`);
              }}
              align="center"
              cursor="pointer"
              color="#12355A"
            >
              View <IoIosArrowForward />
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

  // useEffect(() => {
  //   getTableData();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    getTableData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRfq]);

  const tableColumn = [
    "S/N",
    "ITEM NAME",
    "CATEGORY",
    "QUANTITY",
    "UNIT BUDGET (₦)",
    "TOTAL BUDGET (₦)",
    "STATUS",
    "ACTION",
  ];
  return (
    <Box mt="20px">
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "flex-end"]}
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
          <Box width={["100%", "100%", "300px"]}>
            <Input leftIcon={<RiSearch2Line />} placeholder="Search" />
          </Box>
        </Box>
        <Button onClick={onOpenRfq}>Create Request For Quote</Button>
      </Flex>

      <Box mt="20px">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={tableBody}
          isLoading={isLoading}
          empty={
            <EmptyState>
              No RFQ Yet.
              <Text as="span" color="secondary">
                {" "}
                Create One
              </Text>{" "}
            </EmptyState>
          }
        />
      </Box>

      {/* Create RFQ Modal */}
      <BaseModal
        isOpen={isOpenRfq}
        onClose={onCloseRfq}
        title="Request For Quote"
        subtitle="Create an RFQ for your project"
        size="xl"
      >
        <CreateRfq
          onclose={onCloseRfq}
          details={details}
          setDefaultIndex={setDefaultIndex}
        />
      </BaseModal>
    </Box>
  );
};

export default RFQ;

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import BaseTable from "../../../../components/Table";
import EmptyState from "../../../../components/EmptyState";
import Badge from "../../../../components/Badge/Badge";
import Popup from "../../../../components/Popup/Popup";
import PopOverInfo from "../components/popOverInfo";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import TruncateText from "../../../../components/Truncate";
import sentenceCase from "../../../../utility/helpers";
import { Button2 } from "../../../../components/Button";

const DeliverySchedule = ({ data }) => {
  const [isLoading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tableBody, setTableBody] = useState([]);
  const [scheduleDeliverytableBody, setScheduleDeliverytableBody] = useState(
    []
  );

  const getTableData = async () => {
    try {
      let request = data?.RfqRequestMaterials && data?.RfqRequestMaterials[0];
      let order = data?.orders && data?.orders[0];
      let filteredOrder = data?.RfqQuotes.find(
        (e, i) => e.id === order?.RfqQuote?.RfqQuoteId
      );

      const arr = {
        SN: `0${1}`,
        vendorName: (
          <Flex align="center">
            {sentenceCase(
              filteredOrder?.RfqQuote?.Vendor?.createdBy?.businessName
            )}{" "}
            <Popup
              info={<PopOverInfo data={filteredOrder?.RfqQuote?.Vendor} />}
              fill="#666"
            />
          </Flex>
        ),
        itemName: request?.name,
        quantity: request?.quantity,
        amount: new Intl.NumberFormat().format(
          filteredOrder?.RfqQuote?.totalCost
        ),
        estimatedDelivery: moment(data?.deliveryDate).format("DD-MM-YYYY"),
        status: <Badge status={order?.status} />,
        action: (
          <Flex
            align="center"
            onClick={onOpen}
            cursor="pointer"
            color="#12355A"
          >
            View Delivery Schedule <IoIosArrowForward />
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
    "QUANTITY",
    "AMOUNT (₦)",
    "ESTIMATED DELIVERY",
    "STATUS",
    "ACTION",
  ];

  const deliveryScheduleTableColumn = [
    "S/N",
    "SCHEDULE NAME",
    "DESCRIPTION",
    "QUANTITY",
    "DELIVERY DATE",
    "STATUS",
  ];

  useEffect(() => {
    const ordersSchedule = data?.orders[0];

    const delSchedule = ordersSchedule?.deliverySchedules.map(
      (item, index) => ({
        SN: `0${index + 1}`,
        schedulename: `Order ${index + 1}`,
        description: (
          <TruncateText
            innerWidth="250px"
            popover={item?.description}
            width="100%"
          >
            {item?.description}
          </TruncateText>
        ),
        quantity: item?.quantity ?? 0,
        estimatedDelivery: moment(item?.dueDate).format("DD-MM-YYYY"),
        status: <Badge status={item?.status} />,
        id: item?.id,
      })
    );
    setScheduleDeliverytableBody(delSchedule);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
          <Text fontSize="14px">Track your order delivery below.</Text>
        </Box>

        <Spacer />
        <Box width="max-content" position={"relative"}>
          <Flex gap={"1rem"}>
            <Button2 color="#EE4124"> Open Dispute</Button2>
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

      <Modal
        closeOnOverlayClick={false}
        isCentered
        size={"5xl"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <Flex pos="relative" justify="flex-start">
            <ModalCloseButton left={10} mt={5} fontSize="18px" color="primary">
              <Flex align="center">
                <IoIosArrowBack /> Back
              </Flex>
            </ModalCloseButton>
          </Flex>
          <ModalBody my={20}>
            <Box
              as="span"
              rounded="40px"
              fontWeight="600"
              color="#F5852C"
              bg="#F5852C19"
              padding="10px 20px"
            >
              Delivery Schedule
            </Box>
            <Box mt={8}>
              <BaseTable
                tableColumn={deliveryScheduleTableColumn}
                tableBody={scheduleDeliverytableBody}
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DeliverySchedule;

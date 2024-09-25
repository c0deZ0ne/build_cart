import React, { useState } from "react";
import { Box, Flex, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import BaseTable from "../../../../components/Table";
import EmptyState from "../../../../components/EmptyState";
import Badge from "../../../../components/Badge/Badge";
import Popup from "../../../../components/Popup/Popup";
import PopOverInfo from "../components/popOverInfo";
import sentenceCase, { handleError } from "../../../../utility/helpers";
import { Button2 } from "../../../../components/Button";
import ConfirmationModal from "../../../../components/Modals/ConfirmationModal";
import useModalHandler from "../../../../components/Modals/SuccessModal";
import instance from "../../../../utility/webservices";
import { FaEnvelope } from "react-icons/fa6";
import OrderDisputeModal from "../modals/orderDisputeModal";

const DeliveredOrder = ({ data, getRequestData }) => {
  const [isLoadingBtn, setLoadingBtn] = useState(false);
  const [isLoadingConfirm, setLoadingConfirm] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDispute,
    onOpen: onOpenDispute,
    onClose: onCloseDispute,
  } = useDisclosure();
  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const ModalMessage = () => {
    return (
      <Box textAlign="center">
        <b>Order re-opened</b> <br />
        <Flex justify="center" color="secondary">
          <a
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 15,
            }}
            href={`mailto:${filteredOrder?.Vendor?.createdBy?.email}`}
          >
            Contact Supplier <FaEnvelope />
          </a>
        </Flex>
      </Box>
    );
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      setLoadingBtn(true);

      await instance.post("/builder/order/confirm-delivery", {
        orderId: orderId,
      });

      getRequestData("RATEDELIVERY");
      handleSuccessModal("Order Completed");
      setLoadingBtn(false);
    } catch (error) {
      handleError(error);
      setLoadingBtn(false);
    }
  };

  const handleRejectOrder = async () => {
    setLoadingConfirm(true);
    try {
      const orderId = data?.orders[0]?.id;

      await instance.patch(`/builder/rfq/${orderId}/decline`, {
        orderId: orderId,
      });

      getRequestData("DISPUTE");
      setTimeout(() => {
        setLoadingConfirm(false);
        handleSuccessModal(ModalMessage, 0, true);
      }, 2000);
    } catch (error) {
      handleError(error);
      setLoadingConfirm(false);
    }
  };

  let request = data?.RfqRequestMaterials && data?.RfqRequestMaterials[0];
  let order = data?.orders && data?.orders[0];
  let filteredOrder = data?.RfqQuotes.find(
    (e, i) => e?.RfqQuote?.id === order.RfqQuoteId
  );

  const tableBody = {
    SN: `0${1}`,
    vendorName: (
      <Flex align="center">
        {sentenceCase(filteredOrder?.RfqQuote?.Vendor?.createdBy?.businessName)}{" "}
        <Popup
          info={<PopOverInfo data={filteredOrder?.RfqQuote?.Vendor} />}
          fill="#666"
        />
      </Flex>
    ),
    itemName: request?.name,
    quantity: request?.quantity,
    amount: new Intl.NumberFormat().format(filteredOrder?.RfqQuote?.totalCost),
    estimatedDelivery: moment(data?.deliveryDate).format("DD-MM-YYYY"),
    status: <Badge status={order?.Contract?.deliveryStatus} />,
    action: (
      <Flex align="center" cursor="pointer" gap={4}>
        <Button2
          color="#1C903d"
          isLoading={isLoadingBtn}
          onClick={() => handleConfirmDelivery(order?.id)}
        >
          Accept
        </Button2>
        <Button2 color="#ee4124" onClick={onOpen}>
          Reject
        </Button2>
      </Flex>
    ),
    id: filteredOrder?.RfqQuote?.id,
  };

  const tableColumn = [
    "S/N",
    "VENDOR'S NAME",
    "ITEM NAME",
    "QUANTITY",
    "UNIT AMOUNT (₦)",
    "ESTIMATED DELIVERY",
    "STATUS",
    "ACTION",
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
          <Text fontSize="14px">Track your order delivery below.</Text>
        </Box>

        <Spacer />
        <Box width="max-content" position={"relative"}>
          <Flex gap={"1rem"}>
            <Button2 color="#EE4124" onClick={onOpenDispute}>
              Open Dispute
            </Button2>
          </Flex>
        </Box>
      </Flex>

      <Box mt="20px">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={[tableBody]}
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

      <ConfirmationModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        handleAction={handleRejectOrder}
        title={"Reject Order"}
        message="Are you sure you want to reject this order?"
        color="#F5852C"
        isLoading={isLoadingConfirm}
      />

      {ModalComponent}

      <OrderDisputeModal
        isOpen={isOpenDispute}
        onOpen={onOpenDispute}
        onClose={onCloseDispute}
        data={data}
      />
    </Box>
  );
};

export default DeliveredOrder;

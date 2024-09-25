import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/Table";
import moment from "moment/moment";
import Badge from "../../../components/Badge/Badge";
import EmptyState from "../../../components/EmptyState";
import { IoIosArrowForward } from "react-icons/io";
import BaseModal from "../../../components/Modals/Modal";
import ContractAgreement from "./contractAgreement";
import { capitalize } from "lodash";
import { handleError } from "../../../utility/helpers";
import instance from "../../../utility/webservices";
import useModalHandler from "../../../components/Modals/SuccessModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const PurchaseOrder = ({ data, setDefaultIndex, getAllBidData, isLoading }) => {
  const [details, setDetails] = useState({});
  const [tableBody, setTableBody] = useState([]);
  const [isLoadingContractSubmit, setLoadingContractSubmit] = useState(false);
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const tableColumn = [
    "S/N",
    "ITEM NAME",
    "QUANTITY",
    "UNIT AMOUNT (₦)",
    "EXPECTED DELIVERY",
    "PAYMENT TYPE",
    "STATUS",
    "ACTION",
  ];

  useEffect(() => {
    const arr = data?.map((item, index) => ({
      SN: `0${index + 1}`,
      itemname: capitalize(item?.RfqQuote?.RfqRequestMaterial?.name) ?? "-",
      quantity: item?.RfqQuote?.RfqRequestMaterial?.quantity ?? 0,
      amount: new Intl.NumberFormat().format(
        item?.RfqQuote?.RfqRequestMaterial?.budget ?? 0,
      ),
      expectedDelivery: moment(item?.RfqRequest?.deliveryDate).format(
        "DD-MM-YYYY",
      ),
      paymentType: capitalize(
        item?.RfqRequest?.paymentTerm?.replaceAll("_", " "),
      ),
      status: <Badge status={item?.Contract?.paymentStatus} />,
      action: (
        <Flex
          align="center"
          onClick={() => {
            item?.Contract?.paymentStatus === "PENDING"
              ? handleError("Buyer is yet to make payment")
              : onOpen();
            setDetails(item);
          }}
          cursor="pointer"
          color="#12355A"
        >
          Fullfil <IoIosArrowForward />
        </Flex>
      ),
      id: item?.id,
    }));
    setTableBody(arr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleFufillContract = async () => {
    setLoadingContractSubmit(true);
    try {
      await instance.patch(
        `/vendor/contract/${details?.ContractId}/accept-contract`,
      );
      handleSuccessModal("Contract has been accepted");
      setLoadingContractSubmit(false);
      getAllBidData();
      history.push(`/vendor/order-management`);
    } catch (error) {
      handleError(error);
      setLoadingContractSubmit(false);
    }
    onClose();
  };

  return (
    <Box my="20px">
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableBody}
        isLoading={isLoading}
        empty={
          <EmptyState>
            you have no{" "}
            <Text as="span" color="primary">
              {" "}
              Orders yet
            </Text>{" "}
            When
            <Text as="span" color="secondary">
              {" "}
              new Orders comes in,
            </Text>{" "}
            they will appear here.
          </EmptyState>
        }
      />

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        title={"Contract"}
        subtitle={
          "This contract is binding between the supplier and the builder on this transaction"
        }
      >
        <Box w="80%" m="0 auto">
          <ContractAgreement
            details={details}
            handleClick={handleFufillContract}
            isLoading={isLoadingContractSubmit}
          />
        </Box>
      </BaseModal>

      {ModalComponent}
    </Box>
  );
};

export default PurchaseOrder;

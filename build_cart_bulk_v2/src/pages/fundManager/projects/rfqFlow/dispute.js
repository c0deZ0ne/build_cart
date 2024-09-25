import React, { useEffect, useState } from "react";
import { Box, Flex, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import BaseTable from "../../../../components/Table";
import EmptyState from "../../../../components/EmptyState";
import Badge from "../../../../components/Badge/Badge";
import Popup from "../../../../components/Popup/Popup";
import PopOverInfo from "../components/popOverInfo";
import { IoIosArrowForward } from "react-icons/io";
import sentenceCase, { handleError } from "../../../../utility/helpers";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import DisputeModal from "../../../../components/Vendors/DisputeModal";
import useModalHandler from "../../../../components/Modals/SuccessModal";
import instance from "../../../../utility/webservices";
import { Button2 } from "../../../../components/Button";

const ModalMessage = () => {
  return (
    <Text fontWeight="400">
      <b> Dispute opened.</b> <br /> An Admin has been notified and the dispute
      will be attended to shortly
    </Text>
  );
};

const Dispute = ({ data }) => {
  const [isLoading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tableBody, setTableBody] = useState([]);
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const history = useHistory();

  const getTableData = async () => {
    try {
      let request = data?.RfqRequestMaterials && data?.RfqRequestMaterials[0];
      let order = data?.orders && data?.orders[0];

      let filteredOrder = data?.RfqQuotes.find(
        (e, i) => e.id === order.RfqQuoteId
      );

      const arr = {
        SN: `0${1}`,
        vendorName: (
          <Flex align="center">
            {sentenceCase(filteredOrder?.Vendor?.createdBy?.businessName)}{" "}
            <Popup
              info={<PopOverInfo data={filteredOrder.Vendor} />}
              fill="#666"
            />
          </Flex>
        ),
        itemName: request?.name,
        quantity: request?.quantity,
        amount: new Intl.NumberFormat().format(filteredOrder?.totalCost),
        estimatedDelivery: moment(data?.deliveryDate).format("DD-MM-YYYY"),
        status: <Badge status={"Ongoing" ?? order?.status} />,
        action: (
          <Flex gap={4}>
            <Flex align="center" onClick={onOpen} cursor="pointer">
              Open Dispute <IoIosArrowForward />
            </Flex>
            <Flex
              align="center"
              onClick={() => history.push("/support")}
              cursor="pointer"
            >
              Contact Admin <IoIosArrowForward />
            </Flex>
          </Flex>
        ),
        id: filteredOrder?.id,
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

  const handleDispute = async (response) => {
    const contractId = data?.orders[0]?.ContractId;
    try {
      const payload = {
        ...response,
      };
      instance.post(`/builder/${contractId}/open-dispute`, payload);
      handleSuccessModal(<ModalMessage />, 5000);
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

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

      <DisputeModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onSubmit={handleDispute}
        userType="Vendor"
      />

      {ModalComponent}
    </Box>
  );
};

export default Dispute;

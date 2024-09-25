import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
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
import { IoIosArrowForward } from "react-icons/io";
import sentenceCase, {
  handleError,
  handleSuccess,
} from "../../../../utility/helpers";
import BaseModal from "../../../../components/Modals/Modal";
import StarRatings from "../../../../components/StarRatings";
import Button from "../../../../components/Button";
import StarRatingIcon from "../../../../components/Icons/StarRatingIcon";
import instance from "../../../../utility/webservices";
import useModalHandler from "../../../../components/Modals/SuccessModal";
import OrderDisputeModal from "../modals/orderDisputeModal";

const initialRatings = [
  { name: "Delivery Timing", value: 0 },
  { name: "Defect Control", value: 0 },
  { name: "Communication", value: 0 },
  { name: "Specification Accuracy", value: 0 },
];

const RateDelivery = ({ data, getRequestData }) => {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [tableBody, setTableBody] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [ratingArr, setRatingArr] = useState(initialRatings);
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTableData = async () => {
    try {
      let request = data?.RfqRequestMaterials && data?.RfqRequestMaterials[0];
      let order = data?.orders && data?.orders[0];
      let filteredOrder = data?.RfqQuotes.find(
        (e, i) => e?.RfqQuote?.id === order.RfqQuoteId
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
        quantity: request?.quantity,
        amount: new Intl.NumberFormat().format(
          filteredOrder?.RfqQuote?.totalCost
        ),
        estimatedDelivery: moment(data?.deliveryDate).format("DD-MM-YYYY"),
        status: <Badge status={order?.status} />,
        action: (
          <Flex align="center" onClick={onOpen} cursor="pointer">
            Rate Delivery <IoIosArrowForward />
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
    "UNIT AMOUNT (₦)",
    "ESTIMATED DELIVERY",
    "STATUS",
    "ACTION",
  ];

  const handleRatings = (e, index) => {
    const ratesArr = [...ratingArr];
    ratesArr[index].value = e;
    setRatingArr(ratesArr);
    const overallRating = ratesArr.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);

    setOverallRating(((+overallRating * 5) / 20).toFixed(1));
  };

  const handleSubmitRatings = async () => {
    setLoadingSubmit(true);
    const order = data?.orders[0];
    const contractId = order?.Contract?.id;
    const payload = {
      onTimeDelivery: ratingArr[0].value,
      defectControl: ratingArr[1].value,
      effectiveCommunication: ratingArr[2].value,
      specificationAccuracy: ratingArr[3].value,
      review: "",
      deliveryPictures: [],
    };

    if (overallRating <= 0) {
      setLoadingSubmit(false);
      return handleError("Kindly rate the vendor.");
    }

    try {
      await instance.post(`/builder/order/${contractId}/rate-order`, payload);

      getRequestData();
      handleSuccess("Thank you! you have successfully rated the vendor.");
      setLoadingSubmit(false);
      setRatingArr(initialRatings);
      setOverallRating(0);
      handleSuccessModal("Thank you! you have successfully rated the vendor.");
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

      <BaseModal
        size={"md"}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setRatingArr(initialRatings);
          setOverallRating(0);
        }}
        title="Rate Delivery"
        showHeader={false}
      >
        <Box textAlign="center" my={5}>
          <Text fontSize="24px" fontWeight="600">
            Rate Delivery
          </Text>
        </Box>
        <Box my={5}>
          {ratingArr.map((e, i) => (
            <SimpleGrid columns={2} my={8} key={i}>
              <Text>{e?.name}:</Text>
              <Box>
                <StarRatings
                  rating={e?.value}
                  setRating={(e) => handleRatings(e, i)}
                  iconSize="20px"
                  isEdittable
                  gap={2}
                />
              </Box>
            </SimpleGrid>
          ))}
        </Box>

        <Box my={5} p={5} bg="#F5852C29" rounded="8px">
          <Flex alignItems={"center"} direction="column">
            <Flex justify={"center"} gap={"12px"}>
              <Box color={"#666"}>
                <StarRatingIcon overallRating={overallRating} />
              </Box>
              <Text as={"span"} fontSize={"24px"} fontWeight={600}>
                {overallRating}
              </Text>
            </Flex>
            <Text fontSize="14px">Overall rating</Text>
          </Flex>
        </Box>

        <Box>
          <Button
            full
            isLoading={isLoadingSubmit}
            onClick={handleSubmitRatings}
          >
            Submit
          </Button>
        </Box>
      </BaseModal>

      {ModalComponent}
    </Box>
  );
};

export default RateDelivery;

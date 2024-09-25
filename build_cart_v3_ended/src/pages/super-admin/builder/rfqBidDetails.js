import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../layouts/dashboard";
import GoBackButton from "../../../components/GoBackButton/GoBackButton";
import {
  Box,
  Flex,
  HStack,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import moment from "moment";
import TopCards from "../../builder/projects/components/TopCards";
import cardPattern from "../../../assets/images/card-pattern.svg";
import Naira from "../../../components/Icons/Naira";
import Input from "../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import EmptyState from "../../../components/EmptyState";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import instance from "../../../utility/webservices";
import { capitalize } from "lodash";
import Popup from "../../../components/Popup/Popup";
import PaymentModal from "../../../components/Modals/PaymentModal";
import ViewBids from "../../builder/projects/rfqFlow/viewBids";
import ViewOrders from "../../builder/projects/rfqFlow/viewOrders";
import DeliverySchedule from "../../builder/projects/rfqFlow/deliverySchedule";
import DeliveredOrder from "../../builder/projects/rfqFlow/deliveredOrder";
import RateDelivery from "../../builder/projects/rfqFlow/rateDelivery";
import Dispute from "../../builder/projects/rfqFlow/dispute";

const RfqBidDetails = () => {
  const [detailsArray, setDetailsArray] = useState([]);
  const [ongoingBids, setOngoingBids] = useState(0);
  const [completedBids, setCompletedBids] = useState(0);
  const [request, setRequest] = useState({});
  const [order, setOrder] = useState({});
  const [orderId, setOrderId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bidsLength, setBidsLength] = useState(0);
  const [orderAmount, setOrderAmount] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [RFQStage, setRFQStage] = useState("BIDS");
  const { requestId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [islessthan1200] = useMediaQuery("(max-width: 1200px)");

  const bidsTab = [
    {
      name: "Ongoing",
      type: "ongoing",
      status: "ongoing",
      quantity: ongoingBids ?? 0,
      description:
        "These are projects managed by your company for a third-party institution or fund manager that are experiencing problems or disputes.",
      color: "#074794",
    },
    {
      name: "Completed",
      type: "completed",
      status: "completed",
      quantity: completedBids ?? 0,
      color: "#1C903D",
    },
  ];

  const getRequestData = async (updateStage) => {
    try {
      let { data } = (await instance.get(`/superAdmin/rfqs/${requestId}/bids`))
        .data;

      let stage = "BIDS";

      if (data?.orders.length > 0) {
        stage = "ORDERS";
      }

      if (
        data?.orders[0]?.status === "PAID" ||
        data?.orders[0]?.status === "ONGOING"
      ) {
        stage = "DELIVERYSCHEDULE";
      }

      if (
        (data?.orders[0]?.status === "PAID" ||
          data?.orders[0]?.status === "ONGOING") &&
        data?.orders[0]?.pendingCount === 0
      ) {
        stage = "DELIVEREDORDER";
      }

      if (data?.orders[0]?.Contract.deliveryStatus === "DISPUTE") {
        stage = "DISPUTE";
      }

      //update it to deliveryStatus === delivered
      if (data?.orders[0]?.Contract.status === "COMPLETED") {
        stage = "RATEDELIVERY";
      }

      if (updateStage) {
        stage = updateStage;
      }

      setOrder(data?.orders[0]);
      setRFQStage(stage);

      setDetailsArray([
        {
          name: "Category",
          subName: data?.RfqRequestMaterials[0]?.category?.title,
          color: "#91A448",
        },
        {
          name: "Quantity",
          subName: `${new Intl.NumberFormat().format(
            data?.RfqRequestMaterials[0]?.quantity,
          )} ${capitalize(data?.RfqRequestMaterials[0]?.metric)}`,
          color: "#35A3D2",
        },
        {
          name: "Budget",
          subName: new Intl.NumberFormat().format(
            data?.RfqRequestMaterials[0]?.budget,
          ),
          color: "#4364DC",
        },
        {
          name: "Delivery Address",
          subName: data?.deliveryAddress,
          color: "#DCBA43",
        },
        {
          name: "Estimated Delivery Date",
          subName: moment(data?.deliveryDate).format("DD-MM-YYYY"),
          color: "#3A8942",
        },
      ]);

      setRequest(data);
      setOrderId(data?.orders[0]?.id);

      setOrderAmount(
        data?.orders[0]
          ? data?.orders[0]?.Contract?.totalCost *
              data?.RfqRequestMaterials[0]?.quantity
          : data?.totalBudget,
      );
      setBidsLength(data?.RfqQuotes.length ?? 0);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getOrdersStatisticsData = async () => {
    try {
      let { data } = (await instance.get(`/builder/orders/dashboard`)).data;

      setOngoingBids(data?.ongoingOrders);
      setCompletedBids(data?.completedOrders);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getRequestData();
    getOrdersStatisticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardWrapper pageTitle="Builder">
      <GoBackButton />
      {/* <Text fontSize="24px" fontWeight="900">
        {RFQStage}
      </Text> */}
      <Text fontSize="24px" fontWeight="900">
        {request?.title && request?.title}
      </Text>
      <Box>
        <Flex align="center" gap={4} my="20px" w="100%" wrap="wrap">
          <Flex align="center" gap={4} wrap="wrap">
            {detailsArray.map((el, index) => (
              <Box
                rounded="8px"
                bg={`${el?.color}29`}
                border={`1px solid ${el?.color}`}
                padding="8px 24px"
                key={index}
              >
                <Text fontSize="12px" mb="8px">
                  {el?.name}
                </Text>
                <Text fontWeight="600">{el?.subName}</Text>
              </Box>
            ))}
          </Flex>
          {islessthan1200 ? "" : <Spacer />}

          {/* {RFQStage !== "BIDS" && (
            <Flex
              align="center"
              rounded={"8px"}
              p="14px 24px"
              background={
                order?.status === "PAID" ||
                order?.status === "ONGOING" ||
                order?.status === "COMPLETED"
                  ? "info"
                  : "secondary"
              }
              onClick={
                order?.status === "PAID" ||
                order?.status === "ONGOING" ||
                order?.status === "COMPLETED"
                  ? console.log("no gree")
                  : onOpen
              }
              color="#fff"
              cursor={
                order?.status === "PAID" ||
                order?.status === "ONGOING" ||
                order?.status === "COMPLETED"
                  ? "not-allowed"
                  : "pointer"
              }
              fontWeight="500"
            >
              Fund Order{" "}
              <Popup
                info={`Orders would be dispatched when you put funds in escrow`}
                fill="#fff"
              />
            </Flex>
          )} */}
        </Flex>

        <HStack mt="10px" spacing="24px" w="100%" flexWrap="wrap">
          <Box fontWeight="600" rounded="8px" height="">
            <Text color="secondary" mb="20px" fontSize="20px">
              Payment Type:
            </Text>
            <Flex
              rounded="8px"
              padding="24px"
              align="center"
              h="95px"
              border="1px solid #999999"
            >
              <Flex
                align={["flex-start", "flex-start", "flex-start", "center"]}
                fontSize="18px"
                direction={["column", "column", "row", "row"]}
              >
                {request?.paymentTerm === "BNPL"
                  ? "Buy-now-pay-later"
                  : "Pay-on-delivery"}
                :{" "}
                <Flex>
                  <Naira fill="#1C903D" />{" "}
                  <Text color="#1C903D" as="span">
                    {new Intl.NumberFormat().format(orderAmount ?? 0)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </HStack>
      </Box>
      {bidsLength > 0 ? (
        <>
          {RFQStage === "BIDS" && (
            <ViewBids
              data={request}
              setRFQStage={setRFQStage}
              getRequestData={getRequestData}
            />
          )}

          {RFQStage === "ORDERS" && (
            <ViewOrders
              data={request}
              setRFQStage={setRFQStage}
              getRequestData={getRequestData}
            />
          )}

          {RFQStage === "DELIVERYSCHEDULE" && (
            <DeliverySchedule
              data={request}
              setRFQStage={setRFQStage}
              getRequestData={getRequestData}
            />
          )}

          {RFQStage === "DELIVEREDORDER" && (
            <DeliveredOrder
              data={request}
              setRFQStage={setRFQStage}
              getRequestData={getRequestData}
            />
          )}

          {RFQStage === "RATEDELIVERY" && (
            <RateDelivery
              data={request}
              setRFQStage={setRFQStage}
              getRequestData={getRequestData}
            />
          )}

          {RFQStage === "DISPUTE" && (
            <Dispute
              data={request}
              setRFQStage={setRFQStage}
              getRequestData={getRequestData}
            />
          )}
        </>
      ) : (
        <Box my="40px" p={"32px 24px"} background={"#FCF7F6"}>
          <Flex
            direction={["column", "column", "row"]}
            justifyContent={["space-between"]}
            alignItems={["flex-start", "flex-start", "flex-end"]}
            gap={2}
          >
            <Box fontSize="20px">
              <Text fontWeight="600" color="secondary">
                Bids
              </Text>
              <Text fontSize="14px">
                These are bids that have been submitted by various vendors.
              </Text>
            </Box>

            <Spacer />
            <Box width="max-content" position={"relative"}>
              <Flex gap={"1rem"}>
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<RiSearch2Line />}
                />
              </Flex>
            </Box>
          </Flex>

          <Box mt="20px" p="7% 10px" bg="#fff">
            {isLoading ? (
              <Box w="fit-content" mx="auto">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="#12355A"
                  size="xl"
                />
              </Box>
            ) : (
              <EmptyState>
                <Text>
                  <Text as="span" color="secondary">
                    No bids yet.
                  </Text>{" "}
                  We will send you a notification as soon as our vendors make a
                  bid.
                </Text>
              </EmptyState>
            )}
          </Box>
        </Box>
      )}

      <PaymentModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        useVault
        title="Fund Order"
        subtitle="Place your fund for the order in escrow"
        refresh={getRequestData}
        callbackUrl={`/builder/order/${orderId}/pay`}
        setVal={orderAmount ?? 0}
      />
    </DashboardWrapper>
  );
};

export default RfqBidDetails;

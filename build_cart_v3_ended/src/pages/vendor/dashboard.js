import {
  Avatar,
  Box,
  Flex,
  GridItem,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { GoClockFill } from "react-icons/go";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import faq from "../../assets/images/faq.svg";
import support from "../../assets/images/support.svg";
import Cards from "../../components/Cards/Cards";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import EmptyState from "../../components/EmptyState";
import ListIcon from "../../components/Icons/List";
import UserOctagon from "../../components/Icons/UserOctagon";
import UserPlusIcon from "../../components/Icons/UserPlus";
import BaseTable from "../../components/Table";
import { useTawkMessenger } from "../../context/TawkMessengerContext";
import DashboardWrapper from "../../layouts/dashboard";
import {
  useGetBuilderRFQQuery,
  useGetDashboardEarningChartQuery,
  useGetDashboardQuery,
} from "../../redux/api/vendor/dashboardSlice";

ChartJS.register(ArcElement, Tooltip);

export default function VendorDashboard() {
  const { handleMaximize } = useTawkMessenger();
  const [dashboard, setDashboard] = useState(null);
  const [earningsCharts, setEarningsCharts] = useState([]);
  const [builderRfqs, setBuilderRfqs] = useState([]);
  const [earningChartFilter, setEarningChartFilter] = useState({
    value: 7,
    label: "Last 7 days",
  });

  const filterOptions = [
    {
      value: 7,
      label: "Last 7 days",
    },
    {
      value: 30,
      label: "Last 30 days",
    },
    {
      value: 60,
      label: "Last 60 days",
    },
    {
      value: 90,
      label: "Last 90 days",
    },
  ];

  const checkEarningsCharts = earningsCharts.some((cost) => cost > 0);

  const { data: overview = null, isLoading } = useGetDashboardQuery();
  const { data: builderRfqsTable = null } = useGetBuilderRFQQuery();
  const { data: earningsWithdrawalCharts } = useGetDashboardEarningChartQuery(
    earningChartFilter.value,
  );

  useEffect(() => {
    if (overview) {
      setDashboard(overview.data);
    }
  }, [overview]);

  useEffect(() => {
    if (builderRfqsTable) {
      const builderRfqsData = builderRfqsTable?.data.map((rfq) => {
        return {
          image: (
            <Avatar
              size="sm"
              name={rfq?.CreatedBy?.name}
              src={rfq?.CreatedBy?.Builder?.logo}
            />
          ),
          bilder: rfq?.CreatedBy?.name,
          projectName: rfq?.Project.title,
          budget:
            "₦ " +
            new Intl.NumberFormat().format(rfq.RfqRequestMaterials[0]?.budget),
          startDate: moment(rfq?.Project.startDate).format("DD-MM-YYYY"),
        };
      });
      setBuilderRfqs(builderRfqsData);
    }
  }, [builderRfqsTable]);

  useEffect(() => {
    if (earningChartFilter && earningsWithdrawalCharts) {
      const earnings = earningsWithdrawalCharts?.data;
      setEarningsCharts([
        earnings?.lifeEarnings || 0,
        earnings?.withdrawals || 0,
      ]);
    }
  }, [earningChartFilter, earningsWithdrawalCharts]);

  const tableColumn = [
    { name: "", icon: <UserOctagon color="#fff" fontSize="16px" /> },
    { name: "BUILDERS", icon: <UserPlusIcon /> },
    { name: "PROJECT NAME", icon: <ListIcon color="#fff" fontSize="16px" /> },
    "BUDGET  ₦",
    "START DATE",
  ];

  const data = {
    labels: ["Lifetime Earnings", "Withdrawals"],
    datasets: [
      {
        data: earningsCharts,
        backgroundColor: ["#074794", "#1C903D"],
        borderWidth: 0,
        hoverBorderJoinStyle: "round",
      },
    ],
  };
  const chartOptions = {
    plugins: {
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        bodyColor: "#333",
        titleColor: "#333",
        displayColors: false,
        enabled: true,
        borderWidth: 1,
        borderColor: "#333",
        xAlign: "left",
        callbacks: {
          title: function (context) {
            return "Total " + context[0].label;
          },
          label: function (context) {
            return new Intl.NumberFormat().format(context.raw);
          },
        },
        titleFont: {
          size: "12px",
          weight: "500",
        },
        bodyFont: {
          size: "16px",
          weight: "600",
        },
      },
    },
  };

  const storedUser = localStorage.getItem("userInfo");
  const user = JSON.parse(storedUser);

  const orderCards = [
    {
      name: "Unfulfilled Orders",
      quantity: dashboard?.unFullfilledOrders || 0,
      icon: <IoCheckmarkCircle fontSize="24px" color="#12355A" />,
      bottomColor: "#1C903D",
      description:
        "This represents the total number of orders awaiting delivery",
      info: "far",
      link: "/vendor/order-management?tab=unfulfilled",
    },
    {
      name: "Ongoing Deliveries",
      quantity: dashboard?.ongoingOrders || 0,
      icon: <GoClockFill fontSize="24px" color="#12355A" />,
      bottomColor: "#FFBD00",
      description:
        "These orders are currently undergoing fulfillment and will be delivered to the buyers soon.",
      info: "far",
      link: "/vendor/order-management?tab=active",
    },
    {
      name: "Order Disputies",
      quantity: dashboard?.disputedOrders || 0,
      icon: (
        <Icon viewBox="0 0 24 24" w="24px" h="24px">
          <path
            d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.25 8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75C11.59 13.75 11.25 13.41 11.25 13V8ZM12.92 16.38C12.87 16.51 12.8 16.61 12.71 16.71C12.61 16.8 12.5 16.87 12.38 16.92C12.26 16.97 12.13 17 12 17C11.87 17 11.74 16.97 11.62 16.92C11.5 16.87 11.39 16.8 11.29 16.71C11.2 16.61 11.13 16.51 11.08 16.38C11.03 16.26 11 16.13 11 16C11 15.87 11.03 15.74 11.08 15.62C11.13 15.5 11.2 15.39 11.29 15.29C11.39 15.2 11.5 15.13 11.62 15.08C11.86 14.98 12.14 14.98 12.38 15.08C12.5 15.13 12.61 15.2 12.71 15.29C12.8 15.39 12.87 15.5 12.92 15.62C12.97 15.74 13 15.87 13 16C13 16.13 12.97 16.26 12.92 16.38Z"
            fill="#12355A"
          />
        </Icon>
      ),
      bottomColor: "#EE4124",
      description:
        "These are orders that have encountered problems or received complaints from buyers.",
      info: "far",
      link: "/vendor/order-management?tab=disputes",
    },
    {
      name: "Completed Orders",
      quantity: dashboard?.completedOrders || 0,
      icon: <IoCheckmarkCircle fontSize="24px" color="#12355A" />,
      description:
        "These are orders that have been successfully delivered to the buyer.",
      info: "far",
      link: "/vendor/order-management?tab=completed",
    },
  ];

  const history = useHistory();

  return (
    <DashboardWrapper pageTitle="Overview">
      <Box mb="20px">
        <Box mb={{ base: "10px", md: "0px" }}>
          <Box
            as="h3"
            fontSize={{ base: "18px", md: "24px" }}
            fontWeight="500"
            mb="3px"
          >
            Welcome,{" "}
            <Box as="span" color="#F5852C" fontWeight="600">
              {user?.userName}!
            </Box>
          </Box>
          <Text fontSize="14px">Manage your orders easily...</Text>
        </Box>
      </Box>
      <Box as="h4" color="secondary" fontWeight="600" mb="16px">
        All Ongoing Orders
      </Box>
      <SimpleGrid
        h="auto"
        templateRows="minmax(206px, auto)"
        templateColumns="repeat(4, 1fr)"
        columnGap={{ base: "16px", xl: "24px" }}
        rowGap="16px"
        mb="24px"
      >
        {orderCards.map((el, index) => {
          return (
            <GridItem
              colSpan={[4, 4, 2, 2, 1, 1]}
              key={index}
              minH="206px"
              rowSpan={1}
            >
              <Cards
                onClick={() => history.push(el.link)}
                cardDetail={el}
                h="100%"
                absolute={true}
                bottom="20px"
                bottomFontSize={{ base: "18px", lg: "28px", xl: "40px" }}
              />
            </GridItem>
          );
        })}
      </SimpleGrid>

      <SimpleGrid
        h="auto"
        templateRows="1fr"
        templateColumns="repeat(7, 1fr)"
        gap={{ base: "24px", md: "24px", lg: "40px" }}
        mb="24px"
      >
        <GridItem colSpan={[7, 7, 4, 4]}>
          <Box
            borderRadius="8px"
            border="1px solid #F0F1F1"
            bgColor="#fff"
            boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
            h="100%"
            p="24px"
          >
            {builderRfqs.length === 0 ? (
              <EmptyState>
                <Text fontWeight="500" fontSize={{ base: "14px", md: "20px" }}>
                  You currently do not have any{" "}
                  <Text as="span" color="primary">
                    requests for quotes
                  </Text>{" "}
                  from buyers. To start receiving RFQs, quickly add product
                  items to your inventory.
                </Text>
              </EmptyState>
            ) : (
              <>
                <Flex
                  align="center"
                  justify="space-between"
                  borderBottom="1px solid #F0F1F1"
                  pb="24px"
                  mb="24px"
                >
                  <Text fontWeight="600" color="secondary">
                    Builder RFQs:{" "}
                    <Text as="span" color="primary">
                      100
                    </Text>
                  </Text>
                  <Link
                    as={RouterLink}
                    to="/vendor/bid-board"
                    borderRadius="4px"
                    bgColor="rgba(18, 53, 90, 0.08)"
                    p="11px 32px"
                    fontWeight="500"
                    _hover={{
                      textDecoration: "unset",
                    }}
                  >
                    View all
                  </Link>
                </Flex>
                <BaseTable
                  tableColumn={tableColumn}
                  tableBody={builderRfqs}
                  isLoading={isLoading}
                />
              </>
            )}
          </Box>
        </GridItem>
        <GridItem colSpan={[7, 7, 3, 3]} h="fit-content">
          <Box
            borderRadius="8px"
            border="1px solid #F0F1F1"
            bgColor="#fff"
            boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
            h={{ base: "", md: "100%" }}
            p="24px"
          >
            <Box>
              <Flex
                align="center"
                justify="space-between"
                borderBottom="1px solid #F0F1F1"
                pb="24px"
                mb="24px"
              >
                <Text fontWeight="600" color="secondary">
                  Earnings and Withdrawals
                </Text>
                <CustomSelect
                  options={filterOptions}
                  onChange={setEarningChartFilter}
                  value={earningChartFilter}
                  placeholder="Filter"
                />
              </Flex>
              <Box mx="auto">
                {!checkEarningsCharts ? (
                  <Flex align="center" justify="space-between" mx="auto">
                    <EmptyState md="100%">
                      <Text
                        fontWeight="500"
                        fontSize={{ base: "14px", md: "20px" }}
                      >
                        You have not completed any transactions yet, so you do
                        not currently have any{" "}
                        <Text as="span" color="primary">
                          earnings
                        </Text>
                        . Your earnings will appear here once you've completed a
                        transaction.
                      </Text>
                    </EmptyState>
                  </Flex>
                ) : (
                  <Flex
                    align="center"
                    justify="space-between"
                    maxW="296px"
                    maxH="296px"
                    mx="auto"
                  >
                    <Doughnut data={data} options={chartOptions} />
                  </Flex>
                )}
              </Box>
              <Flex
                align="center"
                justify="space-around"
                borderTop="1px solid #F0F1F1"
                pt="33px"
                mt="30px"
              >
                <Flex align="center">
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="100%"
                    bgColor="#074794"
                    mr="8px"
                  ></Box>
                  <Text fontSize="14px">Lifetime Earnings</Text>
                </Flex>
                <Flex align="center">
                  <Box
                    w="16px"
                    h="16px"
                    borderRadius="100%"
                    bgColor="#1C903D"
                    mr="8px"
                  ></Box>
                  <Text fontSize="14px">Withdrawals</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </GridItem>
      </SimpleGrid>

      <Flex gap="24px" wrap="wrap">
        <Flex
          borderRadius="8px"
          bgColor="#fff"
          boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
          h="197px"
          p="40px 32px"
          maxW="608px"
        >
          <Flex
            justifyContent="center"
            align="center"
            minW="56px"
            minH="56px"
            maxH="56px"
            borderRadius="100%"
            bg="rgba(18, 53, 90, 0.08)"
            mr="8px"
          >
            <Image src={support} />
          </Flex>
          <Box>
            <Text
              as="h3"
              mb="8px"
              fontSize={{ base: "18px", md: "24px" }}
              color="primary"
              fontWeight="500"
            >
              Cutstruct{" "}
              <Text as="span" color="secondary">
                Support Centre
              </Text>
            </Text>
            <Text color="#333" fontSize={{ base: "14px", md: "16px" }}>
              Having difficulty on the platform?{" "}
              <Box
                as="button"
                onClick={handleMaximize}
                _hover={{ textDecoration: "underline" }}
                fontWeight="600"
                color="secondary"
              >
                Click here
              </Box>{" "}
              to speak with a Cutstruct Customer Service Representative or Live
              Chat with your Account Assistant!
            </Text>
          </Box>
        </Flex>
        <Flex
          borderRadius="8px"
          bgColor="#fff"
          boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
          h="197px"
          p="40px 32px"
          maxW="608px"
        >
          <Flex
            justifyContent="center"
            align="center"
            minW="56px"
            minH="56px"
            maxH="56px"
            borderRadius="100%"
            bg="rgba(18, 53, 90, 0.08)"
            mr="8px"
          >
            <Image src={faq} />
          </Flex>
          <Box>
            <Text
              as="h3"
              mb="8px"
              fontSize={{ base: "18px", md: "24px" }}
              color="primary"
              fontWeight="500"
            >
              FAQs:{" "}
              <Text as="span" color="secondary">
                Do you have a question?
              </Text>
            </Text>
            <Text color="#333" fontSize={{ base: "14px", md: "16px" }}>
              Our{" "}
              <Link
                href="https://cutstruct.com/"
                isExternal
                target="_blank"
                color={"secondary"}
                textDecoration={"underline"}
              >
                {" "}
                knowledgebase{" "}
              </Link>{" "}
              has curated answers to help you make the best use of your
              Cutstruct Platform.
            </Text>
          </Box>
        </Flex>
      </Flex>
    </DashboardWrapper>
  );
}

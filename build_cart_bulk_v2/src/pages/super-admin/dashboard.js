import {
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
  Link,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import Button from "../../components/Button";
import Cards from "../../components/Cards/Cards";
import Balance from "../../components/Icons/Balance";
import WalletMinus from "../../components/Icons/WalletMinus";
import WalletPlus from "../../components/Icons/WalletPlus";
import DashboardWrapper from "../../layouts/dashboard";
import {
  useGetDashboardDataQuery,
  useGetLogsQuery,
} from "../../redux/api/super-admin/superAdminSlice";
import { Link as RouterLink } from "react-router-dom/cjs/react-router-dom.min";
import People from "../../components/Icons/People";
import ProjectsIcon from "../../components/Icons/Projects";
import AddTeamMemberForm from "./team/components/addTeamMemberForm";

export default function SuperAdminDashboard() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { data: dashboardData } = useGetDashboardDataQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, refetch } = useGetLogsQuery();

  const tableData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.map((d) => {
      const { teamMember, activityTitle } = d;

      const { name, userType } = teamMember;
      return {
        name: name,
        role: userType,
        activity: activityTitle,
        id: teamMember.id,
      };
    });
  }, [data]);

  const projectCards = [
    {
      name: "Active Projects",
      quantity: dashboardData?.data.activeprojects || 0,
      icon: <ProjectsIcon fill="#12355A" />,
    },
    {
      name: "Active RFQs",
      quantity: dashboardData?.data.activeRfqs || 0,
      icon: <ProjectsIcon fill="#12355A" />,
      bg: "#EE4124",
    },
    {
      name: "Active Orders",
      quantity: dashboardData?.data.activeOrders || 0,
      icon: <ProjectsIcon fill="#12355A" />,
      bg: "#1C903D",
    },
  ];
  const transactionCards = [
    {
      name: "Total Pending Payout",
      quantity: dashboardData?.data.totalPendingPayout || 0,
      icon: <WalletPlus fill="#12355A" />,
      isCurrency: true,
    },
    {
      name: "Total Transaction Volume",
      quantity: dashboardData?.data.totalTransactionVolume || 0,
      icon: <WalletMinus fill="#12355A" />,
      bg: "#EE4124",
      isCurrency: true,
    },
    {
      name: "Total Revenue",
      quantity: dashboardData?.data.totalRevenue || 0,
      icon: <Balance opacity="1" fill="#12355A" />,
      bg: "#1C903D",
      isCurrency: true,
    },
  ];

  const customerCards = [
    {
      name: "Today’s Signups",
      quantity: dashboardData?.data.totalSignups || 0,
      icon: <People fill="#12355A" opacity="1" />,
    },
    {
      name: "Total Customers",
      quantity: dashboardData?.data.totalCustomers || 0,
      icon: <People fill="#12355A" opacity="1" />,
      bg: "#EE4124",
    },
    {
      name: "Customers breakdown",
      // quantity: dashboardData?.data.totalSignups || 0,
      icon: <People fill="#12355A" opacity="1" />,
      bg: "#1C903D",
    },
  ];
  return (
    <DashboardWrapper pageTitle="Overview">
      <Flex
        justifyContent="space-between"
        align="center"
        mb="30px"
        flexWrap="wrap"
        spacing="10px"
      >
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
          <Text fontSize="14px">
            Manage all accounts and projects on the platform.
          </Text>
        </Box>
        <Box>
          <Button
            type="button"
            fontWeight="600"
            width={{ base: "180px", md: "242px" }}
            background="#F5852C"
            onClick={onOpen}
          >
            Add Team Member
          </Button>
        </Box>
      </Flex>

      <Flex gap="30px">
        <Box>
          <Box as="h4" color="secondary" fontWeight="600" mb="16px">
            Transactions
          </Box>
          <SimpleGrid
            h="auto"
            templateRows="minmax(206px, auto)"
            templateColumns="repeat(12, 1fr)"
            columnGap={{ base: "16px", xl: "24px" }}
            rowGap="16px"
            mb="24px"
          >
            {transactionCards.map((el, index) => {
              return (
                <GridItem
                  colSpan={[12, 12, 6, 6, 4, 4]}
                  key={index}
                  minH="206px"
                  rowSpan={1}
                >
                  <Cards
                    cardDetail={el}
                    h="100%"
                    absolute={true}
                    bottom="20px"
                    bottomFontSize={{ base: "18px", lg: "24px" }}
                  >
                    {el.name === "Total Pending Payout" && (
                      <Link
                        as={RouterLink}
                        display="block"
                        to="/super-admin/payouts"
                        pos="absolute"
                        bgColor="rgba(245, 133, 44, 0.16)"
                        color="secondary"
                        p="7px 36px"
                        borderRadius="4px"
                      >
                        View
                      </Link>
                    )}
                  </Cards>
                </GridItem>
              );
            })}
          </SimpleGrid>

          <Box as="h4" color="secondary" fontWeight="600" mb="16px" mt="12px">
            Projects
          </Box>
          <SimpleGrid
            h="auto"
            templateRows="minmax(206px, auto)"
            templateColumns="repeat(12, 1fr)"
            columnGap={{ base: "16px", xl: "24px" }}
            rowGap="16px"
            mb="24px"
          >
            {projectCards.map((el, index) => {
              return (
                <GridItem
                  colSpan={[12, 12, 6, 6, 4, 4]}
                  key={index}
                  minH="206px"
                  rowSpan={1}
                >
                  <Cards
                    cardDetail={el}
                    h="100%"
                    absolute={true}
                    bottom="20px"
                    bottomFontSize={{ base: "18px", lg: "24px" }}
                  />
                </GridItem>
              );
            })}
          </SimpleGrid>

          <Box as="h4" color="secondary" fontWeight="600" mb="16px" mt="12px">
            Customers
          </Box>

          <SimpleGrid
            h="auto"
            templateRows="minmax(206px, auto)"
            templateColumns="repeat(12, 1fr)"
            columnGap={{ base: "16px", xl: "24px" }}
            rowGap="16px"
            mb="24px"
          >
            {customerCards.map((el, index) => {
              return (
                <GridItem
                  colSpan={[12, 12, 6, 6, 4, 4]}
                  key={index}
                  minH="206px"
                  rowSpan={1}
                >
                  <Cards
                    cardDetail={el}
                    h="100%"
                    absolute={true}
                    bottom="20px"
                    bottomFontSize={{ base: "18px", lg: "24px" }}
                  >
                    {el.name === "Customers breakdown" && (
                      <Box pos="absolute" w="70%" mt="-20px">
                        <Flex align="center" justify="space-between" mb="6px">
                          <Text color="primary" fontSize="14px">
                            Fund Manager
                          </Text>
                          <Text
                            color="primary"
                            fontSize="24px"
                            fontWeight="700"
                          >
                            {dashboardData?.data?.customers?.fundManager}
                          </Text>
                        </Flex>
                        <Flex align="center" justify="space-between" mb="6px">
                          <Text color="primary" fontSize="14px">
                            Builder
                          </Text>
                          <Text
                            color="primary"
                            fontSize="24px"
                            fontWeight="700"
                          >
                            {dashboardData?.data?.customers?.builder}
                          </Text>
                        </Flex>
                        <Flex align="center" justify="space-between">
                          <Text color="primary" fontSize="14px">
                            Supplier
                          </Text>
                          <Text
                            color="primary"
                            fontSize="24px"
                            fontWeight="700"
                          >
                            {dashboardData?.data?.customers?.supplier}
                          </Text>
                        </Flex>
                      </Box>
                    )}
                  </Cards>
                </GridItem>
              );
            })}
          </SimpleGrid>
        </Box>

        <Box
          borderRadius="8px"
          p="24px 18px"
          bgColor="rgba(245, 133, 44, 0.04)"
          w="30%"
        >
          <Box
            bgColor="#fff"
            borderRadius="8px"
            border="1px solid rgba(51, 51, 51, 0.1)"
            p="30px 12px 40px 25px"
          >
            <Text color="secondary" fontSize="14px" fontWeight="600" mb="40px">
              Team member logs
            </Text>
            <Box>
              {tableData.map((team) => {
                return (
                  <Link
                    to={`/super-admin/logs/user/${team.id}`}
                    as={RouterLink}
                  >
                    <Flex align="center" mb="27px">
                      <Avatar />
                      <Box ml="13px">
                        <Text color="#333333">{team.name}</Text>
                        <Text color="#333333" fontSize="12px">
                          {team.role}
                        </Text>
                      </Box>
                      <Box ml="auto">
                        <Text color="#333333" fontSize="12px">
                          Activity
                        </Text>
                        <Text color="#666666" fontSize="12px">
                          {team.activity}
                        </Text>
                      </Box>
                    </Flex>
                  </Link>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Flex>

      {isOpen && (
        <AddTeamMemberForm
          action="add"
          isOpen={isOpen}
          onClose={onClose}
          key={isOpen}
          refetch={refetch}
        />
      )}
    </DashboardWrapper>
  );
}

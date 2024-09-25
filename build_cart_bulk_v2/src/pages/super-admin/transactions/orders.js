import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import Cards from "../../../components/Cards/Cards";
import Input from "../../../components/Input";
import CustomTabs from "../../../components/Tabs/CustomTabs";
import DashboardWrapper from "../../../layouts/dashboard";
import { useGetTransactionsQuery } from "../../../redux/api/super-admin/superAdminSlice";
import { addTransparency } from "../../../utility/helpers";
import ActiveTransactionsTable from "./components/ActiveTransactionsTable";
import CompletedTransactionsTable from "./components/CompletedTransactionsTable";
import DisputesTable from "./components/DisputesTable";

/**
 *
 * @param {object} props
 *
 * @param {{
 * activeTransactionVolume: number,
 * completedTransactionVolume: number,
 * disputeTransactionVolume: number,
 * totalActiveTransactions: number,
 * totalCompletedTransactions: number,
 * totalDipsutes: number
 * }} props.data
 * @returns
 */
const TopPart = ({ data }) => {
  return (
    <Box>
      <Box>
        <Text
          fontSize="24px"
          fontWeight={600}
          lineHeight={1.5}
          color={"#F5852C"}
        >
          All{" "}
          <Text as="span" color={"#12355A"}>
            Transactions
          </Text>
        </Text>
        <Text fontSize={"14px"} lineHeight={1.5} color={"#12355A"}>
          All transactions carried out on the platform are displayed here.
        </Text>
      </Box>

      <Grid
        my={"24px"}
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          xl: "repeat(3, 1fr)",
        }}
        gap={"32px"}
      >
        <GridItem>
          <Cards
            cardDetail={{
              name: "Active Transactions Value",
              quantity: data?.activeTransactionVolume || 0,
              icon: <FaCheckCircle size={"24px"} />,
              isCurrency: true,
            }}
            h="128px"
            bg="#12355A"
          />
        </GridItem>
        <GridItem>
          <Cards
            cardDetail={{
              name: "Completed Transactions Value",
              quantity: data?.completedTransactionVolume || 0,
              icon: <FaCheckCircle size={"24px"} />,
              isCurrency: true,
            }}
            h="128px"
            bg="#FFBD00"
          />
        </GridItem>
        <GridItem>
          <Cards
            cardDetail={{
              name: "Disputed Transactions Value",
              isCurrency: true,
              quantity: data?.disputeTransactionVolume || 0,
              icon: <FaCheckCircle size={"24px"} />,
            }}
            h="128px"
            bg="#C43C25"
          />
        </GridItem>
      </Grid>

      <Flex
        py={"20px"}
        px={"24px"}
        color={"#12355A"}
        fontSize={"14px"}
        gap={"16px"}
        align={"center"}
        justify={"space-between"}
        border={`1px solid ${addTransparency("#12355A", 0.2)}`}
        borderRadius={"8px"}
        wrap={"wrap"}
      >
        <Flex gap={"8px"} align={"center"}>
          <Flex
            height={"32px"}
            width={"32px"}
            borderRadius={"50%"}
            backgroundColor={addTransparency("#12355A", 0.08)}
            align={"center"}
            justify={"center"}
          >
            <FaCheckCircle size={"24px"} />
          </Flex>
          <Text fontWeight={500}>Active Transactions Volume: </Text>
          <Text as={"span"} color={"#1C903D"} fontWeight={700}>
            {data?.totalActiveTransactions}
          </Text>{" "}
        </Flex>

        <Flex gap={"8px"} align={"center"}>
          <Flex
            height={"32px"}
            width={"32px"}
            borderRadius={"50%"}
            backgroundColor={addTransparency("#12355A", 0.08)}
            align={"center"}
            justify={"center"}
          >
            <FaCheckCircle size={"24px"} />
          </Flex>
          <Text fontWeight={500}>Completed Transactions Volume: </Text>
          <Text as={"span"} color={"#FFBD00"} fontWeight={700}>
            {data?.totalCompletedTransactions}
          </Text>{" "}
        </Flex>

        <Flex gap={"8px"} align={"center"}>
          <Flex
            height={"32px"}
            width={"32px"}
            borderRadius={"50%"}
            backgroundColor={addTransparency("#12355A", 0.08)}
            align={"center"}
            justify={"center"}
          >
            <FaClock size={"24px"} />
          </Flex>
          <Text fontWeight={500}>Disputes Transactions Volume: </Text>
          <Text as={"span"} color={"#FFBD00"} fontWeight={700}>
            {data?.totalDipsutes}
          </Text>{" "}
        </Flex>
      </Flex>
    </Box>
  );
};

const SuperAdminTransactionsOrders = () => {
  const tabs = [
    { title: "Active Transactions" },
    { title: "Completed Transactions" },
    { title: "Disputes" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].title);

  const { data, isLoading } = useGetTransactionsQuery();

  const activeTransactionsData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.activeTransactions;
  }, [data]);

  const completedTransactionsData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.completedTransactions.filter(
      (trans) => trans.status === "COMPLETED"
    );
  }, [data]);

  const disputeTransactionsData = useMemo(() => {
    if (!data || !data.data) return [];

    return data.data.disputeTransactions;
  }, [data]);

  const transactionsData = useMemo(() => {
    if (!data || !data.data) return;

    const {
      activeTransactionVolume,
      completedTransactionVolume,
      disputeTransactionVolume,
      totalActiveTransactions,
      totalCompletedTransactions,
      totalDipsutes,
    } = data.data;

    return {
      activeTransactionVolume,
      completedTransactionVolume,
      disputeTransactionVolume,
      totalActiveTransactions,
      totalCompletedTransactions,
      totalDipsutes,
    };
  }, [data]);

  return (
    <DashboardWrapper pageTitle="TRANSACTIONS">
      <TopPart data={transactionsData} />

      <Box
        mt={"12px"}
        py={"12px"}
        px={"6px"}
        borderRadius={"8px"}
        backgroundColor={addTransparency("#F5852C", 0.04)}
      >
        <Flex justifyContent={"space-between"} gap={"2rem"}>
          <Box flexShrink={0}>
            <CustomTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </Box>

          <Box maxWidth={"320px"}>
            <Input placeholder="Search ..." />
          </Box>
        </Flex>

        <Box mt={"24px"} background={"white"}>
          {activeTab === "Active Transactions" && (
            <ActiveTransactionsTable
              data={activeTransactionsData}
              isLoading={isLoading}
            />
          )}
          {activeTab === "Completed Transactions" && (
            <CompletedTransactionsTable
              data={completedTransactionsData}
              isLoading={isLoading}
            />
          )}
          {activeTab === "Disputes" && (
            <DisputesTable
              data={disputeTransactionsData}
              isLoading={isLoading}
            />
          )}
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default SuperAdminTransactionsOrders;

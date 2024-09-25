import {
  Box,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { forwardRef, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { FaCheckCircle } from "react-icons/fa";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import Button from "../../../components/Button";
import Cards from "../../../components/Cards/Cards";
import CalendarIcon from "../../../components/Icons/Calendar";
import Input from "../../../components/Input";
import CustomTabs from "../../../components/Tabs/CustomTabs";
import useDebounce from "../../../hook/useDebounce";
import DashboardWrapper from "../../../layouts/dashboard";
import { useFetchPayoutsQuery } from "../../../redux/api/super-admin/superAdminSlice";
import CompletedPayoutsTable from "./components/CompletedPayoutsTable";
import PendingPayoutsTable from "./components/PendingPayoutsTable";
const Filters = ({ setFilters }) => {
  const StartDate = forwardRef(({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      placeholder="Start date"
      value={value}
      readOnly
      rightIcon={<CalendarIcon />}
    />
  ));
  const EndDate = forwardRef(({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      placeholder="End date"
      value={value}
      readOnly
      rightIcon={<CalendarIcon />}
    />
  ));
  const [dates, setDates] = useState({ from: "", to: "", active: false });
  function resetFilters() {
    setDates({ from: "", to: "", active: false });
  }
  function handleDate(value, key) {
    setDates((currrentDate) => ({ ...currrentDate, [key]: value }));
  }
  function handleApply() {
    if (dates.active) {
      setFilters({ date: { to: dates.to, from: dates.from } });
      return;
    }
    setFilters({ date: { to: "", from: "" } });
  }
  return (
    <Popover placement="auto">
      <PopoverTrigger>
        <Box
          as={"button"}
          height={"48px"}
          backgroundColor={"primary"}
          color={"white"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"16px"}
          p={"12px"}
          borderRadius={"8px"}
          fontWeight={700}
          fontSize={"14px"}
        >
          <RiFilter2Fill />
          Filter{" "}
        </Box>
      </PopoverTrigger>
      <PopoverContent p={0} maxW={"249px"}>
        <PopoverBody p={"16px"}>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Text fontSize={"12px"} color={"#999"}>
              Filter
            </Text>
          </Flex>
          <VStack gap="24px" width={"100%"} mt={"24px"}>
            <VStack spacing="0px" width={"100%"}>
              <Box width={"100%"}>
                <VStack spacing="16px" mt="8px">
                  <Box
                    justifyContent="space-between"
                    alignItems="center"
                    width={"100%"}
                  >
                    <ReactDatePicker
                      customInput={<StartDate />}
                      minDate={new Date()}
                      selected={dates.from}
                      onChange={(val) => handleDate(val, "from")}
                    />
                  </Box>
                </VStack>
              </Box>
              <Box width={"100%"}>
                <VStack spacing="16px" mt="8px">
                  <Box
                    justifyContent="space-between"
                    alignItems="center"
                    width={"100%"}
                  >
                    <ReactDatePicker
                      customInput={<EndDate />}
                      minDate={new Date()}
                      selected={dates.to}
                      onChange={(val) => handleDate(val, "to")}
                    />
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </VStack>
          <Box mt={"40px"}>
            <Button fontWeight="600" full onClick={handleApply}>
              Apply
            </Button>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
/**
 *
 * @param {{totalCompletedPayout, totalCompletedPayoutVolume, totalPendingPayout, totalPendingPayoutVolume}} props
 * @returns
 */
const TopPart = ({
  totalCompletedPayout,
  totalPendingPayout,
  totalCompletedPayoutVolume,
  totalPendingPayoutVolume,
}) => {
  return (
    <Box>
      <Box>
        <Text
          fontSize="24px"
          fontWeight={600}
          lineHeight={1.5}
          color={"#F5852C"}
        >
          Payouts
        </Text>
        <Text fontSize={"14px"} lineHeight={1.5} color={"#12355A"}>
          All payouts made on the platform are displayed here.
        </Text>
      </Box>
      <Grid
        my={"24px"}
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap={"32px"}
      >
        <GridItem>
          <Cards
            cardDetail={{
              name: "Total Pending Payout",
              quantity: totalPendingPayout,
              isCurrency: true,
              icon: <FaCheckCircle size={"24px"} />,
            }}
            h="128px"
            bg="#12355A"
          />
        </GridItem>
        <GridItem>
          <Cards
            cardDetail={{
              name: "Total Pending Payout Volume",
              quantity: totalPendingPayoutVolume,
              icon: <FaCheckCircle size={"24px"} />,
            }}
            h="128px"
            bg="#C43C25"
          />
        </GridItem>
        <GridItem>
          <Cards
            cardDetail={{
              name: "Total Completed Payout",
              quantity: totalCompletedPayout,
              isCurrency: true,
              icon: <FaCheckCircle size={"24px"} />,
            }}
            h="128px"
            bg="#FFBD00"
          />
        </GridItem>
        <GridItem>
          <Cards
            cardDetail={{
              name: "Total Completed Payout",
              quantity: totalCompletedPayoutVolume,
              icon: <FaCheckCircle size={"24px"} />,
            }}
            h="128px"
            bg="#F5852C"
          />
        </GridItem>
      </Grid>
    </Box>
  );
};
const SuperAdminPayouts = () => {
  const { data } = useFetchPayoutsQuery();
  const neededData = useMemo(() => {
    if (!data) return;
    if (!data.data) return;
    const {
      totalCompletedPayout,
      totalCompletedPayoutVolume,
      totalPendingPayout,
      totalPendingPayoutVolume,
    } = data.data;
    return {
      totalCompletedPayout,
      totalPendingPayout,
      totalCompletedPayoutVolume,
      totalPendingPayoutVolume,
    };
  }, [data]);
  const pendingPayoutsTableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];
    const { pendingPayouts } = data.data;
    return pendingPayouts;
  }, [data]);
  const completedPayoutsTableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];
    const { completedPayouts } = data.data;
    return completedPayouts;
  }, [data]);
  const tabs = [
    {
      title: "Pending Payouts",
    },
    {
      title: "Completed Payouts",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 600);
  return (
    <DashboardWrapper pageTitle="PAYMENTS">
      {neededData && (
        <TopPart
          totalCompletedPayout={neededData.totalCompletedPayout}
          totalPendingPayout={neededData.totalPendingPayout}
          totalCompletedPayoutVolume={neededData.totalCompletedPayoutVolume}
          totalPendingPayoutVolume={neededData.totalPendingPayoutVolume}
        />
      )}
      <Flex
        alignItems={"baseline"}
        justifyContent={"space-between"}
        wrap={"wrap"}
        gap={"1rem"}
      >
        <CustomTabs
          activeTab={activeTab}
          tabs={tabs}
          setActiveTab={setActiveTab}
        />
        <Flex mt={"24px"} minWidth={"320px"} gap={"10px"}>
          <Input
            placeholder="Search payout"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<RiSearch2Line />}
          />
          <Filters />
        </Flex>
      </Flex>
      <Box mt={"1rem"}>
        {activeTab === "Pending Payouts" && (
          <PendingPayoutsTable
            pendingPayoutsTableData={pendingPayoutsTableData}
          />
        )}
        {activeTab === "Completed Payouts" && (
          <CompletedPayoutsTable
            completedPayoutsTableData={completedPayoutsTableData}
          />
        )}
      </Box>
    </DashboardWrapper>
  );
};
export default SuperAdminPayouts;

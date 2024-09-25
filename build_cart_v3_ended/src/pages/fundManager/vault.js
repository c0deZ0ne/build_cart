import {
  Box,
  Button as ChakraButton,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import ProjectCards from "../../components/Cards/ProjectCards";
import CustomCheckBoxIcon from "../../components/Checkmark/CustomCheckBox";
import ExportIcon from "../../components/Icons/Export";
import IconContainer from "../../components/Icons/IconContainer";
import Naira from "../../components/Icons/Naira";
import VaultIcon from "../../components/Icons/Vault";
import Input from "../../components/Input";
import PaymentModal from "../../components/Modals/PaymentModal";
import Popup from "../../components/Popup/Popup";
import CustomTabs from "../../components/Tabs/CustomTabs";
import TransactionHistoryInflowList from "../../components/Vault/TransactionHistoryInflowList";
import TransactionHistoryOutflowList from "../../components/Vault/TransactionHistoryOutflowList";
import useDebounce from "../../hook/useDebounce";
import DashboardWrapper from "../../layouts/dashboard";
import { useGetAccountDetailsQuery } from "../../redux/api/fundManager/fundManager";
import { userData } from "../../redux/store/store";
import { addTransparency } from "../../utility/helpers";
import PaymentWalletModal from "../../components/Modals/PaymentWalletModal";

const Filters = ({ setFilters }) => {
  const [dates, setDates] = useState({ from: "", to: "", active: false });

  function resetFilters() {
    setDates({ from: "", to: "", active: false });
  }

  function handleDate(e, key) {
    setDates((currrentDate) => ({ ...currrentDate, [key]: e.target.value }));
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
              Filter by
            </Text>
            <ChakraButton
              onClick={resetFilters}
              variant="ghost"
              color="primary"
              size="xs"
              border={0}
              p="0"
            >
              Clear All
            </ChakraButton>
          </Flex>

          <VStack gap="24px" width={"100%"} mt={"24px"}>
            <VStack spacing="8px" width={"100%"}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                width={"100%"}
              >
                <Text color={"#333"} textTransform={"capitalize"}>
                  Date
                </Text>
                <Checkbox
                  onChange={() => setDates({ ...dates, active: !dates.active })}
                  isChecked={dates.active}
                  colorScheme="primary"
                  size="lg"
                  icon={<CustomCheckBoxIcon />}
                ></Checkbox>
              </Flex>

              <Box width={"100%"}>
                <Text fontSize={"14px"}>From</Text>
                <VStack spacing="16px" mt="8px">
                  <Box
                    justifyContent="space-between"
                    alignItems="center"
                    width={"100%"}
                  >
                    <Input
                      height={"40px"}
                      type="date"
                      borderRadius={"2px"}
                      value={dates.from}
                      onChange={(e) => handleDate(e, "from")}
                    />
                  </Box>
                </VStack>
              </Box>
              <Box width={"100%"}>
                <Text fontSize={"14px"}>To</Text>
                <VStack spacing="16px" mt="8px">
                  <Box
                    justifyContent="space-between"
                    alignItems="center"
                    width={"100%"}
                  >
                    <Input
                      height={"40px"}
                      type="date"
                      borderRadius={"2px"}
                      value={dates.to}
                      onChange={(e) => handleDate(e, "to")}
                      min={dates.from}
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

const TopPart = () => {
  const userInfo = useSelector(userData);

  const {
    data: { email },
  } = userInfo;

  const { data, refetch: refetchUserAccountDetails } =
    useGetAccountDetailsQuery(email);

  const neededData = useMemo(() => {
    const result = {
      balance: 0,
      spend: 0,
      credit: 0,
    };

    if (data && data.data) {
      const { balance, ActualSpend, totalCredit } = data.data.wallet;
      result.balance = Intl.NumberFormat().format(balance);
      result.spend = Intl.NumberFormat().format(ActualSpend);
      result.credit = Intl.NumberFormat().format(totalCredit);
    }

    return result;
  }, [data]);

  const {
    isOpen: fundIsOpen,
    onOpen: fundOnOpen,
    onClose: fundOnClose,
  } = useDisclosure();

  return (
    <Flex gap={"24px"} justify={"space-between"} p={"1px"} wrap={"wrap"}>
      <Grid
        flexGrow={0}
        gap={"24px"}
        templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }}
      >
        <GridItem>
          <ProjectCards
            height="140px"
            padding="16px 24px"
            rounded="8px"
            border="6px solid #12355A"
          >
            <VStack gap={"24px"} height={"100%"} color={"primary"}>
              <Flex align="center" w={"100%"}>
                <IconContainer rounded="50%" color="#12355a">
                  <VaultIcon fill="#12355a" opacity="1" />
                </IconContainer>
                <Text mr="auto" fontSize="16px" fontWeight="600">
                  Account Balance
                </Text>
                <Popup
                  info={
                    "This is the total amount of money available in your Cutstruct account."
                  }
                  width="220px"
                />
              </Flex>

              <Flex align="center" w={"100%"}>
                <Naira />
                <Text fontWeight={700} fontSize={"24px"}>
                  {neededData.balance}{" "}
                </Text>
              </Flex>
            </VStack>
          </ProjectCards>
        </GridItem>

        <GridItem>
          <ProjectCards
            height="140px"
            padding="16px 24px"
            rounded="8px"
            border="0px solid #EE4124"
          >
            <VStack gap={"24px"} height={"100%"} color={"primary"}>
              <Flex align="center" w={"100%"}>
                <IconContainer rounded="50%">
                  <VaultIcon fill="currentColor" opacity="1" />
                </IconContainer>
                <Text mr="auto" fontSize="16px" fontWeight="600">
                  Total Outflow
                </Text>
                <Popup
                  info={
                    "This is the total amount of money you've spent on transactions."
                  }
                  width="220px"
                />
              </Flex>

              <Flex align="center" w={"100%"}>
                <Naira fill="currentColor" />
                <Text fontWeight={700} fontSize={"24px"}>
                  {neededData.spend}
                </Text>
              </Flex>
            </VStack>
          </ProjectCards>
        </GridItem>
        <GridItem>
          <ProjectCards
            height="140px"
            padding="16px 24px"
            rounded="8px"
            border="0px solid #EE4124"
          >
            <VStack gap={"24px"} height={"100%"}>
              <Flex align="center" w={"100%"}>
                <IconContainer rounded="50%">
                  <VaultIcon fill="#074794" opacity="1" />
                </IconContainer>
                <Text mr="auto" fontSize="16px" fontWeight="600">
                  Total Inflow
                </Text>
                <Popup
                  info={
                    "This is the total amount of money you've deposited into your Cutstruct account."
                  }
                  width="220px"
                />
              </Flex>

              <Flex align="center" w={"100%"}>
                <Naira fill="#1C903D" />
                <Text fontWeight={700} fontSize={"24px"} color={"#1C903D"}>
                  {neededData.credit}
                </Text>
              </Flex>
            </VStack>
          </ProjectCards>
        </GridItem>
        {/* <GridItem>
          <ProjectCards
            height="140px"
            padding="16px 24px"
            rounded="8px"
            border="0px solid #EE4124"
          >
            <VStack gap={"24px"} height={"100%"} color={"#12355A"}>
              <Flex align="center" w={"100%"}>
                <Text mr="auto" fontSize="16px" fontWeight="600">
                  Quick Actions
                </Text>
              </Flex>

              <Flex w={"100%"} align={"center"}>
                <IconContainer color="#F5852C">
                  <ExportIcon width="22px" height="22px" fill="#F5852C" />
                </IconContainer>

                <Text
                  fontSize="12px"
                  cursor="pointer"
                  _hover={{ fontSize: "12.2px" }}
                  fontWeight="600"
                  maxWidth="160px"
                >
                  Export Transaction History
                </Text>
              </Flex>
            </VStack>
          </ProjectCards>
        </GridItem> */}
      </Grid>

      <Box width={"200px"}>
        <Button full color="white" background="#F5852C" onClick={fundOnOpen}>
          Add Funds
        </Button>
      </Box>

      <Box pos={"absolute"}>
        <PaymentWalletModal
          onOpen={fundOnOpen}
          onClose={fundOnClose}
          isOpen={fundIsOpen}
          refresh={refetchUserAccountDetails}
          title="Fund Account"
          description="Funded vault account"
          paymentPurpose={"FUND_WALLET"} // FUND_PROJECT_WALLET,FUND_WALLET,FUND_ORDER
        />
      </Box>
    </Flex>
  );
};
const Vault = () => {
  const tabs = [
    {
      title: "Inflow",
      info: "This table shows all inflow (deposit) transactions in your vault.",
    },
    {
      title: "Outflow",
      info: "This table shows all outflow (expenditure) in your vault.",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const tableColumns = [
    "S/N",
    "DESCRIPTION",
    "TRANSACTION ID",
    "AMOUNT ₦",
    "DATE",
    "TIME",
  ];

  const [filters, setFilters] = useState({ date: { to: "", from: "" } });

  return (
    <DashboardWrapper pageTitle="Vault">
      <TopPart />

      <Box
        mt={"40px"}
        p={"40px 24px"}
        borderRadius="8px"
        backgroundColor={addTransparency("#f5852c", 0.04)}
      >
        <Box backgroundColor={"white"} p={"40px 24px"} borderRadius="8px">
          <Box>
            <Text fontSize={"24px"} fontWeight={600} color={"primary"}>
              Transaction{" "}
              <Text as="span" color={"secondary"}>
                {" "}
                History{" "}
              </Text>
            </Text>
            <Text fontSize={"14px"} color={"#666666"}>
              View vault inflow and outflow below.
            </Text>
          </Box>

          <Box mt={"16px"}>
            <Flex justify={"space-between"} wrap={"wrap"} gap={"24px"}>
              <CustomTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
              />

              <Flex gap={"24px"} align={"center"}>
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<RiSearch2Line />}
                />

                <Filters setFilters={setFilters} />
              </Flex>
            </Flex>
          </Box>

          <Box mt={"24px"}>
            {activeTab === "Inflow" && (
              <TransactionHistoryInflowList
                tableColumns={tableColumns}
                startDate={filters.date.from}
                endDate={filters.date.to}
                searchTerm={debouncedSearchTerm}
              />
            )}

            {activeTab === "Outflow" && (
              <TransactionHistoryOutflowList
                tableColumns={tableColumns}
                startDate={filters.date.from}
                endDate={filters.date.to}
                searchTerm={debouncedSearchTerm}
              />
            )}
          </Box>
        </Box>
      </Box>
    </DashboardWrapper>
  );
};

export default Vault;

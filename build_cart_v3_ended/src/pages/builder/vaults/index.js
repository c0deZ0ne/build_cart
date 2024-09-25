import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  // VStack,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import ProjectCards from "../../../components/Cards/ProjectCards";
import Popup from "../../../components/Popup/Popup";
import IconContainer from "../../../components/Icons/IconContainer";
import VaultIcon from "../../../components/Icons/Vault";
import Naira from "../../../components/Icons/Naira";
// import ExportIcon from "../../../components/Icons/Export";
import Button from "../../../components/Button";
import InflowTransaction from "./inflowTransaction";
import Input from "../../../components/Input";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import Tabs from "../../../components/Tabs/Tabs";
import OutflowTransaction from "./outflowTransaction";
import PaymentModal from "../../../components/Modals/PaymentModal";
import instance from "../../../utility/webservices";
import moment from "moment";
import PaymentWalletModal from "../../../components/Modals/PaymentWalletModal";

const Vault = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltered, setFiltered] = useState(false);
  const [refreshVault, setRefreshVault] = useState(null);
  const [userAccountInfo, setUserAccountInfo] = useState({});
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const tabsArray = {
    headers: [
      {
        title: "Inflow",
        info: "This is the total amount of money you've deposited into your vault",
      },
      {
        title: "Outflow",
        info: "This is the total amount of money you've spent from your vault",
      },
    ],
    body: [
      <InflowTransaction
        search={searchTerm}
        startDate={startDate}
        endDate={endDate}
        isFiltered={isFiltered}
        setFiltered={setFiltered}
        refreshVault={refreshVault}
      />,
      <OutflowTransaction
        search={searchTerm}
        startDate={startDate}
        endDate={endDate}
        isFiltered={isFiltered}
        setFiltered={setFiltered}
        refreshVault={refreshVault}
      />,
    ],
  };

  const [isBetween992and1200] = useMediaQuery(
    "(min-width: 992px) and (max-width: 1200px)",
  );

  const getUserAccount = async () => {
    try {
      const { data } = (
        await instance.get(`/user/account-details?email=${user?.email}`)
      ).data;

      setUserAccountInfo(data?.wallet);
      setRefreshVault(!refreshVault);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserAccount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetAll = () => {
    setStartDate("");
    setEndDate("");
    setFiltered(false);
  };

  useEffect(() => {
    resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFiltered]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();
  return (
    <DashboardWrapper pageTitle="Vault">
      <Grid
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(11, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={3} colSpan={[11, 11, 6, 4]}>
          <ProjectCards padding="5%" rounded="6px" border="6px solid #12355A">
            <Flex align="center">
              <IconContainer rounded="50%" color="#12355a">
                <VaultIcon fill="#12355a" opacity="1" />
              </IconContainer>
              <Text mr="auto" fontSize="16px" fontWeight="600">
                Account
              </Text>
              <Popup
                info={
                  "This is the total amount of money available in your vault."
                }
                width="220px"
              />
            </Flex>
            <Box my="40px">
              <Text fontSize="14px">Balance</Text>
              <Flex alignItems="center" fontSize="24px" fontWeight="700">
                <Naira />
                {new Intl.NumberFormat().format(userAccountInfo?.balance ?? 0)}
              </Flex>
            </Box>

            <Box
              bg="rgba(241,206,197,0.2)"
              rounded="8px"
              color="red"
              p="20px 16px 10px"
            >
              <Text fontSize="14px" mb="10px">
                Pending Payment
              </Text>
              <Flex alignItems="center" fontSize="24px" fontWeight="700">
                <Naira fill="red" />
                {new Intl.NumberFormat().format(0)}
              </Flex>
            </Box>
          </ProjectCards>
        </GridItem>
        <GridItem rowSpan={3} colSpan={[11, 11, 5, 4]}>
          <ProjectCards padding="5%" rounded="6px" border="6px solid #EE4124">
            <Flex align="center">
              <IconContainer rounded="50%" color="#074794">
                <VaultIcon fill="#074794" opacity="1" />
              </IconContainer>
              <Text mr="auto" color="#074794" fontSize="16px" fontWeight="600">
                Transaction
              </Text>
              <Popup
                info={
                  "This is the total amount of money you have deposited and spent"
                }
                width="220px"
              />
            </Flex>
            <Box my="40px">
              <Text fontSize="14px">Total Inflow</Text>
              <Flex alignItems="center" fontSize="24px" fontWeight="700">
                <Naira />
                {new Intl.NumberFormat().format(
                  userAccountInfo?.totalCredit ?? 0,
                )}
              </Flex>
            </Box>

            <Box
              bg="rgba(241,206,197,0.2)"
              rounded="8px"
              color="red"
              p="20px 16px 10px"
            >
              <Text fontSize="14px" mb="10px">
                Total Outflow
              </Text>
              <Flex alignItems="center" fontSize="24px" fontWeight="700">
                <Naira fill="red" />
                {new Intl.NumberFormat().format(
                  userAccountInfo?.ActualSpend ?? 0,
                )}
              </Flex>
            </Box>
          </ProjectCards>
        </GridItem>
        <GridItem
          rowSpan={3}
          display={["none", "none", "none", "block"]}
          colSpan={[5, 5, 1, 1]}
        ></GridItem>
        <GridItem rowSpan={3} colSpan={[5, 5, 5, 2]}>
          <Flex justify="space-between" direction="column" h="100%">
            <Box>
              <Button full onClick={onOpen}>
                Add Funds
              </Button>
            </Box>
            {/* <Flex w="100%">
              <ProjectCards padding="20px 10px" width="200px">
                <Text fontSize="14px" fontWeight="600" color="primary">
                  Quick Actions
                </Text>

                <VStack alignItems="flex-start">
                  <Flex
                    alignItems={isBetween992and1200 ? "flex-start" : "center"}
                    mt="10px"
                    direction={isBetween992and1200 ? "column" : "row"}
                  >
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
            </Flex> */}
          </Flex>
        </GridItem>
      </Grid>

      <Box
        my="40px"
        borderRadius="8px"
        boxShadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
        padding="20px"
        bg="#FCF7F6"
      >
        <Flex fontWeight="600" fontSize="24px">
          <Text color="primary" mr="5px">
            Transaction
          </Text>
          <Text color="secondary"> History</Text>
        </Flex>
        <Box>
          <Tabs tabsData={tabsArray}>
            <Flex gap={"1rem"}>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFiltered(true);
                }}
                leftIcon={<RiSearch2Line />}
                width="200px"
              />

              <Box>
                <Menu
                  isOpen={isOpenMenu}
                  onOpen={onOpenMenu}
                  onClose={onCloseMenu}
                  closeOnSelect={false}
                  isLazy
                  direction="ltr"
                >
                  <MenuButton as="div" style={{ cursor: "pointer" }}>
                    <Button leftIcon={<RiFilter2Fill />}>Filter</Button>
                  </MenuButton>
                  <MenuList>
                    <Flex
                      p="10px"
                      fontWeight="600"
                      fontSize="14px"
                      justify="space-between"
                    >
                      <Text color="info">Filter by:</Text>
                      <Text cursor="pointer" onClick={resetAll} color="primary">
                        Clear all
                      </Text>
                    </Flex>
                    <MenuDivider />

                    <MenuDivider />
                    <Box p="10px" fontWeight="600" fontSize="14px">
                      <Text>Date</Text>
                    </Box>
                    <Box m="0px 10px" fontSize="14px">
                      <Text>From</Text>
                    </Box>
                    <MenuItem>
                      <Input
                        type="date"
                        onChange={(e) =>
                          setStartDate(
                            moment(e?.target?.value).format("YYYY-MM-DD"),
                          )
                        }
                        value={startDate}
                        placeholder="Start date"
                      />
                    </MenuItem>
                    <Box m="0px 10px" fontSize="14px">
                      <Text>To</Text>
                    </Box>
                    <MenuItem>
                      <Input
                        type="date"
                        onChange={(e) =>
                          setEndDate(
                            moment(e?.target?.value).format("YYYY-MM-DD"),
                          )
                        }
                        value={endDate}
                        placeholder="Start date"
                      />
                    </MenuItem>

                    <Box p="10px">
                      <Button
                        full
                        onClick={() => {
                          setFiltered(true);
                          onCloseMenu();
                        }}
                      >
                        Apply
                      </Button>
                    </Box>
                  </MenuList>
                </Menu>
              </Box>
            </Flex>
          </Tabs>
        </Box>
      </Box>

      <PaymentWalletModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        title="Fund Account"
        subtitle="Fund your account to enable transactions"
        refresh={getUserAccount}
        description="Funded vault account"
        paymentPurpose={"FUND_WALLET"} // FUND_PROJECT_WALLET,FUND_WALLET,FUND_ORDER
      />
    </DashboardWrapper>
  );
};

export default Vault;

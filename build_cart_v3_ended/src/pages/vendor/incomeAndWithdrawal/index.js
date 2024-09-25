import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { RiFilter2Fill, RiSearch2Line } from "react-icons/ri";
import Button from "../../../components/Button";
import Cards from "../../../components/Cards/Cards";
import ExportIcon from "../../../components/Icons/Export";
import IconContainer from "../../../components/Icons/IconContainer";
import VaultIcon from "../../../components/Icons/Vault";
import WalletMinus from "../../../components/Icons/WalletMinus";
import WalletPlus from "../../../components/Icons/WalletPlus";
import Input from "../../../components/Input";
import Tabs from "../../../components/Tabs/Tabs";
import DashboardWrapper from "../../../layouts/dashboard";
import instance from "../../../utility/webservices";
import AllTransaction from "./allTransactions";
import Income from "./income";
import WithdrawFundsModal from "./withdrawFundsModal";
import Withdrawals from "./withdrawals";

const Vault = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCheckedPayment, setCheckedPayment] = useState(false);
  const [isCheckedActive, setCheckedActive] = useState(false);
  const [isCheckedPending, setCheckedPending] = useState(false);
  const [isCheckedCompleted, setCheckedCompleted] = useState(false);
  const [isFiltered, setFiltered] = useState(false);
  const [walletDetails, setWalletDetails] = useState({});
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  const getUserAccount = async () => {
    const res = await instance.get(`/vendor/transaction/account-details`);

    setWalletDetails(res.data.data);
  };

  const cardDetails = [
    {
      isCurrency: true,
      bg: "#12355a",
      color: "#12355a",
      bottomColor: "#12355a",
      quantity: walletDetails?.currentBalance ?? 0,
      info: true,
      description:
        "This is the total amount of money currently available for withdrawal from your account.",
      icon: <VaultIcon fill="#12355a" opacity="1" />,
      name: "Current Balance",
    },
    {
      isCurrency: true,
      bg: "#074794",
      color: "#074794",
      quantity: walletDetails?.escrowIncome ?? 0,
      info: true,
      description:
        'This represents the sum of earnings from transactions awaiting deposit into your "Current Balance".',
      icon: <WalletPlus fill="#074794" opacity="1" />,
      name: "Escrowed Income",
    },
    {
      isCurrency: true,
      bg: "red",
      color: "red",
      quantity: "-" + walletDetails?.withdrawals ?? 0,
      info: true,
      description:
        "This is the total amount of money that has been withdrawn from your account.",
      icon: (
        <IconContainer rounded="50%" color="#ff4343">
          <WalletMinus fill="#ff0000" opacity="1" />
        </IconContainer>
      ),
      name: "Withdrawals",
    },
  ];

  const tabsArray = {
    headers: [
      {
        title: "All Transaction",
        info: "This is a record of all transactions on your account.",
      },
      {
        title: "Income",
        info: "This is a record of your earnings.",
      },
      {
        title: "Withdrawals",
        info: "This is a record of your withdrawals.",
      },
    ],
    body: [
      <AllTransaction
        search={searchTerm}
        startDate={startDate}
        endDate={endDate}
        isFiltered={isFiltered}
        defaultIndex={defaultIndex}
      />,
      <Income
        search={searchTerm}
        startDate={startDate}
        endDate={endDate}
        isFiltered={isFiltered}
        defaultIndex={defaultIndex}
      />,
      <Withdrawals
        search={searchTerm}
        startDate={startDate}
        endDate={endDate}
        isFiltered={isFiltered}
        defaultIndex={defaultIndex}
        isSuccess={isSuccess}
      />,
    ],
  };

  useEffect(() => {
    getUserAccount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const resetAll = () => {
    setStartDate("");
    setEndDate("");
    setCheckedPayment(false);
    setCheckedActive(false);
    setCheckedPending(false);
    setCheckedCompleted(false);
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
    <DashboardWrapper pageTitle="Earnings and Withdrawals">
      <SimpleGrid columns={[1, 2, 2, 4]} mb={5} gap={4} minH="200px">
        {cardDetails.map((el, index) => (
          <Cards spacer cardDetail={el} key={index}>
            {index === 0 && (
              <Flex justify="flex-end">
                <Box>
                  <Button fontSize="12px" onClick={onOpen}>
                    Withdraw Funds
                  </Button>
                </Box>
              </Flex>
            )}
          </Cards>
        ))}

        <Box
          hidden
          borderRadius="8px"
          boxShadow="0px 0px 5px 1px rgba(18, 53, 90, 0.09)"
          padding="20px 10px"
          bg="#fff"
          w="80%"
        >
          <Text fontSize="14px" fontWeight="600" color="primary">
            Quick Actions
          </Text>

          <Flex
            alignItems="center"
            fontSize="12px"
            _hover={{ fontSize: "12.5px" }}
            mt="20px"
            cursor="pointer"
          >
            <IconContainer color="#F5852C">
              <ExportIcon width="22px" height="22px" fill="#F5852C" />
            </IconContainer>

            <Text fontWeight="600">Export Data</Text>
          </Flex>
        </Box>
      </SimpleGrid>

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
          <Tabs
            tabsData={tabsArray}
            defaultIndex={defaultIndex}
            setDefaultIndex={setDefaultIndex}
          >
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
                    {/* <MenuItem display="flex" justifyContent="space-between">
                      <label
                        style={{ fontSize: "14px", fontWeight: "600" }}
                        htmlFor="paymentType"
                      >
                        Payment Type
                      </label>
                      <Checkbox
                        id="paymentType"
                        colorScheme=""
                        icon={<CustomCheckBoxIcon />}
                        isChecked={isCheckedPayment}
                        onChange={() => setCheckedPayment(!isCheckedPayment)}
                      />
                    </MenuItem> */}
                    <MenuDivider />
                    {/* <MenuItem display="flex" justifyContent="space-between">
                      <label
                        style={{ fontSize: "14px", fontWeight: "600" }}
                        htmlFor="active"
                      >
                        Active
                      </label>
                      <Checkbox
                        id="active"
                        colorScheme=""
                        icon={<CustomCheckBoxIcon />}
                        isChecked={isCheckedActive}
                        onChange={() => setCheckedActive(!isCheckedActive)}
                      />
                    </MenuItem> */}
                    {/* <MenuItem display="flex" justifyContent="space-between">
                      <label
                        style={{ fontSize: "14px", fontWeight: "600" }}
                        htmlFor="pending"
                      >
                        Pending
                      </label>
                      <Checkbox
                        id="pending"
                        colorScheme=""
                        icon={<CustomCheckBoxIcon />}
                        isChecked={isCheckedPending}
                        onChange={() => setCheckedPending(!isCheckedPending)}
                      />
                    </MenuItem> */}
                    {/* <MenuItem display="flex" justifyContent="space-between">
                      <label
                        style={{ fontSize: "14px", fontWeight: "600" }}
                        htmlFor="completed"
                      >
                        Completed
                      </label>
                      <Checkbox
                        id="completed"
                        colorScheme=""
                        icon={<CustomCheckBoxIcon />}
                        isChecked={isCheckedCompleted}
                        onChange={() =>
                          setCheckedCompleted(!isCheckedCompleted)
                        }
                      />
                    </MenuItem> */}
                    {/* <MenuDivider /> */}
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
                            moment(e?.target?.value).format("YYYY-MM-DD")
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
                            moment(e?.target?.value).format("YYYY-MM-DD")
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
      <WithdrawFundsModal
        onOpen={onOpen}
        isOpen={isOpen}
        onClose={onClose}
        setSuccess={setSuccess}
        isSuccess={isSuccess}
      />
    </DashboardWrapper>
  );
};

export default Vault;
